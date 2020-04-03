

cc.Class({
    extends: cc.Component,

    properties: {
        playerNode: cc.Node
    },



    update(dt) {
        if (!this.playerNode) return

        let w_pos = this.playerNode.convertToWorldSpaceAR(cc.v2(0, 0))//首先将player节点00的位置转换成世界坐标
        let n_pos = this.node.parent.convertToNodeSpaceAR(w_pos)
        this.node.position = n_pos

    },



});
