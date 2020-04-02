

cc.Class({
    extends: cc.Component,

    properties: {
        ballAtlas: cc.SpriteAtlas
    },



    onLoad() {

    },
    randBall(typeCnt) {
        let frames = this.ballAtlas.getSpriteFrames()
        if (typeCnt > frames.length) {
            typeCnt = frames.length
        }

        let randIndex = parseInt(Math.random() * typeCnt)
        let sprite = this.node.getComponent(cc.Sprite)
        sprite.spriteFrame = frames[randIndex]

        this.typeCnt = typeCnt;
    },
    nextBall() {
        if (window.game.gameOver) return
        let frames = this.ballAtlas.getSpriteFrames()
        let sprite = this.node.getComponent(cc.Sprite)
        let index = +sprite.spriteFrame.name;
        let nextIndex = index + 1
        if (nextIndex >= this.typeCnt) {
            nextIndex = 0
        }
        sprite.spriteFrame = frames[nextIndex]
        window.game.checkOver()
    }


});
