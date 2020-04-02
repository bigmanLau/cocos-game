

cc.Class({
    extends: cc.Component,

    properties: {
        blockLayerNode: cc.Node,
        blockPrefab: cc.Prefab,
        baseNodeArr: [cc.Node],
    },



    onLoad() {
        window.game = this
        this.blockNodeArr = [[], [], []]
        this.blockNum = 3
        this.initBlock(this.blockNum)
    },
    initBlock(num) {
        if (num >= 6) {
            num = 6
        }
        for (let i = 0; i < this.blockNodeArr.length; i++) {
            let arr = this.blockNodeArr[i]
            for (let j = 0; j < arr.length; j++) {
                arr[j].destroy()
            }
        }
        this.blockNodeArr = [[], [], []]
        for (let i = 0; i < num; i++) {
            let blockNode = cc.instantiate(this.blockPrefab)
            this.blockLayerNode.addChild(blockNode)
            blockNode.x = this.baseNodeArr[0].x
            blockNode.y = -122 + 44 * i
            blockNode.baseIndex = 0
            let blockIndex = num - i - 1
            blockNode.blockIndex = blockIndex
            blockNode.getComponent('block').init(blockIndex)

            this.blockNodeArr[0].push(blockNode)
        }


    },
    baseIndexCheck(pos) {
        for (let i = 0; i < this.baseNodeArr.length; i++) {
            let baseNode = this.baseNodeArr[i]
            if (pos.x > baseNode.x - baseNode.width / 2 && pos.x <= baseNode.x + baseNode.width) {
                return i;
            }
        }
        return -1
    },
    placeBlock(backNode) {
        let baseIndex = this.baseIndexCheck(backNode.position)
        if (baseIndex == -1) {
            return false
        }

        if (backNode.baseIndex == baseIndex) {
            return false
        }

        let arr = this.blockNodeArr[baseIndex]
        if (arr.length && arr[arr.length - 1].blockIndex <= backNode.blockIndex) {
            return false
        }

        let baseNode = this.baseNodeArr[baseIndex]
        backNode.x = baseNode.x

        this.blockNodeArr[backNode.baseIndex].pop()
        this.blockNodeArr[baseIndex].push(backNode)

        backNode.baseIndex = baseIndex
        let length = this.blockNodeArr[baseIndex].length
        backNode.y = -122 + (length - 1) * 44

        if (this.blockNodeArr[2].length == this.blockNum) {
            console.log("通关")
            this.initBlock(++this.blockNum)
        }
        return true
    }


});
