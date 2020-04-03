const Input = {}

cc.Class({
    extends: cc.Component,

    properties: {

    },



    onLoad() {
        this._speed = 500
        this.sp = cc.v2(0, 0)
        cc.systemEvent.on('keydown', this.onKeyDown, this)
        cc.systemEvent.on('keyup', this.onKeyUp, this)
        this.state = ''
        this.animation = this.node.getComponent(cc.Animation)
    },
    onDestroy() {
        cc.systemEvent.off('keydown', this.onKeyDown, this)
        cc.systemEvent.off('keyup', this.onKeyUp, this)
    },
    onKeyDown(e) {
        console.log(e.keyCode)
        Input[e.keyCode] = 1
    },
    onKeyUp(e) {
        Input[e.keyCode] = 0
    },
    setState(state) {
        if (this.state == state) return
        this.state = state
        this.animation.play(state)
    },
    update(dt) {
        if (window.dialog && window.dialog.active) return
        if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
            this.sp.x = -1
        } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
            this.sp.x = 1
        } else {
            this.sp.x = 0
        }

        if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up]) {
            this.sp.y = 1
        } else if (Input[cc.macro.KEY.s] || Input[cc.macro.KEY.down]) {
            this.sp.y = -1
        } else {
            this.sp.y = 0
        }

        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity

        if (this.sp.x) {
            this.lv.y = 0
            this.lv.x = this._speed * this.sp.x

        } else if (this.sp.y) {
            this.lv.x = 0
            this.lv.y = this._speed * this.sp.y
        } else {
            this.lv.x = 0
            this.lv.y = 0
        }
        this.node.getComponent(cc.RigidBody).linearVelocity = this.lv
        let state = ''

        if (this.sp.x == 1) {
            state = 'hero_right'
        } else if (this.sp.x == -1) {
            state = 'hero_left'
        } else if (this.sp.y == -1) {
            state = 'hero_down'
        } else if (this.sp.y == 1) {
            state = 'hero_up'
        }
        if (state) {
            this.setState(state)
        }

    },
    onCollisionEnter(other, self) {
        if (other.node.group == 'smog') {
            other.node.active = false
            other.node.getComponent(cc.TiledTile).gid = 0
        }
    }



});
