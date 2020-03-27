// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const NAME_FOR_CIRCLE = "circle"
const NAME_FOR_RECTANGLE = "rectangle"
cc.Class({
    extends: cc.Component,

    properties: {
        circlePrefab: cc.Prefab,
        recPrefab: cc.Prefab,
        boomNode: cc.Node,
        nodes: {
            default: [],
            type: cc.Node
        },
        speed: 10,
        gravity: -1200,
        loveNodes: {
            default: [],
            type: cc.Node
        },
        gameOverNode: cc.Node,
        scoreLabel: cc.Label,
        tipsNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.game = this;
        this.game_over = false;
        this.count = 1
        this.score = 0
        this.initPhysics()

        this.factory = setInterval(() => {
            this.count++;
            if (Math.random() > 0.5) {
                this.getOneCircle()
            } else {
                this.getOneRec()
            }
        }, this.speed);

        this.node.on("touchstart", this.touchStart, this)
        if (!localStorage.getItem('isTipshow')) {
            this.tipsNode.active = true;
        } else {
            this.tipsNode.active = false;
        }
    },
    isee() {
        localStorage.setItem('isTipshow', false)
        this.tipsNode.active = false;
    },
    doAnimate(e) {

        let node = this.loveNodes[this.loveNodes.length - 1]

        node.runAction(cc.sequence(cc.moveTo(1, cc.v2(node.x, -this.node.height)), cc.callFunc(() => {
            node.active = false;
            this.loveNodes.splice(this.loveNodes.length - 1, 1)
            if (this.loveNodes.length <= 0) {
                this.gameOver()
            }
        })))
    },
    touchStart(e) {
        console.log(e.getLocation().x)
        if (e.getLocation().x > 720 / 2) {
            //右边 圆

            if (this.getFirstType() == NAME_FOR_RECTANGLE) {
                if (this.loveNodes.length > 0) {
                    this.doAnimate(e)
                }
                return
            }
            for (let i = 0; i < this.nodes.length; i++) {
                const element = this.nodes[i];

                if (element.name == NAME_FOR_CIRCLE) {

                    if (element.getComponent(NAME_FOR_CIRCLE).isAlive) {
                        console.log(NAME_FOR_CIRCLE, element.position)
                        this.boom(element.position)
                        if (!this.game_over) {
                            this.score += 1
                        }

                        element.active = false;
                        this.nodes.splice(i, 1)
                        break;
                    }

                }

            }
        } else if (e.getLocation().x <= 720 / 2) {
            //左边 方

            if (this.getFirstType() == NAME_FOR_CIRCLE) {
                if (this.loveNodes.length > 0) {
                    this.doAnimate(e)


                }
                return
            }
            for (let i = 0; i < this.nodes.length; i++) {
                const element = this.nodes[i];
                console.log(element.name)
                if (element.name == NAME_FOR_RECTANGLE) {

                    if (element.getComponent(NAME_FOR_RECTANGLE).isAlive) {
                        console.log(NAME_FOR_RECTANGLE, element.position)
                        this.boom(element.position)
                        if (!this.game_over) {
                            this.score += 2
                        }

                        element.active = false;
                        this.nodes.splice(i, 1)
                        break;
                    }
                }

            }
        }
    },
    getFirstType() {
        for (let i = 0; i < this.nodes.length; i++) {
            const element = this.nodes[i];

            if (element.name == NAME_FOR_CIRCLE) {

                if (element.getComponent(NAME_FOR_CIRCLE) != null) {
                    if (element.getComponent(NAME_FOR_CIRCLE).isAlive) {
                        console.log("firstType", NAME_FOR_CIRCLE)
                        return NAME_FOR_CIRCLE

                    }
                }
            } else {

                if (element.getComponent(NAME_FOR_RECTANGLE) != null) {
                    if (element.getComponent(NAME_FOR_RECTANGLE).isAlive) {
                        console.log("firstType", NAME_FOR_RECTANGLE)
                        return NAME_FOR_RECTANGLE
                    }
                }

            }

        }
    },
    onDestroy() {
        this.node.off("touchstart", this.touchStart, this)
    },
    initPhysics() {
        let manager = cc.director.getPhysicsManager()
        manager.enabled = true;
        // manager.debugDrawFlags = true;

        manager.gravity = cc.v2(0, this.gravity)
    },
    boom(pos, color) {
        this.boomNode.setPosition(pos)
        let particle = this.boomNode.getComponent(cc.ParticleSystem)
        if (color != undefined) {
            let cccolor = cc.Color.WHITE

            particle.startColor = particle.endColor = cccolor.fromHEX(color);
        } else {
            particle.startColor = particle.endColor = cc.Color.WHITE
        }
        particle.resetSystem();
    },
    getOneCircle() {
        let random = Math.random() > 0.5 ? 1 : -1
        if (this.circlePrefab) {
            let circle = cc.instantiate(this.circlePrefab)

            circle.x = Math.random() * random * (720 - circle.width) / 2;
            circle.y = 1280 / 2 + circle.height / 2;
            this.node.addChild(circle)
            this.nodes.push(circle)

            this.doUpdateSpeed();
        }

    },

    getOneRec() {
        let random = Math.random() > 0.5 ? 1 : -1
        if (this.recPrefab) {
            let rec = cc.instantiate(this.recPrefab)

            rec.x = Math.random() * random * (720 - rec.width) / 2;

            rec.y = 1280 / 2 + rec.height / 2;
            this.node.addChild(rec)
            this.nodes.push(rec)
            this.doUpdateSpeed();
        }
    },

    doUpdateSpeed() {
        if (this.count % 5 == 0) {
            clearInterval(this.factory)
            this.factory = null;
            this.speed -= 40;
            if (this.speed <= 0) {
                this.speed = 100;
            }
            this.gravity -= 100;
            this.factory = setInterval(() => {
                this.count++;
                if (Math.random() > 0.5) {
                    this.getOneCircle()
                } else {
                    this.getOneRec()
                }
            }, this.speed);
        }
    },
    update(dt) {
        if (!this.game_over) {
            this.scoreLabel.string = this.score
        }
        for (let i = 0; i < this.nodes.length; i++) {
            const element = this.nodes[i];

            if (element.name == NAME_FOR_CIRCLE) {

                this.getNodeIsAlive(element, NAME_FOR_CIRCLE, () => {
                    if (element.y >= 1280 / 2) {
                        console.log(element.y)
                        this.gameOver()
                    }
                })


            } else {

                this.getNodeIsAlive(element, NAME_FOR_RECTANGLE, () => {
                    if (element.y >= 1280 / 2) {
                        console.log(element.y)
                        this.gameOver()
                    }
                })

            }

        }


    },

    gameOver() {
        this.game_over = true;
        for (let i = 0; i < this.nodes.length; i++) {
            const element = this.nodes[i];
            element.active = false;
        }

        this.gameOverNode.active = true;
        let gameoverComp = this.gameOverNode.getComponent("gameover")
        if (gameoverComp == null) {
            console.log("找不到脚本")
            return
        }
        this.gameOverNode.getComponent("gameover").setScoreLabel(this.score)
        // clearInterval(this.factory)
        // this.factory = null;
    },


    getNodeIsAlive(element, name, callback) {
        if (element.getComponent(name) != null) {
            if (!element.getComponent(name).isAlive) {
                callback()
            }
        }
    }


});
