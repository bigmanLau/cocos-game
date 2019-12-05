// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import websocket from "./websocket"
const { ccclass, property } = cc._decorator;

@ccclass
export default class start_game extends cc.Component {

 



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.dealWebsocket();
        this.node.on("sendmsg", function (data) {
            console.log("[sendmsg]", data)
            this.wx.send(data)
        }.bind(this));
    }

    //处理websocket事件
    dealWebsocket() {

        websocket.connect('wss://www.bigmantech.cn/websocket');
        websocket.onopen = function (e) {
            console.log("连接上了", e)
        }.bind(this)

        websocket.onclose = function (e) {
            console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
            console.log(e)
        }
        websocket.onmessage = function (e) {
            var data = JSON.parse(e.data)

            switch (data.type) {
                case "move":
                case "rotate":

                    break;
                case "create_room":
                    if (websocket.action === "create_room") {
                        //创建房间 
                        localStorage.setItem("roomInfo", JSON.stringify(data))
                        if(cc.director.isPaused)
                        cc.director.loadScene("game_scence")
                    }
                    break;
                case "join_room":
                    if (websocket.action === "join_room") {
                        //加入房间 
                        localStorage.setItem("roomInfo", JSON.stringify(data))
                        cc.director.loadScene("game_scence")
                    }
                    break;
            }



        }.bind(this)
    }


    join_room() {
        websocket.action = "join_room"
        websocket.send_data(JSON.stringify({ type: "join_room" }))
    }

    create_room() {
        websocket.action = "create_room"
        websocket.send_data(JSON.stringify({ type: "create_room" }))
    }

    // update (dt) {}
}
