/**
 * 粒子管理器接口，用于管理粒子发射器的运行<br/>
 * *通常不需要开发者直接使用该类，引擎会自动调度
 * @namespace soya2d.ParticleManager
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ParticleManager = new function(){
	var emitters = [];
	this.add = function(emitter){
		var i = emitters.indexOf(emitter);
		if(i>-1){
			return false;
		}
		emitters.push(emitter);
		return this;
	};
	this.remove = function(emitter) {
		var i = emitters.indexOf(emitter);
		if(i>-1)emitters.splice(emitter, 1);
		return this;
	};

	this.update = function(t){
		for(var i=emitters.length;i--;){
			emitters[i].update(t);	
		}
	};
	
	this.stop = function(emitter){
		if(emitter){
			var i = emitters.indexOf(emitter);
			if(i>-1)emitter.stop();
		}else{
			emitters.splice(0,emitters.length);
		}
	};
};
