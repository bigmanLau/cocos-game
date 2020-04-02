

cc.Class({
    extends: cc.Component,

    properties: {
        blockPrefab: cc.Prefab
    },



    onLoad() {
        window.game = this
        cc.loader.load({ url: 'res/raw-assets/source/img.png', type: 'png' }, (err, texture) => {
            this.picTexture = texture
            this.picNodeArr = []
            // this.blockNode.getComponent('block').init(texture, cc.v2(0, 0))

            for (let i = 0; i < 4; i++) {
                this.picNodeArr[i] = []
                for (let j = 0; j < 4; j++) {
                    let block = cc.instantiate(this.blockPrefab)
                    this.node.addChild(block)
                    block.setPosition(cc.v2(j * 180, -i * 180))
                    block.getComponent('block').init(texture, cc.v2(j, i))
                    this.picNodeArr[i][j] = block
                }
            }

            this.randPic()
        })
    },

    randPic() {
        for (let i = 0; i < 4; i++) {

            for (let j = 0; j < 4; j++) {
                let block = this.picNodeArr[i][j]

                let exIndex = {
                    i: parseInt(Math.random() * 4),
                    j: parseInt(Math.random() * 4)
                }
                let exBlock = this.picNodeArr[exIndex.i][exIndex.j]


                let pos = block.position
                let expos = exBlock.position
                block.setPosition(expos)
                exBlock.setPosition(pos)

                this.picNodeArr[i][j] = exBlock
                this.picNodeArr[exIndex.i][exIndex.j] = block


            }
        }
    }


});
