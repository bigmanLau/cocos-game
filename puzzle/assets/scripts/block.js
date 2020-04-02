

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.node.on('touchstart', this.touchStart, this)
        this.node.on('touchmove', this.touchMove, this)
        this.node.on('touchend', this.touchEnd, this)
    },
    onDestroy() {
        this.node.off('touchstart', this.touchStart, this)
        this.node.off('touchmove', this.touchMove, this)
        this.node.off('touchend', this.touchEnd, this)
    },

    touchStart(e) {
        this.node.opacity = 128
        this.startPos = this.node.position
        this.node.zIndex = 1
    },
    touchMove(e) {
        let delta = e.getDelta()
        this.node.x += delta.x
        this.node.y += delta.y

    },
    touchEnd(e) {
        this.node.opacity = 255
        this.node.zIndex = 0


        let width = this.node.width
        let height = this.node.height

        let index = this.getPos2Index(this.node.position)

        let tempNode = window.game.picNodeArr[index.i][index.j]

        if (tempNode) {
            this.node.setPosition(index.j * width, -index.i * height)
            tempNode.setPosition(this.startPos)

            let startIndex = this.getPos2Index(this.startPos)
            window.game.picNodeArr[startIndex.i][startIndex.j] = tempNode
            window.game.picNodeArr[index.i][index.j] = this.node
        } else {
            this.node.setPosition(this.startPos)
        }

    },

    getPos2Index(pos) {
        let width = this.node.width
        let height = this.node.height
        let i = Math.abs(parseInt(pos.y / height))
        let j = Math.abs(parseInt(pos.x / width))

        return { i, j }
    },

    init(picTexture, pos) {
        let sprite = this.node.getComponent(cc.Sprite)
        let width = this.node.width;
        let height = this.node.height
        let frame = new cc.SpriteFrame(picTexture, cc.rect(pos.x * width, pos.y * height, width, height))
        sprite.spriteFrame = frame
    }



});
