

cc.Class({
    extends: cc.Component,

    properties: {
        mapNode: cc.Node,
        dialogNode: cc.Node,
        spriteTemp: cc.SpriteFrame
    },



    onLoad() {
        let p = cc.director.getPhysicsManager()
        p.enabled = true
        p.debugDrawFlags = true
        p.gravity = cc.v2(0, 0)

        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },
    start() {
        for (let mapNode of this.mapNode.children) {
            let tiledMap = mapNode.getComponent(cc.TiledMap)
            let tiledSize = tiledMap.getTileSize() //每一块瓦片大小


            let layer = tiledMap.getLayer('wall')
            let layerSize = layer.getLayerSize()

            let smogLayer = tiledMap.getLayer('smog')
            smogLayer.node.active = true

            for (let i = 0; i < layerSize.width; i++) {
                for (let j = 0; j < layerSize.height; j++) {
                    let tiled = layer.getTiledTileAt(i, j, true)
                    if (tiled.gid != -0) {
                        tiled.node.group = "wall"

                        let body = tiled.node.addComponent(cc.RigidBody)
                        body.type = cc.RigidBodyType.Static
                        let collider = tiled.node.addComponent(cc.PhysicsBoxCollider)
                        collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2)
                        collider.size = tiledSize
                        collider.apply()
                    }

                    tiled = smogLayer.getTiledTileAt(i, j, true)
                    if (tiled.gid != 0) {
                        tiled.node.group = 'smog'
                        let collider = tiled.node.addComponent(cc.BoxCollider)
                        collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2)
                        collider.size = tiledSize;
                    }

                }
            }



        }


        // this.dialog = this.dialogNode.getComponent('dialog')
        // this.dialog.init([
        //     { role: 2, content: '我是魔王' },
        //     { role: 1, content: '大家好我是勇者大家好我是勇者大家好我是勇者大家好我是勇者大家好我是勇者' }

        // ])
    }


});
