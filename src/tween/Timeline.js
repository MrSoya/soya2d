/**
 * timeline用来调度基于时间的动画。timeline内部使用soya2d.Tween来保存每个动画序列
 */
soya2d.class("soya2d.Timeline",{
    extends:Signal,
    constructor:function(target){
        this.__signalHandler = new SignalHandler();

        /**
         * 标记map
         * @type {Object}
         */
        this.signMap = {};

        this.line = {};

        this.tweens = [];

        this.position = 0;
    },
    /**
     * 在指定时间点插入一个tween
     * @param  {Number | String} time  时间(秒)或者标记名
     * @param  {[type]} tween [description]
     * @return {[type]}       [description]
     */
    at:function(time,tween){
    	var t = time;
    	if(typeof(time) === 'string'){
    		t = this.signMap[time];
    	}
    	var queue = this.line[t];
    	if(!queue){
    		queue = this.line[t] = [];
    	}
    	queue.push(tween);

        this.tweens.push(tween);

    	return this;
    },
    /**
     * 标记一个时间点
     * @param  {Number} time 时间。秒
     * @param  {String} name 标记名
     * @return this
     */
    sign:function(time,name){
    	this.signMap[name] = time;
    	return this;
    },
    play:function(){
        this.tweens.forEach(function(t){
            if(!soya2d.TweenManager.map[t.__key]){
                soya2d.TweenManager.map[t.__key] = t;
            }
            t.__reversed = false;
        });
        
        return this;
    },
    reverse:function(){
        if(this.__infinite)return;
        this.tweens.forEach(function(t){
            if(!soya2d.TweenManager.map[t.__key]){
                soya2d.TweenManager.map[t.__key] = t;
            }
            t.__reversed = true;
        });
        
        return this;
    },
    goTo:function(){

    },
    /**
     * 暂停补间器
     */
    pause:function(){
        this.tweens.forEach(function(t){
            soya2d.TweenManager.remove(t.__key);
        });
        this.emit('pause');
        return this;
    },
    restart:function(){
        this.tweens.forEach(function(t){
            t.position = 0;
            t.play();
        });
        
    }
});