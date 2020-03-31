
cc.Class({
    extends: cc.Component,

    properties: {
        blockNode: cc.Node,
        bashNodeArr: [cc.Node],
        wallNodeArr: [cc.Node],
        scoreLabel: cc.Label,
        tarLabel: cc.Label
    },



    onLoad() {
        this.node.on('touchstart', this.grow, this)
        this.node.on('touchend', this.stop, this)

        this.init()
    },
    onDestroy() {
        this.node.off('touchstart', this.grow, this)
        this.node.off('touchend', this.stop, this)
    },
    grow() {
        if (this.gameState != "idle") return;
        this.gameState = "grow"

        let seq = cc.sequence(
            cc.scaleTo(1, 4),
            cc.callFunc(() => {

            })
        )
        this.growAction = this.blockNode.runAction(seq)
    },
    stop() {
        if (this.gameState != "grow") return;
        this.gameState = "rotate"


        this.blockNode.stopAction(this.growAction)
        //    this.rotaAction= this.blockNode.runAction(cc.rotateTo(0.15, 0))
        this.blockNode.runAction(cc.sequence(
            cc.rotateTo(0.15, 0),
            cc.callFunc(() => {
                if (this.blockNode.width * this.blockNode.scaleX <= (this.bashNodeArr[1].x - this.bashNodeArr[0].x)) {
                    this.blockNode.runAction(cc.sequence(
                        cc.moveTo(0.5, 0, -1000),
                        cc.callFunc(() => {
                            this.gameOver();
                        })
                    ))
                } else {
                    if (this.blockNode.width * this.blockNode.scaleX <= (this.wallNodeArr[1].x - this.wallNodeArr[0].x)) {
                        this.bouce(true)
                    } else {
                        this.bouce(false)
                    }

                }
            })
        ))
    },
    bouce(success) {
        let desY = -(cc.winSize.height / 2 - this.bashNodeArr[0].height - this.blockNode.height * this.blockNode.scaleY / 2)
        if (!success) {
            desY += this.wallNodeArr[0].height
        }
        this.blockNode.runAction(cc.sequence(
            cc.moveTo(0.5, cc.v2(0, desY)).easing(cc.easeBounceOut()),
            cc.callFunc(() => {
                if (success) {
                    this.updateScore(1)
                    this.nextLevelCheck()
                } else {
                    this.gameOver()
                }
            })
        ))
    },
    gameOver() {
        cc.director.loadScene("game")
    },
    init(level = 1, score = 0) {
        this.score = score
        this.level = level
        this.tar = this.level
        this.nextLevelCheck()
        this.resetBgColor()
    },
    placeWall(node, desX) {
        node.runAction(cc.moveTo(0.5, cc.v2(desX, node.y)).easing(cc.easeQuinticActionIn()))
    },
    resetWall() {
        let baseGap = 100 + Math.random() * 100
        let wallGap = baseGap + 30 + Math.random() * 80

        this.placeWall(this.bashNodeArr[0], -baseGap / 2)
        this.placeWall(this.bashNodeArr[1], baseGap / 2)
        this.placeWall(this.wallNodeArr[0], -wallGap / 2)
        this.placeWall(this.wallNodeArr[1], wallGap / 2)
        // let wallGap=
        // this.placeWall(this.wallNodeArr[0],)
    },
    resetBlock() {
        this.blockNode.runAction(cc.sequence(
            cc.spawn(
                cc.rotateTo(0.5, -45),
                cc.moveTo(0.5, cc.v2(0, 400)),
                cc.scaleTo(0.5, 1)
            ),
            cc.callFunc(() => {

            })
        ))
    },
    nextLevelCheck() {
        if (this.tar == 0) {
            this.init(this.level + 1, this.score)
            this.scoreLabel.string = `score:${this.score},level:${this.level}`
            return
        }
        this.tarLabel.string = this.tar
        this.resetWall()
        this.resetBlock()
        this.gameState = "idle"
    },
    updateScore(incr) {
        this.score += incr
        this.scoreLabel.string = `score:${this.score},level:${this.level}`
        this.tar -= incr;
    },
    resetBgColor() {
        let colors = ['#4cb4e7', '#ffc09f', '#c7b3e5', '#588c7e', 'a3a380']
        this.node.color = cc.Color.BLACK.fromHEX(colors[parseInt(Math.random() * colors.length)])
    }
});
