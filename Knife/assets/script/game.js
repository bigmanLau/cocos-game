

cc.Class({
    extends: cc.Component,

    properties: {
        targetNode: cc.Node,
        knifeNode: cc.Node,
        knifePrefab: cc.Prefab
    },
    onLoad() {
        this.canThrow = true;
        this.targetNode.zIndex = 1;//默认都是0
        this.targetRotation = 3;
        this.knifeNodeArr = [] //存放小刀

        setInterval(() => {
            this.changeSpeed()
        }, 2000)

        this.node.on('touchstart', this.throwKnife, this)
    },
    onDestroy() {
        this.node.off('touchstart', this.throwKnife, this)
    },

    changeSpeed() {
        let dir = Math.random() > 0.5 ? 1 : -1;
        let speed = 1 + Math.random() * 4;
        this.targetRotation = dir * speed;
    },
    throwKnife() {
        if (this.canThrow) {
            this.canThrow = false;
            this.knifeNode.runAction(cc.sequence(
                cc.moveTo(0.15, cc.v2(this.knifeNode.x, this.targetNode.y - this.targetNode.width / 2)),
                cc.callFunc(() => {
                    let isHit = false
                    let gap = 15
                    for (let knifeNode of this.knifeNodeArr) {
                        if (Math.abs(knifeNode.angle) < gap || Math.abs((360 - knifeNode.angle)) < gap) {
                            isHit = true;
                            break;
                        }
                    }

                    if (isHit) {
                        this.knifeNode.runAction(cc.sequence(
                            cc.spawn(
                                cc.moveTo(0.25, cc.v2(this.knifeNode.x, -cc.winSize.height)),
                                cc.rotateTo(0.25, 30)
                            ),
                            cc.callFunc(() => {
                                console.log("game over")
                                cc.director.loadScene("game")
                            })
                        ))
                    }

                    let knifeNode = cc.instantiate(this.knifePrefab)
                    knifeNode.setPosition(this.knifeNode.position)
                    this.node.addChild(knifeNode)
                    this.knifeNodeArr.push(knifeNode)
                    this.knifeNode.setPosition(cc.v2(0, -300))
                    this.canThrow = true;
                })
            ))
        }
    },
    update(dt) {
        this.targetNode.angle = (this.targetNode.angle + this.targetRotation) % 360
        for (let knifeNode of this.knifeNodeArr) {
            knifeNode.angle = (knifeNode.angle + this.targetRotation) % 360
            let rad = Math.PI * (knifeNode.angle - 90) / 180
            let r = this.targetNode.width / 2
            knifeNode.x = this.targetNode.x + r * Math.cos(rad)
            knifeNode.y = this.targetNode.y + r * Math.sin(rad)

        }
    }

});
