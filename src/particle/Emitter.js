!function(){
	/**
	 * 粒子模块定义了soya2d中内置的粒子系统，可以实现绚丽的效果。
	 * <b>该模块是扩展模块，可以自行卸载</b>
	 * @module particle
	 */
	/**
	 * 发射器用于在给定的坐标发射粒子。默认的粒子都是dead状态，不可见，
	 * 引擎会激活粒子为活跃状态，并按照参数发射粒子，这时粒子为可见。
	 * ```
	 * var emitter = game.add.emitter({...});
	 * //注意，这里是添加粒子补间，不是emitter的补间
	 * emitter.tween.add()
	 * .to({opacity:0},1);
	 * 
	 * emitter.tween.add()
	 * .to({scaleX:2,scaleY:2},.5,{easing:soya2d.Tween.Elastic.Out})
	 * .to({scaleX:1,scaleY:1},.3,{easing:soya2d.Tween.Back.InOut});
	 * 
	 * emitter.emit();
	 * ```
	 * @class soya2d.Emitter
	 * @extends soya2d.DisplayObjectContainer
	 * @constructor
	 * @param {Object} opts 构造参数对象，参数如下：
	 * @param {Number} [opts.frequency=0.1] 粒子发射间隔 s
	 * @param {int} opts.max 总粒子数
	 * @param {String | HTMLImageElement | Array | soya2d.DisplayObject} opts.particles 粒子，可以是图片或者显示对象
	 * @param {Number} [opts.lifeSpan=1] 粒子生命周期 s
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
	 *
	 */
	soya2d.class("soya2d.Emitter",{
	    extends:soya2d.DisplayObjectContainer,
	    constructor:function(data){
			var cfg = data||{};

	        this.__particles = [];

			//1.初始化发生器变量
			this.frequency = cfg.frequency*1000 || 100;
			this.size = cfg.size;//粒子数
			this.quantity = cfg.quantity || 1;//每次发射最大粒子数
			
			//2.初始化粒子属性
			this.__template = getTemplate(cfg.particles);//粒子模版
			//生命周期
			this.lifeSpan = cfg.lifeSpan || 1;
			//默认速度
			this.minSpeed = cfg.minSpeed || 0;
			this.maxSpeed = cfg.maxSpeed || 0;
			//径向加速度
			this.minRadAcc = cfg.minRadAcc || 0;
			this.maxRadAcc = cfg.maxRadAcc || 0;
			//切线加速度
			this.minTanAcc = cfg.minTanAcc || 0;
			this.maxTanAcc = cfg.maxTanAcc || 0;
			//角度
			this.minAngle = cfg.minAngle || 0;
			this.maxAngle = cfg.maxAngle || 0;
			
			//初始化粒子
			for(var i=this.size;i--;){
				var p = this.__template.clone();
				p.visible = false;
				p.lifeSpan = 0;//dead particle
				p.deadRate = 0;
				p.blendMode = cfg.blendMode;
				this.__particles.push(p);
			}

			this.__deltaSum = 0;

			/**
			 * 是否运行中
			 * @type {Boolean}
			 */
			this.running = false;
	    },
	    tween:{
	    	__ts:[],
	    	add:function(){
	    		var t = {
	    			__tds:[],
			    	to:function(attris,duration,opts){
			    		this.__tds.push([attris,duration,opts]);
			    		return this;
			    	}
	    		};
	    		this.__ts.push(t);
	    		return t;
	    	}
	    },
	    /**
		 * 发射粒子
		 * @method emit
		 */
	    emit:function(){
			if(this.running)return;

			this.__particles.forEach(function(p){
				this.add(p);
			},this);

			this.running = true;
			if(this.stopping){
				clearTimeout(this.stopping);
			}
			return this;
		},
		/**
		 * 发射器停止产生新粒子<br/>
		 * *调用emit方法可以解除该状态
		 * @method stop
		 * @param {int} ms 停止激活的延迟毫秒数
		 */
		stop:function(ms){
			if(!this.running)return;
			if(ms>0){
				var that = this;
				this.stopping = setTimeout(function(){
					that.running = false;
					that.stopping = null;

					that.__particles.forEach(function(p){
						that.add(p);
					});
				},ms);
				return;
			}
			//停止激活新粒子
			this.running = false;
			return this;
		},
		_onUpdate:function(game,delta){
			if(!this.running)return;

			this.__deltaSum += delta;

			var emittableCount = 0;
			var ps = this.__particles;
			
			//时间差值是否大于粒子发射间隔
			if (this.__deltaSum >= this.frequency && this.running) {
		      	emittableCount = (this.__deltaSum / this.frequency)>>0;
		      	this.__deltaSum = 0;
		  	}

		  	//有该帧能发射的粒子
			if(emittableCount>0 && this.running){
			  	emittableCount = this.quantity;//this.size;emittableCount>this.size?this.size:emittableCount;
			  	for(var i=this.size;i--&&emittableCount;){
			  		var p = ps[i];
					if(p.lifeSpan<=0){
						if(this.onActive)this.onActive(p);
						initParticle(p,this);
						if(this.tween.__ts.length>0){
							this.tween.__ts.forEach(function(t){
								var tween = game.tween.add(p);
								t.__tds.forEach(function(td){
									tween.to(td[0],td[1],td[2]);
								});
								tween.play();
							});
						}
						if(emittableCount>0)
						emittableCount--;
					}
				}
			}

			//2.更新所有活的粒子
			for(var i=ps.length;i--;){
				var p = ps[i];
				if(p.lifeSpan>0){
					updateParticle(p,delta);
					if(!p.visible)p.visible = true;
				}
			}//over for

			if(this.onRunning)this.onRunning(ps);

		}
	});


	function getTemplate(particles){
		if(typeof(particles) === 'string' 
			|| particles instanceof Image 
			|| particles instanceof Array ){
			return new soya2d.Sprite({
				images:particles
			});
		}else if(particles instanceof soya2d.DisplayObject){
			return particles;
		}

		soya2d.console.error('soya2d.Emitter: invalid param [particles]; '+particles);
	}

	function updateParticle(particle,delta){
    	var m = soya2d.Math;
    	var dt = delta/1000;
    	//1.检测是否已经死亡
    	particle.lifeSpan -= dt;
    	if(particle.lifeSpan<=0){
    		particle.visible = false;
    		particle.deadRate = 0;
    		return;
    	}
    	particle.deadRate = particle.lifeSpan / particle.__maxLifeSpan;
    	//2.更新所有属性
    	 
    	//位置(射线)
    	particle.__speed.add(particle.__deltaSpeed).add(particle.__radialAcc);
    	 
       	//切线旋转
       	if(particle.__tanAcc!==0){
	       	particle.__tanDir.set(particle.__speed.e[0],particle.__speed.e[1]).rotate(particle.__tans);
	       	particle.__tans += particle.__tanAcc;
	       	particle.__tans %= 360;
	       	particle.__speed.set(particle.__tanDir.e[0],particle.__tanDir.e[1]);
	    }
       
       
       	//更新引擎属性
       	particle.x = particle.__sx + particle.__speed.e[0];
    	particle.y = particle.__sy + particle.__speed.e[1];
    }
    function initParticle(particle,opts){
		var m = soya2d.Math;
		//初始化配置
		var ls = particle.lifeSpan = opts.lifeSpan;
		particle.__maxLifeSpan = ls;
		
		particle.__sx = m.randomi(0,opts.w - particle.w);
		particle.__sy = m.randomi(0,opts.h - particle.h);
		
		//方向速度
		var diffAngle = opts.maxAngle?opts.maxAngle - opts.minAngle:0;
		var angle = opts.minAngle + diffAngle * Math.random();
		angle = m.floor(angle %= 360);
		particle.angle = angle;

		var diffSpd = opts.maxSpeed?opts.maxSpeed - opts.minSpeed:0;
		var speed = opts.minSpeed + diffSpd * Math.random();
		var tmp = new soya2d.Vector(m.COSTABLE[angle], m.SINTABLE[angle]);
		particle.__speed = tmp.clone().mul(speed);
		particle.__deltaSpeed = new soya2d.Vector(particle.__speed.e[0]/ls,particle.__speed.e[1]/ls);
		
		//径向加速
		var diffRac = opts.maxRadAcc?opts.maxRadAcc - opts.minRadAcc:0;
		particle.__radialAcc = tmp.mul(opts.minRadAcc + diffRac * Math.random());
		
		//切线角加速度
		var diffTac = opts.maxTanAcc?opts.maxTanAcc - opts.minTanAcc:0;
		particle.__tanAcc = opts.minTanAcc + diffTac * Math.random();
		if(particle.__tanAcc!==0){
			particle.__tans = particle.__tanAcc;
			particle.__tanDir = new soya2d.Vector(0,0);
		}
		
	}

	/**
	 * 粒子激活时回调
	 * @method onActive
	 */
	/**
	 * 粒子运行时回调，每帧调用
	 * @method onRunning
	 * @param {Array} particles 发射器中包含的所有粒子
	 */
}();