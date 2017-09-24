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