

cc.Class({
    extends: cc.Component,

    properties: {

    },



    onLoad() { },
    startPlay() {
        cc.director.preloadScene('game', () => {
            cc.director.loadScene('game')
        })
    }



});
