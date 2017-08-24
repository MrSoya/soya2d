
var globalEventSignal = new Signal();
/**
 * 精灵事件接口，用来绑定回调事件
 */
function Events(displayObject){
    this.obj = displayObject;
    this.disabled = false;

    this.clear = function(){
        this.obj.game.__pointerSignal.off(null,null,this.obj);
        globalEventSignal.off(null,null,this.obj);
    }
    
    //pointer
    this.onPointerDown = function(cbk){
        this.obj.game.__pointerSignal.on('pointerdown',cbk,this.obj);
    }
    this.onPointerTap = function(cbk){
        this.obj.game.__pointerSignal.on('pointertap',cbk,this.obj);
    }
    this.onPointerDblTap = function(cbk){
        this.obj.game.__pointerSignal.on('pointerdbltap',cbk,this.obj);
    }
    this.onPointerUp = function(cbk){
        this.obj.game.__pointerSignal.on('pointerup',cbk,this.obj);
    }
    this.onPointerMove = function(cbk){
        this.obj.game.__pointerSignal.on('pointermove',cbk,this.obj);
    }
    this.onPointerOver = function(cbk){
        this.obj.game.__pointerSignal.on('pointerover',cbk,this.obj);
    }
    this.onPointerOut = function(cbk){
        this.obj.game.__pointerSignal.on('pointerout',cbk,this.obj);
    }
    this.onPointerCancel = function(cbk){
        this.obj.game.__pointerSignal.on('pointercancel',cbk,this.obj);
    }
    this.onEnterStage = function(cbk){
        this.obj.game.__pointerSignal.on('enterstage',cbk,this.obj);
    }
    this.onLeaveStage = function(cbk){
        this.obj.game.__pointerSignal.on('leavestage',cbk,this.obj);
    }

    //physics
    this.onCollisionStart = function(cbk){
        this.obj.game.__pointerSignal.on('collisionstart',cbk,this.obj);
    }
    this.onCollisionEnd = function(cbk){
        this.obj.game.__pointerSignal.on('collisionend',cbk,this.obj);
    }


    //keyboard
    this.onKeyDown = function(cbk){
        globalEventSignal.on('keydown',cbk,this.obj);
    }
    this.onKeyPress = function(cbk){
        globalEventSignal.on('keypress',cbk,this.obj);
    }
    this.onKeyUp = function(cbk){
        globalEventSignal.on('keyup',cbk,this.obj);
    }

    //device
    this.onDeviceHov = function(cbk){
        globalEventSignal.on('hov',cbk,this.obj);
    }
    this.onDeviceTilt = function(cbk){
        globalEventSignal.on('tilt',cbk,this.obj);
    }
    this.onDeviceMotion = function(cbk){
        globalEventSignal.on('motion',cbk,this.obj);
    }
}