

cc.Class({
    extends: cc.Component,

    properties: {
        ballPrefab: cc.Prefab,
        ctrlAreaNode: cc.Node,
        hintLabel: cc.Label
    },
    init() {
        window.game = this
        this.ballNodeArr = []
        this.level = 1
        this.initMap(this.level)
    },

    initMap(level) {
        if (level > 4) {
            level = 4
        }

        this.gameOver = false
        this.time = 3
        this.now = 0

        let ballCnt = 4 * level
        let typeCnt = 1 + 1 * level
        for (let i = 0; i < ballCnt; i++) {
            let ballNode = null
            if (!this.ballNodeArr[i]) {
                ballNode = cc.instantiate(this.ballPrefab)
                this.ctrlAreaNode.addChild(ballNode)
                this.ballNodeArr.push(ballNode)
            } else {
                ballNode = this.ballNodeArr[i]
            }

            ballNode.getComponent("ball").randBall(typeCnt)
        }
    },

    onLoad() {
        this.init()
    },

    checkOver() {
        let isOver = true
        let tagName = null
        for (let i = 0; i < this.ballNodeArr.length; i++) {
            let ballNode = this.ballNodeArr[i]
            let name = ballNode.getComponent(cc.Sprite).spriteFrame.name
            if (i == 0) {
                tagName = name
                continue
            }
            if (name != tagName) {
                isOver = false;
                break;
            }
        }
        if (isOver) {
            this.levelUp()
        }
    },
    levelUp() {
        this.level++
        this.initMap(this.level)
    },
    update(dt) {
        this.now += dt
        let resTime = parseInt(this.time - this.now)
        console.log("剩余时间", resTime)
        if (resTime < 0) {
            this.gameOver = true
            this.hintLabel.string = `time out ,game over`
        } else {
            this.hintLabel.string = `level:${this.level},time:${resTime}s`

        }
    }

});
