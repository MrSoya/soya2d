
var eventSignal = new Signal();
/**
 * 精灵事件接口，用来绑定回调事件
 * @param {[type]} displayObject [description]
 */
function Events(displayObject){
    this.obj = displayObject;
    
    //pointer
    this.onPointerDown = function(cbk){
        eventSignal.on('pointerdown',cbk,this.obj);
    }
    this.onPointerTap = function(cbk){
        eventSignal.on('pointertap',cbk,this.obj);
    }
    this.onPointerDblTap = function(cbk){
        eventSignal.on('pointerdbltap',cbk,this.obj);
    }
    this.onPointerUp = function(cbk){
        eventSignal.on('pointerup',cbk,this.obj);
    }
    this.onPointerMove = function(cbk){
        eventSignal.on('pointermove',cbk,this.obj);
    }
    this.onPointerOver = function(cbk){
        eventSignal.on('pointerover',cbk,this.obj);
    }
    this.onPointerOut = function(cbk){
        eventSignal.on('pointerout',cbk,this.obj);
    }
    this.onPointerCancel = function(cbk){
        eventSignal.on('pointercancel',cbk,this.obj);
    }
    this.onEnterStage = function(cbk){
        eventSignal.on('enterstage',cbk,this.obj);
    }
    this.onLeaveStage = function(cbk){
        eventSignal.on('leavestage',cbk,this.obj);
    }

    //keyboard
    this.onKeyDown = function(cbk){
        eventSignal.on('keydown',cbk,this.obj);
    }
    this.onKeyPress = function(cbk){
        eventSignal.on('keypress',cbk,this.obj);
    }
    this.onKeyUp = function(cbk){
        eventSignal.on('keyup',cbk,this.obj);
    }

    //device
    this.onDeviceHov = function(cbk){
        eventSignal.on('hov',cbk,this.obj);
    }
    this.onDeviceTilt = function(cbk){
        eventSignal.on('tilt',cbk,this.obj);
    }
    this.onDeviceMotion = function(cbk){
        eventSignal.on('motion',cbk,this.obj);
    }

    //physics
    this.onCollisionStart = function(cbk){
        eventSignal.on('collisionstart',cbk,this.obj);
    }
    this.onCollisionEnd = function(cbk){
        eventSignal.on('collisionend',cbk,this.obj);
    }
}