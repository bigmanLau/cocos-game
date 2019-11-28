// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import joystick from "./joystick"
const { ccclass, property } = cc._decorator;

@ccclass
export default class ball_ctrl extends cc.Component {

    @property(joystick)
    stick: joystick = null;

    @property
    speed: number = 200;

    @property(cc.Node)
    camera: cc.Node = null;

    private body: cc.RigidBody = null;
    //摄像机距离坦克的偏移
    private offset: cc.Vec2 = cc.v2(0, 0)

    onLoad() {
        this.body = this.getComponent(cc.RigidBody)
    }

    start() {
        //CAMERA-->TANK
        if (this.camera !== null) {
            this.offset = this.camera.getPosition().sub(this.node.getPosition())
        }
    }

    update(dt) {
        if (this.camera !== null) {
           this.camera.x=this.node.x+this.offset.x;
           this.camera.y=this.node.y+this.offset.y;
        }


        if (this.stick.dir.x === 0 && this.stick.dir.y === 0) {
            this.body.linearVelocity = cc.v2(0, 0)
            return
        }
        var vx: number = this.speed * this.stick.dir.x;
        var vy: number = this.speed * this.stick.dir.y;
        this.body.linearVelocity = cc.v2(vx, vy);

        var r: number = Math.atan2(this.stick.dir.y, this.stick.dir.x)
        var degree = r * 180 / Math.PI;
        degree = 360 - degree;
        degree += 90;

        this.node.rotation = degree;
    }
}
