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