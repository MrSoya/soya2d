/**
 * 补间动画管理器接口，用于管理补间实例的运行<br/>
 * *通常不需要开发者直接使用该类，引擎会自动调度
 * @namespace soya2d.TweenManager
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.TweenManager = new function(){
	var ins = [];
    /**
     * 增加一个补间实例到管理器中,重复增加无效
     * @param soya2d.Tween t 补间实例
     * @return this
     */
	this.add = function(t){
		var i = ins.indexOf(t);
		if(i>-1)return this;
		
		ins.push(t);
		return this;
	};
    /**
     * 从管理器中删除一个补间实例
     * @param soya2d.Tween t 补间实例
     * @return this
     */
	this.remove = function(t) {
		var i = ins.indexOf(t);
		if(i>-1)ins.splice(i, 1);
		return this;
	};

	/**
	 * 停止所有补间实例
	 */
	this.stop = function(){
		ins = [];
	}
    /**
     * 更新管理器中的所有补间实例，当实例运行时间结束后，管理器会自动释放实例
     */
	this.update = function(now,d){
		for(var i=ins.length;i--;){
			ins[i].update(now,d);
		}
	};
}