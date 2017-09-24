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