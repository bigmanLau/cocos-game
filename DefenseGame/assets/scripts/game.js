
// 开始位置

const dayDuration = 1
const dayChange = 10 //10个敌人换一天
const speed = 10
const STATE = {
    heroAttack: 0,
    enemyAttack: 1
}

cc.Class({
    extends: cc.Component,

    properties: {
        doorNode: cc.Node,
        rigidBody_arrow: cc.RigidBody,
        graphic_line: cc.Graphics,
        _linearVelocity_1: cc.Vec2,   // 平抛线性初速度
        _linearVelocity_2: cc.Vec2,
        _all_arrows: [cc.RigidBody],
        arrowPrefab: cc.Prefab,
        heroNode: cc.Node,
        shootLineImg: cc.Node,
        enemys: [cc.Node],
        boomNode: cc.Node,//爆炸粒子
        scoreLabel: cc.Label,//得分标签
        enemyList: [cc.Prefab],
        bg1: cc.Node,
        bg2: cc.Node,
        arrowNode: cc.Node,
        defenseDayLabel: cc.Label

    },

    onLoad() {

        //把当前脚本设置到window对象里的game
        window.game = this

        //初始化数据
        this.initData()

        //开启物理和碰撞系统
        this.initPhysicsAndCollison();

        //开启选中瞄准
        // this.openAnimShoot()

        //开启蓄力瞄准
        this.openPowerShoot()

        //设置英雄武器
        this.initHeroWeapon()

        //设置敌人
        this.initEnemy();

        this.onEventListener();

    },
    onEventListener() {
        cc.director.GlobalEvent.on("heroAttack", () => {
            this.state = STATE.heroAttack
        }, this)
    },
    initData() {
        this.score = 0
        this._index = 0
        this.count = 0
        this.startAngle = 0
        this.cur_bg = this.bg1;
        this.state = STATE.heroAttack
        this.day = 1
        this.addEnemyTime = 2
        this.defenseDayLabel.string = `坚守第${this.day}天`
    },
    initPhysicsAndCollison() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, window.cfg.G);
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = false;
        cc.director.getPhysicsManager().debugDrawFlags = false;
    },
    openAnimShoot() {
        this.graphic_line.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.graphic_line.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchStart, this);
        this.graphic_line.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },
    openPowerShoot() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.updateGunAngle, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEventEnd, this);
    },
    initHeroWeapon() {
        this._all_arrows.push(this.rigidBody_arrow);
        //初始化了十根箭
        for (let index = 0; index < 10; index++) {
            const element = cc.instantiate(this.rigidBody_arrow.node);
            this.rigidBody_arrow.node.parent.addChild(element);
            this._all_arrows.push(element.getComponent(cc.RigidBody));
        }
    },
    initEnemy() {
        this.addEnemy()

    },
    onEventEnd() {
        this.stopGunAngle()
    },
    //更新炮管角度
    updateGunAngle() {
        this._curAngle = 0
        if (this.state == STATE.heroAttack) {
            //瞄准辅助线
            // this.shootLineImg.active = true;


            this.gunSchedule = function () {
                if (this._curAngle < 60) {
                    this._curAngle += 1;
                    this.heroNode.angle = -this._curAngle;

                }
            };
            this.schedule(this.gunSchedule, 0.01);
        }
    },

    //停止更新炮管
    stopGunAngle() {
        if (this.state == STATE.heroAttack && this._curAngle > 0) {
            this.unschedule(this.gunSchedule);
            this.shootLineImg.active = false;
            let alpha1 = this._curAngle * (Math.PI / 180)
            const v_x_1 = Math.cos(alpha1) * window.cfg.V;
            const v_y_1 = Math.sin(alpha1) * window.cfg.V;


            this._linearVelocity_1.x = v_x_1;
            this._linearVelocity_1.y = v_y_1;
            // this.fireArrow(this.getArrowFirelinearVelocity(), window.cfg.START_POS)
            this.fireArrowThree(alpha1)

            this.state = STATE.enemyAttack
            this.scheduleOnce(() => {
                cc.director.GlobalEvent.emit("heroAttack")

            }, 1)
            this.scheduleOnce(() => {
                this.addEnemy()
            }, this.addEnemyTime)


        }
        this.heroNode.angle = 0
    },


    onDestroy() {
        if (this.graphic_line.node) {
            this.graphic_line.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.graphic_line.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchStart, this);
            this.graphic_line.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
    },
    onTouchEnd() {
        this.fireArrow(this.getArrowFirelinearVelocity(), window.cfg.START_POS)
    },
    // 获取发射速度
    getArrowFirelinearVelocity() {
        return false ? this._linearVelocity_2.clone() : this._linearVelocity_1.clone();
    },


    fireArrow(velocity, arrow_position) {
        const linearVelocity = velocity;

        if (linearVelocity.x) {
            const rigidBody_arrow = this._all_arrows[this._index++ % this._all_arrows.length];
            rigidBody_arrow.node.active = true;
            rigidBody_arrow.node.setPosition(arrow_position);
            rigidBody_arrow.node.getComponentInChildren(cc.MotionStreak).reset();
            rigidBody_arrow.linearVelocity = linearVelocity;
        }
    },

    //三箭齐发
    fireArrowThree(alpha1) {

        this.fireArrow(this.getVelocity(Math.abs(alpha1 - 0.1)), window.cfg.START_POS)
        this.fireArrow(this.getArrowFirelinearVelocity(), window.cfg.START_POS)
        this.fireArrow(this.getVelocity(Math.abs(alpha1 + 0.1)), window.cfg.START_POS)
    },

    onTouchStart(touch) {
        //把触摸点坐标转化到我们的图片背景这个范围坐标内
        const location = this.rigidBody_arrow.node.parent.convertToNodeSpaceAR(touch.getLocation());

        const s = location.x - window.cfg.START_POS.x;
        const h = location.y - window.cfg.START_POS.y;

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
            const v_x_2 = Math.cos(alpha2) * window.cfg.V;
            const v_y_2 = Math.sin(alpha2) * window.cfg.V;
            this.alpha1 = alpha1

            this._linearVelocity_1.x = v_x_1;
            this._linearVelocity_1.y = v_y_1;

            this._linearVelocity_2.x = v_x_2;
            this._linearVelocity_2.y = v_y_2;
        } else {
            this._linearVelocity_1 = cc.Vec2.ZERO;
            this._linearVelocity_2 = cc.Vec2.ZERO;
        }

        // this.drawArrowTrace();
    }
    ,
    getVelocity(angle) {
        const v_x_1 = Math.cos(angle) * window.cfg.V;
        const v_y_1 = Math.sin(angle) * window.cfg.V;
        return cc.v2(v_x_1, v_y_1)
    },
    // 画轨迹
    drawArrowTrace() {
        this.graphic_line.clear();
        const linearVelocity = this.getArrowFirelinearVelocity();

        if (linearVelocity.x) {
            const dt = 0.05;
            for (let count = 0; count < 100; count++) {
                const time = dt * count;
                // s = v_x * t
                const dx = linearVelocity.x * time;
                // h = v_y * t + 0.5 * a * t * t
                const dy = linearVelocity.y * time + 0.5 * window.cfg.G * this.rigidBody_arrow.gravityScale * time * time;
                // 当前时间点坐标
                const targetX = window.cfg.START_POS.x + dx;
                const targetY = window.cfg.START_POS.y + dy;
                // 坐标超过地板就不画了
                if (targetY < -300) break;
                this.graphic_line.circle(targetX, targetY, 8);
            }
        }
        this.graphic_line.fill();
    }
    ,
    addEnemy() {
        if (!this.enemyList) return
        let prefab = this.enemyList[parseInt(this.enemyList.length * Math.random())]

        let enemy = cc.instantiate(prefab)
        enemy.parent = this.node
        let enemyWidth = enemy.width
        let enemyHeight = enemy.height
        let halfWidth = cc.winSize.width / 3
        let enemyY = -cc.winSize.height / 2 + enemyHeight / 2
        let x = Math.random() * halfWidth + enemyWidth
        let y = Math.random() * enemyY
        enemy.setPosition(cc.v2(x, y))
        enemy.getComponent("enemy").setRealPosition(x, y)
        this.enemys.push(enemy)
        this.count++
    },
    update(dt) {
        for (const rigidBody of this._all_arrows) {
            if (rigidBody.linearVelocity.x) {
                // 计算夹角
                const angle = rigidBody.linearVelocity.clone().signAngle(cc.v2(1, 0));
                rigidBody.node.angle = -angle * 180 / Math.PI;
            }
        }



        //移动背景
        this.moveBg(dt);
    },
    moveBg(dt) {
        var s = dt * speed;
        this.bg1.x += s;
        this.bg2.x += s;

        let halfWidth = cc.winSize.width / 2
        if (this.cur_bg.x >= halfWidth + this.cur_bg.width / 2) { // 地图切换
            if (this.cur_bg == this.bg2) {
                this.bg2.x = -this.bg1.width + halfWidth - this.bg2.width / 2 + 10
                this.cur_bg = this.bg1;
            }
            else {
                this.bg1.x = -this.bg2.width + halfWidth - this.bg1.width / 2 + 10
                this.cur_bg = this.bg2;
            }

            this.defenseDayLabel.string = `坚守第${++this.day}天`
            window.cfg.enemyHP++;
            this.addEnemyTime -= 0.1;
        }
    },
    gameOver() {
        cc.director.loadScene("game")
    },
    boom(pos, color) {
        this.boomNode.setPosition(pos)
        let particle = this.boomNode.getComponent(cc.ParticleSystem)
        if (color != undefined) {
            let cccolor = cc.Color.WHITE

            particle.startColor = particle.endColor = cccolor.fromHEX(color);
        } else {
            particle.startColor = particle.endColor = cc.Color.WHITE
        }
        particle.resetSystem();
        this.score++;
        this.scoreLabel.string = "杀死敌人" + this.score
    },
    isEnemyTurn() {
        return this.state == STATE.enemyAttack
    }


});
