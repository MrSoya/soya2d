/**
 * 动画类。用于保存一个自定义精灵帧序列。并按照指定的间隔和循环标识进行播放。
 * 通常使用多组动画来表示一个精灵的不同状态
 */
function Animation(frames,frameRate,loop) {
	this.frames = frames;
	this.index = 0;
	this.lastUpdateTime = 0;
	/**
	 * 纹理切换帧率。单位：帧<br/>
	 * @type int
	 * @default 1
	 */
	this.frameRate = frameRate || 10;
	/**
	 * 动画是否循环
	 * @type boolean
	 * @default true
	 */
	this.loop = loop===false?false:loop||true;
}
Animation.prototype.reset = function(){
	this.index = 0;
	this.lastUpdateTime = 0;
}


var AnimationManager = soya2d.class("",{
    extends:Signal,
    __signalHandler : new SignalHandler(),
    constructor: function(sp,size){
    	this.map = {};
    	var frames = [];
    	for(var i=0;i<size;i++){
    		frames.push(i);
    	}
		this.defaultAnimation = new Animation(frames);
		this.animation = null;
		this.playingK = null;
    },
    destroy:function(){
    	this.defaultAnimation = null;
    	this.animation = null;
    	this.playingK = null;
    	this.__signalHandler = null;
    },
    add:function(key,frameQ,frameRate,loop){
		this.map[key] = new Animation(frameQ,frameRate,loop);

		return this;
	},
	/**
	 * 播放指定动画组
	 * @return this
	 */
	play:function(key){
		if(this.playingK === key)return this;

		this.animation = key?this.map[key]:this.defaultAnimation;
		this.playingK = key || true;

		return this;
	},
	stop:function(key){
		this.playingK = null;
		if(this.animation)
			this.animation.reset();
		this.animation = null;

		return this;
	}
});