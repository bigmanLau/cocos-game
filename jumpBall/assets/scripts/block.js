

cc.Class({
    extends: cc.Component,

    properties: {

    },
    init(width) {
        let collider = this.node.getComponent(cc.PhysicsBoxCollider)
        this.node.width = width
        collider.size.width = width;
    }



});
