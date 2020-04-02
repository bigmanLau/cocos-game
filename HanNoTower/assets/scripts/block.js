

cc.Class({
    extends: cc.Component,

    properties: {
        colorAtlas: cc.SpriteAtlas
    },


    init(blockIndex) {
        this.node.getComponent(cc.Sprite).spriteFrame = this.colorAtlas.getSpriteFrame(blockIndex)
        this.node.width = 80 + blockIndex * 40
    },

    onLoad() {
        this.node.on('touchstart', this.onTouchStart, this)
        this.node.on('touchmove', this.onTouchMove, this)
        this.node.on('touchend', this.onTouchEnd, this)
    },

    onDestroy() {
        this.node.off('touchstart', this.onTouchStart, this)
        this.node.off('touchmove', this.onTouchMove, this)
        this.node.off('touchend', this.onTouchEnd, this)
    },

    onTouchStart(e) {
        this.canMove = true
        this.startPos = this.node.position
        let arr = window.game.blockNodeArr[this.node.baseIndex]
        if (this.node.blockIndex != arr[arr.length - 1].blockIndex) {
            this.canMove = false
        }
    },
    onTouchMove(e) {
        if (!this.canMove) return
        let delta = e.getDelta()
        this.node.x += delta.x
        this.node.y += delta.y
    },
    onTouchEnd(e) {
        let canPlace = window.game.placeBlock(this.node)
        if (!canPlace) {
            this.node.position = this.startPos
        }
    }



});
