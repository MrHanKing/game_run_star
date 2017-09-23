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
        jumpHeight:0,
        //主角跳跃持续时间
        jumpTime:0,
        //最大移动速度
        maxMoveSpeed:0,
        //加速度
        accel:0,
        jumpAudio:{
            default:null,
            url:cc.AudioClip
        }
    },
    
    //跳跃
    setJumpAction:function(){
        //跳跃
        var self = this;
        var jumpUp = cc.moveBy(self.jumpTime, cc.p(0,self.jumpHeight)).easing(cc.easeCubicActionOut());
        //下落
        var jumpDown = cc.moveBy(self.jumpTime, cc.p(0,-self.jumpHeight)).easing(cc.easeCubicActionIn());
        //设置音乐回调
        var callback = cc.callFunc(this.playJumpSound, this);
        //循环
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },
    
    //调用音乐函数
    playJumpSound:function(){
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },
    
    //设置输入控制
    setInputControl:function(){
        var self = this;
        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            //按下键
            onKeyPressed:function(keyCode,event){
                switch(keyCode){
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
            onKeyReleased:function(keyCode,event){
                switch(keyCode){
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node)
    },

    // use this for initialization
    onLoad: function () {
        //初始化跳跃
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
        
        //加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;
        
        //初始化键盘输入
        this.setInputControl()
    },
    
    update:function(dt){
        //根据当前加速度方向每帧更新速度
        if (this.accLeft){
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight){
            this.xSpeed += this.accel * dt;
        } else {
            this.xSpeed -= this.xSpeed * dt;
            if (Math.abs(this.xSpeed) < 1){
                this.xSpeed = 0;
            }
        }
        //限制主角的最大速度
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed){
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        
        //根据速度更新主角位置
        this.node.x += this.xSpeed * dt
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
