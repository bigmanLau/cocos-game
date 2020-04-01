

cc.Class({
    extends: cc.Component,

    properties: {
        playerNode: cc.Node,
        boomNode: cc.Node,
        enemyNode: cc.Node,
        scoreLabel: cc.Label
    },



    onLoad() {
        this.score = 0
        this.placePlayer()
        this.placeEnemy()

        this.node.on('touchstart', this.fire, this)
    },
    onDestroy() {
        this.node.off('touchstart', this.fire, this)
    },
    placeEnemy() {
        this.enemyNode.active = true;
        let x = cc.winSize.width / 2 - this.enemyNode.width / 2;
        let y = Math.random() * cc.winSize.height / 4
        let dua = 1.6 + Math.random() * 0.5

        this.enemyNode.x = 0
        this.enemyNode.y = cc.winSize.height / 3 - this.enemyNode.height / 2

        let seq = cc.repeatForever(
            cc.sequence(
                cc.moveTo(dua, -x, y),
                cc.moveTo(dua, x, y),
                cc.callFunc(() => {

                })
            )
        )
        this.enemyAction = this.enemyNode.runAction(seq)
    },
    placePlayer() {
        this.isFire = false
        this.playerNode.y = -cc.winSize.height / 4
        this.playerNode.active = true;
        let seq = cc.sequence(
            cc.moveTo(10, this.playerNode.x, -cc.winSize.height / 2 - this.playerNode.height / 2),
            cc.callFunc(() => {
                this.die()
            })
        )


        this.playerAction = this.playerNode.runAction(seq)
    },

    fire() {
        if (this.isFire) return;
        this.isFire = true
        let dua = 0.6
        let seq = cc.sequence(
            cc.moveTo(dua, cc.v2(0, cc.winSize.height / 2)),
            cc.callFunc(() => {
                this.die()
                console.log("发射结束")
                this.isFire = false
            })
        )

        this.playerAction = this.playerNode.runAction(seq)
    },
    die() {
        // 
        this.playerNode.active = false
        this.boom(this.playerNode.position, this, this.playerNode.color)
        setTimeout(() => {
            cc.director.loadScene('game')
        }, 1000)
    },
    boom(pos, color) {
        this.boomNode.setPosition(pos)
        let particle = this.boomNode.getComponent(cc.ParticleSystem)
        if (color !== undefined) {
            particle.startColor = particle.endColor = color
        }
        particle.resetSystem()
    },
    update(dt) {
        //如果两个物体相交距离小于两个中心的距离 就相撞了
        if (this.playerNode.position.sub(this.enemyNode.position).mag() < this.playerNode.width / 2 + this.enemyNode.width / 2) {
            this.enemyNode.active = false
            this.boom(this.enemyNode.position, this.enemyNode.color)
            this.scoreLabel.string = ++this.score


            this.enemyNode.stopAction(this.enemyAction)
            this.playerNode.stopAction(this.playerAction)
            this.placeEnemy()
            this.placePlayer()

        }
    }

});
