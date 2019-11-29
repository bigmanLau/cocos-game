// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var game_scence = require("game_scence")
cc.Class({
    extends: cc.Component,

    properties: {
        init_speed: 150,
        a_power: 600,
        y_radio: 0.5560472, //图片块斜率
        game_manager: {
            type: game_scence,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.next_block = null;
        this.direction = 1;//1向右
    },
    set_next_block(block) {
        this.next_block = block;
    },
    start() {
       

        this.rol_node = this.node.getChildByName("rotate")
        this.animate_node = this.rol_node.getChildByName("anim")
        //是否在加力
        this.is_power_mode = false;
        this.speed = 0;
        this.x_distance = 0;
        this.animate_node.on(cc.Node.EventType.TOUCH_START, function (e) {
            this.is_power_mode = true;
            this.x_distance = 0;
            this.speed = this.init_speed;
            this.animate_node.stopAllActions();
            this.animate_node.runAction(cc.scaleTo(2, 1, 0.5))
        }.bind(this), this)

        this.animate_node.on(cc.Node.EventType.TOUCH_END, function (e) {
            this.is_power_mode = false;
            this.animate_node.stopAllActions();
            this.animate_node.runAction(cc.scaleTo(0.5, 1, 1))

            this.player_jump();
        }.bind(this), this)

        this.animate_node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            this.is_power_mode = false;
            this.animate_node.stopAllActions();
            this.animate_node.runAction(cc.scaleTo(0.5, 1, 1))

            this.player_jump();
        }.bind(this), this)
    },
    player_jump() {
        var x_distance = this.x_distance*this.direction;
        var y_distance = this.x_distance * this.y_radio;

        var target_pos = this.node.getPosition();
        target_pos.x += x_distance;
        target_pos.y += y_distance;

        this.rol_node.runAction(cc.rotateBy(0.5, 360*this.direction))


        //把game节点坐标系下面的目标坐标转化成世界坐标
        var w_pos = this.node.parent.convertToWorldSpaceAR(target_pos)
        var is_game_over = false;
        if (this.next_block.jump_on_block(w_pos, this.direction)) {
            target_pos = this.node.parent.convertToNodeSpaceAR(w_pos)//target_pos就变成了参考点的位置
        } else {
            is_game_over = true;
        }

        var j = cc.jumpTo(0.5, target_pos, 200, 1)

        this.direction = Math.random() < 0.5 ? -1 : 1;

        var end_func = cc.callFunc(function () {
            if (is_game_over) {
                this.game_manager.on_checkout_game();
            } else {
                if (this.direction === 1) {
                    this.game_manager.move_map(180 - w_pos.x, -y_distance);
                } else {
                    this.game_manager.move_map(580 - w_pos.x, -y_distance);
                }
            }

        }.bind(this))

        var seq = cc.sequence(j, end_func)
        this.node.runAction(seq)

    },

    update(dt) {
        if (this.is_power_mode) {
            this.speed += this.a_power * dt;
            this.x_distance += this.speed * dt;

        }
    },
});
