// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
//摇杆代码
@ccclass
export default class joycontroller extends cc.Component {

    @property(cc.Node)
    stick: cc.Node = null;

    private max_R: number = 80
    private min_R = 20
    private dir: cc.Vec2 = null

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        //摇杆方向
        this.dir = cc.v2(0, 0)
        this.stick.on(cc.Node.EventType.TOUCH_START, function (e) { }.bind(this), this)
        this.stick.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            var screen_pos = e.getLocation();
            var pos = this.node.convertToNodeSpaceAR(screen_pos);
            var len = pos.mag();
            this.dir.x = pos.x / len; //cos
            this.dir.y = pos.y / len;  //sin

            if (len < this.min_R) {
                this.stick.setPosition(pos);
                return;
            }
            if (len > this.max_R) {
                pos.x = pos.x * this.max_R / len;
                pos.y = pos.y * this.max_R / len;
            }
            this.stick.setPosition(pos);
        }.bind(this), this)
        this.stick.on(cc.Node.EventType.TOUCH_END, function (e) {
            this.stick.setPosition(cc.v2(0, 0));
            this.dir = cc.v2(0, 0)
        }.bind(this), this)
        this.stick.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            this.stick.setPosition(cc.v2(0, 0));
            this.dir = cc.v2(0, 0)
        }.bind(this), this)
    }

    // update (dt) {}
}
