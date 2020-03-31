

cc.Class({
    extends: cc.Component,

    properties: {
        colorNode: cc.Node
    },

    setState(state = 0) {
        this.state = state;
        if (this.state == 0) {
            this.colorNode.color = new cc.Color(255, 255, 255)
        } else {
            this.colorNode.color = new cc.Color(0, 0, 0)
        }
    },
    switchState() {
        let state = this.state == 0 ? 1 : 0
        this.setState(state)
    }



});
