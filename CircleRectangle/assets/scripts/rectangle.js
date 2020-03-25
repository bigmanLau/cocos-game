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

        let color = cc.Color.WHITE
        let randonIndex = Math.floor(Math.random() * colorArrays.length);
        this.node.color = color.fromHEX(colorArrays[randonIndex]);

        this.node.width = this.node.width + ratio * this.node.width / 2 * Math.random()
        this.node.height = this.node.height + ratio * this.node.height / 2 * Math.random()
        // console.log(this.node.width, this.node.height)

        this.node.getComponent(cc.Sprite).width = this.node.width;
        let rigidBody = this.node.getComponent(cc.PhysicsBoxCollider)
        rigidBody.size.width = this.node.width
        rigidBody.size.height = this.node.height


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
