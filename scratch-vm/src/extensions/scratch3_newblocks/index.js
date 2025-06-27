const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const virtualrobot_send = require('../../util/virtualrobot_send');
const translation = require('./translation.js');

const DEFAULT_MOTOR_OPTIONS = [
    ['A', 'A'],
    ['B', 'B'],
    ['C', 'C']
];

const formatMessage = require('format-message');

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


        this.devicesList = [['読み込み中...', 'loading']];
        this.rawDevicesList = [];
        this.updateDevicesList();


    }
    async updateDevicesList(args) {
        try {
            const robotInfo = await this.get({ KEY: "info" });
            const devices = JSON.parse(robotInfo).devices;
            this.rawDevicesList = devices;
            this.devicesList = [...new Set(devices.map(d => d.name))]
                .map(name => ([name, name]));
            console.log("デバイスリストを再読み込み:", this.devicesList);
            this.runtime.requestBlocksUpdate();
            return devices.length;
        } catch (err) {
            this.devicesList = [['未取得', 'none']];
            console.error("再読み込み失敗:", err);
            this.runtime.requestBlocksUpdate();
            return 0;
        }
    }



    getInfo() {






        return {
            id: 'newblocks',
            name: translation({

                en: 'VirtualRobot4(by takenoko)'
            }),
            blocks: [
                {
                    opcode: 'updateDevicesList',
                    blockType: BlockType.COMMAND,
                    text: translation({
                        ja: 'デバイスメニューを再読み込み',
                        en: 'Refresh device menu'
                    })
                },
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: translation({
                        ja: 'webSocketで接続[URL]',
                        en: 'Connect via WebSocket [URL]'
                    }),

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
                    text: translation({
                        ja: 'HTTPで接続[URL]',
                        en: 'Connect via HTTP [URL]'
                    }),
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

                    text: translation({
                        ja: 'webSocketの接続状態',
                        en: 'WebSocket connection state'
                    }),
                    arguments: {


                    }
                },

                {
                    opcode: 'morter',
                    blockType: BlockType.COMMAND,

                    text: translation({
                        ja: 'モーター[KEY]のパワーを[VALUE]にする',
                        en: 'Set motor [KEY] power to [VALUE]'
                    }),
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            menu: 'moterMenu'
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "0"
                        }
                    }
                },


                // {
                //     opcode: 'morter',
                //     blockType: BlockType.COMMAND,
                //
                //     text: translation({
                //         ja: 'モーター[KEY]のパワーを[VALUE]にする',
                //         en: 'Set motor [KEY] power to [VALUE]'
                //     }),
                //     arguments: {
                //         KEY: {
                //             type: ArgumentType.STRING,
                //             defaultValue: "A"
                //         },
                //         VALUE: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: "0"
                //         }
                //     }
                // },
                {
                    opcode: 'servo',
                    blockType: BlockType.COMMAND,

                    text: translation({
                        ja: 'サーボモーター[KEY]を[VALUE]°にする',
                        en: 'Set servo [KEY] to [VALUE]°'
                    }),
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            menu: 'servoMenu'
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

                    text: translation({
                        ja: 'ライト[KEY]の明るさを[VALUE]にする',
                        en: 'Set light [KEY] brightness to [VALUE]'
                    }),
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            menu: 'intensityMenu'
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

                    text: translation({
                        ja: '[KEY]キーが押された',
                        en: 'Key [KEY] pressed?'
                    }),
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

                    text: translation({
                        ja: '距離センサ[KEY]',
                        en: 'Distance sensor [KEY]'
                    }),
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            menu: 'distanceMenu'
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

                    text: translation({
                        ja: 'テレポート([X],[Y],[Z])',
                        en: 'Teleport to ([X],[Y],[Z])'
                    }),
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

                    text: translation({
                        ja: 'VRコントローラー[DEVICE]の[KEY]',
                        en: 'VR controller [DEVICE] [KEY] (float)'
                    }),
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

                    text: translation({
                        ja: 'VRコントローラー[DEVICE]の[KEY]',
                        en: 'VR controller [DEVICE] [KEY] (boolean)'
                    }),
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
                {
                    opcode: 'activeViewproperty',
                    blockType: BlockType.COMMAND,

                    text: translation({
                        ja: '情報の表示を[ISACTIVE]にする',
                        en: 'Set info display to [ISACTIVE]'
                    }),
                    arguments: {

                        ISACTIVE: {
                            type: BlockType.BOOLEAN,

                            menu: 'isActiveMenu'
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
                moterMenu: {
                    items: () => this.getDeviceMenu('motor')
                },

                servoMenu: {
                    items: () => this.getDeviceMenu('servo')
                },

                intensityMenu: {
                    items: () => this.getDeviceMenu('light')
                },

                distanceMenu: {
                    items: () => this.getDeviceMenu('distance')
                },


                deviceMenu: {
                    acceptReporters: true,
                    items: [
                        { text: translation({ ja: '右', en: 'Right' }), value: 'VRright' },
                        { text: translation({ ja: '左', en: 'Left' }), value: 'VRleft' }
                    ]
                },
                isActiveMenu: {
                    acceptReporters: false,
                    items: [
                        { text: translation({ ja: '表示', en: 'Show' }), value: '1' },
                        { text: translation({ ja: '非表示', en: 'Hide' }), value: '0' },


                    ]
                },
                keyMenuFloat: {
                    acceptReporters: true,
                    items: [translation({ ja: 'トリガー(Trigger)', en: 'Trigger' }), translation({ ja: 'グリップ(Grip)', en: 'Grip' })]
                },
                keyMenuBool: {
                    acceptReporters: true,
                    items: [
                        { text: translation({ ja: 'グリップボタン (Grip Button)', en: 'Grip Button' }), value: 'gripButton' },
                        { text: translation({ ja: 'メニューボタン (Menu Button)', en: 'Menu Button' }), value: 'menuButton' },
                        { text: translation({ ja: 'プライマリーボタン (Primary Button)', en: 'Primary Button' }), value: 'primaryButton' },
                        { text: translation({ ja: 'プライマリートッチ (Primary Touch)', en: 'Primary Touch' }), value: 'primaryTouch' },
                        { text: translation({ ja: 'セカンダリーボタン (Secondary Button)', en: 'Secondary Button' }), value: 'secondaryButton' },
                        { text: translation({ ja: 'セカンダリートッチ (Secondary Touch)', en: 'Secondary Touch' }), value: 'secondaryTouch' },
                        { text: translation({ ja: 'トリガーボタン (Trigger Button)', en: 'Trigger Button' }), value: 'triggerButton' },
                        { text: translation({ ja: 'トリガートッチ (Trigger Touch)', en: 'Trigger Touch' }), value: 'triggerTouch' },
                        { text: translation({ ja: 'プライマリ2D軸クリック (Primary 2D Axis Click)', en: 'Primary 2D Axis Click' }), value: 'primary2DAxisClick' },
                        { text: translation({ ja: 'プライマリ2D軸トッチ (Primary 2D Axis Touch)', en: 'Primary 2D Axis Touch' }), value: 'primary2DAxisTouch' },
                        { text: translation({ ja: 'サムレストトッチ (Thumbrest Touch)', en: 'Thumbrest Touch' }), value: 'thumbrestTouch' },
                        { text: translation({ ja: 'デバイス追跡中 (Device Is Tracked)', en: 'Device Is Tracked' }), value: 'deviceIsTracked' },
                        { text: translation({ ja: 'ポインター追跡中 (Pointer Is Tracked)', en: 'Pointer Is Tracked' }), value: 'pointerIsTracked' },
                        { text: translation({ ja: '追跡中 (Is Tracked)', en: 'Is Tracked' }), value: 'isTracked' },
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
        // if (args.DEVICE == "right")
        //     args.DEVICE = "VRright";
        // if (args.DEVICE == "left")
        //     args.DEVICE = "VRleft";
        return this.get({ ...args, KEY: args.DEVICE + "." + args.KEY })
    }

    VRgetBool(args) {
        // if (args.DEVICE == "right")
        //     args.DEVICE = "VRright";
        // if (args.DEVICE == "left")
        //     args.DEVICE = "VRleft";
        return this.get({ ...args, KEY: args.DEVICE + "." + args.KEY })
    }

    activeViewproperty(args) {
        const message = {
            type: "set",
            key: "activeViewproperty",
            value: args.ISACTIVE,
            id: this.id++

        };
        console.log("送信", JSON.stringify(message))

        return this.sendMessage(message)
    }




    getDeviceMenu(deviceType) {
        console.log("getDeviceMenu called. rawDevicesList:", this.rawDevicesList);
        if (this.rawDevicesList && this.rawDevicesList.length > 0) {
            const filteredDevices = this.rawDevicesList.filter(device => device.type === deviceType);
            if (filteredDevices.length > 0) {
                return filteredDevices.map(device => ([device.name, device.name]));
            }
        }
        return DEFAULT_MOTOR_OPTIONS;
    }

    hat(args) {
        return this.sig[args.KEY] == args.VALUE;
    }
}





module.exports = Scratch3NewBlocks;