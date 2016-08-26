/**
 *  物理刚体接口，所有物理引擎需要实现body接口
 */
var Body = soya2d.class("",{
    extends:Signal,
    constructor:function(displayObject){
        this.__signalHandler = new SignalHandler();
        this.sprite = displayObject;
        this.rigid = null;//物理刚体
    },
    sensor:function(tof) {
        this.__cbk && this.__cbk.sensor(this.rigid,tof);
        return this;
    },
    moveTo:function(x,y){
        this.__cbk && this.__cbk.moveTo(this.rigid,x,y);
        return this;
    },
    moveBy:function(x,y){
        this.__cbk && this.__cbk.moveBy(this.rigid,x,y);
        return this;
    },
    static:function(tof){
        this.__cbk && this.__cbk.static(this.rigid,tof);
        return this;
    },
    mass:function(v){
        this.__cbk && this.__cbk.mass(this.rigid,v);
        return this;
    },
    rotateBy:function(v){
        this.__cbk && this.__cbk.rotateBy(this.rigid,v);
        return this;
    },
    rotateTo:function(v){
        this.__cbk && this.__cbk.rotateTo(this.rigid,v);
        return this;
    },
    friction:function(v){
        this.__cbk && this.__cbk.friction(this.rigid,v);
        return this;
    },
    restitution:function(v){
        this.__cbk && this.__cbk.restitution(this.rigid,v);
        return this;
    },
    velocity:function(x,y){
        this.__cbk && this.__cbk.velocity(this.rigid,x||0,y||0);
        return this;
    },
    inertia:function(v){
        this.__cbk && this.__cbk.inertia(this.rigid,v||0);
        return this;
    }
});
