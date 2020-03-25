// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isAlive = true;
        let colorArrays = ["#52E4C3", "#F5A625", "#FF8536", "#FFFEFF", "#FB5900", "#0055A6"]
        let ratio = Math.random() > 0.5 ? 1 : -1
        this.node.width = this.node.width + ratio * 20
        this.node.height = this.node.height + ratio * 20

        let rigidBody = this.node.getComponent(cc.PhysicsBoxCollider)
        rigidBody.size.width = this.node.width
        rigidBody.size.height = this.node.height

        let color = cc.Color.WHITE
        let randonIndex = Math.floor(Math.random() * colorArrays.length);
        this.node.color = color.fromHEX(colorArrays[randonIndex]);

    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        // console.log("onBeginContact:", otherCollider.node.name, " ", selfCollider.node.name);
        // console.log("onBeginContact", selfCollider.node.group, otherCollider.node.group);
        // console.log("onBeginContact", selfCollider.node.groupIndex, otherCollider.node.groupIndex);
        if (otherCollider.node.name == "left" || otherCollider.node.name == "right") return;
        if (otherCollider.node.group == "wall") {

            this.node.group = "wall";
            this.isAlive = false;
        }
    },


    start() {

    },

    // update (dt) {},
});
