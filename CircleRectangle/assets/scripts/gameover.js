// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:
    setScoreLabel(score) {
        this.scoreLabel.string = score
    },
    // onLoad () {},
    restartGame() {
        cc.director.loadScene("game")
    },
    start() {

    },

    // update (dt) {},
});
