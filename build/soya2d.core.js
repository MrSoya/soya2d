/*
 * Soya2D is a web interactive animation(game) engine for modern web browsers 
 *
 *
 * Copyright 2015-2016 MrSoya and other contributors
 * Released under the MIT license
 *
 * website: http://soya2d.com
 * last build: 2016-08-29
 */
!function (global) {
	'use strict';
/**
 * 核心包定义了soya2d的入口，基础组件以及循环体等
 *
 * @module core
 */
/**
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
        v:[2,0,0],
        /**
         * state
         * @property version.state 
         * @type {String}
         */
        state:'beta1',
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
     * define a class
     * @method class
     * @param {String} namePath full class path with namespace
     * @param {Object} param    as below
     * @param {Object} param.extends    extends to
     * @param {Object} param.constructor   constructor of the class
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
         * @param  {function} opts.onUpdate 主循环逻辑更新时调用，[soya2d.Game,当前时间毫秒,循环间隔]
         * @param  {function} opts.onAfterUpdate 主循环逻辑更新后调用，[soya2d.Game,当前时间毫秒,循环间隔]
         * @param  {function} opts.onBeforeRender 主循环绘图前调用，[soya2d.Game,当前时间毫秒,循环间隔]
         * @param  {function} opts.onAfterRender 主循环绘图后调用，[soya2d.Game,当前时间毫秒,循环间隔]
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
/**
 * 摄像机是世界的视口，game.world里的内容都会呈现在camera的镜头内。
 * 当移动镜头时，world中的内容会向反方向移动，就像真实世界中样
 * @class Camera
 * 
 */
function Camera(w,h,game) {
    Object.defineProperties(this,{
        /**
         * camera在world中的位置
         * @property x
         * @type {Number}
         */
        x : {
            set:function(v){
                this.__view.x = v;
                this.__checkBounds();
            },
            get:function(){
                return this.__view.x;
            }
        },
        /**
         * camera在world中的位置
         * @property y
         * @type {Number}
         */
        y : {
            set:function(v){
                this.__view.y = v;
                this.__checkBounds();
            },
            get:function(){
                return this.__view.y;
            }
        },
        /**
         * camera的宽度，等同于舞台宽度
         * @property w
         * @type {Number}
         */
        w : {
            get:function(){
                return this.__view.w;
            }
        },
        /**
         * camera的高度，等同于舞台高度
         * @property w
         * @type {Number}
         */
        h : {
            get:function(){
                return this.__view.h;
            }
        }
    });
    /**
     * 镜头内限制目标跟踪范围的矩形区域，跟踪目标时有效。
     * freezone的x/y/w/h都是相对于camera的
     * @property freezone
     * @type {soya2d.Rectangle}
     */
    this.freezone = null;

    this.__view = new soya2d.Rectangle(0,0,w,h);
    this.__game = game;
}
Camera.prototype = {
    /**
     * 设置camera跟踪一个精灵。<br/>一旦设置有效精灵后，camera将根据freezone设置进行精灵位置跟踪，
     * 而忽略camera本身的任何移动方法。
     * @method follow
     * @param  {soya2d.DisplayObject} target camera跟踪目标，必须是容器内的精灵
     */
    follow:function(target){
        var tmp = this.__game.world.find(function(ro){
            if(target.roid === ro.roid)return true;
        },true);
        if(tmp.length<0){
            soya2d.console.error('camera: '+target.toString()+' must be a child node of game.world');
        }
        this.target = target;
    },
    /**
     * 取消跟踪
     * @method unfollow
     */
    unfollow:function(){
        this.target = null;
    },
    /**
     * 移动卷轴指定坐标
     * @method moveTo
     * @param  {number} x x轴坐标
     * @param  {number} y y轴坐标
     */
    moveTo:function(x,y){
        if(this.target)return;
        this.__view.x = x;
        this.__view.y = y;
        
        this.__checkBounds();
    },
    /**
     * 移动卷轴指定偏移
     * @method moveBy
     * @param  {number} offX x轴偏移量
     * @param  {number} offY y轴偏移量
     */
    moveBy:function(offX,offY){
        if(this.target)return;
        this.__view.x += offX;
        this.__view.y += offY;
        
        this.__checkBounds();
    },
    /**
     * 重置camera的位置为 0,0
     * @method reset
     */
    reset:function(){
        this.__view.x = this.__view.y = 0;
    },
    __checkBounds:function(){
        var scope = this.__game.world.bounds;

        var left = scope.x,
            top = scope.y,
            right = scope.w,
            bottom = scope.h;

        //l & r
        var bx = this.__view.x;
        if(bx < left)this.__view.x = left;
        if(right>0 && bx + this.__view.w > right)
            this.__view.x = right - this.__view.w;
        //t & b
        var by = this.__view.y;
        if(by < top)this.__view.y = top;
        if(bottom>0 && by + this.__view.h > bottom)
            this.__view.y = bottom - this.__view.h;
    },
    /**
     * 设置camera freezone范围
     * @method setFreezone
     * @param {soya2d.Rectangle} freezone 范围矩形
     */
    setFreezone:function(scope){
        if(!scope)return;
        this.freezone = scope;
    },
    __onUpdate:function(){
        if(!this.target || !this.target.game)return;

        var tx,ty;
        var wp = this.target.worldPosition;
        tx = wp.x,
        ty = wp.y;
        var tw = this.target.w,
            th = this.target.h;
            
        var offx = tx - this.__view.x,
            offy = ty - this.__view.y;
        if(this.freezone){
            var fx = this.freezone.x,
                fy = this.freezone.y,
                fw = this.freezone.w,
                fh = this.freezone.h;
            var left = this.__view.x + fx,
                top = this.__view.y + fy,
                right = this.__view.x + fx + fw,
                bottom = this.__view.y + fy + fh;
            var halfTw = tw/2,
                halfTh = th/2;
            if(tx - halfTw < left){
                this.__view.x = tx - fx - halfTw;
            }else if(tx+halfTw > right){
                this.__view.x = tx - fw - fx + halfTw;
            }

            if(ty - halfTh < top){
                this.__view.y = ty - fy - halfTh;
            }else if(ty+halfTh > bottom){
                this.__view.y = ty - fh - fy + halfTh;
            }
        }else{
            this.__view.x = tx - this.__view.w/2;
            this.__view.y = ty - this.__view.h/2;
        }

        this.__checkBounds();
    },
    //裁剪舞台，修改全局坐标
    __cull:function(stage){
        var c = stage.children;
        for(var i=c.length;i--;){
            cull(c[i],this.__view);
        }
    },
    //转换世界坐标到屏幕坐标
    __viewport:function(world){
        var c = world.children;
        for(var i=c.length;i--;){
            viewport(c[i],this.__view);
        }
    }
}

function cull(ro,cameraRect){
    if(ro.__renderable){
        //don't cull fixed DO
        if(ro.__fixedToCamera)return;

        if(!cameraRect.intersectWith(ro.getBoundingBox())){
            ro.__renderable = false;
            return;
        }

        if(ro.children)
            for(var i=ro.children.length;i--;){
                var c = ro.children[i];
                if(c.__renderable){
                    cull(c,cameraRect);
                }
            }
    }
}

function viewport(ro,cameraRect,toFixed){
    if(ro.__renderable){
        var x = null,y = null;
        if(ro.__fixedToCamera){
            var x = ro.cameraOffset.x + ro.anchorPosition.x;
            var y = ro.cameraOffset.y + ro.anchorPosition.y;
            toFixed = true;

        }else if(toFixed){
            x = ro.parent.__screenPosition.x - ro.parent.anchorPosition.x + ro.x + ro.anchorPosition.x;
            y = ro.parent.__screenPosition.y - ro.parent.anchorPosition.y + ro.y + ro.anchorPosition.y;
        }else{
            x = ro.worldPosition.x;
            y = ro.worldPosition.y;
            x -= cameraRect.x;
            y -= cameraRect.y;
        }
        ro.__screenPosition.set(x,y);

        if(ro.children)
            for(var i=ro.children.length;i--;){
                var c = ro.children[i];
                if(c.__renderable){
                    viewport(c,cameraRect,toFixed);
                }
            }
    }
}
/**
 * 数学接口提供了常用的静态常量以及方法<br/>
 * @class soya2d.Math
 * @static
 */
soya2d.Math = {
	/**
	 * π，9位精度
	 * @property PI
	 * @type {Number}
	 * @static
	 * @final
	 */
	PI : 3.141592654,
	/**
	 * 2π，9位精度
	 * @property PIM2
	 * @type {Number}
	 * @static
	 * @final
	 */
	PIM2 : 6.283185307,
	/**
	 * π/2，9位精度
	 * @property PID2
	 * @type {Number}
	 * @static
	 * @final
	 */
	PID2 : 1.570796327,
	/**
	 * π/4，9位精度
	 * @property PID4
	 * @type {Number}
	 * @static
	 * @final
	 */
	PID4 : 0.785398163,
	/**
	 * 1角度对应弧度，9位精度
	 * @property ONERAD
	 * @type {Number}
	 * @static
	 * @final
	 */
	ONERAD : 0.017453292,
	/**
	 * 1弧度对应角度，9位精度
	 * @property ONEANG
	 * @type {Number}
	 * @static
	 * @final
	 */
	ONEANG : 57.295779513,
	/**
	 * 转为弧度
	 * @method toRadian
	 * @static
	 * @param {Number} ang 角度
	 * @return {Number}
	 */
	toRadian : function(ang){return ang*this.ONERAD},
	/**
	 * 转为角度
	 * @method toAngle
	 * @static
	 * @param {Number} rad 弧度
	 * @return {Number}
	 */
	toAngle : function(rad){return rad*this.ONEANG},
	/**
	 * 获得随机数，浮点型
	 * @method randomf
	 * @static
	 * @param {Number} a 上限
	 * @param {Number} b 下限
	 * @return {Number}
	 */
	randomf : function(a,b){return a+(Math.random()*(b-a));},
    /**
     * 获得随机数，整型
     * @method randomi
	 * @static
     * @param a 上限
     * @param b 下限
     * @return {Number}
     */
	randomi: function(a,b){return (a+(Math.random()*(b-a)))>>0;},
    /**
     * 对浮点数取整，四舍五入
     * @method round
	 * @static
     * @param {Number} n 浮点数
     * @return {Number}
     */
    round:function(n){
        return (0.5 + n)>>0;
    },
    /**
     * 对浮点数取整，小数部分被舍弃
     * @method floor
	 * @static
     * @param {Number} n 浮点数
     * @return {Number}
     */
    floor:function(n){
        return n|0;
    },
	/**
	 * 计算平面两点距离
	 * @method len2D
	 * @static
	 * @param {Number} p1x 
	 * @param {Number} p1y 
	 * @param {Number} p2x 
	 * @param {Number} p2y 
	 * @return {Number}
	 */
	len2D:function(p1x,p1y,p2x,p2y){
		return Math.sqrt((p2y-p1y)*(p2y-p1y) + (p2x-p1x)*(p2x-p1x));
	},
	/**
	 * 快速计算平面两点距离
	 * 注意：此方法会产生少量误差，可以用在精度不高，但要求速度的场景中
	 * @method len2Df
	 * @static
	 * @param {Number} dx X轴坐标差值
	 * @param {Number} dy Y轴坐标差值
	 * @return {Number}
	 */
	len2Df:function(dx,dy){//D-values
		dx = Math.abs(dx);
		dy = Math.abs(dy);
		
		var min = Math.min(dx,dy);
		
		return (dx+dy-(min>>1)-(min>>2)+(min>>4));
	},
	/**
	 * sin表，包含0到360度，共361个正玄值，可以通过SINTABLE[0-360整数角度]，直接引用
	 * @property SINTABLE
	 * @type {Float32Array}
	 * @static
	 * @final
	 */
	SINTABLE : (function(){
		var t = new Float32Array(361);
		var r = 0.017453292;
		for(var ang=0;ang<=360;ang++){
		    var theta = ang*r;
		    var rs = Math.sin(theta);
		    t[ang] = rs
		}
		return t;
	})(),
	/**
	 * cos表，包含0到360度，共361个余玄值，可以通过COSTABLE[0-360整数角度]，直接引用
	 * @property COSTABLE
	 * @type {Float32Array}
	 * @static
	 * @final
	 */
	COSTABLE : (function(){
		var t = new Float32Array(361);
		var r = 0.017453292;
		for(var ang=0;ang<=360;ang++){
		    var theta = ang*r;
		    var rs = Math.cos(theta);
		    t[ang] = rs
		}
		return t;
	})()
};
/**
 * 资源类提供了用于获取指定类型资源的服务。这是一个内部类，无法在外部实例化。
 * 每个game有且只有一个assets属性，通过该属性可以获取资源。
 * ```
 *     game.assets.sound('bgm').play();
 * ```
 * @class Assets
 * 
 */
function Assets(){
    this.__assets = {
        image:{},
        sound:{},
        imageFont:{},
        atlas:{},
        text:{},
        xml:{},
        json:{}
    };
};
Assets.prototype = {
    /**
     * 获取一个图像资源
     * @method image
     * @param  {String} key 加载资源时指定的key
     * @return {HTMLImageElement}  
     */
    image:function(key){
        return this.__assets.image[key];
    },
    /**
     * 获取一个声音资源。
     * 如果没有装载声音模块，该方法永远不会返回有效值
     * @method sound
     * @param  {String} key 加载资源时指定的key
     * @return {soya2d.Sound}  
     */
    sound:function(key){
        return this.__assets.sound[key];
    },
    /**
     * 获取一个图像文字资源
     * @method imageFont
     * @param  {String} key 加载资源时指定的key
     * @return {soya2d.ImageFont}  
     */
    imageFont:function(key){
        return this.__assets.imageFont[key];
    },
    /**
     * 获取一个图像集资源
     * @method atlas
     * @param  {String} key 加载资源时指定的key
     * @return {soya2d.Atlas}  
     */
    atlas:function(key){
        return this.__assets.atlas[key];
    },
    /**
     * 获取一个文本资源
     * @method text
     * @param  {String} key 加载资源时指定的key
     * @return {String}  
     */
    text:function(key){
        return this.__assets.text[key];
    },
    /**
     * 获取一个xml资源
     * @method xml
     * @param  {String} key 加载资源时指定的key
     * @return {Document}  
     */
    xml:function(key){
        return this.__assets.xml[key];
    },
    /**
     * 获取一个json资源
     * @method json
     * @param  {String} key 加载资源时指定的key
     * @return {Object}  
     */
    json:function(key){
        return this.__assets.json[key];
    }
}

/**
 * 图像集通过精灵表(ssheet)自动切割出多个小图，并按照topLeft-bottomRight的方式，
 * 索引从0-n和小图对应。
 * ssheet格式为<br/>
 * ```
 * [
 		{n:'hero_001.png',x:0,y:0,w:50,h:50,r:90},//ssheet unit，index 0
 		{n:'hero_002.png',x:50,y:50,w:50,h:50,r:180},//index 1
 		...
 	]
 	```
 * r:将指定部分资源旋转指定角度后，形成新纹理
 * @class soya2d.Atlas
 * @constructor
 * @param {HTMLImageElement} image 大图纹理
 * @param {Object} ssheet 图像集描述
 * 
 */
soya2d.Atlas = function(image,ssheet){
	this.texs = {};//纹理集
	ssheet.forEach(function(desc){
		var data = document.createElement('canvas');
		data.width = desc.w;
		data.height = desc.h;
		var ctx = data.getContext('2d');
		ctx.translate(desc.w/2,desc.h/2);
		ctx.rotate((desc.r||0)*Math.PI/180);

		var descW = desc.w>>0,
			descH = desc.h>>0;
		if(descW===0 || descH===0){
			soya2d.console.error('soya2d.Atlas: invalid ssheet unit，w/h must be a positive;[w:'+descW+',h:'+descH+'] ');
			return;
		}
		ctx.drawImage(image,
						desc.x>>0,desc.y>>0,descW,descH,
						-descW/2>>0,-descH/2>>0,descW,descH);
		this.texs[desc.n] = data;
	},this);
};

soya2d.Atlas.prototype = {
	/**
	 * 返回由一个指定的字符串开始按字母排序的所有纹理
	 * @method getAll
	 * @param  {String} prefix 前缀
	 * @return {Array}
	 */
	getAll:function(prefix){
		var rs = [];
		for(var i in this.texs){
			if(!prefix || prefix==='*' || (prefix && i.indexOf(prefix)===0))
				rs.push(this.texs[i]);
		}
		
		return rs;
	},
	/**
	 * 通过索引区间获取图像帧数组
	 * @method getByIndex
	 * @param  {Number} s 开始索引
	 * @param  {Number} e 结束索引
	 * @return {Array} 
	 */
	getByIndex:function(s,e){
		var rs = [];
		var ks = Object.keys(this.texs);
		for(var i=s;i<=e;i++){
			var t = this.texs[ks[i]];
			rs.push(t);
		}
		return rs;
	},
	/**
	 * 通过图像帧名称获取对应图像帧
	 * @method get
	 * @param  {String} name 在ssheet中指定的n
	 * @return {HTMLImageElement}
	 */
	get:function(name){
		return this.texs[name];
	},
	/**
	 * 释放图像集数据
	 * @method destroy
	 */
	destroy:function(){
		this.texs = null;
	}
};




/**
 * 信号类用来实现soya2D内部的消息系统
 * 
 * @class Signal
 */

function Signal(){
    // this.__signalHandler;
}
Signal.prototype = {
    /**
     * 监听一个信号
     * @method on
     * @param {String} type 信号类型，多个类型使用空格分割
     * @param {Function} cbk 回调函数，回调参数[target,...]
     * @param {int} order 触发序号，越大的值越先触发
     * @return this
     */
    on:function(type,cbk,order){
        if(this instanceof soya2d.DisplayObject){
            switch(type){
                case 'pointdown':
                    type = soya2d.Device.mobile?'touchstart':'mousedown';
                    break;
                case 'pointmove':
                    type = soya2d.Device.mobile?'touchmove':'mousemove';
                    break;
                case 'pointup':
                    type = soya2d.Device.mobile?'touchend':'mouseup';
                    break;
            }
        }
        this.__signalHandler.on(type,cbk,order,this);
        return this;
    },
    /**
     * 监听一个信号一次
     * @method once
     * @param {String} type 信号类型，多个类型使用空格分割
     * @param {Function} cbk 回调函数
     * @param {int} order 触发序号，越大的值越先触发
     * @return this
     */
    once:function(type,cbk,order){
        this.__signalHandler.once(type,cbk,order,this);
        return this;
    },
    /**
     * 取消监听
     * @method off
     * @param {String} [type] 信号类型，多个类型使用空格分割。如果为空，删除所有信号监听
     * @param {Function} [cbk] 监听时的函数引用。如果为空，删除该类型下所有监听
     */
    off:function(type,cbk){
        this.__signalHandler.off(type,cbk,this);
    },
    /**
     * 发射指定类型信号
     * @method emit
     * @param {String} type 信号类型
     * @param {...} params 不定类型和数量的参数
     */
    emit:function(){
        var params = [arguments[0],this];
        for(var i=1;i<arguments.length;i++){
            params.push(arguments[i]);
        }
        this.__signalHandler.emit.apply(this.__signalHandler,params);
        return this;
    }
}

/**
 * 信号类用来实现soya2D内部的消息系统
 * @class SignalHandler
 */
function SignalHandler(){
    this.map = {};
}
SignalHandler.prototype = {
    on:function(type,cbk,order,context){
        var ts = type.replace(/\s+/mg,' ').split(' ');
        for(var i=ts.length;i--;){
            var listeners = this.map[ts[i]];
            if(!listeners)listeners = this.map[ts[i]] = [];
            listeners.push([cbk,context,order]);
        }
    },
    once:function(type,cbk,order,context){
        var ts = type.replace(/\s+/mg,' ').split(' ');
        for(var i=ts.length;i--;){
            var listeners = this.map[ts[i]];
            if(!listeners)listeners = this.map[ts[i]] = [];
            listeners.push([cbk,context,order,true]);
        }
    },
    off:function(type,cbk,context){
        var types = null;
        if(!type){
            types = Object.keys(this.map);
        }else{
            types = type.replace(/\s+/mg,' ').split(' ');
        }

        for(var i=types.length;i--;){
            var listeners = this.map[types[i]];
            if(listeners){
                var toDel = [];
                for(var j=listeners.length;j--;){
                    if(context === listeners[j][1] && 
                        (cbk?listeners[j][0] === cbk:true)){
                        toDel.push(listeners[j]);
                    }
                }
                toDel.forEach(function(listener){
                    var index = listeners.indexOf(listener);
                    listeners.splice(index,1);
                });
            }
        }
    },
    //type,src
    emit:function(){
        var listeners = this.map[arguments[0]];
        if(!listeners)return;
        
        var target = arguments[1];
        var params = [target];
        for(var i=2;i<arguments.length;i++){
            params.push(arguments[i]);
        }

        listeners.sort(function(a,b){
            return b[2] - a[2];
        });

        listeners.filter(function(item){
            if(item[1] === target)
                item[0].apply(item[1],params);
        });
        var last = listeners.filter(function(item){
            if(!item[3])return true;
        });

        this.map[arguments[0]] = last;
    }
}
/**
 *  资源加载类加载所有相关资源，并放入{{#crossLink "Assets"}}{{/crossLink}}中。
 *  该类不能被实例化，系统会自动创建实例给game。
 *  每个game有且只有一个load属性，通过该属性可以加载资源。
 *  ```
 *      game.load.baseUrl = 'assets/xml/';
 *      game.load.xml({
 *          ui:'ui.xml'
 *      });
 * ```
 *  @class Loader
 */
var Loader = soya2d.class("",{
    extends:Signal,
    timeout:5000,
    constructor:function(game){
        this.__signalHandler = new SignalHandler();
        this.__assetsQueue = [];

        this.game = game;
        this.__assets = game.assets.__assets;

        this.baseUrl = '';

        var show = true;
        Object.defineProperties(this,{
            /**
             * 是否显示默认的进度条
             * @property show
             * @type {Boolean}
             */
            show : {
                set:function(v){
                    show = v;
                },
                get:function(){
                    return show;
                }
            },
            /**
             * 进度条文字样式
             * @property fillStyle
             * @type {String}
             */
            fillStyle:{
                set:function(v){
                    this.__tip.fillStyle = v;
                },
                get:function(){
                    return this.__tip.fillStyle;
                }
            }
        });

        this.__logo = new soya2d.Shape({
            game:game,
            opacity:0,
            x: game.w/2 - 11,
            y: game.h/2 - 30 - 20,
            z:9999
        });
        var p1 = new soya2d.Shape({
            w:23,h:20,
            skewY:-30,
            game:game,
            fillStyle:'#69CA14',
            onRender:function(g){
                g.beginPath();
                g.fillStyle(this.fillStyle);
                g.rect(0,0,this.w,this.h);
                g.fill();
                g.closePath();
            }
        });
        var p2 = new soya2d.Shape({
            game:game,
            w:23,h:20,
            skewY:30,
            y:13,
            opacity:.9,
            fillStyle:'#2A5909',
            onRender:function(g){
                g.beginPath();
                g.fillStyle(this.fillStyle);
                g.rect(0,0,this.w,this.h);
                g.fill();
                g.closePath();
            }
        });
        var p3 = new soya2d.Shape({
            game:game,
            w:23,h:20,
            skewY:-30,
            y:28,
            blendMode:soya2d.BLEND_LIGHTER,
            fillStyle:'#69CA14',
            onRender:function(g){
                g.beginPath();
                g.fillStyle(this.fillStyle);
                g.rect(0,0,this.w,this.h);
                g.fill();
                g.closePath();
            }
        });
        
        var font = new soya2d.Font('normal 400 23px/normal Arial,Helvetica,sans-serif');
        this.__tip = new soya2d.Text({
            game:game,
            x: -70,
            y: 60 + 10,
            font:font,
            text:'Loading... 0/0',
            w:200,
            fillStyle: '#000'
        });
        this.__logo.add(p1,p2,p3,this.__tip);
        game.world.add(this.__logo);
    },
    __addToAssets:function(type,data){
        for(var k in data){
            this.__assetsQueue.push({type:type,k:k,data:data[k],baseUrl:this.baseUrl});
        }
    },
    /**
     * 加载图像
     * @method image
     * @param  {Object | Array} data 图像的key和url对象，如{btn:'button.png',bullet:'x01.png'}。
     * 或者图像url数组，key为不包含后缀的图像名，如果重复会覆盖
     */
    image:function(data){
        var map = data;
        if(data instanceof Array){
            map = {};
            data.forEach(function(url){
                var sPos = url.lastIndexOf('/')+1;
                var ePos = url.lastIndexOf('.');
                var k = url.substring(sPos,ePos);
                map[k] = url;
            });
        }
        this.__addToAssets('image',map);
    },
    /**
     * 加载声音
     * @method sound
     * @param  {Object} data 声音的key和url。url可以是数组或者字符串。当url是数组类型时，
     * 系统会自动判断当前环境支持的声音格式，并加载。{bird:'bird.ogg',boom:['b1.mp3','b1.ogg']}
     */
    sound:function(data){
        this.__addToAssets('sound',data);
    },
    /**
     * 加载字体
     * @method font
     * @param  {Object} data 字体的key和url。key就是字体的family。{serif:'serif.woff'}
     */
    font:function(data){
        this.__addToAssets('font',data);
    },
    /**
     * 加载图像文字
     * @method imageFont
     * @param  {Object} data 图像文字的key和url。url是一个包含了图像地址和精灵表地址的数组。
     * {title:['title.png','title_ss.json'|{{n:'xx',x:0,y:0,w:100,h:100}}]}
     */
    imageFont:function(data){
        this.__addToAssets('imageFont',data);
    },
    /**
     * 加载图像集
     * @method atlas
     * @param  {Object} data 图像集的key和url。url是一个包含了图像地址和精灵表地址的数组。
     * {birds:['birds.png','birds_ss.json']}
     *
     * @param {String} key 图像集的key
     * @param {String} url 图像的url
     * @param {Number} width 单个图像的宽度
     * @param {Number} height 单个图像的高度
     */
    atlas:function(data){
        var map = data;
        if(arguments.length === 4){
            map = {};
            var k = arguments[0];
            var url = arguments[1];
            var w = arguments[2];
            var h = arguments[3];
            map[k] = [url,w,h];
        }
        this.__addToAssets('atlas',map);
    },
    /**
     * 加载文本
     * @method text
     * @param {Object} data 文本的key和url
     */
    text:function(data){
        this.__addToAssets('text',data);
    },
    /**
     * 加载XML
     * @method xml
     * @param  {Object} data xml的key和url
     */
    xml:function(data){
        this.__addToAssets('xml',data);
    },
    /**
     * 加载json
     * @method json
     * @param  {Object} data json的key和url
     */
    json:function(data){
        this.__addToAssets('json',data);
    },
    __loadImage:function(baseUrl,url,onload){
        var img = new Image();
        if(this.crossOrigin !== undefined)img.crossOrigin = this.crossOrigin;
        img.path = url;
        var loader = this;
        img.onload=function(){
            onload('load',this);

            this.onerror = null;
            this.onload = null;
        }
        img.onerror=function(){
            onload('error',this.path);

            this.onerror = null;
            this.onload = null;
        }
        img.src = baseUrl + url;
        if(img.complete){
            onload('load',img);

            img.onerror = null;
            img.onload = null;
        }
    },
    __loadSound:function(baseUrl,url,onload){
        var loader = this;
        var urls = url instanceof Array?url:[url];
        for(var i=urls.length;i--;){
            urls[i] = baseUrl + urls[i];
        }
        new Howl({
            src: urls,
            onload:function(){
                var sound = new soya2d.Sound();
                sound.__handler = this;

                onload('load',sound);
            },
            onloaderror:function(error){
                var errorType = soya2d.MEDIA_ERR_DECODE;
                if(error){
                    errorType = error.type;
                }
                onload('error',this._src,errorType);
            }
        });
    },
    __loadFont:function(baseUrl,family,url,onload){
        var originFamily = ['serif','sans-serif'];
        var originCSS = "border:none;position:absolute;top:-999px;left:-999px;" +
                        "font-size:100px;width:auto;height:auto;line-height:normal;margin:0;" +
                        "padding:0;font-variant:normal;white-space:nowrap;font-family:";
        var originWidth = {};
        var originHeight = {};
        var originSpan = {};
        for(var i=originFamily.length;i--;){
            var span = document.createElement('div');
            span.style.cssText = originCSS+"'"+originFamily[i]+"'";
            span.innerHTML = family;
            document.body.appendChild(span);
            originSpan[originFamily[i]] = span;
            //获取原始size
            originWidth[originFamily[i]] = span.offsetWidth;
            originHeight[originFamily[i]] = span.offsetHeight;
        }
        //开始加载样式
        var style = document.createElement('style');
        style.id = 'FontLoader_'+new Date().getTime();
        style.innerHTML =  "@font-face {" +
                        "font-family: '" + family + "';" +
                        "src: url(" + baseUrl+url + ")" +
                        "}";
        document.head.appendChild(style);
        for(var i in originSpan){
            originSpan[i].style.fontFamily = family+','+originSpan[i].style.fontFamily;
        }
        //监控器启动扫描
        var startTime = new Date().getTime();
        var that = this;
        setTimeout(function(){
            scanFont(startTime,that.timeout,originSpan,originWidth,originHeight,function(family){
                onload('timeout',family);
            },function(family){
                onload('load',family);
            },family);
        },100);//100ms用于浏览器识别非法字体，然后还原并使用次等匹配字体
    },
    __loadAtlas:function(baseUrl,key,data,onload){
        var loader = this;
        this.__loadImage(baseUrl,data[0],function(type,img){
            if(type === 'load'){
                if(typeof(data[1]) === 'string' && data.length===2)
                    loader.__getXhr(baseUrl,data[1],function(type,xhr){
                        var atlas = xhr;
                        if(type === 'load'){
                            var json;
                            try{
                                json = new Function('return '+xhr.responseText)();
                            }catch(e){
                                json = e;
                            }
                            //创建图像集
                            atlas = new soya2d.Atlas(img,json);
                        }
                        
                        onload(type,atlas);
                    });
                else{
                    var json = data[1];
                    if(data.length > 2){
                        json = [];
                        var imgW = img.width;
                        var imgH = img.height;
                        var w = data[1];
                        var h = data[2];
                        var index = 1;
                        for(var j=h;j<=imgH;j+=h){
                            for(var i=w;i<=imgW;i+=w){
                                json.push({
                                    n:key+'_'+index,
                                    x:i-w,y:j-h,
                                    w:w,h:h});
                                index++;
                            }
                        }
                    }
                    var atlas = new soya2d.Atlas(img,json);
                    onload(type,atlas);
                }
            }else{
                onload(type,img);
            }
        });
    },
    __getXhr:function(baseUrl,url,onload){
        var loader = this;
        xhrLoad(baseUrl+url,this.timeout,function(){
            onload('timeout',url);
        },function(){
            onload('error',url);
        },function(xhr){
            onload('load',xhr);
        });
    },
    __loadAssets:function(){
        var loader = this;
        this.__assetsQueue.forEach(function(asset){
            switch(asset.type){
                case 'image':
                    loader.__loadImage(asset.baseUrl,asset.data,function(type,img){
                        if(type==='load')
                            loader.__assets.image[asset.k] = img;
                        loader.__onLoad(type,img);
                    });
                    break;
                case 'sound':
                    if(!soya2d.Sound){
                        soya2d.console.warn("can't load sounds, module [sound] needs to be loaded");
                        return;
                    }
                    loader.__loadSound(asset.baseUrl,asset.data,function(type,sound){
                        if(type==='load')
                            loader.__assets.sound[asset.k] = sound;
                        loader.__onLoad(type,sound,arguments[2]);
                    });
                    break;
                case 'atlas':
                    loader.__loadAtlas(asset.baseUrl,asset.k,asset.data,function(type,atlas){
                        if(type==='load')
                            loader.__assets.atlas[asset.k] = atlas;
                        loader.__onLoad(type,atlas);
                    });
                    break;
                case 'font':
                    loader.__loadFont(asset.baseUrl,asset.k,asset.data,function(type,family){
                        var font = family;
                        if(type==='load'){
                            font = new soya2d.Font().family(family);
                            loader.__assets.imageFont[asset.k] = font;
                        }
                        loader.__onLoad(type,font);
                    });
                    break;
                case 'imageFont':
                    loader.__loadAtlas(asset.baseUrl,asset.k,asset.data,function(type,atlas){
                        var font = atlas;
                        if(type==='load'){
                            font = new soya2d.ImageFont(atlas);
                            loader.__assets.imageFont[asset.k] = font;
                        }
                        loader.__onLoad(type,font);
                    });
                    break;
                case 'text':
                    loader.__getXhr(asset.baseUrl,asset.data,function(type,xhr){
                        var text = xhr;
                        if(type==='load'){
                            loader.__assets.text[asset.k] = xhr.responseText;
                            text = xhr.responseText
                        }
                        loader.__onLoad(type,text);
                    });
                    break;
                case 'xml':
                    loader.__getXhr(asset.baseUrl,asset.data,function(type,xhr){
                        var doc = xhr;
                        if(type==='load'){
                            doc = loader.__assets.xml[asset.k] = xhr.responseXML;
                        }
                        loader.__onLoad(type,doc);
                    });
                    break;
                case 'json':
                    loader.__getXhr(asset.baseUrl,asset.data,function(type,xhr){
                        var json = xhr;
                        if(type==='load'){
                            try{
                                json = new Function('return '+xhr.responseText)();
                            }catch(e){
                                json = e;
                            }
                            loader.__assets.json[asset.k] = json;
                        }
                        loader.__onLoad(type,json);
                    });
                    break;
            }
        });
    },
    __onLoad:function(type,rs){
        this.__tip.setText('Loading... '+ (++this.__index) +'/'+this.__assetsQueue.length);
        if(type === 'load'){
            this.emit(type,rs,this.__index,this.__assetsQueue.length);
        }else{
            this.emit(type,rs,arguments[2]);   
        }
        if(this.__index == this.__assetsQueue.length){
            this.__assetsQueue = [];
            this.emit('end');
            this.__logo.parent.remove(this.__logo);
            this.__logo.opacity = 0;
        }
    },
    /**
     * 启动加载器。在preload中，引擎会自动调用
     * @method start 
     */
    start:function(){
        this.__index = 0;
        if(this.show){
            if(!this.__logo.parent){
                this.game.world.add(this.__logo);
            }
            this.__logo.opacity = 1;
        }

        this.__loadAssets();
    }
});
function xhrLoad(url,timeout,ontimeout,onerror,onload){
    var xhr = new XMLHttpRequest();
    xhr.open('get',url,true);
    xhr.timeout = timeout;
    xhr.ontimeout = ontimeout;
    xhr.onerror = onerror;
    if(xhr.onload === null){
        xhr.onload = function(){
            if(xhr.status===0 || //native
                (xhr.status >= 200 && xhr.status <300) || xhr.status === 304){
                onload(xhr);
            }
        }
    }else{
        xhr.onreadystatechange = function () {
            if(xhr.status===0 || //native
                ((xhr.status >= 200 && xhr.status <300) || xhr.status === 304) && xhr.readyState === 4){
                onload(xhr);
            }
        };
    }
    xhr.send(null);
}
function scanFont(startTime,timeout,originSpan,originWidth,originHeight,onTimeout,onLoad,family){
    setTimeout(function(){
        if(new Date().getTime() - startTime > timeout){
            onTimeout(family);
            return;
        }
        //检查originSpan的宽度是否发生了变化
        for(var i in originSpan){
            originSpan[i].style.left = '-1000px';
            var w = originSpan[i].offsetWidth;
            var h = originSpan[i].offsetHeight;
            if(w !== originWidth[i] || h !== originHeight[i]){//发生了改变
                //document.body.removeChild(originSpan[i]);
                
                    onLoad(family);
                
                return;
            }
        }
        //没有改变，继续扫描
        scanFont(startTime,timeout,originSpan,originWidth,originHeight,onTimeout,onLoad,family);
    },20);
}

/**
 * 媒体加载错误类型——MEDIA_ERR_UNCERTAIN<br/>
 * 未知错误
 * @property MEDIA_ERR_UNCERTAIN
 * @final
 */
soya2d.MEDIA_ERR_UNCERTAIN = -1;
/**
 * 媒体加载错误类型——MEDIA_ERR_ABORTED<br/>
 * 加载被中断
 * @property MEDIA_ERR_ABORTED
 * @final
 */
soya2d.MEDIA_ERR_ABORTED = 1;
/**
 * 媒体加载错误类型——MEDIA_ERR_NETWORK<br/>
 * 网络异常
 * @property MEDIA_ERR_NETWORK
 * @final
 */
soya2d.MEDIA_ERR_NETWORK = 2;
/**
 * 媒体加载错误类型——MEDIA_ERR_DECODE<br/>
 * 无法解码
 * @property MEDIA_ERR_DECODE
 * @final
 */
soya2d.MEDIA_ERR_DECODE = 3;
/**
 * 媒体加载错误类型——MEDIA_ERR_SRC_NOT_SUPPORTED<br/>
 * 类型不支持
 * @property MEDIA_ERR_SRC_NOT_SUPPORTED
 * @final
 */
soya2d.MEDIA_ERR_SRC_NOT_SUPPORTED = 4;
/**
 * 媒体加载错误类型——MEDIA_ERR_SRC_NOT_FORTHCOMING<br/>
 * 无法获取资源数据
 * @property MEDIA_ERR_SRC_NOT_FORTHCOMING
 * @final
 */
soya2d.MEDIA_ERR_SRC_NOT_FORTHCOMING = 101;
/**
 *  场景用来管理通过XML构建的UI
 *  @class Scene
 */
function Scene(data,game) {
    soya2d.ext(this,data);

    this.map = {};
    this.game = game;
}

Scene.prototype = {
    /**
     * 通过XML文档设置UI
     * @method setView
     * @param {XMLDocument} doc xml文档对象
     */
    setView:function(doc){
        var world = doc.children[0];
        build(this,world,this.game.world,this.game);
    },
    /**
     * 通过id属性查找显示对象
     * @method findview
     * @param  {String} id xml中节点的id属性
     * @return {soya2d.DisplayObject}
     */
    findView:function(id){
        return this.map[id];
    }
}


/**
 * 预加载事件，该事件中可以进行资源加载操作。资源加载完成后，会自动调用onInit回调
 * @event onPreload
 * @param {soya2d.Game} game 场景所属game
 */
/**
 * 初始化事件，在onPreload后调用
 * @event onInit
 * @param {soya2d.Game} game 场景所属game
 */
/**
 * 更新事件，每帧调用
 * @event onUpdate
 * @param {soya2d.Game} game 场景所属game
 * @param {Number} d 上一次调用的间隔
 */

function build(scene,node,parent,game){
    for(var i=0;i<node.children.length;i++){
        var n = node.children[i];
        var type = n.tagName;
        var id = n.attributes['id'] ? n.attributes['id'].value : null;
        var data = parseData(n.attributes,parent);
        var atlas = data['atlas'];
        if(type === 'sprite' && atlas){
            var prefix = data['atlas-prefix'];
            data.images = game.assets.atlas(atlas).getAll(prefix);
        }
        if(type === 'text'){
            var atlas = data['atlas'];
            var txt = '';
            for(var k=0;k<n.childNodes.length;k++){
                if(n.childNodes[k].nodeType === 3){
                    txt += n.childNodes[k].nodeValue;
                }
            }
            data.text = txt.replace(/(^\s+)|(\s+$)/mg,'');
            if(atlas)
            data.font = game.assets.atlas(atlas);
            data.size = parseInt(data['size']);
        }
        var ins = newInstance(type,data,game);

        bindEvent(n.attributes,ins,scene);
        if(id){
            scene.map[id] = ins;
        }
        parent.add(ins);

        if(n.children.length>0){
            build(scene,n,ins,game);
        }
    }
}

function parseData(attrs,parent){
    var rs = {};
    var ks = Object.keys(attrs);
    for(var i=ks.length;i--;){
        var k = ks[i];
        var kName = attrs[k].name;
        if(kName.indexOf('layout-')===0){
            if(!rs['layout'])rs['layout'] = {};
            
            rs['layout'][kName.split('-')[1]] = filter(kName,attrs[k].value,parent);
        }else{
            rs[kName] = filter(kName,attrs[k].value,parent);
        }
    }
    return rs;
}

function bindEvent(attrs,ins,scene){
    var ks = Object.keys(attrs);
    for(var i=ks.length;i--;){
        var k = ks[i];
        var kName = attrs[k].name;
        var val = attrs[k].value;
        if(kName.indexOf('on-') !== 0)continue;
        var evType = kName.substr(3);
        var evFn = scene[val];
        if(evFn instanceof Function){
            ins.on(evType,evFn);
        }else{
            soya2d.console.warn('invalid callback "'+val+'" of '+kName);
        }
    }
}

function filter(type,val,parent){
    switch(type){
        case 'x':case 'w':
        case 'y':case 'h':
        case 'z':case 'angle':case 'scaleX':
        case 'scaleY':case 'skewX':case 'skewY':
        case 'scrollAngle':case 'speed':case 'frameRate':
        case 'frameIndex':
        case 'letterSpacing':case 'lineSpacing':
            return parseFloat(val);
        case 'visible':case 'autoScroll':
        case 'loop':case 'autoplay':case 'fixedToCamera':
            return new Function('return '+val)();
        default:
            return val;
    }
}

function newInstance(type,data,game){
    var instance = new game.objects.map[type](data);
    return instance;
}

/**
 *  场景管理器，提供场景注册和切换等。每个game实例都有且只有一个场景管理器game.scene。
 *  <br/>该类不能被实例化
 *  @class SceneManager
 */
function SceneManager(game) {
    this.map = {};
    this.game = game;
}

SceneManager.prototype = {
    /**
     * 启动场景
     * @method start
     * @param  {String | Object} scene   场景对象，或者注册名称。
     * @param  {Boolean} clearWorld 是否清空world
     */
    start:function(scene,clearWorld){
        var that = this;
        var game = this.game;

        if(typeof(scene) === 'string'){
            scene = this.map[scene];
        }else{
            scene = new Scene(scene,game);
        }
        
        game.currentScene = scene;
        if(clearWorld){
            //clear world
            game.world.clear(true);
            game.world.off();
            game.camera.reset();
        }
        if(scene.onPreload){
            scene.onPreload(game);
            
            game.load.once('end',function(){
                //初始化场景
                if(game.currentScene.onInit){
                    setTimeout(function(){
                        game.currentScene.onInit(game);
                    },0)
                    
                }
            });
            game.load.start();
        }else 
        //初始化场景
        if(scene.onInit){
            scene.onInit(game);
        }

        var modules = soya2d.module._getAll();
        for(var k in modules){
            if(modules[k].onSceneChange)modules[k].onSceneChange(that,scene);
        }

        return this;
    },
    /**
     * 添加一个场景，系统自动把描述对象转换成{{#crossLink "Scene"}}{{/crossLink}}实例
     * @method add
     * @param {String} key 
     * @param {Object} scene 带有回调函数的对象，注意并不是{{#crossLink "Scene"}}{{/crossLink}}实例
     */
    add:function(key,scene){
        this.map[key] = new Scene(scene,game);
        return this.map[key];
    }
}
/**
 * 构造一个用于任务调度的触发器。
 * 触发器是调度器进行任务调度时，触发任务的依据。根据触发器提供的表达式，进行触发。一个触发器只能绑定一个任务。
 * @class TimerTrigger
 * @private
 * @param {string} exp 触发器表达式，根据触发类型而定
 */
function TimerTrigger(exp){
    /**
     * 触发表达式
     * @type {String}
     */
    this.exp = exp;
    /**
     * 触发次数
     * @type {Number}
     */
    this.times = 0;
    /**
     * 优先级
     * @type {Number}
     */
    this.priority = 0;
    /**
     * 从调度开始，到最近一次触发的毫秒数
     * @type {Number}
     */
    this.milliseconds = 0;
    //上次触发毫秒数，相差不足1000，就不触发
    this._lastTriggerMilliseconds = -1000;
    //时间模式下，当前时间s,m,h
    this._t = [];
    //重置触发器
    this._reset = function(){
        this.times = 0;
        this.milliseconds = 0;
        this._lastTriggerMilliseconds = -1000;
        this._t = [];
        delete this._frameInfo;
        delete this._timeInfo;
    }

    //是否可以卸载
    this._canUnload = function(){
        var h = this._timeInfo.hour;
        if(h[2] === 1){//单次
            if(this._t[2]>h[0])return true;
        }else if(h[2] > 1){//多次
            if(this._t[2]>h[3][h[3].length-1])return true;
        }
    }
    /**
     * 是否可以触发
     */
    this.canTrigger = function(){
        return checkTimeTriggerable(this);
    }

    /************ build trigger ************/
    if(!/^(\*|(?:[0-9]+(?:,[0-9]+)*)|(?:[0-9]+-[0-9]+)|(?:(?:(?:[0-9]+(?:-[0-9]+)?)|\*)\/[0-9]+)) (\*|(?:[0-9]+(?:,[0-9]+)*)|(?:[0-9]+-[0-9]+)|(?:(?:(?:[0-9]+(?:-[0-9]+)?)|\*)\/[0-9]+)) (\*|(?:[0-9]+(?:,[0-9]+)*)|(?:[0-9]+-[0-9]+)|(?:(?:(?:[0-9]+(?:-[0-9]+)?)|\*)\/[0-9]+))$/.test(exp)){
        soya2d.console.error('invalid timer expression -- '+exp);
    }
    //解析时间信息
    var secInfo = parseExp(RegExp.$1);
    var minInfo = parseExp(RegExp.$2);
    var hourInfo = parseExp(RegExp.$3);
    this._timeInfo = {
        sec:secInfo,
        min:minInfo,
        hour:hourInfo
    }
    
}
//触发器调用，解析表达式,并返回
// [
// interval,//间隔模式的间隔时长,以及单值模式的值
// startOff,//间隔模式的启动偏移
// triggerTimes,//总触发次数,-1为无限
// values //多值模式，或者区间模式下存储所有合法值
// ]
function parseExp(exp){
    var i,so,tt,values;
    var tmp;
    if(exp == '*'){
        i = -1;//无间隔
        so = 0;
        tt = -1;
    }else if((so = parseInt(exp)) == exp){//匹配整数
        tt = 1;
        i = 0;
    }else if((tmp=exp.split('/')).length===2){//匹配间隔符&区间间隔
        i = parseInt(tmp[1]);
        var tmp2;
        if((tmp2=tmp[0].split('-')).length===2){//存在区间
            values = [];
            for(var s=tmp2[0]>>0,e=tmp2[1]>>0;s<=e;s++){
                values.push(s);
            }
            values.sort(function(a,b){
                return a-b;
            });
            tt = values.length;
        }else{
            if(!(so = parseInt(tmp[0]))){
                so = 0;
            }
            tt = -1;
        }
    }else if((tmp=exp.split(',')).length>1){//匹配多值符
        values = [];
        for(var i=tmp.length;i--;){
            values.push(tmp[i]>>0);
        }
        values.sort(function(a,b){
            return a-b;
        });
        tt = tmp.length;
    }else if((tmp=exp.split('-')).length===2){//匹配区间符
        values = [];
        for(var s=tmp[0]>>0,e=tmp[1]>>0;s<=e;s++){
            values.push(s);
        }
        values.sort(function(a,b){
            return a-b;
        });
        tt = values.length;
    }
    return [i,so,tt,values];
}
//检测时间触发器是否可以触发
function checkTimeTriggerable(trigger){
    //换算时间
    var tmp = trigger.milliseconds/1000;
    var s = trigger._t[0] = tmp%60>>0;
    var m = trigger._t[1] = tmp/60%60>>0;
    var h = trigger._t[2] = tmp/60/60>>0;
    /////////////////// 计算每个段 ///////////////////
    if(!checkTimePart(trigger._timeInfo.hour,h))return false;
    if(!checkTimePart(trigger._timeInfo.min,m))return false;
    if(!checkTimePart(trigger._timeInfo.sec,s))return false;
    return true;
}
//检测时间每个部分是否OK
function checkTimePart(part,v){
    if(part[2]===1){//只触发一次,计算值是否相同
        if(part[1]!==v)return false;
    }else if(part[2]===-1 && part[0]===-1){//无限
    }else if(part[3] && !part[0]){//多值
        if(part[3].indexOf(v)<0)return false;
    }else if((part[2]===-1 && part[0]>0) ||
            (part[0]>0 && part[3])){//间隔
        if(part[3] && part[3].indexOf(v)<0)return false;//间隔内的区间
        var actValue = v-part[1];
        if(actValue <= 0 && part[1]!=0)return false;//防止0除数触发
        if(actValue % part[0])return false;
    }
    return true;
}
/**
 * 定时器。基于[秒 分 时]进行调度,支持η表达式，可以创建复杂的定时任务。
 * η表达式基于和主循环同步的时间机制，误差在1个FPS之内。
 * 语法：
 * <table>
 *     <tr>
 *         <th>type</th><th>range</th><th>sym</th><th>desc</th>
 *     </tr>
      <tr>
          <td>Sec</td><td>0-59</td><td>* / , -</td>
          <td>
                ** 每秒触发<br>
                10 第10秒触发<br>
                20-40 第20到40秒触发<br>
                0-50/5 第0到50秒，每5秒触发<br>
                0/1 每秒触发<br>
                *\/15 每15秒触发<br>
                5,25,50 第5/25/50秒触发<br>
          </td>
      </tr>
      <tr>
          <td>Min</td><td>0-59</td><td>* / , -</td>
          <td>
              同上
          </td>
      </tr>
      <tr>
          <td>Hou</td><td>0-n</td><td>* / , -</td>
          <td>
              同上
          </td>
      </tr>
 * </table>
 
 * <p>例子</p>

| exp        | desc|
| :------------- |:-------------|
| * 2 *      | 每小时第2分钟到3分钟，每秒触发 |
| 45 * 2     | 第2个小时每分钟第45秒触发 |
| 45 * *     | 每分钟第45秒触发 |
| 0 2 *      | 每小时第2分钟触发 |
| 0 0 *      | 每小时触发一次 |
| 0/5 4 *      | 每小时第4分钟，从0秒开始，每隔5秒触发 |
| 5/15 4,14,28 *      | 每小时第4/14/28分钟，第5秒开始，每15秒触发 |
| 5-10 * *      | 每分钟第5到10秒触发 |

 * 
 * @class Timer
 * @extends Signal
 * @constructor
 */
var Timer = soya2d.class('',{
    extends:Signal,
    constructor:function(){
        this.__signalHandler = new SignalHandler();
        this.triggerList = [];
        this.expMap = {};
        this.threshold = 1000;
    },
    /**
     * 添加一个定时器
     * @method on
     * @param  {String} exp  表达式，必须用中括号包裹 [* * *]
     * @param  {Function} cbk  回调函数，回调参数[milliseconds,times,[s,m,h]]
     * @param  {Number} order 序号
     * @return this
     */
    on:function(exp,cbk,order){
        var that = this;
        exp = exp.replace(/\[(.*?)\]/mg,function(all,ex){
            if(!that.expMap[ex]){
                var t = new TimerTrigger(ex);
                that.triggerList.push(t);
                that.expMap[ex] = t;
            }
            return ex.replace(/\s+/mg,'_');
        });
        
        return this._super.on.call(this,exp,cbk,order);
    },
    /**
     * 添加一个定时器，只执行一次
     * @method once
     * @param  {String} exp  表达式，必须用中括号包裹 [* * *]
     * @param  {Function} cbk  回调函数，回调参数[milliseconds,times,[s,m,h]]
     * @param  {Number} order 序号
     * @return this
     */
    once:function(exp,cbk,order){
        var that = this;
        exp = exp.replace(/\[(.*?)\]/mg,function(all,ex){
            if(!that.expMap[ex]){
                var t = new TimerTrigger(ex);
                that.triggerList.push(t);
                that.expMap[ex] = t;
            }
            return ex.replace(/\s+/mg,'_');
        });
        return this._super.once.call(this,exp,cbk,order);
    },
    /**
     * 取消一个定时器
     * @method off
     * @param  {String} exp  表达式，必须用中括号包裹 [* * *]
     * @param  {Function} cbk  回调函数
     */
    off:function(exp,cbk){
        var exArray = [];
        exp = exp.replace(/\[(.*?)\]/mg,function(all,ex){
            exArray.push(ex);
            return ex.replace(/\s+/mg,'_');
        });
        this._super.off.call(this,exp,cbk);
        exArray.forEach(function(ex){
            var cbks = this.__signalHandler.map[ex.replace(/\s+/mg,'_')];
            if(Object.keys(cbks).length<1){
                this.expMap[ex] = null;
                this.__removeTrigger(ex);
            }
        },this);
    },
    //内部调用，检查所有触发器是否有可以触发的
    __scan : function(d){
        //扫描所有触发器
        var deleteTriggerList = [];
        var deleteExp = [];
        for(var i=this.triggerList.length;i--;){
            var trigger = this.triggerList[i];
            var tasks = this.__signalHandler.map[trigger.exp.replace(/\s+/mg,'_')];
            var canTrigger = false;
            trigger.milliseconds += d;//毫秒数增加
            var delta = trigger.milliseconds - trigger._lastTriggerMilliseconds;
            //是否可触发
            if(trigger.canTrigger() && delta>=this.threshold){
                canTrigger = true;
                //重置触发时间
                trigger._lastTriggerMilliseconds = trigger.milliseconds;
            }
            if(trigger._canUnload())deleteTriggerList.push(trigger.exp);

            if(canTrigger){
                trigger.times++;//触发次数加1
                tasks.forEach(function(task,ti){
                    if(task[3]){
                        deleteExp.push([trigger.exp,task[0]]);
                    }
                    task[0].call(this,trigger.milliseconds,trigger.times,trigger._t);
                },this);
            }
        }
        //删除可以卸载的任务
        for(var i=deleteTriggerList.length;i--;){
            this.__removeTrigger(deleteTriggerList[i]);
        }

        for(var i=deleteExp.length;i--;){
            this.off(deleteExp[i][0],deleteExp[i][1]);
        }
    },
    __removeTrigger:function(exp){
        for(var i=this.triggerList.length;i--;){
            var trigger = this.triggerList[i];
            if(trigger.exp === exp){
                break;
            }
        }
        this.triggerList.splice(i,1);
    }
});

/**
 * 几何结构，圆形。用于保存圆形结构数据，可以设置为{{#crossLink "soya2d.DisplayObject"}}的bounds，
 * 用于检测碰撞
 * @class soya2d.Circle
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 *
 * @module geom
 */
soya2d.Circle  = function(x,y,r){
	this.x = x || 0;
    this.y = y || 0;
    this.r = r || 0;
};
soya2d.Circle.prototype = {
    /**
     * @method toString
     * @return {String}
     */
    toString:function(){
        return "{x:"+this.x+",y:"+this.y+",r:"+this.r+"}";
    },
    /**
     * @method clone
     * @return {soya2d.Circle} 
     */
    clone:function(){
        return new soya2d.Circle(this.x,this.y,this.r);
    },
    /**
     * 是否和另一个几何图形相交
     * @method intersectWidth
     * @param  {soya2d.Circle | soya2d.Rectangle} geom 几何图形
     * @return {Boolean}
     */
    intersectWith:function(geom){
        if(geom instanceof soya2d.Circle && geom.r>0){
            if(soya2d.Math.len2Df(geom.x - this.x,geom.y - this.y) <= this.r+geom.r)return false;
        }else if(geom instanceof soya2d.Rectangle && geom.w>0 && geom.h>0){
        	var w2 = geom.w/2,
        		h2 = geom.h/2;
        	var cx = this.x - (geom.x + w2);
        	var cy = this.y - (geom.y + h2);

        	if(cx > w2+this.r || cy > h2+this.r)return false;

        	var dx = Math.min(cx,w2);
        	var dx1 = Math.max(dx,-w2);
        	var dy = Math.min(cy,h2);
        	var dy1 = Math.max(dy,-h2);

        	return (dx1 - cx) * (dx1 - cx) + (dy1 - cy) * (dy1 - cy)  <= this.r*this.r;
        }

        return true;
    }
};

/**
 * 几何结构，多边形。
 * @class soya2d.Polygon
 * @constructor
 * @param {Array} vtx 1维顶点数组
 */
soya2d.Polygon  = function(vtx){
	this.vtx = vtx;
};
soya2d.Polygon.prototype = {
	/**
     * @method toString
     * @return {String} 
     */
    toString:function(){
        return this.vtx;
    },
    /**
     * @method clone
     * @return {soya2d.Polygon} 
     */
    clone:function(){
        return new soya2d.Polygon(this.vtx.concat());
    }
};

/**
 * 几何结构，矩形。用于保存矩形结构数据
 * @class soya2d.Rectangle
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
soya2d.Rectangle = function(x,y,w,h){
	this.x = x || 0;
    this.y = y || 0;
    this.w = w || 0;
    this.h = h || 0;
};
soya2d.Rectangle.prototype = {
    /**
     * @method toString
     * @return {String} 
     */
    toString:function(){
        return "{x:"+this.x+",y:"+this.y+",w:"+this.w+",h:"+this.h+"}";
    },
    /**
     * @method clone
     * @return {soya2d.Rectangle} 
     */
    clone:function(){
        return new soya2d.Rectangle(this.x,this.y,this.w,this.h);
    },
    /**
     * 获取矩形右侧坐标
     * @method getRight
     * @return {Number} 
     */
    getRight:function(){
        return this.x + this.w;
    },
    /**
     * 获取矩形下侧坐标
     * @method getBottom
     * @return {Number} 
     */
    getBottom:function(){
        return this.y + this.h;
    },
    /**
     * 是否包含指定坐标点
     * @method contains
     * @param  {Number} x 
     * @param  {Number} y 
     * @return {Boolean}
     */
    contains:function(x,y){
        if(x < this.x || x > this.x+this.w)return false;
        if(y < this.y || y > this.y+this.h)return false;
        return true;
    },
    /**
     * 是否和另一个几何图形相交
     * @method intersectWidth
     * @param  {soya2d.Circle | soya2d.Rectangle} geom 几何图形
     * @return {Boolean}
     */
    intersectWith:function(geom){
        if(geom instanceof soya2d.Rectangle && geom.w>0 && geom.h>0){
            if(this.x > geom.x+geom.w || this.y > geom.y+geom.h)return false;
            if(this.x+this.w < geom.x || this.y+this.h < geom.y)return false;
        }else if(geom instanceof soya2d.Circle && geom.r>0){
            return geom.intersectWith(this);
        }

        return true;
    }
};

/**
 * 几何结构，点
 * @class soya2d.Point
 * @constructor
 * @param {Number} x
 * @param {Number} y
 */
soya2d.Point = function(x,y){
	this.x = x || 0;
    this.y = y || 0;
};
soya2d.Point.prototype = {
    /**
     * @method toString
     * @return {String} 
     */
    toString:function(){
        return "{x:"+this.x+",y:"+this.y+"}";
    },
    /**
     * @method clone
     * @return {soya2d.Point} 
     */
    clone:function(){
        return new soya2d.Point(this.x,this.y);
    },
    /**
     * 设置值
     * @param {Number} x 
     * @param {Number} y 
     */
    set:function(x,y){
        this.x = x;
        this.y = y;
        return this;
    }
};

/**
 * 创建一个2*2单位矩阵，该矩阵用来描述2D变换信息。
 * 每个显示对象都有一个该矩阵实例用来执行变换操作
 * @class soya2d.Matrix2x2
 * @constructor
 * @module geom
 */
soya2d.Matrix2x2 = function(){
    /**
     * 矩阵结构数组
     * @property e
     * @type {Float32Array}
     * @default [1,0,0,1]
     */
    this.e = new Float32Array(4);
    this.identity();
};

soya2d.Matrix2x2.prototype = {
	/**
	 * @method toString
	 * @return {String} 
	 */
	toString:function(){
		return "["+this.e[0]+","+this.e[1]+","+this.e[2]+","+this.e[3]+"]";
	},
    /**
     * 设置矩阵数据
     * @method set
     * @param m11
     * @param m12
     * @param m21
     * @param m22
     * @return {soya2d.Matrix2x2} this
     */
	set:function(m11,m12,m21,m22){
		var e = this.e;
		e[0] = m11==0?0:m11||1;e[1] = m12||0;
		e[2] = m21||0;e[3] = m22==0?0:m22||1;
		return this;
	},
    /**
     * 克隆当前矩阵
     * @method clone
     * @return {soya2d.Matrix2x2} a new matrix
     */
	clone:function(){
		return new soya2d.Matrix2x2().set(this.e[0],this.e[1],this.e[2],this.e[3]);
	},
    /**
     * 重置矩阵为单位矩阵
     * @method identity
     * @return {soya2d.Matrix2x2} this
     */
	identity:function(){
		this.set(
			1,0,
			0,1);
		return this;
	},
    /**
     * 当前矩阵左乘m
     * @method mul
     * @param {soya2d.Matrix2x2} m
     * @return {soya2d.Matrix2x2} this
     */
	mul:function(m){
		var m11=this.e[0],m12=this.e[1],
            m21=this.e[2],m22=this.e[3];
		var me = m.e;
        this.e[0] = me[0]*m11 + me[2]*m12;this.e[1] = me[1]*m11 + me[3]*m12;
        this.e[2] = me[0]*m21 + me[2]*m22;this.e[3] = me[1]*m21 + me[3]*m22;
        return this;
	},
    /**
     * 缩放当前矩阵
     * @method scale
     * @param {Number} x
     * @param {Number} y
     * @return {soya2d.Matrix2x2} this
     */
	scale:function(x,y){
        this.e[0] *= x;this.e[1] *= y;
        this.e[2] *= x;this.e[3] *= y;
		return this;
	},
    /**
     * 旋转当前矩阵
     * @method rotate
     * @param {Number} angle 旋转角度0-360
     * @return {soya2d.Matrix2x2} this
     */
	rotate:function(angle){
		if(!angle)return this;
		var m = soya2d.Math;
		angle = angle<0?360+(angle%360):angle;
		if(angle>360){
			angle = angle%360;
		}
		var m11=this.e[0],m12=this.e[1],
			m21=this.e[2],m22=this.e[3];
		var s = m.SINTABLE[angle];
		var c = m.COSTABLE[angle];
		//处理非缓存角度
		if(s===undefined){
			s = Math.sin(angle*m.ONERAD);
			c = Math.cos(angle*m.ONERAD);
		}
		
		this.e[0] = m11*c+m12*-s;this.e[1] = m11*s+m12*c;
		this.e[2] = m21*c+m22*-s;this.e[3] = m21*s+m22*c;
		return this;
	},
    /**
     * 倾斜当前矩阵
     * @method skew
     * @param {Number} x 水平倾角
     * @param {Number} y 垂直倾角
     * @return {soya2d.Matrix2x2} this
     */
	skew:function(x,y){
		var m11=this.e[0],m12=this.e[1],
			m21=this.e[2],m22=this.e[3];
		if(x){
			var sx;
			if(this.skewX === x && this.sx){
				sx = this.sx;
			}else{
				sx = Math.tan(x*0.017453292);
				this.sx = sx;
			}
			this.e[0] += m12*sx;
			this.e[2] += m22*sx;
		}
		if(y){
			var sy;
			if(this.skewY === x && this.sy){
				sy = this.sy;
			}else{
				sy = Math.tan(y*0.017453292);
				this.sy = sy;
			}
			this.e[1] += m11*sy;
			this.e[3] += m21*sy;
		}
		
		return this;
	}
};

/**
 * 2D向量。提供向量相关计算。<br/>参数为0时，将构造一个0向量
 * @class soya2d.Vector
 * @constructor
 * @param {Number} x
 * @param {Number} y
 */
soya2d.Vector = function(x,y){
    /**
     * 向量结构数组
     * @property e
     * @type {Float32Array}
     * @default [0,0]
     */
    this.e = new Float32Array(2);
    this.e[0] = x||0;
    this.e[1] = y||0;
};

soya2d.Vector.prototype = {
	/**
     * @method toString
     * @return {String} 
     */
	toString:function(){
		return "{x:"+this.e[0]+",y:"+this.e[1]+"}";
	},
	/**
	 * 使用当前向量参数，复制一个新的2D向量
	 * @method clone
	 * @return {soya2d.Vector} 和当前向量值相同的新向量
	 */
	clone:function(){
		return new soya2d.Vector(this.e[0],this.e[1]);
	},
	/**
	 * 设置向量值
	 * @method set
	 * @param {Number} x x轴分量值
	 * @param {Number} y y轴分量值
	 * @return {soya2d.Vector} this
	 */
	set:function(x,y){
		this.e[0] = x || 0;
		this.e[1] = y || 0;
		
		return this;
	},
	/**
	 * 计算和指定向量的点积
	 * @method dot
	 * @param {soya2d.Vector} v 指定向量
	 * @return {Number} 点积值
	 */
	dot: function ( v ) {
		return this.e[0] * v.e[0] + this.e[1] * v.e[1];
	},
	/**
	 * 当前向量取反
	 * @method negate
	 */
	negate:function(){
		this.e[0] *= -1;
		this.e[1] *= -1;
		return this;
	},
	/**
	 * 和增加指定向量相加
	 * @method add
	 * @param {soya2d.Vector} v 指定向量
	 */
	add:function(v){
		 this.e[0] += v.e[0];
		 this.e[1] += v.e[1];
		 return this;
	},
	/**
	 * 和增加指定向量相减
	 * @method sub
	 * @param {soya2d.Vector} v 指定向量
	 */
	sub:function(v){
		this.e[0] -= v.e[0];
	 	this.e[1] -= v.e[1];
	 	return this;
	},
	/**
	 * 当前向量乘以指定实数
	 * @method mul
	 * @param {Number} s 实数
	 */
	mul:function(s){
		this.e[0] *= s;
		this.e[1] *= s;
		return this;
	},
	/**
	 * 当前向量除以指定实数
	 * @method div
	 * @param {Number} s 实数
	 */
	div:function(s){
		if(s) {
			this.e[0] /= s;
			this.e[1] /= s;
		} else {
			this.e[0] = 0;
			this.e[1] = 0;
		}
		return this;
	},
	/**
	 * 获得当前向量夹角
	 * @method getAngle
	 * @return {Number} 夹角值
	 */
	getAngle:function(){
	    return Math.atan2(this.e[1], this.e[0]);
	},
	/**
	 * 获得和指定向量夹角
	 * @method getAngleBetween
	 * @param {soya2d.Vector} v 指定向量
	 * @return {Number} 夹角值
	 */
	getAngleBetween:function(v){
		var len = this.dot (v);
		var cosAngle = len / (this.length() * v.length());
		return Math.acos (cosAngle);
	},
	/**
	 * 旋转当前向量指定角度
	 * @method rotate
	 * @param {Number} angle 指定角度
	 */
	rotate:function(angle){
        var m = soya2d.Math;

        var sd = m.SINTABLE[angle];
        var cd = m.COSTABLE[angle];
        //处理非缓存角度
        if(sd===undefined){
            sd = Math.sin(angle*m.ONERAD);
            cd = Math.cos(angle*m.ONERAD);
        }

        var x = this.e[0],y = this.e[1];
	    this.e[0] = x * cd - y * sd;
	    this.e[1] = x * sd + y * cd;
	    return this;
	},
	/**
	 * 获得当前向量长度平方
	 * @method lengthSq
	 * @return {Number} 平方值
	 */
	lengthSq: function () {
		return this.e[0] * this.e[0] + this.e[1] * this.e[1];
	},
	/**
	 * 获得当前向量长度
	 * @method length
	 * @return {Number} 长度值
	 */
	length: function () {
		return Math.sqrt( this.lengthSq() );
	},
	/**
	 * 把当前向量变为单位向量
	 * @method normalize
	 * @return {soya2d.Vector} 单位向量
	 */
	normalize: function () {
		return this.div( this.length() );
	}
};
 
/**
 *  物理刚体接口，用于屏蔽不同物理系统的实现差异，对调用者统一接口。
 *  如果更换物理系统，只需要修改底层实现，不影响应用层
 *  @class Body
 *  @extends Signal
 *  @module physics
 */
var Body = soya2d.class("",{
    extends:Signal,
    constructor:function(displayObject){
        this.__signalHandler = new SignalHandler();
        /**
         * 显示对象引用
         */
        this.sprite = displayObject;
        /**
         * 物理刚体引用
         * @property rigid
         */
        this.rigid = null;//物理刚体
    },
    /**
     * 设置是否为传感器。传感器刚体会触发碰撞事件，但不会显现碰撞效果
     * @method sensor
     * @param  {Boolean} tof 
     * @return this
     */
    sensor:function(tof) {
        this.__cbk && this.__cbk.sensor(this.rigid,tof);
        return this;
    },
    /**
     * 移动到指定坐标
     * @method moveTo
     * @param  {Number} x 
     * @param  {Number} y 
     * @return this
     */
    moveTo:function(x,y){
        this.__cbk && this.__cbk.moveTo(this.rigid,x,y);
        return this;
    },
    /**
     * 移动指定偏移
     * @method moveBy
     * @param  {Number} offx 
     * @param  {Number} offy
     * @return this
     */
    moveBy:function(offx,offy){
        this.__cbk && this.__cbk.moveBy(this.rigid,offx,offy);
        return this;
    },
    /**
     * 设置是否为静态刚体。静态刚体会呈现碰撞，但没有重力效果
     * @method static
     * @param  {Boolean} tof 
     * @return this
     */
    static:function(tof){
        this.__cbk && this.__cbk.static(this.rigid,tof);
        return this;
    },
    /**
     * 设置刚体的质量
     * @method mass
     * @param  {Number} v 
     * @return this
     */
    mass:function(v){
        this.__cbk && this.__cbk.mass(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体旋转偏移
     * @method rotateBy
     * @param  {Number} v 
     * @return this
     */
    rotateBy:function(v){
        this.__cbk && this.__cbk.rotateBy(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体旋转角度
     * @method rotateTo
     * @param  {Number} v 
     * @return this
     */
    rotateTo:function(v){
        this.__cbk && this.__cbk.rotateTo(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体摩擦系数
     * @method friction
     * @param  {Number} v 
     * @return this
     */
    friction:function(v){
        this.__cbk && this.__cbk.friction(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体弹性系数
     * @method restitution
     * @param  {Number} v 
     * @return this
     */
    restitution:function(v){
        this.__cbk && this.__cbk.restitution(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体速度
     * @method velocity
     * @param  {Number} x 
     * @param  {Number} y 
     * @return this
     */
    velocity:function(x,y){
        this.__cbk && this.__cbk.velocity(this.rigid,x||0,y||0);
        return this;
    },
    /**
     * 设置刚体惯性
     * @method inertia
     * @param  {Number} v 
     * @return this
     */
    inertia:function(v){
        this.__cbk && this.__cbk.inertia(this.rigid,v||0);
        return this;
    }
});

/**
 * 物理类是soya2d中应用物理系统的统一接口，该接口屏蔽了不同物理系统的实现，
 * 使用统一的调用接口实现物理关联
 * @class Physics
 * @extends Signal
 * @module physics
 */
var Physics = soya2d.class("",{
    extends:Signal,
    constructor:function(game){
        this.__signalHandler = new SignalHandler();
        this.running = false;
    },
    /**
     * 建立一个物理引擎，并实现相关接口
     * @method setup
     * @param  {Object} opts 
     * @param {Function} opts.onStart 引擎启动
     * @param {Function} opts.onUpdate 引擎更新
     * @param {Function} opts.onBind 引擎启动
     */
    setup:function(opts){
    	this.__cbk = opts || {};
    },
    /**
     * 启动物理系统,可以传递参数
     * @method start
     * @param  {Object} opts 物理参数
     * @param  {Array} [opts.gravity=[0,1]] 重力参数
     * @param  {Boolean} [opts.enableSleeping] 重力参数
     */
    start:function(opts){
    	opts = opts || {};
    	opts.gravity = opts.gravity || [0,1];
		opts.gravity[0] = opts.gravity[0] || 0;
	    opts.gravity[1] = opts.gravity[1] || 1;
	    opts.enableSleeping = opts.enableSleeping || false;

		this.__cbk.onStart && this.__cbk.onStart(opts); 

		this.running = true;
    },
    /**
     * 停止物理系统
     * @method stop
     */
    stop:function(){
    	this.__cbk.onStop && this.__cbk.onStop();
    	this.running = false;
    },
    update:function(){
    	this.__cbk.onUpdate && this.__cbk.onUpdate(); 
    },
    /**
     * 绑定显示对象，建立和物理世界的关联
     * @private
     */
    bind:function(obj){
    	var shape;
    	if(this.__cbk.onBind){
    		shape = this.__cbk.onBind(obj); 
    	}
    	obj.body.rigid = shape;
    	obj.body.__cbk = this.__cbk.body;
		shape.__sprite = obj;
    },
    /**
     * 把显示对象和物理世界的映射解除
     * @private
     */
    unbind:function(obj){
        var shape = obj.body.rigid;
        if(!shape)return;

        obj.body.__cbk = null;
        if(this.__cbk.onUnbind){
            shape.__sprite = null;
            this.__cbk.onUnbind(shape);
        }
        obj.body = {};
    },
    /**
     * 让一个或多个显示对象启用物理效果
     * @param  {Array|...} objs 显示对象数组，或多个显示对象的可变参数
     */
    enable:function(objs){
    	var rs = objs;
    	if(objs instanceof Array || arguments.length>1){
    		if(arguments.length>1)rs = arguments;
    		for(var i=rs.length;i--;){
    			this.bind(rs[i]);
    		}
    	}else {
    		this.bind(rs);
    	}
    },
    /**
     * 让一个或多个显示对象关闭物理效果
     * @param  {Array|...} objs 显示对象数组，或多个显示对象的可变参数
     */
    unable:function(objs){
        var rs = objs;
        if(objs instanceof Array || arguments.length>1){
            if(arguments.length>1)rs = arguments;
            for(var i=rs.length;i--;){
                this.unbind(rs[i]);
            }
        }else {
            this.unbind(rs);
        }
    }
});

/**
 * 事件类型 - 碰撞开始
 * @property EVENT_CONTACTSTART
 * @static
 * @final
 * @for soya2d
 * @type {String}
 */
soya2d.EVENT_CONTACTSTART = 'contactstart';
/**
 * 事件类型 - 碰撞结束
 * @property EVENT_CONTACTEND
 * @static
 * @final
 * @for soya2d
 * @type {String}
 */
soya2d.EVENT_CONTACTEND = 'contactend';


/**
 * 物理事件
 * @event collisionStart
 * @for soya2d.DisplayObject
 * @param {soya2d.DisplayObject} otherCollider 碰撞对象
 */
/**
 * 物理事件
 * @event collisionEnd
 * @for soya2d.DisplayObject
 * @param {soya2d.DisplayObject} otherCollider 碰撞对象
 */

/**
 * 物理事件
 * @event collisionStart
 * @for Physics
 * @param {soya2d.DisplayObject} colliderA 碰撞对象A
 * @param {soya2d.DisplayObject} colliderB 碰撞对象B
 */
/**
 * 物理事件
 * @event collisionEnd
 * @for Physics
 * @param {soya2d.DisplayObject} colliderA 碰撞对象A
 * @param {soya2d.DisplayObject} colliderB 碰撞对象B
 */
/**
 * 显示对象工厂保存了显示对象的别名，简化了创建soya2d中所有可显示对象的工作，并且会自动加入game.world中.
 * 该类提供了用于注册自定义显示对象到快捷列表中的方法，这样可以在使用XML构建UI时，使用自定义标签
 * ```
 *     game.objects.register('rect',soya2d.Rect);
 * ```
 * <rect></rect>
 * 
 * @class DisplayObjectFactory
 */
function DisplayObjectFactory(game){
    this.map = {};
    this.game = game;
}

DisplayObjectFactory.prototype = {
	/**
	 * 注册一个别称到显示对象工厂中。注册后，可以在XML中使用别称，以及使用快速创建接口，如下
	 * ```
 	*     game.add.alias({...});
 	* ```
 	* ```html
 	* <alias></alias>
 	* ```
 	* @method register
	 * @param  {String} alias  别名
	 * @param  {Function} constructor 构造函数
	 */
    register:function(alias,constructor){
        this.map[alias] = constructor;
        this.game.add[alias] = function(data){
            return this.__newInstance(alias,data);
        }
    }
};
/**
 * 显示对象工厂代理提供用于从显示对象工厂中获取指定类型实例，并自动插入world中。
 * 工厂提供了一种代理服务，能够从别名中识别出对应的构造函数
 * @class DisplayObjectFactoryProxy
 */
function DisplayObjectFactoryProxy(game){
    this.game = game;

    this.__newInstance = function(type,data){
    	data.game = this.game;
    	var instance = new this.game.objects.map[type](data);
    	// instance.game = this.game;
    	this.game.world.add(instance);
    	return instance;
    }
}
/**
 * 显示对象是引擎中的所有可见对象的基类,该类中包含的属性用来控制一个可见对象的显示效果以及渲染方式。<br/>
 该类不能被实例化
 * @class soya2d.DisplayObject
 * @param {Object} data 定义参数,见类参数定义
 * @module display
 */
soya2d.class("soya2d.DisplayObject",{
    extends:Signal,
    __signalHandler : new SignalHandler(),
    constructor: function(data){
        data = data||{};
        	
        this.__seq = soya2d.__roIndex++;
        /**
         * 对父类的引用
         * @property _super
         * @type {soya2d.DisplayObject}
         */

        /**
         * 渲染对象id
         * @property roid
         * @readOnly
         * @type {string}
         */
        this.roid = 'roid_' + this.__seq;
        /**
         * 名称——用于识别显示对象。如果创建时不指定，默认和roid相同
         * @property name
         * @type {string}
         */
        this.name = data.name||this.roid;
        /**
         * 是否可见
         * @property visible
         * @type boolean
         * @default true
         */
        this.visible = data.visible===false?false:data.visible||true;
        /**
         * 布局对象允许以更灵活的方式设置显示对象的尺寸或坐标，属性列表如下：
         * left 当值是百分比时，相对父类的宽度
         * top  当值是百分比时，相对父类的高度
         * offsetLeft 当值是百分比时，相对自身的宽度
         * offsetTop 当值是百分比时，相对自身的高度
         * 都支持数值和百分比
         * @property layout
         * @type {Object}
         */
        this.layout = data.layout;

        this.__opacity = data.opacity===0?0:data.opacity||1;
        this.__x = data.x||0;
        this.__y = data.y||0;
        this.__w = data.w||0;
        this.__h = data.h||0;
        this.__anchorX = data.anchorX === 0?0:(data.anchorX||'50%');
        this.__anchorY = data.anchorY === 0?0:(data.anchorY||'50%');
        this.__angle = data.angle||0;
        this.__scaleX = data.scaleX==0?0:data.scaleX||1;
        this.__scaleY = data.scaleY==0?0:data.scaleY||1;
        this.__skewX = data.skewX||0;
        this.__skewY = data.skewY||0;

        Object.defineProperties(this,{
            /**
             * 不可见度0-1
             * 1:不透明
             * 0:全透明
             * @type Number
             * @property opacity
             * @default 1
             */
            opacity:{
                set:function(v){
                    if(v == 0)v = 0;
                    else{
                        v = parseFloat(v)||1;
                    }
                    this.__opacity = v<0?0:v>1?1:v;
                },
                get:function(){
                    return this.__opacity;
                },
                enumerable:true
            },
            /**
             * x坐标。使用top-left坐标系
             * @type Number
             * @property x
             * @default 0
             */
            x:{
                set:function(v){
                    this.__x = v || 0;
                    this.__localChange = true;

                    if(this.game.physics.running){
                        this.body.moveTo(this.__x,this.__y);
                    }
                },
                get:function(){
                    return this.__x;
                },
                enumerable:true
            },
            /**
             * y坐标。使用top-left坐标系
             * @type Number
             * @property y
             * @default 0
             */
            y:{
                set:function(v){
                    this.__y = v || 0;
                    this.__localChange = true;

                    if(this.game.physics.running){
                        this.body.moveTo(this.__x,this.__y);
                    }
                },
                get:function(){
                    return this.__y;
                },
                enumerable:true
            },
            /**
             * 宽度。和高度一起，标识对象的碰撞区、以及事件触发区<br/>
             * *anchorX属性也依赖该属性
             * @type Number
             * @property w
             * @default 0
             */
            w:{
                set:function(v){
                    this.__w = v;
                    this.__anchorChange = true;
                },
                get:function(){
                    return this.__w;
                },
                enumerable:true
            },
            /**
             * 高度。和宽度一起，标识对象的碰撞区、以及事件触发区<br/>
             * *anchorY属性也依赖该属性
             * @type Number
             * @property h
             * @default 0
             */
            h:{
                set:function(v){
                    this.__h = v;
                    this.__anchorChange = true;
                },
                get:function(){
                    return this.__h;
                },
                enumerable:true
            },
            /**
             * x轴参考点，对象变形时的原点,可以设置百分比字符串或者数字
             * @type {String|Number}
             * @property anchorX
             * @default 0
             */
            anchorX:{
                set:function(v){
                    this.__anchorX = v;
                    this.__anchorChange = true;
                },
                get:function(){
                    return this.__anchorX;
                },
                enumerable:true
            },
            /**
             * y轴参考点，对象变形时的原点,可以设置百分比字符串或者数字
             * @type {String|Number}
             * @property anchorY
             * @default 0
             */
            anchorY:{
                set:function(v){
                    this.__anchorY = v;
                    this.__anchorChange = true;
                },
                get:function(){
                    return this.__anchorY;
                },
                enumerable:true
            },
            /**
             * 当前旋转角度
             * @type {Number}
             * @property angle
             * @default 0
             */
            angle:{
                set:function(v){
                    this.__angle = v;
                    this.__localChange = true;

                    if(this.game.physics.running){
                        this.body.rotateTo(this.__angle);
                    }
                },
                get:function(){
                    return this.__angle;
                },
                enumerable:true
            },
            /**
             * x轴缩放比<br/>
             * 如果大于1，则会把对象横向拉伸<br/>
             * 如果等于1，不改变<br/>
             * 如果小于1，则会把对象横向缩短
             * @type {Number}
             * @property scaleX
             * @default 1
             */
            scaleX:{
                set:function(v){
                    this.__scaleX = v;
                    this.__localChange = true;
                },
                get:function(){
                    return this.__scaleX;
                },
                enumerable:true
            },
            /**
             * y轴缩放比<br/>
             * 如果大于1，则会把对象纵向拉伸<br/>
             * 如果等于1，不改变<br/>
             * 如果小于1，则会把对象纵向缩短
             * @type {Number}
             * @property scaleY
             * @default 1
             */
            scaleY:{
                set:function(v){
                    this.__scaleY = v;
                    this.__localChange = true;
                },
                get:function(){
                    return this.__scaleY;
                },
                enumerable:true
            },
            /**
             * x轴偏移角。单位：角度
             * @type {Number}
             * @property skewX
             * @default 0
             */
            skewX:{
                set:function(v){
                    this.__skewX = v;
                    this.__localChange = true;
                },
                get:function(){
                    return this.__skewX;
                },
                enumerable:true
            },
            /**
             * y轴偏移角。单位：角度
             * @type {Number}
             * @property skewY
             * @default 0
             */
            skewY:{
                set:function(v){
                    this.__skewY = v;
                    this.__localChange = true;
                },
                get:function(){
                    return this.__skewY;
                },
                enumerable:true
            }
        });

        /**
         * z坐标。标识对象所属图层，并且引擎会按照z值的大小进行渲染
         * @type {Number}
         * @property z
         * @default 0
         */
        this.z = data.z||0;
        /**
         * 是否需要本地变换
         * @type {Boolean}
         * @private
         */
        this.__localChange = true;
        /**
         * 是否需要参考点变换
         * @type {Boolean}
         * @private
         */
        this.__anchorChange = true;
        /**
         * 本地变形
         * @type {soya2d.Matrix2x2}
         * @private
         */
        this.__localTransform = new soya2d.Matrix2x2();
        /**
         * 世界变形，用于渲染
         * @type {soya2d.Matrix2x2}
         * @private
         */
        this.__worldTransform = new soya2d.Matrix2x2();
        /**
         * 世界坐标
         * @readOnly
         * @property worldPosition
         * @type {soya2d.Point}
         */
        this.worldPosition = new soya2d.Point();
        /**
         * 锚点坐标
         * @property anchorPosition
         * @readOnly
         * @type {soya2d.Point}
         */
        this.anchorPosition = new soya2d.Point();
        /**
         * 屏幕坐标
         * @type {soya2d.Point}
         * @private
         */
        this.__screenPosition = new soya2d.Point();
        /**
         * 混合方式
         * @property blendMode
         * @type String
         * @default soya2d.BLEND_NORMAL
         * @see soya2d.BLEND_NORMAL
         */
        this.blendMode = data.blendMode || 'source-over';

        this.__mask = data.mask || null;
        this.__fixedToCamera = data.fixedToCamera || false;
        Object.defineProperties(this,{
            /**
             * 遮罩。可以是一个绘制的简单图形比如圆，也可以是包含了多个形状子节点的复合形状。
             * 被用于遮罩的对象只能同时存在一个需要遮罩的对象上，多次设置只会保留最后一次，
             * 并且被用于遮罩的对象不会出现在画面上<br/>
             * *如果需要动态控制遮罩对象，需要把遮罩对象添加到场景中
             * @property mask
             * @type {soya2d.DisplayObject}
             * @default null; 
             */
            mask:{
                set:function(m){
                    if(m){
                        if(m.__masker){
                            m.__masker.__mask = null;
                        }
                        this.__mask = m;
                        m.__masker = this;
                    }
                },
                get:function(){
                    return this.__mask;
                },
                enumerable:true
            },
            /**
             * 是否固定到摄像机。如果该属性为true，当摄像机移动时，精灵会固定在摄像机的指定位置
             * @property fixedToCamera
             * @type {Boolean}
             */
            fixedToCamera:{
                set:function(v){
                    this.__fixedToCamera = v;
                    if(v)
                        this.cameraOffset.set(this.x,this.y);
                },
                get:function(){
                    return this.__fixedToCamera;
                },
                enumerable:true
            }
        });
        /**
         * 使用当前对象作为遮罩的对象，如果该属性有值，则不会被渲染
         * @private
         */
        this.__masker = null;
        /**
         * 对象范围，用于拾取测试和物理碰撞
         * @property bounds
         * @type {soya2d.Rectangle | soya2d.Circle | soya2d.Polygon}
         * @default soya2d.Rectangle实例
         */
        this.bounds = data.bounds || new soya2d.Rectangle(0,0,this.__w,this.__h);
        /**
         * 存储boundingbox
         * @private
         */
        this.__boundRect = new soya2d.Rectangle(0,0,1,1);
        /**
         * 对象在物理世界中的实体
         * @property body
         * @type {Body}
         */
        this.body = new Body(this);
        /**
         * 对象所属的游戏实例。当对象被添加到一个game上时，该值为game实例的引用。
         * 当对象被创建或从game实例上删除时，该值为null<br/>
         * 必须先创建game实例(这样引擎会自动引用该实例)或者显式指定game参数，否则会引起异常
         * @property game
         * @default null
         * @readOnly
         * @type {soya2d.Game}
         */
        this.game = data.game || soya2d.games[0];
        /**
         * 对象缓存的的内部图形。删除该属性可以取消缓存
         * @property imageCache
         * @type {HTMLCanvasElement}
         * @default null 
         */
        this.imageCache = null;
        this.__updateCache = false;

        /**
         * 相对镜头左上角的偏移对象
         * @property cameraOffset
         * @type {Object}
         * @default {x:0,y:0}
         */
        this.cameraOffset = new soya2d.Point();

        //check valid
        if(!this.game){
            throw new Error('soya2d.DisplayObject: invalid param [game]; '+this.game);
        }

        soya2d.ext(this, data);

        this.fixedToCamera = this.__fixedToCamera;
    },
    __onAdded:function(){
        this.centerX = this.w/2;
        this.centerY = this.h/2;
        this.setLayout(this.layout);

        //calc camera offset
        if(this.fixedToCamera && this.layout){
            this.cameraOffset.set(this.x,this.y);
        }

        if(this.onAdded)this.onAdded();
    },
    /**
     * 设置显示对象的布局
     * @method setLayout
     * @param {Object} layout 布局对象
     */
    setLayout:function(layout){
        if(!layout)return this;
        
        var l = layout.left || 0;
        var t = layout.top || 0;
        var w = layout.width;
        var h = layout.height;
        var ol = layout.offsetLeft;
        var ot = layout.offsetTop;

        if(w)
        this.__w = getXW(w,this.parent)||0;
        if(h)
        this.__h = getYH(h,this.parent)||0;

        var offL = 0;
        var offT = 0;
        if(ol)offL = getOff(ol,this.__w);
        if(ot)offT = getOff(ot,this.__h);

        if(l || ol)
        this.__x = getXW(l,this.parent) + offL;
        if(t || ot)
        this.__y = getYH(t,this.parent) + offT;

        return this;
    },
    /**
     * @method toString
     * @return {String}
     */
    toString:function(){
        return '{roid:"'+this.roid+'";name:"'+this.name+'"}';
    },
    /**
     * 更新本地和世界变换。通常该方法由引擎自己调用
     * @method tranform
     */
    transform:function(){
        var x = this.__x,
            y = this.__y;
        if(this.__localChange){
            this.__localTransform.identity();
            this.__localTransform
            .scale(this.__scaleX,this.__scaleY)
            .rotate(this.__angle).skew(this.__skewX,this.__skewY);
        }

        var lt = this.__localTransform;
        var wt = this.__worldTransform;
        var ap = this.anchorPosition;
        var le = lt.e;

        var ox=ap.x,oy=ap.y;
        if(this.__anchorChange){
            ox = this.__anchorX,
            oy = this.__anchorY;
            ox = typeof ox==='number'?ox:parseFloat(ox)/100* this.__w,
            oy = typeof oy==='number'?oy:parseFloat(oy)/100* this.__h;

            ap.set(ox,oy);
        }
        //css style
        x += ox,
        y += oy;

        
        wt.set(le[0],le[1],le[2],le[3]);
        if(this.parent){
            var pt = this.parent.__worldTransform;
            var pte = pt.e;
            var pwp = this.parent.worldPosition;
            var pap = this.parent.anchorPosition;
            var popx = pap.x*pte[0]+pap.y*pte[2],
                popy = pap.x*pte[1]+pap.y*pte[3];
            

            var wx = x*pte[0]+y*pte[2],
                wy = x*pte[1]+y*pte[3];

            x = wx + pwp.x - popx,
            y = wy + pwp.y - popy;

            wt.mul(pt);
        }



        // if(this.__fixedToCamera){
        //     var camera = this.game.camera;
        //     x = camera.x + this.cameraOffset.x;
        //     y = camera.y + this.cameraOffset.y;

        //     this.__fixedDO = true;
        // }else if(this.parent && this.parent.__fixedDO){
        //     this.__fixedDO = true;

        //     x += this.parent.anchorPosition.x;
        //     y += this.parent.anchorPosition.y;
        // }

        //physics
        if(this.body.rigid){
            x -= ap.x;
            y -= ap.y;
        }

        this.worldPosition.set(x,y);

        //重置变换标识
        this.__localChange = this.__anchorChange = false;
    },
    /**
     * 返回当前对象是否被渲染了。比如父节点被隐藏时，子节点实际上不会被渲染
     * @method isRendered
     * @return {Boolean} true/false
     */
    isRendered:function(){
        if(!this.visible || this.opacity===0)return false;
        var p = this.parent;
        while(p){
            if(!p.visible || p.opacity===0)return false;
            if(!p.parent && !(p instanceof Stage))return false;
            p = p.parent;
        }
        return true;
    },
    /**
	 * 复制方法,不会复制当前节点的子节点
     * @method clone
     * @param {boolean} [isRecur=false] 递归复制标识
     * @param {soya2d.DisplayObject} [copy=null] 副本,用于子类覆盖
     * @return {soya2d.DisplayObject} 新的实例
	 */
	clone:function(isRecur,copy){
		copy = copy || new this.constructor();
        var keys = Object.keys(this);
		for (var k=keys.length;k--;) {
            var i = keys[k];
			if( i === 'parent' 
            || i==='__seq' 
            || i==='roid' 
			|| i==='__localTransform'
            || i==='__worldTransform'
            || i==='worldPosition'
            || i==='anchorPosition'
            || i==='__screenPosition'

            )continue;
            if(!isRecur && i==='children')continue;      
            //复制子节点
            if(isRecur && i==='children' && this[i] && this[i].length>0){
                copy[i] = [];
                for(var j=0;j<this[i].length;j++){
                    var child = this[i][j];
                    var childCopy = child.clone(isRecur);
                    childCopy.parent = copy;
                    copy[i].push(childCopy);
                }
                continue;
            }

            if(this[i] instanceof Array){
				copy[i] = this[i].slice(0);
			}else{
				copy[i] = this[i];
			}
        }
		return copy;
	},
	/**
	 * 增加精灵偏移
     * @method moveBy
	 * @param {Number} ox x轴偏移
	 * @param {Number} oy y轴偏移
     * @return {soya2d.DisplayObject} this
	 */
	moveBy:function(ox,oy){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;
        
		this.x += a1;
		this.y += a2;
        return this;
	},
	/**
	 * 移动精灵到指定的坐标
     * @method moveTo
	 * @param {Number} x x坐标
	 * @param {Number} y y坐标
     * @return {soya2d.DisplayObject} this
	 */
	moveTo:function(x,y){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

		this.x = a1;
		this.y = a2;
        return this;
	},
	/**
	 * 设置透明度
     * @method opacifyTo
	 * @param {Number} o 透明度值
     * @return {soya2d.DisplayObject} this
	 */
	opacifyTo:function(o){
		this.opacity = o>1?1:o<0?0:o;
        return this;
	},
	/**
	 * 设置透明度偏移
     * @method opacifyBy
	 * @param {Number} o 透明度差值
     * @return {soya2d.DisplayObject} this
	 */
	opacifyBy:function(o){
		this.opacity += o;
		if(this.opacity > 1)this.opacity = 1;
		if(this.opacity < 0)this.opacity = 0;
        return this;
	},
    /**
     * 设置尺寸
     * @method resizeTo
     * @param {Number} w 宽
     * @param {Number} h 高
     * @return {soya2d.DisplayObject} this
     */
	resizeTo:function(w,h){
        var a1 = arguments[0] || 0;
       var a2 = arguments[1]===0?0:arguments[1]|| a1;

		this.w = a1;
		this.h = a2;
        return this;
	},
    /**
     * 增加精灵的缩放比例
     * @method scaleBy
     * @param {Number} sx x轴缩放比
     * @param {Number} sy y轴缩放比
     * @return this
     */
    scaleBy:function(sx,sy){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.scaleX += a1;
        this.scaleY += a2;
        return this;
    },
    /**
     * 缩放精灵到指定的比例
     * @method scaleTo
     * @param {Number} sx x轴缩放比
     * @param {Number} sy y轴缩放比
     * @return this
     */
    scaleTo:function(sx,sy){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.scaleX = a1;
        this.scaleY = a2;
        return this;
    },
    /**
     * 增加精灵偏移角度
     * @method skewBy
     * @param {Number} rx x轴偏移角度
     * @param {Number} ry y轴偏移角度
     * @return this
     */
    skewBy:function(rx,ry){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.skewX += a1;
        this.skewY += a2;
        return this;
    },
    /**
     * 偏移精灵到指定角度
     * @method skewTo
     * @param {Number} rx x轴偏移角度
     * @param {Number} ry y轴偏移角度
     * @return this
     */
    skewTo:function(rx,ry){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.skewX = a1;
        this.skewY = a2;
        return this;
    },
    /**
     * 增加精灵旋转角度
     * @method rotateBy
     * @param {Number} rn 旋转角度
     * @return this
     */
    rotateBy:function(rn){
        this.angle += rn;
        return this;
    },
    /**
     * 旋转精灵到指定角度
     * @method rotateTo
     * @param {Number} rn 角度
     * @return this
     */
    rotateTo:function(rn){
        this.angle = rn;
        return this;
    },
    /**
     * 增加精灵参考点
     * @method anchorBy
     * @param {String|Number} x 相对精灵左上角的x坐标偏移,可以设置百分比字符串或者数字
     * @param {String|Number} y 相对精灵左上角的y坐标偏移,可以设置百分比字符串或者数字
     * @return this
     */
    anchorBy:function(x,y){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.anchorX += a1;
        this.anchorY += a2;
        return this;
    },
    /**
     * 设置精灵参考点
     * @method anchorTo
     * @param {String|Number} x 相对精灵左上角的x坐标偏移,可以设置百分比字符串或者数字
     * @param {String|Number} y 相对精灵左上角的y坐标偏移,可以设置百分比字符串或者数字
     * @return this
     */
    anchorTo:function(x,y){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.anchorX = a1;
        this.anchorY = a2;
        return this;
    },
    /**
     * 返回该对象当前变形状态的4个顶点<br/>
     * *该方法依赖对象的[x、y、w、h、anchorX、anchorY]6个属性
     * @method getBoundingPoints
     * @return {Array} [ topLeftX,topLeftY,
     *                  topRightX,topRightY,
     *                  bottomRightX,bottomRightY,
     *                  bottomLeftX,bottomLeftY ]
     */
    getBoundingPoints:function(){
        //加载矩阵
        var e = this.__worldTransform.e;
        var wp = this.worldPosition;
        var ap = this.anchorPosition;
        var bx = wp.x,by = wp.y;
        var m11 = e[0],m12 = e[1],
            m21 = e[2],m22 = e[3];
        var ox = ap.x,oy = ap.y;

        //计算原始顶点
        var tl_x = -ox,tl_y = -oy;
        var tr_x = this.w-ox,tr_y = -oy;
        var bl_x = -ox,bl_y = this.h-oy;
        var br_x = this.w-ox,br_y = this.h-oy;
        
        //计算顶点[x,y,1] * m
        return [tl_x*m11+tl_y*m21+bx,tl_x*m12+tl_y*m22+by,
            tr_x*m11+tr_y*m21+bx,tr_x*m12+tr_y*m22+by,
            br_x*m11+br_y*m21+bx,br_x*m12+br_y*m22+by,
            bl_x*m11+bl_y*m21+bx,bl_x*m12+bl_y*m22+by
        ];
    },
    /**
     * 返回该对象当前变形状态的包围矩形<br/>
     * *该方法依赖对象的[x、y、w、h、anchorX、anchorY]6个属性
     * @method getBoundingBox
     * @return {soya2d.Rectangle} 矩形几何对象
     */
    getBoundingBox:function(){
        var xys = this.getBoundingPoints();
        var minX,minY,maxX,maxY;
        maxX=xys[0],minX=xys[0],maxY=xys[1],minY=xys[1];
        for(var i=xys.length;i--;){
            if(i%2 === 0){
                if(xys[i]>maxX)maxX=xys[i];
                if(xys[i]<minX)minX=xys[i];
            }else{
                if(xys[i]>maxY)maxY=xys[i];
                if(xys[i]<minY)minY=xys[i];
            }
        }
        var sx = minX,
            sy = minY,
            sw = maxX - minX,
            sh = maxY - minY;

        this.__boundRect.x = sx;
        this.__boundRect.y = sy;
        this.__boundRect.w = sw;
        this.__boundRect.h = sh;

        return this.__boundRect;
    },
    /**
     * 拾取测试。依赖当前显示对象的bounds
     * @method hitTest
     * @param  {number} x x坐标
     * @param  {number} y y坐标
     * @return {Boolean} 点是否在bounds内
     * @see soya2d.DisplayObject#bounds
     */
    hitTest:function(x,y){
        var wp = this.worldPosition;
        if(this.bounds instanceof soya2d.Circle){
            var dis = Math.abs(soya2d.Math.len2D(wp.x,wp.y,x,y));
            if(dis <= this.bounds.r)return true;
        }else if(this.bounds instanceof soya2d.Rectangle ||
            this.bounds instanceof soya2d.Polygon){
            var vtx;
            if(this.bounds.vtx){
                var e = this.__worldTransform.e;
                var ap = this.anchorPosition;
                var bx = wp.x,by = wp.y;
                var m11 = e[0],m12 = e[1],
                    m21 = e[2],m22 = e[3];
                var ox = ap.x,oy = ap.y;

                //计算原始顶点
                var tl_x = -ox,tl_y = -oy;

                vtx = [];
                for(var i=0;i<this.bounds.vtx.length;i+=2){
                    var sx = this.bounds.vtx[i] + tl_x,
                        sy = this.bounds.vtx[i+1] + tl_y;
                    vtx.push(sx*m11+sy*m21+bx, sx*m12+sy*m22+by);
                }
            }else{
                vtx = this.getBoundingPoints();
            }
            var hit = false;
            for(var i=0;i<vtx.length;i+=2){
                var sx = vtx[i],
                    sy = vtx[i+1],
                    tx = vtx[i+2] || vtx[0],
                    ty = vtx[i+3] || vtx[1];
                
                if((sx === x && sy === y) || (tx === x && ty === y)){
                    return true;
                }

                if((sy < y && ty >= y) || (sy >= y && ty < y)){
                    var rx = (y-sy)/(ty-sy)*(tx-sx)+sx;

                    if(rx === x){
                        return true;
                    }
                    if(rx > x){
                        hit = !hit;
                    }
                }//over if
            }//over for

            return hit;
        }

        return false;
    },
    /**
     * 检测两个对象是否相交
     * @method intersectWith
     * @param  {DisplayObject} obj
     * @return {Boolean}
     */
    intersectWith:function(obj) {
        var sb = this.getBoundingBox();
        var db = obj.getBoundingBox();

        return sb.intersectWith(db);
    },
    /**
     * 获取锚点坐标
     * @method getAnchorPosition
     * @return {soya2d.Point} 
     */
    getAnchorPosition:function(){
        //加载矩阵
        var e = this.__worldTransform.e;
        var wp = this.worldPosition;
        var ap = this.anchorPosition;
        var bx = wp.x,by = wp.y;
        var m11 = e[0],m12 = e[1],
            m21 = e[2],m22 = e[3];
        var ox = ap.x,oy = ap.y;

        //计算原始顶点
        var tl_x = -ox,tl_y = -oy;
        
        //计算原始锚点
        var anchorX = this.w * parseInt(this.anchorX)/100,
            anchorY = this.h * parseInt(this.anchorY)/100;
        //求出0°时的半径
        var r = Math.sqrt(anchorY*anchorY + anchorX*anchorX);
        //计算出锚点和左上角的夹角
        var angle = Math.atan2(anchorY,anchorX);
        
        //相对于精灵左上角的锚点值
        anchorX =  Math.cos(angle)*r + tl_x;
        anchorY =  Math.sin(angle)*r + tl_y;
        
        //计算顶点[x,y,1] * m
        return new soya2d.Point(anchorX*m11+anchorY*m21+bx,anchorX*m12+anchorY*m22+by);
    },
    /**
     * 缓存当前对象的矢量绘图为贴图，提高显示性能。提高幅度根据所使用的path API的复杂度决定。
     * 越复杂的path绘制，cache效果越明显。缓存大小根据对象的w/h决定，但是不能超过1024*1024。
     * 需要注意的是，缓存不会自动更新，当对象发生变形时，并不会反馈到缓存，直到你显式调用该方法
     * @method cache
     */
    cache:function(){
        if(this.__w > 1024 || this.__h > 1024)return;
        if(!this.imageCache){
            this.imageCache = document.createElement('canvas');
        }
        this.imageCache.width = this.__w;
        this.imageCache.height = this.__h;
        //redraw
        this.transform();
        this.__updateCache = true;
        var ctx = this.imageCache.getContext('2d');
        var g = new soya2d.CanvasGraphics(ctx);
        this.game.renderer.renderDO(this.game.camera.__view,ctx,this,g,true);
        this.__updateCache = false;
    },
    /**
     * 销毁当前对象，以及所有子对象。
     * @method destroy
     */
    destroy:function(){
        game.physics.unbind(this);
        this.off();//remove all signals
        if(!this.__seq)return;
        if(this.children.length>0){
            this.children.forEach(function(child){
                child.destroy();
            });
        }
        var ks = Object.keys(this);
        for(var i=ks.length;i--;){
            if(ks[i].indexOf('__') < 0)continue;
            this[ks[i]] = null;
        }
        if(this.parent)
            this.parent.remove(this);

        this.onRender = 
        this.onUpdate = 
        this.parent = 
        this.children = 
        this.imageCache =
        this.fillStyle = 
        this.game = 
        this.body = null;
    }
});

function getXW(val,parent){
    if(/^(-?\d+)%$/.test(val)){
        var per = parseFloat(RegExp.$1) / 100;
        return getW(parent,per);
    }else{
        return val;
    }
}
function getYH(val,parent){
    if(/^(-?\d+)%$/.test(val)){
        var per = parseFloat(RegExp.$1) / 100;
        return getH(parent,per);
    }else{
        return val;
    }
}

function getOff(offset,typeVal){
    if(!isNaN(offset))return parseFloat(offset);

    var off = typeVal;
    var per = 0;
    if(/^(-?\d+)%$/.test(offset)){
        per = parseFloat(RegExp.$1) / 100;
    }
    return off*per;
}

function getW(parent,rate){
    var pw = parent.w;
    if(pw === 0 && parent.parent){
        return getW(parent.parent,rate);
    }
    return pw * rate;
}
function getH(parent,rate){
    var ph = parent.h;
    if(ph === 0 && parent.parent){
        return getH(parent.parent,rate);
    }
    return ph * rate;
}

/**
 * 渲染回调，每帧调用。在该回调中使用绘图对象g进行图像绘制
 * @method onRender
 * @param {soya2d.CanvasGraphics} g 绘图对象，根据渲染器类型不同而不同
 */
/**
 * 更新回调，每帧调用。在该回调中可以编写更新逻辑
 * @method onUpdate
 * @param {soya2d.Game} game 当前精灵所在的游戏实例
 */
/**
 * 添加到渲染树回调
 * @method onAdded
 */

/**
 * 显示对象容器继承自显示对象，是所有显示容器的基类。该类提供了用于管理包含子节点的容器相关的方法。<br/>
 该类不能被实例化
 * 
 * @class soya2d.DisplayObjectContainer
 * @extends soya2d.DisplayObject
 * @param {Object} data 同父类定义参数
 */
soya2d.class("soya2d.DisplayObjectContainer",{
    extends:soya2d.DisplayObject,
    constructor:function(data){
        /**
         * 子节点数组
         * @property children
         * @type {Array}
         * @default []
         */
        this.children = [];
        /**
         * 父节点引用
         * @property parent
         * @type {soya2d.DisplayObject}
         * @default null
         */
        this.parent = null;
    },
    /**
     * 增加子节点
     * @method add
     * @param {...soya2d.DisplayObject} children 一个或者多个可渲染对象，使用逗号分割
     * @return this
     */
    add:function(){
        for(var i=0;i<arguments.length;i++){
            var child = arguments[i];

            if(child.parent){
                child.parent.remove(child);
            }
            this.children.push(child);
            child.parent = this;

            //触发onAdded事件
            child.__onAdded();
        }

        return this;
    },
    /**
     * 删除子节点
     * @method remove
     * @param {...soya2d.DisplayObject} children 一个或者多个可渲染对象，使用逗号分割
     * @return this
     */
    remove:function(){
        for(var i=0;i<arguments.length;i++){
            var child = arguments[i];
            var index = this.children.indexOf(child);
            if(index<0)continue;

            this.children.splice(index,1);
            child.parent = null;
        }
        
        return this;
    },
    /**
     * 清除所有子节点
     * @method clear
     * @return {Array} 子节点
     */
    clear:function(destroy){
        for(var i=this.children.length;i--;){
            this.children[i].parent = null;
        }
        var rs = this.children;
        this.children = [];
        if(destroy){
            for(var i=rs.length;i--;){
                rs[i].destroy();
            }
        }
        return rs;
    },
    /**
     * 在当前节点下查找符合条件的所有子节点
     * @method find
     * @param {Function} filter 过滤回调，接收显示对象为参数，返回true表示该对象返回
     * @param {Boolean} [isRecur=false] 递归查找标识
     * @return {Array} 符合过滤条件的节点数组，如果没有，返回空数组
     */
    find:function(filter,isRecur){
        if(this.children.length<1)return [];

        var rs;
        if(isRecur){
            rs = [];
            recur(this,filter,rs);
        }else{
            rs = this.children.filter(filter);
        }
        return rs;
    }
});

function recur(parent,filter,rs){
    for(var i=parent.children.length;i--;){
        var c = parent.children[i];
        if(filter(c)){
            rs.push(c);
        }
        if(c.children && c.children.length>0){
            recur(c,filter,rs);
        }
    }
}
/**
 * 舞台对象表现为一个soya2D的渲染窗口，每个game实例都有且仅有一个stage对象。
 * stage也是渲染树中的顶级对象，stage的大小和渲染窗口一致。
 * stage对象可以用于设置窗口视图规则，包括分辨率适应、窗口事件回调等。
 * <br>通常stage只有一个world子节点，但是可以增加其他显示对象。注意，
 * stage的直接子节点不受{{#crossLink "Camera"}}{{/crossLink}}的控制。
 * 
 * @class Stage
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 */
var Stage = soya2d.class("",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        this.game = data.game;
        this.__anchorX = this.__anchorY = 0;
        /**
         * 缩放最小宽度
         * @property minWidth
         * @type {Number}
         * @default 0
         */
        this.minWidth = 0;
        /**
         * 缩放最小高度
         * @property minHeight
         * @type {Number}
         * @default 0
         */
        this.minHeight = 0;
        /**
         * 缩放最大宽度
         * @property maxWidth
         * @type {Number}
         * @default 0
         */
        this.maxWidth = 0;
        /**
         * 缩放最大高度
         * @property maxHeight
         * @type {Number}
         * @default 0
         */
        this.maxHeight = 0;
        /**
         * 是否在横竖屏切换、resize窗口时，都进行缩放
         * @property autoScale
         * @type {Boolean}
         * @default true
         */
        this.autoScale = true;

        /********************* 行为定义 *********************/

        /**
         * 视图方向。portrait或者landscape
         * @property orientation
         * @type {string}
         * @readOnly
         * @default portrait
         */
        this.orientation = getOrientation();
        var that = this;
        var timer;
        window.addEventListener("orientationchange", function(e){
            clearTimeout(timer);
            timer = setTimeout(function() {
                that.orientation = getOrientation();
            }, 500);
            if(that.autoScale){
                that.__scan();
            }
        }, false);
        window.addEventListener("resize", function(e){
            that.orientation = getOrientation();
            if(that.autoScale){
                that.__scan();
            }
        }, false);

        this.__bg = null;
        this.__rotat = soya2d.ROTATEMODE_0;
        var align = soya2d.ALIGNMODE_CENTER;
        var scaleMode = soya2d.SCALEMODE_SHOWALL;
        Object.defineProperties(this,{
            ////////////////////////////舞台相关
            /**
             * 缩放类型
             * @property scaleMode
             * @type {int}
             * @default soya2d.SCALEMODE_SHOWALL
             */
            scaleMode : {
                set:function(){
                    this.__scan();
                },
                get:function(){
                    return scaleMode;
                }
            },
            /**
             * 设置或者获取该视图对齐模式。SHOWALL模式下有效
             * @property alignMode
             * @type  {int} alignMode 对齐模式
             */
            alignMode : {
                set:function(alignMode){
                    if(alignMode && this.scaleMode === soya2d.SCALEMODE_SHOWALL){
                        var canvas = this.game.renderer.getCanvas();
                        align = alignMode;
                        switch(alignMode){
                            case soya2d.ALIGNMODE_LEFT:
                                canvas.style.left = 0;
                                canvas.style.right = 'auto';
                                break;
                            case soya2d.ALIGNMODE_RIGHT:
                                canvas.style.left = 'auto';
                                canvas.style.right = 0;
                                break;
                            case soya2d.ALIGNMODE_CENTER:
                            default:
                                canvas.style.left = 0;
                                canvas.style.right = 0;
                                align = soya2d.ALIGNMODE_CENTER;//覆盖错误参数
                                break;
                        }
                        canvas.style.margin = 'auto';
                    }
                },
                get:function(){
                    return align;
                }
            },
            /**
             * 设置或者获取该视图旋转模式
             * @property rotateMode
             * @type  {int} rotateMode 旋转模式
             */
            rotateMode:{
                set:function(rotateMode){
                    this.__rotat = rotateMode;
                    this.__scan();
                },
                get:function(){
                    return this.__rotat;
                }
            }
        });
    },
    /**
     * 更新矩阵树，并记录可渲染的RO。场景自身不处理
     * @private
     */
    __updateMatrix : function(){
        updateMx(this);
    },
    /**
     * 更新整个场景
     * @private
     */
    __update : function(game,d){
        if(this.children)
            update(this.children,game,d);
    },
    onRender:function(g){
        if(this.__bg){
            g.fillStyle(this.__bg);
            g.fillRect(0,0,this.w,this.h);
        }
    },
    /**
     * 设置背景
     * @method background
     * @param  {Object} color 根据类型不同，会解析为不同的背景设置<br/>
     * |type|desc|
     * |----|:----|
     * |String| 颜色字符串，支持HEX或者RGB |
     * |Image | 背景图，支持第二个参数设置repeat |
     * |Int   | 渐变方式，支持GRADIENT_LINEAR / GRADIENT_RADIAL，后面参数依次为ratio数组，颜色数组，渐变长度 |
     * 
     */
    background:function(color){
        if(typeof(color) === 'string'){
            this.__bg = color;
        }else if(color instanceof self.Image){
            this.__bg = this.game.renderer.createPattern(color,arguments[1]);
        }else if(!isNaN(color)){
            var opt = {};
            if(arguments[4])
                soya2d.ext(opt,arguments[4]);
            opt.type = color;
            var gradient = this.game.renderer.createGradient(arguments[1],arguments[2],arguments[3]||1,opt);
            this.__bg = gradient;
        }
    },
    /**
     * 扫描是否需要缩放，如果需要，则根据缩放参数进行缩放
     * @private
     */
    __scan : function(){
        var designWidth = this.game.w;
        var designHeight = this.game.h;
        
        //选择缩放器
        var scaler;
        switch(this.scaleMode){
            case soya2d.SCALEMODE_NOSCALE:break;
            case soya2d.SCALEMODE_NOBORDER:scaler = NOBORDER;break;
            case soya2d.SCALEMODE_EXACTFIT:scaler = EXACTFIT;break;
            case soya2d.SCALEMODE_SHOWALL:
            default:
            scaler = SHOWALL;
        }
        if(!scaler)return;
        var renderer = this.game.renderer;
        var container = renderer.getCanvas().parentNode;
        //判断设计size是否超过了容器size
        var cw = container.clientWidth;
        var ch = container.clientHeight;
        if(container.tagName === 'BODY'){
            ch = window.innerHeight;
        }
        var wh = scaler(designWidth,designHeight,cw,ch,this.minWidth,this.minHeight,this.maxWidth,this.maxHeight);
        renderer.resize(wh[0],wh[1]);

        //rotate
        rotate(this.scaleMode,this.__rotat,renderer.getCanvas(),renderer,this);
    }
});
//更新矩阵
function updateMx(ro){
    ro.transform();
    ro.__renderable = true;
    if(ro.children)
        for(var i=ro.children.length;i--;){
            var c = ro.children[i];
            if(c.visible){
                updateMx(c);
            }
        }
}
function update(list,game,delta){
    for(var i=list.length;i--;){
        var c = list[i];
        if(c._onUpdate){
            c._onUpdate(game,delta);
        }
        if(c.onUpdate){
            c.onUpdate(game,delta);
        }
        if(c.children && c.children.length>0){
            update(c.children,game,delta);
        }
    }
}
function rotate(scaleMode,rotateMode,canvas,renderer,stage){
    var rs;
    switch(rotateMode){
        case soya2d.ROTATEMODE_90:
            rs = 'rotate('+90+'deg)';
            break;
        case soya2d.ROTATEMODE_180:
            rs = 'rotate('+180+'deg)';
            break;
        case soya2d.ROTATEMODE_270:
            rs = 'rotate('+270+'deg)';
            break;
        case soya2d.ROTATEMODE_0:
        default:
            rs = 'rotate('+0+'deg)';
            stage.__rotat = soya2d.ROTATEMODE_0;
            break;
    }

    canvas.style.transform = 
    canvas.style.webkitTransform = 
    canvas.style.mozTransform = 
    canvas.style.msTransform = 
    canvas.style.oTransform = rs;

    canvas.style.left = canvas.style.top = 0;

    //reset bounds
    if(rotateMode === soya2d.ROTATEMODE_90 || rotateMode === soya2d.ROTATEMODE_270){
        var h = canvas.offsetWidth;
        var w = canvas.offsetHeight;

        if(scaleMode === soya2d.SCALEMODE_NOBORDER){
            var designWidth = this.game.w;
            var designHeight = this.game.h;
            h = h>designHeight?designHeight:h;
            w = w>designWidth?designWidth:w;
        }
        renderer.resize(w,h);

        if(scaleMode === soya2d.SCALEMODE_EXACTFIT){
            var offLeft = (h - w)/2;
            offLeft = w%2===0?offLeft:Math.floor(offLeft);
            var offTop = (w - h)/2;
            offTop = h%2===0?offTop:Math.floor(offTop);
            
            canvas.style.left = offLeft +'px';
            canvas.style.top = offTop +'px';
        }
    }
}
function getOrientation(){
    var w = window.innerWidth;
    var h = window.innerHeight;
    var rs;
    if(w > h){
        rs = 'landscape';
    }else{
        rs = 'portrait';
    }
    return rs;
}
/**
 * 视图缩放类型，不缩放。游戏默认值
 * @property SCALEMODE_NOSCALE
 * @final
 * @static
 * @for soya2d
 */
soya2d.SCALEMODE_NOSCALE = 0;
/**
 * 视图缩放类型，等比缩放，总是显示全部
 * @property SCALEMODE_SHOWALL
 * @final
 * @static
 * @for soya2d
 */
soya2d.SCALEMODE_SHOWALL = 1;
/**
 * 视图缩放类型，等比缩放，不一定显示全部
 * @property SCALEMODE_NOBORDER
 * @final
 * @static
 * @for soya2d
 */
soya2d.SCALEMODE_NOBORDER = 2;
/**
 * 视图缩放类型，非等比缩放。完全适配容器
 * @property SCALEMODE_EXACTFIT
 * @final
 * @static
 * @for soya2d
 */
soya2d.SCALEMODE_EXACTFIT = 3;

/**
 * 视图对齐类型
 * @property ALIGNMODE_LEFT
 * @final
 * @static
 * @for soya2d
 */
soya2d.ALIGNMODE_LEFT = 1;
/**
 * 视图对齐类型
 * @property ALIGNMODE_CENTER
 * @final
 * @static
 * @for soya2d
 */
soya2d.ALIGNMODE_CENTER = 2;
/**
 * 视图对齐类型
 * @property ALIGNMODE_RIGHT
 * @final
 * @static
 * @for soya2d
 */
soya2d.ALIGNMODE_RIGHT = 3;

/**
 * 视图旋转类型
 * @property ROTATEMODE_0
 * @final
 * @static
 * @for soya2d
 */
soya2d.ROTATEMODE_0 = 1;
/**
 * 视图旋转类型
 * @property ROTATEMODE_90
 * @final
 * @static
 * @for soya2d
 */
soya2d.ROTATEMODE_90 = 2;
/**
 * 视图旋转类型
 * @property ROTATEMODE_180
 * @final
 * @static
 * @for soya2d
 */
soya2d.ROTATEMODE_180 = 3;
/**
 * 视图旋转类型
 * @property ROTATEMODE_270
 * @final
 * @static
 * @for soya2d
 */
soya2d.ROTATEMODE_270 = 4;

/********************* 规则定义 *********************/
function NOBORDER(dw,dh,cw,ch,mw,mh,mxw,mxh){
    cw = mxw && cw > mxw?mxw:cw;
    ch = mxh && ch > mxh?mxh:ch;

    var r = Math.max(cw/dw,ch/dh);
    var w = dw*r,
        h = dh*r;
    return [w,h];
}
function SHOWALL(dw,dh,cw,ch,mw,mh,mxw,mxh){
    cw = mxw && cw > mxw?mxw:cw;
    ch = mxh && ch > mxh?mxh:ch;

    var r = 1;
    if(dw > cw || dh > ch)
        r = Math.min(cw/dw,ch/dh);

    var w = dw*r,
        h = dh*r;
    return [w,h];
}
function EXACTFIT(dw,dh,cw,ch,mw,mh,mxw,mxh){
    var w,h;
    if(mw && cw < mw){
        w = mw;
    }else if(mxw && cw > mxw){
        w = mxw;
    }else{
        w = cw;
    }
    if(mh && ch < mh){
        h = mh;
    }else if(mxh && ch > mxh){
        h = mxh;
    }else{
        h = ch;
    }
    return [w,h];
}

/**
 * 纹理重复类型——REPEAT
 * @property BG_REPEAT
 * @final
 * @static
 * @for soya2d
 */
soya2d.BG_REPEAT = 'repeat';
/**
 * 纹理重复类型——NOREPEAT
 * @property BG_NOREPEAT
 * @final
 * @static
 * @for soya2d
 */
soya2d.BG_NOREPEAT = 'no-repeat';
/**
 * 纹理重复类型——REPEAT_X
 * @property BG_REPEAT_X
 * @final
 * @static
 * @for soya2d
 */
soya2d.BG_REPEAT_X = 'repeat-x';
/**
 * 纹理重复类型——REPEAT_Y
 * @property BG_REPEAT_Y
 * @final
 * @static
 * @for soya2d
 */
soya2d.BG_REPEAT_Y = 'repeat-y';
/**
 * World是逻辑上所有显示对象的容器，并为这些对象提供物理环境。
 * world是stage下的直接子节点，所以并不会受到{{#crossLink "Camera"}}{{/crossLink}}的影响，
 * 而world中的显示对象都会受到{{#crossLink "Camera"}}{{/crossLink}}的影响。
 * 这样就可以实现镜头跟踪，相对移动等效果。<br>
 * 每个game实例只有唯一的world对象
 * 
 * @class World
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 */
var World = soya2d.class("",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function() {
    	this.__soya_type = 'world';
    },
    /**
     * 设置世界范围
     * @method setBounds
     * @param {Number} w 宽度
     * @param {Number} h 高度
     */
    setBounds:function(w,h){
    	this.bounds.w = w;
    	this.bounds.h = h;
    	this.w = w;
    	this.h = h;
    }
});

/**
 * 空绘图类，需要实现onRender回调。如果需要创建一种自定义绘图逻辑的显示对象，
 * 该类可以实现这个功能
 * @class soya2d.Shape
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 */
soya2d.class("soya2d.Shape",{
	extends:soya2d.DisplayObjectContainer
});
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
     * @return this
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
	 * @return this
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
	 * @return this
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
 * 精灵类。用于显示.9贴图、静态贴图以及贴图动画，精灵中包含了多个图像帧，可以通过创建
 * 多个{{#crossLink "Animation"}}{{/crossLink}}来实现精灵不同动画效果的表现和改变
 * 
 * @class soya2d.Sprite
 * @extends soya2d.DisplayObjectContainer
 * @constructor
 * @param {Object} data 所有父类参数，以及新增参数，参数如下：
 * @param {String | HTMLImageElement | Array<String> | Array<HTMLImageElement>} images 图像加载时的key/key数组/图形对象/图形对象数组
 * @param {int} [data.w] 精灵的宽度,默认纹理宽度
 * @param {int} [data.h] 精灵的高度,默认纹理高度
 */
soya2d.class("soya2d.Sprite",{
	extends:soya2d.DisplayObjectContainer,
	constructor:function(data){

	    var images = data.images;
	    if(!images)return;

	     /**
	     * 动画管理器
	     * @type {AnimationManager}
	     */
	    this.animations = null;

	    this.setImages(images);
	    
	    this.w = data.w || this.images[0].width;
	    this.h = data.h || this.images[0].height;

	    /**
	     * 当前帧序号
	     * @type {Number}
	     * @default 0
	     */
	    this.frameIndex = data.frameIndex || 0;//当前帧号
	    /**
	     * 对图片进行九宫格缩放
	     * @type {soya2d.Rectangle}
	     */
	    this.__scale9grid = data.scale9grid;
	    if(this.__scale9grid && (this.__w != this.images[0].width || this.__h != this.images[0].height)){
	    	this.__parseScale9();
	    }
	    Object.defineProperties(this,{
	    	scale9grid:{
	    		set:function(v){
	    			if(!(v instanceof soya2d.Rectangle))return;
	    			this.__scale9grid = v;
	    			this.__anchorChange = true;
	    			this.__parseScale9();
	    		},
	    		get:function(){
                    return this.__scale9grid;
                },
                enumerable:true
	    	}
	    });
	},
	/**
	 * 复制精灵
	 * @method clone
	 * @param  {Boolean} isRecur 是否递归复制
	 * @return {soya2d.Sprite}  
	 */
	clone:function(isRecur){
		var copy = new this.constructor({
			images:this.images.concat()
		});
		return soya2d.DisplayObject.prototype.clone.call(this,isRecur,copy);
	},
	_onUpdate:function(){
		if(this.__anchorChange && 
			this.__scale9grid instanceof soya2d.Rectangle && 
			(this.__w != this.images[0].width || this.__h != this.images[0].height)){
			this.cache();
		}
	},
	__parseScale9:function(){
		var imgW = this.images[0].width;
		var imgH = this.images[0].height;
		var by = this.__scale9grid.y + this.__scale9grid.h;
		var bh = imgH - by;
		var rx = this.__scale9grid.x + this.__scale9grid.w;
		var rw = imgW - rx;

		var dmw = this.__w - this.__scale9grid.x - rw;
		var dmh = this.__h - this.__scale9grid.y - bh;
		var dmx = dmw + this.__scale9grid.x;
		var dmy = dmh + this.__scale9grid.y;

		var x = this.__scale9grid.x,
			y = this.__scale9grid.y,
			w = this.__scale9grid.w,
			h = this.__scale9grid.h;
		this.__scale9Data = {
			t1:{
				x:0,
				y:0,
				w:x,
				h:y
			},
			t2:{
				x:x,
				y:0,
				w:w,
				h:y,
				dw:dmw
			},
			t3:{
				x:rx,
				y:0,
				w:rw,
				h:y,
				dx:dmx
			},
			m1:{
				x:0,
				y:y,
				w:x,
				h:h,
				dh:dmh
			},
			m2:{
				x:x,
				y:y,
				w:w,
				h:h,
				dw:dmw,
				dh:dmh
			},
			m3:{
				x:rx,
				y:y,
				w:rw,
				h:h,
				dx:dmx,
				dh:dmh
			},
			b1:{
				x:0,
				y:by,
				w:x,
				h:bh,
				dy:dmy
			},
			b2:{
				x:x,
				y:by,
				w:w,
				h:bh,
				dw:dmw,
				dy:dmy
			},
			b3:{
				x:rx,
				y:by,
				w:rw,
				h:bh,
				dx:dmx,
				dy:dmy
			}
		}
	},
    onRender:function(g){
    	if(this.animations.playingK){
    		var ani = this.animations.animation;
    		if(!ani.lastUpdateTime)ani.lastUpdateTime = new Date().getTime();
            var now = new Date().getTime();
            var delta = now - ani.lastUpdateTime;
            //处理跳帧情况
            var deltaFrames = delta/(ani.frameRate*16.7)>>0;
            
            //差值大于帧率，切换帧
            if(deltaFrames>0){
                ani.index += deltaFrames;
                if(ani.index >= ani.frames.length){
                    if(ani.loop){
                        ani.index = 0;
                    }else{
                    	var k = this.animations.playingK;
                        this.animations.stop();
                        this.animations.emit('stop',k);
                        return;
                    }
                }

                ani.lastUpdateTime = now;
            }
	        
	  	    var frame = ani.frames[ani.index];
			g.map(this.images[frame],0,0,this.w,this.h);
    	}else if(this.__scale9grid && this.__updateCache){
    		var img = this.images[0];
    		var sd = this.__scale9Data;
    		var t1 = sd.t1,t2 = sd.t2,t3 = sd.t3,
    			m1 = sd.m1,m2 = sd.m2,m3 = sd.m3,
    			b1 = sd.b1,b2 = sd.b2,b3 = sd.b3;

    		//top
    		g.map(img,t1.x,t1.y,t1.w,t1.h,t1.x,t1.y,t1.w,t1.h);
    		g.map(img,t2.x,t2.y,t2.dw,t2.h,t2.x,t2.y,t2.w,t2.h);
    		g.map(img,t3.dx,t3.y,t3.w,t3.h,t3.x,t3.y,t3.w,t3.h);
    		//middle
    		g.map(img,m1.x,m1.y,m1.w,m1.dh,m1.x,m1.y,m1.w,m1.h);
    		g.map(img,m2.x,m2.y,m2.dw,m2.dh,m2.x,m2.y,m2.w,m2.h);
    		g.map(img,m3.dx,m3.y,m3.w,m3.dh,m3.x,m3.y,m3.w,m3.h);
    		//bottom
    		g.map(img,b1.x,b1.dy,b1.w,b1.h,b1.x,b1.y,b1.w,b1.h);
    		g.map(img,b2.x,b2.dy,b2.dw,b2.h,b2.x,b2.y,b2.w,b2.h);
    		g.map(img,b3.dx,b3.dy,b3.w,b3.h,b3.x,b3.y,b3.w,b3.h);

    	}else{
    		g.map(this.images[this.frameIndex],0,0,this.w,this.h);
    	}
    },
    /**
	 * 设置当前帧数+1
	 * @method nextFrame
	 */
	nextFrame:function(){
		this.frameIndex++;
		if(this.frameIndex >= this.images.length){
			if(this.loop){
				this.frameIndex = 0;
			}else{
				this.frameIndex = this.images.length-1;
			}
		}
	},
	/**
	 * 设置当前帧数-1
	 * @method prevFrame
	 */
	prevFrame:function(){
		this.frameIndex--;
		if(this.frameIndex < 0){
			if(this.loop){
				this.frameIndex = this.images.length-1;
			}else{
				this.frameIndex = 0;
			}
		}
	},
	/**
	 * 设置或者更改精灵纹理
	 * @method setImages
	 * @param {String | HTMLImageElement | Array<String> | Array<HTMLImageElement>} images 图像加载时的key/key数组/图形对象/图形对象数组
	 * @param {Boolean} [changeSize] 同步修改精灵的w/h
	 */
	setImages:function(images,changeSize){
		if(typeof images === 'string'){
	    	this.images = [this.game.assets.image(images)];
	    }else if(images instanceof self.Image || (images.getContext && images.nodeType == 1)){
	    	this.images = [images];
	    }else if(images instanceof Array){
	    	var imgs = [];
	    	images.forEach(function(img){
	    		if(typeof img === 'string'){
	    			imgs.push(this.game.assets.image(img));
	    		}else{
	    			imgs.push(img);
	    		}
	    	},this);
	    	this.images = imgs;
	    }else{
	    	this.images = [];
	    }

	    if(!this.images[0]){
	    	soya2d.console.error('soya2d.Sprite: invalid param [images]; '+this.images[0]);
	    }
	    this.frameIndex = 0;

	    if(changeSize){
	    	this.w = this.images[0].width;
	    	this.h = this.images[0].height;
	    }

	    if(this.animations)
	    	this.animations.destroy();
	    this.animations = new AnimationManager(this,this.images.length);

	    return this;
	}
});
/**
 * 瓦片精灵，可以让该精灵内部平铺指定的纹理<br/>
 * @class soya2d.TileSprite
 * @extends soya2d.DisplayObjectContainer
 *
 * @constructor
 * @param {Object} data 所有父类参数，以及新增参数，如下：
 * @param {soya2d.Sprite | HTMLImageElement | String} data.sprite 瓦片精灵，必须
 * @param {boolean} [data.autoScroll=false] 自动移动瓦片
 * @param {int} data.speed 移动速度,默认1。单位px
 * @param {int} data.scrollAngle 移动角度,默认0
 */
soya2d.class("soya2d.TileSprite",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data) {
        /**
         * 瓦片精灵，可以设置该属性的缩放等特性
         * @type {soya2d.Sprite}
         */
        this.sprite = null;
        
        if(data.sprite instanceof soya2d.Sprite){
            this.sprite = data.sprite;
        }else{
            this.sprite = new soya2d.Sprite({images:data.sprite});
        } 
        
        //同步为纹理size
        this.w = data.w || this.sprite.w;
        this.h = data.h || this.sprite.h;

        /**
         * 是否自动滚动瓦片
         * @type {Boolean}
         * @default false
         */
        this.autoScroll = data.autoScroll||false;
        /**
         * 移动瓦片的速度
         * @type {Number}
         * @default 1
         */
        this.speed = data.speed||1;
        /**
         * 瓦片移动的角度
         * @type {int}
         * @default 0
         */
        this.scrollAngle = data.scrollAngle||0;
        
        //用于内部移动处理
        this.__tileOffx = 0;
        this.__tileOffy = 0;
    },
	/**
     * 滚动tile中的纹理。
     * 滚动速度和方向依赖实例对应参数
     * @method scroll
     * @param {Number} x 横向偏移
     * @param {Number} y 纵向偏移
     */
    scroll:function(x,y){
        if(x || y){
            this.__tileOffx += x||0;
            this.__tileOffy += y||0;
        }else{
            var angle = (this.scrollAngle>>0)%360;
            this.__tileOffx += soya2d.Math.COSTABLE[angle]*this.speed;
            this.__tileOffy += soya2d.Math.SINTABLE[angle]*this.speed;
        }
    },
    /**
     * 复制精灵
     * @method clone
     * @param  {Boolean} isRecur 是否递归复制
     * @return {soya2d.TileSprite} 
     */
    clone: function(isRecur) {
        var copy = new this.constructor({
            sprite: this.sprite
        });
        soya2d.DisplayObject.prototype.clone.call(this,isRecur,copy);
        return copy;
    },
    _onUpdate:function(){
        if(this.autoScroll){
            var angle = (this.scrollAngle>>0)%360;
            
            this.__tileOffx += soya2d.Math.COSTABLE[angle]*this.speed;
            this.__tileOffy += soya2d.Math.SINTABLE[angle]*this.speed;
        }
    },
    onRender: function(g) {
        //裁减可渲染区域
        g.beginPath();
        g.push();
        g.rect(0, 0, this.w, this.h);
        g.clip();

        //计算行列数
        var img = this.sprite;
        var texW = img.w,
            texH = img.h;
        var texScaledW = texW * img.scaleX,
            texScaledH = texH * img.scaleY;
        //check
        texScaledW = texScaledW<0?texScaledW*-1:texScaledW;
        texScaledH = texScaledH<0?texScaledH*-1:texScaledH;
        
        var colNum = (this.w/texScaledW>>0)+2,
            rowNum = (this.h/texScaledH>>0)+2;

        var offsetX = (this.__tileOffx % texScaledW),
            offsetY = (this.__tileOffy % texScaledH);
        if (this.__tileOffx > 0) {
            offsetX -= texScaledW;
        }
        if (this.__tileOffy > 0) {
            offsetY -= texScaledH;
        }

        var tex = this.sprite.images[0];

        for (var i = rowNum;i--;) {
            for (var j = colNum;j--;) {
                
                var x = j * texScaledW;
                var y = i * texScaledH;

                g.map(tex,
                    x + offsetX, y + offsetY, texScaledW, texScaledH,
                    0, 0, texW, texH);
            }
        }

        g.pop();
    }
});
/**
 * 图形类,提供了贴图和矢量绘制的接口。<br/>
 * 注意，该类不应被实例化。引擎会在onRender回调中注入该类的实例。<br/>
 * 该图形对象基于Canvas构建。
 * 
 * @class soya2d.CanvasGraphics
 * @constructor
 * @param ctx CanvasRenderingContext2D的实例
 * @module renderer
 */
soya2d.CanvasGraphics = function(ctx){
    /**
     * 一个对当前绘图对象的引用
     * @property ctx
     * @type {CanvasRenderingContext2D}
     */
	this.ctx = ctx;

    /**
     * 设置或者获取当前绘图环境的渲染透明度
     * @method opacity
     * @param {Number} op 0.0 - 1.0
     * @return {this|Number}
     */
    this.opacity = function(op){
        if(op===0 || op){
            this.ctx.globalAlpha = op;
            return this;
        }else{
            return this.ctx.globalAlpha;
        }
    };

    /**
     * 闭合当前路径
     * @method closePath
     * @return this
     */
    this.closePath = function(){
        this.ctx.closePath();
        return this;
    };
    /**
     * 移动当前画笔
     * @method moveTo
     * @param {Number} x
     * @param {Number} y
     * @return this
     */
    this.moveTo = function(x,y){
        this.ctx.moveTo(x,y);
        return this;
    };
    /**
     * 向当前path中添加直线subpath<br/>
     * 线条起点为path绘制前画笔坐标，终点为x,y
     * @method lineTo
     * @param {Number} x
     * @param {Number} y
     * @return this
     */
    this.lineTo = function(x,y){
        this.ctx.lineTo(x,y);
        return this;
    };
    /**
     * 向当前path中添加2次曲线subpath<br/>
     * 线条起点为path绘制前画笔坐标，终点为x,y
     * @method quadraticCurveTo
     * @param {Number} cpx 控制点
     * @param {Number} cpy 控制点
     * @param {Number} x
     * @param {Number} y
     * @return this
     */
    this.quadraticCurveTo = function(cpx,cpy,x,y){
        this.ctx.quadraticCurveTo(cpx,cpy,x,y);
        return this;
    };
    /**
     * 向当前path中添加贝塞尔曲线subpath<br/>
     * 线条起点为path绘制前画笔坐标，终点为x,y
     * @method bezierCurveTo
     * @param {Number} cp1x 控制点1
     * @param {Number} cp1y 控制点1
     * @param {Number} cp2x 控制点2
     * @param {Number} cp2y 控制点2
     * @param {Number} x
     * @param {Number} y
     * @return this
     */
    this.bezierCurveTo = function(cp1x,cp1y,cp2x,cp2y,x,y){
        this.ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);
        return this;
    };
    /**
     * 向当前path中添加使用控制点和半径定义的弧型subpath<br/>
     * @method arcTo
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     * @param {Number} radius
     * @return this
     */
    this.arcTo = function(x1,y1,x2,y2,radius){
        this.ctx.arcTo(x1,y1,x2,y2,radius);
        return this;
    };
    /**
     * 向当前path中添加圆弧形subpath
     * @method arc
     * @param {Number} cx 圆心
     * @param {Number} cy 圆心
     * @param {Number} r 半径
     * @param {Number} [sr=0] 起始弧度
     * @param {Number} [er=soya2d.Math.PIM2] 结束弧度
     * @return this
     */
    this.arc = function(cx,cy,r,sr,er){
        this.ctx.arc(cx,cy,r,sr||0,er||soya2d.Math.PIM2);
        return this;
    };
    /**
     * 向当前path中添加椭圆弧形subpath
     * @method eArc
     * @param {Number} cx 圆心
     * @param {Number} cy 圆心
     * @param {Number} a 长半径
     * @param {Number} b 短半径
     * @param {int} [sa=0] 起始角度
     * @param {int} [ea=360] 结束角度
     * @return this
     */
    this.eArc = function(cx,cy,a,b,sa,ea){
        sa = (sa || 0)>>0;
        ea = (ea || 360)>>0;
        var m = soya2d.Math;
        var x = cx+a*m.COSTABLE[sa];
        var y = cy+b*m.SINTABLE[sa];
        ctx.moveTo(x,y);
        var len = 0;
        if(ea < sa){
            len = 360-sa+ea;
        }else{
            len = ea - sa;
        }
        for(var i=1;i<=len;i++){
            var angle = (sa+i)%360;
            x = cx+a*m.COSTABLE[angle];
            y = cy+b*m.SINTABLE[angle];
            ctx.lineTo(x,y);
        }
        return this;
    };
    /**
     * 向当前path中添加矩形subpath
     * @method rect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @return this
     */
    this.rect = function(x,y,w,h){
        this.ctx.rect(x,y,w,h);
        return this;
    };
    /**
     * 向当前path中添加多边形subpath，边的数量由顶点数决定
     * @method polygon
     * @param {Array} vtx 一维顶点数组,坐标为相对中心点。<br/>
     * 比如绘制[0,0]点为重心的正三角形:<br/>
     * ```
     * [0,-5,//top point<br/>
     * -5,x,//left point<br/>
     * 5,y]
     * ```
     * 
     * @return this
     */
    this.polygon = function(vtx){
        var c = this.ctx;
        var l = vtx.length - 1;

        c.moveTo(vtx[0],vtx[1]);
        for(var i=2;i<l;i+=2){
            c.lineTo(vtx[i],vtx[i+1]);
        }
        return this;
    };
    /**
     * 向当前path中添加椭圆形subpath
     * @method ellipse
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @return this
     */
    this.ellipse = function(x,y,w,h){
        var kappa = 0.5522848;
        var ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle
        var c = this.ctx;
        c.moveTo(x, ym);
        c.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        c.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        c.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        c.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        return this;
    };
    /**
     * 向当前path中添加圆角矩形subpath
     * @method roundRect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @param {Number} r 圆角半径
     * @return this
     */
    this.roundRect = function(x,y,w,h,r){
        var c = this.ctx;
        c.moveTo(x+r,y);
        c.lineTo(x+(w-(r<<1)),y);
        c.arc(x+w-r,y+r,r,Math.PI*3/2,0);
        c.lineTo(x+w,y+h-r);
        c.arc(x+w-r,y+h-r,r,0,soya2d.Math.PID2);
        c.lineTo(x+r,y+h);
        c.arc(x+r,y+h-r,r,soya2d.Math.PID2,Math.PI);
        c.lineTo(x,y+r);
        c.arc(x+r,y+r,r,Math.PI,Math.PI*3/2);
        return this;
    };
    /**
     * 向当前path中添加正多边形subpath
     * @method regularPolygon
     * @param {Number} cx 多边形重心
     * @param {Number} cy 多边形重心
     * @param {Number} ec 多边形的边数，不能小于3
     * @param {Number} r1 半径1
     * @param {Number} r2 半径2
     * @return this
     */
    this.regularPolygon = function(cx,cy,ec,r1,r2){
        cx = cx||0;
        cy = cy||0;
        ec = ec<3?3:ec;
        var M = soya2d.Math;
        var vtx = [];
        var step = 360/ec;
        for(var i=0,j=0;i<360;i+=step,j++){
            var tr = r1;
            if(r2){
                if(j%2!==0)tr=r1;
                else{tr=r2};
            }

            if(!M.COSTABLE[i]){
                vtx.push(cx+tr*M.COSTABLE[Math.round(i)],cy+tr*M.SINTABLE[Math.round(i)]);
            }else{
                vtx.push(cx+tr*M.COSTABLE[i],cy+tr*M.SINTABLE[i]);
            }
        }
        this.polygon(vtx);
        return this;
    };

    /**
     * 设置或者获取当前绘图环境的图元混合模式
     * @method blendMode
     * @param {String} blendMode 混合方式
     * @default soya2d.BLEND_NORMAL
     * @see soya2d.BLEND_NORMAL
     * @return this
     */
    this.blendMode = function(blendMode){
        if(blendMode){
            this.ctx.globalCompositeOperation = blendMode;
            return this;
        }else{
            return this.ctx.globalCompositeOperation;
        }
    };
    /**
     * 设置或者获取当前绘图环境的线框样式
     * @method strokeStyle
     * @param {Object} style 可以是命名颜色、RGB、16进制等标准颜色。也可以是CanvasGradient或者CanvasPattern
     * @return this
     */
    this.strokeStyle = function(style){
        if(style){
            this.ctx.strokeStyle = style;
            return this;
        }else{
            return this.ctx.strokeStyle;
        }
    };
    /**
     * 设置或者获取当前绘图环境的填充样式
     * @method fillStyle
     * @param {Object} style 可以是命名颜色、RGB、16进制等标准颜色。也可以是CanvasGradient或者CanvasPattern
     * @return this
     */
    this.fillStyle = function(style){
        if(style){
            this.ctx.fillStyle = style;
            return this;
        }else{
            return this.ctx.fillStyle;
        }
    };

    /**
     * 设置当前绘图环境的阴影样式
     * @method shadow
     * @param {Number} blur 模糊度
     * @param {String} [color=rgba(0,0,0,0)] 颜色
     * @param {Number} [offx=0] x偏移
     * @param {Number} [offy=0] y偏移
     * @return this
     */
    this.shadow = function(blur,color,offx,offy){
        this.ctx.shadowBlur = blur;
        this.ctx.shadowColor = color;
        this.ctx.shadowOffsetX = offx;
        this.ctx.shadowOffsetY = offy;
        return this;
    };

    /**
     * 设置当前绘图环境的线条样式
     * @method lineStyle
     * @param {Number} width 宽度
     * @param {String} cap 线条末端样式
     * @param {String} join 线条交点样式
     * @param {Number} miterLimit 交点延长限制。join为PeaJS.LINEJOIN_MITER时生效
     * @return this
     * @see soya2d.LINEJOIN_MITER
     */
    this.lineStyle = function(width,cap,join,miterLimit){
        var c = this.ctx;
        c.lineWidth = width;
        c.lineCap = cap || c.lineCap;
        c.lineJoin = join || c.lineJoin;
        c.miterLimit = miterLimit || c.miterLimit;
        return this;
    };

    /**
     * 设置当前绘图环境的字体样式
     * @method font
     * @param {soya2d.Font} font
     * @return this
     */
    this.font = function(font){
        var c = this.ctx;
        c.font = font.getDesc();
        return this;
    };

    /**
     * 裁剪路径
     * @method clip
     * @return this
     */
	this.clip = function(){
        this.ctx.clip();
        return this;
	};
    /**
     * 保存当前绘图状态
     * @method push
     * @return this
     */
	this.push = function(){
		this.ctx.save();	
		return this;
	};
    /**
     * 恢复最近一次push的绘图状态
     * @method pop
     * @return this
     */
	this.pop = function(){
		this.ctx.restore();	
		return this;
	};
    /**
     * 清空当前path中的所有subpath
     * @method beginPath
     * @return this
     */
	this.beginPath = function(){
		this.ctx.beginPath();	
		return this;
	};
    /**
     * 关闭当前path
     * @method closePath
     * @return this
     */
    this.closePath = function(){
        this.ctx.closePath();
        return this;
    };

    /**
     * 填充path
     * @method fill
     * @return this
     */
    this.fill = function(){
        this.ctx.fill();
        return this;
    };
    /**
     * 描绘path的轮廓
     * @method stroke
     * @return this
     */
    this.stroke = function(){
        this.ctx.stroke();
        return this;
    };

    /**
     * 向当前path中添加指定的subpath
     * 
     * @param {soya2d.Path} path 路径结构
     * @method path
     * @return this
     */
    this.path = function(path){
        path._insQ.forEach(function(ins){
            var type = ins[0].toLowerCase();
            switch(type){
                case 'm':this.ctx.moveTo(ins[1][0],ins[1][1]);break;
                case 'l':
                    var xys = ins[1];
                    if(xys.length>2){
                        for(var i=0;i<xys.length;i+=2){
                            this.ctx.lineTo(xys[i],xys[i+1]);
                        }
                    }else{
                        this.ctx.lineTo(xys[0],xys[1]);
                    }
                    break;
                case 'c':
                    var xys = ins[1];
                    if(xys.length>6){
                        for(var i=0;i<xys.length;i+=6){
                            this.ctx.bezierCurveTo((xys[i]),(xys[i+1]),(xys[i+2]),
                                                (xys[i+3]),(xys[i+4]),(xys[i+5]));
                        }
                    }else{
                        this.ctx.bezierCurveTo(xys[0],xys[1],xys[2],xys[3],xys[4],xys[5]);
                    }
                    break;
                case 'q':
                    var xys = ins[1];
                    if(xys.length>4){
                        for(var i=0;i<xys.length;i+=4){
                            this.ctx.quadraticCurveTo((xys[i]),(xys[i+1]),(xys[i+2]),
                                                (xys[i+3]));
                        }
                    }else{
                        this.ctx.quadraticCurveTo(xys[0],xys[1],xys[2],xys[3]);
                    }
                    break;
                case 'z':this.ctx.closePath();break;
            }
        },this);
    }

    /**
     * 以x,y为左上角填充一个宽w高h的矩形
     * @method fillRect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @return this
     */
	this.fillRect = function(x,y,w,h){
		this.ctx.fillRect(x,y,w,h);
		return this;
	};
    /**
     * 以x,y为左上角描绘一个宽w高h的矩形
     * @method strokeRect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @return this
     */
	this.strokeRect = function(x,y,w,h){
		this.ctx.strokeRect(x,y,w,h);
		return this;
	};
    /**
     * 以x,y为左上角清空一个宽w高h的矩形区域<br/>
     * 清空颜色为rgba(0,0,0,0);
     * @method clearRect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @return this
     */
    this.clearRect = function(x,y,w,h){
        this.ctx.clearRect(x,y,w,h);
        return this;
    };
	/**
     * 
     * 贴图接口
     * @method map
     * @param {HTMLImageElement} tex 需要绘制的纹理
     * @param  {int} [sx]  纹理起始坐标x
     * @param  {int} [sy]  纹理起始坐标y
     * @param  {int} [sw]  纹理起始尺寸w
     * @param  {int} [sh]  纹理起始尺寸h
     * @param  {int} [dx]  纹理目标坐标x
     * @param  {int} [dy]  纹理目标坐标y
     * @param  {int} [dw]  纹理目标尺寸w
     * @param  {int} [dh]  纹理目标尺寸h
     * @return this
     */
	this.map = function(img,dx,dy,dw,dh,sx,sy,sw,sh){
		sx = sx || 0;
        sy = sy || 0;
        sw = sw || img.width;
        sh = sh || img.height;

        if(sw===0 || sh===0 || dw===0 || dh===0){
            return;
        }

		this.ctx.drawImage(img,
                            sx>>0,sy>>0,sw>>0,sh>>0,
                            dx>>0,dy>>0,dw>>0,dh>>0);
		return this;
	};
    /**
     * 填充文字
     * @method fillText
     * @param {String} str 需要绘制的文字
     * @param {int} [x=0] x坐标，相对于当前精灵的x
     * @param {int} [y=0] y坐标，相对于当前精灵的y
     * @param {int} [mw] 绘制文字最大宽度
     * @return this
     */
    this.fillText = function(str,x,y,mw){
        if(mw)
            this.ctx.fillText(str, x||0, y||0 ,mw );
        else{
            this.ctx.fillText(str, x||0, y||0 );
        }
        return this;
    };
    /**
     * 描绘文字
     * @method strokeText
     * @param {String} str 需要绘制的文字
     * @param {int} [x=0] x坐标，相对于当前精灵的x
     * @param {int} [y=0] y坐标，相对于当前精灵的y
     * @param {int} [mw] 绘制文字最大宽度
     * @return this
     */
    this.strokeText = function(str,x,y,mw){
        if(mw)
            this.ctx.strokeText(str, x||0, y||0 ,mw );
        else{
            this.ctx.strokeText(str, x||0, y||0 )
        }
        return this;
    };
};

/**
 * 渲染器是引擎提供可视化内容展示的底层基础。
 * 不同的渲染器构建在不同的技术之上比如CSS/WEBGL/CANVAS/SVG等等。<br/>
 * 每个渲染器都和一个soya2d.Game实例绑定，一个应用有且只有一个渲染器。
 * 如果要实现多层渲染，那么你需要创建多个soya2d.Game实例。<br/>
 * 该类不应被显示实例化，引擎会自动创建<br/>
 * 注意，该渲染器基于Canvas构建
 * @param {Object} data 构造参数对象
 * @param {DOMElement} data.container 渲染容器，渲染器会在该容器范围内进行渲染
 * 容器可以是一个块级元素比如div。
 * @param {Boolean} [data.autoClear=true] 是否自动清除图层，如果不清除，则渲染效果会叠加
 * @param {Boolean} [data.sortEnable=false] 是否开启自动排序。如果开启渲染器会在渲染前对所有DO进行Z轴排序
 * @param {Boolean} [data.smoothEnable=true] 是否启用对图像边缘的平滑处理
 * @param {Boolean} [data.crispEnable=false] 是否启用图像非平滑渲染
 * @class soya2d.CanvasRenderer
 * @module renderer
 */
soya2d.CanvasRenderer = function(data){
    data = data||{};
    /**
     * 渲染容器，其中会内置canvas
     * @type element
     * @private
     */
    var container = data.container;
    /**
     * 世界宽度，通常为可视窗口宽度
     * @property w
     * @type {Number}
     * @default 960
     */
    this.w = data.w||(container?container.clientWidth:0);
    /**
     * 世界高度，通常为可视窗口高度
     * @property h
     * @type {Number}
     * @default 480
     */
    this.h = data.h||(container?container.clientHeight:0);
    /**
     * 是否自动清除图层，如果不清除，则渲染效果会叠加
     * @property autoClear
     * @type {Boolean}
     * @default true
     */
    this.autoClear = data.autoClear===undefined?true:data.autoClear;
    /**
     * 是否开启自动排序。如果开启渲染器会在渲染前对所有DO进行Z轴排序
     * @property sortEnable
     * @type {Boolean}
     * @default false
     */
    this.sortEnable = data.sortEnable || false;

    var smoothEnable = data.smoothEnable===false?false:data.smoothEnable||true;
    var crispEnable = data.crispEnable || false;


    var cvs = document.createElement('canvas');cvs.style.position = 'absolute';
    var display = window.getComputedStyle(data.container, null)['position'];
    if(display !== 'absolute' && display !== 'relative')container.style['position'] = 'relative';
    display = null;
    container.appendChild(cvs);
    container = null;

    var ctx = cvs.getContext('2d');
    var g = new soya2d.CanvasGraphics(ctx);
    
    cvs.width =  this.w;
	cvs.height = this.h;
	//当前渲染器的绘制上下文
    this.ctx = ctx;

	//init canvas
    ctx.textBaseline = soya2d.TEXTVALIGN_TOP;//默认字体对齐样式

    var renderStyle = {opacity:1,blendMode:'source-over'};

    /**
     * 获取渲染器绑定的canvas
     * @method getCanvas
     * @return {HTMLCanvasElement} 
     */
    this.getCanvas = function(){
        return cvs;
    }

    /**
     * 渲染方法。每调用一次，只进行一次渲染
     * @method render
     */
    this.render = function(stage,camera){
        if(!stage instanceof Stage)return;

        //render
        ctx.setTransform(1,0,0,1,0,0);
        if(this.autoClear){
            ctx.clearRect(0,0,this.w,this.h);
        }

        var rect = camera.__view;

        render(rect,ctx,stage,g,this.sortEnable,renderStyle);
    };

    var ctxFnMap = {
        stroke:ctx.stroke,
        fill:ctx.fill,
        fillRect:ctx.fillRect,
        strokeRect:ctx.strokeRect,
        drawImage:ctx.drawImage,
        fillText:ctx.fillText,
        strokeText:ctx.strokeText,
        beginPath:ctx.beginPath,
        closePath:ctx.closePath
    };
    function invalidCtx(ctx) {
        ctx.stroke = function() {};
        ctx.fill = function() {};
        ctx.fillRect = function(x, y, w, h) {
            ctx.rect(x, y, w, h);
        };
        ctx.strokeRect = function(x, y, w, h) {
            ctx.rect(x, y, w, h);
        };
        ctx.drawImage = function(img,sx,sy,sw,sh,dx,dy,dw,dh){
            if(arguments.length===3){
                ctx.rect(sx,sy,img.width,img.height);
            }else if(arguments.length===5){
                ctx.rect(sx,sy,sw,sh);
            }else if(arguments.length===9){
                ctx.rect(dx,dy,dw,dh);
            } 
        };
        ctx.fillText = function(){};
        ctx.strokeText = function(){};
        ctx.beginPath = function(){};
        ctx.closePath = function(){};
    }
    function validCtx(ctx) {
        ctx.stroke = ctxFnMap.stroke;
        ctx.fill = ctxFnMap.fill;
        ctx.fillRect = ctxFnMap.fillRect;
        ctx.strokeRect = ctxFnMap.strokeRect;
        ctx.drawImage = ctxFnMap.drawImage;
        ctx.fillText = ctxFnMap.fillText;
        ctx.strokeText = ctxFnMap.strokeText;
        ctx.beginPath = ctxFnMap.beginPath;
        ctx.closePath = ctxFnMap.closePath;
    }
    function renderMask(ctx,mask){
        if(mask.onRender){
            var te = mask.__worldTransform.e;
            var wp = mask.worldPosition;
            ctx.setTransform(te[0],te[1],te[2],te[3],wp.x,wp.y);

            //css style
            var ap = mask.anchorPosition;
            ctx.translate(-ap.x, -ap.y);
            mask.onRender(g);
        }//over onRender
        //渲染子节点
        if(mask.children && mask.children.length>0){
            var children = mask.children;

            for(var i=0;i<children.length;i++){
                renderMask(ctx,children[i]);
            }
        }
    }
    function render(cameraRect,ctx,ro,g,sortEnable,rs,inWorld){
        if(ro.opacity===0 
        || !ro.visible
        || ro.__masker)return;

        if(!ro.__renderable)return;

        if(ro.mask instanceof soya2d.DisplayObject){
            ctx.save();
            ctx.beginPath();
            invalidCtx(ctx);
                renderMask(ctx,ro.mask);
                ctx.clip();
            validCtx(ctx);
            ctx.closePath();
        }
        
        if(ro.onRender){
            var te = ro.__worldTransform.e;
            var sp = ro.__screenPosition;
            var ap = ro.anchorPosition;
            if(ro.__updateCache){
                var x = ap.x,
                    y = ap.y;
                ctx.setTransform(1,0,0,1,x,y);
            }else{
                var x = sp.x,
                    y = sp.y;
                
                ctx.setTransform(te[0],te[1],te[2],te[3],x,y);
            }

            //apply alpha
            if(rs && ro.opacity<=1 && ro.opacity!==rs.opacity){
                rs.opacity = ro.opacity;
                ctx.globalAlpha = ro.opacity;
            }
            //apply blendMode
            if(rs && rs.blendMode !== ro.blendMode){
                rs.blendMode = ro.blendMode;
                ctx.globalCompositeOperation = ro.blendMode;
            }

            //css style
            ctx.translate(-ap.x, -ap.y);
            if(ro.imageCache && !ro.__updateCache){
                ctx.drawImage(ro.imageCache,0,0);
            }else{
                ro.onRender(g);
            }

        }//over onRender
        //reset render tag
        ro.__renderable = false;
        //渲染子节点
        if(ro.children && ro.children.length>0 && !ro.__updateCache){
            var children = ro.children;
            //排序
            if(sortEnable)children.sort(function(a,b){
                if(a.z === b.z){
                    return a.__seq - b.__seq;
                }else{
                    return a.z - b.z;
                }
            });

            for(var i=0;i<children.length;i++){
                render(cameraRect,ctx,children[i],g,sortEnable,rs,
                    children[i].__soya_type != 'world' && !(ro instanceof Stage)?true:false);
            }
        }

        //mask
        if(ro.mask instanceof soya2d.DisplayObject){
            ctx.restore();
        }
    }

    /**
     * 渲染显示对象
     * @private
     */
    this.renderDO = render;
    
    /**
     * 缩放所渲染窗口
     * @method resize
     * @param {int} w 宽度
     * @param {int} h 高度
     */
    this.resize = function(w,h){
        var sw = cvs.width,
            sh = cvs.height;
        //计算比率
        this.hr = w / sw,
        this.vr = h / sh;
    	cvs.style.width = w + 'px';
		cvs.style.height = h + 'px';
    }
    
    this.hr=1;//水平缩放比率
    this.vr=1;//垂直缩放比率

    /********************全局图像接口***********************/

    /**
     * 设置或者获取渲染器的平滑选项
     * @method smooth
     * @param {Boolean} enabled 开启/关闭
     * @return this
     */
    this.smooth = function(enabled){
        if(enabled !== undefined){
            ctx.imageSmoothingEnabled = 
            ctx.mozImageSmoothingEnabled = 
            ctx.oImageSmoothingEnabled = 
            ctx.msImageSmoothingEnabled = 
            enabled;

            smoothEnable = enabled;
            return this;
        }else{
            return smoothEnable;
        }
    };
    this.smooth(smoothEnable);

    /**
     * 设置或者获取图像清晰渲染
     * @method crisp
     * @param {Boolean} enabled 开启/关闭
     * @return this
     */
    this.crisp = function(enabled){
        if(enabled){
            cvs.style['image-rendering'] = 'optimizeSpeed';
            cvs.style['image-rendering'] = 'crisp-edges';
            cvs.style['image-rendering'] = '-moz-crisp-edges';
            cvs.style['image-rendering'] = '-webkit-optimize-contrast';
            cvs.style['image-rendering'] = 'optimize-contrast';
            cvs.style['image-rendering'] = 'pixelated';
            cvs.style.msInterpolationMode = 'nearest-neighbor';
        }else{
            cvs.style['image-rendering'] = 'auto';
            cvs.style.msInterpolationMode = 'bicubic';
        }
    };
    this.crisp(crispEnable);

    /**
     * 获取指定范围的图像数据
     * @method getImageData
     * @param {int} x x坐标
     * @param {int} y y坐标
     * @param {int} w 宽度
     * @param {int} h 高度
     * @returns {Array} 指定大小的截图数据数组
     */
    this.getImageData = function(x,y,w,h){
        x = x||0;
        y = y||0;
        w = w||this.w;
        h = h||this.h;

        return ctx.getImageData(x,y,w,h);
    };
    /**
     * 返回当前渲染器的图片数据描述串
     * @method toDataURL
     * @param {String} type 图片类型
     * @default image/png
     * @return {String} URL
     */
    this.toDataURL = function(type){
        return cvs.toDataURL(type||"image/png");
    };

    /**
     * 创建一个图像绘制模式
     * @method createPattern
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} image 图像
     * @param {string} [repetition=soya2d.REPEAT] 重复类型
     * @return pattern
     * @see soya2d.REPEAT
     */
    this.createPattern = function(image,repetition){
        return ctx.createPattern(image,repetition||'repeat');
    };

    /**
     * 创建一个渐变实例，用于填充和线框的绘制
     * @method createGradient
     * @param {Array} ratios 渐变比率数组，有效值为[0.0,1.0]
     * @param {Array} colors 渐变颜色数组，和ratios对应，一个比率对应一个颜色，如果对应不上，默认rgba(0,0,0,0)
     * @param {Number} len 渐变长度；线性渐变为长度，放射渐变为半径
     * @param {Object} opt 可选参数
     * @param {Number} [opt.x=0] 渐变坐标；线性渐变为起点，放射渐变为圆心
     * @param {Number} [opt.y=0] 渐变坐标；线性渐变为起点，放射渐变为圆心
     * @param {Number} [opt.angle=0] 渐变角度；线性渐变为渐变方向，放射渐变为焦点改变方向
     * @param {Number} [opt.type=soya2d.GRADIENTTYPE_LINEAR] 渐变类型
     * @param {Number} [opt.focalRatio=0] 放射渐变焦点偏移比率
     * @param {Number} [opt.focalRadius=0] 焦点半径
     * @see soya2d.GRADIENTTYPE_LINEAR
     */
    this.createGradient = function(ratios,colors,len,opt){
        var angle=0,x=0,y=0,type=soya2d.GRADIENT_LINEAR,focalRatio=0,focalRadius=0;
        if(opt){
            angle = opt.angle||0,
            x=opt.x||0,
            y=opt.y||0,
            type=opt.type||soya2d.GRADIENT_LINEAR,
            focalRatio=opt.focalRatio||0,
            focalRadius=opt.focalRadius||0;
        }

        var g,m=soya2d.Math;
        angle = Math.abs((angle||0)>>0);
        switch(type){
            case soya2d.GRADIENT_LINEAR:
                g = ctx.createLinearGradient(x,y,x+len* m.COSTABLE[angle],y+len* m.SINTABLE[angle]);
                for(var i=0,l=ratios.length;i<l;i++){
                    g.addColorStop(ratios[i],colors[i]||"RGBA(0,0,0,0)");
                }
                break;
            case soya2d.GRADIENT_RADIAL:
                var fl = len*focalRatio;
                g = ctx.createRadialGradient(x,y,focalRadius,x+fl* m.COSTABLE[angle],y+fl* m.SINTABLE[angle],len);
                for(var i=0,l=ratios.length;i<l;i++){
                    g.addColorStop(ratios[i],colors[i]||"RGBA(0,0,0,0)");
                }
                break;
        }
        return g;
    };
};


/**
 * 把一个可渲染对象转换成一个Image对象
 * @method getImageFrom
 * @param {soya2d.DisplayObject} ro 可渲染对象
 * @param {int} [w] image宽度.可选，默认ro尺寸
 * @param {int} [h] image高度.可选，默认ro尺寸
 * @return {Image} 对应图像对象
 */
soya2d.CanvasRenderer.prototype.getImageFrom = function(ro,w,h){
    var tc = document.createElement('canvas');
    //change size
    tc.width = w||ro.w;
    tc.height = h||ro.h;
    //render
    var ctx = tc.getContext('2d');
    var g = new soya2d.CanvasGraphics(ctx);
    
    //render

    var img = new Image();
    img.src = tc.toDataURL("image/png");

    //clear
    g = null;
    tc = null;
    return img;
};
/**
 * 路径描述结构。既可用于支持路径动画的路径检索，也可以用于绘制路径
 * @class soya2d.Path
 */
soya2d.Path = function(d){
    /**
     * 路径指令集。同{@link http://www.w3.org/TR/SVG11/paths.html SVG}，但仅支持绝对坐标，
     * 并限于以下指令：
     * <table border="1">
     *     <tr style="background: #ddd;"><th>段类型</th><th>命令</th><th>参数</th><th>示例</th></tr>
     *     <tr><td>moveto</td><td>M/m</td><td>x y</td><td><code>M 50 50</code> － 将画笔移到 50,50</td></tr>
     *     <tr><td>lineto</td><td>L/l</td><td>(x y)+</td><td><code>L 50 50 100 100</code> － 直线到 50,50再到100,100</td></tr>
     *     <tr><td>quadraticCurveTo</td><td>Q/q</td><td>(cpx cpy x y)+</td><td><code>Q 110 45 90 30</code> - 曲线到 90, 30，控制点位于 110, 45</td></tr>
     *     <tr><td>bezierCurveTo</td><td>C/c</td><td>(cp1x cp1y cp2x cp2y x y)+</td><td><code>C 45 50 20 30 10 20</code> － 曲线到 10, 20，第一个控制点位于 45, 50，第二个控制点位于 20, 30</td></tr>
     *     <tr><td>closepath</td><td>Z/z</td><td>无</td><td>关闭路径</td></tr>
     * </table>
     * @property d
     * @type {String}
     */
    this.d = d || '';

    this.cmd = ['m','l','c','q','z'];

    this._insQ = [];

    this.__parse();
}
soya2d.ext(soya2d.Path.prototype,{
    /**
     * 解析指令
     * @private
     */
    __parse:function(){
        var exp = new RegExp("["+this.cmd.join('')+"]([^"+this.cmd.join('')+"]+|$)",'img');
        var segs = this.d.replace(/^\s+|\s+$/,'').match(exp);

        //过滤有效指令，插入指令队列
        segs.forEach(function(seg){
            seg = seg.replace(/^\s+|\s+$/,'');
            var cmd = seg[0].toLowerCase();
            if(this.cmd.indexOf(cmd) > -1){
                //解析坐标值
                var xys = seg.substr(1).replace(/^\s/mg,'').split(/\n|,|\s/gm);

                this._insQ.push([cmd,xys]);
            }
        },this);
    },
    /**
     * 设置path指令串，并解析
     * @method setPath
     * @param {string} d path指令串
     */
    setPath:function(d){
        this.d = d;
        this.__parse();
    }
});
/**
 * 引擎当前运行所在设备的信息<br/>
 * @class soya2d.Device
 * @static
 * @module system
 */
soya2d.Device = new function(){
  	var userAgent = this.userAgent = self.navigator.userAgent.toLowerCase();

    var isWindows = userAgent.indexOf('windows')>0?true:false;
    var isLinux = userAgent.indexOf('linux')>0?true:false;
    var isMacOS = userAgent.indexOf('mac os')>0?true:false;
    var isAndroid = userAgent.indexOf('android')>0?true:false;
    var isIphone = userAgent.indexOf('iphone')>0?true:false;
    var isIpad = userAgent.indexOf('ipad')>0?true:false;
    var isWphone = userAgent.indexOf('windows phone')>0?true:false;

    //移动端信息
    /**
     * 是否为iphone
     * @property iphone
     * @type {Boolean}
     */
    this.iphone = isIphone;
    /**
     * 是否为ipad
     * @property ipad
     * @type {Boolean}
     */
    this.ipad = isIpad;
    /**
     * 是否为ios
     * @property ios
     * @type {Boolean}
     */
    this.ios = isIphone || isIpad;
    /**
     * 是否为android
     * @property android
     * @type {Boolean}
     */
    this.android = isAndroid;
    /**
     * 是否为wp
     * @property wp
     * @type {Boolean}
     */
    this.wp = isWphone;
    /**
     * 是否移动系统
     * @property mobile
     * @type {Boolean}
     */
    this.mobile = this.ios || isAndroid || isWphone;

    //pc端信息
    /**
     * 是否为windows
     * @property windows
     * @type {Boolean}
     */
    this.windows = isWindows;
    /**
     * 是否为linux
     * @property linux
     * @type {Boolean}
     */
    this.linux = isLinux;
    /**
     * 是否为mac os
     * @property mac
     * @type {Boolean}
     */
    this.mac = isMacOS;

    //浏览器信息
    var type = {
      Firefox:userAgent.indexOf('firefox')+1,
      Opera:userAgent.indexOf('opera')+1,
      Chrome:userAgent.indexOf('chrome')+1,
      Safari:userAgent.indexOf('safari')>-1 && userAgent.indexOf('chrome')<0
    };
    /**
     * 如果当前浏览器为IE，那么值为true。
     * @property ie
     * @type {Boolean}
     */
    this.ie = /msie|trident.*rv:/.test(userAgent.toLowerCase());
    /**
     * 如果当前浏览器为FireFox，那么值为true。
     * @property ff
     * @type {Boolean}
     */
    this.ff = type.Firefox?true:false;
    /**
     * 如果当前浏览器为Opera，那么值为true。
     * @property opera
     * @type {Boolean}
     */
    this.opera = type.Opera?true:false;
    /**
     * 如果当前浏览器为Chrome，那么值为true。
     * @property chrome
     * @type {Boolean}
     */
    this.chrome = type.Chrome?true:false;
    /**
     * 如果当前浏览器为Safari，那么值为true。
     * @property safari
     * @type {Boolean}
     */
    this.safari = type.Safari?true:false;
};
/**
 * 字体类。用于指定绘制字体的样式、大小等
 * @class soya2d.Font
 * @param {String} desc 字体描述字符串，可以为空。为空时创建默认样式字体:[normal 400 13px/normal sans-serif]<br/>符合W3C[CSSFONTS]规范
 * @module text
 */
soya2d.Font = function(desc){
    var fontElement = document.createElement('span');
    fontElement.style.cssText = "position:absolute;top:-9999px;left:-9999px;white-space:nowrap;font:"
                                        +(desc||"normal 400 13px/normal sans-serif");                         
    /**
     * 字体描述字符串
     * @property fontString
     * @type {String}
     */
    this.fontString = fontElement.style.font;

    /**
     * 字体大小
     * @property fontSize
     * @type {int}
     */
    this.fontSize = parseInt(fontElement.style.fontSize) || 13;

    /**
     * 该字体的渲染内容
     * @private
     */
    this.__renderText = function(g){
        g.font(this.font);
        if(!this.__lines)return;

        g.fillStyle(this.fillStyle);
        for(var i= 0,l=this.__lines.length;i<l;i++){
            var text = this.__lines[i];
            if(this.letterSpacing > 0){
                var offx = 0;
                for(var j=0,k=text.length;j<k;j++){
                    g.fillText(text[j],offx,(this.__lh+this.lineSpacing)*i);
                    offx += this.letterSpacing + this.__uw;
                }
            }else{
                g.fillText(text,0,(this.__lh+this.lineSpacing)*i);
            }
        }
    };
                                        
    /**
     * 用当前参数复制一个新的字体对象。<br/>
     * @method clone
     * @return {soya2d.Font} 新的字体对象
     */
    this.clone = function(){
        return new soya2d.Font(this.getDesc());
    };
    /**
     * 返回字体描述的字符串
     * @method getDesc
     * @return {String}
     */
    this.getDesc = function(){
        return fontElement.style.font;
    };
    /**
     * 设置或者获取字体样式
     * @method style
     * @param {String} style 字体样式字符串
     * @return {this|String}
     */
    this.style = function(style){
        if(arguments.length>0){
            fontElement.style.fontStyle = style;
            //更新描述字符串
            this.fontString = fontElement.style.font;
            return this;
        }else{
            return fontElement.style.fontStyle;
        }
    };
    /**
     * 设置或者获取字体粗细
     * @method weight
     * @param {String} weight 字体粗细字符串
     * @return {this|String}
     */
    this.weight = function(weight){
        if(arguments.length>0){
            fontElement.style.fontWeight = weight;
            //更新描述字符串
            this.fontString = fontElement.style.font;
            return this;
        }else{
            return fontElement.style.fontWeight;
        }
    };
    /**
     * 设置或者获取字体大小
     * @method size
     * @param {int} size 字体大小字符串
     * @return {this|int}
     */
    this.size = function(size){
        if(arguments.length>0){
            fontElement.style.fontSize = size+'px';
            //更新描述字符串
            this.fontString = fontElement.style.font;

            this.fontSize = size;
            return this;
        }else{
            return fontElement.style.fontSize;
        }
    };
    /**
     * 设置或者获取字体类型
     * @method family
     * @param {String} family 字体类型字符串
     * @return {this|String}
     */
    this.family = function(family){
        if(arguments.length>0){
            if(family){
                fontElement.style.fontFamily = family;
                //更新描述字符串
                this.fontString = fontElement.style.font;
            }
            return this;
        }else{
            return fontElement.style.fontFamily;
        }
    };
    /**
     * 获取字体宽高
     * @method getBounds
     * @param {String} str 测试字符串
     * @return {Object} 指定字符串在当前字体下的宽高。｛w:w,h:h｝
     */
    this.getBounds = function(str){
        var ctx = this.__game.renderer.ctx;
        ctx.font = this.getDesc();
        var w = ctx.measureText(str).width;
        return {w:w,h:this.fontSize};
    };
};

/**
 * 使用图像集对象，构建一个图像字体类。
 * 图像字体类用于创建一个传递给文本精灵的字体对象，通过图片和映射文件创建。
 * 映射文件同精灵表。其中n为需要
 * 替换的字符
 * @class soya2d.ImageFont
 * @param {soya2d.Atlas} data 用于字体映射的图像集对象
 * @param {Number} size 图像字体大小
 * @module text
 */
soya2d.ImageFont = function(data,size){
    
    this.__fontMap = data;

    var oriFontSize = data.texs[Object.keys(data.texs)[0]].height;
    /**
     * 字体大小
     * @property fontSize
     * @type {int}
     */
    this.fontSize = oriFontSize;
    this.fontWidth = data.texs[Object.keys(data.texs)[0]].width;
    var scaleRate = 1;//缩放比率
    var lineH = 1;


    /**
     * 该字体的渲染内容
     * @private
     */
    this.__renderText = function(g){
        if(!this.__lines)return;

        var offy = 0;
        var lastW = 0;
        for(var i= 0,l=this.__lines.length;i<l;i++){
            var text = this.__lines[i];
            var offx = 0;
            for(var j=0,k=text.length;j<k;j++){
                var c = text[j];
                var tex = this.font.__fontMap.get(c);
                if(tex){
                    var w = tex.width*scaleRate;
                    var h = tex.height*scaleRate
                    lastW = w;
                    
                    g.map(tex,
                            offx, offy, w, h,
                            0, 0, tex.width, tex.height);
                }
                
                offx += lastW + this.letterSpacing;
            }
            offy += this.font.fontSize + this.lineSpacing;
        }
    };
                                            
    /**
     * 用当前参数复制一个新的字体对象。<br/>
     * @method clone
     * @return {soya2d.Font} 新的字体对象
     */
    this.clone = function(){
        return new soya2d.ImageFont(this.__fontMap);
    };
    /**
     * 设置或者获取字体大小
     * @method size
     * @param {int} size 字体大小
     * @return {this|int}
     */
    this.size = function(size){
        if(arguments.length>0){
            this.fontSize = parseInt(size) || oriFontSize;
            //重新计算rate
            scaleRate = this.fontSize/oriFontSize;
            return this;
        }else{
            return this.fontSize;
        }
    };
    /**
     * 获取字体宽高
     * @method getBounds
     * @param {String} str 测试字符串
     * @return {Object} 指定字符串在当前字体下的宽高。｛w:w,h:h｝
     */
    this.getBounds = function(str){
        var len = str.length;
        return {w:len*this.fontWidth*scaleRate,h:this.fontSize};
    }

    if(size)this.size(size);
};


/**
 * 创建一个用于渲染文本的实例
 * 文本类用于显示指定的文本内容，支持多行文本显示。
 * 文本渲染效果取决于所指定的font，默认为普通字体soya2d.Font。<br/>
 * 注意，需要显示的指定实例的w属性，来让引擎知道文本是否需要分行显示
 * @class soya2d.Text
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 * @see soya2d.Font
 * @see soya2d.ImageFont
 * @module text
 */
soya2d.class("soya2d.Text",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data) {
        /**
         * 文本内容
         * *注意，直接设置该属性后，需要手动刷新才会更新显示内容。如果不想手动刷新，可以使用setText函数来更新内容
         * @see soya2d.Text.refresh
         * @property text
         * @type {String}
         */
        this.text = data.text||'';
        /**
         * 字符间距
         * @property letterSpacing
         * @type {int}
         * @default 1
         */
        this.letterSpacing = data.letterSpacing || 0;
        /**
         * 行间距
         * @property lineSpacing
         * @type {int}
         * @default 5
         */
        this.lineSpacing = data.lineSpacing||0;

        /**
         * 字体对象
         * @property font
         * @type {String | soya2d.Font | soya2d.ImageFont | soya2d.Atlas}
         * @default soya2d.Font
         * @see soya2d.Font
         */
        this.font = data.font;
        if(typeof this.font === 'string'){
            this.font = new soya2d.Font(this.font);
        }else if(this.font instanceof soya2d.Atlas){
            this.font = new soya2d.ImageFont(this.font,data.size);
        }
        var font = this.font||new soya2d.Font();
        this.font = font;
        this.font.__game = this.game;

        this.__changed = true;//默认需要修改
        this.__lines;//分行内容

        this.__renderer = this.font.__renderText;//绑定渲染

        /**
         * 渲染样式
         * @property fillStyle
         * @type {String}
         */
        this.fillStyle = data.fillStyle || '#000';

        if(!this.w)this.w = this.font.getBounds(this.text).w;
        if(!this.h)this.h = this.font.fontSize;
    },
    onRender:function(g){
        this.__renderer(g);
    },
    /**
     * 刷新显示内容<br/>
     * 用在修改了宽度时调用
     * @method refresh
     */
    refresh:function(){
        this.__changed = true;
    },
    /**
     * 重新设置文本域字体
     * @method setFont
     * @param {soya2d.Font | soya2d.ImageFont} font 字体
     */
    setFont:function(font){
        if(!font)return;
        this.font = font;
        this.__renderer = this.font.__renderText;//绑定渲染
    },
    /**
     * 设置文本内容，并刷新
     * @method setText
     * @param {string} txt 文本内容
     * @param {Boolean} changeW 是否自动改变宽度
     */
	setText:function(txt,changeW){
		this.text = txt+'';
		this.refresh();
        if(changeW){
            this.w = this.font.getBounds(this.text).w;
        }
        return this;
	},
    _onUpdate:function(game){
        if(!this.__lh){//init basic size
            var bounds_en = this.font.getBounds("s",game.renderer);
            var bounds_zh = this.font.getBounds("豆",game.renderer);
            this.__lh = (bounds_en.h+bounds_zh.h)/2>>0;//行高
            this.__uw = (bounds_en.w+bounds_zh.w)/2>>0;//单字宽度
        }
        if(this.__changed){
            this.__lines = this.__calc(game.renderer);
            this.__changed = false;
        }
    },
    //计算每行内容
    __calc:function(renderer){
        var ls = this.letterSpacing;
        var charNum = this.w / (this.__uw+ls) >>0;//理论单行个数
        if(charNum<1){
            this.w = this.__uw * 1.5;
            charNum = 1;
        }
        var f = this.font;
        var primeLines = this.text.split('\n');//原始行
        var lines=[];/*lines=[[startChar,len,str],...]*/;
        for(var s= 0,e=primeLines.length;s<e;s++){
            var text = primeLines[s];
            if(!text){//处理空行
                lines.push('');
                continue;
            }
            var l = text.length;
            var currCharPos=0;
            while(currCharPos<l){
                var lineString = text.substr(currCharPos,charNum+1);
                //计算宽度是否超过
                var lineWidth = f.getBounds(lineString,renderer).w + lineString.length*ls;//增加字间距
                if(lineWidth > this.w){//超宽了
                    for(var j=charNum+1;j--;){
                        lineString = lineString.substr(0,lineString.length-1);
                        lineWidth = f.getBounds(lineString,renderer).w + lineString.length*ls;
                        if(lineWidth <= this.w){
                            if(lineWidth===0)return;//防止死循环
                            //该行处理完成
                            lines.push(lineString);
                            currCharPos += lineString.length;
                            break;
                        }
                    }
                }else{
                    var charPos = currCharPos;
                    for(var j=1;j<l-currCharPos;j++){
                        lineString = text.substr(currCharPos,charNum+1+j);
                        lineWidth = f.getBounds(lineString,renderer).w + lineString.length*ls;
                        if(lineWidth > this.w){
                            //该行处理完成
                            lines.push(lineString.substr(0,lineString.length-1));
                            currCharPos += lineString.length-1;
                            break;
                        }
                        //如果该行已经读完，直接退出
                        if(lineString === text){
                        		charNum = text.length-1;
                        		break;
                        }
                    }
                    if(currCharPos===charPos){//结束了
                        lineString = text.substr(currCharPos,charNum+1);
                        lines.push(lineString);
                        break;
                    }
                }
            }
        }


        return lines;
    }
});
/**
 * 游戏对象是构建soya2d应用的核心类，调度soya2d内的所有过程。
 * 一个页面可以同时运行多个游戏对象，并且拥有不同的FPS和场景
 * @class soya2d.Game
 * @constructor
 * @param {Object} opts 构造参数对象，参数如下：
 * @param {String | HTMLElement} opts.container 游戏渲染的容器，可以是一个选择器字符串或者节点对象
 * @param {Number} [opts.rendererType] 渲染器类型，目前只支持canvas
 * @param {Number} [opts.w] 游戏的宽度
 * @param {Number} [opts.h] 游戏的高度
 * @param {Boolean} opts.autoClear 自动清除背景
 * @param {Boolean} opts.smoothEnable 是否平滑处理
 * 
 */
soya2d.Game = function(opts){
	opts = opts || {};
	var container = opts.container || document.body;

	if(typeof container === 'string'){
		container = document.querySelector(container);
	}

	var rendererType = opts.rendererType || soya2d.RENDERER_TYPE_CANVAS;
    var cw = container.offsetWidth || 100,
        ch = container.offsetHeight || 100;

	var renderer = null;
	//if(rendererType == soya2d.RENDERER_TYPE_CANVAS){
		renderer = new soya2d.CanvasRenderer({
			smoothEnable: opts.smoothEnable,
			autoClear: opts.autoClear,
			container: container,
			sortEnable:true,
			w: opts.w || cw,
			h: opts.h || ch
		});
	//}

	soya2d.ext(this,opts);
	//////////////////////////////////外部接口 

    /**
     * 渲染器
     * @property renderer
     */
    this.renderer = renderer;
    /**
     * 对象工厂，用来注册新的显示对象类型
     * @property objects
     * @type {DisplayObjectFactory}
     */
    this.objects = new DisplayObjectFactory(this);
    /**
     * 对象代理工厂，用来添加新的显示对象到世界中
     * @property add
     * @type {DisplayObjectFactoryProxy}
     */
    this.add = new DisplayObjectFactoryProxy(this);
    /**
     * 全局事件监听器，包括DOM事件和自定义事件
     * @property events
     * @type {Signal}
     */
    this.events = new Signal();
    this.events.__signalHandler = new SignalHandler();
    /**
     * 场景管理器
     * @property scene
     * @type {SceneManager}
     */
    this.scene = new SceneManager(this);
	/**
	 * 舞台
     * @property stage
	 * @type {soya2d.Stage}
	 */
	this.stage = new Stage({game:this,w:renderer.w,h:renderer.h});
    /**
     * 世界
     * @property world
     * @type {soya2d.World}
     */
    this.world = new World({game:this,w:renderer.w,h:renderer.h});
    this.stage.add(this.world);
    /**
     * 每个game实例只存在唯一的一个摄像机，摄像机展示了世界中的内容
     * @property camera
     * @type {Camera}
     */
    this.camera = new Camera(renderer.w,renderer.h,this);
	/**
	 * 资源管理器
     * @property assets
	 * @type {Assets}
	 */
	this.assets = new Assets();
	/**
     * 加载器
     * @property load
     * @type {Loader}
     */
	this.load = new Loader(this);
    /**
     * 定时器
     * @property timer
     * @type {Timer}
     */
    this.timer = new Timer();
    /**
     * 物理系统
     * @property physics
     * @type {Physics}
     */
    this.physics = new Physics();
	/**
	 * 当前游戏的宽度
     * @property w
	 * @type {int}
	 * @default 960
	 */
	this.w = renderer.w;

	/**
	 * 当前游戏的高度
     * @property h
	 * @type {int}
	 * @default 480
	 */
	this.h = renderer.h;

	/**
	 * 当前游戏是否正在运行
     * @property running
	 * @type {boolean}
	 * @default false
	 */
	this.running = false;
	/**
	 * 启动当前游戏实例
     * @method start
     * @private
	 * @param {soya2d.Scene} scene 启动场景
     * @return this
	 */
	this.start = function(){
		if(this.running)return;
		this.running = true;

		//scan stage
		this.stage.__scan(this.w,this.h,container,renderer);

		//start modules
		var modules = soya2d.module._getAll();
		var beforeUpdates = [],
            onUpdates = [],
            afterUpdates = [],
            beforeRenders = [],
            afterRenders = [];
		for(var k in modules){
			if(modules[k].onStart)modules[k].onStart(this);

            if(modules[k].onBeforeUpdate)beforeUpdates.push([modules[k],modules[k].onBeforeUpdate]);
			if(modules[k].onUpdate)onUpdates.push([modules[k],modules[k].onUpdate]);
            if(modules[k].onAfterUpdate)afterUpdates.push([modules[k],modules[k].onAfterUpdate]);
            if(modules[k].onBeforeRender)beforeRenders.push([modules[k],modules[k].onBeforeRender]);
            if(modules[k].onAfterRender)afterRenders.push([modules[k],modules[k].onAfterRender]);
		}
		
		//start
		threshold = 1000 / currFPS;
		run(function(now,d){
            //before updates
            beforeUpdates.forEach(function(cbk){
                cbk[1].call(cbk[0],thisGame,now,d);
            });
            //update modules
            if(onUpdates.length>0){
                now = Date.now();
                onUpdates.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d);
                });
            }

            //physics
            if(thisGame.physics.running)game.physics.update();

            //calc camera rect
            thisGame.camera.__onUpdate();

            //update entities
            //update matrix——>sort(optional)——>onUpdate(matrix)——>onRender(g)
            
            thisGame.timer.__scan(d);

            thisGame.stage.__updateMatrix();
            thisGame.stage.__update(thisGame,d);
            
            
            if(thisGame.currentScene.onUpdate)
                thisGame.currentScene.onUpdate(thisGame,d);
            //after updates
            if(afterUpdates.length>0){
                now = Date.now();
                afterUpdates.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d);
                });
            }

            
            thisGame.camera.__cull(thisGame.stage);

            thisGame.camera.__viewport(thisGame.world);
            
            //before render
            if(beforeRenders.length>0){
                now = Date.now();
                beforeRenders.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d);
                });
            }
            //render
            renderer.render(thisGame.stage,thisGame.camera);
            
            //after render
            if(afterRenders.length>0){
                now = Date.now();
                afterRenders.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d);
                });
            }
		});

		return this;
	};

    var thisGame = this;
	var lastCountTime=0;
	var maxFPS = 60;
    var currFPS = 60;
    var threshold,
        totalTime=0;
    var RAFTag;
	function run(fn){
        if (!thisGame.running) return;
        RAFTag = requestAFrame(function(t){
            if(lastCountTime===0){
	            lastCountTime = t;
	        }
            var d = t - lastCountTime;
            lastCountTime = t;

            //main body
            if(totalTime > threshold){
                var now = Date.now();
                if(fn)fn(now,d);

                totalTime = totalTime % threshold;
            }
            totalTime += d;
            
            run(fn);
        });
    };

    /**
     * 设置该game实例的FPS。一个页面上可以同时存在多个不同FPS的game实例
     * @method setFPS
     * @param {Number} fps 最大60
     * @return this
     */
    this.setFPS = function(fps){
        currFPS = parseInt(fps) || maxFPS;
        currFPS = currFPS>maxFPS?maxFPS:currFPS;
        threshold = 1000 / currFPS;

        return this;
    };
	/**
	 * 停止当前游戏实例
     * @method stop
     * @return this
	 */
	this.stop = function() {
		cancelAFrame(RAFTag);
		this.running = false;

		var modules = soya2d.module._getAll();
		for(var k in modules){
			if(modules[k].onStop)modules[k].onStop(this);
		}

		return this;
	};

	//init modules
	var modules = soya2d.module._getAll();
    var ms = 0;
	for(var k in modules){
		if(modules[k].onInit)modules[k].onInit(this);
        ms++;
	}

    //init DOF
    this.objects.register('shape',soya2d.Shape);
    this.objects.register('sprite',soya2d.Sprite);
    this.objects.register('tileSprite',soya2d.TileSprite);
    this.objects.register('group',soya2d.DisplayObjectContainer);
    this.objects.register('text',soya2d.Text);

    var t1 = 'soya2d Game instance created...';
    var t2 = ms + ' plugins loaded...';
    soya2d.console.info(t1);
    soya2d.console.info(t2);
    
    soya2d.games.push(this);
};
/**
 * 游戏实例列表，保存当前域所有的game实例
 * @property games
 * @type {Array}
 */
soya2d.games = [];
var t1 = 'soya2d '+soya2d.version.toString()+' is working...';
var t2 = '==== thank you for using soya2d, you\'ll love it! ====';

soya2d.console.info(t1);
soya2d.console.info(t2);



/**
 * 渲染器类型,自动选择。
 * 引擎会根据运行环境自动选择渲染器类型
 * @property RENDERER_TYPE_AUTO
 */
soya2d.RENDERER_TYPE_AUTO = 1;
/**
 * 渲染器类型,canvas。
 * 引擎会使用canvas 2d方式进行渲染
 * @property RENDERER_TYPE_CANVAS
 */
soya2d.RENDERER_TYPE_CANVAS = 2;
/**
 * 渲染器类型,webgl
 * 引擎会使用webgl方式进行渲染
 * @property RENDERER_TYPE_WEBGL
 */
soya2d.RENDERER_TYPE_WEBGL = 3;

}(window||this);