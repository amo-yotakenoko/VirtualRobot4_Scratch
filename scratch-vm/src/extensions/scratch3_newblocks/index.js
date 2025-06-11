const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const virtualrobot_send = require('../../util/virtualrobot_send');
class Scratch3NewBlocks {
    constructor(runtime) {
        this.runtime = runtime;

        this.socket = null;
        this.response = {};
        this.id = 0;
        this.virtualQueueCount = 0;
        this.httpURL = "http://localhost:8080/";
        setInterval(() => {
            if (this.virtualQueueCount > 0) {

                this.virtualQueueCount--;
                console.log(this.virtualQueueCount)
            }

        }, 30);

        this.pressedKeys = new Set();

        document.addEventListener('keydown', (event) => {
            this.pressedKeys.add(event.key.toLowerCase());
        });

        document.addEventListener('keyup', (event) => {
            this.pressedKeys.delete(event.key.toLowerCase());
        });
    }

    getInfo() {
        return {
            id: 'newblocks',
            name: 'New Blocks',
            blocks: [

                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: 'webSocketで接続[URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: "ws://localhost:12345"
                        },

                    }
                },
                {
                    opcode: 'connectHttp',
                    blockType: BlockType.COMMAND,
                    text: 'HTTPで接続[URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: "http://localhost:8080/"
                        },

                    }
                },
                {
                    opcode: 'readyState',
                    blockType: BlockType.REPORTER,
                    text: 'webSocketの接続状態',
                    arguments: {


                    }
                },

                {
                    opcode: 'morter',
                    blockType: BlockType.COMMAND,
                    text: 'モーター[KEY]のパワーを[VALUE]にする',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "A"
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "0"
                        }
                    }
                },
                {
                    opcode: 'servo',
                    blockType: BlockType.COMMAND,
                    text: 'サーボモーター[KEY]を[VALUE]°にする',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "A"
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "0"
                        }
                    }
                },
                {
                    opcode: 'intensity',
                    blockType: BlockType.COMMAND,
                    text: 'ライト[KEY]の明るさを[VALUE]にする',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "A"
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "0"
                        }
                    }
                },

                {
                    opcode: 'keyGet',
                    blockType: BlockType.BOOLEAN,
                    text: '[KEY]キーが押された',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "a"
                        }
                    }
                },
                {
                    opcode: 'distance',
                    blockType: BlockType.REPORTER,
                    text: '距離センサ[KEY]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "distance"
                        }
                    }
                },
                {
                    opcode: 'set',
                    blockType: BlockType.COMMAND,
                    text: 'Key:[KEY]=[VALUE]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "A"
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "0"
                        }
                    }
                },
                {
                    opcode: 'get',
                    blockType: BlockType.REPORTER,
                    text: 'Key:[KEY]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "sensor"
                        }
                    }
                },
                {
                    opcode: 'teleport',
                    blockType: BlockType.COMMAND,
                    text: 'テレポート([X],[Y],[Z])',
                    arguments: {

                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "0"
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "0"
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "0"
                        }
                    }
                },

                {
                    opcode: 'VRgetFloat',
                    blockType: BlockType.REPORTER,
                    text: 'VRコントローラー[DEVICE]の[KEY]',
                    arguments: {

                        DEVICE: {
                            type: ArgumentType.STRING,
                            menu: 'deviceMenu'
                        },
                        KEY: {
                            type: ArgumentType.STRING,
                            menu: 'keyMenuFloat'
                        },
                    }
                },

                {
                    opcode: 'VRgetBool',
                    blockType: BlockType.BOOLEAN,
                    text: 'VRコントローラー[DEVICE]の[KEY]',
                    arguments: {

                        DEVICE: {
                            type: ArgumentType.STRING,
                            menu: 'deviceMenu'
                        },
                        KEY: {
                            type: ArgumentType.STRING,
                            menu: 'keyMenuBool'
                        },
                    }
                },

                // {
                //     opcode: 'hat',
                //     blockType: BlockType.HAT,
                //     text: 'Key:[KEY]==[VALUE]',
                //     arguments: {
                //         KEY: {
                //             type: ArgumentType.STRING,
                //             defaultValue: "sensor"
                //         },
                //         VALUE: {
                //             type: ArgumentType.STRING,
                //             defaultValue: "1"
                //         }
                //     }
                // }
            ],
            menus: {
                deviceMenu: {
                    acceptReporters: false,
                    items: ['右', '左']
                },
                keyMenuFloat: {
                    acceptReporters: false,
                    items: ['Trigger', 'Grip']
                },
                keyMenuBool: {
                    acceptReporters: false,
                    items: ['GripButton',
                        'MenuButton',
                        'PrimaryButton',
                        ' PrimaryTouch',
                        'SecondaryButton',
                        'SecondaryTouch',
                        'TriggerButton',
                        'TriggerTouch',
                        ' Primary2DAxisClick',
                        'Primary2DAxisTouch',
                        'ThumbrestTouch',
                        'DeviceIsTracked',
                        'PointerIsTracked',
                        'IsTracked'

                    ]
                }

            }
        };
    }

    connectHttp(args) {
        if (this.socket != null)
            this.socket.close();

        this.socket = null;
        this.httpURL = args.URL;
    }

    connect(args) {
        this.socket = new WebSocket(args.URL);


        this.socket.onopen = () => {

            this.socket.send('Scratchから接続しました');
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(event.data);

                if ("queueCount" in data) {
                    console.log("キューカウント" + data["queueCount"])
                    this.queueCount = data["queueCount"];
                }

                if ("value" in data) {
                    if (data.value === "True") data.value = true;
                    if (data.value === "False") data.value = false;

                    console.log(data.id, data.value);


                    this.response[data.id] = data.value;
                    console.log(this.response);

                }
            } catch (error) {
                console.error("Error handling WebSocket message:", error, event.data);
            }
        };

        // エラーが発生した時の処理
        this.socket.onerror = (error) => {
            console.error('WebSocket Error: ', error);
        };

        // サーバーとの接続が閉じられた時の処理
        this.socket.onclose = () => {
            console.log('Connection closed');
        };


    }

    readyState(args) {
        if (this.socket == null) {
            return "-1";
        }
        return this.socket.readyState

    }

    set(args) {
        const message = {
            type: "set",
            key: args.KEY,
            value: args.VALUE,
            id: this.id++

        };
        console.log("送信", JSON.stringify(message))

        return this.sendMessage(message)
    }

    async teleport(args) {
        const message = {
            type: "teleport",
            x: parseInt(args.X, 10),
            y: parseInt(args.Y, 10),
            z: parseInt(args.Z, 10),
            id: this.id++
        };

        const result = await this.sendMessage(message);

        await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待つ

        return result;
    }

    sendMessage(message) {
        if (this.readyState() == 1) {
            return new Promise(async (resolve) => {



                console.log(message);
                console.log("this.virtualQueueCount", this.virtualQueueCount);
                while (this.virtualQueueCount > 10) {
                    console.log("送りすぎ", this.virtualQueueCount);
                    await new Promise(r => setTimeout(r, 10)); // 0.1秒待機
                }

                this.virtualQueueCount += 1;
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify(message));
                }

                resolve();
            });
        } else {


            return fetch(this.httpURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                    return data.value; // 呼び出し元に返す
                })
                .catch(error => {
                    console.error('Fetch Error:', error);
                    throw error; // 呼び出し元でエラー処理可能に
                });
        }

    }





    morter(args) {

        return this.set({ ...args, KEY: args.KEY + ".power" })
    }
    servo(args) {

        return this.set({ ...args, KEY: args.KEY + ".angle" })
    }

    intensity(args) {

        return this.set({ ...args, KEY: args.KEY + ".intensity" })
    }


    async get(args) {
        const message = {
            type: "get",
            key: args.KEY,
            id: this.id++
        };
        if (this.readyState(args) == 1) {
            console.log(message);
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify(message));
            }


            let startTime = performance.now(); // 現在の時間を取得
            while (performance.now() - startTime < 1000) { // 1秒間繰り返す

                await new Promise(resolve => {
                    requestAnimationFrame(resolve); // 次のフレームを待つ
                });
                if (message.id in this.response) {
                    const value = this.response[message.id];
                    delete this.response[message.id];
                    console.log("value:", value);
                    return value;
                }
            }

            return "-1";
        } else {


            console.log("送信", JSON.stringify(message))

            return fetch(this.httpURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message),
                cache: 'no-store'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                    return data.value; // 呼び出し元に返す
                })
                .catch(error => {
                    console.error('Fetch Error:', error);
                    throw error; // 呼び出し元でエラー処理可能に
                });
        }
    }

    keyGet(args) {

        const key = args.KEY.toLowerCase();
        const pressedKeys = this.pressedKeys.has(key);

        if (pressedKeys === true) {
            return true;
        }

        return this.get({ ...args, KEY: "key." + args.KEY })
    }

    distance(args) {

        const key = args.KEY.toLowerCase();
        const pressedKeys = this.pressedKeys.has(key);

        if (pressedKeys === true) {
            return true;
        }

        return this.get({ ...args, KEY: args.KEY + ".distance" })
    }

    VRgetFloat(args) {
        if (args.DEVICE == "右")
            args.DEVICE = "VRright";
        if (args.DEVICE == "左")
            args.DEVICE = "VRleft";
        return this.get({ ...args, KEY: args.DEVICE + "." + args.KEY })
    }

    VRgetBool(args) {
        if (args.DEVICE == "右")
            args.DEVICE = "VRright";
        if (args.DEVICE == "左")
            args.DEVICE = "VRleft";
        return this.get({ ...args, KEY: args.DEVICE + "." + args.KEY })
    }



    hat(args) {
        return this.sig[args.KEY] == args.VALUE;
    }
}





module.exports = Scratch3NewBlocks;