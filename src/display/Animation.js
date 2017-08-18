/**
 * 动画类。用于保存一个自定义精灵帧序列。并按照指定的间隔和循环标识进行播放。
 * 通常使用多组动画来表示一个精灵的不同状态
 * @class Animation
 * @module display
 */
function Animation(frames,frameRate,loop) {
	this.frames = frames;
	this.index = 0;
	this.lastUpdateTime = 0;
	/**
	 * 纹理切换帧率。单位：帧
	 * @property frameRate
	 * @type int
	 * @default 1
	 */
	this.frameRate = frameRate || 10;
	/**
	 * 动画是否循环
	 * @property loop
	 * @type boolean
	 * @default true
	 */
	this.loop = loop===false?false:loop||true;
}
/**
 * 重置动画的帧序列索引为0
 * @method reset
 */
Animation.prototype.reset = function(){
	this.index = 0;
	this.lastUpdateTime = 0;
}

/**
 * 动画管理器被嵌入在{{#crossLink "soya2d.Sprite"}}中，每个Sprite实例都有且只有一个
 * 管理器属性。
 * 使用动画管理器可以创建针对Sprite实例的多组不同动画，并在这些动画之间进行切换播放。
 * 当管理器被创建时，会默认创建一个以该Sprite实例中所有帧序列为一组的动画——该动画没有key
 * @class AnimationManager
 * @extends Signal
 */
var AnimationManager = soya2d.class("",{
    extends:Signal,
    constructor: function(sp,size){
    	this.map = {};
    	var frames = [];
    	for(var i=0;i<size;i++){
    		frames.push(i);
    	}
    	/**
    	 * @property {Animation} defaultAnimation 每个精灵被创建时，会自动生成一个默认动画组
    	 * @type {Animation}
    	 */
		this.defaultAnimation = new Animation(frames);
		this.animation = null;
		this.playingK = null;
    },
    /**
     * 销毁管理器实例
     * @method destroy
     */
    destroy:function(){
    	this.defaultAnimation = null;
    	this.animation = null;
    	this.playingK = null;
    	this.__signalHandler = null;
    },
    /**
     * 添加一个帧动画
     * @method add
     * @param {String} key 动画在该Sprite实例内唯一的标识
     * @param {Array} frameQ   指定顺序的帧序列
     * @param {Number} [frameRate=10] 帧动画播放的速度，越小越快
     * @param {Boolean} [loop=true] 是否循环播放
     * @chainable
     */
    add:function(key,frameQ,frameRate,loop){
		this.map[key] = new Animation(frameQ,frameRate,loop);
		return this;
	},
	/**
	 * 播放指定动画组
	 * @method play
	 * @param {String} [key] 动画在该Sprite实例内唯一的标识。如果该参数为空，
	 * 会播放默认的帧序列
	 * @chainable
	 */
	play:function(key){
		if(this.playingK === key)return this;

		this.animation = key?this.map[key]:this.defaultAnimation;
		this.playingK = key || true;

		return this;
	},
	/**
	 * 停止动画
	 * @method stop
	 * @chainable
	 */
	stop:function(){
		this.playingK = null;
		if(this.animation)
			this.animation.reset();
		this.animation = null;

		return this;
	}
});

/**
 * 动画结束后触发
 * @event stop
 * @for AnimationManager
 */