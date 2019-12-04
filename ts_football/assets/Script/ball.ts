// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import game_scence from "./game_scence"
const { ccclass, property } = cc._decorator;

@ccclass
export default class ball extends cc.Component {

    @property(game_scence)
    game_scence:game_scence = null;

    private start_x: number;
    private start_y: number;

    private body: cc.RigidBody = null;
    start() {
        this.start_x = this.node.x
        this.start_y = this.node.y
        this.body = this.getComponent(cc.RigidBody)
    }

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve(contact, selfCollider: cc.Collider, otherCollider: cc.Collider) {
        console.log("contact", otherCollider.node.groupIndex)
        if (otherCollider.node.groupIndex === 1) {
            this.node.scale = 0
            this.scheduleOnce(this.reset_white_ball.bind(this), 1)
        }

    }

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider) {
        //入袋
        if (otherCollider.node.groupIndex === 2) {
            this.node.scale = 0
            this.game_scence.score();
            this.scheduleOnce(this.resetGame.bind(this), 1)
        }
    }

    reset_white_ball() {
        this.node.scale = 1
        this.node.x = this.start_x
        this.node.y = this.start_y
        this.body.linearVelocity = cc.v2(0, 0)
        this.body.angularVelocity = 0
       
    }

    resetGame(){
        this.reset_white_ball() 
        this.game_scence.restartGame();
    }

    // update (dt) {}
}
