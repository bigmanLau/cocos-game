

cc.Class({
    extends: cc.Component,

    properties: {

    },



    onLoad() {
        this.initVel = 0;
    },
    onBeginContact(contact, selfCollider, otherCollider) {
        let rigidBody = selfCollider.node.getComponent(cc.RigidBody)
        if (!this.initVel) {

            this.initVel = rigidBody.linearVelocity.y
        } else {
            rigidBody.linearVelocity = cc.v2(0, this.initVel)
        }
    },

});
