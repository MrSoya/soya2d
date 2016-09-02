/**
 * sound模块定义了soya2d中内置的生效系统，该系统会自动在webaudio和audio间切换，达到最好效果。
 * <b>该模块是扩展模块，可以自行卸载</b>
 * @module sound
 */
/**
 * 声音类用来对指定音频执行播放、暂停、静音等操作
 * @class soya2d.Sound
 */
soya2d.Sound = function(opts){
    opts = opts || {};
    this.__handler;

    this.src;//路径
    this.__loop = opts.loop || false;
    this.__volume = opts.volume || 1;
    this.__muted = false;
    this.__pos = 0;
};

soya2d.Sound.prototype = {
    /**
     * 播放音频
     * @method play
     * @chainable
     */
    play:function(){
        this.__handler.play();
        return this;
    },
    /**
     * 暂停音频播放
     * @method pause
     * @chainable
     */
    pause:function(){
        this.__handler.pause();
        return this;
    },
    /**
     * 停止音频，播放头会跳到最开始
     * @method stop
     * @chainable
     */
	stop:function(){
        this.pause();
        this.loop(false);
 		this.__handler.stop();
        return this;
	},
    /**
     * 设置或者获取当前静音状态
     * @method mute
     * @param {Boolean} m 是否静音
     * @return {this|Boolean}
     */
    mute:function(m){
        if(m != undefined){
            this.__muted = m;
            if(m)
                this.__handler.mute(true);
            else{
                this.__handler.mute(false);
            }
            return this;
        }
        else{return this.__muted;}
    },
    /**
     * 设置或者获取当前循环状态
     * @method loop
     * @param {Boolean} l 是否循环
     * @return {this|Boolean}
     */
    loop:function(l){
        if(l != undefined){
            this.__loop = l;
            this.__handler._loop = l;
            return this;
        }
        else{return this.__loop;}
    },
    /**
     * 设置或者获取当前音量
     * @method volume
     * @param {Number} v 音量大小 [0.0 - 1.0]
     * @return {this|Number}
     */
    volume:function(v){
        if(v){
            this.__volume = v;
            this.__handler.volume(v);
            return this;
        }
        else{return this.__volume;}
    },
    /**
     * 设置或者获取播放头当前位置。单位:sec
     * @method pos
     * @return {this|Number}
     */
    pos:function(p){
        if(p){
            this.__pos = p;
            this.__handler.pos(p);
            return this;
        }
        else{return this.__pos;}
    },
    /**
     * 音量渐变处理
     * @method fade
     * @param  {Number}   from     开始音量 (0.0 to 1.0).
     * @param  {Number}   to       目标音量 (0.0 to 1.0).
     * @param  {Number}   duration      渐变时间。毫秒
     */
    fade:function(from, to, duration){
        this.__handler.fade(from, to, duration);
        return this;
    },
    /**
     * 监听声音事件
     * @method on
     * @param  {String} event    事件名，包括load, loaderror, play, end, pause, faded
     * @param  {Function} fn 监听器
     * @chainable
     */
    on:function(event,fn){
        this.__handler.on(event, fn);
        return this;
    },
    /**
     * 监听声音事件，只有一次
     * @method once
     * @param  {String} event    事件名，包括load, loaderror, play, end, pause, faded
     * @param  {Function} fn 监听器
     * @chainable
     */
    once:function(event,fn){
        this.__handler.once(event, fn);
        return this;
    },
    /**
     * 移除监听
     * @method off
     * @param  {String} event    事件名，包括load, loaderror, play, end, pause, faded
     * @param  {Function} [fn] 监听器。如果此参数为空，移除所有该类型监听
     * @chainable
     */
    off:function(event,fn){
        this.__handler.off(event, fn);
        return this;
    }
};
/**
 * 加载完成
 * @event load
 * @for soya2d.Sound
 */
/**
 * 加载完成
 * @event loaderror
 * @for soya2d.Sound
 */
/**
 * 加载完成
 * @event play
 * @for soya2d.Sound
 */
/**
 * 加载完成
 * @event end
 * @for soya2d.Sound
 */
/**
 * 加载完成
 * @event pause
 * @for soya2d.Sound
 */
/**
 * 加载完成
 * @event faded
 * @for soya2d.Sound
 */