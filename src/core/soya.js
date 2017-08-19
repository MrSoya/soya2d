/**
 * 核心模块定义了soya2d的入口，基础组件以及循环体等
 *
 * @module core
 */
/**
 * soya2d命名空间，内含基础工具，包括创建类和模块等操作
 * @class soya2d
 */
global.soya2d = new function(){

    //渲染实例编号
    this.__roIndex=0;
    /**
     * 版本信息
     * @property version
     * @type {Object}
     */
	this.version = {
        /**
         * 版本号
         * @property version.v
         * @type {Array}
         */
        v:[2,1,0],
        /**
         * state
         * @property version.state 
         * @type {String}
         */
        state:'alpha',
        /**
         * 返回版本信息
         * @method version.toString
         * @return {String} 版本信息
         */
        toString:function(){
            return soya2d.version.v.join('.') + ' ' + soya2d.version.state;
        }
    };
    /**
     * 官网地址
     * @property website
     * @type {String}
     * @final
     */
	this.website = 'http://soya2d.com';
    /**
     * 扩展属性到对象
     * @method ext
     * @param {Object} obj 对象
     * @param {Object} attrs 属性
     * @param {Object} [cover=false] 如果已有该属性，是否覆盖
     */
	this.ext = function(obj,attrs,cover){
        var keys = Object.keys(attrs);
		for (var i=keys.length;i--;) {
            var attrName = keys[i];
            if(!obj.hasOwnProperty(attrName) || cover)
                obj[attrName] = attrs[attrName];
        }
	};

    function inherits(child,parent){
    	//采用原型对象创建，可以保证只继承原型上挂着的方法，而构造内定义的方法不会继承
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        child.prototype._super = parent.prototype;
	}

    /**
     * 定义一个类。并可以定义原型属性或实例属性。
     * ```
     * soya2d.class("mrsoya.shape",{
extends:soya2d.DisplayObject,
color:'#000',//原型属性
constructor: function(data){
    this.x = data.x;//实例属性
},
toString:function(){}//原型方法
});
     * ```
     * @method class
     * @param {String} namePath 带命名空间的全路径
     * @param {Object} param    参数
     * @param {Object} param.extends    集成自
     * @param {Object} param.constructor   构造函数
     */
    this.class = function(namePath,param){
        var constr = param.constructor;        
        var parent = param.extends;
        var cls = function(){
            if(parent)parent.apply(this,arguments);
            if(constr)constr.apply(this,arguments);
        };
        if(parent)inherits(cls,parent);
        for(var k in param){
            if(k === 'extends' || k==='constructor')continue;
            cls.prototype[k] = param[k];
        }

        if(namePath){
            var ps = namePath.split('.');
            var name = ps[ps.length-1];
            var ns = self;
            if(ps.length>1){
                for (var i = 0; i < ps.length; i++) {
                    if(ps[i] !== name){
                        ns = ns[ps[i]];
                        if(!ns){
                            ns = {};
                        }
                    }
                }
            }
            ns[name] = cls;
            cls.prototype.class = namePath;
        }

        return cls;
    }

    /**
     * 模块管理
     */
    this.module = new function(){
        var map = {};
        /**
         * 安装新模块
         * @method module.install
         * @param  {string} key  模块标识
         * @param  {Object} opts 回调事件
         * @param  {function} opts.onInit 模块初始化时调用,回调参数[soya2d.Game]
         * @param  {function} opts.onBeforeUpdate 主循环逻辑更新前调用，[soya2d.Game,当前时间毫秒,循环间隔]
         * @param  {function} opts.onPostUpdate 主循环逻辑更新后调用，[soya2d.Game,当前时间毫秒,循环间隔]
         * @param  {function} opts.onBeforeRender 主循环绘图前调用，[soya2d.Game,当前时间毫秒,循环间隔]
         * @param  {function} opts.onPostRender 主循环绘图后调用，[soya2d.Game,当前时间毫秒,循环间隔,渲染实体数]
         * @param  {function} opts.onStart 游戏实例启动时调用[soya2d.Game]
         * @param  {function} opts.onStop 游戏实例停止时调用[soya2d.Game]
         * @param  {function} opts.onSceneChange 游戏当前场景发生改变时调用[soya2d.Game，当前场景]
         */
        this.install = function(key,opts){
            map[key] = opts;
        }

        /**
         * @private
         */
        this._getAll = function(){
            return map;
        }
    }

    /**
     * 渲染一个soya2D舞台。该方法是soya2d的入口方法，会自动创建一个使用指定场景启动的soya2d.Game实例
     * ```
     *     soya.render('#stage',1024,768,scene);
     * ```
     * @method render
     * @param {String | HTMLElement} container 游戏渲染的容器，可以是一个选择器字符串或者DOM对象
     * @param {int} w 游戏的宽度
     * @param {int} h 游戏的高度
     * @param  {Scene} scene  渲染场景
     * @return {soya2d.Game}
     */
    this.render = function(container,w,h,scene){
        var game = new soya2d.Game({
            w:w,
            h:h,
            container:container
        });
        game.start();
        game.scene.start(scene);
        return game;
    }
};
global.soya = soya2d;

//系统扩展
self.Int8Array = self.Int8Array || Array;
self.Uint8Array = self.Uint8Array || Array;
self.Int16Array = self.Int16Array || Array;
self.Uint16Array = self.Uint16Array || Array;
self.Int32Array = self.Int32Array || Array;
self.Uint32Array = self.Uint32Array || Array;
self.Float32Array = self.Float32Array || Array;

self.console = self.console||new function(){
	this.log = function(){}
	this.info = function(){}
	this.debug = function(){}
	this.error = function(){}
    this.warn = function(){}
}

/**
 * 控制台输出接口，使用CSS样式方式
 * @class soya2d.console
 */
soya2d.console = new function(){
    var level = 1;

    /**
     * 设置输出级别。按照优先级从高到底的顺序为 error > warn > info > debug | none，
     * 对应值为 4 > 3 > 2 > 1 > 0。设置为低级别时，高级别的信息也会输出。比如设置为warn时,
     * error也会输出，但是info/debug不会。当界别设置为0时，console不会有任何输出
     * @method level
     * @param  {int} [l=1] 输出级别，默认全部 
     */
    this.level = function(l){
        level = l==0?0:l||1;
    }
    /**
     * 输出调试信息
     * @method debug
     * @param  {string} txt  输出文本
     * @param  {string} [css] 字体css
     */
    this.debug = function(txt,css){
        if(level!=1)return;

        if(soya2d.Device.ie){
            console.debug(txt);
        }else{
            console.debug('%c'+txt,css||'padding:1px 50px;font-size:14px;color:#fff;background:#0069D6;');
        }
    }
    /**
     * 输出日志信息
     * @method info
     * @param  {string} txt  输出文本
     * @param  {string} [css] 字体css
     */
    this.info = function(txt,css){
        if(level<1 || level>2)return;

        if(soya2d.Device.ie){
            console.log(txt);
        }else{
            console.log('%c'+txt,css||'padding:1px 50px;font-size:14px;color:#fff;background:#2DB008;');
        }
    }
    /**
     * 输出警告信息
     * @method warn
     * @param  {string} txt  输出文本
     * @param  {string} [css] 字体css
     */
    this.warn = function(txt,css){
        if(level<1 || level>3)return;

        if(soya2d.Device.ie){
            console.warn(txt);
        }else{
            console.warn('%c'+txt,css||'padding:1px 50px;font-size:14px;color:#fff;background:#FFB502;');
        }
    }
    /**
     * 输出错误信息
     * @method error
     * @param  {string} txt  输出文本
     * @param  {string} [css] 字体css
     */
    this.error = function(txt,css){
        if(level<1)return;

        if(soya2d.Device.ie){
            console.error(txt);
        }else{
            console.error('%c'+txt,css||'padding:1px 50px;font-size:14px;color:#fff;background:#ff0000;');
        }
    }
}


self.cancelAFrame = (function(w){
    return w.cancelAnimationFrame           ||
        w.webkitCancelRequestAnimationFrame ||
        w.msCancelRequestAnimationFrame     ||
        w.mozCancelRequestAnimationFrame    ||
        w.oCancelRequestAnimationFrame      ||
        w.clearTimeout
})(self);
self.requestAFrame = (function(w){
    return  w.requestAnimationFrame       || 
            w.webkitRequestAnimationFrame ||
            w.msRequestAnimationFrame     ||
            w.mozRequestAnimationFrame    ||
            w.oRequestAnimationFrame      ||
            function(callback) {
                return w.setTimeout(function() {
                    callback(Date.now());
                },16.7);
            };
})(self);

/**
 * 混合类型——默认
 * @property BLEND_NORMAL
 * @final
 * @static
 * @for soya2d
 */
soya2d.BLEND_NORMAL = 'source-over';
/**
 * 混合类型——高亮
 * @property BLEND_LIGHTER
 * @final
 * @static
 * @for soya2d
 */
soya2d.BLEND_LIGHTER = 'lighter';
/**
 * 混合类型——遮罩
 * @property BLEND_MASK
 * @final
 * @static
 * @for soya2d
 */
soya2d.BLEND_MASK = 'destination-in';
/**
 * 混合类型——清除
 * @property BLEND_CLEAR
 * @final
 * @static
 * @for soya2d
 */
soya2d.BLEND_CLEAR = 'destination-out';
/**
 * 线条端点类型——BUTT
 * @property LINECAP_BUTT
 * @final
 * @static
 * @for soya2d
 */
soya2d.LINECAP_BUTT = 'butt';
/**
 * 线条端点类型——ROUND
 * @property LINECAP_ROUND
 * @final
 * @static
 * @for soya2d
 */
soya2d.LINECAP_ROUND = 'round';
/**
 * 线条端点类型——SQUARE
 * @property LINECAP_SQUARE
 * @final
 * @static
 * @for soya2d
 */
soya2d.LINECAP_SQUARE = 'square';
/**
 * 线条交点类型——BEVEL
 * @property LINEJOIN_BEVEL
 * @final
 * @static
 * @for soya2d
 */
soya2d.LINEJOIN_BEVEL = 'bevel';
/**
 * 线条交点类型——ROUND
 * @property LINEJOIN_ROUND
 * @final
 * @static
 * @for soya2d
 */
soya2d.LINEJOIN_ROUND = 'round';
/**
 * 线条交点类型——MITER
 * @property LINEJOIN_MITER
 * @final
 * @static
 * @for soya2d
 */
soya2d.LINEJOIN_MITER = 'miter';

/**
 * 文本水平对齐类型——TEXTALIGN_LEFT
 * @property TEXTALIGN_LEFT
 * @final
 * @static
 * @for soya2d
 */
soya2d.TEXTALIGN_LEFT = "left";
/**
 * 文本水平对齐类型——TEXTALIGN_CENTER
 * @property TEXTALIGN_CENTER
 * @final
 * @static
 * @for soya2d
 */
soya2d.TEXTALIGN_CENTER = "center";
/**
 * 文本水平对齐类型——TEXTALIGN_RIGHT
 * @property TEXTALIGN_RIGHT
 * @final
 * @static
 * @for soya2d
 */
soya2d.TEXTALIGN_RIGHT = "right";
/**
 * 文本垂直对齐类型——TEXTVALIGN_TOP
 * @property TEXTVALIGN_TOP
 * @final
 * @static
 * @for soya2d
 */
soya2d.TEXTVALIGN_TOP = "hanging";
/**
 * 文本垂直对齐类型——TEXTVALIGN_MIDDLE
 * @property TEXTVALIGN_MIDDLE
 * @final
 * @static
 * @for soya2d
 */
soya2d.TEXTVALIGN_MIDDLE = "middle";
/**
 * 文本垂直对齐类型——TEXTVALIGN_BOTTOM
 * @property TEXTVALIGN_BOTTOM
 * @final
 * @static
 * @for soya2d
 */
soya2d.TEXTVALIGN_BOTTOM = "alphabetic";
/**
 * 文本书写方向——从左到右
 * @property TEXTDIR_LTR
 * @final
 * @static
 * @for soya2d
 */
soya2d.TEXTDIR_LTR = "ltr";
/**
 * 文本书写方向——从右到左
 * @property TEXTDIR_RTL
 * @final
 * @static
 * @for soya2d
 */
soya2d.TEXTDIR_RTL = "rtl";

/**
 * 线性渐变类型
 * @property GRADIENT_LINEAR
 * @final
 * @static
 * @for soya2d
 */
soya2d.GRADIENT_LINEAR = 1;
/**
 * 放射渐变类型
 * @property GRADIENT_RADIAL
 * @final
 * @static
 * @for soya2d
 */
soya2d.GRADIENT_RADIAL = 2;