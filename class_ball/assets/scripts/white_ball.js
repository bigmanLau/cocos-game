// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        cue: {
            type: cc.Node,
            default: null
        },
        min_dis: 20
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.body=this.getComponent(cc.RigidBody)
        this.start_x=this.node.x
        this.start_y=this.node.y
        this.cue_instan = this.cue.getComponent("cue")

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            var w_pos = e.getLocation();
            var dst = this.node.parent.convertToNodeSpaceAR(w_pos)
            var src = this.node.getPosition();
            var dir = dst.sub(src);
            var len = dir.mag();

            if (len < this.min_dis) {
                this.cue.active = false;
                return;
            }
            this.cue.active = true;

            var r = Math.atan2(dir.y, dir.x)
            var degree = r * 180 / Math.PI
            degree = 360 - degree;
            this.cue.rotation = degree;

            var cue_pos = dst;
            var cue_length_half = this.cue.width * 0.5;

            cue_pos.x += cue_length_half * dir.x / len;
            cue_pos.y += cue_length_half * dir.y / len;

            this.cue.setPosition(cue_pos);

        }.bind(this), this)

        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {
           
            if (this.cue.active === false) {
                return;
            }
            this.cue_instan.shoot_at(this.node.getPosition())
        }.bind(this), this)

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            
            if (this.cue.active === false) {
                return;
            }
            this.cue_instan.shoot_at(this.node.getPosition())

        }.bind(this), this)
    },
    reset_white_ball(){
        this.node.scale=1
        this.node.x=this.start_x
        this.node.y=this.start_y
        this.body.linearVelocity=cc.v2(0,0)
        this.body.angularVelocity=0
        
    },
    onBeginContact(contact,selfCollider,otherCollider){
        //如果碰到球袋 返回原来的位置
        if(otherCollider.node.groupIndex===2){
            this.node.scale=0
            this.scheduleOnce(this.reset_white_ball.bind(this),1)
        }
       }

    // update (dt) {},
});
