

cc.Class({
    extends: cc.Component,

    properties: {
        bloodProgressBar: cc.ProgressBar,
        arrowPrefab: cc.Prefab,
        _linearVelocity_1: cc.Vec2,   // 平抛线性初速度
        bloodLabel: cc.Label

    },





    onLoad() {

        this.ani = this.node.getChildByName('hero').getComponent(cc.Animation)

        this.ani && this.ani.on("finished", (event) => {
            this.fireArrow()
        }, this);

        this.rigidBody_arrow = cc.instantiate(this.arrowPrefab).getComponent(cc.RigidBody);

        //如果有动画

        this.attack = window.cfg.enemyAttack
        this.HP = window.cfg.enemyHP
        this.bloodLabel.string = this.HP
        this.bloodProgressBar.progress = 1
        cc.director.GlobalEvent.on("heroAttack", () => {
            this.attackHero()
        }, this)
    },
    attackHero() {
        if (this.ani) {
            this.doAnimation()
        } else {
            this.fireArrow()
        }
    },

    doAnimation() {
        if (this.ani != null) {
            this.ani.play(this.node.name)
        }
    },
    getAttack() {
        return this.attack
    },
    setRealPosition(x, y) {
        this._x = x;
        this._y = y

    },
    fireArrow() {
        if (!this.rigidBody_arrow) return
        const linearVelocity = this.getVelocity();
        if (this.rigidBody_arrow.node && linearVelocity.x) {
            this.rigidBody_arrow.node.active = true;
            this.rigidBody_arrow.node.parent = this.node.parent
            this.rigidBody_arrow.node.scaleX = 1
            this.rigidBody_arrow.node.setPosition(cc.v2(this._x - this.node.getChildByName("hero").width / 2, this._y + this.node.getChildByName("hero").height / 2));
            this.rigidBody_arrow.node.getComponentInChildren(cc.MotionStreak).reset();
            this.rigidBody_arrow.linearVelocity = linearVelocity;
        }


    },

    getVelocity() {

        //把触摸点坐标转化到我们的图片背景这个范围坐标内
        let velocity = cc.v2(0, 0)
        const location = window.cfg.START_POS

        const s = location.x - this._x;
        const h = location.y - this._y;

        // a*t^2 + b*t + c = 0
        const a = window.cfg.G * this.rigidBody_arrow.gravityScale * s / (2 * window.cfg.V * window.cfg.V);
        const b = 1;
        const c = a - h / s;
        const delta = b * b - 4 * a * c;
        if (delta >= 0) {
            // 一元二次方程求根公式
            const t1 = (-b + Math.sqrt(delta)) / (2 * a); // 平抛 tan 值
            const t2 = (-b - Math.sqrt(delta)) / (2 * a); // 高抛 tan 值

            // 二、三象限角度要加 180
            const alpha1 = Math.atan(t1) + (s < 0 ? Math.PI : 0);
            const alpha2 = Math.atan(t2) + (s < 0 ? Math.PI : 0);

            const v_x_1 = Math.cos(alpha1) * window.cfg.V;
            const v_y_1 = Math.sin(alpha1) * window.cfg.V;


            velocity.x = v_x_1;


            velocity.y = v_y_1;

        } else {
            velocity = cc.Vec2.ZERO;
        }
        return velocity;
        // this.drawArrowTrace();
    }, update() {

        if (this.rigidBody_arrow.linearVelocity && this.rigidBody_arrow.linearVelocity.x) {
            // 计算夹角
            const angle = this.rigidBody_arrow.linearVelocity.clone().signAngle(cc.v2(1, 0));
            this.rigidBody_arrow.node.angle = -angle * 180 / Math.PI;
        }


    }  // 只在两个碰撞体开始接触时被调用一次
    , onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log("敌人收到攻击")
        let otherAttack = window.cfg.heroAttack

        this.HP -= otherAttack;
        this.bloodProgressBar.progress = this.HP / window.cfg.enemyHP
        this.bloodLabel.string = this.HP
        setTimeout(() => {
            if (this.HP <= 0) {
                this.HP = 0;
                for (let i = 0; i < window.game.enemys.length; i++) {
                    if (this.node) {
                        if (window.game.enemys[i]._id == this.node._id) {
                            window.game.enemys.splice(i, 1)
                        }
                    }
                }
                if (this.node) {
                    this.node.destroy()
                    //这里设置敌人死亡 子弹要不要消失
                    // this.rigidBody_arrow.node.destroy()
                    window.game.boom(this.node.position)
                }

            }
        }, 100);
        otherCollider.node.active = false;

    },




});
