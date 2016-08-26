/**
 * 该类是soya中应用物理系统的统一接口
 */
var Physics = soya2d.class("",{
    extends:Signal,
    constructor:function(game){
        this.__signalHandler = new SignalHandler();
        this.running = false;
    },
    /**
     * 建立一个物理引擎，并实现相关接口
     * @param  {Object} opts 
     * @param {Function} opts.onStart 引擎启动
     * @param {Function} opts.onUpdate 引擎更新
     * @param {Function} opts.onBind 引擎启动
     */
    setup:function(opts){
    	this.__cbk = opts || {};
    },
    /**
     * 启动物理系统,可以传递参数
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    start:function(opts){
    	opts = opts || {};
    	opts.gravity = opts.gravity || [0,1];
		opts.gravity[0] = opts.gravity[0] || 0;
	    opts.gravity[1] = opts.gravity[1] || 1;
	    opts.enableSleeping = opts.enableSleeping || false;

		this.__cbk.onStart && this.__cbk.onStart(opts); 

		this.running = true;
    },
    stop:function(){
    	this.__cbk.onStop && this.__cbk.onStop();
    	this.running = false;
    },
    update:function(){
    	this.__cbk.onUpdate && this.__cbk.onUpdate(); 
    },
    bind:function(obj){
    	var shape;
    	if(this.__cbk.onBind){
    		shape = this.__cbk.onBind(obj); 
    	}
    	obj.body.rigid = shape;
    	obj.body.__cbk = this.__cbk.body;
		shape.__sprite = obj;
    },
    unbind:function(obj){
        var shape = obj.body.rigid;
        if(!shape)return;

        obj.body.__cbk = null;
        if(this.__cbk.onUnbind){
            shape.__sprite = null;
            this.__cbk.onUnbind(shape);
        }
        obj.body = {};
    },
    enable:function(objs){
    	var rs = objs;
    	if(objs instanceof Array || arguments.length>1){
    		if(arguments.length>1)rs = arguments;
    		for(var i=rs.length;i--;){
    			this.bind(rs[i]);
    		}
    	}else {
    		this.bind(rs);
    	}
    }
});

/**
 * 事件类型 - 碰撞开始
 * @type {String}
 */
soya2d.EVENT_CONTACTSTART = 'contactstart';
/**
 * 事件类型 - 碰撞结束
 * @type {String}
 */
soya2d.EVENT_CONTACTEND = 'contactend';
/**
 * 物理事件对象
 * @type {Object}
 * @typedef {Object} soya2d.PhysicsEvent
 * @property {Array} collisionPairs - 碰撞对一维数组[{a:xx,b:xx},{a:yy,b:yy}, ...]
 * @property {soya2d.DisplayObject} otherCollider - 与当前对象产生碰撞的显示对象
 */

