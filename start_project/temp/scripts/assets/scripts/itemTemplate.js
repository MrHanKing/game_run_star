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