

cc.Class({
    extends: cc.Component,

    properties: {
        enemyNode: cc.Node,
        playerNode: cc.Node,
        nextBtnNode: cc.Node
    },



    onLoad() {
        window.game = this
        this.enemy = this.enemyNode.getComponent('enemy')
        this.player = this.playerNode.getComponent('player')
        this.nextBtnNode.active = false
    },

    start() {
        this.enemy.init(cfg.enemyMaxHp)
        this.player.init(cfg.playerMaxHp, cfg.playerMaxAp, cfg.playerMaxMp)
    },

    playerAttack() {
        if (this.isAction) return
        this.isAction = true

        if (this.player.ap >= cfg.apCost) {
            this.player.costAp(cfg.apCost)
            this.player.incrMp(cfg.incrMp)
            this.enemy.hurt(cfg.playerAtk)
        } else {
            console.log("没有行动点")
        }

    },

    playerHeal() {

        if (this.player.ap >= cfg.apCost && this.player.mp >= cfg.healMpCost) {
            this.player.costAp(cfg.apCost)
            this.player.heal()
            this.checkEnemyAction()
        }
    },
    nextRoom() {

        this.node.getComponent(cc.Animation).play("interlude")
    },
    onInterlude() {
        this.checkEnemyAction()
        this.enemy.init(cfg.enemyMaxHp)
    },
    checkEnemyAction() {

        if (this.player.ap <= 0) {
            this.enemy.attack()
            this.player.setAp(cfg.playerMaxAp)
        } else {
            this.isAction = false
        }
    },
    gameOver() {
        cc.director.loadScene("game")
    }


});
