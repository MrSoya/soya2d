/**
 * 粒子包装器用于包装soya2d显示对象为一个可用粒子
 * @namespace soya2d.ParticleWrapper
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ParticleWrapper = new function(){

	/**
	 * 包装一个显示类，该类需要提供粒子的绘制方法，比如内置的{@link soya2d.Rect}
	 * @param  {soya2d.DisplayObject} clazz 粒子类
	 * @return {soya2d.DisplayObject} particle 包装后的粒子类
	 */
	this.wrap = function(clazz){
		clazz.prototype.updateParticle = updateParticle;
		clazz.prototype.initParticle = initParticle;
		clazz.prototype.resetParticle = resetParticle;
		clazz.prototype.destroyParticle = function() {
	    	this.parent.remove(this);
		}
		return clazz;
	}

	//this.interpolationType = 'linear';
    //中间值可以使用Tween来进行差值计算
    
    function updateParticle(delta){
    	var m = soya2d.Math;
    	var dt = delta/1000;
    	//1.检测是否已经死亡
    	this.lifeSpan -= dt;
    	if(this.lifeSpan<=0){
    		this.visible = false;
    		this.deadRate = 0;
    		return;
    	}
    	this.deadRate = this.lifeSpan / this.maxLifeSpan;
    	//2.更新所有属性
    	 
    	//位置(射线)
    	this.speed.add(this.deltaSpeed).add(this.radialAcc);
    	 
       	//切线旋转
       	if(this.tanAcc!==0){
	       	this.tanDir.set(this.speed.e[0],this.speed.e[1]).rotate(this.tans);
	       	this.tans += this.tanAcc;
	       	this.tans %= 360;
	       	this.speed.set(this.tanDir.e[0],this.tanDir.e[1]);
	    }
       
       	//自转
       	if(this.deltaSpin)
       		this.startSpin += this.deltaSpin * dt;
       
       	//更新引擎属性
       	this.x = this.sx + this.speed.e[0];
    	this.y = this.sy + this.speed.e[1];
    	if(this.deltaSpin)this.rotation = this.startSpin;
    }
    function initParticle(opts){
		var m = soya2d.Math;
		//初始化配置
		var ls = this.lifeSpan = opts.lifeSpan + opts.lifeSpanVar * Math.random();
		this.maxLifeSpan = ls;
		
		this.sx = opts.x + opts.xVar * Math.random();
		this.sy = opts.y + opts.yVar * Math.random();
		
		//方向速度
		var angle = opts.angle + opts.angleVar * Math.random();
		angle = m.floor(angle %= 360);
		this.angle = angle;
		var speed = opts.speed + opts.speedVar * Math.random();
		var tmp = new soya2d.Vector(m.COSTABLE[angle], m.SINTABLE[angle]);
		this.speed = tmp.clone().mul(speed);
		this.deltaSpeed = new soya2d.Vector(this.speed.e[0]/ls,this.speed.e[1]/ls);
		//径向加速
		this.radialAcc = tmp.mul(opts.radialAcc + opts.radialAccVar * Math.random());
		//切线角加速度
		this.tanAcc = opts.tanAcc + opts.tanAccVar * Math.random();
		if(this.tanAcc!==0){
			this.tans = this.tanAcc;
			this.tanDir = new soya2d.Vector(0,0);
		}
		
		//自转
		this.startSpin = opts.startSpin + opts.startSpinVar * Math.random();
		var endSpin = opts.endSpin + opts.endSpinVar * Math.random();
		this.deltaSpin = (endSpin - this.startSpin) / ls;
		if(this.startSpin === endSpin)this.deltaSpin = null;//不更新
		
	}
	function resetParticle(c) {
		this.initParticle(c);
		this.visible = true;
	}
};