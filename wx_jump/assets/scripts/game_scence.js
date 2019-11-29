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
        player: {
            type: cc.Node,
            default: null
        },
        block_prefab: {
            default: [],
            type: cc.Prefab
        },
        block_root: {
            type: cc.Node,
            default: null
        },
        left_org: cc.v2(0, 0),
        map_root: { //这是game节点 
            type: cc.Node,
            default: null
        },
        check_out: { //这是game节点 
            type: cc.Node,
            default: null
        },
        y_radio:0.5560472 //图片块斜率

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        //随机获取一个block
        this.cur_block = cc.instantiate(this.block_prefab[Math.floor(Math.random() * 3)]);
        this.block_root.addChild(this.cur_block);
        this.cur_block.setPosition(this.block_root.convertToNodeSpaceAR(this.left_org))
        
        //首先获取到当前块的mid节点 然后获取mid节点的世界坐标
        var w_pos = this.cur_block.getChildByName("mid").convertToWorldSpaceAR(cc.v2(0, 0));
        //然后把世界坐标转换到maproot节点坐标系下面
        this.player.setPosition(this.map_root.convertToNodeSpaceAR(w_pos))
        //初始化一下next_block 下一个节点
        this.next_block=this.cur_block;
        this.player_com=this.player.getComponent("player")
        this.block_zorder=-1;
        this.add_block();
    },

    add_block(){
        this.cur_block=this.next_block;

         //随机获取一个block
        this.next_block= cc.instantiate(this.block_prefab[Math.floor(Math.random() * 3)]);
        this.block_root.addChild(this.next_block);
        this.next_block.zIndex=(this.block_zorder)
        this.block_zorder--;
        //设置位置 x轴移动200-400
        var x_distance=200+Math.random()*200;
        var y_distance=x_distance*this.y_radio;
        var next_pos=this.cur_block.getPosition()
        next_pos.x+=x_distance*this.player_com.direction;
        next_pos.y+=y_distance;


        this.next_block.setPosition(next_pos)
        this.player_com.set_next_block(this.next_block.getComponent("block"))
    },
    move_map(offset_x,offset_y){
      var m1=cc.moveBy(0.5,offset_x,offset_y)
      var end_func=cc.callFunc(function(){
          this.add_block()
      }.bind(this))
      var seq=cc.sequence([m1,end_func])
      this.map_root.runAction(seq)
    },
    on_checkout_game(){
          this.check_out.active=true;
    },
    on_game_again(){
        cc.director.loadScene("game_scene")
    }
    // update (dt) {},
});
