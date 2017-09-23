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
            this.game.gainScore();
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