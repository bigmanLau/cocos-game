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

@ccclass
export default class enable_phy extends cc.Component {

    @property(cc.Vec2)
    gravity: cc.Vec2 = cc.v2(0, -320);//引擎默认重力

    @property
    is_debug: boolean = false;

    // LIFE-CYCLE CALLBACKS:
    // 开启物理引擎 一定要写在onload
    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = this.gravity;
        var Bits = cc.PhysicsManager.DrawBits;
        if(this.is_debug){
        cc.director.getPhysicsManager().debugDrawFlags = Bits.e_aabbBit |
            Bits.e_pairBit |
            Bits.e_centerOfMassBit |
            Bits.e_jointBit |
            Bits.e_shapeBit;
        }else{
        // disable debug draw info
        cc.director.getPhysicsManager().debugDrawFlags = 0;
    }
    }

    start() {

    }

    // update (dt) {}
}
