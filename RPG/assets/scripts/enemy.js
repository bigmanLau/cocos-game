

cc.Class({
    extends: cc.Component,

    properties: {
        hpLabel: cc.Label,

    },



    onLoad() {
        this.animation = this.node.getComponent(cc.Animation)
    },

    init(hp) {
        this.setHp(hp)
        this.node.active = true;
        window.game.nextBtnNode.active = false
    },

    setHp(hp) {
        this.hp = hp
        this.updateHp()
    },
    updateHp() {
        this.hpLabel.string = `${this.hp}hp`
    },
    hurt(num) {
        this.hp -= num
        if (this.hp <= 0) {
            this.node.active = false
            window.game.nextBtnNode.active = true
            return
        }
        this.updateHp()
        this.animation.play('hurt')
    },
    attack() {
        this.animation.play('attack')
    },
    onHurtEnd() {
        window.game.isAction = false
        window.game.checkEnemyAction()

    },
    onAttackEnd() {
        window.game.player.hurt(cfg.enemyAtk)
    }


});
