const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const virtualrobot_send = require('../../util/virtualrobot_send');
class Scratch3NewBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        // this.sig = {};
        this.socket = null;
        this.response = {};
        this.id = 0;
        this.virtualQueueCount = 0;
        setInterval(() => {
            if (this.virtualQueueCount > 0) {

                this.virtualQueueCount--;
                console.log(this.virtualQueueCount)
            }

        }, 30);
    }

    getInfo() {
        return {
            id: 'newblocks',
            name: 'New Blocks',
            blocks: [

                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: '接続[URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: "ws://localhost:12345"
                        },

                    }
                },
                {
                    opcode: 'readyState',
                    blockType: BlockType.REPORTER,
                    text: '接続状態',
                    arguments: {


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
                    opcode: 'hat',
                    blockType: BlockType.HAT,
                    text: 'Key:[KEY]==[VALUE]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "sensor"
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: "1"
                        }
                    }
                }
            ],
            menus: {}
        };
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

                if ("result" in data) {
                    if (data.result === "True") data.result = true;
                    if (data.result === "False") data.result = false;

                    console.log(data.id, data.result);


                    this.response[data.id] = data.result;
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
        return new Promise(async (resolve) => {
            console.log(args);

            const message = {
                type: "set",
                key: args.KEY,
                value: args.VALUE,
                id: this.id++
            };

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
    }

    morter(args) {

        return this.set({ ...args, KEY: args.KEY + ".power" })
    }


    async get(args) {

        const message = {
            type: "get",
            key: args.KEY,
            id: this.id++
        };
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
    }

    keyGet(args) {


        return this.get({ ...args, KEY: "key." + args.KEY })
    }



    hat(args) {
        return this.sig[args.KEY] == args.VALUE;
    }
}





module.exports = Scratch3NewBlocks;