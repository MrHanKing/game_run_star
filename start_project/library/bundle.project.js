require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"game":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'b92c6KWLeJChZoRXaEBQ9it', 'game');
// scripts/game.js

'use strict';

var scoreFX = require('scoreFX');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        //引用星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        scoreFXPrefab: {
            default: null,
            type: cc.Prefab
        },
        //星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        //地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        //player节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },
        btnNode: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        //获取地平面的y轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        //初始化星星存在时间
        this.starDuration = 0;
        this.score = 0;
        this.isRunning = false;

        //对象池
        this.scoreFXPool = new cc.NodePool('scoreFX');
    },

    onStartGame: function onStartGame() {
        this.resetScore();
        this.isRunning = true;
        this.btnNode.setPositionX(3000);
        this.player.getComponent("player").starMoveAt(cc.p(0, this.groundY));
        this.player.getComponent("player").game = this;
        //生成一个新的星星
        this.spawnNewStar();
    },

    resetScore: function resetScore() {
        this.score = 0;
        this.scoreDisplay.string = "Score:" + this.score.toString();
    },

    spawnNewStar: function spawnNewStar() {
        //使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        //将新增的节点添加到Canvas节点下面
        this.node.addChild(newStar);
        //为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        //设置星星存在时间&重置gameOver计时器
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
        //将game组件的实例传入星星组件
        newStar.getComponent('star').game = this;
    },

    //随机生成星星坐标位置
    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('player').jumpHeight + 29;
        var maxX = this.node.width / 2;
        randX = cc.randomMinus1To1() * maxX;
        return cc.p(randX, randY);
    },

    //得分
    gainScore: function gainScore(pos) {
        var self = this;
        self.score += 1;
        self.scoreDisplay.string = "Score:" + self.score.toString();
        //effect and music
        var oneSFX = this.spawnScoreFX();
        this.node.addChild(oneSFX.node);
        oneSFX.node.setPosition(pos);
        oneSFX.play();
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    update: function update(dt) {
        if (!this.isRunning) return;
        //游戏失败
        if (this.timer > this.starDuration) {
            this.gameOver();
            console.log("youxijieshu");
            return;
        }
        this.timer += dt;
    },

    //结束游戏重载场景
    gameOver: function gameOver() {
        this.player.stopAllActions();
        cc.director.loadScene('game');
        this.isRunning = false;
        this.btnNode.setPositionX(0);
        this.player.getComponent("player").stopMove();
        this.player.getComponent("player").enabled = false;
    },

    getSceneSize: function getSceneSize() {
        console.log("scene width:", this.node.getContentSize().width);
        return this.node.getContentSize();
    },

    spawnScoreFX: function spawnScoreFX() {
        var oneSFX;
        if (this.scoreFXPool.size() > 0) {
            oneSFX = this.scoreFXPool.get();
            return oneSFX.getComponent('scoreFX');
        } else {
            oneSFX = cc.instantiate(this.scoreFXPrefab);
            oneSFX.getComponent('scoreFX').init(this);
            return oneSFX.getComponent('scoreFX');
        }
    },

    despawnScoreFX: function despawnScoreFX(scoreFX) {
        this.scoreFXPool.put(scoreFX);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{"scoreFX":"scoreFX"}],"itemList":[function(require,module,exports){
"use strict";
cc._RF.push(module, '63f995LmchMEKG9hprOgnGN', 'itemList');
// scripts/itemList.js

"use strict";

var item = cc.Class({
    name: "item",
    properties: {
        id: 0,
        name: "",
        price: 0,
        icon: cc.SpriteFrame
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        items: {
            default: [],
            type: [item]
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        for (var i = 0; i < this.items.length; ++i) {
            var item = cc.instantiate(this.itemPrefab);
            var data = this.items[i];
            cc.log("********************" + data.name);
            this.node.addChild(item);
            item.getComponent("itemTemplate").init({
                id: data.id,
                name: data.name,
                price: data.price,
                icon: data.icon
            });
        }
    }

});

cc._RF.pop();
},{}],"itemTemplate":[function(require,module,exports){
"use strict";
cc._RF.push(module, '33193yBYY9AH7eoLYdA+ItO', 'itemTemplate');
// scripts/itemTemplate.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        id: 0,
        itemName: cc.Label,
        itemPrice: cc.Label,
        itemIcon: cc.Sprite
    },

    // use this for initialization
    onLoad: function onLoad() {},

    init: function init(date) {
        this.id = date.id;
        this.itemName.string = date.name;
        this.itemPrice.string = date.price;
        this.itemIcon.spriteFrame = date.icon;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{}],"player":[function(require,module,exports){
"use strict";
cc._RF.push(module, '857e1lQqlZCyYWYZXoq56Bo', 'player');
// scripts/player.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        //主角跳跃高度
        jumpHeight: 0,
        //主角跳跃持续时间
        jumpTime: 0,
        //最大移动速度
        maxMoveSpeed: 0,
        //加速度
        accel: 0,
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    //跳跃
    setJumpAction: function setJumpAction() {
        var _squashDuration = 0.1;
        //跳跃
        var self = this;
        var jumpUp = cc.moveBy(self.jumpTime, cc.p(0, self.jumpHeight)).easing(cc.easeCubicActionOut());
        //下落
        var jumpDown = cc.moveBy(self.jumpTime, cc.p(0, -self.jumpHeight)).easing(cc.easeCubicActionIn());
        //形变
        var squash = cc.scaleTo(_squashDuration, 1, 0.6);
        var stretch = cc.scaleTo(_squashDuration, 1, 1.2);
        var scaleBack = cc.scaleTo(_squashDuration, 1, 1);
        //设置音乐回调
        var callback = cc.callFunc(this.playJumpSound, this);
        //循环
        return cc.repeatForever(cc.sequence(squash, stretch, jumpUp, scaleBack, jumpDown, callback));
    },

    //调用音乐函数
    playJumpSound: function playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    //设置输入控制
    setInputControl: function setInputControl() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            //按下键
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            //松开键
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function onTouchBegan(touch, event) {
                var touchLoc = touch.getLocation();
                console.log('touch in pos：', touchLoc.x, touchLoc.y);
                if (touchLoc.x >= cc.winSize.width / 2) {
                    self.accLeft = false;
                    self.accRight = true;
                } else {
                    self.accLeft = true;
                    self.accRight = false;
                }
                return true;
            },
            onTouchEnded: function onTouchEnded(touch, event) {
                self.accLeft = false;
                self.accRight = false;
            }
        }, self.node);
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.enabled = false;
        //初始化跳跃
        this.jumpAction = this.setJumpAction();

        //加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;

        //初始化键盘输入
        this.setInputControl();
    },

    update: function update(dt) {
        //根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            //方向切换直接更改速度方向
            this.xSpeed = this.xSpeed > 0 ? -this.xSpeed : this.xSpeed;
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed = this.xSpeed < 0 ? -this.xSpeed : this.xSpeed;
            this.xSpeed += this.accel * dt;
        } else {
            //不按键时自衰减速度
            this.xSpeed -= this.xSpeed * dt;
            if (Math.abs(this.xSpeed) < 1) {
                this.xSpeed = 0;
            }
        }
        //限制主角的最大速度
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        //根据速度更新主角位置
        this.node.x += this.xSpeed * dt;
        // 场景行走区域判断
        var sceneSizeW = this.game.getSceneSize().width;
        console.log("sceneSizeW:", sceneSizeW);
        if (Math.abs(this.node.x) > sceneSizeW / 2 - this.node.width / 2) {
            this.node.x = (sceneSizeW / 2 - this.node.width / 2) * this.node.x / Math.abs(this.node.x);
        }
    },

    starMoveAt: function starMoveAt(pos) {
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);
        this.node.runAction(this.jumpAction);
    },

    stopMove: function stopMove() {
        this.node.stopAllActions();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{}],"scoreAnim":[function(require,module,exports){
"use strict";
cc._RF.push(module, '0cb46NnZ0ZOwq7gg+F0KBHM', 'scoreAnim');
// scripts/scoreAnim.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    init: function init(scoreFX) {
        this.scoreFX = scoreFX;
    },

    //帧事件，结束时put入对象池
    finishPutInPool: function finishPutInPool() {
        this.scoreFX.despawn();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{}],"scoreFX":[function(require,module,exports){
"use strict";
cc._RF.push(module, '93142ZS2oNBsI8sBv4JSd70', 'scoreFX');
// scripts/scoreFX.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        anim: {
            default: null,
            type: cc.Animation
        }
    },

    // use this for initialization
    init: function init(game) {
        this.game = game;
        this.anim.getComponent("scoreAnim").init(this);
    },

    //销毁 put入对象池
    despawn: function despawn() {
        this.game.despawnScoreFX(this.node);
    },

    play: function play() {
        this.anim.play("score_pop");
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{}],"star":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'e0012q1dGNFZo1rLy3Rmr1p', 'star');
// scripts/star.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        // 星星和主角之间的距离小于这个数值时，就会完成收集
        pickRadius: 0,
        starBar: {
            default: null,
            type: cc.ProgressBar
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        //this.starBar.progress = 0;
    },

    getPlayerDistance: function getPlayerDistance() {
        //根据player节点位置判断距离
        var playerPos = this.game.player.getPosition();
        //计算距离
        var distance = cc.pDistance(this.node.position, playerPos);
        return distance;
    },

    onPicked: function onPicked() {
        //当星星被收集时，调用Game脚本中的接口，生成新的星星。
        this.game.spawnNewStar();
        //销毁当前星星
        this.node.destroy();
    },

    update: function update() {
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            this.game.gainScore(this.node.getPosition());
            return;
        }
        //根据存在时间改变星星透明度
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
        this.starBar.progress = this.game.timer / this.game.starDuration;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{}]},{},["game","itemList","itemTemplate","player","scoreAnim","scoreFX","star"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2dhbWUuanMiLCJhc3NldHMvc2NyaXB0cy9pdGVtTGlzdC5qcyIsImFzc2V0cy9zY3JpcHRzL2l0ZW1UZW1wbGF0ZS5qcyIsImFzc2V0cy9zY3JpcHRzL3BsYXllci5qcyIsImFzc2V0cy9zY3JpcHRzL3Njb3JlQW5pbS5qcyIsImFzc2V0cy9zY3JpcHRzL3Njb3JlRlguanMiLCJhc3NldHMvc2NyaXB0cy9zdGFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZPO0FBSVg7QUFDSTtBQUNBO0FBRlU7QUFJZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZHO0FBSVA7QUFDQTtBQUNJO0FBQ0E7QUFGRztBQUlQO0FBQ0k7QUFDQTtBQUZTO0FBSWI7QUFDSTtBQUNBO0FBRk87QUFJWDtBQUNJO0FBQ0E7QUFGSTtBQXpDQTs7QUErQ1o7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0E7QUFDSDtBQUNKOztBQUVEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7O0FBRUE7QUEvSks7Ozs7Ozs7Ozs7QUNGVDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUpPO0FBRks7O0FBVXBCO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZFO0FBSU47QUFDSTtBQUNBO0FBRk87QUFmSDs7QUFxQlo7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBSm1DO0FBTzFDO0FBRUo7O0FBeENJOzs7Ozs7Ozs7O0FDVlQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFkUTs7QUFpQlo7QUFDQTs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQTtBQW5DSzs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGTTtBQW5CRjs7QUF5Qlo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQVJSO0FBVUg7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFOUjtBQVFIO0FBekJ1Qjs7QUE0QjVCO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQWxCdUI7QUFvQi9COztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQTtBQXRLSzs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZROztBQWFaO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTs7QUFFQTtBQTVCSzs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZDO0FBWEc7O0FBaUJaO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7QUF0Q0s7Ozs7Ozs7Ozs7QUNBVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRkk7QUFiQTs7QUFtQlo7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBOztBQUVBO0FBMURLIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2NvcmVGWCA9IHJlcXVpcmUoJ3Njb3JlRlgnKTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICAvL+W8leeUqOaYn+aYn+mihOWItui1hOa6kFxyXG4gICAgICAgIHN0YXJQcmVmYWI6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY29yZUZYUHJlZmFiOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/mmJ/mmJ/kuqfnlJ/lkI7mtojlpLHml7bpl7TnmoTpmo/mnLrojIPlm7RcclxuICAgICAgICBtYXhTdGFyRHVyYXRpb246MCxcclxuICAgICAgICBtaW5TdGFyRHVyYXRpb246MCxcclxuICAgICAgICAvL+WcsOmdouiKgueCue+8jOeUqOS6juehruWumuaYn+aYn+eUn+aIkOeahOmrmOW6plxyXG4gICAgICAgIGdyb3VuZDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvL3BsYXllcuiKgueCue+8jOeUqOS6juiOt+WPluS4u+inkuW8uei3s+eahOmrmOW6pu+8jOWSjOaOp+WItuS4u+inkuihjOWKqOW8gOWFs1xyXG4gICAgICAgIHBsYXllcjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY29yZURpc3BsYXk6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTGFiZWxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjb3JlQXVkaW86e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHVybDpjYy5BdWRpb0NsaXBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJ0bk5vZGU6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvL+iOt+WPluWcsOW5s+mdoueahHnovbTlnZDmoIdcclxuICAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0IC8gMjtcclxuICAgICAgICAvL+WIneWni+WMluaYn+aYn+WtmOWcqOaXtumXtFxyXG4gICAgICAgIHRoaXMuc3RhckR1cmF0aW9uID0gMDtcclxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL+WvueixoeaxoFxyXG4gICAgICAgIHRoaXMuc2NvcmVGWFBvb2wgPSBuZXcgY2MuTm9kZVBvb2woJ3Njb3JlRlgnKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25TdGFydEdhbWU6ZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLnJlc2V0U2NvcmUoKTtcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5idG5Ob2RlLnNldFBvc2l0aW9uWCgzMDAwKTtcclxuICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJwbGF5ZXJcIikuc3Rhck1vdmVBdChjYy5wKDAsdGhpcy5ncm91bmRZKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwicGxheWVyXCIpLmdhbWUgPSB0aGlzO1xyXG4gICAgICAgIC8v55Sf5oiQ5LiA5Liq5paw55qE5pif5pifXHJcbiAgICAgICAgdGhpcy5zcGF3bk5ld1N0YXIoKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXRTY29yZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xyXG4gICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5LnN0cmluZyA9IFwiU2NvcmU6XCIgKyB0aGlzLnNjb3JlLnRvU3RyaW5nKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNwYXduTmV3U3RhcjpmdW5jdGlvbigpe1xyXG4gICAgICAgIC8v5L2/55So57uZ5a6a55qE5qih5p2/5Zyo5Zy65pmv5Lit55Sf5oiQ5LiA5Liq5paw6IqC54K5XHJcbiAgICAgICAgdmFyIG5ld1N0YXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnN0YXJQcmVmYWIpO1xyXG4gICAgICAgIC8v5bCG5paw5aKe55qE6IqC54K55re75Yqg5YiwQ2FudmFz6IqC54K55LiL6Z2iXHJcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xyXG4gICAgICAgIC8v5Li65pif5pif6K6+572u5LiA5Liq6ZqP5py65L2N572uXHJcbiAgICAgICAgbmV3U3Rhci5zZXRQb3NpdGlvbih0aGlzLmdldE5ld1N0YXJQb3NpdGlvbigpKTtcclxuICAgICAgICAvL+iuvue9ruaYn+aYn+WtmOWcqOaXtumXtCbph43nva5nYW1lT3ZlcuiuoeaXtuWZqFxyXG4gICAgICAgIHRoaXMuc3RhckR1cmF0aW9uID0gdGhpcy5taW5TdGFyRHVyYXRpb24gKyBjYy5yYW5kb20wVG8xKCkgKiAodGhpcy5tYXhTdGFyRHVyYXRpb24gLSB0aGlzLm1pblN0YXJEdXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XHJcbiAgICAgICAgLy/lsIZnYW1l57uE5Lu255qE5a6e5L6L5Lyg5YWl5pif5pif57uE5Lu2XHJcbiAgICAgICAgbmV3U3Rhci5nZXRDb21wb25lbnQoJ3N0YXInKS5nYW1lID0gdGhpcztcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8v6ZqP5py655Sf5oiQ5pif5pif5Z2Q5qCH5L2N572uXHJcbiAgICBnZXROZXdTdGFyUG9zaXRpb246ZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgcmFuZFggPSAwO1xyXG4gICAgICAgIHZhciByYW5kWSA9IHRoaXMuZ3JvdW5kWSArIGNjLnJhbmRvbTBUbzEoKSAqIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgncGxheWVyJykuanVtcEhlaWdodCArIDI5O1xyXG4gICAgICAgIHZhciBtYXhYID0gdGhpcy5ub2RlLndpZHRoLzI7XHJcbiAgICAgICAgcmFuZFggPSBjYy5yYW5kb21NaW51czFUbzEoKSAqIG1heFg7XHJcbiAgICAgICAgcmV0dXJuIGNjLnAocmFuZFgscmFuZFkpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy/lvpfliIZcclxuICAgIGdhaW5TY29yZTpmdW5jdGlvbihwb3Mpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnNjb3JlICs9IDE7XHJcbiAgICAgICAgc2VsZi5zY29yZURpc3BsYXkuc3RyaW5nID0gXCJTY29yZTpcIiArIHNlbGYuc2NvcmUudG9TdHJpbmcoKTtcclxuICAgICAgICAvL2VmZmVjdCBhbmQgbXVzaWNcclxuICAgICAgICB2YXIgb25lU0ZYID0gdGhpcy5zcGF3blNjb3JlRlgoKTtcclxuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQob25lU0ZYLm5vZGUpO1xyXG4gICAgICAgIG9uZVNGWC5ub2RlLnNldFBvc2l0aW9uKHBvcyk7XHJcbiAgICAgICAgb25lU0ZYLnBsYXkoKTtcclxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuc2NvcmVBdWRpbyxmYWxzZSk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICB1cGRhdGU6ZnVuY3Rpb24oZHQpe1xyXG4gICAgICAgIGlmICghdGhpcy5pc1J1bm5pbmcpIHJldHVybjtcclxuICAgICAgICAvL+a4uOaIj+Wksei0pVxyXG4gICAgICAgIGlmICh0aGlzLnRpbWVyID4gdGhpcy5zdGFyRHVyYXRpb24pe1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieW91eGlqaWVzaHVcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aW1lciArPSBkdDtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8v57uT5p2f5ri45oiP6YeN6L295Zy65pmvXHJcbiAgICBnYW1lT3ZlcjpmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMucGxheWVyLnN0b3BBbGxBY3Rpb25zKCk7XHJcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdnYW1lJyk7XHJcbiAgICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJ0bk5vZGUuc2V0UG9zaXRpb25YKDApO1xyXG4gICAgICAgIHRoaXMucGxheWVyLmdldENvbXBvbmVudChcInBsYXllclwiKS5zdG9wTW92ZSgpO1xyXG4gICAgICAgIHRoaXMucGxheWVyLmdldENvbXBvbmVudChcInBsYXllclwiKS5lbmFibGVkID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFNjZW5lU2l6ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwic2NlbmUgd2lkdGg6XCIsdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKTsgXHJcbiAgICB9LFxyXG5cclxuICAgIHNwYXduU2NvcmVGWDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG9uZVNGWDsgXHJcbiAgICAgICAgaWYgKHRoaXMuc2NvcmVGWFBvb2wuc2l6ZSgpID4gMCkge1xyXG4gICAgICAgICAgICBvbmVTRlggPSB0aGlzLnNjb3JlRlhQb29sLmdldCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gb25lU0ZYLmdldENvbXBvbmVudCgnc2NvcmVGWCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgb25lU0ZYID0gY2MuaW5zdGFudGlhdGUodGhpcy5zY29yZUZYUHJlZmFiKTtcclxuICAgICAgICAgICAgb25lU0ZYLmdldENvbXBvbmVudCgnc2NvcmVGWCcpLmluaXQodGhpcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBvbmVTRlguZ2V0Q29tcG9uZW50KCdzY29yZUZYJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBkZXNwYXduU2NvcmVGWDpmdW5jdGlvbiAoc2NvcmVGWCkge1xyXG4gICAgICAgIHRoaXMuc2NvcmVGWFBvb2wucHV0KHNjb3JlRlgpO1xyXG4gICAgfVxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsInZhciBpdGVtID0gY2MuQ2xhc3Moe1xyXG4gICAgbmFtZTpcIml0ZW1cIixcclxuICAgIHByb3BlcnRpZXM6e1xyXG4gICAgICAgIGlkOjAsXHJcbiAgICAgICAgbmFtZTpcIlwiLFxyXG4gICAgICAgIHByaWNlOjAsXHJcbiAgICAgICAgaWNvbjpjYy5TcHJpdGVGcmFtZVxyXG4gICAgfVxyXG59KTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICBpdGVtczp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6W10sXHJcbiAgICAgICAgICAgIHR5cGU6W2l0ZW1dXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpdGVtUHJlZmFiOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDtpPHRoaXMuaXRlbXMubGVuZ3RoOysraSl7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5pdGVtUHJlZmFiKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLml0ZW1zW2ldO1xyXG4gICAgICAgICAgICBjYy5sb2coXCIqKioqKioqKioqKioqKioqKioqKlwiICsgZGF0YS5uYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudChcIml0ZW1UZW1wbGF0ZVwiKS5pbml0KHtcclxuICAgICAgICAgICAgICAgIGlkOmRhdGEuaWQsXHJcbiAgICAgICAgICAgICAgICBuYW1lOmRhdGEubmFtZSxcclxuICAgICAgICAgICAgICAgIHByaWNlOmRhdGEucHJpY2UsXHJcbiAgICAgICAgICAgICAgICBpY29uOmRhdGEuaWNvblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICBpZDowLFxyXG4gICAgICAgIGl0ZW1OYW1lOmNjLkxhYmVsLFxyXG4gICAgICAgIGl0ZW1QcmljZTpjYy5MYWJlbCxcclxuICAgICAgICBpdGVtSWNvbjpjYy5TcHJpdGVcclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6ZnVuY3Rpb24oZGF0ZSl7XHJcbiAgICAgICAgdGhpcy5pZCA9IGRhdGUuaWQ7XHJcbiAgICAgICAgdGhpcy5pdGVtTmFtZS5zdHJpbmcgPSBkYXRlLm5hbWU7XHJcbiAgICAgICAgdGhpcy5pdGVtUHJpY2Uuc3RyaW5nID0gZGF0ZS5wcmljZTtcclxuICAgICAgICB0aGlzLml0ZW1JY29uLnNwcml0ZUZyYW1lID0gZGF0ZS5pY29uO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICAgICAgLy/kuLvop5Lot7Pot4Ppq5jluqZcclxuICAgICAgICBqdW1wSGVpZ2h0OjAsXHJcbiAgICAgICAgLy/kuLvop5Lot7Pot4PmjIHnu63ml7bpl7RcclxuICAgICAgICBqdW1wVGltZTowLFxyXG4gICAgICAgIC8v5pyA5aSn56e75Yqo6YCf5bqmXHJcbiAgICAgICAgbWF4TW92ZVNwZWVkOjAsXHJcbiAgICAgICAgLy/liqDpgJ/luqZcclxuICAgICAgICBhY2NlbDowLFxyXG4gICAgICAgIGp1bXBBdWRpbzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdXJsOmNjLkF1ZGlvQ2xpcFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvL+i3s+i3g1xyXG4gICAgc2V0SnVtcEFjdGlvbjpmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBfc3F1YXNoRHVyYXRpb24gPSAwLjE7XHJcbiAgICAgICAgLy/ot7Pot4NcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGp1bXBVcCA9IGNjLm1vdmVCeShzZWxmLmp1bXBUaW1lLCBjYy5wKDAsc2VsZi5qdW1wSGVpZ2h0KSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKTtcclxuICAgICAgICAvL+S4i+iQvVxyXG4gICAgICAgIHZhciBqdW1wRG93biA9IGNjLm1vdmVCeShzZWxmLmp1bXBUaW1lLCBjYy5wKDAsLXNlbGYuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcclxuICAgICAgICAvL+W9ouWPmFxyXG4gICAgICAgIHZhciBzcXVhc2ggPSBjYy5zY2FsZVRvKF9zcXVhc2hEdXJhdGlvbiwgMSwgMC42KTtcclxuICAgICAgICB2YXIgc3RyZXRjaCA9IGNjLnNjYWxlVG8oX3NxdWFzaER1cmF0aW9uLCAxLCAxLjIpO1xyXG4gICAgICAgIHZhciBzY2FsZUJhY2sgPSBjYy5zY2FsZVRvKF9zcXVhc2hEdXJhdGlvbiwgMSwgMSk7XHJcbiAgICAgICAgLy/orr7nva7pn7PkuZDlm57osINcclxuICAgICAgICB2YXIgY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlKdW1wU291bmQsIHRoaXMpO1xyXG4gICAgICAgIC8v5b6q546vXHJcbiAgICAgICAgcmV0dXJuIGNjLnJlcGVhdEZvcmV2ZXIoY2Muc2VxdWVuY2Uoc3F1YXNoLCBzdHJldGNoLCBqdW1wVXAsIHNjYWxlQmFjaywganVtcERvd24sIGNhbGxiYWNrKSk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvL+iwg+eUqOmfs+S5kOWHveaVsFxyXG4gICAgcGxheUp1bXBTb3VuZDpmdW5jdGlvbigpe1xyXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5qdW1wQXVkaW8sIGZhbHNlKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8v6K6+572u6L6T5YWl5o6n5Yi2XHJcbiAgICBzZXRJbnB1dENvbnRyb2w6ZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHtcclxuICAgICAgICAgICAgZXZlbnQ6Y2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcclxuICAgICAgICAgICAgLy/mjInkuIvplK5cclxuICAgICAgICAgICAgb25LZXlQcmVzc2VkOmZ1bmN0aW9uKGtleUNvZGUsZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKGtleUNvZGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjUmlnaHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy/mnb7lvIDplK5cclxuICAgICAgICAgICAgb25LZXlSZWxlYXNlZDpmdW5jdGlvbihrZXlDb2RlLGV2ZW50KXtcclxuICAgICAgICAgICAgICAgIHN3aXRjaChrZXlDb2RlKXtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5hOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY0xlZnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHNlbGYubm9kZSk7XHJcblxyXG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XHJcbiAgICAgICAgICAgIGV2ZW50OmNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSxcclxuICAgICAgICAgICAgb25Ub3VjaEJlZ2FuOmZ1bmN0aW9uICh0b3VjaCwgZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b3VjaExvYyA9IHRvdWNoLmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndG91Y2ggaW4gcG9z77yaJywgdG91Y2hMb2MueCwgdG91Y2hMb2MueSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodG91Y2hMb2MueCA+PSBjYy53aW5TaXplLndpZHRoIC8gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25Ub3VjaEVuZGVkOmZ1bmN0aW9uKHRvdWNoLCBldmVudCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gZmFsc2U7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgc2VsZi5ub2RlKVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIC8v5Yid5aeL5YyW6Lez6LeDXHJcbiAgICAgICAgdGhpcy5qdW1wQWN0aW9uID0gdGhpcy5zZXRKdW1wQWN0aW9uKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy/liqDpgJ/luqbmlrnlkJHlvIDlhbNcclxuICAgICAgICB0aGlzLmFjY0xlZnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFjY1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy54U3BlZWQgPSAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8v5Yid5aeL5YyW6ZSu55uY6L6T5YWlXHJcbiAgICAgICAgdGhpcy5zZXRJbnB1dENvbnRyb2woKVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgdXBkYXRlOmZ1bmN0aW9uKGR0KXtcclxuICAgICAgICAvL+agueaNruW9k+WJjeWKoOmAn+W6puaWueWQkeavj+W4p+abtOaWsOmAn+W6plxyXG4gICAgICAgIGlmICh0aGlzLmFjY0xlZnQpe1xyXG4gICAgICAgICAgICAvL+aWueWQkeWIh+aNouebtOaOpeabtOaUuemAn+W6puaWueWQkVxyXG4gICAgICAgICAgICB0aGlzLnhTcGVlZCA9ICh0aGlzLnhTcGVlZCA+IDApID8gLXRoaXMueFNwZWVkOnRoaXMueFNwZWVkO1xyXG4gICAgICAgICAgICB0aGlzLnhTcGVlZCAtPSB0aGlzLmFjY2VsICogZHQ7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBlbHNlIGlmICh0aGlzLmFjY1JpZ2h0KXtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSAodGhpcy54U3BlZWQgPCAwKSA/IC10aGlzLnhTcGVlZDp0aGlzLnhTcGVlZDtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgKz0gdGhpcy5hY2NlbCAqIGR0O1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8v5LiN5oyJ6ZSu5pe26Ieq6KGw5YeP6YCf5bqmXHJcbiAgICAgICAgICAgIHRoaXMueFNwZWVkIC09IHRoaXMueFNwZWVkICogZHQ7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh0aGlzLnhTcGVlZCkgPCAxKXtcclxuICAgICAgICAgICAgICAgIHRoaXMueFNwZWVkID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL+mZkOWItuS4u+inkueahOacgOWkp+mAn+W6plxyXG4gICAgICAgIGlmICggTWF0aC5hYnModGhpcy54U3BlZWQpID4gdGhpcy5tYXhNb3ZlU3BlZWQpe1xyXG4gICAgICAgICAgICB0aGlzLnhTcGVlZCA9IHRoaXMubWF4TW92ZVNwZWVkICogdGhpcy54U3BlZWQgLyBNYXRoLmFicyh0aGlzLnhTcGVlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+agueaNrumAn+W6puabtOaWsOS4u+inkuS9jee9rlxyXG4gICAgICAgIHRoaXMubm9kZS54ICs9IHRoaXMueFNwZWVkICogZHRcclxuICAgICAgICAvLyDlnLrmma/ooYzotbDljLrln5/liKTmlq1cclxuICAgICAgICB2YXIgc2NlbmVTaXplVyA9IHRoaXMuZ2FtZS5nZXRTY2VuZVNpemUoKS53aWR0aDtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInNjZW5lU2l6ZVc6XCIsc2NlbmVTaXplVyk7XHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMubm9kZS54KSA+IHNjZW5lU2l6ZVcgLyAyIC0gdGhpcy5ub2RlLndpZHRoIC8gMikge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUueCA9IChzY2VuZVNpemVXIC8gMiAtIHRoaXMubm9kZS53aWR0aCAvIDIpICogdGhpcy5ub2RlLnggLyBNYXRoLmFicyh0aGlzLm5vZGUueCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzdGFyTW92ZUF0OmZ1bmN0aW9uKHBvcyl7XHJcbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XHJcbiAgICAgICAgdGhpcy5ub2RlLnNldFBvc2l0aW9uKHBvcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbih0aGlzLmp1bXBBY3Rpb24pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdG9wTW92ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMubm9kZS5zdG9wQWxsQWN0aW9ucygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgaW5pdDogZnVuY3Rpb24gKHNjb3JlRlgpIHtcclxuICAgICAgICB0aGlzLnNjb3JlRlggPSBzY29yZUZYO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+W4p+S6i+S7tu+8jOe7k+adn+aXtnB1dOWFpeWvueixoeaxoFxyXG4gICAgZmluaXNoUHV0SW5Qb29sOmZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnNjb3JlRlguZGVzcGF3bigpO1xyXG4gICAgfVxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICBhbmltOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLkFuaW1hdGlvblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoZ2FtZSkge1xyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgdGhpcy5hbmltLmdldENvbXBvbmVudChcInNjb3JlQW5pbVwiKS5pbml0KHRoaXMpOyBcclxuICAgIH0sXHJcblxyXG4gICAgLy/plIDmr4EgcHV05YWl5a+56LGh5rGgXHJcbiAgICBkZXNwYXduOmZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmdhbWUuZGVzcGF3blNjb3JlRlgodGhpcy5ub2RlKTtcclxuICAgIH0sXHJcblxyXG4gICAgcGxheTpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5hbmltLnBsYXkoXCJzY29yZV9wb3BcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICAvLyDmmJ/mmJ/lkozkuLvop5LkuYvpl7TnmoTot53nprvlsI/kuo7ov5nkuKrmlbDlgLzml7bvvIzlsLHkvJrlrozmiJDmlLbpm4ZcclxuICAgICAgICBwaWNrUmFkaXVzOjAsXHJcbiAgICAgICAgc3RhckJhcjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Qcm9ncmVzc0JhclxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvL3RoaXMuc3RhckJhci5wcm9ncmVzcyA9IDA7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBnZXRQbGF5ZXJEaXN0YW5jZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIC8v5qC55o2ucGxheWVy6IqC54K55L2N572u5Yik5pat6Led56a7XHJcbiAgICAgICAgdmFyIHBsYXllclBvcyA9IHRoaXMuZ2FtZS5wbGF5ZXIuZ2V0UG9zaXRpb24oKTtcclxuICAgICAgICAvL+iuoeeul+i3neemu1xyXG4gICAgICAgIHZhciBkaXN0YW5jZSA9IGNjLnBEaXN0YW5jZSh0aGlzLm5vZGUucG9zaXRpb24sIHBsYXllclBvcyk7XHJcbiAgICAgICAgcmV0dXJuIGRpc3RhbmNlO1xyXG4gICAgfSxcclxuICAgICAgICBcclxuICAgIG9uUGlja2VkOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy/lvZPmmJ/mmJ/ooqvmlLbpm4bml7bvvIzosIPnlKhHYW1l6ISa5pys5Lit55qE5o6l5Y+j77yM55Sf5oiQ5paw55qE5pif5pif44CCXHJcbiAgICAgICAgdGhpcy5nYW1lLnNwYXduTmV3U3RhcigpO1xyXG4gICAgICAgIC8v6ZSA5q+B5b2T5YmN5pif5pifXHJcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHVwZGF0ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmICh0aGlzLmdldFBsYXllckRpc3RhbmNlKCkgPCB0aGlzLnBpY2tSYWRpdXMpe1xyXG4gICAgICAgICAgICB0aGlzLm9uUGlja2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5nYWluU2NvcmUodGhpcy5ub2RlLmdldFBvc2l0aW9uKCkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v5qC55o2u5a2Y5Zyo5pe26Ze05pS55Y+Y5pif5pif6YCP5piO5bqmXHJcbiAgICAgICAgdmFyIG9wYWNpdHlSYXRpbyA9IDEgLSB0aGlzLmdhbWUudGltZXIvdGhpcy5nYW1lLnN0YXJEdXJhdGlvbjtcclxuICAgICAgICB2YXIgbWluT3BhY2l0eSA9IDUwO1xyXG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gbWluT3BhY2l0eSArIE1hdGguZmxvb3Iob3BhY2l0eVJhdGlvICogKDI1NSAtIG1pbk9wYWNpdHkpKTtcclxuICAgICAgICB0aGlzLnN0YXJCYXIucHJvZ3Jlc3MgPSB0aGlzLmdhbWUudGltZXIvdGhpcy5nYW1lLnN0YXJEdXJhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==