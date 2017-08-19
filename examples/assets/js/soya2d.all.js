/*
 * Soya2D is a web interactive animation(game) engine for modern web browsers 
 *
 *
 * Copyright 2015-2017 MrSoya and other contributors
 * Released under the MIT license
 *
 * website: http://soya2d.com
 * last build: 2017-8-19
 */
!function (global) {
	'use strict';
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
        v:[2,0,0],
        /**
         * state
         * @property version.state 
         * @type {String}
         */
        state:'beta3',
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
 * {n:'hero_001.png',x:0,y:0,w:50,h:50,r:90},//ssheet unit，index 0
 * {n:'hero_002.png',x:50,y:50,w:50,h:50,r:180},//index 1
 * ...
 * ]
 * ```
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
 * 信号类用来实现soya2D内部的消息系统。
 * 同时，对于自定义全局消息，也可以直接创建信号通道进行通信
 * 
 * @class soya2d.Signal
 */

var Signal = soya2d.Signal = function (){
    this.__sigmap = {};
}
soya2d.Signal.prototype = {
    /**
     * 监听一个信号
     * @method on
     * @param {String} type 信号类型，多个类型使用空格分割
     * @param {Function} cbk 回调函数，回调参数和emit时所传参数一致
     * @param {Object} [context] 函数执行上下文
     * @chainable
     */
    on:function(type,cbk,context){
        var ts = type.replace(/\s+/mg,' ').split(' ');
        for(var i=ts.length;i--;){
            var listeners = this.__sigmap[ts[i]];
            if(!listeners)listeners = this.__sigmap[ts[i]] = [];
            listeners.push([cbk,context||this]);
        }
        return this;
    },
    /**
     * 监听一个信号一次
     * @method once
     * @param {String} type 信号类型，多个类型使用空格分割
     * @param {Function} cbk 回调函数
     * @param {Object} [context] 函数执行上下文
     * @chainable
     */
    once:function(type,cbk,context){
        var ts = type.replace(/\s+/mg,' ').split(' ');
        for(var i=ts.length;i--;){
            var listeners = this.__sigmap[ts[i]];
            if(!listeners)listeners = this.__sigmap[ts[i]] = [];
            listeners.push([cbk,context||this,true]);
        }
        return this;
    },
    /**
     * 取消监听
     * @method off
     * @param {String} [type] 信号类型，多个类型使用空格分割。如果为空，删除所有信号监听
     * @param {Function} [cbk] 监听时的函数引用。如果为空，删除该类型下所有监听
     * @param {Object} [context] 函数执行上下文
     * @chainable
     */
    off:function(type,cbk,context){
        var types = null;
        if(!type){
            types = Object.keys(this.__sigmap);
        }else{
            types = type.replace(/\s+/mg,' ').split(' ');
        }

        for(var i=types.length;i--;){
            var listeners = this.__sigmap[types[i]];
            if(listeners){
                var toDel = [];
                for(var j=listeners.length;j--;){
                    if((context||this) === listeners[j][1] && 
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
        return this
    },
    /**
     * 发射指定类型信号
     * @method emit
     * @param {String} type 信号类型
     * @param {...} params 不定类型和数量的参数
     * @chainable
     */
    emit:function(){
        console.log(arguments[0])
        var listeners = this.__sigmap[arguments[0]];
        if(!listeners)return;        
        
        var params = [];
        for(var i=1;i<arguments.length;i++){
            params.push(arguments[i]);
        }

        listeners.filter(function(item){
            item[0].apply(item[1],params);
        });
        var last = listeners.filter(function(item){
            if(!item[2])return true;
        });

        this.__sigmap[arguments[0]] = last;

        return this;
    }
}

/**
 *  资源加载类加载所有相关资源，并放入{{#crossLink "Assets"}}{{/crossLink}}中。
 *  该类不能被实例化，系统会自动创建实例给game。
 *  每个game有且只有一个load属性，通过该属性可以加载资源。
 *  ```
 * game.load.baseUrl = 'assets/xml/';
 * game.load.xml({
 *   ui:'ui.xml'
 * });
 * ```
 *  @class Loader
 *  @extends Signal
 */
var Loader = soya2d.class("",{
    extends:Signal,
    timeout:5000,
    constructor:function(game){
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
        if(this.__assetsQueue.length<1){
            this.emit('end');
            return;
        }
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
 * 单个资源项加载完成后触发
 * @event load
 * @for Loader
 * @param {...} rs 加载的资源
 * @param {Number} index 当前索引
 * @param {Number} total 资源总数
 */
/**
 * 单个资源项加载错误后触发
 * @event error
 * @for Loader
 * @param {String} url 资源路径
 */
/**
 * 单个资源项加载超时后触发
 * @event timeout
 * @for Loader
 * @param {String} url 资源路径
 */
/**
 * 所有资源项加载完成后触发
 * @event end
 * @for Loader
 */
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
        var world = doc.childNodes[0];
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
 * 预加载回调，该回调中可以进行资源加载操作。资源加载完成后，会自动调用onInit回调
 * @method onPreload
 * @param {soya2d.Game} game 场景所属game
 */
/**
 * 初始化回调，在onPreload后调用
 * @method onInit
 * @param {soya2d.Game} game 场景所属game
 */
/**
 * 更新回调，每帧调用
 * @method onUpdate
 * @param {soya2d.Game} game 场景所属game
 * @param {Number} delta 上一次调用的间隔
 */

function build(scene,node,parent,game){
    for(var i=0;i<node.childNodes.length;i++){
        var n = node.childNodes[i];
        if(n.nodeType == 3)continue;
        
        var type = n.tagName;
        var id = n.attributes['id'] ? n.attributes['id'].value : null;
        var data = {};
        var attrs = n.attributes;
        for(var j=0;j<attrs.length;j++){
            var tmp = attrs[j].name;
            data[tmp] = attrs[j].value;
        }
        //filter data
        if(game.objects.map[type].prototype.onBuild){
            game.objects.map[type].prototype.onBuild(data,n,game);
        }
        var ins = newInstance(type,data,game);

        bindEvent(data,ins,scene);
        if(id){
            scene.map[id] = ins;
        }
        parent.add(ins);

        if(n.childNodes.length>0){
            build(scene,n,ins,game);
        }
    }
}


function bindEvent(data,ins,scene){
    var ks = Object.keys(data);
    for(var i=ks.length;i--;){
        var name = ks[i];
        var val = data[name];
        if(name.indexOf('on-') !== 0)continue;
        var evFn = scene[val];
        if(evFn instanceof Function){
            var tmp = name.replace(/-([\w])/img,function(a,b){return b.toUpperCase();});
            if(ins.events[tmp])
                ins.events[tmp](evFn);
        }else{
            soya2d.console.warn('invalid callback "'+val+'" of '+name);
        }
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
     * @chainable
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
                    },0);
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
            if(modules[k].onSceneChange)modules[k].onSceneChange(game,scene);
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
                0/15 每15秒触发<br>
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
        this.triggerList = [];
        this.expMap = {};
        this.threshold = 1000;
    },
    /**
     * 添加一个定时器
     * @method on
     * @param  {String} exp  表达式，必须用中括号包裹 [* * *]
     * @param  {Function} cbk  回调函数，回调参数[milliseconds,times,[s,m,h]]
     * @param  {Object} [context] 上下文
     * @return this
     */
    on:function(exp,cbk,context){
        var that = this;
        exp = exp.replace(/\[(.*?)\]/mg,function(all,ex){
            if(!that.expMap[ex]){
                var t = new TimerTrigger(ex);
                that.triggerList.push(t);
                that.expMap[ex] = t;
            }
            return ex.replace(/\s+/mg,'_');
        });
        
        return this._super.on.call(this,exp,cbk,context);
    },
    /**
     * 添加一个定时器，只执行一次
     * @method once
     * @param  {String} exp  表达式，必须用中括号包裹 [* * *]
     * @param  {Function} cbk  回调函数，回调参数[milliseconds,times,[s,m,h]]
     * @param  @param  {Object} [context] 上下文
     * @return this
     */
    once:function(exp,cbk,context){
        var that = this;
        exp = exp.replace(/\[(.*?)\]/mg,function(all,ex){
            if(!that.expMap[ex]){
                var t = new TimerTrigger(ex);
                that.triggerList.push(t);
                that.expMap[ex] = t;
            }
            return ex.replace(/\s+/mg,'_');
        });
        return this._super.once.call(this,exp,cbk,context);
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
            var cbks = this.__sigmap[ex.replace(/\s+/mg,'_')];
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
            var tasks = this.__sigmap[trigger.exp.replace(/\s+/mg,'_')];
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
 * 几何模块定义了soya2d中内置的几何结构，这些结构可以用来进行碰撞检测，或进行计算
 * @module geom
 */

/**
 * 几何结构，圆形。用于保存圆形结构数据，可以设置为{{#crossLink "soya2d.DisplayObject"}}的bounds，
 * 用于检测碰撞
 * @class soya2d.Circle
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
	 * @chainable
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
	 * @chainable
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
	 * @chainable
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
	 * @chainable
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
	 * @chainable
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
	 * @chainable
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
	 * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
     */
    moveBy:function(offx,offy){
        this.__cbk && this.__cbk.moveBy(this.rigid,offx,offy);
        return this;
    },
    /**
     * 设置是否为静态刚体。静态刚体会呈现碰撞，但没有重力效果
     * @method static
     * @param  {Boolean} tof 
     * @chainable
     */
    static:function(tof){
        this.__cbk && this.__cbk.static(this.rigid,tof);
        return this;
    },
    /**
     * 设置刚体的质量
     * @method mass
     * @param  {Number} v 
     * @chainable
     */
    mass:function(v){
        this.__cbk && this.__cbk.mass(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体旋转偏移
     * @method rotateBy
     * @param  {Number} v 
     * @chainable
     */
    rotateBy:function(v){
        this.__cbk && this.__cbk.rotateBy(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体旋转角度
     * @method rotateTo
     * @param  {Number} v 
     * @chainable
     */
    rotateTo:function(v){
        this.__cbk && this.__cbk.rotateTo(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体摩擦系数
     * @method friction
     * @param  {Number} v 
     * @chainable
     */
    friction:function(v){
        this.__cbk && this.__cbk.friction(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体弹性系数
     * @method restitution
     * @param  {Number} v 
     * @chainable
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
     * @chainable
     */
    velocity:function(x,y){
        this.__cbk && this.__cbk.velocity(this.rigid,x||0,y||0);
        return this;
    },
    /**
     * 设置刚体惯性
     * @method inertia
     * @param  {Number} v 
     * @chainable
     */
    inertia:function(v){
        this.__cbk && this.__cbk.inertia(this.rigid,v||0);
        return this;
    }
});

/**
 * 物理模块定义了soya2d中内置的物理系统，该模块实现了一套应用层API，
 * 开发者可以自行切换物理库，而不必修改应用代码。
 * <b>该模块是扩展模块，可以自行卸载</b>
 * @module physics
 */
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
 * 碰撞开始
 * @property EVENT_COLLISIONSTART
 * @type {String}
 * @for soya2d
 */
soya2d.EVENT_COLLISIONSTART = 'collisionStart';
/**
 * 碰撞结束
 * @property EVENT_COLLISIONEND
 * @type {String}
 * @for soya2d
 */
soya2d.EVENT_COLLISIONEND = 'collisionEnd';


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
        if(constructor.prototype instanceof soya2d.DisplayObject){
            this.game.add[alias] = function(data){
                return this.__newInstanceAndAppend(alias,data);
            }
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

    this.__newInstanceAndAppend = function(type,data){
    	data.game = this.game;
    	var instance = new this.game.objects.map[type](data);
    	// instance.game = this.game;
    	this.game.world.add(instance);
    	return instance;
    }
}
/**
 * 显示模块定义了soya2d中所有内置的显示对象，显示对象是实际控制图像渲染的实体。
 * 同时，显示模块中也定义了soya2d的显示架构
 * ```
 *    stage
 *      |
 *    world
 *     /|\
 *    others   
 * ```
 * @module display
 */
/**
 * 显示对象是引擎中的所有可见对象的基类,该类中包含的属性用来控制一个可见对象的显示效果以及渲染方式。<br/>
 该类不能被实例化 
 * @class soya2d.DisplayObject
 * @param {Object} data 定义参数,见类参数定义
 */
soya2d.DisplayObject = function(data){
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
    this.__screenPosition = new soya2d.Point(Infinity,Infinity);
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

    /**
     * 事件回调接口
     * @type {Events}
     */
    this.events = new Events(this);
}
soya2d.DisplayObject.prototype = {
    onBuild:function(data,node){
        for(var k in data){
            var name = k;
            var v = data[k];
            switch(name){
                case 'x':case 'w':
                case 'y':case 'h':
                case 'z':case 'angle':case 'scaleX':
                case 'scaleY':case 'skewX':case 'skewY':
                    v = parseFloat(v);
                    break;
                case 'fixedToCamera':case 'visible':
                    v = new Function('return '+v)();
            }
            if(name.indexOf('layout-')===0){
                if(!data['layout'])data['layout'] = {};
                
                data['layout'][name.split('-')[1]] = v;
            }else{
                data[name] = v;
            }
        }
        return data;
    },
    _onAdded:function(){
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
     * @chainable
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
     * 刷新已有布局
     * @method refreshLayout
     * @chainable
     */
    refreshLayout:function(){
        this.setLayout(this.layout);
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
     * @chainable
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
     * @chainable
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
     * @chainable
	 */
	opacifyTo:function(o){
		this.opacity = o>1?1:o<0?0:o;
        return this;
	},
	/**
	 * 设置透明度偏移
     * @method opacifyBy
	 * @param {Number} o 透明度差值
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
     */
    rotateBy:function(rn){
        this.angle += rn;
        return this;
    },
    /**
     * 旋转精灵到指定角度
     * @method rotateTo
     * @param {Number} rn 角度
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @param  {Number | soya2d.Point} x x坐标 或者一个坐标点
     * @param  {Number} y y坐标。如果第一个参数是坐标点，第二个参数可以为空
     * @return {Boolean} 点是否在bounds内
     * @see soya2d.DisplayObject#bounds
     */
    hitTest:function(x,y){
        if(x instanceof soya2d.Point){
            var p = x;
            x = p.x,
            y = p.y;
        }
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
        this.__renderable = true;
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
        this.game.physics.unbind(this);
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
};

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
 * 引擎更新前回调，每帧调用。在该回调中可以编写更新逻辑
 * @method onUpdate
 * @param {soya2d.Game} game 当前精灵所在的游戏实例
 * @param {Number} delta 上一次调用的间隔
 */
/**
 * 引擎更新后回调，每帧调用。在该回调中可以编写更新逻辑
 * @method onPostUpdate
 * @param {soya2d.Game} game 当前精灵所在的游戏实例
 * @param {Number} delta 上一次调用的间隔
 */
/**
 * 添加到渲染树回调
 * @method onAdded
 */
/**
 * 当该对象在XML中被解析时调用，该回调中需要处理对应的参数，比如转换类型等
 * @method onBuild
 * @param {Object} data XML节点上的所有属性
 * @param {Node} node XML节点对象
 * @param {soya2d.Game} game 当前game实例
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
     * @chainable
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
            child._onAdded();
        }

        return this;
    },
    /**
     * 删除子节点
     * @method remove
     * @param {...soya2d.DisplayObject} children 一个或者多个可渲染对象，使用逗号分割
     * @chainable
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
                set:function(v){
                    scaleMode = v;
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
    __preUpdate : function(game,d){
        if(this.children)
            update(this.children,game,d);
    },
    __postUpdate:function(game,d){
        if(this.children)
            postUpdate(this.children,game,d);
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

function postUpdate(list,game,delta){
    for(var i=list.length;i--;){
        var c = list[i];
        if(c._onPostUpdate){
            c._onPostUpdate(game,delta);
        }
        if(c.onPostUpdate){
            c.onPostUpdate(game,delta);
        }
        if(c.children && c.children.length>0){
            postUpdate(c.children,game,delta);
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

	    
	    this.__frameIndex = data.frameIndex || 0;//当前帧号
	    this.__scale9grid = data.scale9grid;
	    
	    Object.defineProperties(this,{
	    	/**
		     * 当前帧序号
		     * @property frameIndex
		     * @type {Number}
		     * @default 0
		     */
	    	frameIndex:{
	    		set:function(v){
	    			this.__frameIndex = v;
	    			this.__cacheGrid = true;
	    		},
	    		get:function(){
                    return this.__frameIndex;
                },
                enumerable:true
	    	},
	    	/**
		     * 对图片进行九宫格缩放
		     * @property scale9grid
		     * @type {soya2d.Rectangle}
		     */
	    	scale9grid:{
	    		set:function(v){
	    			if(!(v instanceof soya2d.Rectangle))return;
	    			this.__scale9grid = v;
	    			this.__cacheGrid = true;
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
	onBuild:function(data,node){
		soya2d.DisplayObject.prototype.onBuild(data);

        for(var k in data){
            var name = k;
            var v = data[k];
            switch(name){
            	case 'images':
            		data[name] = v.split(',');
            		break;
                case 'frameIndex':
                    data[name] = parseFloat(v);
                    break;
                case 'atlas':
                	var prefix = data['atlas-prefix'];
            		data.images = game.assets.atlas(v).getAll(prefix);
            		break;
            	case 'scale9grid':
            		var params = v.split(',');
                    data[name] = new soya2d.Rectangle(
                    	parseFloat(params[0]),
                    	parseFloat(params[1]),
                    	parseFloat(params[2]),
                    	parseFloat(params[3]));
                    break;
            }
        }
	},
	_onAdded:function(){
		soya2d.DisplayObject.prototype._onAdded.call(this);
		if(this.__scale9grid && (this.__w != this.images[0].width || this.__h != this.images[0].height)){
	    	this.__cacheGrid = true;
	    	this.__parseScale9();
	    }
	},
	_onUpdate:function(){
		if(this.__cacheGrid && this.__scale9grid instanceof soya2d.Rectangle 
			//&& (this.__w != this.__cacheW || this.__h != this.__cacheH)
			){
			this.cache();
			this.__cacheW = this.__w;
			this.__cacheH = this.__h;
			this.__cacheGrid = false;
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
    		var img = this.images[this.__frameIndex];
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
	 * @param {Boolean} [loop=false] 是否循环 
	 */
	nextFrame:function(loop){
		this.frameIndex++;
		if(this.frameIndex >= this.images.length){
			if(loop){
				this.frameIndex = 0;
			}else{
				this.frameIndex = this.images.length-1;
			}
		}
	},
	/**
	 * 设置当前帧数-1
	 * @method prevFrame
	 * @param {Boolean} [loop=false] 是否循环 
	 */
	prevFrame:function(loop){
		this.frameIndex--;
		if(this.frameIndex < 0){
			if(loop){
				frameIndex = this.images.length-1;
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
	 * @chainable
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
 * 渲染器模块定义了soya2d中内置的渲染器，目前仅实现了CanvasRenderer
 * @module renderer
 */
/**
 * 图形类,提供了贴图和矢量绘制的接口。<br/>
 * 注意，该类不应被实例化。引擎会在onRender回调中注入该类的实例。<br/>
 * 该图形对象基于Canvas构建。
 * 
 * @class soya2d.CanvasGraphics
 * @constructor
 * @param ctx CanvasRenderingContext2D的实例
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
     */
    this.font = function(font){
        var c = this.ctx;
        c.font = font.getDesc();
        return this;
    };

    /**
     * 裁剪路径
     * @method clip
     * @chainable
     */
	this.clip = function(){
        this.ctx.clip();
        return this;
	};
    /**
     * 保存当前绘图状态
     * @method push
     * @chainable
     */
	this.push = function(){
		this.ctx.save();	
		return this;
	};
    /**
     * 恢复最近一次push的绘图状态
     * @method pop
     * @chainable
     */
	this.pop = function(){
		this.ctx.restore();	
		return this;
	};
    /**
     * 清空当前path中的所有subpath
     * @method beginPath
     * @chainable
     */
	this.beginPath = function(){
		this.ctx.beginPath();	
		return this;
	};
    /**
     * 关闭当前path
     * @method closePath
     * @chainable
     */
    this.closePath = function(){
        this.ctx.closePath();
        return this;
    };

    /**
     * 填充path
     * @method fill
     * @chainable
     */
    this.fill = function(){
        this.ctx.fill();
        return this;
    };
    /**
     * 描绘path的轮廓
     * @method stroke
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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
     * @chainable
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

    var count = 0;
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
        count = 0;
        render(rect,ctx,stage,g,this.sortEnable,renderStyle);
        return count;
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
    function render(cameraRect,ctx,ro,g,sortEnable,rs){
        if(ro.opacity===0 
        || !ro.visible
        || ro.__masker)return;

        var sp = ro.__screenPosition;

        if(!ro.__renderable && (sp.x != Infinity && sp.y != Infinity))return;

        count++;

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
            var ap = ro.anchorPosition;
            var wp = ro.worldPosition;
            if(ro.__updateCache){
                var x = ap.x,
                    y = ap.y;
                ctx.setTransform(1,0,0,1,x,y);
            }else{
                var x = sp.x,
                    y = sp.y;
                if(x == Infinity && y == Infinity){//for stage children
                    x = wp.x,
                    y = wp.y;
                }
                
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
                render(cameraRect,ctx,children[i],g,sortEnable,rs);
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
     * 销毁渲染器
     * @method destroy
     */
    this.destroy = function(){
        if(cvs.parentNode)
            cvs.parentNode.removeChild(cvs);
        ctxFnMap = 
        g = 
        this.ctx = null;
    }
    
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
     * @param {Number} [opt.type=soya2d.GRADIENT_LINEAR] 渐变类型
     * @param {Number} [opt.focalRatio=0] 放射渐变焦点偏移比率
     * @param {Number} [opt.focalRadius=0] 焦点半径
     * @see soya2d.GRADIENT_LINEAR
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
 * 字体模块定义了soya2d中内置的字体显示类，支持字体文件和图片字体
 * @module text
 */
/**
 * 字体类。用于指定绘制字体的样式、大小等
 * @class soya2d.Font
 * @param {String} desc 字体描述字符串，可以为空。为空时创建默认样式字体:[normal 400 13px/normal sans-serif]<br/>符合W3C[CSSFONTS]规范
 */
soya2d.Font = function(desc){
    var fontElement = document.createElement('span');
    var style = ['padding:0 !important;','margin:0 !important;'
                ,'top:-9999px !important;','left:-9999px !important;'
                ,'white-space:nowrap !important;','position:absolute !important;'];
    fontElement.style.cssText = style.join('')+"font:"
                                        +(desc||"normal 400 13px/normal sans-serif");
    document.body.appendChild(fontElement);
    /**
     * 字体描述字符串
     * @property fontString
     * @type {String}
     */
    this.fontString = fontElement.style.font;

    /**
     * 该字体的渲染内容
     * @private
     */
    this.__textRenderer = function(g){
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
        fontElement.innerText = str;
        var h = fontElement.offsetHeight;
        var w = fontElement.offsetWidth;
        return {w:w,h:h};
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
 */
soya2d.ImageFont = function(data,size){
    this.__fontMap = data;

    var oriFontSize = data.texs[Object.keys(data.texs)[0]].height;
    /**
     * 字体大小
     * @property fontSize
     * @type {int}
     */
    this.fontSize = size || oriFontSize;
    this.fontWidth = data.texs[Object.keys(data.texs)[0]].width;
    var scaleRate = 1;//缩放比率
    var lineH = 1;


    /**
     * 该字体的渲染内容
     * @private
     */
    this.__textRenderer = function(g){
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
        this.font = data.font || new soya2d.Font();
        if(typeof this.font === 'string'){
            this.font = new soya2d.Font(this.font);
        }else if(this.font instanceof soya2d.Atlas){
            this.font = new soya2d.ImageFont(this.font,data.size);
        }

        this.__changed = true;//默认需要修改
        this.__lines;//分行内容

        this.__renderer = this.font.__textRenderer;//绑定渲染

        /**
         * 渲染样式
         * @property fillStyle
         * @type {String}
         */
        this.fillStyle = data.fillStyle || '#000';

        var bounds = this.font.getBounds(this.text);
        if(!this.w)this.w = bounds.w;
        if(!this.h)this.h = bounds.h;
    },
    onBuild:function(data,n,game){
        soya2d.DisplayObject.prototype.onBuild(data);

        var txt = '';
        for(var k=0;k<n.childNodes.length;k++){
            if(n.childNodes[k].nodeType === 3){
                txt += n.childNodes[k].nodeValue;
            }
        }
        data.text = txt.replace(/(^\s+)|(\s+$)/mg,'');
        
        var atlas = data['atlas'];
        if(atlas){
            data.size = parseInt(data['size']);
            data.font = game.assets.atlas(atlas);
        }
        for(var k in data){
            var name = k;
            var v = data[k];
            switch(name){
                case 'letterSpacing':case 'lineSpacing':
                    data[name] = parseFloat(v);
            }
        }
    },
    onRender:function(g){
        this.__renderer(g);
    },
    /**
     * 刷新显示内容<br/>
     * 用在修改了宽度时调用
     * @method refresh
     * @chainable
     */
    refresh:function(){
        this.__changed = true;
        return this;
    },
    /**
     * 重新设置文本域字体
     * @method setFont
     * @param {soya2d.Font | soya2d.ImageFont} font 字体
     * @chainable
     */
    setFont:function(font){
        if(!font)return this;
        this.font = font;
        this.__renderer = this.font.__textRenderer;//绑定渲染

        return this;
    },
    /**
     * 设置文本内容，并刷新
     * @method setText
     * @param {string} txt 文本内容
     * @param {Boolean} changeW 是否自动改变宽度
     * @chainable
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
            var bounds_en = this.font.getBounds("s");
            var bounds_zh = this.font.getBounds("豆");
            this.__lh = (bounds_en.h+bounds_zh.h)/2>>0;//行高
            this.__uw = (bounds_en.w+bounds_zh.w)/2>>0;//单字宽度
        }
        if(this.__changed){
            this.__lines = this.__calc();
            this.__changed = false;
        }
    },
    //计算每行内容
    __calc:function(){
        var ls = this.letterSpacing>>0;
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
                var lineWidth = f.getBounds(lineString).w + lineString.length*ls;//增加字间距
                if(lineWidth > this.w){//超宽了
                    for(var j=charNum+1;j--;){
                        lineString = lineString.substr(0,lineString.length-1);
                        lineWidth = f.getBounds(lineString).w + lineString.length*ls;
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
                        lineWidth = f.getBounds(lineString).w + lineString.length*ls;
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
     * 对象注册工厂，用来注册新的显示对象类型
     * @property objects
     * @type {DisplayObjectFactory}
     */
    this.objects = new DisplayObjectFactory(this);
    /**
     * 对象添加工厂，用来添加新的显示对象到世界中
     * @property add
     * @type {DisplayObjectFactoryProxy}
     */
    this.add = new DisplayObjectFactoryProxy(this);
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
     * 保存当前输入设备的相关状态
     * @type {Object}
     */
    this.input = {
        pointer:{
            changeType:function(type){
                pointerListener.changeType(type);
            }
        },
        keyboard:{},
        device:{}
    };

	/**
	 * 启动当前游戏实例
     * @method start
     * @private
	 * @param {soya2d.Scene} scene 启动场景
     * @chainable
	 */
	this.start = function(){
		if(this.running)return;
		this.running = true;

		//scan stage
		this.stage.__scan(this.w,this.h,container,renderer);

		//start modules
		var modules = soya2d.module._getAll();
		var beforeUpdates = [],
            postUpdates = [],
            beforeRenders = [],
            postRenders = [];
		for(var k in modules){
			if(modules[k].onStart)modules[k].onStart(this);

            if(modules[k].onBeforeUpdate)beforeUpdates.push([modules[k],modules[k].onBeforeUpdate]);
            if(modules[k].onPostUpdate)postUpdates.push([modules[k],modules[k].onPostUpdate]);
            if(modules[k].onBeforeRender)beforeRenders.push([modules[k],modules[k].onBeforeRender]);
            if(modules[k].onPostRender)postRenders.push([modules[k],modules[k].onPostRender]);
		}

        //start listeners
        pointerListener.start(this);
        keyboardListener.start(this);
        deviceListener.start(this);
		
		//start
		threshold = 1000 / currFPS;
		run(function(now,d){
            //before updates
            beforeUpdates.forEach(function(cbk){
                cbk[1].call(cbk[0],thisGame,now,d);
            });

            //physics
            if(thisGame.physics.running)thisGame.physics.update();
            //calc camera rect
            thisGame.camera.__onUpdate();
            thisGame.timer.__scan(d);

            //update input state & dispatch events
            pointerListener.scan(thisGame);
            keyboardListener.scan(thisGame);
            deviceListener.scan(thisGame);

            //update entities
            //update matrix——>sort(optional)——>onUpdate(matrix)——>onRender(g)
            if(thisGame.currentScene.onUpdate)
                thisGame.currentScene.onUpdate(thisGame,d);

            thisGame.stage.__preUpdate(thisGame,d);
            thisGame.stage.__updateMatrix();
            thisGame.stage.__postUpdate(thisGame,d);
            
            //post updates
            if(postUpdates.length>0){
                now = Date.now();
                postUpdates.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d);
                });
            }
            pointerListener.clear();
            keyboardListener.clear();
            deviceListener.clear();

            
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
            var count = renderer.render(thisGame.stage,thisGame.camera);
            
            //after render
            if(postRenders.length>0){
                now = Date.now();
                postRenders.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d,count);
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
     * @chainable
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
     * @chainable
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
    /**
     * 销毁当前游戏实例，以及内部所有对象。
     * 会调用模块的onDestroy回调
     * @method destroy
     */
    this.destroy = function(){
        if(this.running)this.stop();

        var modules = soya2d.module._getAll();
        for(var k in modules){
            if(modules[k].onDestroy)modules[k].onDestroy(this);
        }
        this.renderer.destroy();
        this.stage.destroy();
        var i = soya2d.games.indexOf(this);
        if(i>-1){
            soya2d.games.splice(i,1);
        }
    }

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
 * @private
 */
soya2d.RENDERER_TYPE_AUTO = 1;
/**
 * 渲染器类型,canvas。
 * 引擎会使用canvas 2d方式进行渲染
 * @property RENDERER_TYPE_CANVAS
 * @private
 */
soya2d.RENDERER_TYPE_CANVAS = 2;
/**
 * 渲染器类型,webgl
 * 引擎会使用webgl方式进行渲染
 * @property RENDERER_TYPE_WEBGL
 * @private
 */
soya2d.RENDERER_TYPE_WEBGL = 3;

var eventSignal = new Signal();
/**
 * 精灵事件接口，用来绑定回调事件
 * @param {[type]} displayObject [description]
 */
function Events(displayObject){
    this.obj = displayObject;
    
    //pointer
    this.onPointerDown = function(cbk){
        eventSignal.on('pointerdown',cbk,this.obj);
    }
    this.onPointerTap = function(cbk){
        eventSignal.on('pointertap',cbk,this.obj);
    }
    this.onPointerDblTap = function(cbk){
        eventSignal.on('pointerdbltap',cbk,this.obj);
    }
    this.onPointerUp = function(cbk){
        eventSignal.on('pointerup',cbk,this.obj);
    }
    this.onPointerMove = function(cbk){
        eventSignal.on('pointermove',cbk,this.obj);
    }
    this.onPointerOver = function(cbk){
        eventSignal.on('pointerover',cbk,this.obj);
    }
    this.onPointerOut = function(cbk){
        eventSignal.on('pointerout',cbk,this.obj);
    }
    this.onPointerCancel = function(cbk){
        eventSignal.on('pointercancel',cbk,this.obj);
    }

    //keyboard
    this.onKeyDown = function(cbk){
        eventSignal.on('keydown',cbk,this.obj);
    }
    this.onKeyPress = function(cbk){
        eventSignal.on('keypress',cbk,this.obj);
    }
    this.onKeyUp = function(cbk){
        eventSignal.on('keyup',cbk,this.obj);
    }

    //device
    this.onDeviceHov = function(cbk){
        eventSignal.on('hov',cbk,this.obj);
    }
    this.onDeviceTilt = function(cbk){
        eventSignal.on('tilt',cbk,this.obj);
    }
    this.onDeviceMotion = function(cbk){
        eventSignal.on('motion',cbk,this.obj);
    }

    //physics
    this.onCollisionStart = function(cbk){
        eventSignal.on('collisionstart',cbk,this.obj);
    }
    this.onCollisionEnd = function(cbk){
        eventSignal.on('collisionend',cbk,this.obj);
    }
}
/**
 * 键码表<br/>
 * @class soya2d.KeyCode
 */
soya2d.KeyCode = {
	/**
     * DELETE键码
     * @property DELETE
     * @type {Number}
     * @static
     * @final
     */
	DELETE:46,
    /**
     * BACKSPACE键码
     * @property BACKSPACE
     * @type {Number}
     * @static
     * @final
     */
    BACKSPACE:8,
    /**
     * TAB键码
     * @property TAB
     * @type {Number}
     * @static
     * @final
     */
    TAB:9,
    /**
     * ENTER键码
     * @property ENTER
     * @type {Number}
     * @static
     * @final
     */
    ENTER:13,
    /**
     * SHIFT键码。左右相同
     * @property SHIFT
     * @type {Number}
     * @static
     * @final
     */
    SHIFT:16,
    /**
     * CONTROL键码。左右相同
     * @property CONTROL
     * @type {Number}
     * @static
     * @final
     */
    CONTROL:17,
    /**
     * ALT键码。左右相同
     * @property ALT
     * @type {Number}
     * @static
     * @final
     */
    ALT:18,
    /**
     * ESC键码
     * @property ESC
     * @type {Number}
     * @static
     * @final
     */
    ESC:27,
    /**
     * 方向键左键码
     * @property SPACE
     * @type {Number}
     * @static
     * @final
     */
    SPACE:32,
    /**
     * ENTER键码
     * @property LEFT
     * @type {Number}
     * @static
     * @final
     */
    LEFT:37,
    /**
     * 方向键上键码
     * @property UP
     * @type {Number}
     * @static
     * @final
     */
    UP:38,
    /**
     * 方向键右键码
     * @property RIGHT
     * @type {Number}
     * @static
     * @final
     */
    RIGHT:39,
    /**
     * 方向键下键码
     * @property DOWN
     * @type {Number}
     * @static
     * @final
     */
    DOWN:40,
    /**
     * 大写字母
     * @property A-Z
     * @type {Number}
     * @static
     * @final
     */
    A:65,
    B:66,
    
    C:67,
    
    D:68,
    
    E:69,
    
    F:70,
    
    G:71,
    
    H:72,
    
    I:73,
    
    J:74,
    
    K:75,
    
    L:76,
    
    M:77,
    
    N:78,
    
    O:79,
    
    P:80,
    
    Q:81,
    
    R:82,
    
    S:83,
    
    T:84,
    
    U:85,
    
    V:86,
    
    W:87,
    
    X:88,
    
    Y:89,
    
    Z:90,
    /**
     * 小写字母
     * @property a-z
     * @type {Number}
     * @static
     * @final
     */
    a:97,
    
    b:98,
    
    c:99,
    
    d:100,
    
    e:101,
    
    f:102,
    
    g:103,
    
    h:104,
    
    i:105,
    
    j:106,
    
    k:107,
    
    l:108,
    
    m:109,
    
    n:110,
    
    o:111,
    
    p:112,
    
    q:113,
    
    r:114,
    
    s:115,
    
    t:116,
    
    u:117,
    
    v:118,
    
    w:119,
    
    x:120,
    
    y:121,
    
    z:122,
    /**
     * 功能键
     * @property F1-F12
     * @type {Number}
     * @static
     * @final
     */
    F1:112,
    F2:113,
    F3:114,
    F4:115,
    F5:116,
    F6:117,
    F7:118,
    F8:119,
    F9:120,
    F10:121,
    F11:122,
    F12:123,
    /**
     * 特殊符号
     * @property [ ] \ = - , . / ; '
     * @type {Number}
     * @static
     * @final
     */
    '[':219,
    ']':221,
    '\\':220,
    '=':187,
    '-':189,
    ',':188,
    '.':190,
    '/':191,
    ';':186,
    '\'':222
};
/**
 * @classdesc 事件监听器。用来监听输入设备产生的原生事件。
 * 在每帧渲染前，如果有事件发生，监听器会更新对应类型的输入设备参数
 * 
 * @class 
 */
function InputListener(data) {
	this.eventMap = {};

	soya2d.ext(this,data);
};
InputListener.prototype = {
	/**
	 * 保存事件。类型相同覆盖
	 * @param  {String} type 事件名
	 * @param  {Object} e 事件对象
	 */
	setEvent:function(type,e){
		this.eventMap[type] = e;
	},
	/**
	 * 每帧调用
	 */
    clear:function(){
    	for(var k in this.eventMap){
    		this.eventMap[k] = null;
    	}
    	this.eventMap = {};
    },
    start:function(game){
    	this.onInit(game);
    },
    scan:function(game){
    	this.onScan(game);
    }
};


///////////////////// 鼠标/触摸监听器 /////////////////////
var pointerListener = new InputListener({
    onInit:function(game) {
        var cvs = game.renderer.getCanvas();
        this.cvs = cvs;

        this.fn_md = this.doMousedown.bind(this);
        this.fn_mm = this.doMousemove.bind(this);
        this.fn_mu = this.doMouseup.bind(this);
        this.fn_mo = this.doMouseout.bind(this);
        this.fn_mov = this.doMouseover.bind(this);

        this.fn_ts = this.doStart.bind(this);
        this.fn_tm = this.doMove.bind(this);
        this.fn_te = this.doEnd.bind(this);
        this.fn_tc = this.doCancel.bind(this);
    
        if(soya2d.Device.mobile){
            this.bindTouch(cvs);
        }else{
            this.bindMouse(cvs);
        }

        this.lastTapTime = 0;
        this.lastClickTime = 0;

        this.inList = [];//for over/out

        this.pressStartTime = 0;
    },
    bindMouse:function(cvs) {
        this.pointerType = 'mouse';
        //mouse
        cvs.addEventListener('mousedown',this.fn_md,true);
        cvs.addEventListener('mousemove',this.fn_mm,true);
        cvs.addEventListener('mouseup',this.fn_mu,true);
        window.addEventListener('blur',this.fn_tc,true);
        //stage
        cvs.addEventListener('mouseout',this.fn_mo,true);
        cvs.addEventListener('mouseover',this.fn_mov,true);
    },
    bindTouch:function(cvs) {
        this.pointerType = 'touch';
        //touch
        cvs.addEventListener('touchstart',this.fn_ts,true);
        cvs.addEventListener('touchmove',this.fn_tm,true);
        cvs.addEventListener('touchend',this.fn_te,true);
        cvs.addEventListener('touchcancel',this.fn_tc,true);
    },
    changeType:function(type) {
        if(this.pointerType == type)return;
        var cvs = this.cvs;
        this.pressing = false;
        switch(type){
            case 'mouse':
                cvs.removeEventListener('touchstart',this.fn_ts,true);
                cvs.removeEventListener('touchmove',this.fn_tm,true);
                cvs.removeEventListener('touchend',this.fn_te,true);
                cvs.removeEventListener('touchcancel',this.fn_tc,true);
                this.bindMouse(cvs);
                break;
            case 'touch':
                cvs.removeEventListener('mousedown',this.fn_md,true);
                cvs.removeEventListener('mousemove',this.fn_mm,true);
                cvs.removeEventListener('mouseup',this.fn_mu,true);
                window.removeEventListener('blur',this.fn_tc,true);
                cvs.removeEventListener('mouseout',this.fn_mo,true);
                cvs.removeEventListener('mouseover',this.fn_mov,true);
                this.bindTouch(cvs);
                break;
        }
    },
    onScan:function(game){
        var input = game.input.pointer;
        var renderer = game.renderer;

        var isDown = false,
            isUp = false,
            isMove = false,
            e = null;
        if(this.eventMap['down']){
            isDown = true;
            e = this.eventMap['down'];

            eventSignal.emit('pointerdown',e);
        }else if(this.eventMap['up']){
            isUp = true;
            e = this.eventMap['up'];

            eventSignal.emit('pointerup',e);
        }

        if(this.eventMap['move']){
            isMove = true;
            e = this.eventMap['move'];

            eventSignal.emit('pointermove',e);
        }
        if(this.eventMap['tap']){
            e = this.eventMap['tap'];

            eventSignal.emit('pointertap',e);
        }
        if(this.eventMap['dbltap']){
            e = this.eventMap['dbltap'];

            eventSignal.emit('pointerdbltap',e);
        }

        input.isDown = isDown;
        input.isUp = isUp;
        input.isMove = isMove;
        input.isPressing = this.pressing;
        input.duration = this.pressStartTime==0?0:Date.now() - this.pressStartTime;
        input.e = e;
        input.touches = [];
        
        if(!e)return;

        if(e.changedTouches){
            var points = this.handleTouches(e,e.changedTouches,game);
            input.position = points[0];
            input.touches = points;

            if(isMove){
                for(var i=points.length;i--;){
                    //一次事件只匹配一次
                    if(this.handleOverOut(e,points[i]))break;
                }
            }
        }else{
            input.button = {
                left:e.button==0||e.button==1,
                right:e.button==2,
                middle:e.button==4||e.which==2
            };
            var x = (e.offsetX||e.layerX) / renderer.hr;
            var y = (e.offsetY||e.layerY) / renderer.vr;
            input.position = new soya2d.Point(x,y);

            if(isMove){
                this.handleOverOut(e,input.position);
            }
        }

        if(this.eventMap['enterstage']){
            eventSignal.emit('enterstage',this.eventMap['enterstage']);
        }
        if(this.eventMap['leavestage']){
            eventSignal.emit('leavestage',this.eventMap['leavestage']);
        }

        if(this.eventMap['cancel']){
            eventSignal.emit('pointercancel',this.eventMap['cancel']);
        }
    },
    handleOverOut:function(e,point){
        //over/out
        var ooList = [];
        var map = eventSignal.__sigmap;
        var overList = map['pointerover'];
        var outList = map['pointerout'];
        if(overList){
            overList.forEach(function(o){
                ooList.push(o);
            });
        }
        if(outList){
            outList.forEach(function(o){
                for(var i=ooList.length;i--;){
                    if(ooList[i][1] == o[1])return;
                }

                ooList.push(o);
            });
        }
        if(ooList.length>0){
            var currIn = [];
            var isMatch = false;
            ooList.forEach(function(o){
                var target = o[1];
                var fn = o[0];
                if(!target.hitTest || !target.hitTest(point.x,point.y))return;

                currIn.push(target);
                if(this.inList.indexOf(target) > -1)return;
                this.inList.push(target);
                
                eventSignal.emit('pointerover',e);

                isMatch = true;
            },this);

            var toDel = [];
            this.inList.forEach(function(sp){
                if(currIn.indexOf(sp) < 0){
                    toDel.push(sp); 
                }
            });
            if(toDel.length<1)return;
            for(var i=toDel.length;i--;){
                var k = this.inList.indexOf(toDel[i]);
                this.inList.splice(k,1);
                var target = toDel[i];

                eventSignal.emit('pointerout',e);

                isMatch = true;
            }
            return isMatch;
        }
    },
    doMousedown:function(e){
        this.setEvent('down',e);

        this.pressing = true;
        this.pressStartTime = Date.now();
    },
    doMousemove:function(e){
        this.setEvent('move',e);
    },
    doMouseup:function(e){
        this.pressing = false;
        this.pressStartTime = 0;

        this.setEvent('up',e);

        if(this.canceled)return;
        if(e.button === 0){
            this.setEvent('tap',e);
            if(Date.now() - this.lastClickTime < 300){
                this.setEvent('dbltap',e);
            }

            this.lastClickTime = Date.now();
        }
    },
    doMouseover:function(e){
        this.setEvent('enterstage',e);
    },
    doMouseout:function(e){
        this.setEvent('leavestage',e);
    },
    handleTouches:function(e,touches,game){
        var touchList = [];
        var points = [];
        if(touches && touches.length>0){
            var t = e.target||e.srcElement;
            var ol=t.offsetLeft,ot=t.offsetTop;
            while((t=t.offsetParent) && t.tagName!='BODY'){
                ol+=t.offsetLeft-t.scrollLeft;
                ot+=t.offsetTop-t.scrollTop;
            }
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
                scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
            for(var i=0;i<touches.length;i++){
                var tev = touches[i];
                touchList[i] = tev.clientX - ol + scrollLeft;
                touchList[i+1] = tev.clientY - ot + scrollTop;
            }
        }

        var renderer = game.renderer;
        var cvs = renderer.getCanvas();
        var marginLeft = window.getComputedStyle(cvs,null).marginLeft;
        marginLeft = parseFloat(marginLeft) || 0;
        var marginTop = window.getComputedStyle(cvs,null).marginTop;
        marginTop = parseFloat(marginTop) || 0;
        
        for(var i=0;i<touchList.length;i+=2){
            var x = touchList[i];
            var y = touchList[i+1];
            
            switch(game.stage.rotateMode){
                case soya2d.ROTATEMODE_90:
                    //平移，计算出canvas内坐标
                    x = x + cvs.offsetLeft - marginTop;
                    y = y + cvs.offsetTop - marginLeft;
                    
                    //旋转
                    var tmp = x;
                    x = y;
                    y = thisGame.stage.w - Math.abs(tmp);
                    break;
                case soya2d.ROTATEMODE_270:
                    //平移，计算出canvas内坐标
                    x = x + cvs.offsetLeft - marginTop;
                    y = y + cvs.offsetTop - marginLeft;
                    
                    //旋转
                    var tmp = y;
                    y = x;
                    x = thisGame.stage.h - Math.abs(tmp);
                    break;
                case soya2d.ROTATEMODE_180:
                    //旋转
                    x = thisGame.stage.w - Math.abs(x);
                    y = thisGame.stage.h - Math.abs(y);
                    break;
            }
            
            x = x / renderer.hr;
            y = y / renderer.vr;  

            points.push(new soya2d.Point(x,y));
        }

        return points;
    },
    doStart:function(e){
        this.setEvent('down',e);

        this.pressing = true;
        this.pressStartTime = Date.now();

        this.hasMoved = false;
        this.canceled = false;
    },
    doMove:function(e){
        this.setEvent('move',e);
        this.hasMoved = true;
    },
    doCancel:function(e){
        this.canceled = true;
        this.setEvent('cancel',e);

        this.pressing = false;
        this.pressStartTime = 0;
    },
    doEnd:function(e){
        this.setEvent('up',e);

        if(e.touches.length < 1){
            this.pressing = false;
            this.pressStartTime = 0;
        }

        if(this.canceled)return;
        if(!this.hasMoved){
            this.setEvent('tap',e);

            if(Date.now() - this.lastTapTime < 300){
                this.setEvent('dbltap',e);
            }

            this.lastTapTime = Date.now();
        }
    }

});

///////////////////// 键盘事件分派器 /////////////////////
var keyboardListener = new InputListener({
    onInit:function() {
        window.addEventListener('keyup',this.doKeyUp.bind(this),false);
        window.addEventListener('keydown',this.doKeyDown.bind(this),false);
        window.addEventListener('blur',this.doBlur.bind(this),false);

        this.preesingKeys = [];//keycode

        this.pressing = false;//is key pressing

        this.lastEv = null;
    },
    onScan:function(game){
        var input = game.input.keyboard;

        var isDown = false,
            isUp = false,
            isPress = false,
            e = this.lastEv;
        if(this.eventMap['down']){
            isDown = true;
            this.lastEv = e = this.eventMap['down'];

            eventSignal.emit('keydown',e);
        }else if(this.eventMap['up']){
            isUp = true;
            this.lastEv = e = this.eventMap['up'];

            eventSignal.emit('keyup',e);
        }

        if(this.pressing){
            eventSignal.emit('keypress',e);
        }
        
        input.isDown = isDown;
        input.isUp = isUp;
        input.isPressing = this.pressing;
        input.e = e;
        input.shiftKey = e?e.shiftKey:false;
        input.metaKey = e?e.metaKey:false;
        input.ctrlKey = e?e.ctrlKey:false;
        input.altKey = e?e.altKey:false;
        input.keys = this.preesingKeys;
    },
    doKeyUp:function(e){
        var keys = this.preesingKeys;
        var keycode = e.keyCode||e.which;
        var i = keys.indexOf(keycode);
        if(i>-1){
            keys.splice(i,1);
        }

        //没有按键
        if(keys.length<1){
            this.pressing = false;
        }

        this.setEvent('up',e);
    },
    doKeyDown:function(e){
        var keys = this.preesingKeys;
        var keycode = e.keyCode||e.which;
        if(keys.indexOf(keycode)<0){
            keys.push(keycode);
        }else{
            return;
        }

        this.pressing = true;

        this.setEvent('down',e);
    },
    doBlur:function(e){
        this.preesingKeys = [];
        this.pressing = false;
    }
});

///////////////////// 设备事件分派器 /////////////////////
var deviceListener = new InputListener({
    onInit:function() {
        window.addEventListener('orientationchange',this.doHOV.bind(this),false);
        window.addEventListener('deviceorientation',this.doTilt.bind(this),false);
        window.addEventListener('devicemotion',this.doMotion.bind(this),false);
    },
    onScan:function(game){
        var input = game.input.device;
        var e = null;

        if(this.eventMap['hov']){
            e = this.eventMap['hov'];

            if(this.timer)clearTimeout(this.timer);
            var that = this;
            //start timer
            this.timer = setTimeout(function(){
                var orientation = that.getOrientation();
                eventSignal.emit('hov',orientation);
            },500);
        }
        if(this.eventMap['tilt']){
            e = this.eventMap['tilt'];

            var tilt = {
                z: e.alpha,
                x: e.beta,
                y: e.gamma,
                absolute: e.absolute
            };
            input.tilt = tilt;

            eventSignal.emit('tilt',tilt);
        }
        if(this.eventMap['motion']){
            e = this.eventMap['motion'];

            var motion = {
                x: e.acceleration.x,
                y: e.acceleration.y,
                z: e.acceleration.z,
                interval: e.interval
            };
            input.motion = motion;

            eventSignal.emit('motion',motion);
        }

        input.e = e;
    },
    getOrientation:function(){
        var w = window.innerWidth;
        var h = window.innerHeight;
        var rs;
        if(w > h){
            rs = 'landscape';
        }else{
            rs = 'portrait';
        }
        return rs;
    },
    doHOV:function(e){
        this.setEvent('hov',e);
    },
    doTilt:function(e){
        this.setEvent('tilt',e);
    },
    doMotion:function(e){
        this.setEvent('motion',e);
    }
});
!function(){
    /**
     * 补间对象，可以对显示对象的属性进行线性插值，从而实现平滑的变换动画。
     * 补间对象是一个链式结构，内部保存了一个补间序列，根据创建时添加的补间块，
     * 可以实现多段顺序补间效果。
     * ```
     * game.tween.add(this).to(...).to(...).to(...).play();
     * ```
     * 同时，针对一个显示对象可以创建多个补间对象，形成并行补间效果。注意，如果不同补间对象
     * 针对同一个属性进行补间，那么先执行的会被覆盖
     * ```
     * game.tween.add(this).to({x:'+50',y:'+150'},0.1).play();
     * game.tween.add(this).to({w:200,h:400},1).play();
     * ```
     * @class soya2d.Tween
     * @constructor
     * @param {Object} target 补间目标
     * @extends Signal
     */
    soya2d.class("soya2d.Tween",{
        extends:Signal,
        constructor:function(target){
            /**
             * 补间目标
             * @property target
             * @type {Object}
             */
            this.target = target;
            this.__tds = {};
            this.__startTimes = [];
            this.__long = 0;
            /**
             * 播放头位置
             * @property position
             * @type {Number}
             */
            this.position = 0;
            this.__reversed = false;
            this.__paused = false;
            this.__infinite = false;

            this.__state = {};

            this.__status = 'paused';

            this.__runningTD;

            this.__changeTimes = 0;
            this.__lastChangeTD;
        },
        __calc:function(attris,duration,easing){
            var keys = Object.keys(attris);
            var attr = {},
                cacheRatio = {};//用于传递给onupdate
            //初始化指定属性的step
            for(var i=keys.length;i--;){//遍历引擎clone的对象，不包括引擎属性
                var k = keys[i];

                //没有该属性直接跳过
                var val = this.__state[k];
                if(val===undefined){
                    val = this.target[k];
                }
                if(val===undefined)continue;

                var initVal = parseFloat(val||0);
                var endVal = attris[k];
                if(typeof endVal === 'string' || endVal instanceof String){//relative
                    if(endVal.indexOf('-')===0){
                        endVal = initVal-parseFloat(endVal.substring(1,endVal.length));
                    }else if(endVal.indexOf('+')===0){
                        endVal = initVal+parseFloat(endVal.substring(1,endVal.length));
                    }else{
                        endVal = parseFloat(endVal);
                    }
                }
                var varVal = (endVal-initVal);
                attr[k] = {'initVal':initVal,'varVal':varVal,'endVal':endVal};
                this.__state[k] = endVal;

                //预计算。精度为10MS
                if(this.cacheable){
                    var dVal = attr[k].dVal = {};
                    for(var j=0;(j+=10)<duration;){
                        var r = easing(j,0,1,duration);
                        cacheRatio['p_'+j] = r;
                        dVal['p_'+j] = initVal + varVal*r;
                    }
                }//over if
            }//over for

            return [attr,cacheRatio];
        },
        /**
        * 给当前补间链添加一个补间块
        * @method to
        * @param {Object} attris 补间目标属性
        * @param {int} duration 补间周期(ms)
        * @param {Object} [opts] 补间属性
        * @param {Function} [opts.easing=soya2d.Tween.Linear] 补间类型
        * @param {Boolean} [opts.cacheable=false] 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
        * @param {Number} [opts.repeat=0] 循环播放次数，-1为无限
        * @param {Boolean} [opts.yoyo=false] 是否交替反向播放动画，只在循环启用时生效
        * @param {Number} [opts.delay] 延迟时间(ms)
        * @param {Boolean} [opts.clear=true] 是否在执行完成后自动销毁释放内存
        * @see {soya2d.Tween.Linear}
        * @chainable
         */
        to:function(attris,duration,opts){
            if(this.__infinite)return this;
            duration = duration||1;
            opts = opts || {};
            var easing = opts.easing||soya2d.Tween.Linear;
            var data = this.__calc(attris,duration,easing);

            var yoyo = opts.yoyo||false;
            var repeat = opts.repeat||0;
            var odd = repeat % 2;
            if(yoyo && odd){
                for(var k in data[0]){
                    this.__state[k] = data[0][k].initVal;
                }
            }
            var state = {};
            soya2d.ext(state,this.__state);

            var td = new TweenData(data,state,duration,opts);
            this.__long += td.delay;

            for(var tdk in this.__tds){
                var t = this.__tds[tdk];
                for(var k in data[0]){
                    if(t.__initState[k] === undefined)
                        t.__initState[k] = data[0][k].initVal;
                }
            }

            this.__tds[this.__long] = td;
            this.__startTimes.push(this.__long);
            td.__startPos = this.__long;
            if(td.repeat === -1){
                this.__infinite = true;
                soya2d.console.warn('infinite loop instance');
            }
            this.__long += td.duration * (td.repeat+1);

            return this;
        },
        /**
         * 启动补间器。执行完后自动删除该补间实例
         * @method play
         * @param {Boolean} keepAlive 是否在补间执行完后继续保留实例
         * @chainable
         */
        play:function(keepAlive){
            this.__reversed = false;
            this.__status = 'running';

            this.keepAlive = keepAlive;
            
            return this;
        },
        /**
         * 反向执行补间
         * @method reverse
         * @chainable
         */
        reverse:function(){
            if(this.__infinite)return;
            this.__status = 'running';
            this.__reversed = true;

            return this;
        },
        /**
         * 暂停补间器
         * @method pause
         * @chainable
         */
        pause:function(){
            this.__status = 'paused';
            this.emit('pause');
            return this;
        },
        /**
         * 重置补间，播放头归0
         * @param {Boolean} keepAlive 是否在补间执行完后继续保留实例
         * @chainable
         */
        restart:function(keepAlive){
            this.position = 0;
            this.play(keepAlive);

            return this;
        },
        __getTD:function(){
            for(var i=this.__startTimes.length;i--;){
                if(this.position >= this.__startTimes[i]){
                    return this.__tds[this.__startTimes[i]];
                }
            }
        },
        __onUpdate:function(r,td){
            this.emit('process',r,this.position / this.__long);
            if(((r >= 1 && !this.__reversed) || (r === 0 && this.__reversed)) && 
                this.__lastChangeTD != td){
                
                this.__onChange(++this.__changeTimes);
                this.__lastChangeTD = td;
            }
        },
        __onChange:function(times){
            this.emit('change',times);
        },
        __onEnd:function(){
            this.emit('stop');
            
            if(!this.keepAlive){
                this.destroy();
            }
        },
        __update:function(now,d){
            if(this.__status !== 'running')return;

            if(this.position > this.__long && !this.__reversed && !this.__infinite){
                this.position = this.__long;
                this.pause();
                this.__onEnd();
                return;
            }else if(this.position < 0 && this.__reversed && !this.__infinite){
                this.position = 0;
                this.pause();
                this.__onEnd();
                return;
            }

            d = this.__reversed?-d:d;
            this.position += d;

            var td = this.__getTD();
            if(!td)return;
            if(this.__runningTD !== td){
                this.__runningTD = td;
                this.__runningTD.__inited = false;
            }

            td.update(
                this,
                this.position);
        },
        /**
         * 销毁补间实例
         * @method destroy
         */
        destroy:function(){
            this.__manager.__remove(this);
            
            for(var k in this.__tds){
                this.__tds[k].destroy();
            }
            this.__tds = null;
            this.target = null;
            this.__currentTD = null;            
        }
    });

    /**
     * 补间数据，保存了一个补间段的相关信息。一个补间实例包含1-N个补间数据
     * @class TweenData
     */
    function TweenData(data,state,duration,opts){
        /**
         * 补间时长(s)
         * @property duration
         * @type {Number}
         */
        this.duration = duration * 1000;

        opts = opts||{};
        /**
         * 补间算法
         * @property easing
         * @type {Function}
         */
        this.easing = opts.easing||soya2d.Tween.Linear;
        /**
         * 循环播放次数，-1为无限
         * @property repeat
         * @type {int}
         */
        this.repeat = opts.repeat||0;
        /**
         * 是否交替反向播放动画，只在循环多于1次时有效
         * @property yoyo
         * @type {Boolean}
         */
        this.yoyo = opts.yoyo||false;
        /**
         * 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
         * @property cacheable
         * @type {Boolean}
         */
        this.cacheable = opts.cacheable||false;
        /**
         * 延迟时间(s)
         * @property delay
         * @type {Number}
         */
        this.delay = (opts.delay||0) * 1000;

        //用来保存每个属性的，变化值，补间值
        this.__attr = data[0];
        this.__attriNames = Object.keys(data[0]);
        this.__ratio = data[1];

        this.__initState = state;

        this.__loops = 0;//已经循环的次数
    }
    TweenData.prototype = {
        update:function(tween,pos){
            var c = pos - this.__startPos;
            if(this.repeat !== 0){
                this.__loops = Math.ceil(c / this.duration) - 1;

                if(this.repeat > 0 && this.__loops > this.repeat)return;

                c = c % this.duration;
            }else{
                c = c>this.duration?this.duration:c;
            }

            var t = tween.target;
            if(!this.__inited){
                for(var k in this.__initState){
                    t[k] = this.__initState[k];
                }
                this.__inited = true;
            }
            
            var ratio;
            if(this.repeat === 0){
                ratio = this.goTo(t,c);
            }else{
                var odd = this.__loops % 2;
                if(odd && this.__loops > 0 && this.yoyo){
                    ratio = this.goTo(t,c,true);
                }else{
                    ratio = this.goTo(t,c);
                }
            }

            tween.__onUpdate(ratio,this);
        },
        goTo:function(target,time,reverse){
            var ratio,attNames=this.__attriNames,attr=this.__attr,t=target;
            //预计算
            if(this.cacheable){
                var phase = 'p_'+(time/10>>0)*10;
                ratio = this.__ratio[phase];
                if(phase==='p_0')ratio=0;
                if(ratio===undefined)ratio = 1;
                //更新参数
                for(var i=attNames.length;i--;){
                    var k = attNames[i];
                    if(!attr[k])continue;
                    var v = attr[k].dVal[phase];
                    if(v===undefined)v = attr[k].endVal;
                    t[k] = v;
                }
            }else{
                if(time < 0)time = 0;
                ratio = this.easing(time,0,1,this.duration);
                if(time > this.duration)ratio=1;
                // console.log(ratio)
                //更新参数
                for(var i=attNames.length;i--;){
                    var k = attNames[i];
                    if(attr[k])
                    t[k] = attr[k].initVal + attr[k].varVal*(reverse?1-ratio:ratio);
                }
            }
            return ratio;
        },
        destroy:function(){
            this.__attr = null;
            this.__ratio = null;
            this.easing = null;
            this.target = null;
            this.onUpdate = null;
            this.onEnd = null;
        }
    };

}();

/**
 * 补间执行事件
 * @event process
 * @for soya2d.Tween
 * @param {Number} ratio 补间段执行率
 * @param {Number} rate 补间完成率
 */
/**
 * 补间段切换时触发
 * @event change
 * @for soya2d.Tween
 * @param {Number} times 切换次数
 */
/**
 * 补间停止事件
 * @event stop
 * @for soya2d.Tween
 */
/**
 * 补间暂停事件
 * @event pause
 * @for soya2d.Tween
 */
!function(){
    /**
     * tween模块定义了soya2d中内置的补间系统。支持路径补间和普通补间。
     * 支持针对同一个target的补间链以及并行补间。
     * <b>该模块是扩展模块，可以自行卸载</b>
     * @module tween
     */
    /**
     * 路径补间对象，功能和{{#crossLink "soya2d.Tween"}}{{/crossLink}}相同，但路径补间只针对
     * 补间目标的x/y进行补间。
     * @class soya2d.PathTween
     * @constructor
     * @param {Object} target 补间目标
     * @extends Signal
     */
    soya2d.class("soya2d.PathTween",{
        extends:Signal,
        constructor:function(target){
            /**
             * 补间目标
             * @property target
             * @type {Object}
             */
            this.target = target;
            this.__tds = {};
            this.__startTimes = [];
            this.__long = 0;
            /**
             * 播放头位置
             * @property position
             * @type {Number}
             */
            this.position = 0;
            this.__reversed = false;
            this.__paused = false;
            this.__infinite = false;

            this.__status = 'paused';

            this.__runningTD;

            this.__changeTimes = 0;
            this.__lastChangeTD;
        },
        __calc:function(path,duration,easing){
            var sx=0,sy=0;
            var ox=0,oy=0;
            var __pps = [];
            if(typeof(path) === 'string'){
                path = new soya2d.Path(path);
            }
            path._insQ.forEach(function(ins){
                var type = ins[0].toLowerCase();
                switch(type){
                    case 'm':ox=sx=parseFloat(ins[1][0]),oy=sy=parseFloat(ins[1][1]);break;
                    case 'l':
                        var xys = ins[1];
                        for(var i=0;i<xys.length;i+=2){

                            var r = Math.atan2(xys[i+1] - sy,xys[i] - sx);
                            var len = soya2d.Math.len2D(sx,sy,xys[i],xys[i+1]);
                            
                            for(var d=0;d<len;d++){
                                var x = d*Math.cos(r) + sx;
                                var y = d*Math.sin(r) + sy;
                                __pps.push(x,y);
                            }

                            sx=parseFloat(xys[i]),sy=parseFloat(xys[i+1]);
                        }
                        break;
                    case 'c':
                        var pps = [];
                        var xys = ins[1];
                        for(var i=0;i<xys.length;i+=6){
                            for(var t=0;t<1;t+=.01){
                                var ts = t*t;
                                var tc = ts*t;

                                var x = sx*(1-3*t+3*ts-tc) + 3*xys[i]*t*(1-2*t+ts) + 3*xys[i+2]*ts*(1-t) + xys[i+4]*tc;
                                var y = sy*(1-3*t+3*ts-tc) + 3*xys[i+1]*t*(1-2*t+ts) + 3*xys[i+3]*ts*(1-t) + xys[i+5]*tc;
                                pps.push(x,y);
                            }
                            sx=parseFloat(xys[i+4]),sy=parseFloat(xys[i+5]);
                        }
                        if(pps[pps.length-2] != xys[xys.length-2] || 
                            pps[pps.length-1] != xys[xys.length-1] ){
                            pps.push(xys[xys.length-2],xys[xys.length-1]);
                        }
                        var totalLen = 0;
                        var ks = {};
                        for(var i=0;i<pps.length-2;i+=2){
                            var len = soya2d.Math.len2D(pps[i],pps[i+1],pps[i+2],pps[i+3]);
                            
                            var r = Math.atan2(pps[i+3]-pps[i+1],pps[i+2]-pps[i]);
                            ks[totalLen] = [r,pps[i],pps[i+1],len];

                            totalLen += len;
                        }
                        var ppsa = [pps[0],pps[1]];
                        for(var i=1;i<totalLen;i++){
                            var r=0,nx,ny,s;
                            var keys = Object.keys(ks);
                            for(var k=keys.length;k--;){
                                s = parseFloat(keys[k]);
                                if(i>=s){
                                    r = ks[s][0];
                                    nx = ks[s][1];
                                    ny = ks[s][2];
                                    break;
                                }
                            }
                            if(r===0)continue;
                            var x = (i-s)*Math.cos(r) + nx;
                            var y = (i-s)*Math.sin(r) + ny;
                            ppsa.push(x,y);
                        }
                        
                        __pps = __pps.concat(ppsa);
                        break;
                    case 'q':
                        var pps = [];
                        var xys = ins[1];
                        for(var i=0;i<xys.length;i+=4){
                   
                            for(var t=0;t<1;t+=.01){
                                var ts = t*t;
                                var tc = ts*t;

                                var x = sx*(1-2*t+ts) + 2*xys[i]*t*(1-t) + xys[i+2]*ts;
                                var y = sy*(1-2*t+ts) + 2*xys[i+1]*t*(1-t) + xys[i+3]*ts;
                                pps.push(x,y);
                            }
                            sx=parseFloat(xys[i+2]),sy=parseFloat(xys[i+3]);
                        }
                        if(pps[pps.length-2] != xys[xys.length-2] || 
                            pps[pps.length-1] != xys[xys.length-1] ){
                            pps.push(xys[xys.length-2],xys[xys.length-1]);
                        }
                        var totalLen = 0;
                        var ks = {};
                        for(var i=0;i<pps.length-2;i+=2){
                            var len = soya2d.Math.len2D(pps[i],pps[i+1],pps[i+2],pps[i+3]);
                            
                            var r = Math.atan2(pps[i+3]-pps[i+1],pps[i+2]-pps[i]);
                            ks[totalLen] = [r,pps[i],pps[i+1],len];

                            totalLen += len;
                        }
                        var ppsa = [pps[0],pps[1]];
                        for(var i=1;i<totalLen;i++){
                            var r=0,nx,ny,s;
                            var keys = Object.keys(ks);
                            for(var k=keys.length;k--;){
                                s = parseFloat(keys[k]);
                                if(i>=s){
                                    r = ks[s][0];
                                    nx = ks[s][1];
                                    ny = ks[s][2];
                                    break;
                                }
                            }
                            if(r===0)continue;
                            var x = (i-s)*Math.cos(r) + nx;
                            var y = (i-s)*Math.sin(r) + ny;
                            ppsa.push(x,y);
                        }
                        
                        __pps = __pps.concat(ppsa);
                        break;
                    case 'z':
                        var r = Math.atan2(oy - sy,ox - sx);
                        var len = soya2d.Math.len2D(sx,sy,ox,oy);
     
                        for(var d=0;d<len;d++){
                            var x = d*Math.cos(r) + sx;
                            var y = d*Math.sin(r) + sy;
                            __pps.push(x,y);
                        }

                        break;
                }
            },this);

            return __pps;
        },
        /**
         * 给当前补间链添加一个路径
         * @method to
         * @param {String | soya2d.Path} path path字符串或者path对象
        * @param {int} duration 补间周期(ms)
        * @param {Object} [opts] 补间属性
        * @param {function} [opts.easing=soya2d.Tween.Linear] 补间类型
        * @param {boolean} [opts.cacheable=false] 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
        * @param {int} [opts.repeat=0] 循环播放次数，-1为无限
        * @param {boolean} [opts.yoyo=false] 是否交替反向播放动画，只在循环启用时生效
        * @param {int} [opts.delay] 延迟时间(ms)
        * @see {soya2d.Tween.Linear}
         */
        to:function(path,duration,opts){
            if(this.__infinite)return this;
            opts = opts || {};
            var easing = opts.easing||soya2d.Tween.Linear;
            var data = this.__calc(path,duration,easing);

            var td = new TweenData(data,duration,opts);
            this.__long += td.delay;

            this.__tds[this.__long] = td;
            this.__startTimes.push(this.__long);
            td.__startPos = this.__long;
            if(td.repeat === -1){
                this.__infinite = true;
                soya2d.console.warn('infinite loop instance');
            }
            this.__long += td.duration * (td.repeat+1);

            return this;
        },
        /**
         * 启动补间器。执行完后自动删除该补间实例
         * @method play
         * @param {Boolean} keepAlive 是否在补间执行完后继续保留实例
         * @chainable
         */
        play:function(keepAlive){
            this.__reversed = false;
            this.__status = 'running';

            this.keepAlive = keepAlive;
            
            return this;
        },
        /**
         * 反向执行补间
         * @method reverse
         * @chainable
         */
        reverse:function(){
            if(this.__infinite)return;
            this.__status = 'running';
            this.__reversed = true;

            return this;
        },
        /**
         * 暂停补间器
         * @method pause
         * @chainable
         */
        pause:function(){
            this.__status = 'paused';
            this.emit('pause');
            return this;
        },
        /**
         * 重置补间，播放头归0
         * @method restart
         * @chainable
         */
        restart:function(){
            this.position = 0;
            this.play();
            return this;
        },
        __getTD:function(){
            for(var i=this.__startTimes.length;i--;){
                if(this.position >= this.__startTimes[i]){
                    return this.__tds[this.__startTimes[i]];
                }
            }
        },
        __onUpdate:function(r,angle,td){
            this.emit('process',r,this.position / this.__long,angle);
            if(((r === 1 && !this.__reversed ) || (r === 0 && this.__reversed)) && 
                this.__lastChangeTD != td){
                
                this.__onChange(++this.__changeTimes);
                this.__lastChangeTD = td;
            }
        },
        __onChange:function(times){
            this.emit('change',times);
        },
        __onEnd:function(){
            this.emit('stop');

            if(!this.keepAlive){
                this.destroy();
            }
        },
        __update:function(now,d){
            if(this.__status !== 'running')return;

            if(this.position > this.__long && !this.__reversed){
                this.position = this.__long;
                this.pause();
                this.__onEnd();
                return;
            }else if(this.position < 0 && this.__reversed){
                this.position = 0;
                this.pause();
                this.__onEnd();
                return;
            }

            d = this.__reversed?-d:d;
            this.position += d;

            var td = this.__getTD();
            if(!td)return;
            if(this.__runningTD !== td){
                this.__runningTD = td;
                this.__runningTD.__inited = false;
            }
            

            td.update(
                this,
                this.position);
        },
        /**
         * 销毁补间实例
         * @method destroy
         */
        destroy:function(){
            this.__manager.__remove(this);
            
            for(var k in this.__tds){
                this.__tds[k].destroy();
            }
            this.__tds = null;
            this.target = null;
            this.__currentTD = null;
        }
    });

    //补间数据
    function TweenData(data,duration,opts){
        /**
         * 补间时长(s)
         * @type {Number}
         */
        this.duration = duration * 1000;

        opts = opts||{};
        /**
         * 补间算法
         * @type {Function}
         */
        this.easing = opts.easing||soya2d.Tween.Linear;
        /**
         * 循环播放次数，-1为无限
         * @type {int}
         */
        this.repeat = opts.repeat||0;
        /**
         * 是否交替反向播放动画，只在循环多于1次时有效
         * @type {Boolean}
         */
        this.yoyo = opts.yoyo||false;
        /**
         * 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
         * @type {Boolean}
         */
        this.cacheable = opts.cacheable||false;
        /**
         * 延迟时间(s)
         * @type {Number}
         */
        this.delay = (opts.delay||0) * 1000;

        //path points
        this.__pps = data;

        this.__radian = 0;
        this.__loops = 0;//已经循环的次数
    }
    TweenData.prototype = {
        update:function(tween,pos){
            var c = pos - this.__startPos;
            if(this.repeat !== 0){
                this.__loops = Math.ceil(c / this.duration) - 1;

                if(this.repeat > 0 && this.__loops > this.repeat)return;

                c = c % this.duration;
            }else{
                c = c>this.duration?this.duration:c;
            }

            var t = tween.target;
            if(!this.__inited){
                t.x = this.__pps[0];
                t.y = this.__pps[1];
                this.__inited = true;
            }
            
            var ratio;
            if(this.repeat === 0){
                ratio = this.goTo(t,c);
            }else{
                var odd = this.__loops % 2;
                if(odd && this.__loops > 0 && this.yoyo){
                    ratio = this.goTo(t,c,true);
                }else{
                    ratio = this.goTo(t,c);
                }
            }

            tween.__onUpdate(ratio,this.__radian*soya2d.Math.ONEANG,this);
        },
        goTo:function(target,time,reverse){
            var ratio,pps=this.__pps,t=target;
        
            if(time < 0)time = 0;
            ratio = this.easing(time,0,1,this.duration);

            var i = (pps.length-2) * (reverse?1-ratio:ratio) >> 0;
            if(i>pps.length-2)i=pps.length-2;
            if(i<0)i *= -1;
            if(i%2!=0){
                i++;
            }
            
            var ap = t.anchorPosition;
            t.x = pps[i] - ap.x;
            t.y = pps[i+1] - ap.y;

            var x = pps[i],
                y = pps[i+1];
            var nx,ny;
            if(i<1){
                nx = pps[i+2];
                ny = pps[i+3];

                this.__radian = Math.atan2(ny-y,nx-x);
            }else{
                nx = pps[i-2];
                ny = pps[i-1];

                this.__radian = Math.atan2(y-ny,x-nx);
            }
            
            return ratio;
        },
        destroy:function(){
            this.__pps = null;
            this.easing = null;
            this.target = null;
            this.onUpdate = null;
            this.onEnd = null;
        }
    };

}();

/**
 * 补间执行事件
 * @event process
 * @for soya2d.PathTween
 * @param {Number} ratio 补间段执行率
 * @param {Number} rate 补间完成率
 * @param {Number} angle 当前路径角度
 */
/**
 * 补间段切换时触发
 * @event change
 * @for soya2d.PathTween
 * @param {Number} times 切换次数
 */
/**
 * 补间停止事件
 * @event stop
 * @for soya2d.PathTween
 */
/**
 * 补间暂停事件
 * @event pause
 * @for soya2d.PathTween
 */
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
/*
 * t:第几帧
 * b:初始值
 * c:变化量(end - ini)
 * d:总帧数
 */

/**
 * 补间算法类型——Linear
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Linear
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Linear = function(t,b,c,d){ return c*t/d + b; }
/**
 * 补间算法类型——Quad
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Quad
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Quad = {
	/**
	 * In
	 * @property Quad.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return c*(t/=d)*t + b;
	},
	/**
	 * Out
	 * @property Quad.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return -c *(t/=d)*(t-2) + b;
	},
	/**
	 * InOut
	 * @property Quad.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	}
}
/**
 * 补间算法类型——Cubic
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Cubic
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Cubic = {
	/**
	 * In
	 * @property Cubic.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return c*(t/=d)*t*t + b;
	},
	/**
	 * Out
	 * @property Cubic.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	/**
	 * InOut
	 * @property Cubic.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}
}
/**
 * 补间算法类型——Quart
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Quart
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Quart = {
	/**
	 * In
	 * @property Quart.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return c*(t/=d)*t*t*t + b;
	},
	/**
	 * Out
	 * @property Quart.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	/**
	 * InOut
	 * @property Quart.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	}
}
/**
 * 补间算法类型——Quint
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Quint
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Quint = {
	/**
	 * In
	 * @property Quint.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return c*(t/=d)*t*t*t*t + b;
	},
	/**
	 * Out
	 * @property Quint.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	/**
	 * InOut
	 * @property Quint.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	}
}
/**
 * 补间算法类型——Sine
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Sine
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Sine = {
	/**
	 * In
	 * @property Sine.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	/**
	 * Out
	 * @property Sine.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	/**
	 * InOut
	 * @property Sine.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}
}
/**
 * 补间算法类型——Expo
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Expo
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Expo = {
	/**
	 * In
	 * @property Expo.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return (t===0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	/**
	 * Out
	 * @property Expo.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return (t===d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	/**
	 * InOut
	 * @property Expo.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if (t===0) return b;
		if (t===d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}
}
/**
 * 补间算法类型——Circ
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Circ
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Circ = {
	/**
	 * In
	 * @property Circ.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	/**
	 * Out
	 * @property Circ.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	/**
	 * InOut
	 * @property Circ.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	}
}
/**
 * 补间算法类型——Elastic
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Elastic
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Elastic = {
	/**
	 * In
	 * @property Elastic.In
	 * @type {Function}
	 */
	In: function(t,b,c,d,a,p){
		if (t===0) return b;  if ((t/=d)===1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	/**
	 * Out
	 * @property Elastic.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d,a,p){
		if (t===0) return b;  if ((t/=d)===1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
	},
	/**
	 * InOut
	 * @property Elastic.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d,a,p){
		if (t===0) return b;  if ((t/=d/2)===2) return b+c;  if (!p) p=d*(.3*1.5);
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	}
}
/**
 * 补间算法类型——Back
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Back
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Back = {
	/**
	 * In
	 * @property Back.In
	 * @type {Function}
	 */
	In: function(t,b,c,d,s){
		if (s === undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	/**
	 * Out
	 * @property Back.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d,s){
		if (s === undefined) s = .70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	/**
	 * InOut
	 * @property Back.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d,s){
		if (s === undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}
}
/**
 * 补间算法类型——Bounce
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Bounce
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Bounce = {
	/**
	 * In
	 * @property Bounce.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return c - soya2d.Tween.Bounce.Out(d-t, 0, c, d) + b;
	},
	/**
	 * Out
	 * @property Bounce.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	/**
	 * InOut
	 * @property Bounce.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if (t < d/2) return soya2d.Tween.Bounce.In(t*2, 0, c, d) * .5 + b;
		else return soya2d.Tween.Bounce.Out(t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
}

soya2d.module.install('tween',{
	onInit:function(game){
        /**
         * 补间管理器
         * @property tween
         * @type {soya2d.TweenManager}
         * @for soya2d.Game
         * @requires tween
         */
        game.tween = soya2d.TweenManager;
    },
    onBeforeUpdate:function(game,now,d){
    	soya2d.TweenManager.__update(now,d);
    },
    onStop:function(){
    	soya2d.TweenManager.pauseAll();
    }
});
/**
 * shapes模块定义了一些常用图元，方便开发者调用。<b>该模块是扩展模块，可以自行卸载</b>
 * @module shapes
 */
/**
 * 可以进行圆弧形填充或线框绘制的显示对象
 * @class soya2d.Arc
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {String} data.startAngle 弧形的开始角度
 */
soya2d.class("soya2d.Arc",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        data = data||{};
        this.bounds = new soya2d.Circle(0,0,this.w/2);
        this.fillStyle = data.fillStyle || 'transparent';
    },
    onRender:function(g){
        g.beginPath();

        var hw = this.w/2,
            hh = this.h/2;
        
        g.fillStyle(this.fillStyle);
        var sr = (this.startAngle||0)*soya2d.Math.ONERAD,
            er = (this.endAngle||0)*soya2d.Math.ONERAD;
        g.arc(hw,hh,this.w/2,sr,er);
        
        if(er-sr != 0 && Math.abs(this.startAngle||0 - this.endAngle||0) != 360){
            g.lineTo(hw,hh);
        }
        g.fill();
        g.closePath();
        
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
        g.moveTo(hw,hh);
    }
});
/**
 * 可以进行椭圆填充或线框绘制的显示对象
 * @class soya2d.Ellipse
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 */
soya2d.class("soya2d.Ellipse",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        data = data||{};
        this.fillStyle = data.fillStyle || 'transparent';
    },
    onRender:function(g){
        g.beginPath();
        g.fillStyle(this.fillStyle);
        g.ellipse(0,0,this.w,this.h);
        g.closePath();
        g.fill();
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
    }
});
/**
 * 可以进行多边形填充或线框绘制的显示对象
 * @class soya2d.Poly
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {Array} data.vtx 一维顶点数组 [x1,y1, x2,y2, ...]
 */
soya2d.class("soya2d.Poly",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        data = data||{};
        this.bounds = new soya2d.Polygon(data.vtx);
        this.fillStyle = data.fillStyle || 'transparent';
    },
    onRender:function(g){
        g.beginPath();
        g.fillStyle(this.fillStyle);
        g.polygon(this.vtx);
        g.fill();
        g.closePath();
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
    }
});
/**
 * 可以进行矩形填充或线框绘制的显示对象
 * @class soya2d.Rect
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 */
soya2d.class("soya2d.Rect",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        data = data||{};
        this.fillStyle = data.fillStyle || 'transparent';
    },
    onRender:function(g){
        g.beginPath();
        g.fillStyle(this.fillStyle);
        g.rect(0,0,this.w,this.h);
        g.fill();
        g.closePath();

        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
    }
});
/**
 * 可以进行规则多边形填充或线框绘制的显示对象。该多边形拥有内外两个半径，
 * 可以构成有趣的形状。外半径由对象的w属性决定，内半径则需要指定r属性
 * @class soya2d.RPoly
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {int} data.edgeCount 多边形的边数，不能小于3
 * @param {Number} [data.r] 内半径。默认和外半径相同
 */
soya2d.class("soya2d.RPoly",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        data = data||{};
        this.fillStyle = data.fillStyle || 'transparent';
    },
    onRender:function(g){
        g.beginPath();
        g.fillStyle(this.fillStyle);
        g.regularPolygon(this.w/2,this.h/2,this.edgeCount,this.r||this.w/2,this.w/2);
        g.closePath();
        g.fill();
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
    }
});
/**
 * 可以进行圆角矩形填充或线框绘制的显示对象
 * @class soya2d.RRect
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {number} data.lineWidth 线条宽度
 * @param {number} data.r 圆角半径
 */
soya2d.class("soya2d.RRect",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        data = data||{};
        this.fillStyle = data.fillStyle || 'transparent';
        this.r = data.r || 0;
    },
    onRender:function(g){
        g.beginPath();
        g.moveTo(0,0);
        g.fillStyle(this.fillStyle);
        g.roundRect(0,0,this.w,this.h,this.r<0?0:this.r);
        g.fill();
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
        g.closePath();
    }
});
/**
 * 可以进行椭圆弧形填充或线框绘制的显示对象
 * @class soya2d.EArc
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {String} data.startAngle 弧形的开始角度
 * @param {String} data.endAngle 弧形的结束角度
 */
soya2d.class("soya2d.EArc",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        data = data||{};
        this.fillStyle = data.fillStyle || 'transparent';
    },
    onRender:function(g){
        g.beginPath();

        g.fillStyle(this.fillStyle);
        var sa = this.startAngle || 0,
            ea = this.endAngle || 0;
        g.eArc(this.w/2,this.h/2,this.w/2,this.h/2,sa,ea);
        
        if(ea-sa != 0 && Math.abs(sa - ea) != 360){
            g.lineTo(this.w/2,this.h/2);
        }
        g.fill();
        g.closePath();
        
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
    }
});

soya2d.module.install('shapes',{
    onInit:function(game){
        game.objects.register('rect',soya2d.Rect);
        game.objects.register('rrect',soya2d.RRect);
        game.objects.register('poly',soya2d.Poly);
        game.objects.register('rpoly',soya2d.RPoly);
        game.objects.register('arc',soya2d.Arc);
        game.objects.register('earc',soya2d.EArc);
        game.objects.register('ellipse',soya2d.Ellipse);
    }
});
/*! howler.js v2.0.0 | (c) 2013-2016, James Simpson of GoldFire Studios | MIT License | howlerjs.com */
!function(){"use strict";var e=function(){this.init()};e.prototype={init:function(){var e=this||n;return e._codecs={},e._howls=[],e._muted=!1,e._volume=1,e._canPlayEvent="canplaythrough",e._navigator="undefined"!=typeof window&&window.navigator?window.navigator:null,e.masterGain=null,e.noAudio=!1,e.usingWebAudio=!0,e.autoSuspend=!0,e.ctx=null,e.mobileAutoEnable=!0,e._setup(),e},volume:function(e){var o=this||n;if(e=parseFloat(e),o.ctx||_(),"undefined"!=typeof e&&e>=0&&e<=1){if(o._volume=e,o._muted)return o;o.usingWebAudio&&(o.masterGain.gain.value=e);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),u=0;u<r.length;u++){var a=o._howls[t]._soundById(r[u]);a&&a._node&&(a._node.volume=a._volume*e)}return o}return o._volume},mute:function(e){var o=this||n;o.ctx||_(),o._muted=e,o.usingWebAudio&&(o.masterGain.gain.value=e?0:o._volume);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),u=0;u<r.length;u++){var a=o._howls[t]._soundById(r[u]);a&&a._node&&(a._node.muted=!!e||a._muted)}return o},unload:function(){for(var e=this||n,o=e._howls.length-1;o>=0;o--)e._howls[o].unload();return e.usingWebAudio&&"undefined"!=typeof e.ctx.close&&(e.ctx.close(),e.ctx=null,_()),e},codecs:function(e){return(this||n)._codecs[e]},_setup:function(){var e=this||n;return e.state=e.ctx?e.ctx.state||"running":"running",e._autoSuspend(),e.noAudio||e._setupCodecs(),e},_setupCodecs:function(){var e=this||n,o="undefined"!=typeof Audio?new Audio:null;if(!o||"function"!=typeof o.canPlayType)return e;var t=o.canPlayType("audio/mpeg;").replace(/^no$/,""),r=e._navigator&&e._navigator.userAgent.match(/OPR\/([0-6].)/g),u=r&&parseInt(r[0].split("/")[1],10)<33;return e._codecs={mp3:!(u||!t&&!o.canPlayType("audio/mp3;").replace(/^no$/,"")),mpeg:!!t,opus:!!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),oga:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!o.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),aac:!!o.canPlayType("audio/aac;").replace(/^no$/,""),caf:!!o.canPlayType("audio/x-caf;").replace(/^no$/,""),m4a:!!(o.canPlayType("audio/x-m4a;")||o.canPlayType("audio/m4a;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(o.canPlayType("audio/x-mp4;")||o.canPlayType("audio/mp4;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),webm:!!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),dolby:!!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/,"")},e},_enableMobileAudio:function(){var e=this||n,o=/iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(e._navigator&&e._navigator.userAgent),t=!!("ontouchend"in window||e._navigator&&e._navigator.maxTouchPoints>0||e._navigator&&e._navigator.msMaxTouchPoints>0);if(!e._mobileEnabled&&e.ctx&&(o||t)){e._mobileEnabled=!1,e._mobileUnloaded||44100===e.ctx.sampleRate||(e._mobileUnloaded=!0,e.unload()),e._scratchBuffer=e.ctx.createBuffer(1,1,22050);var r=function(){var n=e.ctx.createBufferSource();n.buffer=e._scratchBuffer,n.connect(e.ctx.destination),"undefined"==typeof n.start?n.noteOn(0):n.start(0),n.onended=function(){n.disconnect(0),e._mobileEnabled=!0,e.mobileAutoEnable=!1,document.removeEventListener("touchend",r,!0)}};return document.addEventListener("touchend",r,!0),e}},_autoSuspend:function(){var e=this;if(e.autoSuspend&&e.ctx&&"undefined"!=typeof e.ctx.suspend&&n.usingWebAudio){for(var o=0;o<e._howls.length;o++)if(e._howls[o]._webAudio)for(var t=0;t<e._howls[o]._sounds.length;t++)if(!e._howls[o]._sounds[t]._paused)return e;return e._suspendTimer&&clearTimeout(e._suspendTimer),e._suspendTimer=setTimeout(function(){e.autoSuspend&&(e._suspendTimer=null,e.state="suspending",e.ctx.suspend().then(function(){e.state="suspended",e._resumeAfterSuspend&&(delete e._resumeAfterSuspend,e._autoResume())}))},3e4),e}},_autoResume:function(){var e=this;if(e.ctx&&"undefined"!=typeof e.ctx.resume&&n.usingWebAudio)return"running"===e.state&&e._suspendTimer?(clearTimeout(e._suspendTimer),e._suspendTimer=null):"suspended"===e.state?(e.state="resuming",e.ctx.resume().then(function(){e.state="running"}),e._suspendTimer&&(clearTimeout(e._suspendTimer),e._suspendTimer=null)):"suspending"===e.state&&(e._resumeAfterSuspend=!0),e}};var n=new e,o=function(e){var n=this;return e.src&&0!==e.src.length?void n.init(e):void console.error("An array of source files must be passed with any new Howl.")};o.prototype={init:function(e){var o=this;return n.ctx||_(),o._autoplay=e.autoplay||!1,o._format="string"!=typeof e.format?e.format:[e.format],o._html5=e.html5||!1,o._muted=e.mute||!1,o._loop=e.loop||!1,o._pool=e.pool||5,o._preload="boolean"!=typeof e.preload||e.preload,o._rate=e.rate||1,o._sprite=e.sprite||{},o._src="string"!=typeof e.src?e.src:[e.src],o._volume=void 0!==e.volume?e.volume:1,o._duration=0,o._state="unloaded",o._sounds=[],o._endTimers={},o._queue=[],o._onend=e.onend?[{fn:e.onend}]:[],o._onfade=e.onfade?[{fn:e.onfade}]:[],o._onload=e.onload?[{fn:e.onload}]:[],o._onloaderror=e.onloaderror?[{fn:e.onloaderror}]:[],o._onpause=e.onpause?[{fn:e.onpause}]:[],o._onplay=e.onplay?[{fn:e.onplay}]:[],o._onstop=e.onstop?[{fn:e.onstop}]:[],o._onmute=e.onmute?[{fn:e.onmute}]:[],o._onvolume=e.onvolume?[{fn:e.onvolume}]:[],o._onrate=e.onrate?[{fn:e.onrate}]:[],o._onseek=e.onseek?[{fn:e.onseek}]:[],o._webAudio=n.usingWebAudio&&!o._html5,"undefined"!=typeof n.ctx&&n.ctx&&n.mobileAutoEnable&&n._enableMobileAudio(),n._howls.push(o),o._preload&&o.load(),o},load:function(){var e=this,o=null;if(n.noAudio)return void e._emit("loaderror",null,"No audio support.");"string"==typeof e._src&&(e._src=[e._src]);for(var r=0;r<e._src.length;r++){var a,d;if(e._format&&e._format[r])a=e._format[r];else{if(d=e._src[r],"string"!=typeof d){e._emit("loaderror",null,"Non-string found in selected audio sources - ignoring.");continue}a=/^data:audio\/([^;,]+);/i.exec(d),a||(a=/\.([^.]+)$/.exec(d.split("?",1)[0])),a&&(a=a[1].toLowerCase())}if(n.codecs(a)){o=e._src[r];break}}return o?(e._src=o,e._state="loading","https:"===window.location.protocol&&"http:"===o.slice(0,5)&&(e._html5=!0,e._webAudio=!1),new t(e),e._webAudio&&u(e),e):void e._emit("loaderror",null,"No codec support for selected audio sources.")},play:function(e,o){var t=this,r=null;if("number"==typeof e)r=e,e=null;else{if("string"==typeof e&&"loaded"===t._state&&!t._sprite[e])return null;if("undefined"==typeof e){e="__default";for(var u=0,a=0;a<t._sounds.length;a++)t._sounds[a]._paused&&!t._sounds[a]._ended&&(u++,r=t._sounds[a]._id);1===u?e=null:r=null}}var d=r?t._soundById(r):t._inactiveSound();if(!d)return null;if(r&&!e&&(e=d._sprite||"__default"),"loaded"!==t._state&&!t._sprite[e])return t._queue.push({event:"play",action:function(){t.play(t._soundById(d._id)?d._id:void 0)}}),d._id;if(r&&!d._paused)return o||setTimeout(function(){t._emit("play",d._id)},0),d._id;t._webAudio&&n._autoResume();var i=d._seek>0?d._seek:t._sprite[e][0]/1e3,_=(t._sprite[e][0]+t._sprite[e][1])/1e3-i,s=1e3*_/Math.abs(d._rate);d._paused=!1,d._ended=!1,d._sprite=e,d._seek=i,d._start=t._sprite[e][0]/1e3,d._stop=(t._sprite[e][0]+t._sprite[e][1])/1e3,d._loop=!(!d._loop&&!t._sprite[e][2]);var l=d._node;if(t._webAudio){var f=function(){t._refreshBuffer(d);var e=d._muted||t._muted?0:d._volume;l.gain.setValueAtTime(e,n.ctx.currentTime),d._playStart=n.ctx.currentTime,"undefined"==typeof l.bufferSource.start?d._loop?l.bufferSource.noteGrainOn(0,i,86400):l.bufferSource.noteGrainOn(0,i,_):d._loop?l.bufferSource.start(0,i,86400):l.bufferSource.start(0,i,_),s!==1/0&&(t._endTimers[d._id]=setTimeout(t._ended.bind(t,d),s)),o||setTimeout(function(){t._emit("play",d._id)},0)};"loaded"===t._state?f():(t.once("load",f,d._id),t._clearTimer(d._id))}else{var c=function(){l.currentTime=i,l.muted=d._muted||t._muted||n._muted||l.muted,l.volume=d._volume*n.volume(),l.playbackRate=d._rate,setTimeout(function(){l.play(),s!==1/0&&(t._endTimers[d._id]=setTimeout(t._ended.bind(t,d),s)),o||t._emit("play",d._id)},0)},p="loaded"===t._state&&(window&&window.ejecta||!l.readyState&&n._navigator.isCocoonJS);if(4===l.readyState||p)c();else{var m=function(){c(),l.removeEventListener(n._canPlayEvent,m,!1)};l.addEventListener(n._canPlayEvent,m,!1),t._clearTimer(d._id)}}return d._id},pause:function(e){var n=this;if("loaded"!==n._state)return n._queue.push({event:"pause",action:function(){n.pause(e)}}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused){if(r._seek=n.seek(o[t]),r._rateSeek=0,r._paused=!0,n._stopFade(o[t]),r._node)if(n._webAudio){if(!r._node.bufferSource)return n;"undefined"==typeof r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),n._cleanBuffer(r._node)}else isNaN(r._node.duration)&&r._node.duration!==1/0||r._node.pause();arguments[1]||n._emit("pause",r._id)}}return n},stop:function(e,n){var o=this;if("loaded"!==o._state)return o._queue.push({event:"stop",action:function(){o.stop(e)}}),o;for(var t=o._getSoundIds(e),r=0;r<t.length;r++){o._clearTimer(t[r]);var u=o._soundById(t[r]);if(u&&!u._paused&&(u._seek=u._start||0,u._rateSeek=0,u._paused=!0,u._ended=!0,o._stopFade(t[r]),u._node))if(o._webAudio){if(!u._node.bufferSource)return o;"undefined"==typeof u._node.bufferSource.stop?u._node.bufferSource.noteOff(0):u._node.bufferSource.stop(0),o._cleanBuffer(u._node)}else isNaN(u._node.duration)&&u._node.duration!==1/0||(u._node.currentTime=u._start||0,u._node.pause());u&&!n&&o._emit("stop",u._id)}return o},mute:function(e,o){var t=this;if("loaded"!==t._state)return t._queue.push({event:"mute",action:function(){t.mute(e,o)}}),t;if("undefined"==typeof o){if("boolean"!=typeof e)return t._muted;t._muted=e}for(var r=t._getSoundIds(o),u=0;u<r.length;u++){var a=t._soundById(r[u]);a&&(a._muted=e,t._webAudio&&a._node?a._node.gain.setValueAtTime(e?0:a._volume,n.ctx.currentTime):a._node&&(a._node.muted=!!n._muted||e),t._emit("mute",a._id))}return t},volume:function(){var e,o,t=this,r=arguments;if(0===r.length)return t._volume;if(1===r.length){var u=t._getSoundIds(),a=u.indexOf(r[0]);a>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else r.length>=2&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var d;if(!("undefined"!=typeof e&&e>=0&&e<=1))return d=o?t._soundById(o):t._sounds[0],d?d._volume:0;if("loaded"!==t._state)return t._queue.push({event:"volume",action:function(){t.volume.apply(t,r)}}),t;"undefined"==typeof o&&(t._volume=e),o=t._getSoundIds(o);for(var i=0;i<o.length;i++)d=t._soundById(o[i]),d&&(d._volume=e,r[2]||t._stopFade(o[i]),t._webAudio&&d._node&&!d._muted?d._node.gain.setValueAtTime(e,n.ctx.currentTime):d._node&&!d._muted&&(d._node.volume=e*n.volume()),t._emit("volume",d._id));return t},fade:function(e,o,t,r){var u=this,a=Math.abs(e-o),d=e>o?"out":"in",i=a/.01,_=t/i;if("loaded"!==u._state)return u._queue.push({event:"fade",action:function(){u.fade(e,o,t,r)}}),u;u.volume(e,r);for(var s=u._getSoundIds(r),l=0;l<s.length;l++){var f=u._soundById(s[l]);if(f){if(r||u._stopFade(s[l]),u._webAudio&&!f._muted){var c=n.ctx.currentTime,p=c+t/1e3;f._volume=e,f._node.gain.setValueAtTime(e,c),f._node.gain.linearRampToValueAtTime(o,p)}var m=e;f._interval=setInterval(function(e,n){m+="in"===d?.01:-.01,m=Math.max(0,m),m=Math.min(1,m),m=Math.round(100*m)/100,u._webAudio?("undefined"==typeof r&&(u._volume=m),n._volume=m):u.volume(m,e,!0),m===o&&(clearInterval(n._interval),n._interval=null,u.volume(m,e),u._emit("fade",e))}.bind(u,s[l],f),_)}}return u},_stopFade:function(e){var o=this,t=o._soundById(e);return t&&t._interval&&(o._webAudio&&t._node.gain.cancelScheduledValues(n.ctx.currentTime),clearInterval(t._interval),t._interval=null,o._emit("fade",e)),o},loop:function(){var e,n,o,t=this,r=arguments;if(0===r.length)return t._loop;if(1===r.length){if("boolean"!=typeof r[0])return o=t._soundById(parseInt(r[0],10)),!!o&&o._loop;e=r[0],t._loop=e}else 2===r.length&&(e=r[0],n=parseInt(r[1],10));for(var u=t._getSoundIds(n),a=0;a<u.length;a++)o=t._soundById(u[a]),o&&(o._loop=e,t._webAudio&&o._node&&o._node.bufferSource&&(o._node.bufferSource.loop=e));return t},rate:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var u=t._getSoundIds(),a=u.indexOf(r[0]);a>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var d;if("number"!=typeof e)return d=t._soundById(o),d?d._rate:t._rate;if("loaded"!==t._state)return t._queue.push({event:"rate",action:function(){t.rate.apply(t,r)}}),t;"undefined"==typeof o&&(t._rate=e),o=t._getSoundIds(o);for(var i=0;i<o.length;i++)if(d=t._soundById(o[i])){d._rateSeek=t.seek(o[i]),d._playStart=t._webAudio?n.ctx.currentTime:d._playStart,d._rate=e,t._webAudio&&d._node&&d._node.bufferSource?d._node.bufferSource.playbackRate.value=e:d._node&&(d._node.playbackRate=e);var _=t.seek(o[i]),s=(t._sprite[d._sprite][0]+t._sprite[d._sprite][1])/1e3-_,l=1e3*s/Math.abs(d._rate);!t._endTimers[o[i]]&&d._paused||(t._clearTimer(o[i]),t._endTimers[o[i]]=setTimeout(t._ended.bind(t,d),l)),t._emit("rate",d._id)}return t},seek:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var u=t._getSoundIds(),a=u.indexOf(r[0]);a>=0?o=parseInt(r[0],10):(o=t._sounds[0]._id,e=parseFloat(r[0]))}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));if("undefined"==typeof o)return t;if("loaded"!==t._state)return t._queue.push({event:"seek",action:function(){t.seek.apply(t,r)}}),t;var d=t._soundById(o);if(d){if(!("number"==typeof e&&e>=0)){if(t._webAudio){var i=t.playing(o)?n.ctx.currentTime-d._playStart:0,_=d._rateSeek?d._rateSeek-d._seek:0;return d._seek+(_+i*Math.abs(d._rate))}return d._node.currentTime}var s=t.playing(o);s&&t.pause(o,!0),d._seek=e,d._ended=!1,t._clearTimer(o),s&&t.play(o,!0),!t._webAudio&&d._node&&(d._node.currentTime=e),t._emit("seek",o)}return t},playing:function(e){var n=this;if("number"==typeof e){var o=n._soundById(e);return!!o&&!o._paused}for(var t=0;t<n._sounds.length;t++)if(!n._sounds[t]._paused)return!0;return!1},duration:function(e){var n=this,o=n._duration,t=n._soundById(e);return t&&(o=n._sprite[t._sprite][1]/1e3),o},state:function(){return this._state},unload:function(){for(var e=this,o=e._sounds,t=0;t<o.length;t++){o[t]._paused||(e.stop(o[t]._id),e._emit("end",o[t]._id)),e._webAudio||(o[t]._node.src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",o[t]._node.removeEventListener("error",o[t]._errorFn,!1),o[t]._node.removeEventListener(n._canPlayEvent,o[t]._loadFn,!1)),delete o[t]._node,e._clearTimer(o[t]._id);var u=n._howls.indexOf(e);u>=0&&n._howls.splice(u,1)}var a=!0;for(t=0;t<n._howls.length;t++)if(n._howls[t]._src===e._src){a=!1;break}return r&&a&&delete r[e._src],e._state="unloaded",e._sounds=[],e=null,null},on:function(e,n,o,t){var r=this,u=r["_on"+e];return"function"==typeof n&&u.push(t?{id:o,fn:n,once:t}:{id:o,fn:n}),r},off:function(e,n,o){var t=this,r=t["_on"+e],u=0;if(n){for(u=0;u<r.length;u++)if(n===r[u].fn&&o===r[u].id){r.splice(u,1);break}}else if(e)t["_on"+e]=[];else{var a=Object.keys(t);for(u=0;u<a.length;u++)0===a[u].indexOf("_on")&&Array.isArray(t[a[u]])&&(t[a[u]]=[])}return t},once:function(e,n,o){var t=this;return t.on(e,n,o,1),t},_emit:function(e,n,o){for(var t=this,r=t["_on"+e],u=r.length-1;u>=0;u--)r[u].id&&r[u].id!==n&&"load"!==e||(setTimeout(function(e){e.call(this,n,o)}.bind(t,r[u].fn),0),r[u].once&&t.off(e,r[u].fn,r[u].id));return t},_loadQueue:function(){var e=this;if(e._queue.length>0){var n=e._queue[0];e.once(n.event,function(){e._queue.shift(),e._loadQueue()}),n.action()}return e},_ended:function(e){var o=this,t=e._sprite,r=!(!e._loop&&!o._sprite[t][2]);if(o._emit("end",e._id),!o._webAudio&&r&&o.stop(e._id,!0).play(e._id),o._webAudio&&r){o._emit("play",e._id),e._seek=e._start||0,e._rateSeek=0,e._playStart=n.ctx.currentTime;var u=1e3*(e._stop-e._start)/Math.abs(e._rate);o._endTimers[e._id]=setTimeout(o._ended.bind(o,e),u)}return o._webAudio&&!r&&(e._paused=!0,e._ended=!0,e._seek=e._start||0,e._rateSeek=0,o._clearTimer(e._id),o._cleanBuffer(e._node),n._autoSuspend()),o._webAudio||r||o.stop(e._id),o},_clearTimer:function(e){var n=this;return n._endTimers[e]&&(clearTimeout(n._endTimers[e]),delete n._endTimers[e]),n},_soundById:function(e){for(var n=this,o=0;o<n._sounds.length;o++)if(e===n._sounds[o]._id)return n._sounds[o];return null},_inactiveSound:function(){var e=this;e._drain();for(var n=0;n<e._sounds.length;n++)if(e._sounds[n]._ended)return e._sounds[n].reset();return new t(e)},_drain:function(){var e=this,n=e._pool,o=0,t=0;if(!(e._sounds.length<n)){for(t=0;t<e._sounds.length;t++)e._sounds[t]._ended&&o++;for(t=e._sounds.length-1;t>=0;t--){if(o<=n)return;e._sounds[t]._ended&&(e._webAudio&&e._sounds[t]._node&&e._sounds[t]._node.disconnect(0),e._sounds.splice(t,1),o--)}}},_getSoundIds:function(e){var n=this;if("undefined"==typeof e){for(var o=[],t=0;t<n._sounds.length;t++)o.push(n._sounds[t]._id);return o}return[e]},_refreshBuffer:function(e){var o=this;return e._node.bufferSource=n.ctx.createBufferSource(),e._node.bufferSource.buffer=r[o._src],e._panner?e._node.bufferSource.connect(e._panner):e._node.bufferSource.connect(e._node),e._node.bufferSource.loop=e._loop,e._loop&&(e._node.bufferSource.loopStart=e._start||0,e._node.bufferSource.loopEnd=e._stop),e._node.bufferSource.playbackRate.value=e._rate,o},_cleanBuffer:function(e){var n=this;if(n._scratchBuffer){e.bufferSource.onended=null,e.bufferSource.disconnect(0);try{e.bufferSource.buffer=n._scratchBuffer}catch(e){}}return e.bufferSource=null,n}};var t=function(e){this._parent=e,this.init()};t.prototype={init:function(){var e=this,n=e._parent;return e._muted=n._muted,e._loop=n._loop,e._volume=n._volume,e._muted=n._muted,e._rate=n._rate,e._seek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=Math.round(Date.now()*Math.random()),n._sounds.push(e),e.create(),e},create:function(){var e=this,o=e._parent,t=n._muted||e._muted||e._parent._muted?0:e._volume;return o._webAudio?(e._node="undefined"==typeof n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),e._node.gain.setValueAtTime(t,n.ctx.currentTime),e._node.paused=!0,e._node.connect(n.masterGain)):(e._node=new Audio,e._errorFn=e._errorListener.bind(e),e._node.addEventListener("error",e._errorFn,!1),e._loadFn=e._loadListener.bind(e),e._node.addEventListener(n._canPlayEvent,e._loadFn,!1),e._node.src=o._src,e._node.preload="auto",e._node.volume=t*n.volume(),e._node.load()),e},reset:function(){var e=this,n=e._parent;return e._muted=n._muted,e._loop=n._loop,e._volume=n._volume,e._muted=n._muted,e._rate=n._rate,e._seek=0,e._rateSeek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=Math.round(Date.now()*Math.random()),e},_errorListener:function(){var e=this;e._node.error&&4===e._node.error.code&&(n.noAudio=!0),e._parent._emit("loaderror",e._id,e._node.error?e._node.error.code:0),e._node.removeEventListener("error",e._errorListener,!1)},_loadListener:function(){var e=this,o=e._parent;o._duration=Math.ceil(10*e._node.duration)/10,0===Object.keys(o._sprite).length&&(o._sprite={__default:[0,1e3*o._duration]}),"loaded"!==o._state&&(o._state="loaded",o._emit("load"),o._loadQueue()),o._autoplay&&o.play(),e._node.removeEventListener(n._canPlayEvent,e._loadFn,!1)}};var r={},u=function(e){var n=e._src;if(r[n])return e._duration=r[n].duration,void i(e);if(/^data:[^;]+;base64,/.test(n)){for(var o=atob(n.split(",")[1]),t=new Uint8Array(o.length),u=0;u<o.length;++u)t[u]=o.charCodeAt(u);d(t.buffer,e)}else{var _=new XMLHttpRequest;_.open("GET",n,!0),_.responseType="arraybuffer",_.onload=function(){var n=(_.status+"")[0];return"0"!==n&&"2"!==n&&"3"!==n?void e._emit("loaderror",null,"Failed loading audio file with status: "+_.status+"."):void d(_.response,e)},_.onerror=function(){e._webAudio&&(e._html5=!0,e._webAudio=!1,e._sounds=[],delete r[n],e.load())},a(_)}},a=function(e){try{e.send()}catch(n){e.onerror()}},d=function(e,o){n.ctx.decodeAudioData(e,function(e){e&&o._sounds.length>0&&(r[o._src]=e,i(o,e))},function(){o._emit("loaderror",null,"Decoding audio data failed.")})},i=function(e,n){n&&!e._duration&&(e._duration=n.duration),0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),"loaded"!==e._state&&(e._state="loaded",e._emit("load"),e._loadQueue()),e._autoplay&&e.play()},_=function(){n.noAudio=!1;try{"undefined"!=typeof AudioContext?n.ctx=new AudioContext:"undefined"!=typeof webkitAudioContext?n.ctx=new webkitAudioContext:n.usingWebAudio=!1}catch(e){n.usingWebAudio=!1}if(!n.usingWebAudio)if("undefined"!=typeof Audio)try{var e=new Audio;"undefined"==typeof e.oncanplaythrough&&(n._canPlayEvent="canplay")}catch(e){n.noAudio=!0}else n.noAudio=!0;try{var e=new Audio;e.muted&&(n.noAudio=!0)}catch(e){}var o=/iP(hone|od|ad)/.test(n._navigator&&n._navigator.platform),t=n._navigator&&n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),r=t?parseInt(t[1],10):null;if(o&&r&&r<9){var u=/safari/.test(n._navigator&&n._navigator.userAgent.toLowerCase());(n._navigator&&n._navigator.standalone&&!u||n._navigator&&!n._navigator.standalone&&!u)&&(n.usingWebAudio=!1)}n.usingWebAudio&&(n.masterGain="undefined"==typeof n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),n.masterGain.gain.value=1,n.masterGain.connect(n.ctx.destination)),n._setup()};"function"==typeof define&&define.amd&&define([],function(){return{Howler:n,Howl:o}}),"undefined"!=typeof exports&&(exports.Howler=n,exports.Howl=o),"undefined"!=typeof window?(window.HowlerGlobal=e,window.Howler=n,window.Howl=o,window.Sound=t):"undefined"!=typeof global&&(global.HowlerGlobal=e,global.Howler=n,global.Howl=o,global.Sound=t)}();
/*! Spatial Plugin */
!function(){"use strict";HowlerGlobal.prototype._pos=[0,0,0],HowlerGlobal.prototype._orientation=[0,0,-1,0,1,0],HowlerGlobal.prototype.stereo=function(e){var n=this;if(!n.ctx||!n.ctx.listener)return n;for(var t=n._howls.length-1;t>=0;t--)n._howls[t].stereo(e);return n},HowlerGlobal.prototype.pos=function(e,n,t){var o=this;return o.ctx&&o.ctx.listener?(n="number"!=typeof n?o._pos[1]:n,t="number"!=typeof t?o._pos[2]:t,"number"!=typeof e?o._pos:(o._pos=[e,n,t],o.ctx.listener.setPosition(o._pos[0],o._pos[1],o._pos[2]),o)):o},HowlerGlobal.prototype.orientation=function(e,n,t,o,r,i){var a=this;if(!a.ctx||!a.ctx.listener)return a;var p=a._orientation;return n="number"!=typeof n?p[1]:n,t="number"!=typeof t?p[2]:t,o="number"!=typeof o?p[3]:o,r="number"!=typeof r?p[4]:r,i="number"!=typeof i?p[5]:i,"number"!=typeof e?p:(a._orientation=[e,n,t,o,r,i],a.ctx.listener.setOrientation(e,n,t,o,r,i),a)},Howl.prototype.init=function(e){return function(n){var t=this;return t._orientation=n.orientation||[1,0,0],t._stereo=n.stereo||null,t._pos=n.pos||null,t._pannerAttr={coneInnerAngle:"undefined"!=typeof n.coneInnerAngle?n.coneInnerAngle:360,coneOuterAngle:"undefined"!=typeof n.coneOuterAngle?n.coneOuterAngle:360,coneOuterGain:"undefined"!=typeof n.coneOuterGain?n.coneOuterGain:0,distanceModel:"undefined"!=typeof n.distanceModel?n.distanceModel:"inverse",maxDistance:"undefined"!=typeof n.maxDistance?n.maxDistance:1e4,panningModel:"undefined"!=typeof n.panningModel?n.panningModel:"HRTF",refDistance:"undefined"!=typeof n.refDistance?n.refDistance:1,rolloffFactor:"undefined"!=typeof n.rolloffFactor?n.rolloffFactor:1},t._onstereo=n.onstereo?[{fn:n.onstereo}]:[],t._onpos=n.onpos?[{fn:n.onpos}]:[],t._onorientation=n.onorientation?[{fn:n.onorientation}]:[],e.call(this,n)}}(Howl.prototype.init),Howl.prototype.stereo=function(n,t){var o=this;if(!o._webAudio)return o;if("loaded"!==o._state)return o._queue.push({event:"stereo",action:function(){o.stereo(n,t)}}),o;var r="undefined"==typeof Howler.ctx.createStereoPanner?"spatial":"stereo";if("undefined"==typeof t){if("number"!=typeof n)return o._stereo;o._stereo=n,o._pos=[n,0,0]}for(var i=o._getSoundIds(t),a=0;a<i.length;a++){var p=o._soundById(i[a]);if(p){if("number"!=typeof n)return p._stereo;p._stereo=n,p._pos=[n,0,0],p._node&&(p._pannerAttr.panningModel="equalpower",p._panner&&p._panner.pan||e(p,r),"spatial"===r?p._panner.setPosition(n,0,0):p._panner.pan.value=n),o._emit("stereo",p._id)}}return o},Howl.prototype.pos=function(n,t,o,r){var i=this;if(!i._webAudio)return i;if("loaded"!==i._state)return i._queue.push({event:"pos",action:function(){i.pos(n,t,o,r)}}),i;if(t="number"!=typeof t?0:t,o="number"!=typeof o?-.5:o,"undefined"==typeof r){if("number"!=typeof n)return i._pos;i._pos=[n,t,o]}for(var a=i._getSoundIds(r),p=0;p<a.length;p++){var f=i._soundById(a[p]);if(f){if("number"!=typeof n)return f._pos;f._pos=[n,t,o],f._node&&(f._panner&&!f._panner.pan||e(f,"spatial"),f._panner.setPosition(n,t,o)),i._emit("pos",f._id)}}return i},Howl.prototype.orientation=function(n,t,o,r){var i=this;if(!i._webAudio)return i;if("loaded"!==i._state)return i._queue.push({event:"orientation",action:function(){i.orientation(n,t,o,r)}}),i;if(t="number"!=typeof t?i._orientation[1]:t,o="number"!=typeof o?i._orientation[2]:o,"undefined"==typeof r){if("number"!=typeof n)return i._orientation;i._orientation=[n,t,o]}for(var a=i._getSoundIds(r),p=0;p<a.length;p++){var f=i._soundById(a[p]);if(f){if("number"!=typeof n)return f._orientation;f._orientation=[n,t,o],f._node&&(f._panner||(f._pos||(f._pos=i._pos||[0,0,-.5]),e(f,"spatial")),f._panner.setOrientation(n,t,o)),i._emit("orientation",f._id)}}return i},Howl.prototype.pannerAttr=function(){var n,t,o,r=this,i=arguments;if(!r._webAudio)return r;if(0===i.length)return r._pannerAttr;if(1===i.length){if("object"!=typeof i[0])return o=r._soundById(parseInt(i[0],10)),o?o._pannerAttr:r._pannerAttr;n=i[0],"undefined"==typeof t&&(r._pannerAttr={coneInnerAngle:"undefined"!=typeof n.coneInnerAngle?n.coneInnerAngle:r._coneInnerAngle,coneOuterAngle:"undefined"!=typeof n.coneOuterAngle?n.coneOuterAngle:r._coneOuterAngle,coneOuterGain:"undefined"!=typeof n.coneOuterGain?n.coneOuterGain:r._coneOuterGain,distanceModel:"undefined"!=typeof n.distanceModel?n.distanceModel:r._distanceModel,maxDistance:"undefined"!=typeof n.maxDistance?n.maxDistance:r._maxDistance,panningModel:"undefined"!=typeof n.panningModel?n.panningModel:r._panningModel,refDistance:"undefined"!=typeof n.refDistance?n.refDistance:r._refDistance,rolloffFactor:"undefined"!=typeof n.rolloffFactor?n.rolloffFactor:r._rolloffFactor})}else 2===i.length&&(n=i[0],t=parseInt(i[1],10));for(var a=r._getSoundIds(t),p=0;p<a.length;p++)if(o=r._soundById(a[p])){var f=o._pannerAttr;f={coneInnerAngle:"undefined"!=typeof n.coneInnerAngle?n.coneInnerAngle:f.coneInnerAngle,coneOuterAngle:"undefined"!=typeof n.coneOuterAngle?n.coneOuterAngle:f.coneOuterAngle,coneOuterGain:"undefined"!=typeof n.coneOuterGain?n.coneOuterGain:f.coneOuterGain,distanceModel:"undefined"!=typeof n.distanceModel?n.distanceModel:f.distanceModel,maxDistance:"undefined"!=typeof n.maxDistance?n.maxDistance:f.maxDistance,panningModel:"undefined"!=typeof n.panningModel?n.panningModel:f.panningModel,refDistance:"undefined"!=typeof n.refDistance?n.refDistance:f.refDistance,rolloffFactor:"undefined"!=typeof n.rolloffFactor?n.rolloffFactor:f.rolloffFactor};var s=o._panner;s?(s.coneInnerAngle=f.coneInnerAngle,s.coneOuterAngle=f.coneOuterAngle,s.coneOuterGain=f.coneOuterGain,s.distanceModel=f.distanceModel,s.maxDistance=f.maxDistance,s.panningModel=f.panningModel,s.refDistance=f.refDistance,s.rolloffFactor=f.rolloffFactor):(o._pos||(o._pos=r._pos||[0,0,-.5]),e(o,"spatial"))}return r},Sound.prototype.init=function(e){return function(){var n=this,t=n._parent;n._orientation=t._orientation,n._stereo=t._stereo,n._pos=t._pos,n._pannerAttr=t._pannerAttr,e.call(this),n._stereo?t.stereo(n._stereo):n._pos&&t.pos(n._pos[0],n._pos[1],n._pos[2],n._id)}}(Sound.prototype.init),Sound.prototype.reset=function(e){return function(){var n=this,t=n._parent;return n._orientation=t._orientation,n._pos=t._pos,n._pannerAttr=t._pannerAttr,e.call(this)}}(Sound.prototype.reset);var e=function(e,n){n=n||"spatial","spatial"===n?(e._panner=Howler.ctx.createPanner(),e._panner.coneInnerAngle=e._pannerAttr.coneInnerAngle,e._panner.coneOuterAngle=e._pannerAttr.coneOuterAngle,e._panner.coneOuterGain=e._pannerAttr.coneOuterGain,e._panner.distanceModel=e._pannerAttr.distanceModel,e._panner.maxDistance=e._pannerAttr.maxDistance,e._panner.panningModel=e._pannerAttr.panningModel,e._panner.refDistance=e._pannerAttr.refDistance,e._panner.rolloffFactor=e._pannerAttr.rolloffFactor,e._panner.setPosition(e._pos[0],e._pos[1],e._pos[2]),e._panner.setOrientation(e._orientation[0],e._orientation[1],e._orientation[2])):(e._panner=Howler.ctx.createStereoPanner(),e._panner.pan.value=e._stereo),e._panner.connect(e._node),e._paused||e._parent.pause(e._id,!0).play(e._id)}}();
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
/**
 * 声音管理器类用来管理所绑定game实例中的所有音频，用于统一处理这些声音，
 * 包括静音、停止等。<br/>
 * 该类无需显式创建，引擎会自动绑定到game实例属性中。
 * @class soya2d.SoundManager
 */
soya2d.SoundManager = function(game){
    this.game = game;
    this.__sounds = game.assets.__assets.sound;
    /**
     * 设置所有声音的静音状态
     * @param {boolean} m 是否静音
     */
    this.muteAll = function(m){
        for(var k in this.__sounds){
            this.__sounds[k].mute(m);
        }
    };
    
    /**
     * 停止所有声音
     */
    this.stopAll = function(){
        for(var k in this.__sounds){
            this.__sounds[k].stop();
        }
    }
};

soya2d.module.install('sound',{
    onInit:function(game){
        /**
         * 声音管理器
         * @property sound
         * @type {soya2d.SoundManager}
         * @for soya2d.Game
         * @requires sound
         */
        game.sound = new soya2d.SoundManager(game);
    },
    onStop:function(game){
        game.sound.stopAll();
    }
});
!function(){
	/**
	 * 粒子模块定义了soya2d中内置的粒子系统，可以实现绚丽的效果。
	 * <b>该模块是扩展模块，可以自行卸载</b>
	 * @module particle
	 */
	/**
	 * 发射器用于在给定的坐标发射粒子。默认的粒子都是dead状态，不可见，
	 * 引擎会激活粒子为活跃状态，并按照参数发射粒子，这时粒子为可见。
	 * ```
	 * var emitter = game.add.emitter({...});
	 * //注意，这里是添加粒子补间，不是emitter的补间
	 * emitter.tween.add()
	 * .to({opacity:0},1);
	 * 
	 * emitter.tween.add()
	 * .to({scaleX:2,scaleY:2},.5,{easing:soya2d.Tween.Elastic.Out})
	 * .to({scaleX:1,scaleY:1},.3,{easing:soya2d.Tween.Back.InOut});
	 * 
	 * emitter.emit();
	 * ```
	 * @class soya2d.Emitter
	 * @extends soya2d.DisplayObjectContainer
	 * @constructor
	 * @param {Object} opts 构造参数对象，参数如下：
	 * @param {Number} [opts.frequency=0.1] 粒子发射间隔 s
	 * @param {Number} opts.size 总粒子数
	 * @param {Number} opts.quantity 每次发射最大粒子数
	 * @param {String | HTMLImageElement | Array | soya2d.DisplayObject} opts.particles 粒子，可以是图片或者显示对象
	 * @param {Number} [opts.lifeSpan=1] 粒子生命周期 s
	 * @param {Number} [opts.minSpeed=0] 粒子移动速度
	 * @param {Number} [opts.maxSpeed=0] 粒子移动速度
	 * @param {Number} [opts.minRadAcc=0] 径向加速度
	 * @param {Number} [opts.maxRadAcc=0] 径向加速度
	 * @param {Number} [opts.minTanAcc=0] 切线加速度
	 * @param {Number} [opts.maxTanAcc=0] 切线加速度
	 * @param {Number} [opts.minAngle=0] 发射角度
	 * @param {Number} [opts.maxAngle=0] 发射角度
	 *
	 */
	soya2d.class("soya2d.Emitter",{
	    extends:soya2d.DisplayObjectContainer,
	    constructor:function(data){
			var cfg = data||{};

	        this.__particles = [];

			//1.初始化发生器变量
			this.frequency = cfg.frequency*1000 || 100;
			this.size = cfg.size;//粒子数
			this.quantity = cfg.quantity || 1;
			
			//2.初始化粒子属性
			this.__template = getTemplate(cfg.particles);//粒子模版
			//生命周期
			this.lifeSpan = cfg.lifeSpan || 1;
			//默认速度
			this.minSpeed = cfg.minSpeed || 0;
			this.maxSpeed = cfg.maxSpeed || 0;
			//径向加速度
			this.minRadAcc = cfg.minRadAcc || 0;
			this.maxRadAcc = cfg.maxRadAcc || 0;
			//切线加速度
			this.minTanAcc = cfg.minTanAcc || 0;
			this.maxTanAcc = cfg.maxTanAcc || 0;
			//角度
			this.minAngle = cfg.minAngle || 0;
			this.maxAngle = cfg.maxAngle || 0;
			
			//初始化粒子
			for(var i=this.size;i--;){
				var p = this.__template.clone();
				p.visible = false;
				p.lifeSpan = 0;//dead particle
				p.deadRate = 0;
				p.blendMode = cfg.blendMode;
				this.__particles.push(p);
			}

			this.__deltaSum = 0;

			/**
			 * 是否运行中
			 * @type {Boolean}
			 */
			this.running = false;
	    },
	    tween:{
	    	__ts:[],
	    	add:function(){
	    		var t = {
	    			__tds:[],
			    	to:function(attris,duration,opts){
			    		this.__tds.push([attris,duration,opts]);
			    		return this;
			    	}
	    		};
	    		this.__ts.push(t);
	    		return t;
	    	}
	    },
	    /**
		 * 发射粒子
		 * @method emit
		 */
	    emit:function(){
			if(this.running)return;

			this.__particles.forEach(function(p){
				this.add(p);
			},this);

			this.running = true;
			if(this.stopping){
				clearTimeout(this.stopping);
			}
			return this;
		},
		/**
		 * 发射器停止产生新粒子<br/>
		 * *调用emit方法可以解除该状态
		 * @method stop
		 * @param {int} ms 停止激活的延迟毫秒数
		 */
		stop:function(ms){
			if(!this.running)return;
			if(ms>0){
				var that = this;
				this.stopping = setTimeout(function(){
					that.running = false;
					that.stopping = null;

					that.__particles.forEach(function(p){
						that.add(p);
					});
				},ms);
				return;
			}
			//停止激活新粒子
			this.running = false;
			return this;
		},
		_onUpdate:function(game,delta){
			if(!this.running)return;

			this.__deltaSum += delta;

			var emittableCount = 0;
			var ps = this.__particles;
			
			//时间差值是否大于粒子发射间隔
			if (this.__deltaSum >= this.frequency && this.running) {
		      	emittableCount = (this.__deltaSum / this.frequency)>>0;
		      	this.__deltaSum = 0;
		  	}

		  	//有该帧能发射的粒子
			if(emittableCount>0 && this.running){
			  	emittableCount = this.quantity;//this.size;emittableCount>this.size?this.size:emittableCount;
			  	for(var i=this.size;i--&&emittableCount;){
			  		var p = ps[i];
					if(p.lifeSpan<=0){
						if(this.onActive)this.onActive(p);
						initParticle(p,this);
						if(this.tween.__ts.length>0){
							this.tween.__ts.forEach(function(t){
								var tween = game.tween.add(p);
								t.__tds.forEach(function(td){
									tween.to(td[0],td[1],td[2]);
								});
								tween.play();
							});
						}
						if(emittableCount>0)
						emittableCount--;
					}
				}
			}

			//2.更新所有活的粒子
			for(var i=ps.length;i--;){
				var p = ps[i];
				if(p.lifeSpan>0){
					updateParticle(p,delta);
					if(!p.visible)p.visible = true;
				}
			}//over for

			if(this.onRunning)this.onRunning(ps);

		}
	});


	function getTemplate(particles){
		if(typeof(particles) === 'string' 
			|| particles instanceof Image 
			|| particles instanceof Array ){
			return new soya2d.Sprite({
				images:particles
			});
		}else if(particles instanceof soya2d.DisplayObject){
			return particles;
		}

		soya2d.console.error('soya2d.Emitter: invalid param [particles]; '+particles);
	}

	function updateParticle(particle,delta){
    	var m = soya2d.Math;
    	var dt = delta/1000;
    	//1.检测是否已经死亡
    	particle.lifeSpan -= dt;
    	if(particle.lifeSpan<=0){
    		particle.visible = false;
    		particle.deadRate = 0;
    		return;
    	}
    	particle.deadRate = particle.lifeSpan / particle.__maxLifeSpan;
    	//2.更新所有属性
    	 
    	//位置(射线)
    	particle.__speed.add(particle.__deltaSpeed).add(particle.__radialAcc);
    	 
       	//切线旋转
       	if(particle.__tanAcc!==0){
	       	particle.__tanDir.set(particle.__speed.e[0],particle.__speed.e[1]).rotate(particle.__tans);
	       	particle.__tans += particle.__tanAcc;
	       	particle.__tans %= 360;
	       	particle.__speed.set(particle.__tanDir.e[0],particle.__tanDir.e[1]);
	    }
       
       
       	//更新引擎属性
       	particle.x = particle.__sx + particle.__speed.e[0];
    	particle.y = particle.__sy + particle.__speed.e[1];
    }
    function initParticle(particle,opts){
		var m = soya2d.Math;
		//初始化配置
		var ls = particle.lifeSpan = opts.lifeSpan;
		particle.__maxLifeSpan = ls;
		
		particle.__sx = m.randomi(0,opts.w - particle.w);
		particle.__sy = m.randomi(0,opts.h - particle.h);
		
		//方向速度
		var diffAngle = opts.maxAngle?opts.maxAngle - opts.minAngle:0;
		var angle = opts.minAngle + diffAngle * Math.random();
		angle = m.floor(angle %= 360);

		var diffSpd = opts.maxSpeed?opts.maxSpeed - opts.minSpeed:0;
		var speed = opts.minSpeed + diffSpd * Math.random();
		var tmp = new soya2d.Vector(m.COSTABLE[angle], m.SINTABLE[angle]);
		particle.__speed = tmp.clone().mul(speed);
		particle.__deltaSpeed = new soya2d.Vector(particle.__speed.e[0]/ls,particle.__speed.e[1]/ls);
		
		//径向加速
		var diffRac = opts.maxRadAcc?opts.maxRadAcc - opts.minRadAcc:0;
		particle.__radialAcc = tmp.mul(opts.minRadAcc + diffRac * Math.random());
		
		//切线角加速度
		var diffTac = opts.maxTanAcc?opts.maxTanAcc - opts.minTanAcc:0;
		particle.__tanAcc = opts.minTanAcc + diffTac * Math.random();
		if(particle.__tanAcc!==0){
			particle.__tans = particle.__tanAcc;
			particle.__tanDir = new soya2d.Vector(0,0);
		}
		
	}

	/**
	 * 粒子激活时回调
	 * @method onActive
	 * @param {soya2d.DisplayObject} particle 激活的粒子
	 */
	/**
	 * 粒子运行时回调，每帧调用
	 * @method onRunning
	 * @param {Array} particles 发射器中包含的所有粒子
	 */
}();
soya2d.module.install('particles',{
    onInit:function(game){
        game.objects.register('emitter',soya2d.Emitter);
    }
});
/**
* matter-js 0.10.0 by @liabru 2016-05-01
* http://brm.io/matter-js/
* License MIT
*/
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.Matter=e()}}(function(){return function e(t,o,n){function i(s,a){if(!o[s]){if(!t[s]){var l="function"==typeof require&&require;if(!a&&l)return l(s,!0);if(r)return r(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var d=o[s]={exports:{}};t[s][0].call(d.exports,function(e){var o=t[s][1][e];return i(o?o:e)},d,d.exports,e,t,o,n)}return o[s].exports}for(var r="function"==typeof require&&require,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(e,t,o){var n={};t.exports=n;var i=e("../geometry/Vertices"),r=e("../geometry/Vector"),s=e("../core/Sleeping"),a=(e("../render/Render"),e("../core/Common")),l=e("../geometry/Bounds"),c=e("../geometry/Axes");!function(){n._inertiaScale=4,n._nextCollidingGroupId=1,
n._nextNonCollidingGroupId=-1,n._nextCategory=1,n.create=function(t){var o={id:a.nextId(),type:"body",label:"Body",parts:[],angle:0,vertices:i.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),position:{x:0,y:0},force:{x:0,y:0},torque:0,positionImpulse:{x:0,y:0},constraintImpulse:{x:0,y:0,angle:0},totalContacts:0,speed:0,angularSpeed:0,velocity:{x:0,y:0},angularVelocity:0,isSensor:!1,isStatic:!1,isSleeping:!1,motion:0,sleepThreshold:60,density:.001,restitution:0,friction:.1,frictionStatic:.5,frictionAir:.01,collisionFilter:{category:1,mask:4294967295,group:0},slop:.05,timeScale:1,render:{visible:!0,opacity:1,sprite:{xScale:1,yScale:1,xOffset:0,yOffset:0},lineWidth:1.5}},n=a.extend(o,t);return e(n,t),n},n.nextGroup=function(e){return e?n._nextNonCollidingGroupId--:n._nextCollidingGroupId++},n.nextCategory=function(){return n._nextCategory=n._nextCategory<<1,n._nextCategory};var e=function(e,t){n.set(e,{bounds:e.bounds||l.create(e.vertices),positionPrev:e.positionPrev||r.clone(e.position),anglePrev:e.anglePrev||e.angle,
vertices:e.vertices,parts:e.parts||[e],isStatic:e.isStatic,isSleeping:e.isSleeping,parent:e.parent||e}),i.rotate(e.vertices,e.angle,e.position),c.rotate(e.axes,e.angle),l.update(e.bounds,e.vertices,e.velocity),n.set(e,{axes:t.axes||e.axes,area:t.area||e.area,mass:t.mass||e.mass,inertia:t.inertia||e.inertia});var o=e.isStatic?"#eeeeee":a.choose(["#556270","#4ECDC4","#C7F464","#FF6B6B","#C44D58"]),s=a.shadeColor(o,-20);e.render.fillStyle=e.render.fillStyle||o,e.render.strokeStyle=e.render.strokeStyle||s,e.render.sprite.xOffset+=-(e.bounds.min.x-e.position.x)/(e.bounds.max.x-e.bounds.min.x),e.render.sprite.yOffset+=-(e.bounds.min.y-e.position.y)/(e.bounds.max.y-e.bounds.min.y)};n.set=function(e,t,o){var i;"string"==typeof t&&(i=t,t={},t[i]=o);for(i in t)if(o=t[i],t.hasOwnProperty(i))switch(i){case"isStatic":n.setStatic(e,o);break;case"isSleeping":s.set(e,o);break;case"mass":n.setMass(e,o);break;case"density":n.setDensity(e,o);break;case"inertia":n.setInertia(e,o);break;case"vertices":n.setVertices(e,o);
break;case"position":n.setPosition(e,o);break;case"angle":n.setAngle(e,o);break;case"velocity":n.setVelocity(e,o);break;case"angularVelocity":n.setAngularVelocity(e,o);break;case"parts":n.setParts(e,o);break;default:e[i]=o}},n.setStatic=function(e,t){for(var o=0;o<e.parts.length;o++){var n=e.parts[o];n.isStatic=t,t&&(n.restitution=0,n.friction=1,n.mass=n.inertia=n.density=1/0,n.inverseMass=n.inverseInertia=0,n.positionPrev.x=n.position.x,n.positionPrev.y=n.position.y,n.anglePrev=n.angle,n.angularVelocity=0,n.speed=0,n.angularSpeed=0,n.motion=0)}},n.setMass=function(e,t){e.mass=t,e.inverseMass=1/e.mass,e.density=e.mass/e.area},n.setDensity=function(e,t){n.setMass(e,t*e.area),e.density=t},n.setInertia=function(e,t){e.inertia=t,e.inverseInertia=1/e.inertia},n.setVertices=function(e,t){t[0].body===e?e.vertices=t:e.vertices=i.create(t,e),e.axes=c.fromVertices(e.vertices),e.area=i.area(e.vertices),n.setMass(e,e.density*e.area);var o=i.centre(e.vertices);i.translate(e.vertices,o,-1),n.setInertia(e,n._inertiaScale*i.inertia(e.vertices,e.mass)),
i.translate(e.vertices,e.position),l.update(e.bounds,e.vertices,e.velocity)},n.setParts=function(e,o,r){var s;for(o=o.slice(0),e.parts.length=0,e.parts.push(e),e.parent=e,s=0;s<o.length;s++){var a=o[s];a!==e&&(a.parent=e,e.parts.push(a))}if(1!==e.parts.length){if(r="undefined"!=typeof r?r:!0){var l=[];for(s=0;s<o.length;s++)l=l.concat(o[s].vertices);i.clockwiseSort(l);var c=i.hull(l),d=i.centre(c);n.setVertices(e,c),i.translate(e.vertices,d)}var u=t(e);e.area=u.area,e.parent=e,e.position.x=u.centre.x,e.position.y=u.centre.y,e.positionPrev.x=u.centre.x,e.positionPrev.y=u.centre.y,n.setMass(e,u.mass),n.setInertia(e,u.inertia),n.setPosition(e,u.centre)}},n.setPosition=function(e,t){var o=r.sub(t,e.position);e.positionPrev.x+=o.x,e.positionPrev.y+=o.y;for(var n=0;n<e.parts.length;n++){var s=e.parts[n];s.position.x+=o.x,s.position.y+=o.y,i.translate(s.vertices,o),l.update(s.bounds,s.vertices,e.velocity)}},n.setAngle=function(e,t){var o=t-e.angle;e.anglePrev+=o;for(var n=0;n<e.parts.length;n++){
var s=e.parts[n];s.angle+=o,i.rotate(s.vertices,o,e.position),c.rotate(s.axes,o),l.update(s.bounds,s.vertices,e.velocity),n>0&&r.rotateAbout(s.position,o,e.position,s.position)}},n.setVelocity=function(e,t){e.positionPrev.x=e.position.x-t.x,e.positionPrev.y=e.position.y-t.y,e.velocity.x=t.x,e.velocity.y=t.y,e.speed=r.magnitude(e.velocity)},n.setAngularVelocity=function(e,t){e.anglePrev=e.angle-t,e.angularVelocity=t,e.angularSpeed=Math.abs(e.angularVelocity)},n.translate=function(e,t){n.setPosition(e,r.add(e.position,t))},n.rotate=function(e,t){n.setAngle(e,e.angle+t)},n.scale=function(e,o,r,s){for(var a=0;a<e.parts.length;a++){var d=e.parts[a];i.scale(d.vertices,o,r,e.position),d.axes=c.fromVertices(d.vertices),e.isStatic||(d.area=i.area(d.vertices),n.setMass(d,e.density*d.area),i.translate(d.vertices,{x:-d.position.x,y:-d.position.y}),n.setInertia(d,i.inertia(d.vertices,d.mass)),i.translate(d.vertices,{x:d.position.x,y:d.position.y})),l.update(d.bounds,d.vertices,e.velocity)}if(e.circleRadius&&(o===r?e.circleRadius*=o:e.circleRadius=null),
!e.isStatic){var u=t(e);e.area=u.area,n.setMass(e,u.mass),n.setInertia(e,u.inertia)}},n.update=function(e,t,o,n){var s=Math.pow(t*o*e.timeScale,2),a=1-e.frictionAir*o*e.timeScale,d=e.position.x-e.positionPrev.x,u=e.position.y-e.positionPrev.y;e.velocity.x=d*a*n+e.force.x/e.mass*s,e.velocity.y=u*a*n+e.force.y/e.mass*s,e.positionPrev.x=e.position.x,e.positionPrev.y=e.position.y,e.position.x+=e.velocity.x,e.position.y+=e.velocity.y,e.angularVelocity=(e.angle-e.anglePrev)*a*n+e.torque/e.inertia*s,e.anglePrev=e.angle,e.angle+=e.angularVelocity,e.speed=r.magnitude(e.velocity),e.angularSpeed=Math.abs(e.angularVelocity);for(var p=0;p<e.parts.length;p++){var f=e.parts[p];i.translate(f.vertices,e.velocity),p>0&&(f.position.x+=e.velocity.x,f.position.y+=e.velocity.y),0!==e.angularVelocity&&(i.rotate(f.vertices,e.angularVelocity,e.position),c.rotate(f.axes,e.angularVelocity),p>0&&r.rotateAbout(f.position,e.angularVelocity,e.position,f.position)),l.update(f.bounds,f.vertices,e.velocity)}},n.applyForce=function(e,t,o){
e.force.x+=o.x,e.force.y+=o.y;var n={x:t.x-e.position.x,y:t.y-e.position.y};e.torque+=n.x*o.y-n.y*o.x};var t=function(e){for(var t={mass:0,area:0,inertia:0,centre:{x:0,y:0}},o=1===e.parts.length?0:1;o<e.parts.length;o++){var n=e.parts[o];t.mass+=n.mass,t.area+=n.area,t.inertia+=n.inertia,t.centre=r.add(t.centre,r.mult(n.position,n.mass!==1/0?n.mass:1))}return t.centre=r.div(t.centre,t.mass!==1/0?t.mass:e.parts.length),t}}()},{"../core/Common":14,"../core/Sleeping":20,"../geometry/Axes":23,"../geometry/Bounds":24,"../geometry/Vector":26,"../geometry/Vertices":27,"../render/Render":29}],2:[function(e,t,o){var n={};t.exports=n;var i=e("../core/Events"),r=e("../core/Common"),s=e("./Body");!function(){n.create=function(e){return r.extend({id:r.nextId(),type:"composite",parent:null,isModified:!1,bodies:[],constraints:[],composites:[],label:"Composite"},e)},n.setModified=function(e,t,o,i){if(e.isModified=t,o&&e.parent&&n.setModified(e.parent,t,o,i),i)for(var r=0;r<e.composites.length;r++){var s=e.composites[r];
n.setModified(s,t,o,i)}},n.add=function(e,t){var o=[].concat(t);i.trigger(e,"beforeAdd",{object:t});for(var s=0;s<o.length;s++){var a=o[s];switch(a.type){case"body":if(a.parent!==a){r.log("Composite.add: skipped adding a compound body part (you must add its parent instead)","warn");break}n.addBody(e,a);break;case"constraint":n.addConstraint(e,a);break;case"composite":n.addComposite(e,a);break;case"mouseConstraint":n.addConstraint(e,a.constraint)}}return i.trigger(e,"afterAdd",{object:t}),e},n.remove=function(e,t,o){var r=[].concat(t);i.trigger(e,"beforeRemove",{object:t});for(var s=0;s<r.length;s++){var a=r[s];switch(a.type){case"body":n.removeBody(e,a,o);break;case"constraint":n.removeConstraint(e,a,o);break;case"composite":n.removeComposite(e,a,o);break;case"mouseConstraint":n.removeConstraint(e,a.constraint)}}return i.trigger(e,"afterRemove",{object:t}),e},n.addComposite=function(e,t){return e.composites.push(t),t.parent=e,n.setModified(e,!0,!0,!1),e},n.removeComposite=function(e,t,o){
var i=r.indexOf(e.composites,t);if(-1!==i&&(n.removeCompositeAt(e,i),n.setModified(e,!0,!0,!1)),o)for(var s=0;s<e.composites.length;s++)n.removeComposite(e.composites[s],t,!0);return e},n.removeCompositeAt=function(e,t){return e.composites.splice(t,1),n.setModified(e,!0,!0,!1),e},n.addBody=function(e,t){return e.bodies.push(t),n.setModified(e,!0,!0,!1),e},n.removeBody=function(e,t,o){var i=r.indexOf(e.bodies,t);if(-1!==i&&(n.removeBodyAt(e,i),n.setModified(e,!0,!0,!1)),o)for(var s=0;s<e.composites.length;s++)n.removeBody(e.composites[s],t,!0);return e},n.removeBodyAt=function(e,t){return e.bodies.splice(t,1),n.setModified(e,!0,!0,!1),e},n.addConstraint=function(e,t){return e.constraints.push(t),n.setModified(e,!0,!0,!1),e},n.removeConstraint=function(e,t,o){var i=r.indexOf(e.constraints,t);if(-1!==i&&n.removeConstraintAt(e,i),o)for(var s=0;s<e.composites.length;s++)n.removeConstraint(e.composites[s],t,!0);return e},n.removeConstraintAt=function(e,t){return e.constraints.splice(t,1),n.setModified(e,!0,!0,!1),
e},n.clear=function(e,t,o){if(o)for(var i=0;i<e.composites.length;i++)n.clear(e.composites[i],t,!0);return t?e.bodies=e.bodies.filter(function(e){return e.isStatic}):e.bodies.length=0,e.constraints.length=0,e.composites.length=0,n.setModified(e,!0,!0,!1),e},n.allBodies=function(e){for(var t=[].concat(e.bodies),o=0;o<e.composites.length;o++)t=t.concat(n.allBodies(e.composites[o]));return t},n.allConstraints=function(e){for(var t=[].concat(e.constraints),o=0;o<e.composites.length;o++)t=t.concat(n.allConstraints(e.composites[o]));return t},n.allComposites=function(e){for(var t=[].concat(e.composites),o=0;o<e.composites.length;o++)t=t.concat(n.allComposites(e.composites[o]));return t},n.get=function(e,t,o){var i,r;switch(o){case"body":i=n.allBodies(e);break;case"constraint":i=n.allConstraints(e);break;case"composite":i=n.allComposites(e).concat(e)}return i?(r=i.filter(function(e){return e.id.toString()===t.toString()}),0===r.length?null:r[0]):null},n.move=function(e,t,o){return n.remove(e,t),
n.add(o,t),e},n.rebase=function(e){for(var t=n.allBodies(e).concat(n.allConstraints(e)).concat(n.allComposites(e)),o=0;o<t.length;o++)t[o].id=r.nextId();return n.setModified(e,!0,!0,!1),e},n.translate=function(e,t,o){for(var i=o?n.allBodies(e):e.bodies,r=0;r<i.length;r++)s.translate(i[r],t);return n.setModified(e,!0,!0,!1),e},n.rotate=function(e,t,o,i){for(var r=Math.cos(t),a=Math.sin(t),l=i?n.allBodies(e):e.bodies,c=0;c<l.length;c++){var d=l[c],u=d.position.x-o.x,p=d.position.y-o.y;s.setPosition(d,{x:o.x+(u*r-p*a),y:o.y+(u*a+p*r)}),s.rotate(d,t)}return n.setModified(e,!0,!0,!1),e},n.scale=function(e,t,o,i,r){for(var a=r?n.allBodies(e):e.bodies,l=0;l<a.length;l++){var c=a[l],d=c.position.x-i.x,u=c.position.y-i.y;s.setPosition(c,{x:i.x+d*t,y:i.y+u*o}),s.scale(c,t,o)}return n.setModified(e,!0,!0,!1),e}}()},{"../core/Common":14,"../core/Events":16,"./Body":1}],3:[function(e,t,o){var n={};t.exports=n;var i=e("./Composite"),r=(e("../constraint/Constraint"),e("../core/Common"));!function(){n.create=function(e){
var t=i.create(),o={label:"World",gravity:{x:0,y:1,scale:.001},bounds:{min:{x:-(1/0),y:-(1/0)},max:{x:1/0,y:1/0}}};return r.extend(t,o,e)}}()},{"../constraint/Constraint":12,"../core/Common":14,"./Composite":2}],4:[function(e,t,o){var n={};t.exports=n,function(){n.create=function(e){return{id:n.id(e),vertex:e,normalImpulse:0,tangentImpulse:0}},n.id=function(e){return e.body.id+"_"+e.index}}()},{}],5:[function(e,t,o){var n={};t.exports=n;var i=e("./SAT"),r=e("./Pair"),s=e("../geometry/Bounds");!function(){n.collisions=function(e,t){for(var o=[],a=t.pairs.table,l=0;l<e.length;l++){var c=e[l][0],d=e[l][1];if((!c.isStatic&&!c.isSleeping||!d.isStatic&&!d.isSleeping)&&n.canCollide(c.collisionFilter,d.collisionFilter)&&s.overlaps(c.bounds,d.bounds))for(var u=c.parts.length>1?1:0;u<c.parts.length;u++)for(var p=c.parts[u],f=d.parts.length>1?1:0;f<d.parts.length;f++){var v=d.parts[f];if(p===c&&v===d||s.overlaps(p.bounds,v.bounds)){var m,y=r.id(p,v),g=a[y];m=g&&g.isActive?g.collision:null;var x=i.collides(p,v,m);
x.collided&&o.push(x)}}}return o},n.canCollide=function(e,t){return e.group===t.group&&0!==e.group?e.group>0:0!==(e.mask&t.category)&&0!==(t.mask&e.category)}}()},{"../geometry/Bounds":24,"./Pair":7,"./SAT":11}],6:[function(e,t,o){var n={};t.exports=n;var i=e("./Pair"),r=e("./Detector"),s=e("../core/Common");!function(){n.create=function(e){var t={controller:n,detector:r.collisions,buckets:{},pairs:{},pairsList:[],bucketWidth:48,bucketHeight:48};return s.extend(t,e)},n.update=function(o,n,i,r){var s,p,f,v,m,y=i.world,g=o.buckets,x=!1;for(s=0;s<n.length;s++){var h=n[s];if((!h.isSleeping||r)&&!(h.bounds.max.x<y.bounds.min.x||h.bounds.min.x>y.bounds.max.x||h.bounds.max.y<y.bounds.min.y||h.bounds.min.y>y.bounds.max.y)){var b=t(o,h);if(!h.region||b.id!==h.region.id||r){h.region&&!r||(h.region=b);var w=e(b,h.region);for(p=w.startCol;p<=w.endCol;p++)for(f=w.startRow;f<=w.endRow;f++){m=a(p,f),v=g[m];var S=p>=b.startCol&&p<=b.endCol&&f>=b.startRow&&f<=b.endRow,C=p>=h.region.startCol&&p<=h.region.endCol&&f>=h.region.startRow&&f<=h.region.endRow;
!S&&C&&C&&v&&d(o,v,h),(h.region===b||S&&!C||r)&&(v||(v=l(g,m)),c(o,v,h))}h.region=b,x=!0}}}x&&(o.pairsList=u(o))},n.clear=function(e){e.buckets={},e.pairs={},e.pairsList=[]};var e=function(e,t){var n=Math.min(e.startCol,t.startCol),i=Math.max(e.endCol,t.endCol),r=Math.min(e.startRow,t.startRow),s=Math.max(e.endRow,t.endRow);return o(n,i,r,s)},t=function(e,t){var n=t.bounds,i=Math.floor(n.min.x/e.bucketWidth),r=Math.floor(n.max.x/e.bucketWidth),s=Math.floor(n.min.y/e.bucketHeight),a=Math.floor(n.max.y/e.bucketHeight);return o(i,r,s,a)},o=function(e,t,o,n){return{id:e+","+t+","+o+","+n,startCol:e,endCol:t,startRow:o,endRow:n}},a=function(e,t){return e+","+t},l=function(e,t){var o=e[t]=[];return o},c=function(e,t,o){for(var n=0;n<t.length;n++){var r=t[n];if(!(o.id===r.id||o.isStatic&&r.isStatic)){var s=i.id(o,r),a=e.pairs[s];a?a[2]+=1:e.pairs[s]=[o,r,1]}}t.push(o)},d=function(e,t,o){t.splice(s.indexOf(t,o),1);for(var n=0;n<t.length;n++){var r=t[n],a=i.id(o,r),l=e.pairs[a];l&&(l[2]-=1)}},u=function(e){
var t,o,n=[];t=s.keys(e.pairs);for(var i=0;i<t.length;i++)o=e.pairs[t[i]],o[2]>0?n.push(o):delete e.pairs[t[i]];return n}}()},{"../core/Common":14,"./Detector":5,"./Pair":7}],7:[function(e,t,o){var n={};t.exports=n;var i=e("./Contact");!function(){n.create=function(e,t){var o=e.bodyA,i=e.bodyB,r=e.parentA,s=e.parentB,a={id:n.id(o,i),bodyA:o,bodyB:i,contacts:{},activeContacts:[],separation:0,isActive:!0,isSensor:o.isSensor||i.isSensor,timeCreated:t,timeUpdated:t,inverseMass:r.inverseMass+s.inverseMass,friction:Math.min(r.friction,s.friction),frictionStatic:Math.max(r.frictionStatic,s.frictionStatic),restitution:Math.max(r.restitution,s.restitution),slop:Math.max(r.slop,s.slop)};return n.update(a,e,t),a},n.update=function(e,t,o){var r=e.contacts,s=t.supports,a=e.activeContacts,l=t.parentA,c=t.parentB;if(e.collision=t,e.inverseMass=l.inverseMass+c.inverseMass,e.friction=Math.min(l.friction,c.friction),e.frictionStatic=Math.max(l.frictionStatic,c.frictionStatic),e.restitution=Math.max(l.restitution,c.restitution),
e.slop=Math.max(l.slop,c.slop),a.length=0,t.collided){for(var d=0;d<s.length;d++){var u=s[d],p=i.id(u),f=r[p];f?a.push(f):a.push(r[p]=i.create(u))}e.separation=t.depth,n.setActive(e,!0,o)}else e.isActive===!0&&n.setActive(e,!1,o)},n.setActive=function(e,t,o){t?(e.isActive=!0,e.timeUpdated=o):(e.isActive=!1,e.activeContacts.length=0)},n.id=function(e,t){return e.id<t.id?e.id+"_"+t.id:t.id+"_"+e.id}}()},{"./Contact":4}],8:[function(e,t,o){var n={};t.exports=n;var i=e("./Pair"),r=e("../core/Common");!function(){var e=1e3;n.create=function(e){return r.extend({table:{},list:[],collisionStart:[],collisionActive:[],collisionEnd:[]},e)},n.update=function(e,t,o){var n,s,a,l,c=e.list,d=e.table,u=e.collisionStart,p=e.collisionEnd,f=e.collisionActive,v=[];for(u.length=0,p.length=0,f.length=0,l=0;l<t.length;l++)n=t[l],n.collided&&(s=i.id(n.bodyA,n.bodyB),v.push(s),a=d[s],a?(a.isActive?f.push(a):u.push(a),i.update(a,n,o)):(a=i.create(n,o),d[s]=a,u.push(a),c.push(a)));for(l=0;l<c.length;l++)a=c[l],a.isActive&&-1===r.indexOf(v,a.id)&&(i.setActive(a,!1,o),
p.push(a))},n.removeOld=function(t,o){var n,i,r,s,a=t.list,l=t.table,c=[];for(s=0;s<a.length;s++)n=a[s],i=n.collision,i.bodyA.isSleeping||i.bodyB.isSleeping?n.timeUpdated=o:o-n.timeUpdated>e&&c.push(s);for(s=0;s<c.length;s++)r=c[s]-s,n=a[r],delete l[n.id],a.splice(r,1)},n.clear=function(e){return e.table={},e.list.length=0,e.collisionStart.length=0,e.collisionActive.length=0,e.collisionEnd.length=0,e}}()},{"../core/Common":14,"./Pair":7}],9:[function(e,t,o){var n={};t.exports=n;var i=e("../geometry/Vector"),r=e("./SAT"),s=e("../geometry/Bounds"),a=e("../factory/Bodies"),l=e("../geometry/Vertices");!function(){n.ray=function(e,t,o,n){n=n||1e-100;for(var l=i.angle(t,o),c=i.magnitude(i.sub(t,o)),d=.5*(o.x+t.x),u=.5*(o.y+t.y),p=a.rectangle(d,u,c,n,{angle:l}),f=[],v=0;v<e.length;v++){var m=e[v];if(s.overlaps(m.bounds,p.bounds))for(var y=1===m.parts.length?0:1;y<m.parts.length;y++){var g=m.parts[y];if(s.overlaps(g.bounds,p.bounds)){var x=r.collides(g,p);if(x.collided){x.body=x.bodyA=x.bodyB=m,
f.push(x);break}}}}return f},n.region=function(e,t,o){for(var n=[],i=0;i<e.length;i++){var r=e[i],a=s.overlaps(r.bounds,t);(a&&!o||!a&&o)&&n.push(r)}return n},n.point=function(e,t){for(var o=[],n=0;n<e.length;n++){var i=e[n];if(s.contains(i.bounds,t))for(var r=1===i.parts.length?0:1;r<i.parts.length;r++){var a=i.parts[r];if(s.contains(a.bounds,t)&&l.contains(a.vertices,t)){o.push(i);break}}}return o}}()},{"../factory/Bodies":21,"../geometry/Bounds":24,"../geometry/Vector":26,"../geometry/Vertices":27,"./SAT":11}],10:[function(e,t,o){var n={};t.exports=n;var i=e("../geometry/Vertices"),r=e("../geometry/Vector"),s=e("../core/Common"),a=e("../geometry/Bounds");!function(){n._restingThresh=4,n._restingThreshTangent=6,n._positionDampen=.9,n._positionWarming=.8,n._frictionNormalMultiplier=5,n.preSolvePosition=function(e){var t,o,n;for(t=0;t<e.length;t++)o=e[t],o.isActive&&(n=o.activeContacts.length,o.collision.parentA.totalContacts+=n,o.collision.parentB.totalContacts+=n)},n.solvePosition=function(e,t){
var o,i,s,a,l,c,d,u,p,f=r._temp[0],v=r._temp[1],m=r._temp[2],y=r._temp[3];for(o=0;o<e.length;o++)i=e[o],i.isActive&&!i.isSensor&&(s=i.collision,a=s.parentA,l=s.parentB,c=s.normal,d=r.sub(r.add(l.positionImpulse,l.position,f),r.add(a.positionImpulse,r.sub(l.position,s.penetration,v),m),y),i.separation=r.dot(c,d));for(o=0;o<e.length;o++)i=e[o],!i.isActive||i.isSensor||i.separation<0||(s=i.collision,a=s.parentA,l=s.parentB,c=s.normal,p=(i.separation-i.slop)*t,(a.isStatic||l.isStatic)&&(p*=2),a.isStatic||a.isSleeping||(u=n._positionDampen/a.totalContacts,a.positionImpulse.x+=c.x*p*u,a.positionImpulse.y+=c.y*p*u),l.isStatic||l.isSleeping||(u=n._positionDampen/l.totalContacts,l.positionImpulse.x-=c.x*p*u,l.positionImpulse.y-=c.y*p*u))},n.postSolvePosition=function(e){for(var t=0;t<e.length;t++){var o=e[t];if(o.totalContacts=0,0!==o.positionImpulse.x||0!==o.positionImpulse.y){for(var s=0;s<o.parts.length;s++){var l=o.parts[s];i.translate(l.vertices,o.positionImpulse),a.update(l.bounds,l.vertices,o.velocity),
l.position.x+=o.positionImpulse.x,l.position.y+=o.positionImpulse.y}o.positionPrev.x+=o.positionImpulse.x,o.positionPrev.y+=o.positionImpulse.y,r.dot(o.positionImpulse,o.velocity)<0?(o.positionImpulse.x=0,o.positionImpulse.y=0):(o.positionImpulse.x*=n._positionWarming,o.positionImpulse.y*=n._positionWarming)}}},n.preSolveVelocity=function(e){var t,o,n,i,s,a,l,c,d,u,p,f,v,m,y=r._temp[0],g=r._temp[1];for(t=0;t<e.length;t++)if(n=e[t],n.isActive&&!n.isSensor)for(i=n.activeContacts,s=n.collision,a=s.parentA,l=s.parentB,c=s.normal,d=s.tangent,o=0;o<i.length;o++)u=i[o],p=u.vertex,f=u.normalImpulse,v=u.tangentImpulse,0===f&&0===v||(y.x=c.x*f+d.x*v,y.y=c.y*f+d.y*v,a.isStatic||a.isSleeping||(m=r.sub(p,a.position,g),a.positionPrev.x+=y.x*a.inverseMass,a.positionPrev.y+=y.y*a.inverseMass,a.anglePrev+=r.cross(m,y)*a.inverseInertia),l.isStatic||l.isSleeping||(m=r.sub(p,l.position,g),l.positionPrev.x-=y.x*l.inverseMass,l.positionPrev.y-=y.y*l.inverseMass,l.anglePrev-=r.cross(m,y)*l.inverseInertia))},n.solveVelocity=function(e,t){
for(var o=t*t,i=r._temp[0],a=r._temp[1],l=r._temp[2],c=r._temp[3],d=r._temp[4],u=r._temp[5],p=0;p<e.length;p++){var f=e[p];if(f.isActive&&!f.isSensor){var v=f.collision,m=v.parentA,y=v.parentB,g=v.normal,x=v.tangent,h=f.activeContacts,b=1/h.length;m.velocity.x=m.position.x-m.positionPrev.x,m.velocity.y=m.position.y-m.positionPrev.y,y.velocity.x=y.position.x-y.positionPrev.x,y.velocity.y=y.position.y-y.positionPrev.y,m.angularVelocity=m.angle-m.anglePrev,y.angularVelocity=y.angle-y.anglePrev;for(var w=0;w<h.length;w++){var S=h[w],C=S.vertex,A=r.sub(C,m.position,a),B=r.sub(C,y.position,l),P=r.add(m.velocity,r.mult(r.perp(A),m.angularVelocity),c),M=r.add(y.velocity,r.mult(r.perp(B),y.angularVelocity),d),k=r.sub(P,M,u),I=r.dot(g,k),T=r.dot(x,k),V=Math.abs(T),R=s.sign(T),E=(1+f.restitution)*I,_=s.clamp(f.separation+I,0,1)*n._frictionNormalMultiplier,F=T,O=1/0;V>f.friction*f.frictionStatic*_*o&&(O=V,F=s.clamp(f.friction*R*o,-O,O));var L=r.cross(A,g),q=r.cross(B,g),W=b/(m.inverseMass+y.inverseMass+m.inverseInertia*L*L+y.inverseInertia*q*q);
if(E*=W,F*=W,0>I&&I*I>n._restingThresh*o)S.normalImpulse=0;else{var D=S.normalImpulse;S.normalImpulse=Math.min(S.normalImpulse+E,0),E=S.normalImpulse-D}if(T*T>n._restingThreshTangent*o)S.tangentImpulse=0;else{var N=S.tangentImpulse;S.tangentImpulse=s.clamp(S.tangentImpulse+F,-O,O),F=S.tangentImpulse-N}i.x=g.x*E+x.x*F,i.y=g.y*E+x.y*F,m.isStatic||m.isSleeping||(m.positionPrev.x+=i.x*m.inverseMass,m.positionPrev.y+=i.y*m.inverseMass,m.anglePrev+=r.cross(A,i)*m.inverseInertia),y.isStatic||y.isSleeping||(y.positionPrev.x-=i.x*y.inverseMass,y.positionPrev.y-=i.y*y.inverseMass,y.anglePrev-=r.cross(B,i)*y.inverseInertia)}}}}}()},{"../core/Common":14,"../geometry/Bounds":24,"../geometry/Vector":26,"../geometry/Vertices":27}],11:[function(e,t,o){var n={};t.exports=n;var i=e("../geometry/Vertices"),r=e("../geometry/Vector");!function(){n.collides=function(t,n,s){var a,l,c,d,u=s,p=!1;if(u){var f=t.parent,v=n.parent,m=f.speed*f.speed+f.angularSpeed*f.angularSpeed+v.speed*v.speed+v.angularSpeed*v.angularSpeed;
p=u&&u.collided&&.2>m,d=u}else d={collided:!1,bodyA:t,bodyB:n};if(u&&p){var y=d.axisBody,g=y===t?n:t,x=[y.axes[u.axisNumber]];if(c=e(y.vertices,g.vertices,x),d.reused=!0,c.overlap<=0)return d.collided=!1,d}else{if(a=e(t.vertices,n.vertices,t.axes),a.overlap<=0)return d.collided=!1,d;if(l=e(n.vertices,t.vertices,n.axes),l.overlap<=0)return d.collided=!1,d;a.overlap<l.overlap?(c=a,d.axisBody=t):(c=l,d.axisBody=n),d.axisNumber=c.axisNumber}d.bodyA=t.id<n.id?t:n,d.bodyB=t.id<n.id?n:t,d.collided=!0,d.normal=c.axis,d.depth=c.overlap,d.parentA=d.bodyA.parent,d.parentB=d.bodyB.parent,t=d.bodyA,n=d.bodyB,r.dot(d.normal,r.sub(n.position,t.position))>0&&(d.normal=r.neg(d.normal)),d.tangent=r.perp(d.normal),d.penetration={x:d.normal.x*d.depth,y:d.normal.y*d.depth};var h=o(t,n,d.normal),b=d.supports||[];if(b.length=0,i.contains(t.vertices,h[0])&&b.push(h[0]),i.contains(t.vertices,h[1])&&b.push(h[1]),b.length<2){var w=o(n,t,r.neg(d.normal));i.contains(n.vertices,w[0])&&b.push(w[0]),b.length<2&&i.contains(n.vertices,w[1])&&b.push(w[1]);
}return b.length<1&&(b=[h[0]]),d.supports=b,d};var e=function(e,o,n){for(var i,s,a=r._temp[0],l=r._temp[1],c={overlap:Number.MAX_VALUE},d=0;d<n.length;d++){if(s=n[d],t(a,e,s),t(l,o,s),i=Math.min(a.max-l.min,l.max-a.min),0>=i)return c.overlap=i,c;i<c.overlap&&(c.overlap=i,c.axis=s,c.axisNumber=d)}return c},t=function(e,t,o){for(var n=r.dot(t[0],o),i=n,s=1;s<t.length;s+=1){var a=r.dot(t[s],o);a>i?i=a:n>a&&(n=a)}e.min=n,e.max=i},o=function(e,t,o){for(var n,i,s,a,l=Number.MAX_VALUE,c=r._temp[0],d=t.vertices,u=e.position,p=0;p<d.length;p++)i=d[p],c.x=i.x-u.x,c.y=i.y-u.y,n=-r.dot(o,c),l>n&&(l=n,s=i);var f=s.index-1>=0?s.index-1:d.length-1;i=d[f],c.x=i.x-u.x,c.y=i.y-u.y,l=-r.dot(o,c),a=i;var v=(s.index+1)%d.length;return i=d[v],c.x=i.x-u.x,c.y=i.y-u.y,n=-r.dot(o,c),l>n&&(a=i),[s,a]}}()},{"../geometry/Vector":26,"../geometry/Vertices":27}],12:[function(e,t,o){var n={};t.exports=n;var i=e("../geometry/Vertices"),r=e("../geometry/Vector"),s=e("../core/Sleeping"),a=e("../geometry/Bounds"),l=e("../geometry/Axes"),c=e("../core/Common");
!function(){var e=1e-6,t=.001;n.create=function(t){var o=t;o.bodyA&&!o.pointA&&(o.pointA={x:0,y:0}),o.bodyB&&!o.pointB&&(o.pointB={x:0,y:0});var n=o.bodyA?r.add(o.bodyA.position,o.pointA):o.pointA,i=o.bodyB?r.add(o.bodyB.position,o.pointB):o.pointB,s=r.magnitude(r.sub(n,i));o.length=o.length||s||e;var a={visible:!0,lineWidth:2,strokeStyle:"#666"};return o.render=c.extend(a,o.render),o.id=o.id||c.nextId(),o.label=o.label||"Constraint",o.type="constraint",o.stiffness=o.stiffness||1,o.angularStiffness=o.angularStiffness||0,o.angleA=o.bodyA?o.bodyA.angle:o.angleA,o.angleB=o.bodyB?o.bodyB.angle:o.angleB,o},n.solveAll=function(e,t){for(var o=0;o<e.length;o++)n.solve(e[o],t)},n.solve=function(o,n){var i=o.bodyA,s=o.bodyB,a=o.pointA,l=o.pointB;i&&!i.isStatic&&(o.pointA=r.rotate(a,i.angle-o.angleA),o.angleA=i.angle),s&&!s.isStatic&&(o.pointB=r.rotate(l,s.angle-o.angleB),o.angleB=s.angle);var c=a,d=l;if(i&&(c=r.add(i.position,a)),s&&(d=r.add(s.position,l)),c&&d){var u=r.sub(c,d),p=r.magnitude(u);0===p&&(p=e);
var f=(p-o.length)/p,v=r.div(u,p),m=r.mult(u,.5*f*o.stiffness*n*n);if(!(Math.abs(1-p/o.length)<t*n)){var y,g,x,h,b,w,S,C;i&&!i.isStatic?(x={x:c.x-i.position.x+m.x,y:c.y-i.position.y+m.y},i.velocity.x=i.position.x-i.positionPrev.x,i.velocity.y=i.position.y-i.positionPrev.y,i.angularVelocity=i.angle-i.anglePrev,y=r.add(i.velocity,r.mult(r.perp(x),i.angularVelocity)),b=r.dot(x,v),S=i.inverseMass+i.inverseInertia*b*b):(y={x:0,y:0},S=i?i.inverseMass:0),s&&!s.isStatic?(h={x:d.x-s.position.x-m.x,y:d.y-s.position.y-m.y},s.velocity.x=s.position.x-s.positionPrev.x,s.velocity.y=s.position.y-s.positionPrev.y,s.angularVelocity=s.angle-s.anglePrev,g=r.add(s.velocity,r.mult(r.perp(h),s.angularVelocity)),w=r.dot(h,v),C=s.inverseMass+s.inverseInertia*w*w):(g={x:0,y:0},C=s?s.inverseMass:0);var A=r.sub(g,y),B=r.dot(v,A)/(S+C);B>0&&(B=0);var P,M={x:v.x*B,y:v.y*B};i&&!i.isStatic&&(P=r.cross(x,M)*i.inverseInertia*(1-o.angularStiffness),i.constraintImpulse.x-=m.x,i.constraintImpulse.y-=m.y,i.constraintImpulse.angle+=P,
i.position.x-=m.x,i.position.y-=m.y,i.angle+=P),s&&!s.isStatic&&(P=r.cross(h,M)*s.inverseInertia*(1-o.angularStiffness),s.constraintImpulse.x+=m.x,s.constraintImpulse.y+=m.y,s.constraintImpulse.angle-=P,s.position.x+=m.x,s.position.y+=m.y,s.angle-=P)}}},n.postSolveAll=function(e){for(var t=0;t<e.length;t++){var o=e[t],n=o.constraintImpulse;if(0!==n.x||0!==n.y||0!==n.angle){s.set(o,!1);for(var c=0;c<o.parts.length;c++){var d=o.parts[c];i.translate(d.vertices,n),c>0&&(d.position.x+=n.x,d.position.y+=n.y),0!==n.angle&&(i.rotate(d.vertices,n.angle,o.position),l.rotate(d.axes,n.angle),c>0&&r.rotateAbout(d.position,n.angle,o.position,d.position)),a.update(d.bounds,d.vertices,o.velocity)}n.angle=0,n.x=0,n.y=0}}}}()},{"../core/Common":14,"../core/Sleeping":20,"../geometry/Axes":23,"../geometry/Bounds":24,"../geometry/Vector":26,"../geometry/Vertices":27}],13:[function(e,t,o){var n={};t.exports=n;var i=e("../geometry/Vertices"),r=e("../core/Sleeping"),s=e("../core/Mouse"),a=e("../core/Events"),l=e("../collision/Detector"),c=e("./Constraint"),d=e("../body/Composite"),u=e("../core/Common"),p=e("../geometry/Bounds");
!function(){n.create=function(t,o){var i=(t?t.mouse:null)||(o?o.mouse:null);i||(t&&t.render&&t.render.canvas?i=s.create(t.render.canvas):o&&o.element?i=s.create(o.element):(i=s.create(),u.log("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected","warn")));var r=c.create({label:"Mouse Constraint",pointA:i.position,pointB:{x:0,y:0},length:.01,stiffness:.1,angularStiffness:1,render:{strokeStyle:"#90EE90",lineWidth:3}}),l={type:"mouseConstraint",mouse:i,element:null,body:null,constraint:r,collisionFilter:{category:1,mask:4294967295,group:0}},p=u.extend(l,o);return a.on(t,"tick",function(){var o=d.allBodies(t.world);n.update(p,o),e(p)}),p},n.update=function(e,t){var o=e.mouse,n=e.constraint,s=e.body;if(0===o.button){if(n.bodyB)r.set(n.bodyB,!1),n.pointA=o.position;else for(var c=0;c<t.length;c++)if(s=t[c],p.contains(s.bounds,o.position)&&l.canCollide(s.collisionFilter,e.collisionFilter))for(var d=s.parts.length>1?1:0;d<s.parts.length;d++){
var u=s.parts[d];if(i.contains(u.vertices,o.position)){n.pointA=o.position,n.bodyB=e.body=s,n.pointB={x:o.position.x-s.position.x,y:o.position.y-s.position.y},n.angleB=s.angle,r.set(s,!1),a.trigger(e,"startdrag",{mouse:o,body:s});break}}}else n.bodyB=e.body=null,n.pointB=null,s&&a.trigger(e,"enddrag",{mouse:o,body:s})};var e=function(e){var t=e.mouse,o=t.sourceEvents;o.mousemove&&a.trigger(e,"mousemove",{mouse:t}),o.mousedown&&a.trigger(e,"mousedown",{mouse:t}),o.mouseup&&a.trigger(e,"mouseup",{mouse:t}),s.clearSourceEvents(t)}}()},{"../body/Composite":2,"../collision/Detector":5,"../core/Common":14,"../core/Events":16,"../core/Mouse":18,"../core/Sleeping":20,"../geometry/Bounds":24,"../geometry/Vertices":27,"./Constraint":12}],14:[function(e,t,o){var n={};t.exports=n,function(){n._nextId=0,n._seed=0,n.extend=function(e,t){var o,i,r;"boolean"==typeof t?(o=2,r=t):(o=1,r=!0),i=Array.prototype.slice.call(arguments,o);for(var s=0;s<i.length;s++){var a=i[s];if(a)for(var l in a)r&&a[l]&&a[l].constructor===Object?e[l]&&e[l].constructor!==Object?e[l]=a[l]:(e[l]=e[l]||{},
n.extend(e[l],r,a[l])):e[l]=a[l]}return e},n.clone=function(e,t){return n.extend({},t,e)},n.keys=function(e){if(Object.keys)return Object.keys(e);var t=[];for(var o in e)t.push(o);return t},n.values=function(e){var t=[];if(Object.keys){for(var o=Object.keys(e),n=0;n<o.length;n++)t.push(e[o[n]]);return t}for(var i in e)t.push(e[i]);return t},n.shadeColor=function(e,t){var o=parseInt(e.slice(1),16),n=Math.round(2.55*t),i=(o>>16)+n,r=(o>>8&255)+n,s=(255&o)+n;return"#"+(16777216+65536*(255>i?1>i?0:i:255)+256*(255>r?1>r?0:r:255)+(255>s?1>s?0:s:255)).toString(16).slice(1)},n.shuffle=function(e){for(var t=e.length-1;t>0;t--){var o=Math.floor(n.random()*(t+1)),i=e[t];e[t]=e[o],e[o]=i}return e},n.choose=function(e){return e[Math.floor(n.random()*e.length)]},n.isElement=function(e){try{return e instanceof HTMLElement}catch(t){return"object"==typeof e&&1===e.nodeType&&"object"==typeof e.style&&"object"==typeof e.ownerDocument}},n.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e);
},n.clamp=function(e,t,o){return t>e?t:e>o?o:e},n.sign=function(e){return 0>e?-1:1},n.now=function(){var e=window.performance||{};return e.now=function(){return e.now||e.webkitNow||e.msNow||e.oNow||e.mozNow||function(){return+new Date}}(),e.now()},n.random=function(t,o){return t="undefined"!=typeof t?t:0,o="undefined"!=typeof o?o:1,t+e()*(o-t)},n.colorToNumber=function(e){return e=e.replace("#",""),3==e.length&&(e=e.charAt(0)+e.charAt(0)+e.charAt(1)+e.charAt(1)+e.charAt(2)+e.charAt(2)),parseInt(e,16)},n.log=function(e,t){if(console&&console.log&&console.warn)switch(t){case"warn":console.warn("Matter.js:",e);break;case"error":console.log("Matter.js:",e)}},n.nextId=function(){return n._nextId++},n.indexOf=function(e,t){if(e.indexOf)return e.indexOf(t);for(var o=0;o<e.length;o++)if(e[o]===t)return o;return-1};var e=function(){return n._seed=(9301*n._seed+49297)%233280,n._seed/233280}}()},{}],15:[function(e,t,o){var n={};t.exports=n;var i=e("../body/World"),r=e("./Sleeping"),s=e("../collision/Resolver"),a=e("../render/Render"),l=e("../collision/Pairs"),c=(e("./Metrics"),
e("../collision/Grid")),d=e("./Events"),u=e("../body/Composite"),p=e("../constraint/Constraint"),f=e("./Common"),v=e("../body/Body");!function(){n.create=function(e,t){t=f.isElement(e)?t:e,e=f.isElement(e)?e:null,t=t||{},(e||t.render)&&f.log("Engine.create: engine.render is deprecated (see docs)","warn");var o={positionIterations:6,velocityIterations:4,constraintIterations:2,enableSleeping:!1,events:[],timing:{timestamp:0,timeScale:1},broadphase:{controller:c}},n=f.extend(o,t);if(e||n.render){var r={element:e,controller:a};n.render=f.extend(r,n.render)}return n.render&&n.render.controller&&(n.render=n.render.controller.create(n.render)),n.render&&(n.render.engine=n),n.world=t.world||i.create(n.world),n.pairs=l.create(),n.broadphase=n.broadphase.controller.create(n.broadphase),n.metrics=n.metrics||{extended:!1},n},n.update=function(n,i,a){i=i||1e3/60,a=a||1;var c,f=n.world,v=n.timing,m=n.broadphase,y=[];v.timestamp+=i*v.timeScale;var g={timestamp:v.timestamp};d.trigger(n,"beforeUpdate",g);
var x=u.allBodies(f),h=u.allConstraints(f);for(n.enableSleeping&&r.update(x,v.timeScale),t(x,f.gravity),o(x,i,v.timeScale,a,f.bounds),c=0;c<n.constraintIterations;c++)p.solveAll(h,v.timeScale);p.postSolveAll(x),m.controller?(f.isModified&&m.controller.clear(m),m.controller.update(m,x,n,f.isModified),y=m.pairsList):y=x,f.isModified&&u.setModified(f,!1,!1,!0);var b=m.detector(y,n),w=n.pairs,S=v.timestamp;for(l.update(w,b,S),l.removeOld(w,S),n.enableSleeping&&r.afterCollisions(w.list,v.timeScale),w.collisionStart.length>0&&d.trigger(n,"collisionStart",{pairs:w.collisionStart}),s.preSolvePosition(w.list),c=0;c<n.positionIterations;c++)s.solvePosition(w.list,v.timeScale);for(s.postSolvePosition(x),s.preSolveVelocity(w.list),c=0;c<n.velocityIterations;c++)s.solveVelocity(w.list,v.timeScale);return w.collisionActive.length>0&&d.trigger(n,"collisionActive",{pairs:w.collisionActive}),w.collisionEnd.length>0&&d.trigger(n,"collisionEnd",{pairs:w.collisionEnd}),e(x),d.trigger(n,"afterUpdate",g),n},
n.merge=function(e,t){if(f.extend(e,t),t.world){e.world=t.world,n.clear(e);for(var o=u.allBodies(e.world),i=0;i<o.length;i++){var s=o[i];r.set(s,!1),s.id=f.nextId()}}},n.clear=function(e){var t=e.world;l.clear(e.pairs);var o=e.broadphase;if(o.controller){var n=u.allBodies(t);o.controller.clear(o),o.controller.update(o,n,e,!0)}};var e=function(e){for(var t=0;t<e.length;t++){var o=e[t];o.force.x=0,o.force.y=0,o.torque=0}},t=function(e,t){var o="undefined"!=typeof t.scale?t.scale:.001;if((0!==t.x||0!==t.y)&&0!==o)for(var n=0;n<e.length;n++){var i=e[n];i.isStatic||i.isSleeping||(i.force.y+=i.mass*t.y*o,i.force.x+=i.mass*t.x*o)}},o=function(e,t,o,n,i){for(var r=0;r<e.length;r++){var s=e[r];s.isStatic||s.isSleeping||v.update(s,t,o,n)}}}()},{"../body/Body":1,"../body/Composite":2,"../body/World":3,"../collision/Grid":6,"../collision/Pairs":8,"../collision/Resolver":10,"../constraint/Constraint":12,"../render/Render":29,"./Common":14,"./Events":16,"./Metrics":17,"./Sleeping":20}],16:[function(e,t,o){
var n={};t.exports=n;var i=e("./Common");!function(){n.on=function(e,t,o){for(var n,i=t.split(" "),r=0;r<i.length;r++)n=i[r],e.events=e.events||{},e.events[n]=e.events[n]||[],e.events[n].push(o);return o},n.off=function(e,t,o){if(!t)return void(e.events={});"function"==typeof t&&(o=t,t=i.keys(e.events).join(" "));for(var n=t.split(" "),r=0;r<n.length;r++){var s=e.events[n[r]],a=[];if(o&&s)for(var l=0;l<s.length;l++)s[l]!==o&&a.push(s[l]);e.events[n[r]]=a}},n.trigger=function(e,t,o){var n,r,s,a;if(e.events){o||(o={}),n=t.split(" ");for(var l=0;l<n.length;l++)if(r=n[l],s=e.events[r]){a=i.clone(o,!1),a.name=r,a.source=e;for(var c=0;c<s.length;c++)s[c].apply(e,[a])}}}}()},{"./Common":14}],17:[function(e,t,o){},{"../body/Composite":2,"./Common":14}],18:[function(e,t,o){var n={};t.exports=n;var i=e("../core/Common");!function(){n.create=function(t){var o={};return t||i.log("Mouse.create: element was undefined, defaulting to document.body","warn"),o.element=t||document.body,o.absolute={x:0,y:0
},o.position={x:0,y:0},o.mousedownPosition={x:0,y:0},o.mouseupPosition={x:0,y:0},o.offset={x:0,y:0},o.scale={x:1,y:1},o.wheelDelta=0,o.button=-1,o.pixelRatio=o.element.getAttribute("data-pixel-ratio")||1,o.sourceEvents={mousemove:null,mousedown:null,mouseup:null,mousewheel:null},o.mousemove=function(t){var n=e(t,o.element,o.pixelRatio),i=t.changedTouches;i&&(o.button=0,t.preventDefault()),o.absolute.x=n.x,o.absolute.y=n.y,o.position.x=o.absolute.x*o.scale.x+o.offset.x,o.position.y=o.absolute.y*o.scale.y+o.offset.y,o.sourceEvents.mousemove=t},o.mousedown=function(t){var n=e(t,o.element,o.pixelRatio),i=t.changedTouches;i?(o.button=0,t.preventDefault()):o.button=t.button,o.absolute.x=n.x,o.absolute.y=n.y,o.position.x=o.absolute.x*o.scale.x+o.offset.x,o.position.y=o.absolute.y*o.scale.y+o.offset.y,o.mousedownPosition.x=o.position.x,o.mousedownPosition.y=o.position.y,o.sourceEvents.mousedown=t},o.mouseup=function(t){var n=e(t,o.element,o.pixelRatio),i=t.changedTouches;i&&t.preventDefault(),o.button=-1,
o.absolute.x=n.x,o.absolute.y=n.y,o.position.x=o.absolute.x*o.scale.x+o.offset.x,o.position.y=o.absolute.y*o.scale.y+o.offset.y,o.mouseupPosition.x=o.position.x,o.mouseupPosition.y=o.position.y,o.sourceEvents.mouseup=t},o.mousewheel=function(e){o.wheelDelta=Math.max(-1,Math.min(1,e.wheelDelta||-e.detail)),e.preventDefault()},n.setElement(o,o.element),o},n.setElement=function(e,t){e.element=t,t.addEventListener("mousemove",e.mousemove),t.addEventListener("mousedown",e.mousedown),t.addEventListener("mouseup",e.mouseup),t.addEventListener("mousewheel",e.mousewheel),t.addEventListener("DOMMouseScroll",e.mousewheel),t.addEventListener("touchmove",e.mousemove),t.addEventListener("touchstart",e.mousedown),t.addEventListener("touchend",e.mouseup)},n.clearSourceEvents=function(e){e.sourceEvents.mousemove=null,e.sourceEvents.mousedown=null,e.sourceEvents.mouseup=null,e.sourceEvents.mousewheel=null,e.wheelDelta=0},n.setOffset=function(e,t){e.offset.x=t.x,e.offset.y=t.y,e.position.x=e.absolute.x*e.scale.x+e.offset.x,
e.position.y=e.absolute.y*e.scale.y+e.offset.y},n.setScale=function(e,t){e.scale.x=t.x,e.scale.y=t.y,e.position.x=e.absolute.x*e.scale.x+e.offset.x,e.position.y=e.absolute.y*e.scale.y+e.offset.y};var e=function(e,t,o){var n,i,r=t.getBoundingClientRect(),s=document.documentElement||document.body.parentNode||document.body,a=void 0!==window.pageXOffset?window.pageXOffset:s.scrollLeft,l=void 0!==window.pageYOffset?window.pageYOffset:s.scrollTop,c=e.changedTouches;return c?(n=c[0].pageX-r.left-a,i=c[0].pageY-r.top-l):(n=e.pageX-r.left-a,i=e.pageY-r.top-l),{x:n/(t.clientWidth/t.width*o),y:i/(t.clientHeight/t.height*o)}}}()},{"../core/Common":14}],19:[function(e,t,o){var n={};t.exports=n;var i=e("./Events"),r=e("./Engine"),s=e("./Common");!function(){var e,t;"undefined"!=typeof window&&(e=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(function(){e(s.now())},1e3/60)},t=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame),
n.create=function(e){var t={fps:60,correction:1,deltaSampleSize:60,counterTimestamp:0,frameCounter:0,deltaHistory:[],timePrev:null,timeScalePrev:1,frameRequestId:null,isFixed:!1,enabled:!0},o=s.extend(t,e);return o.delta=o.delta||1e3/o.fps,o.deltaMin=o.deltaMin||1e3/o.fps,o.deltaMax=o.deltaMax||1e3/(.5*o.fps),o.fps=1e3/o.delta,o},n.run=function(t,o){return"undefined"!=typeof t.positionIterations&&(o=t,t=n.create()),function i(r){t.frameRequestId=e(i),r&&t.enabled&&n.tick(t,o,r)}(),t},n.tick=function(e,t,o){var n,s=t.timing,a=1,l={timestamp:s.timestamp};i.trigger(e,"beforeTick",l),i.trigger(t,"beforeTick",l),e.isFixed?n=e.delta:(n=o-e.timePrev||e.delta,e.timePrev=o,e.deltaHistory.push(n),e.deltaHistory=e.deltaHistory.slice(-e.deltaSampleSize),n=Math.min.apply(null,e.deltaHistory),n=n<e.deltaMin?e.deltaMin:n,n=n>e.deltaMax?e.deltaMax:n,a=n/e.delta,e.delta=n),0!==e.timeScalePrev&&(a*=s.timeScale/e.timeScalePrev),0===s.timeScale&&(a=0),e.timeScalePrev=s.timeScale,e.correction=a,e.frameCounter+=1,
o-e.counterTimestamp>=1e3&&(e.fps=e.frameCounter*((o-e.counterTimestamp)/1e3),e.counterTimestamp=o,e.frameCounter=0),i.trigger(e,"tick",l),i.trigger(t,"tick",l),t.world.isModified&&t.render&&t.render.controller&&t.render.controller.clear&&t.render.controller.clear(t.render),i.trigger(e,"beforeUpdate",l),r.update(t,n,a),i.trigger(e,"afterUpdate",l),t.render&&t.render.controller&&(i.trigger(e,"beforeRender",l),i.trigger(t,"beforeRender",l),t.render.controller.world(t.render),i.trigger(e,"afterRender",l),i.trigger(t,"afterRender",l)),i.trigger(e,"afterTick",l),i.trigger(t,"afterTick",l)},n.stop=function(e){t(e.frameRequestId)},n.start=function(e,t){n.run(e,t)}}()},{"./Common":14,"./Engine":15,"./Events":16}],20:[function(e,t,o){var n={};t.exports=n;var i=e("./Events");!function(){n._motionWakeThreshold=.18,n._motionSleepThreshold=.08,n._minBias=.9,n.update=function(e,t){for(var o=t*t*t,i=0;i<e.length;i++){var r=e[i],s=r.speed*r.speed+r.angularSpeed*r.angularSpeed;if(0===r.force.x&&0===r.force.y){
var a=Math.min(r.motion,s),l=Math.max(r.motion,s);r.motion=n._minBias*a+(1-n._minBias)*l,r.sleepThreshold>0&&r.motion<n._motionSleepThreshold*o?(r.sleepCounter+=1,r.sleepCounter>=r.sleepThreshold&&n.set(r,!0)):r.sleepCounter>0&&(r.sleepCounter-=1)}else n.set(r,!1)}},n.afterCollisions=function(e,t){for(var o=t*t*t,i=0;i<e.length;i++){var r=e[i];if(r.isActive){var s=r.collision,a=s.bodyA.parent,l=s.bodyB.parent;if(!(a.isSleeping&&l.isSleeping||a.isStatic||l.isStatic)&&(a.isSleeping||l.isSleeping)){var c=a.isSleeping&&!a.isStatic?a:l,d=c===a?l:a;!c.isStatic&&d.motion>n._motionWakeThreshold*o&&n.set(c,!1)}}}},n.set=function(e,t){var o=e.isSleeping;t?(e.isSleeping=!0,e.sleepCounter=e.sleepThreshold,e.positionImpulse.x=0,e.positionImpulse.y=0,e.positionPrev.x=e.position.x,e.positionPrev.y=e.position.y,e.anglePrev=e.angle,e.speed=0,e.angularSpeed=0,e.motion=0,o||i.trigger(e,"sleepStart")):(e.isSleeping=!1,e.sleepCounter=0,o&&i.trigger(e,"sleepEnd"))}}()},{"./Events":16}],21:[function(e,t,o){var n={};
t.exports=n;var i=e("../geometry/Vertices"),r=e("../core/Common"),s=e("../body/Body"),a=e("../geometry/Bounds"),l=e("../geometry/Vector");!function(){n.rectangle=function(e,t,o,n,a){a=a||{};var l={label:"Rectangle Body",position:{x:e,y:t},vertices:i.fromPath("L 0 0 L "+o+" 0 L "+o+" "+n+" L 0 "+n)};if(a.chamfer){var c=a.chamfer;l.vertices=i.chamfer(l.vertices,c.radius,c.quality,c.qualityMin,c.qualityMax),delete a.chamfer}return s.create(r.extend({},l,a))},n.trapezoid=function(e,t,o,n,a,l){l=l||{},a*=.5;var c,d=(1-2*a)*o,u=o*a,p=u+d,f=p+u;c=.5>a?"L 0 0 L "+u+" "+-n+" L "+p+" "+-n+" L "+f+" 0":"L 0 0 L "+p+" "+-n+" L "+f+" 0";var v={label:"Trapezoid Body",position:{x:e,y:t},vertices:i.fromPath(c)};if(l.chamfer){var m=l.chamfer;v.vertices=i.chamfer(v.vertices,m.radius,m.quality,m.qualityMin,m.qualityMax),delete l.chamfer}return s.create(r.extend({},v,l))},n.circle=function(e,t,o,i,s){i=i||{};var a={label:"Circle Body",circleRadius:o};s=s||25;var l=Math.ceil(Math.max(10,Math.min(s,o)));return l%2===1&&(l+=1),
n.polygon(e,t,l,o,r.extend({},a,i))},n.polygon=function(e,t,o,a,l){if(l=l||{},3>o)return n.circle(e,t,a,l);for(var c=2*Math.PI/o,d="",u=.5*c,p=0;o>p;p+=1){var f=u+p*c,v=Math.cos(f)*a,m=Math.sin(f)*a;d+="L "+v.toFixed(3)+" "+m.toFixed(3)+" "}var y={label:"Polygon Body",position:{x:e,y:t},vertices:i.fromPath(d)};if(l.chamfer){var g=l.chamfer;y.vertices=i.chamfer(y.vertices,g.radius,g.quality,g.qualityMin,g.qualityMax),delete l.chamfer}return s.create(r.extend({},y,l))},n.fromVertices=function(e,t,o,n,c,d,u){var p,f,v,m,y,g,x,h,b;for(n=n||{},f=[],c="undefined"!=typeof c?c:!1,d="undefined"!=typeof d?d:.01,u="undefined"!=typeof u?u:10,window.decomp||r.log("Bodies.fromVertices: poly-decomp.js required. Could not decompose vertices. Fallback to convex hull.","warn"),r.isArray(o[0])||(o=[o]),h=0;h<o.length;h+=1)if(m=o[h],v=i.isConvex(m),v||!window.decomp)m=v?i.clockwiseSort(m):i.hull(m),f.push({position:{x:e,y:t},vertices:m});else{var w=new decomp.Polygon;for(y=0;y<m.length;y++)w.vertices.push([m[y].x,m[y].y]);
w.makeCCW(),d!==!1&&w.removeCollinearPoints(d);var S=w.quickDecomp();for(y=0;y<S.length;y++){var C=S[y],A=[];for(g=0;g<C.vertices.length;g++)A.push({x:C.vertices[g][0],y:C.vertices[g][1]});u>0&&i.area(A)<u||f.push({position:i.centre(A),vertices:A})}}for(y=0;y<f.length;y++)f[y]=s.create(r.extend(f[y],n));if(c){var B=5;for(y=0;y<f.length;y++){var P=f[y];for(g=y+1;g<f.length;g++){var M=f[g];if(a.overlaps(P.bounds,M.bounds)){var k=P.vertices,I=M.vertices;for(x=0;x<P.vertices.length;x++)for(b=0;b<M.vertices.length;b++){var T=l.magnitudeSquared(l.sub(k[(x+1)%k.length],I[b])),V=l.magnitudeSquared(l.sub(k[x],I[(b+1)%I.length]));B>T&&B>V&&(k[x].isInternal=!0,I[b].isInternal=!0)}}}}}return f.length>1?(p=s.create(r.extend({parts:f.slice(0)},n)),s.setPosition(p,{x:e,y:t}),p):f[0]}}()},{"../body/Body":1,"../core/Common":14,"../geometry/Bounds":24,"../geometry/Vector":26,"../geometry/Vertices":27}],22:[function(e,t,o){var n={};t.exports=n;var i=e("../body/Composite"),r=e("../constraint/Constraint"),s=e("../core/Common"),a=e("../body/Body"),l=e("./Bodies");
!function(){n.stack=function(e,t,o,n,r,s,l){for(var c,d=i.create({label:"Stack"}),u=e,p=t,f=0,v=0;n>v;v++){for(var m=0,y=0;o>y;y++){var g=l(u,p,y,v,c,f);if(g){var x=g.bounds.max.y-g.bounds.min.y,h=g.bounds.max.x-g.bounds.min.x;x>m&&(m=x),a.translate(g,{x:.5*h,y:.5*x}),u=g.bounds.max.x+r,i.addBody(d,g),c=g,f+=1}else u+=r}p+=m+s,u=e}return d},n.chain=function(e,t,o,n,a,l){for(var c=e.bodies,d=1;d<c.length;d++){var u=c[d-1],p=c[d],f=u.bounds.max.y-u.bounds.min.y,v=u.bounds.max.x-u.bounds.min.x,m=p.bounds.max.y-p.bounds.min.y,y=p.bounds.max.x-p.bounds.min.x,g={bodyA:u,pointA:{x:v*t,y:f*o},bodyB:p,pointB:{x:y*n,y:m*a}},x=s.extend(g,l);i.addConstraint(e,r.create(x))}return e.label+=" Chain",e},n.mesh=function(e,t,o,n,a){var l,c,d,u,p,f=e.bodies;for(l=0;o>l;l++){for(c=1;t>c;c++)d=f[c-1+l*t],u=f[c+l*t],i.addConstraint(e,r.create(s.extend({bodyA:d,bodyB:u},a)));if(l>0)for(c=0;t>c;c++)d=f[c+(l-1)*t],u=f[c+l*t],i.addConstraint(e,r.create(s.extend({bodyA:d,bodyB:u},a))),n&&c>0&&(p=f[c-1+(l-1)*t],i.addConstraint(e,r.create(s.extend({
bodyA:p,bodyB:u},a)))),n&&t-1>c&&(p=f[c+1+(l-1)*t],i.addConstraint(e,r.create(s.extend({bodyA:p,bodyB:u},a))))}return e.label+=" Mesh",e},n.pyramid=function(e,t,o,i,r,s,l){return n.stack(e,t,o,i,r,s,function(t,n,s,c,d,u){var p=Math.min(i,Math.ceil(o/2)),f=d?d.bounds.max.x-d.bounds.min.x:0;if(!(c>p)){c=p-c;var v=c,m=o-1-c;if(!(v>s||s>m)){1===u&&a.translate(d,{x:(s+(o%2===1?1:-1))*f,y:0});var y=d?s*f:0;return l(e+y+s*r,n,s,c,d,u)}}})},n.newtonsCradle=function(e,t,o,n,s){for(var a=i.create({label:"Newtons Cradle"}),c=0;o>c;c++){var d=1.9,u=l.circle(e+c*(n*d),t+s,n,{inertia:1/0,restitution:1,friction:0,frictionAir:1e-4,slop:1}),p=r.create({pointA:{x:e+c*(n*d),y:t},bodyB:u});i.addBody(a,u),i.addConstraint(a,p)}return a},n.car=function(e,t,o,n,s){var c=a.nextGroup(!0),d=-20,u=.5*-o+d,p=.5*o-d,f=0,v=i.create({label:"Car"}),m=l.trapezoid(e,t,o,n,.3,{collisionFilter:{group:c},friction:.01,chamfer:{radius:10}}),y=l.circle(e+u,t+f,s,{collisionFilter:{group:c},friction:.8,density:.01}),g=l.circle(e+p,t+f,s,{
collisionFilter:{group:c},friction:.8,density:.01}),x=r.create({bodyA:m,pointA:{x:u,y:f},bodyB:y,stiffness:.2}),h=r.create({bodyA:m,pointA:{x:p,y:f},bodyB:g,stiffness:.2});return i.addBody(v,m),i.addBody(v,y),i.addBody(v,g),i.addConstraint(v,x),i.addConstraint(v,h),v},n.softBody=function(e,t,o,i,r,a,c,d,u,p){u=s.extend({inertia:1/0},u),p=s.extend({stiffness:.4},p);var f=n.stack(e,t,o,i,r,a,function(e,t){return l.circle(e,t,d,u)});return n.mesh(f,o,i,c,p),f.label="Soft Body",f}}()},{"../body/Body":1,"../body/Composite":2,"../constraint/Constraint":12,"../core/Common":14,"./Bodies":21}],23:[function(e,t,o){var n={};t.exports=n;var i=e("../geometry/Vector"),r=e("../core/Common");!function(){n.fromVertices=function(e){for(var t={},o=0;o<e.length;o++){var n=(o+1)%e.length,s=i.normalise({x:e[n].y-e[o].y,y:e[o].x-e[n].x}),a=0===s.y?1/0:s.x/s.y;a=a.toFixed(3).toString(),t[a]=s}return r.values(t)},n.rotate=function(e,t){if(0!==t)for(var o=Math.cos(t),n=Math.sin(t),i=0;i<e.length;i++){var r,s=e[i];
r=s.x*o-s.y*n,s.y=s.x*n+s.y*o,s.x=r}}}()},{"../core/Common":14,"../geometry/Vector":26}],24:[function(e,t,o){var n={};t.exports=n,function(){n.create=function(e){var t={min:{x:0,y:0},max:{x:0,y:0}};return e&&n.update(t,e),t},n.update=function(e,t,o){e.min.x=1/0,e.max.x=-(1/0),e.min.y=1/0,e.max.y=-(1/0);for(var n=0;n<t.length;n++){var i=t[n];i.x>e.max.x&&(e.max.x=i.x),i.x<e.min.x&&(e.min.x=i.x),i.y>e.max.y&&(e.max.y=i.y),i.y<e.min.y&&(e.min.y=i.y)}o&&(o.x>0?e.max.x+=o.x:e.min.x+=o.x,o.y>0?e.max.y+=o.y:e.min.y+=o.y)},n.contains=function(e,t){return t.x>=e.min.x&&t.x<=e.max.x&&t.y>=e.min.y&&t.y<=e.max.y},n.overlaps=function(e,t){return e.min.x<=t.max.x&&e.max.x>=t.min.x&&e.max.y>=t.min.y&&e.min.y<=t.max.y},n.translate=function(e,t){e.min.x+=t.x,e.max.x+=t.x,e.min.y+=t.y,e.max.y+=t.y},n.shift=function(e,t){var o=e.max.x-e.min.x,n=e.max.y-e.min.y;e.min.x=t.x,e.max.x=t.x+o,e.min.y=t.y,e.max.y=t.y+n}}()},{}],25:[function(e,t,o){var n={};t.exports=n;e("../geometry/Bounds");!function(){n.pathToVertices=function(t,o){
var n,i,r,s,a,l,c,d,u,p,f,v,m=[],y=0,g=0,x=0;o=o||15;var h=function(e,t,o){var n=o%2===1&&o>1;if(!u||e!=u.x||t!=u.y){u&&n?(f=u.x,v=u.y):(f=0,v=0);var i={x:f+e,y:v+t};!n&&u||(u=i),m.push(i),g=f+e,x=v+t}},b=function(e){var t=e.pathSegTypeAsLetter.toUpperCase();if("Z"!==t){switch(t){case"M":case"L":case"T":case"C":case"S":case"Q":g=e.x,x=e.y;break;case"H":g=e.x;break;case"V":x=e.y}h(g,x,e.pathSegType)}};for(e(t),r=t.getTotalLength(),l=[],n=0;n<t.pathSegList.numberOfItems;n+=1)l.push(t.pathSegList.getItem(n));for(c=l.concat();r>y;){if(p=t.getPathSegAtLength(y),a=l[p],a!=d){for(;c.length&&c[0]!=a;)b(c.shift());d=a}switch(a.pathSegTypeAsLetter.toUpperCase()){case"C":case"T":case"S":case"Q":case"A":s=t.getPointAtLength(y),h(s.x,s.y,0)}y+=o}for(n=0,i=c.length;i>n;++n)b(c[n]);return m};var e=function(e){for(var t,o,n,i,r,s,a=e.pathSegList,l=0,c=0,d=a.numberOfItems,u=0;d>u;++u){var p=a.getItem(u),f=p.pathSegTypeAsLetter;if(/[MLHVCSQTA]/.test(f))"x"in p&&(l=p.x),"y"in p&&(c=p.y);else switch("x1"in p&&(n=l+p.x1),
"x2"in p&&(r=l+p.x2),"y1"in p&&(i=c+p.y1),"y2"in p&&(s=c+p.y2),"x"in p&&(l+=p.x),"y"in p&&(c+=p.y),f){case"m":a.replaceItem(e.createSVGPathSegMovetoAbs(l,c),u);break;case"l":a.replaceItem(e.createSVGPathSegLinetoAbs(l,c),u);break;case"h":a.replaceItem(e.createSVGPathSegLinetoHorizontalAbs(l),u);break;case"v":a.replaceItem(e.createSVGPathSegLinetoVerticalAbs(c),u);break;case"c":a.replaceItem(e.createSVGPathSegCurvetoCubicAbs(l,c,n,i,r,s),u);break;case"s":a.replaceItem(e.createSVGPathSegCurvetoCubicSmoothAbs(l,c,r,s),u);break;case"q":a.replaceItem(e.createSVGPathSegCurvetoQuadraticAbs(l,c,n,i),u);break;case"t":a.replaceItem(e.createSVGPathSegCurvetoQuadraticSmoothAbs(l,c),u);break;case"a":a.replaceItem(e.createSVGPathSegArcAbs(l,c,p.r1,p.r2,p.angle,p.largeArcFlag,p.sweepFlag),u);break;case"z":case"Z":l=t,c=o}"M"!=f&&"m"!=f||(t=l,o=c)}}}()},{"../geometry/Bounds":24}],26:[function(e,t,o){var n={};t.exports=n,function(){n.create=function(e,t){return{x:e||0,y:t||0}},n.clone=function(e){return{
x:e.x,y:e.y}},n.magnitude=function(e){return Math.sqrt(e.x*e.x+e.y*e.y)},n.magnitudeSquared=function(e){return e.x*e.x+e.y*e.y},n.rotate=function(e,t){var o=Math.cos(t),n=Math.sin(t);return{x:e.x*o-e.y*n,y:e.x*n+e.y*o}},n.rotateAbout=function(e,t,o,n){var i=Math.cos(t),r=Math.sin(t);n||(n={});var s=o.x+((e.x-o.x)*i-(e.y-o.y)*r);return n.y=o.y+((e.x-o.x)*r+(e.y-o.y)*i),n.x=s,n},n.normalise=function(e){var t=n.magnitude(e);return 0===t?{x:0,y:0}:{x:e.x/t,y:e.y/t}},n.dot=function(e,t){return e.x*t.x+e.y*t.y},n.cross=function(e,t){return e.x*t.y-e.y*t.x},n.cross3=function(e,t,o){return(t.x-e.x)*(o.y-e.y)-(t.y-e.y)*(o.x-e.x)},n.add=function(e,t,o){return o||(o={}),o.x=e.x+t.x,o.y=e.y+t.y,o},n.sub=function(e,t,o){return o||(o={}),o.x=e.x-t.x,o.y=e.y-t.y,o},n.mult=function(e,t){return{x:e.x*t,y:e.y*t}},n.div=function(e,t){return{x:e.x/t,y:e.y/t}},n.perp=function(e,t){return t=t===!0?-1:1,{x:t*-e.y,y:t*e.x}},n.neg=function(e){return{x:-e.x,y:-e.y}},n.angle=function(e,t){return Math.atan2(t.y-e.y,t.x-e.x);
},n._temp=[n.create(),n.create(),n.create(),n.create(),n.create(),n.create()]}()},{}],27:[function(e,t,o){var n={};t.exports=n;var i=e("../geometry/Vector"),r=e("../core/Common");!function(){n.create=function(e,t){for(var o=[],n=0;n<e.length;n++){var i=e[n],r={x:i.x,y:i.y,index:n,body:t,isInternal:!1};o.push(r)}return o},n.fromPath=function(e,t){var o=/L?\s*([\-\d\.e]+)[\s,]*([\-\d\.e]+)*/gi,i=[];return e.replace(o,function(e,t,o){i.push({x:parseFloat(t),y:parseFloat(o)})}),n.create(i,t)},n.centre=function(e){for(var t,o,r,s=n.area(e,!0),a={x:0,y:0},l=0;l<e.length;l++)r=(l+1)%e.length,t=i.cross(e[l],e[r]),o=i.mult(i.add(e[l],e[r]),t),a=i.add(a,o);return i.div(a,6*s)},n.mean=function(e){for(var t={x:0,y:0},o=0;o<e.length;o++)t.x+=e[o].x,t.y+=e[o].y;return i.div(t,e.length)},n.area=function(e,t){for(var o=0,n=e.length-1,i=0;i<e.length;i++)o+=(e[n].x-e[i].x)*(e[n].y+e[i].y),n=i;return t?o/2:Math.abs(o)/2},n.inertia=function(e,t){for(var o,n,r=0,s=0,a=e,l=0;l<a.length;l++)n=(l+1)%a.length,o=Math.abs(i.cross(a[n],a[l])),
r+=o*(i.dot(a[n],a[n])+i.dot(a[n],a[l])+i.dot(a[l],a[l])),s+=o;return t/6*(r/s)},n.translate=function(e,t,o){var n;if(o)for(n=0;n<e.length;n++)e[n].x+=t.x*o,e[n].y+=t.y*o;else for(n=0;n<e.length;n++)e[n].x+=t.x,e[n].y+=t.y;return e},n.rotate=function(e,t,o){if(0!==t){for(var n=Math.cos(t),i=Math.sin(t),r=0;r<e.length;r++){var s=e[r],a=s.x-o.x,l=s.y-o.y;s.x=o.x+(a*n-l*i),s.y=o.y+(a*i+l*n)}return e}},n.contains=function(e,t){for(var o=0;o<e.length;o++){var n=e[o],i=e[(o+1)%e.length];if((t.x-n.x)*(i.y-n.y)+(t.y-n.y)*(n.x-i.x)>0)return!1}return!0},n.scale=function(e,t,o,r){if(1===t&&1===o)return e;r=r||n.centre(e);for(var s,a,l=0;l<e.length;l++)s=e[l],a=i.sub(s,r),e[l].x=r.x+a.x*t,e[l].y=r.y+a.y*o;return e},n.chamfer=function(e,t,o,n,s){t=t||[8],t.length||(t=[t]),o="undefined"!=typeof o?o:-1,n=n||2,s=s||14;for(var a=[],l=0;l<e.length;l++){var c=e[l-1>=0?l-1:e.length-1],d=e[l],u=e[(l+1)%e.length],p=t[l<t.length?l:t.length-1];if(0!==p){var f=i.normalise({x:d.y-c.y,y:c.x-d.x}),v=i.normalise({x:u.y-d.y,
y:d.x-u.x}),m=Math.sqrt(2*Math.pow(p,2)),y=i.mult(r.clone(f),p),g=i.normalise(i.mult(i.add(f,v),.5)),x=i.sub(d,i.mult(g,m)),h=o;-1===o&&(h=1.75*Math.pow(p,.32)),h=r.clamp(h,n,s),h%2===1&&(h+=1);for(var b=Math.acos(i.dot(f,v)),w=b/h,S=0;h>S;S++)a.push(i.add(i.rotate(y,w*S),x))}else a.push(d)}return a},n.clockwiseSort=function(e){var t=n.mean(e);return e.sort(function(e,o){return i.angle(t,e)-i.angle(t,o)}),e},n.isConvex=function(e){var t,o,n,i,r=0,s=e.length;if(3>s)return null;for(t=0;s>t;t++)if(o=(t+1)%s,n=(t+2)%s,i=(e[o].x-e[t].x)*(e[n].y-e[o].y),i-=(e[o].y-e[t].y)*(e[n].x-e[o].x),0>i?r|=1:i>0&&(r|=2),3===r)return!1;return 0!==r?!0:null},n.hull=function(e){var t,o,n=[],r=[];for(e=e.slice(0),e.sort(function(e,t){var o=e.x-t.x;return 0!==o?o:e.y-t.y}),o=0;o<e.length;o++){for(t=e[o];r.length>=2&&i.cross3(r[r.length-2],r[r.length-1],t)<=0;)r.pop();r.push(t)}for(o=e.length-1;o>=0;o--){for(t=e[o];n.length>=2&&i.cross3(n[n.length-2],n[n.length-1],t)<=0;)n.pop();n.push(t)}return n.pop(),r.pop(),
n.concat(r)}}()},{"../core/Common":14,"../geometry/Vector":26}],28:[function(e,t,o){var n=t.exports={};n.version="master",n.Body=e("../body/Body"),n.Composite=e("../body/Composite"),n.World=e("../body/World"),n.Contact=e("../collision/Contact"),n.Detector=e("../collision/Detector"),n.Grid=e("../collision/Grid"),n.Pairs=e("../collision/Pairs"),n.Pair=e("../collision/Pair"),n.Query=e("../collision/Query"),n.Resolver=e("../collision/Resolver"),n.SAT=e("../collision/SAT"),n.Constraint=e("../constraint/Constraint"),n.MouseConstraint=e("../constraint/MouseConstraint"),n.Common=e("../core/Common"),n.Engine=e("../core/Engine"),n.Events=e("../core/Events"),n.Mouse=e("../core/Mouse"),n.Runner=e("../core/Runner"),n.Sleeping=e("../core/Sleeping"),n.Bodies=e("../factory/Bodies"),n.Composites=e("../factory/Composites"),n.Axes=e("../geometry/Axes"),n.Bounds=e("../geometry/Bounds"),n.Svg=e("../geometry/Svg"),n.Vector=e("../geometry/Vector"),n.Vertices=e("../geometry/Vertices"),n.Render=e("../render/Render"),
n.RenderPixi=e("../render/RenderPixi"),n.World.add=n.Composite.add,n.World.remove=n.Composite.remove,n.World.addComposite=n.Composite.addComposite,n.World.addBody=n.Composite.addBody,n.World.addConstraint=n.Composite.addConstraint,n.World.clear=n.Composite.clear,n.Engine.run=n.Runner.run},{"../body/Body":1,"../body/Composite":2,"../body/World":3,"../collision/Contact":4,"../collision/Detector":5,"../collision/Grid":6,"../collision/Pair":7,"../collision/Pairs":8,"../collision/Query":9,"../collision/Resolver":10,"../collision/SAT":11,"../constraint/Constraint":12,"../constraint/MouseConstraint":13,"../core/Common":14,"../core/Engine":15,"../core/Events":16,"../core/Metrics":17,"../core/Mouse":18,"../core/Runner":19,"../core/Sleeping":20,"../factory/Bodies":21,"../factory/Composites":22,"../geometry/Axes":23,"../geometry/Bounds":24,"../geometry/Svg":25,"../geometry/Vector":26,"../geometry/Vertices":27,"../render/Render":29,"../render/RenderPixi":30}],29:[function(e,t,o){var n={};t.exports=n;
var i=e("../core/Common"),r=e("../body/Composite"),s=e("../geometry/Bounds"),a=e("../core/Events"),l=e("../collision/Grid"),c=e("../geometry/Vector");!function(){var e,t;"undefined"!=typeof window&&(e=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(function(){e(i.now())},1e3/60)},t=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame),n.create=function(e){var t={controller:n,engine:null,element:null,canvas:null,mouse:null,frameRequestId:null,options:{width:800,height:600,pixelRatio:1,background:"#fafafa",wireframeBackground:"#222",hasBounds:!!e.bounds,enabled:!0,wireframes:!0,showSleeping:!0,showDebug:!1,showBroadphase:!1,showBounds:!1,showVelocity:!1,showCollisions:!1,showSeparations:!1,showAxes:!1,showPositions:!1,showAngleIndicator:!1,showIds:!1,showShadows:!1,showVertexNumbers:!1,showConvexHulls:!1,showInternalEdges:!1,
showMousePosition:!1}},r=i.extend(t,e);return r.canvas&&(r.canvas.width=r.options.width||r.canvas.width,r.canvas.height=r.options.height||r.canvas.height),r.mouse=e.mouse,r.engine=e.engine,r.canvas=r.canvas||o(r.options.width,r.options.height),r.context=r.canvas.getContext("2d"),r.textures={},r.bounds=r.bounds||{min:{x:0,y:0},max:{x:r.canvas.width,y:r.canvas.height}},1!==r.options.pixelRatio&&n.setPixelRatio(r,r.options.pixelRatio),i.isElement(r.element)?r.element.appendChild(r.canvas):i.log("Render.create: options.element was undefined, render.canvas was created but not appended","warn"),r},n.run=function(t){!function o(i){t.frameRequestId=e(o),n.world(t)}()},n.stop=function(e){t(e.frameRequestId)},n.setPixelRatio=function(e,t){var o=e.options,n=e.canvas;"auto"===t&&(t=d(n)),o.pixelRatio=t,n.setAttribute("data-pixel-ratio",t),n.width=o.width*t,n.height=o.height*t,n.style.width=o.width+"px",n.style.height=o.height+"px",e.context.scale(t,t)},n.world=function(e){var t,o=e.engine,i=o.world,d=e.canvas,u=e.context,f=e.options,v=r.allBodies(i),m=r.allConstraints(i),y=f.wireframes?f.wireframeBackground:f.background,g=[],x=[],h={
timestamp:o.timing.timestamp};if(a.trigger(e,"beforeRender",h),e.currentBackground!==y&&p(e,y),u.globalCompositeOperation="source-in",u.fillStyle="transparent",u.fillRect(0,0,d.width,d.height),u.globalCompositeOperation="source-over",f.hasBounds){var b=e.bounds.max.x-e.bounds.min.x,w=e.bounds.max.y-e.bounds.min.y,S=b/f.width,C=w/f.height;for(t=0;t<v.length;t++){var A=v[t];s.overlaps(A.bounds,e.bounds)&&g.push(A)}for(t=0;t<m.length;t++){var B=m[t],P=B.bodyA,M=B.bodyB,k=B.pointA,I=B.pointB;P&&(k=c.add(P.position,B.pointA)),M&&(I=c.add(M.position,B.pointB)),k&&I&&(s.contains(e.bounds,k)||s.contains(e.bounds,I))&&x.push(B)}u.scale(1/S,1/C),u.translate(-e.bounds.min.x,-e.bounds.min.y)}else x=m,g=v;!f.wireframes||o.enableSleeping&&f.showSleeping?n.bodies(e,g,u):(f.showConvexHulls&&n.bodyConvexHulls(e,g,u),n.bodyWireframes(e,g,u)),f.showBounds&&n.bodyBounds(e,g,u),(f.showAxes||f.showAngleIndicator)&&n.bodyAxes(e,g,u),f.showPositions&&n.bodyPositions(e,g,u),f.showVelocity&&n.bodyVelocity(e,g,u),
f.showIds&&n.bodyIds(e,g,u),f.showSeparations&&n.separations(e,o.pairs.list,u),f.showCollisions&&n.collisions(e,o.pairs.list,u),f.showVertexNumbers&&n.vertexNumbers(e,g,u),f.showMousePosition&&n.mousePosition(e,e.mouse,u),n.constraints(x,u),f.showBroadphase&&o.broadphase.controller===l&&n.grid(e,o.broadphase,u),f.showDebug&&n.debug(e,u),f.hasBounds&&u.setTransform(f.pixelRatio,0,0,f.pixelRatio,0,0),a.trigger(e,"afterRender",h)},n.debug=function(e,t){var o=t,n=e.engine,i=n.world,s=n.metrics,a=e.options,l=(r.allBodies(i),"    ");if(n.timing.timestamp-(e.debugTimestamp||0)>=500){var c="";s.timing&&(c+="fps: "+Math.round(s.timing.fps)+l),e.debugString=c,e.debugTimestamp=n.timing.timestamp}if(e.debugString){o.font="12px Arial",a.wireframes?o.fillStyle="rgba(255,255,255,0.5)":o.fillStyle="rgba(0,0,0,0.5)";for(var d=e.debugString.split("\n"),u=0;u<d.length;u++)o.fillText(d[u],50,50+18*u)}},n.constraints=function(e,t){for(var o=t,n=0;n<e.length;n++){var i=e[n];if(i.render.visible&&i.pointA&&i.pointB){
var r=i.bodyA,s=i.bodyB;r?(o.beginPath(),o.moveTo(r.position.x+i.pointA.x,r.position.y+i.pointA.y)):(o.beginPath(),o.moveTo(i.pointA.x,i.pointA.y)),s?o.lineTo(s.position.x+i.pointB.x,s.position.y+i.pointB.y):o.lineTo(i.pointB.x,i.pointB.y),o.lineWidth=i.render.lineWidth,o.strokeStyle=i.render.strokeStyle,o.stroke()}}},n.bodyShadows=function(e,t,o){for(var n=o,i=(e.engine,0);i<t.length;i++){var r=t[i];if(r.render.visible){if(r.circleRadius)n.beginPath(),n.arc(r.position.x,r.position.y,r.circleRadius,0,2*Math.PI),n.closePath();else{n.beginPath(),n.moveTo(r.vertices[0].x,r.vertices[0].y);for(var s=1;s<r.vertices.length;s++)n.lineTo(r.vertices[s].x,r.vertices[s].y);n.closePath()}var a=r.position.x-.5*e.options.width,l=r.position.y-.2*e.options.height,c=Math.abs(a)+Math.abs(l);n.shadowColor="rgba(0,0,0,0.15)",n.shadowOffsetX=.05*a,n.shadowOffsetY=.05*l,n.shadowBlur=1+12*Math.min(1,c/1e3),n.fill(),n.shadowColor=null,n.shadowOffsetX=null,n.shadowOffsetY=null,n.shadowBlur=null}}},n.bodies=function(e,t,o){
var n,i,r,s,a=o,l=(e.engine,e.options),c=l.showInternalEdges||!l.wireframes;for(r=0;r<t.length;r++)if(n=t[r],n.render.visible)for(s=n.parts.length>1?1:0;s<n.parts.length;s++)if(i=n.parts[s],i.render.visible){if(l.showSleeping&&n.isSleeping?a.globalAlpha=.5*i.render.opacity:1!==i.render.opacity&&(a.globalAlpha=i.render.opacity),i.render.sprite&&i.render.sprite.texture&&!l.wireframes){var d=i.render.sprite,p=u(e,d.texture);a.translate(i.position.x,i.position.y),a.rotate(i.angle),a.drawImage(p,p.width*-d.xOffset*d.xScale,p.height*-d.yOffset*d.yScale,p.width*d.xScale,p.height*d.yScale),a.rotate(-i.angle),a.translate(-i.position.x,-i.position.y)}else{if(i.circleRadius)a.beginPath(),a.arc(i.position.x,i.position.y,i.circleRadius,0,2*Math.PI);else{a.beginPath(),a.moveTo(i.vertices[0].x,i.vertices[0].y);for(var f=1;f<i.vertices.length;f++)!i.vertices[f-1].isInternal||c?a.lineTo(i.vertices[f].x,i.vertices[f].y):a.moveTo(i.vertices[f].x,i.vertices[f].y),i.vertices[f].isInternal&&!c&&a.moveTo(i.vertices[(f+1)%i.vertices.length].x,i.vertices[(f+1)%i.vertices.length].y);
a.lineTo(i.vertices[0].x,i.vertices[0].y),a.closePath()}l.wireframes?(a.lineWidth=1,a.strokeStyle="#bbb"):(a.fillStyle=i.render.fillStyle,a.lineWidth=i.render.lineWidth,a.strokeStyle=i.render.strokeStyle,a.fill()),a.stroke()}a.globalAlpha=1}},n.bodyWireframes=function(e,t,o){var n,i,r,s,a,l=o,c=e.options.showInternalEdges;for(l.beginPath(),r=0;r<t.length;r++)if(n=t[r],n.render.visible)for(a=n.parts.length>1?1:0;a<n.parts.length;a++){for(i=n.parts[a],l.moveTo(i.vertices[0].x,i.vertices[0].y),s=1;s<i.vertices.length;s++)!i.vertices[s-1].isInternal||c?l.lineTo(i.vertices[s].x,i.vertices[s].y):l.moveTo(i.vertices[s].x,i.vertices[s].y),i.vertices[s].isInternal&&!c&&l.moveTo(i.vertices[(s+1)%i.vertices.length].x,i.vertices[(s+1)%i.vertices.length].y);l.lineTo(i.vertices[0].x,i.vertices[0].y)}l.lineWidth=1,l.strokeStyle="#bbb",l.stroke()},n.bodyConvexHulls=function(e,t,o){var n,i,r,s=o;for(s.beginPath(),i=0;i<t.length;i++)if(n=t[i],n.render.visible&&1!==n.parts.length){for(s.moveTo(n.vertices[0].x,n.vertices[0].y),
r=1;r<n.vertices.length;r++)s.lineTo(n.vertices[r].x,n.vertices[r].y);s.lineTo(n.vertices[0].x,n.vertices[0].y)}s.lineWidth=1,s.strokeStyle="rgba(255,255,255,0.2)",s.stroke()},n.vertexNumbers=function(e,t,o){var n,i,r,s=o;for(n=0;n<t.length;n++){var a=t[n].parts;for(r=a.length>1?1:0;r<a.length;r++){var l=a[r];for(i=0;i<l.vertices.length;i++)s.fillStyle="rgba(255,255,255,0.2)",s.fillText(n+"_"+i,l.position.x+.8*(l.vertices[i].x-l.position.x),l.position.y+.8*(l.vertices[i].y-l.position.y))}}},n.mousePosition=function(e,t,o){var n=o;n.fillStyle="rgba(255,255,255,0.8)",n.fillText(t.position.x+"  "+t.position.y,t.position.x+5,t.position.y-5)},n.bodyBounds=function(e,t,o){var n=o,i=(e.engine,e.options);n.beginPath();for(var r=0;r<t.length;r++){var s=t[r];if(s.render.visible)for(var a=t[r].parts,l=a.length>1?1:0;l<a.length;l++){var c=a[l];n.rect(c.bounds.min.x,c.bounds.min.y,c.bounds.max.x-c.bounds.min.x,c.bounds.max.y-c.bounds.min.y)}}i.wireframes?n.strokeStyle="rgba(255,255,255,0.08)":n.strokeStyle="rgba(0,0,0,0.1)",
n.lineWidth=1,n.stroke()},n.bodyAxes=function(e,t,o){var n,i,r,s,a=o,l=(e.engine,e.options);for(a.beginPath(),i=0;i<t.length;i++){var c=t[i],d=c.parts;if(c.render.visible)if(l.showAxes)for(r=d.length>1?1:0;r<d.length;r++)for(n=d[r],s=0;s<n.axes.length;s++){var u=n.axes[s];a.moveTo(n.position.x,n.position.y),a.lineTo(n.position.x+20*u.x,n.position.y+20*u.y)}else for(r=d.length>1?1:0;r<d.length;r++)for(n=d[r],s=0;s<n.axes.length;s++)a.moveTo(n.position.x,n.position.y),a.lineTo((n.vertices[0].x+n.vertices[n.vertices.length-1].x)/2,(n.vertices[0].y+n.vertices[n.vertices.length-1].y)/2)}l.wireframes?a.strokeStyle="indianred":(a.strokeStyle="rgba(0,0,0,0.8)",a.globalCompositeOperation="overlay"),a.lineWidth=1,a.stroke(),a.globalCompositeOperation="source-over"},n.bodyPositions=function(e,t,o){var n,i,r,s,a=o,l=(e.engine,e.options);for(a.beginPath(),r=0;r<t.length;r++)if(n=t[r],n.render.visible)for(s=0;s<n.parts.length;s++)i=n.parts[s],a.arc(i.position.x,i.position.y,3,0,2*Math.PI,!1),a.closePath();
for(l.wireframes?a.fillStyle="indianred":a.fillStyle="rgba(0,0,0,0.5)",a.fill(),a.beginPath(),r=0;r<t.length;r++)n=t[r],n.render.visible&&(a.arc(n.positionPrev.x,n.positionPrev.y,2,0,2*Math.PI,!1),a.closePath());a.fillStyle="rgba(255,165,0,0.8)",a.fill()},n.bodyVelocity=function(e,t,o){var n=o;n.beginPath();for(var i=0;i<t.length;i++){var r=t[i];r.render.visible&&(n.moveTo(r.position.x,r.position.y),n.lineTo(r.position.x+2*(r.position.x-r.positionPrev.x),r.position.y+2*(r.position.y-r.positionPrev.y)))}n.lineWidth=3,n.strokeStyle="cornflowerblue",n.stroke()},n.bodyIds=function(e,t,o){var n,i,r=o;for(n=0;n<t.length;n++)if(t[n].render.visible){var s=t[n].parts;for(i=s.length>1?1:0;i<s.length;i++){var a=s[i];r.font="12px Arial",r.fillStyle="rgba(255,255,255,0.5)",r.fillText(a.id,a.position.x+10,a.position.y-10)}}},n.collisions=function(e,t,o){var n,i,r,s,a=o,l=e.options;for(a.beginPath(),r=0;r<t.length;r++)if(n=t[r],n.isActive)for(i=n.collision,s=0;s<n.activeContacts.length;s++){var c=n.activeContacts[s],d=c.vertex;
a.rect(d.x-1.5,d.y-1.5,3.5,3.5)}for(l.wireframes?a.fillStyle="rgba(255,255,255,0.7)":a.fillStyle="orange",a.fill(),a.beginPath(),r=0;r<t.length;r++)if(n=t[r],n.isActive&&(i=n.collision,n.activeContacts.length>0)){var u=n.activeContacts[0].vertex.x,p=n.activeContacts[0].vertex.y;2===n.activeContacts.length&&(u=(n.activeContacts[0].vertex.x+n.activeContacts[1].vertex.x)/2,p=(n.activeContacts[0].vertex.y+n.activeContacts[1].vertex.y)/2),i.bodyB===i.supports[0].body||i.bodyA.isStatic===!0?a.moveTo(u-8*i.normal.x,p-8*i.normal.y):a.moveTo(u+8*i.normal.x,p+8*i.normal.y),a.lineTo(u,p)}l.wireframes?a.strokeStyle="rgba(255,165,0,0.7)":a.strokeStyle="orange",a.lineWidth=1,a.stroke()},n.separations=function(e,t,o){var n,i,r,s,a,l=o,c=e.options;for(l.beginPath(),a=0;a<t.length;a++)if(n=t[a],n.isActive){i=n.collision,r=i.bodyA,s=i.bodyB;var d=1;s.isStatic||r.isStatic||(d=.5),s.isStatic&&(d=0),l.moveTo(s.position.x,s.position.y),l.lineTo(s.position.x-i.penetration.x*d,s.position.y-i.penetration.y*d),d=1,
s.isStatic||r.isStatic||(d=.5),r.isStatic&&(d=0),l.moveTo(r.position.x,r.position.y),l.lineTo(r.position.x+i.penetration.x*d,r.position.y+i.penetration.y*d)}c.wireframes?l.strokeStyle="rgba(255,165,0,0.5)":l.strokeStyle="orange",l.stroke()},n.grid=function(e,t,o){var n=o,r=e.options;r.wireframes?n.strokeStyle="rgba(255,180,0,0.1)":n.strokeStyle="rgba(255,180,0,0.5)",n.beginPath();for(var s=i.keys(t.buckets),a=0;a<s.length;a++){var l=s[a];if(!(t.buckets[l].length<2)){var c=l.split(",");n.rect(.5+parseInt(c[0],10)*t.bucketWidth,.5+parseInt(c[1],10)*t.bucketHeight,t.bucketWidth,t.bucketHeight)}}n.lineWidth=1,n.stroke()},n.inspector=function(e,t){var o,n=(e.engine,e.selected),i=e.render,r=i.options;if(r.hasBounds){var s=i.bounds.max.x-i.bounds.min.x,a=i.bounds.max.y-i.bounds.min.y,l=s/i.options.width,c=a/i.options.height;t.scale(1/l,1/c),t.translate(-i.bounds.min.x,-i.bounds.min.y)}for(var d=0;d<n.length;d++){var u=n[d].data;switch(t.translate(.5,.5),t.lineWidth=1,t.strokeStyle="rgba(255,165,0,0.9)",
t.setLineDash([1,2]),u.type){case"body":o=u.bounds,t.beginPath(),t.rect(Math.floor(o.min.x-3),Math.floor(o.min.y-3),Math.floor(o.max.x-o.min.x+6),Math.floor(o.max.y-o.min.y+6)),t.closePath(),t.stroke();break;case"constraint":var p=u.pointA;u.bodyA&&(p=u.pointB),t.beginPath(),t.arc(p.x,p.y,10,0,2*Math.PI),t.closePath(),t.stroke()}t.setLineDash([]),t.translate(-.5,-.5)}null!==e.selectStart&&(t.translate(.5,.5),t.lineWidth=1,t.strokeStyle="rgba(255,165,0,0.6)",t.fillStyle="rgba(255,165,0,0.1)",o=e.selectBounds,t.beginPath(),t.rect(Math.floor(o.min.x),Math.floor(o.min.y),Math.floor(o.max.x-o.min.x),Math.floor(o.max.y-o.min.y)),t.closePath(),t.stroke(),t.fill(),t.translate(-.5,-.5)),r.hasBounds&&t.setTransform(1,0,0,1,0,0)};var o=function(e,t){var o=document.createElement("canvas");return o.width=e,o.height=t,o.oncontextmenu=function(){return!1},o.onselectstart=function(){return!1},o},d=function(e){var t=e.getContext("2d"),o=window.devicePixelRatio||1,n=t.webkitBackingStorePixelRatio||t.mozBackingStorePixelRatio||t.msBackingStorePixelRatio||t.oBackingStorePixelRatio||t.backingStorePixelRatio||1;
return o/n},u=function(e,t){var o=e.textures[t];return o?o:(o=e.textures[t]=new Image,o.src=t,o)},p=function(e,t){var o=t;/(jpg|gif|png)$/.test(t)&&(o="url("+t+")"),e.canvas.style.background=o,e.canvas.style.backgroundSize="contain",e.currentBackground=t}}()},{"../body/Composite":2,"../collision/Grid":6,"../core/Common":14,"../core/Events":16,"../geometry/Bounds":24,"../geometry/Vector":26}],30:[function(e,t,o){var n={};t.exports=n;var i=e("../body/Composite"),r=e("../core/Common");!function(){var e,t;"undefined"!=typeof window&&(e=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(function(){e(r.now())},1e3/60)},t=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame),n.create=function(e){r.log("RenderPixi.create: Matter.RenderPixi is deprecated (see docs)","warn");var t={controller:n,engine:null,element:null,
frameRequestId:null,canvas:null,renderer:null,container:null,spriteContainer:null,pixiOptions:null,options:{width:800,height:600,background:"#fafafa",wireframeBackground:"#222",hasBounds:!1,enabled:!0,wireframes:!0,showSleeping:!0,showDebug:!1,showBroadphase:!1,showBounds:!1,showVelocity:!1,showCollisions:!1,showAxes:!1,showPositions:!1,showAngleIndicator:!1,showIds:!1,showShadows:!1}},o=r.extend(t,e),i=!o.options.wireframes&&"transparent"===o.options.background;return o.pixiOptions=o.pixiOptions||{view:o.canvas,transparent:i,antialias:!0,backgroundColor:e.background},o.mouse=e.mouse,o.engine=e.engine,o.renderer=o.renderer||new PIXI.WebGLRenderer(o.options.width,o.options.height,o.pixiOptions),o.container=o.container||new PIXI.Container,o.spriteContainer=o.spriteContainer||new PIXI.Container,o.canvas=o.canvas||o.renderer.view,o.bounds=o.bounds||{min:{x:0,y:0},max:{x:o.options.width,y:o.options.height}},o.textures={},o.sprites={},o.primitives={},o.container.addChild(o.spriteContainer),r.isElement(o.element)?o.element.appendChild(o.canvas):r.log('No "render.element" passed, "render.canvas" was not inserted into document.',"warn"),
o.canvas.oncontextmenu=function(){return!1},o.canvas.onselectstart=function(){return!1},o},n.run=function(t){!function o(i){t.frameRequestId=e(o),n.world(t)}()},n.stop=function(e){t(e.frameRequestId)},n.clear=function(e){for(var t=e.container,o=e.spriteContainer;t.children[0];)t.removeChild(t.children[0]);for(;o.children[0];)o.removeChild(o.children[0]);var n=e.sprites["bg-0"];e.textures={},e.sprites={},e.primitives={},e.sprites["bg-0"]=n,n&&t.addChildAt(n,0),e.container.addChild(e.spriteContainer),e.currentBackground=null,t.scale.set(1,1),t.position.set(0,0)},n.setBackground=function(e,t){if(e.currentBackground!==t){var o=t.indexOf&&-1!==t.indexOf("#"),n=e.sprites["bg-0"];if(o){var i=r.colorToNumber(t);e.renderer.backgroundColor=i,n&&e.container.removeChild(n)}else if(!n){var s=a(e,t);n=e.sprites["bg-0"]=new PIXI.Sprite(s),n.position.x=0,n.position.y=0,e.container.addChildAt(n,0)}e.currentBackground=t}},n.world=function(e){var t,o=e.engine,r=o.world,s=e.renderer,a=e.container,l=e.options,c=i.allBodies(r),d=i.allConstraints(r),u=[];
l.wireframes?n.setBackground(e,l.wireframeBackground):n.setBackground(e,l.background);var p=e.bounds.max.x-e.bounds.min.x,f=e.bounds.max.y-e.bounds.min.y,v=p/e.options.width,m=f/e.options.height;if(l.hasBounds){for(t=0;t<c.length;t++){var y=c[t];y.render.sprite.visible=Bounds.overlaps(y.bounds,e.bounds)}for(t=0;t<d.length;t++){var g=d[t],x=g.bodyA,h=g.bodyB,b=g.pointA,w=g.pointB;x&&(b=Vector.add(x.position,g.pointA)),h&&(w=Vector.add(h.position,g.pointB)),b&&w&&(Bounds.contains(e.bounds,b)||Bounds.contains(e.bounds,w))&&u.push(g)}a.scale.set(1/v,1/m),a.position.set(-e.bounds.min.x*(1/v),-e.bounds.min.y*(1/m))}else u=d;for(t=0;t<c.length;t++)n.body(e,c[t]);for(t=0;t<u.length;t++)n.constraint(e,u[t]);s.render(a)},n.constraint=function(e,t){var o=(e.engine,t.bodyA),n=t.bodyB,i=t.pointA,s=t.pointB,a=e.container,l=t.render,c="c-"+t.id,d=e.primitives[c];return d||(d=e.primitives[c]=new PIXI.Graphics),l.visible&&t.pointA&&t.pointB?(-1===r.indexOf(a.children,d)&&a.addChild(d),d.clear(),d.beginFill(0,0),
d.lineStyle(l.lineWidth,r.colorToNumber(l.strokeStyle),1),o?d.moveTo(o.position.x+i.x,o.position.y+i.y):d.moveTo(i.x,i.y),n?d.lineTo(n.position.x+s.x,n.position.y+s.y):d.lineTo(s.x,s.y),void d.endFill()):void d.clear()},n.body=function(e,t){var n=(e.engine,t.render);if(n.visible)if(n.sprite&&n.sprite.texture){var i="b-"+t.id,a=e.sprites[i],l=e.spriteContainer;a||(a=e.sprites[i]=o(e,t)),-1===r.indexOf(l.children,a)&&l.addChild(a),a.position.x=t.position.x,a.position.y=t.position.y,a.rotation=t.angle,a.scale.x=n.sprite.xScale||1,a.scale.y=n.sprite.yScale||1}else{var c="b-"+t.id,d=e.primitives[c],u=e.container;d||(d=e.primitives[c]=s(e,t),d.initialAngle=t.angle),-1===r.indexOf(u.children,d)&&u.addChild(d),d.position.x=t.position.x,d.position.y=t.position.y,d.rotation=t.angle-d.initialAngle}};var o=function(e,t){var o=t.render,n=o.sprite.texture,i=a(e,n),r=new PIXI.Sprite(i);return r.anchor.x=t.render.sprite.xOffset,r.anchor.y=t.render.sprite.yOffset,r},s=function(e,t){var o,n=t.render,i=e.options,s=new PIXI.Graphics,a=r.colorToNumber(n.fillStyle),l=r.colorToNumber(n.strokeStyle),c=r.colorToNumber(n.strokeStyle),d=r.colorToNumber("#bbb"),u=r.colorToNumber("#CD5C5C");
s.clear();for(var p=t.parts.length>1?1:0;p<t.parts.length;p++){o=t.parts[p],i.wireframes?(s.beginFill(0,0),s.lineStyle(1,d,1)):(s.beginFill(a,1),s.lineStyle(n.lineWidth,l,1)),s.moveTo(o.vertices[0].x-t.position.x,o.vertices[0].y-t.position.y);for(var f=1;f<o.vertices.length;f++)s.lineTo(o.vertices[f].x-t.position.x,o.vertices[f].y-t.position.y);s.lineTo(o.vertices[0].x-t.position.x,o.vertices[0].y-t.position.y),s.endFill(),(i.showAngleIndicator||i.showAxes)&&(s.beginFill(0,0),i.wireframes?s.lineStyle(1,u,1):s.lineStyle(1,c),s.moveTo(o.position.x-t.position.x,o.position.y-t.position.y),s.lineTo((o.vertices[0].x+o.vertices[o.vertices.length-1].x)/2-t.position.x,(o.vertices[0].y+o.vertices[o.vertices.length-1].y)/2-t.position.y),s.endFill())}return s},a=function(e,t){var o=e.textures[t];return o||(o=e.textures[t]=PIXI.Texture.fromImage(t)),o}}()},{"../body/Composite":2,"../core/Common":14}]},{},[28])(28)});
soya2d.module.install('physics',{
    onInit:function(game){
    	var engine;
        /**
		 * 安装物理
		 */
		game.physics.setup({
			onStart:function(opts){
				engine = Matter.Engine.create();

				engine.world.gravity.x = opts.gravity[0];
				engine.world.gravity.y = opts.gravity[1];
				engine.enableSleeping = opts.enableSleeping;

				//events
				Matter.Events.on(engine, 'collisionStart collisionEnd', function(event) {
					var pairs = event.pairs;
					for (var i = 0; i < pairs.length; i++) {
		                var pair = pairs[i];
		                game.physics.emit(event.name,pair.bodyA.__sprite,pair.bodyB.__sprite);
		                eventSignal.emit(event.name.toLowerCase(),pair.bodyA.__sprite,pair.bodyB.__sprite);
		            }
				});
			},
			onUpdate:function(){
				Matter.Engine.update(engine, 0, 1);
				var bodies = engine.world.bodies;
		    	for(var i=bodies.length; i--;){
					var b = bodies[i];
					var ro = b.__sprite;
					if(b.isStatic)continue;

					ro.__x = b.position.x;
					ro.__y = b.position.y;
					
					ro.angle = b.angle * soya2d.Math.ONEANG;
				}
			},
			onUnbind:function(obj){
				Matter.World.remove(engine.world,obj);
			},
			onBind:function(obj){
				var opts = {
					angle:obj.angle * soya2d.Math.ONERAD,
		    		position:{
		    			x:obj.x,
		    			y:obj.y
		    		}
				};
				
		    	var shape;
		    	if (obj.bounds instanceof soya2d.Rectangle) {
					shape = Matter.Bodies.rectangle(obj.x,obj.y,obj.w , obj.h,opts);
				} else if (obj.bounds instanceof soya2d.Circle) {
					shape = Matter.Bodies.circle(0,0,obj.bounds.r,opts);
				}else if (obj.bounds instanceof soya2d.Polygon) {
					var vtx = obj.bounds.vtx;
					var vx = Matter.Vertices.fromPath(vtx.join(','));
					shape = Matter.Bodies.fromVertices(0,0,vx,opts);
				}

				Matter.World.add(engine.world, shape);

				Matter.Events.on(shape, 'sleepStart sleepEnd', function(event) {
	                obj.emit(event.name,this.isSleeping);
	            });

				return shape;
			},
			body:{
				sensor:function(body,tof){
					body.isSensor = tof;
				},
				moveTo:function(body,x,y){
					Matter.Body.setPosition(body,{x:x,y:y});
				},
				moveBy:function(body,x,y){
					Matter.Body.translate(body,{x:x,y:y});
				},
				static:function(body,tof){
					Matter.Body.setStatic(body, tof);
				},
				mass:function(body,v){
					Matter.Body.setMass(body, v);
				},
				rotateBy:function(body,v){
					Matter.Body.rotate(body, v);
				},
				rotateTo:function(body,v){
					Matter.Body.setAngle(body, soya2d.Math.toRadian(v));
				},
				friction:function(body,v){
					body.friction = v;
				},
				restitution:function(body,v){
					body.restitution = v;
				},
				velocity:function(body,x,y){
					Matter.Body.setVelocity(body,{x:x,y:y});
				},
				inertia:function(body,v){
					Matter.Body.setInertia(body,v);
				}
			}
		});
    }
});
/**
 *  瓦片地图管理器。
 *  每个game实例都有且仅有一个瓦片地图管理器对象game.tilemap, 用于管理该实例内的所有瓦片地图对象
 *  @class TilemapManager
 */
function TilemapManager(game) {
    this.map = {};
    this.game = game;
}

TilemapManager.prototype = {
    /**
     * 获取指定的tilemap对象
     * @method get
     * @param  {String} key 
     * @return {Tilemap}
     */
    get:function(key){
        return this.map[key];
    },
    /**
     * 创建一个tilemap实例。创建tilemap，需要满足参数中data的要求。
     * 这些参数可以通过tile制作工具或其他方式获取。
     * @method add
     * @param {String} key  唯一的key
     * @param {Object} data  tilemap参数
     * @param {Object} data.tilewidth   瓦片宽度
     * @param {Object} data.tileheight   瓦片高度
     * @param {Object} data.rows   总行数
     * @param {Object} data.columns   总列数
     * @param {Object} data.tilesets   图块集 {key:{sid:1}}
     * @param {Object} data.layers   图层集 {key:{data:[]}}
     */
    add:function(key,data){
        data.game = this.game;
        this.map[key] = new Tilemap(data);

        return this.map[key];
    }
}
/**
 * 地图层是实际渲染地图的显示对象。描述了具体的地图信息，并绘制在指定的容器中
 * @class TilemapLayer
 * @extends soya2d.DisplayObjectContainer
 */
var TilemapLayer = soya2d.class('',{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(tilemap,data){
        /**
         * 所在tilemap引用
         * @property tilemap
         * @type {Tilemap}
         */
        this.tilemap = tilemap;
        this.w = tilemap.w;
        this.h = tilemap.h;
        this.tw = tilemap.tilewidth;
        this.th = tilemap.tileheight;
        this.cols = tilemap.columns;

        this.data = data;
        this.range = {row:[0,tilemap.rows],col:[0,tilemap.columns]};

        this.tilesets = tilemap.tilesets;
    },
    onUpdate:function(){
        //check range
        var sx = this.worldPosition.x - this.anchorPosition.x;
        var sy = this.worldPosition.y - this.anchorPosition.y;
        if(sx < 0 || sy < 0)return ;

        if(this.lastcx == this.game.camera.x && this.lastcy == this.game.camera.y)return;
        this.lastcy = this.game.camera.y;
        this.lastcx = this.game.camera.x;

        var vx = this.game.camera.x;
        var vy = this.game.camera.y;
        var vw = this.game.camera.w;
        var vh = this.game.camera.h;

        var offx = vx - sx;
        var offy = vy - sy;
        var offCols = Math.floor(offx/this.tw);
        var offRows = Math.floor(offy/this.th);
        var cols = Math.floor(vw/this.tw)+1;
        var rows = Math.floor(vh/this.th)+1;

        this.range.col[0] = offCols;
        this.range.col[1] = offCols + cols;
        this.range.row[0] = offRows;
        this.range.row[1] = offRows + rows;
    },
    onRender:function(g){
        var minr = this.range.row[0],
            maxr = this.range.row[1],
            minc = this.range.col[0],
            maxc = this.range.col[1];
        for(var r=minr;r<maxr;r++){
            for(var c=minc;c<maxc;c++){
                var index = this.data[r*this.cols + c];
                var tileImage = this.tilesets.set[index];
                if(tileImage){
                    g.map(tileImage,c*this.tw,r*this.th,this.tw,this.th);
                    if(this.tilemap.__debug){
                        g.fillText(r*this.cols + c,c*this.tw+this.tw/2,r*this.th+this.th/2-10);
                        g.fillText(r+","+c,c*this.tw+this.tw/2,r*this.th+this.th/2+10);
                    }
                    
                }
            }
        }
        
    }
});
/**
 * tilemap模块定义了一套通用的瓦片地图处理系统。无论地图数据从何而来，
 * 只要符合格式的数据都会被正确的渲染。
 * <b>该模块是扩展模块，可以自行卸载</b>
 * @module tilemap
 */
/**
 * 瓦片地图。管理固定尺寸瓦片拼接的地图模型。这些地图通常由地图制作工具生成
 * @class Tilemap
 * @extends Signal
 */
var Tilemap = soya2d.class("",{
    extends:Signal,
    constructor: function(data){
        /**
         * 单个瓦片宽度
         * @property tilewidth
         * @type {Number}
         */
        this.tilewidth = data.tilewidth;
        /**
         * 单个瓦片高度
         * @property tileheight
         * @type {Number}
         */
        this.tileheight = data.tileheight;

        /**
         * 整个地图行数
         * @property rows
         * @type {Number}
         */
        this.rows = data.rows;
        /**
         * 整个地图列数
         * @property columns
         * @type {Number}
         */
        this.columns = data.columns;

        //图层数据
        this.layersData = data.layers;
        //图块集数据
        this.tilesetsData = data.tilesets;


        this.tilesets = {};
        this.layers = {};

        //记录所有tile的偏移坐标
        this.tiles = {};

        var i = 0;
        for(var r=0;r<this.rows;r++){
            for(var c=0;c<this.columns;c++){
                var x = c * this.tilewidth;
                var y = r * this.tileheight;
                this.tiles[i++] = {x:x,y:y};
            }
        }

        this.tileMatrix = {};
        for(var r=0;r<this.rows;r++){
            for(var c=0;c<this.columns;c++){
                var x = c * this.tilewidth;
                var y = r * this.tileheight;
                this.tileMatrix[r+"_"+c] = {x:x,y:y};
            }
        }


        this.w = this.tilewidth * this.columns;
        this.h = this.tileheight * this.rows;

        this.game = data.game;

        //所有碰撞区
        this.__blocks = [];

        this.__debug = false;
        Object.defineProperty(this,"debug",{
            get:function(){
                return this.__debug;
            },
            set:function(v){
                this.__debug = v;
                if(v){
                    this.__blocks.forEach(function(b){
                        b.fillStyle='red';
                        b.opacity = .5;
                    });
                }
            }
        });
    },
    /**
     * 把图块集数据和纹理绑定
     * @method bindTileset
     * @param  {String} key   地图数据中制定的key
     * @param  {HTMLImageElement|String} image 图像
     * @return this
     */
    bindTileset:function(key,image){
        var tileset = this.tilesetsData[key];

        var img = null;
        if(typeof image === 'string'){
            img = this.game.assets.image(image);
        }
        var ts = new Tileset(img,tileset.sid,this.tilewidth,this.tileheight);
        
        soya2d.ext(this.tilesets,ts);

        return this;
    },
    /**
     * 创建图层
     * @method createLayer
     * @param  {String} key  图层key，用于查找地图数据中对应的图层
     * @param  {soya2d.DisplayObjectContainer} container 所属容器，默认world
     * @param  {Array} data 地图数据
     */
    createLayer:function(key,container,data){
        var layer = this.layersData[key];
        var dataAry = data;
        if(layer){
            dataAry = layer.data;
        }
        this.layers[key] = new TilemapLayer(this,dataAry);
        container = container || this.game.world;
        container.add(this.layers[key]);
        return this.layers[key];
    },
    /**
     * 设置世界size和map相同
     * @method resizeWorld
     */
    resizeWorld:function(){
        this.game.world.setBounds(this.w,this.h);
    },
    /**
     * 设置碰撞的瓦片索引区间，比如1-4，那么序号为1,2,3,4的4个瓦片都会响应碰撞
     * @method setCollisionBetween
     * @param {Number} start 起始索引
     * @param {Number} end 结束索引
     */
    setCollisionBetween:function(start,end){
        var startPos = this.tiles[start];
        var endPos = this.tiles[end];
        if(!startPos || !endPos)return;

        var w = endPos.x - startPos.x + this.tilewidth;
        var h = endPos.y - startPos.y + this.tileheight;

        var block = game.add.rect({
            w:w,
            h:h,
            x:startPos.x + w/2,
            y:startPos.y + h/2
        });
        this.game.physics.enable(block);
        block.tilemap = this;
        block.on('collisionStart',onTileCollision);
        block.body.static(true).friction(0);

        this.__blocks.push(block);

        return this;
    },
    /**
     * 设置碰撞的一块瓦片，通过行列号
     * @method setCollision
     * @param {Number} row 行号
     * @param {Number} col 列号
     */
    setCollision:function(row,col){
        var startPos = this.tileMatrix[row+"_"+col];
        if(!startPos)return;

        var w = this.tilewidth;
        var h = this.tileheight;

        var block = game.add.rect({
            w:w,
            h:h,
            x:startPos.x + w/2,
            y:startPos.y + h/2
        });
        this.game.physics.enable(block);
        block.tilemap = this;
        block.on('collisionStart',onTileCollision);
        block.body.static(true).friction(0);

        this.__blocks.push(block);

        return this;
    },
    /**
     * 使用行列值，确定碰撞范围
     * @method setCollisionZone
     * @param {Number} startRow 起始行
     * @param {Number} startCol 起始列
     * @param {Number} endRow   结束行
     * @param {Number} endCol   结束列
     */
    setCollisionZone:function(startRow,startCol,endRow,endCol){
        var startPos = this.tileMatrix[startRow+"_"+startCol];
        var endPos = this.tileMatrix[endRow+"_"+endCol];
        if(!startPos || !endPos)return;

        var w = endPos.x - startPos.x + this.tilewidth;
        var h = endPos.y - startPos.y + this.tileheight;

        var block = game.add.rect({
            w:w,
            h:h,
            x:startPos.x + w/2,
            y:startPos.y + h/2
        });
        block.tilemap = this;
        block.on('collisionStart',onTileCollision);
        this.game.physics.enable(block);
        block.body.static(true).friction(0);

        this.__blocks.push(block);

        return this;
    },
    /**
     * 获取指定行列上的tile对象
     * @method getTile
     * @param {Number} row 行号
     * @param {Number} col 列号
     * @return {Object}  
     */
    getTile:function(row,col){
        return this.tileMatrix[row+"_"+col];
    }
});
function onTileCollision(target,another){
    var tw = target.w,th = target.h;
    var aw = another.w,ah = another.h;
    var speed = another.body.rigid.speed;
    var offset = 1;
    var tx = target.x - target.w/2,
        ty = target.y - target.h/2;
    var ax = another.x - another.w/2,
        ay = another.y - another.h/2;

    var xPos,yPos;
    if(ax >= tx){
        xPos = 'center';
        if(ax+speed+offset >= tx+tw){
            xPos = 'right';
        }
    }else{
        xPos = 'left';
    }

    if(ay >= ty){
        yPos = 'middle';
        if(ay > ty+th){
            yPos = 'bottom';
        }
    }else{
        yPos = 'top';
    }
    
    var dir;
    
    switch(yPos){
        case 'top':
            if(ty < ay + ah){
                switch(xPos){
                    case 'left':dir='left';break;
                    case 'right':dir='right';break;
                    case 'center':dir='top';break;
                }
            }else{
                dir='top';
            }
            break;
        case 'bottom':dir='bottom';break;
        case 'middle':
            switch(xPos){
                case 'left':dir='left';break;
                case 'right':dir='right';break;
            }
    }
    this.tilemap.emit('tileCollision',another,{direction:dir,x:this.x,y:this.y});
}

/**
 * 瓦片碰撞事件
 * @event tileCollision
 * @for Tilemap
 * @param {soya2d.DisplayObject} otherCollider 碰撞对象
 * @param {Object} collision 碰撞信息 {direction:,x:,y:} 
 */

/**
 * 图块集合。管理地图相关的图块信息。
 * 图块集合以起始索引为基准，对每一个图块进行topLeft-bottomRight方式的编号，
 * 每个编号的图块都对应地图中的一个tile
 * @class Tileset
 */
var Tileset = soya2d.class('',{
    constructor:function(image,sIndex,tileWidth,tileHeight) {
        this.set = {};
        this.index = sIndex;

        var ws = image.width / tileWidth;
        var hs = image.height / tileHeight;
        for(var i=0;i<hs;i++){
            for(var j=0;j<ws;j++){
                this.__getTileImage(image,j*tileWidth,i*tileHeight,tileWidth,tileHeight);
            }
        }

    },
    __getTileImage:function(image,x,y,w,h){
        var data = document.createElement('canvas');
        data.width = w;
        data.height = h;
        var ctx = data.getContext('2d');
        ctx.translate(w/2,h/2);
        ctx.drawImage(image,
                        x,y,w,h,
                        -w/2>>0,-h/2>>0,w,h);
        this.set[this.index++] = data;
    }
});

soya2d.module.install('tilemap',{
    onInit:function(game){
        /**
         * 瓦片地图管理器
         * @property tilemap
         * @type {TilemapManager}
         * @for soya2d.Game
         * @requires tilemap
         */
        game.tilemap = new TilemapManager(game);
    }
});

}(window||this);