/**
 * 物理模块定义了soya2d中内置的物理系统，该模块实现了一套应用层API，
 * 开发者可以自行切换物理库，而不必修改应用代码。
 * <b>该模块是扩展模块，可以自行卸载</b>
 * @module physics
 */
/**
 * 物理类是soya2d中应用物理系统的统一接口，该接口屏蔽了不同物理系统的实现，
 * 使用统一的调用接口实现物理关联
 * @class Physics
 * @extends Signal
 * @module physics
 */
var Physics = soya2d.class("",{
    extends:Signal,
    constructor:function(game){
        this.running = false;
    },
    /**
     * 建立一个物理引擎，并实现相关接口
     * @method setup
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
     * @method start
     * @param  {Object} opts 物理参数
     * @param  {Array} [opts.gravity=[0,1]] 重力参数
     * @param  {Boolean} [opts.enableSleeping] 重力参数
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
    /**
     * 停止物理系统
     * @method stop
     */
    stop:function(){
    	this.__cbk.onStop && this.__cbk.onStop();
    	this.running = false;
    },
    update:function(){
    	this.__cbk.onUpdate && this.__cbk.onUpdate(); 
    },
    /**
     * 绑定显示对象，建立和物理世界的关联
     * @private
     */
    bind:function(obj){
    	var shape;
    	if(this.__cbk.onBind){
    		shape = this.__cbk.onBind(obj); 
    	}
    	obj.body.rigid = shape;
    	obj.body.__cbk = this.__cbk.body;
		shape.__sprite = obj;
    },
    /**
     * 把显示对象和物理世界的映射解除
     * @private
     */
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
    /**
     * 让一个或多个显示对象启用物理效果
     * @param  {Array|...} objs 显示对象数组，或多个显示对象的可变参数
     */
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
    },
    /**
     * 让一个或多个显示对象关闭物理效果
     * @param  {Array|...} objs 显示对象数组，或多个显示对象的可变参数
     */
    unable:function(objs){
        var rs = objs;
        if(objs instanceof Array || arguments.length>1){
            if(arguments.length>1)rs = arguments;
            for(var i=rs.length;i--;){
                this.unbind(rs[i]);
            }
        }else {
            this.unbind(rs);
        }
    }
});

/**
 * 碰撞开始
 * @property EVENT_COLLISIONSTART
 * @type {String}
 * @for soya2d
 */
soya2d.EVENT_COLLISIONSTART = 'collisionStart';
/**
 * 碰撞结束
 * @property EVENT_COLLISIONEND
 * @type {String}
 * @for soya2d
 */
soya2d.EVENT_COLLISIONEND = 'collisionEnd';


/**
 * 物理事件
 * @event collisionStart
 * @for soya2d.DisplayObject
 * @param {soya2d.DisplayObject} otherCollider 碰撞对象
 */
/**
 * 物理事件
 * @event collisionEnd
 * @for soya2d.DisplayObject
 * @param {soya2d.DisplayObject} otherCollider 碰撞对象
 */

/**
 * 物理事件
 * @event collisionStart
 * @for Physics
 * @param {soya2d.DisplayObject} colliderA 碰撞对象A
 * @param {soya2d.DisplayObject} colliderB 碰撞对象B
 */
/**
 * 物理事件
 * @event collisionEnd
 * @for Physics
 * @param {soya2d.DisplayObject} colliderA 碰撞对象A
 * @param {soya2d.DisplayObject} colliderB 碰撞对象B
 */