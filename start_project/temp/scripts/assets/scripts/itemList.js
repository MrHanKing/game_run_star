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