

cc.Class({
    extends: cc.Component,

    properties: {
        hintLabel: cc.Label,
        attackBtnNode: cc.Node,
        healBtnNode: cc.Node
    },

    setHint(hint) {
        this.hintLabel.string = hint
    },

    onLoad() {
        this.attackBtnNode.on('mousemove', this.setAtkHint, this)
        this.healBtnNode.on('mousemove', this.setHealHint, this)

        this.attackBtnNode.on('mouseleave', this.removeHint, this)
        this.healBtnNode.on('mouseleave', this.removeHint, this)
    },
    onDestroy() {
        this.attackBtnNode.off('mousemove', this.setAtkHint, this)
        this.healBtnNode.off('mousemove', this.setHealHint, this)

        this.attackBtnNode.off('mouseleave', this.removeHint, this)
        this.healBtnNode.off('mouseleave', this.removeHint, this)
    },
    setAtkHint() {
        this.setHint(`攻击，对敌人造成${cfg.playerAtk}点伤害`)
    },
    setHealHint() {
        this.setHint(`恢复，治疗自身${cfg.healHp}点生命值，需要消耗${cfg.healMpCost}点法力值`)
    },
    removeHint() {
        this.setHint('')
    },


});
