/**
 * @classdesc 发射器用于在给定的坐标发射粒子。默认的粒子都是dead状态，不可见，
 * 引擎会激活粒子为活跃状态，并按照参数发射粒子，这时粒子为可见。
 * @class 
 * @param {Object} opts 构造参数对象，参数如下：
 * @param {Number} [opts.MSPE=16] 粒子发射间隔
 * @param {int} opts.emissionCount 总粒子数
 * @param {int} [opts.blendMode=soya2d.BLEND_LIGHTER] 混合模式
 * @param {int} opts.x 发射器坐标
 * @param {int} [opts.xVar=0] 发射器坐标，可变累加值
 * @param {int} opts.y 发射器坐标
 * @param {int} [opts.yVar=0] 发射器坐标，可变累加值
 * @param {soya2d.DisplayObject} opts.template 粒子模版
 * @param {Number} [opts.lifeSpan=1] 粒子生命周期
 * @param {Number} [opts.lifeSpanVar=0] 粒子生命周期，可变累加值
 * @param {Number} [opts.speed=0] 粒子移动速度
 * @param {Number} [opts.speedVar=0] 粒子移动速度，可变累加值
 * @param {Number} [opts.radialAcc=0] 径向加速度
 * @param {Number} [opts.radialAccVar=0] 径向加速度，可变累加值
 * @param {Number} [opts.tanAcc=0] 切线加速度
 * @param {Number} [opts.tanAccVar=0] 切线加速度，可变累加值
 * @param {Number} [opts.angle=0] 发射角度
 * @param {Number} [opts.angleVar=0] 发射角度，可变累加值
 * @param {Number} [opts.startSpin=0] 自转速度范围起始
 * @param {Number} [opts.startSpinVar=0] 自转速度范围起始，可变累加值
 * @param {Number} [opts.endSpin=0] 自转速度范围结束
 * @param {Number} [opts.endSpinVar=0] 自转速度范围结束，可变累加值
 * @param {function} [opts.onActive] 回调事件，粒子激活时调用。
 * 在粒子发射器停止前，每个粒子都可以无限次激活
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Emitter = function(opts){
	var particles = [];
	var lastTime = 0;
	
	cfg = opts||{};

	soya2d.ext(this,cfg);

	//1.初始化发生器变量
	this.MSPE = cfg.MSPE||16;
	this.emissionCount = cfg.emissionCount;//粒子数
	this.blendMode = cfg.blendMode || soya2d.BLEND_LIGHTER;//混合方式
	this.x = cfg.x;this.xVar = cfg.xVar||0;
	this.y = cfg.y;this.yVar = cfg.yVar||0;
	
	//2.初始化粒子属性
	this.template = soya2d.ParticleWrapper.wrap(cfg.template);//粒子模版
	//生命周期
	this.lifeSpan = cfg.lifeSpan || 1;
	this.lifeSpanVar = cfg.lifeSpanVar||0;
	//默认速度
	this.speed = cfg.speed || 0;
	this.speedVar = cfg.speedVar||0;
	//径向加速度
	this.radialAcc = cfg.radialAcc||0;
	this.radialAccVar = cfg.radialAccVar||0;
	//切线加速度
	this.tanAcc = cfg.tanAcc||0;
	this.tanAccVar = cfg.tanAccVar||0;
	//角度
	this.angle = cfg.angle||0;
	this.angleVar = cfg.angleVar||0;
	//自旋转
	this.startSpin = cfg.startSpin||0;
	this.startSpinVar = cfg.startSpinVar||0;
	this.endSpin = cfg.endSpin||0;
	this.endSpinVar = cfg.endSpinVar||0;

	//回调
	this.onActive = cfg.onActive;
	
	//初始化粒子
	for(var i=this.emissionCount;i--;){
		var p = new this.template(this);
		p.visible = false;
		p.lifeSpan = 0;//dead particle
		p.deadRate = 0;
		particles.push(p);
	}

	/**
	 * 是否运行中
	 * @type {Boolean}
	 */
	this.running = false;
	/**
	 * 把发射器添加到soya2d显示对象上
	 * @param {soya2d.DisplayObject} object 显示对象
	 * @return this
	 */
	this.addTo = function(object){
		if(!soya2d.ParticleManager.add(this))return this;
		
		object.add.apply(object,particles);
		
		return this;
	}
	/**
	 * 把发射器从soya2d显示对象上移除
	 * @param {soya2d.DisplayObject} object 显示对象
	 * @return this
	 */
	this.removeFrom = function(object){
		soya2d.ParticleManager.remove(this);
		
		object.remove.apply(object,particles);
		
		return this;
	}
	/**
	 * 开始发射粒子
	 */
	this.emit = function(){
		if(this.running)return this;
		lastTime = Date.now();
		this.running = true;
		if(this.stopping){
			clearTimeout(this.stopping);
		}
		return this;
	}
	/**
	 * 发射器停止产生新粒子<br/>
	 * *调用emit方法可以解除该状态
	 * @param {int} ms 停止激活的延迟毫秒数
	 */
	this.stop = function(ms){
		if(!this.running)return this;
		if(ms>0){
			var THAT = this;
			this.stopping = setTimeout(function(){
				this.running = false;
				THAT.stopping = 0;
			},ms);
			return;
		}
		//停止激活新粒子
		this.running = false;
		return this;
	};
	
	var deltaSum = 0;
	/*
	 * 更新所有粒子,代理调用
	 * @private
	 */
	this.update = function(now){
		//1.确定该帧激活多少个粒子
		var delta = now - lastTime;
		lastTime = now;
		deltaSum += delta;
		var emittableCount = 0;
		var ps = particles;
		
		//时间差值是否大于粒子发射间隔
		if (deltaSum >= this.MSPE && this.running) {
	      	emittableCount = (deltaSum / this.MSPE)>>0;
	      	deltaSum = 0;
	  	}
  
		//有该帧能发射的粒子
		if(emittableCount>0 && this.running){
		  	emittableCount = emittableCount>this.emissionCount?this.emissionCount:emittableCount;
		  	for(var i=this.emissionCount;i--&&emittableCount;){
		  		var p = ps[i];
				if(p.lifeSpan<=0){
					if(this.onActive instanceof Function)
					this.onActive.call(p);
					p.resetParticle(this);
					emittableCount--;
				}
			}
		}
			
		//2.更新所有活的粒子
		for(var i=ps.length;i--;){
			var p = ps[i];
			if(p.lifeSpan>0){
				p.updateParticle(delta);
			}
		}//over for
	};
};
