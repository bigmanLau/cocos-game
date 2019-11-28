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
        value:1
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {
        this.body=this.getComponent(cc.RigidBody)
        this.start_x=this.node.x
        this.start_y=this.node.y
    },
    reset(){
        this.node.active=true
        this.node.x=this.start_x
        this.node.y=this.start_y
        this.body.linearVelocity=cc.v2(0,0)
        this.body.angularVelocity=0
    },

    update (dt) {},
    onBeginContact(contact,selfCollider,otherCollider){
        //如果碰到球袋 返回原来的位置
        if(otherCollider.node.groupIndex===2){
            this.node.active=false;
          
        }
       }
});
