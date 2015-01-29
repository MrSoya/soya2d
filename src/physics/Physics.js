/**
 * @classdesc 该类是soya中应用物理系统的统一接口，默认使用p2(https://github.com/schteppe/p2.js)物理引擎，
 * 其他引擎还在扩展中。<br/>物理引擎本身的设置参数请参考引擎对应文档</br>
 * 该类提供如下事件:<br/>
 * <ul>
 *     <li>contactstart</li>
 *     <li>contactend</li>
 * </ul>
 * 所有事件的唯一回调参数为物理事件对象{@link soya2d.PhysicsEvent}
 * @class 
 * @param {Object} opts 物理系统参数
 * @param {Array} opts.gravity 重力向量[x,y]
 * @param {Number} opts.friction 全局摩擦力
 * @param {Number} opts.bounce 全局弹力
 * @param {Number} opts.stiffness 全局物体刚度
 * @param {Number} opts.relaxation 全局弛豫度
 * @param {Number} opts.tolerance 全局公差
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Physics = function(opts){
	opts = opts || {};

	opts.gravity = opts.gravity || [0,9.8];
	opts.friction = opts.friction || 1;
	opts.bounce = opts.bounce || 0.5;
	opts.stiffness = opts.stiffness || 100000;
	opts.relaxation = opts.relaxation || 20;
	opts.tolerance = opts.tolerance || 0.01;

	/**
	 * 物理世界
	 * @type {Object}
	 */
	this.world = new p2.World(opts);

	this.world.defaultContactMaterial.friction = 1 || opts.friction;
	this.world.defaultContactMaterial.restitution = opts.bounce;
	this.world.defaultContactMaterial.stiffness = opts.stiffness;
	this.world.defaultContactMaterial.relaxation = opts.relaxation;

	this.world.solver.tolerance = opts.tolerance;
	//todo 根据世界内的物体量，自动控制iterations
	//this.world.solver.iterations = 20;
	
	var bcs = [],
		ecs = [];

	var thisGame;
	/**
     * 启动监听
     * @return this
     * @private
     */
    this.startListen = function(game){
        thisGame = game;
        //监听碰撞开始事件
		this.world.on("beginContact", function(event) {

			bcs.push({a:event.bodyA.ro,b:event.bodyB.ro});
		}, this);

		//监听碰撞结束事件
		this.world.on("endContact", function(event) {

			ecs.push({a:event.bodyA.ro,b:event.bodyB.ro});
		}, this);

        return this;
    }

    /**
     * 停止监听
     * @return this
     * @private
     */
    this.stopListen = function(game){
        
        return this;
    }

    /**
     * 扫描是否需要执行事件，如果需要，执行
     * @private
     */
	this.scan = function(){
		if(bcs.length>0){
			var events = this.__eventMap['contactstart'];
            fireEvent(events,'contactstart');
		}
		if(ecs.length>0){
			var events = this.__eventMap['contactend'];
            fireEvent(events,'contactend');
		}

        reset();
    }
    function reset(){
        bcs = [];
        ecs = [];
    }
    var eventObj = {
    	collisionPairs:null,
    	otherCollider:null
    };
    function fireEvent(events,type){
        if(!events)return;

        //排序
        events.sort(function(a,b){
            return a.order - b.order;
        });

        var scene = thisGame.scene;

        for(var i=events.length;i--;){
            var target = events[i].context;
            var pairs = null,
            	otherCollider = null;
            if(target instanceof soya2d.DisplayObject && target != scene){
                if(type == 'contactstart' ||
                	type == 'contactend'){

                	var pairs = type == 'contactstart'?bcs:ecs;

                	var canfire = false;
                	for(var j=pairs.length;j--;){
                		var obj = pairs[j];
                		if(obj.a == target || obj.b == target){
                			canfire = true;
                			otherCollider = obj.a == target?obj.b:obj.a;
                			break;
                		}
                	}
                	if(!canfire)continue;
                }
            }
            eventObj.collisionPairs = pairs;
            eventObj.otherCollider = otherCollider;

            events[i].fn.call(target,eventObj);
        }
    }
	/***************** 外部接口 ******************/
	
	/**
	 * 绑定一个soya2d可渲染对象到物理环境中
	 * @param  {soya2d.DisplayObject} ro soya2d可渲染对象
	 * @param  {Object} opts 绑定参数对象，参数如下：
	 * @param  {int} [opts.type=soya2d.PHY_DYNAMIC] 响应类型，控制该物体是应用物理效果。
	 * 如果mass为0时，又想应用物理效果，可以设置该属性为soya2d.PHY_DYNAMIC
	 * @param  {Number} [opts.mass=1] 物体质量，如果为0，则默认该物体不应用物理效果
	 * @param  {Number} [opts.angularVelocity=0] 角速度
	 * @param  {boolean} [opts.fixedRotation=false] 是否固定旋转
	 * @param  {boolean} [opts.sensor=false] 是否不与其他物体碰撞
	 * 
	 * @see soya2d.PHY_DYNAMIC
	 */
	this.bind = function(ro, opts) {
		opts = opts||{};
		var shape;

		var offx = 0,offy = 0;
		offx = ro.w/2,offy = ro.h/2;

		if (ro.bounds instanceof soya2d.Rectangle) {
			shape = new p2.Rectangle(ro.w, ro.h);
		} else if (ro.bounds instanceof soya2d.Circle) {
			shape = new p2.Circle(ro.bounds.r);
		}else if (ro.bounds instanceof soya2d.Polygon) {
			var vtx = ro.bounds.vtx;
			//转换1维数组
			var convex = [];
			for(var i=0;i<vtx.length;i+=2){
				convex.push([vtx[i] - offx,vtx[i+1] - offy]);
			}
			shape = new p2.Convex(convex);
		}


		//刚体默认参数
		opts.mass = opts.mass === 0?0:opts.mass || 1;
		opts.sensor = opts.sensor || false;
		opts.position = [ro.x + offx, ro.y  + offy];
		opts.angularVelocity = opts.angularVelocity || 0;
		opts.fixedRotation = opts.fixedRotation || false;
		switch(opts.type){
			case soya2d.PHY_STATIC:
				opts.type = p2.Body.STATIC;
				break;
			case soya2d.PHY_DYNAMIC:
			default:
				if(opts.mass == 0)opts.type = p2.Body.KINEMATIC;
				break;
		}

		//创建刚体
		var body = new p2.Body(opts);

		shape.sensor = opts.sensor;
		body.addShape(shape);
		this.world.addBody(body);
		
		//用于方便相互查找
		ro.body = body;
		body.ro = ro;

	};

	/**
	 * 从物理环境中解除soya2d可渲染对象
	 * @param  {soya2d.DisplayObject} ro soya2d可渲染对象
	 */
	this.unbind = function(ro) {
		this.world.removeBody(ro.body);
		ro.body = null;
		delete ro.body;
	};

	/**
	 * 更新物理世界，通常不需要手动调用
	 * @private
	 */
	this.update = function(dt) {
		this.world.step(dt);
		for(var i=this.world.bodies.length; i--;){
			var body = this.world.bodies[i];
			var ro = body.ro;
			if(!ro)continue;
			if(isNaN(body.position[0]))continue;

			//传给绘图引擎的偏移量
			var offx = 0,offy = 0;
			offx = ro.w/2,offy = ro.h/2;
			
			
			ro.x = body.position[0] - offx;
			ro.y = body.position[1] - offy;
			ro.rotation = body.angle * 180 / Math.PI;
		}
	};

	soya2d.EventHandler.call(this);
};
soya2d.inherits(soya2d.Physics,soya2d.EventHandler);
/**
 * 物理响应类型，静态
 * @type {Number}
 */
soya2d.PHY_STATIC = 1;
/**
 * 物理响应类型，动态
 * @type {Number}
 */
soya2d.PHY_DYNAMIC = 2;

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