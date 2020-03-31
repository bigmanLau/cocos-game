

cc.Class({
    extends: cc.Component,

    properties: {
        cellPrefab: cc.Prefab,
        cellAreaNode: cc.Node
    },



    onLoad() {
        this.maxSize = 10
        this.maxWCnt = this.cellAreaNode.width / this.maxSize
        this.maxHCnt = this.cellAreaNode.height / this.maxSize

        this.tt = 0;
        this.pause = true;

        this.cellNodeArr = []
        for (let i = 0; i < this.maxHCnt; i++) {
            this.cellNodeArr[i] = []
            for (let j = 0; j < this.maxWCnt; j++) {
                let cellNode = cc.instantiate(this.cellPrefab)
                cellNode.setPosition(cc.v2(j * this.maxSize, i * this.maxSize))
                cellNode.getComponent("cell").setState(0)
                this.cellAreaNode.addChild(cellNode)
                this.cellNodeArr[i][j] = (cellNode)
            }
        }

        this.cellAreaNode.on('touchstart', this.onTouchStart, this)

    },

    onTouchStart(e) {
        let pos = e.getLocation();
        //AR即anchor relation
        let n_pos = this.cellAreaNode.convertToNodeSpaceAR(pos) //将世界坐标转化成节点坐标
        let i = parseInt(n_pos.y / this.maxSize)
        let j = parseInt(n_pos.x / this.maxSize)

        let cellNode = this.cellNodeArr[i][j]

        cellNode.getComponent('cell').switchState();

    },
    update(dt) {
        if (this.pause) return;
        this.tt += dt;
        if (this.tt >= 0.1) {
            this.tt = 0;
            this.lifeChange()
        }
    },
    lifeChange() {
        let nowStateMap = [] //当前细胞状态
        let nextStateMap = [] //下次细胞状态

        for (let i = 0; i < this.maxHCnt; i++) {
            nowStateMap[i] = []
            nextStateMap[i] = []

            for (let j = 0; j < this.maxWCnt; j++) {
                let cellState = this.cellNodeArr[i][j].getComponent('cell').state;
                nowStateMap[i][j] = cellState
                nextStateMap[i][j] = cellState
            }
        }


        for (let i = 0; i < this.maxHCnt; i++) {
            for (let j = 0; j < this.maxWCnt; j++) {
                let state = this.cellLifeCheck(nowStateMap, { i, j })
                if (state == 0 || state == 1) {
                    nextStateMap[i][j] = state;
                }
            }
        }


        for (let i = 0; i < this.maxHCnt; i++) {
            for (let j = 0; j < this.maxWCnt; j++) {
                let cellState = nextStateMap[i][j]
                this.cellNodeArr[i][j].getComponent('cell').setState(cellState)
            }
        }
    },
    cellLifeCheck(stateMap, index) {
        //偏移量
        let grid = [
            { i: 1, j: -1 }, { i: 1, j: 0 }, { i: 1, j: 1 },
            { i: 0, j: -1 }, { i: 0, j: 1 },
            { i: -1, j: -1 }, { i: -1, j: 0 }, { i: - 1, j: 1 }
        ]

        let totalLife = 0

        for (let g of grid) {
            let i = g.i + index.i
            let j = g.j + index.j

            if (i >= this.maxHCnt) {
                i = 0
            }
            if (j >= this.maxWCnt) {
                j = 0;
            }

            if (i < 0) {
                i = this.maxHCnt - 1
            }
            if (j < 0) {
                j = this.maxWCnt - 1
            }

            let cellState = stateMap[i][j]
            if (cellState != 0) {
                totalLife++;
            }
        }

        if (totalLife == 3) {
            return 1;
        } else if (totalLife = 2) {
            return -1;
        } else {
            return 0
        }

    },
    pauseGame() {
        this.pause = !this.pause
        cc.find('Canvas/bg/pauseBtn/Background/Label').getComponent(cc.Label).string = !this.pause ? "暂停" : "开始"
    }




});
