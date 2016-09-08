/**
 * 补间动画管理器，用于管理补间实例的运行<br/>。
 * 每个game实例都有且仅有一个补间管理器对象game.tween,
 * 用于管理该实例内的所有补间对象
 * 
 * @class soya2d.TweenManager
 */
soya2d.TweenManager = new function(){
	this.list = [];
	this.tweenMap = {};

    /**
     * 增加一个补间实例到管理器中
     * @method add
     * @param {soya2d.DisplayObject} sp   显示对象
     * @param {int} [type] 补间类型,默认为普通补间
     * @see  soya2d.TWEEN_TYPE_PATH
     * @return {soya2d.Tween | soya2d.PathTween} 补间实例
     */
	this.add = function(sp,type){
		var t = null;
		if(type === soya2d.TWEEN_TYPE_PATH){
			t = new soya2d.PathTween(sp);
		}else{
			t = new soya2d.Tween(sp);
		}
		this.list.push(t);
		t.__manager = this;

		var ts = this.tweenMap[sp.roid];
		if(!ts){
			ts = this.tweenMap[sp.roid] = [];
		}
		ts.push(t);

		return t;
	};
    /**
     * 从管理器中删除一个补间实例
     * @private
     * @param {soya2d.Tween | soya2d.PathTween} t  补间
     * @return {soya2d.Tween | soya2d.PathTween} 补间实例
     */
	this.__remove = function(t) {
		var i = this.list.indexOf(t);
		if(i > -1){
			this.list.splice(i,1);
			t.__manager = null;
			delete t.__manager;
		}

		var ts = this.tweenMap[t.target.roid];
		if(ts){
			i = ts.indexOf(t);
			if(i > -1){
				ts.splice(i,1);
			}
		}

		return t;
	};
	/**
	 * 移除指定精灵绑定的所有补间或所有补间
	 * @method clearAll
	 * @param  {DisplayObject} sp 指定的显示对象。如果没有参数，删除所有补间
	 */
	this.clearAll = function(sp){
		var list = null;
		if(sp){
			if(!this.tweenMap[sp.roid])return;
			list = this.tweenMap[sp.roid].concat();
		}else{
			list = this.list.concat();
		}
		for(var i=list.length;i--;){
			this.__remove(list[i]);
		}
	}
	/**
	 * 暂停所有补间，如果sp有效，则暂停sp相关的所有补间，否则是全部
	 * @method pauseAll
	 * @param  {soya2d.DisplayObject} sp 显示对象
	 */
	this.pauseAll = function(sp){
		var list = null;
		if(sp){
			if(!this.tweenMap[sp.roid])return;
			list = this.tweenMap[sp.roid].concat();
		}else{
			list = this.list.concat();
		}
		for(var i=list.length;i--;){
			list[i].pause();
		}
	}
	/**
	 * 播放所有补间，如果sp有效，则播放sp相关的所有补间，否则是全部
	 * @method playAll
	 * @param  {soya2d.DisplayObject} sp 显示对象
	 */
	this.playAll = function(sp){
		var list = null;
		if(sp){
			if(!this.tweenMap[sp.roid])return;
			list = this.tweenMap[sp.roid].concat();
		}else{
			list = this.list.concat();
		}
		for(var i=list.length;i--;){
			list[i].play();
		}
	}
	/**
	 * 反向执行所有补间，如果sp有效，则反向sp相关的所有补间，否则是全部
	 * @method reverseAll
	 * @param  {soya2d.DisplayObject} sp 显示对象
	 */
	this.reverseAll = function(sp){
		var list = null;
		if(sp){
			if(!this.tweenMap[sp.roid])return;
			list = this.tweenMap[sp.roid].concat();
		}else{
			list = this.list.concat();
		}
		for(var i=list.length;i--;){
			list[i].reverse();
		}
	}

	this.__refresh = function(){
		while(true){
			var toBreak = true;
			for(var i=this.list.length;i--;){
				if(!this.list[i].target){
					this.__remove(this.list[i]);
					toBreak = false;
				}
			}
			if(toBreak)break;
		}
		
	}
	
    
    //更新管理器中的所有补间实例，当实例运行时间结束后，管理器会自动释放实例
	this.__update = function(now,d){
		var needRefresh = false;
		for(var i=this.list.length;i--;){
			if(!this.list[i].target){
				
				needRefresh = true;
				continue;
			}
			this.list[i].__update(now,d);
		}

		if(needRefresh)this.__refresh();
	};
}

/**
 * 路径补间
 * @property TWEEN_TYPE_PATH
 * @static
 * @final
 * @type {Number}
 */
soya2d.TWEEN_TYPE_PATH = 2;