

cc.Class({
    extends: cc.Component,

    properties: {
        bloodProgressBar: cc.ProgressBar,
        bloodLabel: cc.Label
    },



    onLoad() {
        this.HP = window.cfg.heroHP
        this.bloodProgressBar.progress = 1
        this.bloodLabel.string = this.HP
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {

        let otherAttack = window.cfg.enemyAttack
        this.HP -= otherAttack;
        this.bloodProgressBar.progress = this.HP / window.cfg.heroHP

        if (this.HP <= 0) {
            this.HP = 0;
            window.game.gameOver();
        }
        otherCollider.node.active = false;
        this.bloodLabel.string = this.HP
    },


});
