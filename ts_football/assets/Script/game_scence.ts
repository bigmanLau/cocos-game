// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import joystick from "./joycontroller"
import websocket from "./websocket"
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(joystick)
    joystick: joystick = null;

    @property(cc.Node)
    players: cc.Node[] = [];

    @property(cc.Node)
    btn: cc.Node = null;

    @property(cc.ProgressBar)
    progressbar: cc.ProgressBar = null;

    @property(cc.Label)
    label: cc.Label = null;


    @property(cc.Node)
    cover_root: cc.Node = null;

    @property(cc.Label)
    cover_tips: cc.Label = null;

    // 当前选中项
    private currentIndex: number = 0;

    private touchStart: boolean = false;
    private groupInfo;




    // 得分
    score() {

        if (this.joystick.node.active !== true) {

            if (this.groupInfo.currentRole === "m") {
                this.sendMsg(JSON.stringify({
                    type: "score",
                    data: {
                        groupName: this.groupInfo.groupName,
                        currentRole: "m"
                    }
                }))

            } else {
                this.sendMsg(JSON.stringify({
                    type: "score",
                    data: {
                        groupName: this.groupInfo.groupName,
                        currentRole: "a"
                    }
                }))
            }

            websocket.action = "score"
        }

    }

    start() {
        this.getGroupInfo();
        this.dealWebsocket()
        this.label.string = "0:0"
        this.dealPlayerData();
        this.dealTouchEvent();
    }

    //获取房间信息
    getGroupInfo() {

        var string = localStorage.getItem("roomInfo");

        var result = JSON.parse(string);
        var type = result.type
        var json = result.data
        if (type === "join_room") {
            this.cover_root.active = false;
        }
        this.groupInfo = json;

        this.changeJoyStickVisibility(json.currentRole === json.whoPlaying)

        for (let i = 0; i < this.players.length; i++) {
            let item = this.players[i]
            if (item.getName().indexOf(json.currentRole) !== -1) {
                item.getChildByName("under").active = true;

            } else {
                item.getChildByName("under").active = false;

            }
        }
        if (json.currentRole === "m") {
            this.currentIndex = 0;
        } else {
            this.currentIndex = 5;
        }
        this.players[this.currentIndex].getChildByName("select").active = true;


    }

    changeJoyStickVisibility(isVisible) {
        this.joystick.node.active = isVisible;
    }

    //处理websocket事件
    dealWebsocket() {
        websocket.onmessage = function (e) {
            var data = JSON.parse(e.data)
            var name
            var currentComp;
            var current;

            switch (data.type) {
                case "move":
                    if (this.groupInfo.groupName === data.data.groupName) {
                        name = data.data.name;
                        for (let i = 0; i < this.players.length; i++) {
                            var item = this.players[i]
                            if (item.getName().indexOf(name) !== -1) {
                                currentComp = this.players[i].getComponent("player")
                                current = item;
                            }
                        }
                        currentComp.ws_run(data.data.dir, data.data.progress)
                        this.changeJoyStickVisibility(this.groupInfo.currentRole === (data.data.whoPlaying === "m" ? "a" : "m"))
                    }
                    break;
                case "rotate":
                    if (this.groupInfo.groupName === data.data.groupName) {
                        name = data.data.name;
                        for (let i = 0; i < this.players.length; i++) {
                            var item = this.players[i]
                            if (item.getName().indexOf(name) !== -1) {
                                currentComp = this.players[i].getComponent("player")
                                current = item;
                            }
                        }
                        current.getChildByName("boy").scaleX = data.data.scaleX;
                    }
                    break;
                case "leave_room":
                        this.cover_tips.string = "玩家离开，游戏结束"
                        this.cover_root.active = true;
                        this.scheduleOnce(function () {
                            cc.director.loadScene("start_game")
                        }.bind(this), 1)
                   
                    break;
                case "score":
                    //得分
                    if (data.data.groupName === this.groupInfo.groupName) {
                        this.label.string = data.data.score
                        //改变房间轮到谁玩
                        this.changeJoyStickVisibility(this.groupInfo.currentRole === data.data.whoPlaying)
                    }
                    break;
                case "join_room":
                    if (data.data.groupName === this.groupInfo.groupName) {
                        this.cover_tips.string = "玩家进入，游戏马上开始"

                        this.scheduleOnce(function () {
                            this.cover_root.active = false;
                        }.bind(this), 1)
                    }

                    break;
            }



        }.bind(this)


    }

    //处理触摸事件
    dealTouchEvent() {

        this.btn.on(cc.Node.EventType.TOUCH_MOVE, function (e) {

            let currentComp = this.players[this.currentIndex].getComponent("player")
            let current = this.players[this.currentIndex]

            if (this.joystick.dir.x > 0) {
                if (current.getName().indexOf("a") !== -1) {
                    current.getChildByName("boy").scaleX = -1;
                } else {
                    current.getChildByName("boy").scaleX = 1;
                }

            } else {
                if (current.getName().indexOf("a") !== -1) {
                    current.getChildByName("boy").scaleX = 1;
                } else {
                    current.getChildByName("boy").scaleX = -1;
                }
            }
            this.sendMsg(JSON.stringify({ type: "rotate", data: { scaleX: current.getChildByName("boy").scaleX, name: current.getName() } }))
            // 显示箭头
            currentComp.setArrowPosition(e, this.joystick.dir);
        }.bind(this), this)


        this.btn.on(cc.Node.EventType.TOUCH_START, function (e) {
            //如果房间轮到自己玩 就接受触摸事件

            this.touchStart = true;
            let currentComp = this.players[this.currentIndex].getComponent("player")
            let current = this.players[this.currentIndex]


            // 显示箭头
            currentComp.changeViewVisible(true)
            currentComp.setArrowPosition(e, this.joystick.dir);

        }.bind(this), this)

        this.btn.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            let currentComp = this.players[this.currentIndex].getComponent("player")
            let current = this.players[this.currentIndex]
            //隐藏箭头
            currentComp.changeViewVisible(false)
            currentComp.runTo(current.getPosition(), this.progressbar.progress)

            this.touchStart = false;
        }.bind(this), this)

        this.btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            let currentComp = this.players[this.currentIndex].getComponent("player")
            let current = this.players[this.currentIndex]
            //隐藏箭头
            currentComp.changeViewVisible(false)
            currentComp.runTo(currentComp.arrow.getPosition(), this.progressbar.progress)
            this.touchStart = false;
        }.bind(this), this)
    }

    dealPlayerData() {
        for (let i = 0; i < this.players.length; i++) {
            let item = this.players[i]
            item.getComponent(cc.PhysicsBoxCollider).restitution = 0;
            item.on(cc.Node.EventType.TOUCH_START, function () {
                if (item.getChildByName("under").active === true) {
                    this.resetPlayers();
                    item.getChildByName("select").active = true;
                    this.currentIndex = i;
                }

            }.bind(this), this)

        }
    }

    //重置选中三角状态
    resetPlayers() {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].getChildByName("select").active = false;
        }
    }

    update(dt) {
        if (this.touchStart) {
            let currentComp = this.players[this.currentIndex].getComponent("player")
            this.progressbar.progress = currentComp.progress_bar.progress
        } else {
            this.progressbar.progress = 0
        }

    }

    restartGame() {

        for (var i = 0; i < this.players.length; i++) {
            this.players[i].getComponent("player").reset_player();
        }
    }

    //websocket发送消息
    sendMsg(data) {
        websocket.send_data(data)
    }

    leave_room() {
        cc.director.loadScene("start_game")
    }
}
