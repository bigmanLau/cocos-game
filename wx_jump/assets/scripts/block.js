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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.mid = this.node.getChildByName("mid")
        this.left = this.node.getChildByName("left")
        this.right = this.node.getChildByName("right")
        this.up = this.node.getChildByName("up")
        this.down = this.node.getChildByName("down")
    },
    //dir=1 右边跳跃 dir=-1 左边跳跃
    jump_on_block(w_dst_pos, direction) {
        var mid_pos = this.mid.convertToWorldSpaceAR(cc.v2(0, 0))
        var dir = w_dst_pos.sub(mid_pos);
        //先和中间那个点对比 
        var min_len = dir.mag();
        var min_pos = mid_pos;

        if (direction === 1) {
            //然后依次和上下两个点对比距离找出最近的点
            var up_pos = this.up.convertToWorldSpaceAR(cc.v2(0, 0))
            dir = w_dst_pos.sub(up_pos);
            var len = dir.mag()
            if (min_len > len) {
                min_len = len;
                mid_pos = up_pos
            }

            var down_pos = this.down.convertToWorldSpaceAR(cc.v2(0, 0))
            dir = w_dst_pos.sub(down_pos);
            var len = dir.mag()
            if (min_len > len) {
                min_len = len;
                mid_pos = down_pos
            }
        } else {
            //依次和左右进行对比距离找出最近的点
            var left_pos = this.left.convertToWorldSpaceAR(cc.v2(0, 0))
            dir = w_dst_pos.sub(left_pos);
            var len = dir.mag()
            if (min_len > len) {
                min_len = len;
                mid_pos = left_pos
            }

            var right_pos = this.right.convertToWorldSpaceAR(cc.v2(0, 0))
            dir = w_dst_pos.sub(right_pos);
            var len = dir.mag()
            if (min_len > len) {
                min_len = len;
                mid_pos = right_pos
            }
        }

        //找到最近的参考点位置 参考点和最近点的距离
        dir=w_dst_pos.sub(min_pos);
        if(dir.mag()<100){
            w_dst_pos.x=min_pos.x;
            w_dst_pos.y=min_pos.y;
            return true;
        }
        return false;

    }

    // update (dt) {},
});
