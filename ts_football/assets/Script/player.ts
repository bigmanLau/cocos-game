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
import websocket from "./websocket";
const { ccclass, property } = cc._decorator;

@ccclass
export default class player extends cc.Component {

     @property(cc.Node)
     arrow: cc.Node = null;

     @property(cc.ProgressBar)
     progress_bar: cc.ProgressBar = null;

     @property(game_scence)
     game_scence: game_scence = null;

     // LIFE-CYCLE CALLBACKS:
     //箭头离人物距离
     private arrow_to_player_distance: number = 60
     //人物初始速度
     private shoot_power: number = 3000;

     private isReverse: boolean = false;
     private body: cc.RigidBody = null;

     //运行方向
     private run_dir: cc.Vec2 = cc.v2(0, 0)
     // onLoad () {}
     private start_x: number;
     private start_y: number;

     start() {
          this.body = this.getComponent(cc.RigidBody)
          this.start_x = this.node.x;
          this.start_y = this.node.y;
          //  this.dealTouchEvent();

     }

     //处理触摸事件
     // dealTouchEvent(){

     //      this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
     //           // 显示箭头
     //           this.setArrowPosition(e);
     //      }.bind(this), this)


     //      this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
     //          // 显示箭头
     //          this.changeViewVisible(true)
     //          this.setArrowPosition(e);
     //      }.bind(this), this)

     //      this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
     //           //隐藏箭头
     //           this.changeViewVisible(false)
     //           this.runTo(this.node.getPosition())
     //      }.bind(this), this)

     //      this.node.on(cc.Node.EventType.TOUCH_END, function (e) {
     //           //隐藏箭头
     //           this.changeViewVisible(false)
     //           this.runTo(this.arrow.getPosition())
     //      }.bind(this), this)
     // }

     //设置箭头方向
     setArrowPosition(e, dir) {
          var w_pos = e.getLocation();
          var dst = this.node.parent.convertToNodeSpaceAR(w_pos)
          //获取子节点在父节点坐标系中的位置
          var src = this.node.getPosition();

          var len = dir.mag();


          //计算角度
          var r = Math.atan2(dir.y, dir.x)
          var degree = r * 180 / Math.PI;



          degree = 360 - degree;

          this.arrow.angle = -degree;

          var arrow_pos = dst;
          arrow_pos.x = this.arrow_to_player_distance * dir.x / len;
          arrow_pos.y = this.arrow_to_player_distance * dir.y / len;
          //设置子节点在父节点坐标系中的位置
          this.arrow.setPosition(arrow_pos)
          this.run_dir = dir
     }



     //朝着一个方向奔跑
     runTo(aa, progress) {
          //发送消息给服务器

          var len = this.run_dir.mag();
          var current_progress = progress;


          var power_x = this.shoot_power * current_progress * this.run_dir.x / len;
          var power_y = this.shoot_power * current_progress * this.run_dir.y / len;

          console.log("[power_x1]", power_x)
          console.log("[power_y1]", power_y)
          //用下面这个方法有问题
          // this.body.applyLinearImpulse(cc.v2(power_x, power_y),
          //      this.node.convertToWorldSpaceAR(cc.v2(0, 0)), true)

          this.body.linearVelocity = cc.v2(power_x, power_y)

          this.game_scence.sendMsg(JSON.stringify({
               type: "move",
               data: {
                    dir: this.run_dir,
                    progress: progress,
                    name: this.node.getName(),
                    whoPlaying: this.node.getName().substring(0, 1)
               }
          }))

          websocket.action ="move"
     }

     //websocket 运动
     ws_run(dir, progress) {
          var run_dir = cc.v2(0, 0)
          run_dir.x = dir.x
          run_dir.y = dir.y

          var len = run_dir.mag();
          var current_progress = progress;


          var power_x = this.shoot_power * current_progress * run_dir.x / len;
          var power_y = this.shoot_power * current_progress * run_dir.y / len;
          console.log("[power_x2]", power_x)
          console.log("[power_y2]", power_y)
          this.body.linearVelocity = cc.v2(power_x, power_y)

          //用下面这个方法有问题
          // this.body.applyLinearImpulse(cc.v2(power_x, power_y),
          //      this.node.convertToWorldSpaceAR(cc.v2(0, 0)), true)
     }

     // 显示或隐藏界面
     changeViewVisible(isVisible) {
          this.arrow.active = isVisible;
          this.progress_bar.node.active = false;
     }

     update(dt) {
          if (this.arrow.active === true) {
               //处理进度变化和反转
               var progress = this.progress_bar.progress;

               if (!this.isReverse) {
                    if (progress < 1) {
                         progress += dt;
                    } else {
                         progress = 1;
                         this.isReverse = true;
                    }
               } else {
                    if (progress >= 0) {
                         progress -= dt;
                    } else {
                         this.isReverse = false;
                    }
               }


               this.progress_bar.progress = progress;

          }
     }

     reset_player() {

          this.node.x = this.start_x
          this.node.y = this.start_y
          this.body.linearVelocity = cc.v2(0, 0)
          this.body.angularVelocity = 0
          this.node.getChildByName("boy").scaleX = 1

     }
}
