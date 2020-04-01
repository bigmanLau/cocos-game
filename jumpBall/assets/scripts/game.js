

cc.Class({
    extends: cc.Component,

    properties: {
        ballNode: cc.Node,
        blockPrefab: cc.Prefab,
        blockAreaNode: cc.Node,
        scoreLabel: cc.Label
    },
    onLoad() {
        this.initPhysics()

        this.node.on('touchstart', this.boost, this)

        this.gameStart = 0
        this.score = 0
        this.initBlock()
    },

    initPhysics() {
        let manager = cc.director.getPhysicsManager()
        manager.enabled = true;
        manager.debugDrawFlags = true;
        manager.gravity = cc.v2(0, -2400)
    },
    onDestroy() {
        this.node.off('touchstart', this.boost, this)
    },
    boost() {
        if (this.ballNode.getComponent('ball').initVel) {
            let rigidBody = this.ballNode.getComponent(cc.RigidBody)
            rigidBody.linearVelocity = cc.v2(0, -1600)
            this.gameStart = 1
        }

    },
    initBlock() {
        this.blockNodeArr = []
        this.lastBlockPosX = this.ballNode.x
        for (let i = 0; i < 10; i++) {
            let blockNode = cc.instantiate(this.blockPrefab)
            blockNode.x = this.lastBlockPosX
            blockNode.y = 0

            let width = 80 + (Math.random() > .5 ? 1 : -1) * (40 * Math.random())
            blockNode.getComponent("block").init(width);
            this.blockAreaNode.addChild(blockNode)
            this.blockNodeArr.push(blockNode)
            this.lastBlockPosX += 200;


        }

    },
    //获取最后一块跳板位置
    getLastBlockPosX() {
        let posX = 0;
        for (let blockNode of this.blockNodeArr) {
            if (blockNode.x > posX) {
                posX = blockNode.x;
            }
        }
        return posX
    },
    update(dt) {
        if (this.gameStart) {
            let speed = -450 * dt;
            for (let blockNode of this.blockNodeArr) {
                blockNode.x += speed;

                if (blockNode.x < -cc.winSize.width / 2 - blockNode.width / 2) {
                    //每次一块方块移出屏幕 就得分
                    this.incrScore(1)
                    blockNode.x = this.getLastBlockPosX() + 200
                }
            }
        }
        if (this.ballNode.y < -cc.winSize.height / 2) {
            cc.director.loadScene("game")
        }
    },
    incrScore(incr) {
        this.score += incr
        this.scoreLabel.string = this.score
    }

});
