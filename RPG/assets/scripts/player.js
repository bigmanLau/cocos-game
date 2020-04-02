

cc.Class({
    extends: cc.Component,

    properties: {
        hpLabel: cc.Label,
        apLabel: cc.Label,
        mpLabel: cc.Label,
    },



    onLoad() { },

    init(hp, ap, mp) {
        this.setHp(hp)
        this.setAp(ap)
        this.setMp(mp)
    },
    setHp(hp) {
        this.hp = hp
        this.updateHp()
    },
    updateHp() {
        this.hpLabel.string = `HP\n${this.hp}`
    },
    setAp(ap) {
        this.ap = ap
        this.updateAp()
    },
    updateAp() {
        this.apLabel.string = `AP\n${this.ap}`
    },
    setMp(mp) {
        this.mp = mp
        this.updateMp()
    },
    updateMp() {
        this.mpLabel.string = `MP\n${this.mp}`
    },
    costAp(num) {
        this.ap -= num;
        this.updateAp()
    },
    hurt(num) {
        this.hp -= num
        this.updateHp()

        if (this.hp <= 0) {
            window.game.gameOver()
        }
    },
    heal() {
        this.mp -= cfg.healMpCost
        this.hp += cfg.healHp
        if (this.hp >= cfg.playerMaxHp) {
            this.hp = cfg.playerMaxHp
        }
        this.updateHp()
        this.updateMp()
    },
    incrMp() {
        this.mp += cfg.incrMp
        if (this.mp >= cfg.playerMaxHp) {
            this.mp = cfg.playerMaxHp
        }

        this.updateMp()
    }
});
