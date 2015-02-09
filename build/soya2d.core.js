/**
 * 引擎命名空间
 * @namespace
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
var soya2d = new function(){

    //渲染实例编号
    this.__roIndex=0;
    /**
     * 版本信息
     * @type {Object}
     * @property {Array} v 版本号
     * @property {string} state
     * @property {function} toString 返回版本
     */
	this.version = {
        v:[0,1,0,156],//[major,minor,patch,build]
        state:'alpha',
        toString:function(){
            return soya2d.version.v.join('.') + ' ' + soya2d.version.state;
        }
    };
    /**
     * 官网地址
     * @type {String}
     * @constant
     */
	this.website = 'http://soya2d.com';
    /**
     * 扩展属性到对象
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

    /**
     * 继承
     * @param {Function} child 子类
     * @param {Function} parent 父类
     */
    this.inherits = function(child,parent){
    	//采用原型对象创建，可以保证只继承原型上挂着的方法，而构造内定义的方法不会继承
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        child.prototype._super = parent.prototype;
	}

    /**
     * 模块管理
     * @type {object}
     */
    this.module = new function(){
        var map = {};
        /**
         * 安装新模块
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
         * @alias module.install
         * @memberof! soya2d#
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
};
var soya = soya2d;

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
 * @type {object}
 */
soya2d.console = new function(){
    /**
     * 输出日志信息
     * @param  {string} txt  输出文本
     * @param  {string} [css] 字体css
     * @alias console.log
     * @memberof! soya2d#
     */
    this.log = function(txt,css){
        if(soya2d.Device.ie){
            console.log(txt);
        }else{
            console.log('%c'+txt,css||'padding:1px 50px;font-size:14px;color:#fff;background:#2DB008;');
        }
    }
    /**
     * 输出调试信息
     * @param  {string} txt  输出文本
     * @param  {string} [css] 字体css
     * @alias console.debug
     * @memberof! soya2d#
     */
    this.debug = function(txt,css){
        if(soya2d.Device.ie){
            console.debug(txt);
        }else{
            console.debug('%c'+txt,css||'padding:1px 50px;font-size:14px;color:#fff;background:#0069D6;');
        }
    }
    /**
     * 输出错误信息
     * @param  {string} txt  输出文本
     * @param  {string} [css] 字体css
     * @alias console.error
     * @memberof! soya2d#
     */
    this.error = function(txt,css){
        if(soya2d.Device.ie){
            console.error(txt);
        }else{
            console.error('%c'+txt,css||'padding:1px 50px;font-size:14px;color:#fff;background:#ff0000;');
        }
    }
    /**
     * 输出警告信息
     * @param  {string} txt  输出文本
     * @param  {string} [css] 字体css
     * @alias console.warn
     * @memberof! soya2d#
     */
    this.warn = function(txt,css){
        if(soya2d.Device.ie){
            console.warn(txt);
        }else{
            console.warn('%c'+txt,css||'padding:1px 50px;font-size:14px;color:#fff;background:#FFB502;');
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
 * @constant
 */
soya2d.BLEND_NORMAL = 'source-over';
/**
 * 混合类型——高亮
 * @constant
 */
soya2d.BLEND_LIGHTER = 'lighter';
/**
 * 混合类型——遮罩
 * @constant
 */
soya2d.BLEND_MASK = 'destination-in';
/**
 * 混合类型——清除
 * @constant
 */
soya2d.BLEND_CLEAR = 'destination-out';
/**
 * 线条端点类型——BUTT
 * @constant
 */
soya2d.LINECAP_BUTT = 'butt';
/**
 * 线条端点类型——ROUND
 * @constant
 */
soya2d.LINECAP_ROUND = 'round';
/**
 * 线条端点类型——SQUARE
 * @constant
 */
soya2d.LINECAP_SQUARE = 'square';
/**
 * 线条交点类型——BEVEL
 * @constant
 */
soya2d.LINEJOIN_BEVEL = 'bevel';
/**
 * 线条交点类型——ROUND
 * @constant
 */
soya2d.LINEJOIN_ROUND = 'round';
/**
 * 线条交点类型——MITER
 * @constant
 */
soya2d.LINEJOIN_MITER = 'miter';

/**
 * 文本水平对齐类型——TEXTALIGN_LEFT
 * @constant
 */
soya2d.TEXTALIGN_LEFT = "left";
/**
 * 文本水平对齐类型——TEXTALIGN_CENTER
 * @constant
 */
soya2d.TEXTALIGN_CENTER = "center";
/**
 * 文本水平对齐类型——TEXTALIGN_RIGHT
 * @constant
 */
soya2d.TEXTALIGN_RIGHT = "right";
/**
 * 文本垂直对齐类型——TEXTVALIGN_TOP
 * @constant
 */
soya2d.TEXTVALIGN_TOP = "hanging";
/**
 * 文本垂直对齐类型——TEXTVALIGN_MIDDLE
 * @constant
 */
soya2d.TEXTVALIGN_MIDDLE = "middle";
/**
 * 文本垂直对齐类型——TEXTVALIGN_BOTTOM
 * @constant
 */
soya2d.TEXTVALIGN_BOTTOM = "alphabetic";
/**
 * 文本书写方向——从左到右
 * @constant
 */
soya2d.TEXTDIR_LTR = "ltr";
/**
 * 文本书写方向——从右到左
 * @constant
 */
soya2d.TEXTDIR_RTL = "rtl";

/**
 * 纹理重复类型——REPEAT
 * @constant
 */
soya2d.REPEAT = 'repeat';
/**
 * 纹理重复类型——NOREPEAT
 * @constant
 */
soya2d.NOREPEAT = 'no-repeat';
/**
 * 纹理重复类型——REPEAT_X
 * @constant
 */
soya2d.REPEAT_X = 'repeat-x';
/**
 * 纹理重复类型——REPEAT_Y
 * @constant
 */
soya2d.REPEAT_Y = 'repeat-y';
/**
 * 线性渐变类型
 * @constant
 */
soya2d.GRADIENTTYPE_LINEAR = 1;
/**
 * 放射渐变类型
 * @constant
 */
soya2d.GRADIENTTYPE_RADIAL = 2;

/**
 * 点击测试类型——路径
 * @constant
 */
soya2d.HITTEST_PATH = 1;
/**
 * 点击测试类型——像素
 * @constant
 */
soya2d.HITTEST_PIXEL = 2;


/**
 * 数学接口提供了常用的静态常量以及方法<br/>
 * @namespace soya2d.Math
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Math = {
	/**
	 * π，9位精度
	 * @constant
	 */
	PI : 3.141592654,
	/**
	 * 2π，9位精度
	 * @constant
	 */
	PIM2 : 6.283185307,
	/**
	 * π/2，9位精度
	 * @constant
	 */
	PID2 : 1.570796327,
	/**
	 * π/4，9位精度
	 * @constant
	 */
	PID4 : 0.785398163,
	/**
	 * 1角度对应弧度，9位精度
	 * @constant
	 */
	ONERAD : 0.017453292,
	/**
	 * 1弧度对应角度，9位精度
	 * @constant
	 */
	ONEANG : 57.295779513,
	/**
	 * 转为弧度
	 * @param {Number} ang 角度
	 */
	toRadian : function(ang){return ang*this.ONERAD},
	/**
	 * 转为角度
	 * @param {Number} rad 弧度
	 */
	toAngle : function(rad){return rad*this.ONEANG},
	/**
	 * 获得随机数，浮点型
	 * @param {Number} a 上限
	 * @param {Number} b 下限
	 */
	randomf : function(a,b){return a+(Math.random()*(b-a));},
    /**
     * 获得随机数，整型
     * @param a 上限
     * @param b 下限
     * @return {Number}
     */
	randomi: function(a,b){return (a+(Math.random()*(b-a)))>>0;},
    /**
     * 对浮点数取整，四舍五入
     * @param {Number} n 浮点数
     */
    round:function(n){
        return (0.5 + n)>>0;
    },
    /**
     * 对浮点数取整，小数部分被舍弃
     * @param {Number} n 浮点数
     */
    floor:function(n){
        return n|0;
    },
	/**
	 * 计算平面两点距离
	 * @param {Number} p1x 
	 * @param {Number} p1y 
	 * @param {Number} p2x 
	 * @param {Number} p2y 
	 * @returns 两点距离值
	 */
	len2D:function(p1x,p1y,p2x,p2y){
		return Math.sqrt((p2y-p1y)*(p2y-p1y) + (p2x-p1x)*(p2x-p1x));
	},
	/**
	 * 快速计算平面两点距离
	 * 注意：此方法会产生少量误差，可以用在精度不高，但要求速度的场景中
	 * @param {Number} dx X轴坐标差值
	 * @param {Number} dy Y轴坐标差值
	 * @returns 两点距离值
	 */
	len2Df:function(dx,dy){//D-values
		dx = Math.abs(dx);
		dy = Math.abs(dy);
		
		var min = Math.min(dx,dy);
		
		return (dx+dy-(min>>1)-(min>>2)+(min>>4));
	},
	/**
	 * sin表，包含0到360度，共361个正玄值，可以通过SINTABLE[0-360整数角度]，直接引用
	 * @constant
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
	 * @constant
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
 * @classdesc 资源管理器是具体资源管理器的基类，该类不应被直接实例化。
 * 应使用相关资源的子类。
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ResourceManager = function(){
    this.urlMap = {};//url->obj
};
soya2d.ResourceManager.prototype = {
    /**
     * 获取一个资源对象，如果匹配到多个，只返回第一个
     * @param {string | Object} opts 参数对象,url字符串，或者参数对象，参数如下：
     * @param {string} opts.url 需要查找的资源url，可以是全路径或部分路径，当fuzzy属性为false时，部分路径无效
     * @param {boolean} [opts.fuzzy=true] 是否进行url模糊匹配
     * @return {Object | null} 资源对象或者null
     */
    findOne:function(opts){
        if(!opts)return null;
        if(typeof opts == "string"){
            var url = opts;
            opts = {};
            opts.urls = [url];
        }else{
            opts.urls = [opts.url];
        }
        var rs = this.find(opts);
        if (rs.length == 0) {
            return null;
        } else {
            return rs[0];
        }
    },
    /**
     * 获取一组资源对象
     * @param {string | Object} opts 参数对象(如果为空返回所有资源)。url字符串，或者参数对象，参数如下：
     * @param {Array} opts.urls 需要查找的资源url数组，可以是全路径或部分路径，当fuzzy属性为false时，部分路径无效。支持多标识
     * @param {boolean} [opts.fuzzy=true] 是否进行url模糊匹配
     * @return {Array | null} 资源数组或者null
     */
    find:function(opts){
        var urls = Object.keys(this.urlMap);

        if(typeof opts == "string"){
            var url = opts;
            opts = {};
            opts.urls = [url];

        }
        var fuzzy = opts?opts.fuzzy||true:true;

        var tmp = [];
        if(opts){
            for(var k=opts.urls.length;k--;){
                var url = opts.urls[k];
                if(fuzzy){
                    for(var i=urls.length;i--;){
                        if(urls[i].indexOf(url)>-1)tmp.push(urls[i]);
                    }
                }else{
                    for(var i=urls.length;i--;){
                        if(urls[i] == url)tmp.push(urls[i]);
                    }
                }
            }
        }else{
            tmp = urls;
        }

        var rs = [];
        for(var i=tmp.length;i--;){
            rs.push(this.urlMap[tmp[i]]);
        }
        return rs;
    }
}

/**
 * @classdesc 几何结构，圆形。用于保存圆形结构数据
 * @class 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Circle  = function(x,y,r){
	this.x = x || 0;
    this.y = y || 0;
    this.r = r || 0;
};
soya2d.Circle.prototype = {
    toString:function(){
        return "{x:"+this.x+",y:"+this.y+",r:"+this.r+"}";
    },
    clone:function(){
        return new soya2d.Circle(this.x,this.y,this.r);
    }
};

/**
 * @classdesc 几何结构，多边形。
 * @class 
 * @param {Array} vtx 1维顶点数组
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Polygon  = function(vtx){
	this.vtx = vtx;
};
soya2d.Polygon.prototype = {
    toString:function(){
        return this.vtx;
    },
    clone:function(){
        return new soya2d.Polygon(this.vtx.concat());
    }
};

/**
 * @classdesc 几何结构，矩形。用于保存矩形结构数据
 * @class 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Rectangle  = function(x,y,w,h){
	this.x = x || 0;
    this.y = y || 0;
    this.w = w || 0;
    this.h = h || 0;
};
soya2d.Rectangle.prototype = {
    toString:function(){
        return "{x:"+this.x+",y:"+this.y+",w:"+this.w+",h:"+this.h+"}";
    },
    clone:function(){
        return new soya2d.Rectangle(this.x,this.y,this.w,this.h);
    },
    getRight:function(){
        return this.x + this.w;
    },
    getBottom:function(){
        return this.y + this.h;
    },
    contains:function(x,y){
        if(x < this.x || x > this.x+this.w)return false;
        if(y < this.y || y > this.y+this.h)return false;
        return true;
    }
};

/**
 * @classdesc 创建一个2*2单位矩阵，该矩阵用来描述2D变换信息
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Matrix2x2 = function(){
    /**
     * 矩阵结构数组
     * @type {Float32Array}
     * @default [1,0,0,1]
     */
    this.e = new Float32Array(4);
    this.identity();
};

soya2d.Matrix2x2.prototype = {
	toString:function(){
		return "["+this.e[0]+","+this.e[1]+","+this.e[2]+","+this.e[3]+"]";
	},
    /**
     * 设置矩阵数据
     * @param m11
     * @param m12
     * @param m21
     * @param m22
     * @return {soya2d.Matrix2x2} this
     */
	set:function(m11,m12,m21,m22){
		var e = this.e;
		e[0] = m11||1;e[1] = m12||0;
		e[2] = m21||0;e[3] = m22||1;
		return this;
	},
    /**
     * 克隆当前矩阵
     * @return {soya2d.Matrix2x2} a new matrix
     */
	clone:function(){
		return new soya2d.Matrix2x2().set(this.e[0],this.e[1],this.e[2],this.e[3]);
	},
    /**
     * 重置矩阵为单位矩阵
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
     * @param x
     * @param y
     * @return {soya2d.Matrix2x2} this
     */
	scale:function(x,y){
        this.e[0] *= x;this.e[1] *= y;
        this.e[2] *= x;this.e[3] *= y;
		return this;
	},
    /**
     * 旋转当前矩阵
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
 * @classdesc 2D向量。提供向量相关计算。<br/>参数为0时，将构造一个0向量
 * @class 
 * @param {Number} x
 * @param {Number} y
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Vector = function(x,y){
    /**
     * 向量结构数组
     * @type {Float32Array}
     * @default [0,0]
     */
    this.e = new Float32Array(2);
    this.e[0] = x||0;
    this.e[1] = y||0;
};

soya2d.Vector.prototype = {
	toString:function(){
		return "{x:"+this.e[0]+",y:"+this.e[1]+"}";
	},
	/**
	 * 使用当前向量参数，复制一个新的2D向量
	 * @return {soya2d.Vector} 和当前向量值相同的新向量
	 */
	clone:function(){
		return new soya2d.Vector(this.e[0],this.e[1]);
	},
	/**
	 * 设置向量值
	 * @param {int} x x轴分量值
	 * @param {int} y y轴分量值
	 * @return {soya2d.Vector} this
	 */
	set:function(x,y){
		this.e[0] = x || 0;
		this.e[1] = y || 0;
		
		return this;
	},
	/**
	 * 计算和指定向量的点积
	 * @param {soya2d.Vector} v 指定向量
	 * @return {Number} 点积值
	 */
	dot: function ( v ) {
		return this.e[0] * v.e[0] + this.e[1] * v.e[1];
	},
	/**
	 * 当前向量取反
	 */
	negate:function(){
		this.e[0] *= -1;
		this.e[1] *= -1;
		return this;
	},
	/**
	 * 和增加指定向量相加
	 * @param {soya2d.Vector} v 指定向量
	 */
	add:function(v){
		 this.e[0] += v.e[0];
		 this.e[1] += v.e[1];
		 return this;
	},
	/**
	 * 和增加指定向量相减
	 * @param {soya2d.Vector} v 指定向量
	 */
	sub:function(v){
		this.e[0] -= v.e[0];
	 	this.e[1] -= v.e[1];
	 	return this;
	},
	/**
	 * 当前向量乘以指定实数
	 * @param {Number} s 实数
	 */
	mul:function(s){
		this.e[0] *= s;
		this.e[1] *= s;
		return this;
	},
	/**
	 * 当前向量除以指定实数
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
	 * @return {Number} 夹角值
	 */
	getAngle:function(){
	    return Math.atan2(this.e[1], this.e[0]);
	},
	/**
	 * 获得和指定向量夹角
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
	 * @return {Number} 平方值
	 */
	lengthSq: function () {
		return this.e[0] * this.e[0] + this.e[1] * this.e[1];
	},
	/**
	 * 获得当前向量长度
	 * @return {Number} 长度值
	 */
	length: function () {
		return Math.sqrt( this.lengthSq() );
	},
	/**
	 * 把当前向量变为单位向量
	 * @return {soya2d.Vector} 单位向量
	 */
	normalize: function () {
		return this.div( this.length() );
	}
};
 
/**
 * @classdesc 显示对象类是引擎中的所有可见组件类的基类。
 * <br/>该类中包含的属性用来控制一个可见对象的显示效果以及渲染方式。<br/>
 注意，该类不应直接实例化,应使用该类的子类或继承该类
 * @class 
 * @param {Object} data 定义参数,见类参数定义
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.DisplayObject = function(data){
    data = data||{};
		
	this.__seq = soya2d.__roIndex++;
    /**
     * 对父类的引用
     * @var {soya2d.DisplayObject} soya2d.DisplayObject#_super
     */
    
    /**
     * 渲染对象id，只读
     * @type {string}
     */
    this.roid = 'roid_' + this.__seq;
    /**
     * 名称
     * @type {string}
     */
    this.name = data.name||this.roid;
    /**
     * 精灵是否可见<br/>
     * true:可见
     * false:不可见
     * @type boolean
     * @default true
     */
    this.visible = data.visible===false?false:data.visible||true;
    
    this.__opacity = data.opacity===0?0:data.opacity||1;
    this.__x = data.x||0;
    this.__y = data.y||0;
    this.__w = data.w||0;
    this.__h = data.h||0;
    this.__originX = data.originX === 0?0:(data.originX||'50%');
    this.__originY = data.originY === 0?0:(data.originY||'50%');
    this.__rotation = data.rotation||0;
    this.__scaleX = data.scaleX||1;
    this.__scaleY = data.scaleY||1;
    this.__skewX = data.skewX||0;
    this.__skewY = data.skewY||0;
    Object.defineProperties(this,{
        /**
         * 可见度0-1
         * 1:不透明
         * 0:全透明
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
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
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 0
         */
        x:{
            set:function(v){
                this.__x = v || 0;
                this.__localChange = true;
            },
            get:function(){
                return this.__x;
            },
            enumerable:true
        },
        /**
         * y坐标。使用top-left坐标系
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 0
         */
        y:{
            set:function(v){
                this.__y = v || 0;
                this.__localChange = true;
            },
            get:function(){
                return this.__y;
            },
            enumerable:true
        },
        /**
         * 宽度。和高度一起，标识精灵的碰撞区、以及事件触发区<br/>
         * *originX属性也依赖该属性
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 0
         */
        w:{
            set:function(v){
                this.__w = v;
                this.__originChange = true;
            },
            get:function(){
                return this.__w;
            },
            enumerable:true
        },
        /**
         * 高度。和宽度一起，标识精灵的碰撞区、以及事件触发区<br/>
         * *originY属性也依赖该属性
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 0
         */
        h:{
            set:function(v){
                this.__h = v;
                this.__originChange = true;
            },
            get:function(){
                return this.__h;
            },
            enumerable:true
        },
        /**
         * x轴参考点，精灵变形时的原点,可以设置百分比字符串或者数字。
         * @type {String|Number}
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 50%
         */
        originX:{
            set:function(v){
                this.__originX = v;
                this.__originChange = true;
            },
            get:function(){
                return this.__originX;
            },
            enumerable:true
        },
        /**
         * y轴参考点，精灵变形时的原点,可以设置百分比字符串或者数字。
         * @type {String|Number}
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 50%
         */
        originY:{
            set:function(v){
                this.__originY = v;
                this.__originChange = true;
            },
            get:function(){
                return this.__originY;
            },
            enumerable:true
        },
        /**
         * 当前旋转角度
         * @type {Number}
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 0
         */
        rotation:{
            set:function(v){
                this.__rotation = v;
                this.__localChange = true;
            },
            get:function(){
                return this.__rotation;
            },
            enumerable:true
        },
        /**
         * x轴缩放比<br/>
         * 如果大于1，则会把精灵变宽<br/>
         * 如果等于1，不改变<br/>
         * 如果小于1，则会把精灵变窄
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
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
         * 如果大于1，则会把精灵变长<br/>
         * 如果等于1，不改变<br/>
         * 如果小于1，则会把精灵变短
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
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
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
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
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
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
     * z坐标。标识精灵所属图层，并且引擎会按照z值的大小进行渲染
     * @type Number
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
    this.__originChange = true;
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
    this.__worldPosition = new soya2d.Vector();
    this.__originPosition = new soya2d.Vector();
    /**
     * 混合方式
     * @type String
     * @default soya2d.BLEND_NORMAL
     * @see soya2d.BLEND_NORMAL
     */
    this.blendMode = data.blendMode||'source-over';
    /**
     * 遮罩设置
     * @type {soya2d.Mask}
     */
    this.mask = data.mask || new soya2d.Mask();
    /**
     * 精灵范围，用于拾取测试和物理碰撞
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
     * @type {Object}
     */
    this.body = null;
};
/**
 * @name soya2d.DisplayObject#onRender
 * @desc 渲染事件，每帧触法。在该回调中使用绘图对象g进行图像绘制
 * @event
 * @param {soya2d.CanvasGraphics} g 绘图对象，根据渲染器类型不同而不同
 */
/**
 * @name soya2d.DisplayObject#onUpdate
 * @desc 更新事件，每帧触法。在该回调中可以编写更新逻辑
 * @event
 * @param {soya2d.Game} game 当前精灵所在的游戏实例
 */
 
//扩展方法包装
soya2d.ext(soya2d.DisplayObject.prototype,/** @lends soya2d.DisplayObject.prototype */{
    toString:function(){
        return '{roid:"'+this.roid+'";name:"'+this.name+'"}';
    },
    /**
     * 更新本地和世界变形
     */
    updateTransform:function(){
        var x = this.__x,
            y = this.__y;
        if(this.__localChange){
            this.__localTransform.identity();
            this.__localTransform
            .scale(this.__scaleX,this.__scaleY)
            .rotate(this.__rotation).skew(this.__skewX,this.__skewY);
        }

        var lt = this.__localTransform;
        var wt = this.__worldTransform;
        var op = this.__originPosition;
        var le = lt.e;
        var oe = op.e;

        var ox=oe[0],oy=oe[1];
        if(this.__originChange){
            ox = this.__originX,
            oy = this.__originY;
            ox = typeof ox==='number'?ox:parseFloat(ox)/100* this.__w,
            oy = typeof oy==='number'?oy:parseFloat(oy)/100* this.__h;

            op.set(ox,oy);
        }
        //css style
        x += ox,
        y += oy;

        
        wt.set(le[0],le[1],le[2],le[3]);
        if(this.parent){
            var pt = this.parent.__worldTransform;
            var pte = pt.e;
            var ppe = this.parent.__worldPosition.e;
            var poe = this.parent.__originPosition.e;
            var popx = poe[0]*pte[0]+poe[1]*pte[2],
                popy = poe[0]*pte[1]+poe[1]*pte[3];
            

            var wx = x*pte[0]+y*pte[2],
                wy = x*pte[1]+y*pte[3];

            x = wx + ppe[0] - popx,
            y = wy + ppe[1] - popy;

            wt.mul(pt);
        }
        this.__worldPosition.set(x,y);

        //重置变换标识
        this.__localChange = this.__originChange = false;
    },
    /**
     * 返回当前对象是否被渲染了
     * @return {boolean} true/false
     */
    isRendered:function(){
        if(!this.visible || this.opacity===0)return false;
        var p = this.parent;
        while(p){
            if(!p.visible || p.opacity===0)return false;
            p = p.parent;
        }
        return true;
    },
    /**
	 * 复制方法,不会复制当前节点的子节点
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
            || i==='__worldPosition'
            || i==='__originPosition'

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
	 * @param {Number} o 透明度值
     * @return {soya2d.DisplayObject} this
	 */
	opacifyTo:function(o){
		this.opacity = o>1?1:o<0?0:o;
        return this;
	},
	/**
	 * 设置透明度偏移
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
     * @param {Number} rn 旋转角度
     * @return this
     */
    rotateBy:function(rn){
        this.angle += rn;
        return this;
    },
    /**
     * 旋转精灵到指定角度
     * @param {Number} rn 角度
     * @return this
     */
    rotateTo:function(rn){
        this.angle = rn;
        return this;
    },
    /**
     * 增加精灵参考点
     * @param {String|Number} x 相对精灵左上角的x坐标偏移,可以设置百分比字符串或者数字
     * @param {String|Number} y 相对精灵左上角的y坐标偏移,可以设置百分比字符串或者数字
     * @return this
     */
    originBy:function(x,y){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.originX += a1;
        this.originY += a2;
        return this;
    },
    /**
     * 设置精灵参考点
     * @param {String|Number} x 相对精灵左上角的x坐标偏移,可以设置百分比字符串或者数字
     * @param {String|Number} y 相对精灵左上角的y坐标偏移,可以设置百分比字符串或者数字
     * @return this
     */
    originTo:function(x,y){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.originX = a1;
        this.originY = a2;
        return this;
    },
    /**
     * 返回该对象当前变形状态的4个顶点<br/>
     * *该方法依赖对象的[x、y、w、h、originX、originY]6个属性
     * @return {Array} [ topLeftX,topLeftY,
     *                  topRightX,topRightY,
     *                  bottomRightX,bottomRightY,
     *                  bottomLeftX,bottomLeftY ]
     */
    getBoundingPoints:function(){
        //加载矩阵
        var e = this.__worldTransform.e;
        var p = this.__worldPosition.e;
        var op = this.__originPosition.e;
        var bx = p[0],by = p[1];
        var m11 = e[0],m12 = e[1],
            m21 = e[2],m22 = e[3];
        var ox = op[0],oy = op[1];

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
     * *该方法依赖对象的[x、y、w、h、originX、originY]6个属性
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
        sx = minX,sy = minY;
        sw = maxX - minX;
        sh = maxY - minY;

        this.__boundRect.x = sx;
        this.__boundRect.y = sy;
        this.__boundRect.w = sw;
        this.__boundRect.h = sh;

        return this.__boundRect;
    },
    /**
     * 拾取测试。依赖当前显示对象的bounds
     * @param  {number} x x坐标
     * @param  {number} y y坐标
     * @return {boolean} 点是否在bounds内
     * @see soya2d.DisplayObject#bounds
     */
    hitTest:function(x,y){
        var p = this.__worldPosition.e;
        if(this.bounds instanceof soya2d.Circle){
            var dis = Math.abs(soya2d.Math.len2D(p[0],p[1],x,y));
            if(dis <= this.bounds.r)return true;
        }else if(this.bounds instanceof soya2d.Rectangle ||
            this.bounds instanceof soya2d.Polygon){
            var vtx;
            if(this.bounds.vtx){
                var e = this.__worldTransform.e;
                var op = this.__originPosition.e;
                var bx = p[0],by = p[1];
                var m11 = e[0],m12 = e[1],
                    m21 = e[2],m22 = e[3];
                var ox = op[0],oy = op[1];

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
    getAnchorPosition:function(){
        //加载矩阵
        var e = this.__worldTransform.e;
        var p = this.__worldPosition.e;
        var op = this.__originPosition.e;
        var bx = p[0],by = p[1];
        var m11 = e[0],m12 = e[1],
            m21 = e[2],m22 = e[3];
        var ox = op[0],oy = op[1];

        //计算原始顶点
        var tl_x = -ox,tl_y = -oy;
        
        //计算原始锚点
        var anchorX = this.w * parseInt(this.originX)/100,
            anchorY = this.h * parseInt(this.originY)/100;
        //求出0°时的半径
        var r = Math.sqrt(anchorY*anchorY + anchorX*anchorX);
        //计算出锚点和左上角的夹角
        var angle = Math.atan2(anchorY,anchorX);
        
        //相对于精灵左上角的锚点值
        anchorX =  Math.cos(angle)*r + tl_x;
        anchorY =  Math.sin(angle)*r + tl_y;
        
        //计算顶点[x,y,1] * m
        return [anchorX*m11+anchorY*m21+bx,anchorX*m12+anchorY*m22+by];
    }
});
/**
 * @class 
 * @extends soya2d.DisplayObject
 * @classdesc 显示对象容器继承自显示对象，是所有显示容器的基类。<br/>
 * 该类用于管理包含子节点的容器相关的方法。<br/>
 注意，该类不应直接实例化,应使用该类的子类或继承该类
 * @param {Object} data 同父类定义参数
 * @author {@link http://weibo.com/soya2d MrSoya} 
 */
soya2d.DisplayObjectContainer = function(data){
    data = data||{};
    soya2d.DisplayObject.call(this,data);
    /**
     * 子节点数组
     * @type {Array}
     * @default []
     */
    this.children = [];
    /**
     * 父节点引用
     * @type {soya2d.DisplayObject}
     * @default null
     */
    this.parent = null;
};
soya2d.inherits(soya2d.DisplayObjectContainer,soya2d.DisplayObject);
soya2d.ext(soya2d.DisplayObjectContainer.prototype,/** @lends soya2d.DisplayObjectContainer.prototype */{
    /**
     * 增加子节点
     * @param {...soya2d.DisplayObject} children 一个或者多个可渲染对象，使用逗号分割
     * @return this
     */
	add:function(){
        for(var i=0;i<arguments.length;i++){
            var child = arguments[i];
            if(child.parent)continue;

            this.children.push(child);
            child.parent = this;
        }

        return this;
	},
    /**
     * 删除子节点
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
     * @return {Array} 子节点
     */
    clear:function(){
        for(var i=this.children.length;i--;){
            this.children[i].parent = null;
        }
        var rs = this.children;
        this.children = [];
        return rs;
    },
    /**
     * 在当前节点下查找符合条件的所有子节点
     * @param {function(obj)} filter 过滤回调，接收显示对象为参数，返回true表示该对象返回
     * @param {boolean} [isRecur=false] 递归查找标识
     * @return {Array} 符合过滤条件的节点数组，如果没有，返回空数组
     */
    find:function(filter,isRecur){
        if(this.children.length<1)return [];

        var rs;
        if(isRecur){
            rs = [];
            //创建递归函数
            !function(parent){
                for(var i=parent.children.length;i--;){
                    var c = parent.children[i];
                    if(filter(c)){
                        rs.push(c);
                    }
                    if(c.children && c.children.length>0){
                        arguments.callee(c);
                    }
                }
            }(this);
        }else{
            rs = this.children.filter(filter);
        }
        return rs;
    }
});
/**
 * @classdesc 遮罩类，通过一个或多个几何元素创建遮罩效果
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Mask = function(type){
    /**
     * 遮罩形状列表
     * @type {Array}
     */
    this.list = [];
}
soya2d.ext(soya2d.Mask.prototype,/** @lends soya2d.Mask.prototype */{
    /**
     * 添加一个或多个mask形状
     * @param {soya2d.Circle | soya2d.Rectangle | soya2d.Polygon} geoms 几何形状，可变参数
     */
    add:function(){
        for(var i=0;i<arguments.length;i++){
            var obj = arguments[i];

            this.list.push(obj);
        }
        return this;
    },
    /**
     * 获取遮罩图形
     * @param  {int} index 索引
     * @return {soya2d.Circle | soya2d.Rectangle | soya2d.Polygon}  几何图形
     */
    getShape:function(index){
        return this.list[index];
    },
    /**
     * 清除遮罩内所有元素
     * @return this
     */
    clear:function(){
        if(arguments.length>0){
            for(var i=0;i<arguments.length;i++){
                var child = arguments[i];
                var index = this.children.indexOf(child);
                if(index<0)continue;

                this.list.splice(index,1);
            }
        }else{
            this.list = [];
        }
        
        return this;
    }
});
/**
 * @classdesc 场景用于组织所有需要在该范围内显示的可渲染单位。<br/>
 * 场景是渲染器接收的参数，其他渲染对象无法直接进行渲染
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Scene = function(data){
    data = data||{};
    soya2d.DisplayObjectContainer.call(this,data);
    soya2d.ext(this,data);

    //更新矩阵
    function updateMx(ro,queue){
        ro.updateTransform();
        //生成renderQueue
        if(ro.children)
            for(var i=ro.children.length;i--;){
                var c = ro.children[i];
                if(c.opacity>0 && c.visible){
                    queue.push(c);
                    updateMx(c,queue);
                }
            }
    }

    /**
     * 更新矩阵树，并记录可渲染的RO。场景自身不处理
     * @private
     */
    this.__updateMatrix = function(){
        this.__renderQueue = [];
        updateMx(this,this.__renderQueue);
    };

    /**
     * 更新整个场景
     * @private
     */
    this.__update = function(game){
        if(this.children)
            update(this.children,game);
    }

    function update(list,game){
        for(var i=list.length;i--;){
            var c = list[i];
            if(c._onUpdate){
                c._onUpdate(game);
            }
            if(c.onUpdate){
                c.onUpdate(game);
            }
            if(c.children){
                update(c.children,game);
            }
        }
    }

    /**
     * 查找当前场景中符合条件的对象
     * *只在可显示对象(opacity>0 && visible)中查询
     * @param {Function} filter 过滤函数，接收ro为参数，返回true表示该对象返回
     * @return {Array} 符合过滤条件的节点数组，如果没有，返回空数组
     */
    this.findVisible = function(filter){
        if(!this.__renderQueue)return [];
        return this.__renderQueue.filter(filter);
    }
};
soya2d.inherits(soya2d.Scene,soya2d.DisplayObjectContainer);

/**
 * @name soya2d.Scene#onInit
 * @desc 当游戏启动或切换场景时触发
 * @event
 * @param {soya2d.Game} game 游戏实例对象，可以获取当前游戏的尺寸等信息
 */
/**
 * @classdesc 卷轴精灵，用于实现卷轴效果，允许对内部精灵进行移动，精灵定位等<br/>
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数，以及新增参数，如下：
 * @param {soya2d.GeoRect} data.scope 卷轴范围
 * @param {soya2d.GeoRect} data.freezone 自由区范围，相对于卷轴视口。当跟踪目标在自由区内移动时，
 * 视口不会跟随目标进行移动
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ScrollSprite = function(data) {
    data = data || {};
    soya2d.DisplayObjectContainer.call(this, data);
    soya2d.ext(this, data);
    
    /**
     * 卷轴范围
     * @type {soya2d.GeoRect}
     */
    this.scope = data.scope;

    /**
     * 视口内限制目标跟踪范围的矩形区域，跟踪目标时有效
     * @type {soya2d.GeoRect}
     */
    this.freezone = data.freezone;

    this.__boundContainer = new soya2d.DisplayObjectContainer();

    this.children.push(this.__boundContainer);
};
soya2d.inherits(soya2d.ScrollSprite, soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.ScrollSprite.prototype, /** @lends soya2d.ScrollSprite.prototype */{
   /**
    * @override
    */
    add:function(){
        this.__boundContainer.add.apply(this.__boundContainer,arguments);
        return this;
    },
    /**
    * @override
    */
    remove:function(){
        this.__boundContainer.remove.apply(this.__boundContainer,arguments);
        return this;
    },
    /**
    * @override
    */
    clear:function(){
        return this.__boundContainer.clear();
    },
    /**
    * @override
    */
    find:function(filter,isRecur){
        return this.__boundContainer.find(filter,isRecur);
    },
    /**
     * 设置卷轴视口跟踪一个内部精灵。<br/>一旦设置有效精灵后，视窗将根据freezone设置进行精灵位置跟踪，
     * 而忽略视窗本身的任何移动方法。
     * @param  {soya2d.DisplayObject} target 视口跟踪目标，必须是容器内的精灵
     * @return {soya2d.ScrollSprite} this
     */
    follow:function(target){
        var tmp = this.__boundContainer.find(function(ro){
            if(target.roid === ro.roid)return true;
        },true);
        if(tmp.length<0){
            console.error('soya2d.ScrollSprite: '+target.toString()+' must be a child node of soya2d.ScrollSprite');
        }
        this.target = target;

        this._onUpdate();
        return this;
    },
    /**
     * 取消跟踪
     */
    unfollow:function(){
        this.target = null;
    },
	/**
     * 移动卷轴指定坐标
     * @param  {number} x x轴坐标
     * @param  {number} y y轴坐标
     */
    scrollTo:function(x,y){
        if(this.target)return;
        this.__boundContainer.x = x;
        this.__boundContainer.y = y;
        
        this.__checkBounds();
    },
    /**
     * 移动卷轴指定偏移
     * @param  {number} offX x轴偏移量
     * @param  {number} offY y轴偏移量
     */
    scrollBy:function(offX,offY){
        if(this.target)return;
        this.__boundContainer.x += offX;
        this.__boundContainer.y += offY;
        
        this.__checkBounds();
    },
    /**
     * @private
     */
    __checkBounds:function(){
        if(!this.scope)return;

        var left = this.scope.x,
            top = this.scope.y,
            right = this.scope.w,
            bottom = this.scope.h;

        //l & r
        var bx = this.__boundContainer.x;
        if(bx > left)this.__boundContainer.x = left;
        if(right>0 && bx < this.w - right)
            this.__boundContainer.x = this.w - right;
        //t & b
        var by = this.__boundContainer.y;
        if(by > top)this.__boundContainer.y = top;
        if(bottom>0 && by < this.h - bottom)
            this.__boundContainer.y = this.h - bottom;
    },
    /**
     * 设置卷轴范围
     * @param {soya2d.Rectangle} scope 范围矩形
     */
    setScope:function(scope){
        if(!scope)return;
        this.scope = scope;

        //容器
        this.__boundContainer.w = scope.w;
        this.__boundContainer.h = scope.h;
    },
    _onUpdate:function(){
        if(!this.target)return;

        var tgx,tgy;
        this.target.updateTransform();
        var wpe = this.target.__worldPosition.e;
        tgx = wpe[0],
        tgy = wpe[1];
        var tw = this.target.w,
            th = this.target.h;

        var xys = this.__boundContainer.getBoundingPoints();
        var cgx = xys[0],
            cgy = xys[1];
            
        var offx = tgx - cgx,
            offy = tgy - cgy;
        var vx,vy;

        if(this.freezone){
            var vox = this.__boundContainer.x * -1,
                voy = this.__boundContainer.y * -1;
            var disx = offx - vox,
                disy = offy - voy;
            var halfTw = tw/2,
                halfTh = th/2;
            var fx = this.freezone.x,
                fy = this.freezone.y,
                fw = this.freezone.w,
                fh = this.freezone.h;
            if(disx - halfTw < fx){
                vx = offx - halfTw - fx;
            }else if(disx + halfTw > fx + fw){
                vx = offx + halfTw - fx - fw;
            }
            if(disy - halfTh < fy){
                vy = offy - halfTh - fy;
            }else if(disy + halfTh > fy + fh){
                vy = offy + halfTh - fy - fh;
            }
            if(!vx && !vy)return;
        }else{
            vx = offx - this.w/2,
            vy = offy - this.h/2;
        }
        if(vx)
        this.__boundContainer.x = -vx;
        if(vy)
        this.__boundContainer.y = -vy;

        this.__checkBounds();
    },
    onRender: function(g) {
        g.beginPath();
        g.rect(0, 0, this.w, this.h);
        g.clip();
    }
});
/**
 * @classdesc 空绘图类，需要实现onRender回调
 * @class
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Shape = function(data){
    data = data||{};
    soya2d.DisplayObjectContainer.call(this,data);
    soya2d.ext(this,data);
};
soya2d.inherits(soya2d.Shape,soya2d.DisplayObjectContainer);
/**
 * @classdesc 精灵类。具有绘图功能的容器类<br/>
 * 支持子对象渲染,以及矩阵变换
 * @class
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数，以及新增参数，参数如下：
 * @param {soya2d.Texture | HTMLImageElement | Array} data.textures 纹理对象或者纹理数组
 * @param {int} data.w 精灵的宽度
 * @param {int} data.h 精灵的高度
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Sprite = function(data){
    data = data||{};
    soya2d.DisplayObjectContainer.call(this,data);
    soya2d.ext(this,data);

    var textures = data.textures;

    this.setTextures(textures);
    
    this.w = data.w || this.textures[0].w;
    this.h = data.h || this.textures[0].h;

    /**
     * 是否多帧
     * @type {boolean}
     */
    this.multiFrame = this.textures.length>1?true:false;
    /**
     * 当前帧序号
     * @type {Number}
     * @default 0
     */
    this.frameIndex = 0;//当前帧号
    this.__currTex;//当前使用纹理
    this.__lastUpdateTime = 0;//上次更新纹理时间
    /**
	 * 纹理切换帧率。单位：帧<br/>
	 * @type int
	 * @default 1
	 */
    this.frameRate = data.frameRate||10;    
    /**
	 * 动画是否循环
	 * @type boolean
	 * @default true
	 */
    this.loop = data.loop===false?false:data.loop||true;
    /**
	 * 动画是否自动播放
	 * @type boolean
	 * @default false
	 */
    this.autoplay = data.autoplay||false;

};
soya2d.inherits(soya2d.Sprite,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.Sprite.prototype,/** @lends soya2d.Sprite.prototype */{
	clone:function(isRecur){//覆盖超类
		var copy = new this.constructor({
			textures:this.textures.concat()
		});
		return soya2d.DisplayObject.prototype.clone.call(this,isRecur,copy);
	},
    onRender:function(g){
    	if(this.multiFrame){
    		if(!this.__lastUpdateTime)this.__lastUpdateTime = new Date().getTime();
	  	    if(this.autoplay){//自动播放
	            var now = new Date().getTime();
	            var delta = now - this.__lastUpdateTime;
	            //处理跳帧情况
	            var deltaFrames = delta/(this.frameRate*16.7/*这里转化为ms*/)>>0;
	            //差值大于帧率，切换帧
	            if(deltaFrames>0){
	                this.frameIndex+=deltaFrames;
	                if(this.frameIndex >= this.textures.length){
	                    if(this.loop){
	                        this.frameIndex = 0;
	                    }else{
	                        this.frameIndex = this.textures.length-1;
	                    }
	                }

	                this.__lastUpdateTime = now;
	            }
	        }
	  	    this.__currTex = this.textures[this.frameIndex];
			g.map(this.__currTex,0,0,this.w,this.h);
    	}else{
    		g.map(this.textures[0],0,0,this.w,this.h);
    	}
    },
    /**
	 * 设置当前帧数+1
	 */
	nextFrame:function(){
		this.frameIndex++;
		if(this.frameIndex >= this.textures.length){
			if(this.loop){
				this.frameIndex = 0;
			}else{
				this.frameIndex = this.textures.length-1;
			}
		}
	},
	/**
	 * 设置当前帧数-1
	 */
	prevFrame:function(){
		this.frameIndex--;
		if(this.frameIndex < 0){
			if(this.loop){
				this.frameIndex = this.textures.length-1;
			}else{
				this.frameIndex = 0;
			}
		}
	},
	/**
	 * 设置或者更改精灵纹理
	 * @param {soya2d.Texture | HTMLImageElement | Array} textures 纹理对象或者纹理数组
	 */
	setTextures:function(textures){
		if(textures instanceof soya2d.Texture){
	        this.textures = [textures];
	    }else if(textures instanceof self.Image){
	    	this.textures = [soya2d.Texture.fromImage(textures)];
	    }else if(textures instanceof Array){
	    	this.textures = textures;
	    }else{
	    	this.textures = [];
	    }

	    if(!this.textures[0]){
	    	console.error('soya2d.Sprite: invalid param [textures]; '+this.textures[0]);
	    }
	}
});
/**
 * @classdesc 瓦片精灵，可以让该精灵内部平铺指定的纹理<br/>
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数，以及新增参数，如下：
 * @param {soya2d.Texture | soya2d.Sprite | HTMLImageElement} data.sprite 瓦片精灵，必须
 * @param {boolean} [data.autoScroll=false] 自动移动瓦片
 * @param {int} data.speed 移动速度,默认1。单位px
 * @param {int} data.angle 移动角度,默认0
 * @author {@link http://weibo.com/soya2d MrSoya}
 * @see {soya2d.Texture}
 */
soya2d.TileSprite = function(data) {
    data = data || {};
    soya2d.DisplayObjectContainer.call(this, data);
    soya2d.ext(this, data);

    /**
     * 瓦片精灵，可以设置该属性的缩放等特性
     * @type {soya2d.Sprite}
     */
    this.sprite = null;
    
    if(data.sprite instanceof soya2d.Texture || data.sprite instanceof self.Image){
        this.sprite = new soya2d.Sprite({textures:data.sprite});
    }else if(data.sprite instanceof soya2d.Sprite){
    	this.sprite = data.sprite;
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
    this.angle = data.angle||0;
    
    //用于内部移动处理
    this.__tileOffx = 0;
    this.__tileOffy = 0;
};
soya2d.inherits(soya2d.TileSprite, soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.TileSprite.prototype, /** @lends soya2d.TileSprite.prototype */{
	/**
     * 滚动tile中的纹理。
     * 滚动速度和方向依赖实例对应参数
     */
    scroll:function(x,y){
        if(x || y){
            this.__tileOffx += x||0;
            this.__tileOffy += y||0;
        }else{
            var angle = (this.angle>>0)%360;
            this.__tileOffx += soya2d.Math.COSTABLE[angle]*this.speed;
            this.__tileOffy += soya2d.Math.SINTABLE[angle]*this.speed;
        }
    },
    clone: function(isRecur) {
        var copy = new this.constructor({
            sprite: this.sprite
        });
        soya2d.DisplayObject.prototype.clone.call(this,isRecur,copy);
        return copy;
    },
    _onUpdate:function(){
        if(this.autoScroll){
            var angle = (this.angle>>0)%360;
            
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

        var tex = this.sprite.textures[0];

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
 * @classdesc 图形类,提供了贴图和矢量绘制的接口。<br/>
 * 注意，该类不应被显示实例化。引擎会在onRender回调中注入该类的实例。<br/>
 * 该图形对象基于Canvas构建。
 * @param ctx CanvasRenderingContext2D的实例
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.CanvasGraphics = function(ctx){
    /**
     * 一个对当前绘图对象的引用
     * @type {CanvasRenderingContext2D}
     */
	this.ctx = ctx;

    /**
     * 设置或者获取当前绘图环境的渲染透明度
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
     * @return this
     */
    this.closePath = function(){
        this.ctx.closePath();
        return this;
    };
    /**
     * 移动当前画笔
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
     * 向当前path中添加矩形subpath
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
     * @param {Array} vtx 一维顶点数组,坐标为相对中心点。<br/>
     * 比如绘制[0,0]点为重心的正三角形:<br/>
     * [0,-5,//top point<br/>
     * -5,x,//left point<br/>
     * 5,y]
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
     * 向当前path中添加圆弧形subpath
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
     * 向当前path中添加正多边形subpath
     * @param {Number} cx 多边形重心
     * @param {Number} cy 多边形重心
     * @param {int} ec 多边形的边数，不能小于3
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
     * @param {Number} blur 模糊度
     * @param {String} [color=rgba(0,0,0,0)] 颜色
     * @param {Number} [offx=0] x偏移
     * @param {Number} [offy=0] y偏移
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
     * @param {soya2d.CanvasPath} path 路径对象实例。如果为空则裁剪当前path，否则裁剪指定path
     * @method
     * @return this
     */
	this.clip = function(){
        this.ctx.clip();
        return this;
	};
    /**
     * 保存当前绘图状态
     * @return this
     */
	this.push = function(){
		this.ctx.save();	
		return this;
	};
    /**
     * 恢复最近一次push的绘图状态
     * @return this
     */
	this.pop = function(){
		this.ctx.restore();	
		return this;
	};
    /**
     * 清空当前path中的所有subpath
     * @return this
     */
	this.beginPath = function(){
		this.ctx.beginPath();	
		return this;
	};
    /**
     * 关闭当前path
     * @return this
     */
    this.closePath = function(){
        this.ctx.closePath();
        return this;
    };

    /**
     * 填充path
     * @param {soya2d.CanvasPath} path 路径对象实例。如果为空则填充当前path，否则填充指定path
     * @method
     * @return this
     */
    this.fill = function(){
        this.ctx.fill();
        return this;
    };
    /**
     * 描绘path的轮廓
     * @param {soya2d.CanvasPath} path 路径对象实例。如果为空则描绘当前path，否则描绘指定path
     * @method
     * @return this
     */
    this.stroke = function(){
        this.ctx.stroke();
        return this;
    };

    /**
     * 以x,y为左上角填充一个宽w高h的矩形
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
     * @param {soya2d.Texture} tex 需要绘制的纹理
     * @param  {int} sx  纹理起始坐标x
     * @param  {int} sy  纹理起始坐标y
     * @param  {int} sw  纹理起始尺寸w
     * @param  {int} sh  纹理起始尺寸h
     * @param  {int} dx  纹理目标坐标x
     * @param  {int} dy  纹理目标坐标y
     * @param  {int} dw  纹理目标尺寸w
     * @param  {int} dh  纹理目标尺寸h
     * @return this
     */
	this.map = function(tex,dx,dy,dw,dh,sx,sy,sw,sh){
		sx = sx || 0;
        sy = sy || 0;
        sw = sw || tex.w;
        sh = sh || tex.h;

        if(sw===0 || sh===0 || dh===0 || dh===0){
            return;
        }

		this.ctx.drawImage(tex.__data,
                            sx>>0,sy>>0,sw>>0,sh>>0,
                            dx>>0,dy>>0,dw>>0,dh>>0);
		return this;
	};
    /**
     * 填充文字
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
            this.ctx.fillText(str, x||0, y||0 )
        }
        return this;
    };
    /**
     * 描绘文字
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
 * @classdesc 渲染器是引擎提供可视化内容展示的底层基础。
 * 不同的渲染器构建在不同的技术之上比如CSS/WEBGL/CANVAS/SVG等等。<br/>
 * 每个渲染器都和一个soya2d.Game实例绑定，一个应用有且只有一个渲染器。
 * 如果要实现多层渲染，那么你需要创建多个soya2d.Game实例。<br/>
 * 该类不应被显示实例化，引擎会自动创建<br/>
 * 注意，该渲染器基于Canvas构建
 * @param {Object} data 构造参数对象
 * @param {DOMElement} data.container 渲染容器，渲染器会在该容器范围内进行渲染
 * 容器可以是一个块级元素比如div。
 * @param {boolean} data.autoClear 见属性说明
 * @param {boolean} data.sortEnable 见属性说明
 * @param {boolean} [data.smoothEnable=true] 是否启用对图像边缘的平滑处理
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
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
     * @type int
     * @default 960
     */
    this.w = data.w||(container?container.clientWidth:0);
    /**
     * 世界高度，通常为可视窗口高度
     * @type int
     * @default 480
     */
    this.h = data.h||(container?container.clientHeight:0);
    /**
     * 是否自动清除图层，如果不清除，则渲染效果会在该图层叠加
     * @default true
     */
    this.autoClear = data.autoClear===undefined?true:data.autoClear;
    /**
     * 是否开启自动排序。如果开启渲染器会在渲染前对所有DO进行Z轴排序
     * @default false
     */
    this.sortEnable = data.sortEnable||false;

    var smoothEnable = data.smoothEnable===false?false:data.smoothEnable||true;
    var crispEnable = data.crispEnable===false?false:data.crispEnable||true;


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
     * @return {HTMLCanvasElement} 
     */
    this.getCanvas = function(){
        return cvs;
    }

    /**
     * 渲染方法。每调用一次，只进行一次渲染
     * @param {soya2d.Scene} scene 需要渲染的场景实例
     */
    this.render = function(scene){
        if(!scene instanceof soya2d.Scene)return;
        //update matrix——>sort(optional)——>onUpdate(matrix)——>onRender(g)

        scene.__updateMatrix();

        //render
        ctx.setTransform(1,0,0,1,0,0);
        if(this.autoClear){
            ctx.clearRect(0,0,this.w,this.h);
        }

        render(ctx,scene,renderStyle,this.sortEnable);
    };

    function render(ctx,ro,rs,sortEnable){
        if(ro.opacity===0 || !ro.visible)return;

        if(ro.mask instanceof soya2d.Mask && ro.mask.list.length>0){
            ctx.save();
            ctx.beginPath();
            ctx.setTransform(1,0,0,1,0,0);
            var list = ro.mask.list;
            for(var l=0;l<list.length;l++){
                var geom = list[l];
                if(geom instanceof soya2d.Rectangle){
                    g.rect(geom.x,geom.y,geom.w,geom.h);
                }else if(geom instanceof soya2d.Circle){
                    ctx.moveTo(geom.x+geom.r,geom.y);
                    g.arc(geom.x,geom.y,geom.r);
                }else if(geom instanceof soya2d.Polygon){
                    g.polygon(geom.vtx);
                }
            }
            ctx.closePath();
            ctx.clip();
        }

        if(ro instanceof soya2d.ScrollSprite){
            ctx.save();
        }

        if(ro.onRender){
            var te = ro.__worldTransform.e;
            var pe = ro.__worldPosition.e;
            ctx.setTransform(te[0],te[1],te[2],te[3],pe[0],pe[1]);

            //apply alpha
            if(ro.opacity<=1 && ro.opacity!==rs.opacity){
                rs.opacity = ro.opacity;
                ctx.globalAlpha = ro.opacity;
            }
            //apply blendMode
            if(rs.blendMode !== ro.blendMode){
                rs.blendMode = ro.blendMode;
                ctx.globalCompositeOperation = ro.blendMode;
            }

            
            //css style
            var oe = ro.__originPosition.e;
            ctx.translate(-oe[0], -oe[1]);
            ro.onRender(g);
        }//over onRender
        //渲染子节点
        if(ro.children && ro.children.length>0){
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
                render(ctx,children[i],rs,sortEnable);
            }
        }

        if(ro instanceof soya2d.ScrollSprite){
            ctx.restore();
        }

        //mask
        if(ro.mask instanceof soya2d.Mask && ro.mask.list.length>0){
            ctx.restore();
        }
    }
    
    /**
     * 缩放所渲染窗口
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
     * @param {Boolean} enabled 开启/关闭
     * @return this
     */
    this.smooth = function(enabled){
        if(enabled !== undefined){
            ctx.imageSmoothingEnabled = 
            ctx.webkitImageSmoothingEnabled = 
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
     * @param {String} type 图片类型
     * @default image/png
     * @return {String} URL
     */
    this.toDataURL = function(type){
        return cvs.toDataURL(type||"image/png");
    };

    /**
     * 获取一个该渲染器的点击测试器
     * @param {int} type 测试器类型.默认路径检测
     * @return {soya2d.HitTester} 测试器
     */
    this.getHitTester = function(type){
        switch(type){
            case 2:return this.__pixelTester;
            case 1:default:
            return this.__pathTester;
        }
    }
    //优化为每个渲染器只对应各类型一个检测器
    this.__pixelTester = new soya2d.__HitPixelTester(this.w,this.h);
    this.__pathTester = new soya2d.__HitPathTester(this.w,this.h);



    /**
     * 创建一个图像绘制模式
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
        var angle=0,x=0,y=0,type=soya2d.GRADIENTTYPE_LINEAR,focalRatio=0,focalRadius=0;
        if(opt){
            angle = opt.angle||0,
            x=opt.x||0,
            y=opt.y||0,
            type=opt.type||soya2d.GRADIENTTYPE_LINEAR,
            focalRatio=opt.focalRatio||0,
            focalRadius=opt.focalRadius||0;
        }

        var g,m=soya2d.Math;
        angle = Math.abs((angle||0)>>0);
        switch(type){
            case soya2d.GRADIENTTYPE_LINEAR:
                g = ctx.createLinearGradient(x,y,x+len* m.COSTABLE[angle],y+len* m.SINTABLE[angle]);
                for(var i=0,l=ratios.length;i<l;i++){
                    g.addColorStop(ratios[i],colors[i]||"RGBA(0,0,0,0)");
                }
                break;
            case soya2d.GRADIENTTYPE_RADIAL:
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

/********************点击测试器***********************/

soya2d.__HitPathTester = function(w,h){

    function voidPathCtx(ctx) {
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
    }

    //创建path检测层
    var layer = document.createElement('canvas');
    layer.width = w;layer.height = h;

    var ctx = layer.getContext('2d');
    var cg = new soya2d.CanvasGraphics(ctx);
    voidPathCtx(ctx);

    this.test = function(ro,x,y){
        render(ro,ctx,cg);
        return ctx.isPointInPath(x,y);
    }

    function render(ro,ctx,cg){
        var te = ro.__worldTransform.e;
        var pe = ro.__worldPosition.e;
        ctx.setTransform(te[0],te[1],te[2],te[3],pe[0],pe[1]);
        if (ro.onRender) {
            ctx.beginPath();
            var oe = ro.__originPosition.e;
            ctx.translate(-oe[0], -oe[1]);
            ro.onRender(cg);
        }
    }
};

soya2d.__HitPixelTester = function(w,h){
    var w,h;
    //创建pixel检测层
    var layer = document.createElement('canvas');
    layer.width = w;layer.height = h;
    var ctx = layer.getContext('2d');
    var cg = new soya2d.CanvasGraphics(ctx);

    this.test = function(ro,x,y){
        render(ro,ctx,cg);

        var d = ctx.getImageData(0,0,w,h).data;
        return !!d[((w * y) + x) * 4 + 3];
    };

    function render(ro,ctx,cg){
        var te = ro.__worldTransform.e;
        var pe = ro.__worldPosition.e;
        ctx.setTransform(te[0],te[1],te[2],te[3],pe[0],pe[1]);
        if (ro.onRender) {
            ctx.beginPath();
            var oe = ro.__originPosition.e;
            ctx.translate(-oe[0], -oe[1]);
            ro.onRender(cg);
        }
    }
};

/**
 * @classdesc 点击测试器，可以检测2D点是否在绘制图形中，
 * 只适用于基于canvas的2D图形点击检测<br/>
 * 注意，除非你确定需要使用基于canvas2d的检测API，否则应该使用DisplayObject自带的检测函数。<br/>
 * 注意，该类无法直接实例化，只能通过渲染器获取
 * <p>
 * 渲染器有基于路径和像素两种，基于路径的检测器性能更高，但只能检测由path构成的闭合图元。<br/>
 * 如果需要检测一个RO中绘制的非连续图形，比如点状分布的多边形或者像素，则可以使用像素检测
 * 注意：在像素检测中，透明色会被认为无效点击
 * </p>
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.HitTester = function(){
    /**
     * 测试渲染对象<br/>
     * 注意：不要在onRender事件中调用该方法
     * @param {soya2d.DisplayObject} ro 渲染对象
     * @param {int} x 相对于场景的坐标
     * @param {int} y 相对于场景的坐标
     * @return {Boolean} 指定2D坐标是否在测试的渲染对象内
     */
    soya2d.HitTester.prototype.test = function(ro,x,y){};
};
/**
 * 引擎当前运行所在设备的信息<br/>
 * @namespace soya2d.Device
 * @author {@link http://weibo.com/soya2d MrSoya}
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
     * @type {boolean}
     */
    this.iphone = isIphone;
    /**
     * 是否为ipad
     * @type {boolean}
     */
    this.ipad = isIpad;
    /**
     * 是否为ios
     * @type {boolean}
     */
    this.ios = isIphone || isIpad;
    /**
     * 是否为android
     * @type {boolean}
     */
    this.android = isAndroid;
    /**
     * 是否为wp
     * @type {boolean}
     */
    this.wp = isWphone;
    /**
     * 是否移动系统
     * @type {boolean}
     */
    this.mobile = this.ios || isAndroid || isWphone;

    //pc端信息
    /**
     * 是否为windows
     * @type {boolean}
     */
    this.windows = isWindows;
    /**
     * 是否为linux
     * @type {boolean}
     */
    this.linux = isLinux;
    /**
     * 是否为mac os
     * @type {boolean}
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
     * @type boolean
     */
    this.ie = /msie|trident.*rv:/.test(userAgent.toLowerCase());
    /**
     * 如果当前浏览器为FireFox，那么值为true。
     * @type boolean
     */
    this.ff = type.Firefox?true:false;
    /**
     * 如果当前浏览器为Opera，那么值为true。
     * @type boolean
     */
    this.opera = type.Opera?true:false;
    /**
     * 如果当前浏览器为Chrome，那么值为true。
     * @type boolean
     */
    this.chrome = type.Chrome?true:false;
    /**
     * 如果当前浏览器为Safari，那么值为true。
     * @type boolean
     */
    this.safari = type.Safari?true:false;
};
!function(){
    /**
     * 创建视图对象
     * @classdesc 视图对象用于设置游戏实例的视图规则，包括分辨率适应、窗口事件回调等
     * @class 
     * @param {soya2d.Game} game 游戏实例
     * @author {@link http://weibo.com/soya2d MrSoya}
     */
    soya2d.View = function(game){
        /********************* 属性定义 *********************/
        this.game = game;
        /**
         * 缩放类型
         * @type {int}
         * @default soya2d.SCALEMODE_SHOWALL
         */
        this.scaleMode = soya2d.SCALEMODE_SHOWALL;
        /**
         * 缩放最小宽度
         * @type {Number}
         * @default 0
         */
        this.minWidth = 0;
        /**
         * 缩放最小高度
         * @type {Number}
         * @default 0
         */
        this.minHeight = 0;
        /**
         * 缩放最大宽度
         * @type {Number}
         * @default 0
         */
        this.maxWidth = 0;
        /**
         * 缩放最大高度
         * @type {Number}
         * @default 0
         */
        this.maxHeight = 0;
        /**
         * 是否在横竖屏切换、resize窗口时，都进行缩放
         * @type {boolean}
         * @default true
         */
        this.autoScale = true;

        /********************* 行为定义 *********************/
        /**
         * 扫描是否需要缩放，如果需要，则根据缩放参数进行缩放
         * @private
         */
        this.scan = function(){
            if(!this.game)return;

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
            var renderer = this.game.getRenderer();
            var container = renderer.getCanvas().parentNode;
            //判断设计size是否超过了容器size
            var cw = container.clientWidth;
            var ch = container.clientHeight;
            if(container.tagName === 'BODY'){
                ch = window.innerHeight;
            }
            var wh = scaler(designWidth,designHeight,cw,ch,this.minWidth,this.minHeight,this.maxWidth,this.maxHeight);
            renderer.resize(wh[0],wh[1]);
            this.w = wh[0];
            this.h = wh[1];

            //rotate
            rotate(this.scaleMode,rotation,renderer.getCanvas(),renderer);
        }

        /**
         * 视图方向。portrait或者landscape
         * @type {string}
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
                that.scan();
            }
        }, false);
        window.addEventListener("resize", function(e){
            that.orientation = getOrientation();
            if(that.autoScale){
                that.scan();
            }
        }, false);

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

        var rotation = soya2d.ROTATEMODE_0;
        /**
         * 设置或者获取该视图旋转模式
         * @param  {int} rotateMode 旋转模式
         * @return {int | this} 返回view或者旋转模式
         */
        this.rotate = function(rotateMode){
            if(!this.game)return;
            if(rotateMode){
                
                rotation = rotateMode;
                this.scan();

                return this;
            }else{
                return rotation;
            }
        }

        function rotate(scaleMode,rotateMode,canvas,renderer){
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
                    rotation = soya2d.ROTATEMODE_0;
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

        var align = soya2d.ALIGNMODE_CENTER;
        /**
         * 设置或者获取该视图对齐模式。SHOWALL模式下有效
         * @param  {int} alignMode 对齐模式
         * @return {int | this} 返回view或者对齐模式
         */
        this.align = function(alignMode){
            if(!this.game)return;
            if(alignMode && this.scaleMode === soya2d.SCALEMODE_SHOWALL){
                var canvas = this.game.getRenderer().getCanvas();
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
                return this;
            }else{
                return align;
            }
        }
        
    };

    /**
     * 视图缩放类型，不缩放。游戏默认值
     */
    soya2d.SCALEMODE_NOSCALE = 0;
    /**
     * 视图缩放类型，等比缩放，总是显示全部
     */
    soya2d.SCALEMODE_SHOWALL = 1;
    /**
     * 视图缩放类型，等比缩放，不一定显示全部
     */
    soya2d.SCALEMODE_NOBORDER = 2;
    /**
     * 视图缩放类型，非等比缩放。完全适配容器
     */
    soya2d.SCALEMODE_EXACTFIT = 3;

    /**
     * 视图对齐类型
     */
    soya2d.ALIGNMODE_LEFT = 1;
    /**
     * 视图对齐类型
     */
    soya2d.ALIGNMODE_CENTER = 2;
    /**
     * 视图对齐类型
     */
    soya2d.ALIGNMODE_RIGHT = 3;

    /**
     * 视图旋转类型
     */
    soya2d.ROTATEMODE_0 = 1;
    /**
     * 视图旋转类型
     */
    soya2d.ROTATEMODE_90 = 2;
    /**
     * 视图旋转类型
     */
    soya2d.ROTATEMODE_180 = 3;
    /**
     * 视图旋转类型
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

        var r = Math.min(cw/dw,ch/dh);
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
}();



/**
 * @classdesc 字体类。用于指定绘制字体的样式、大小等
 * @class
 * @param {String} desc 字体描述字符串，可以为空。为空时创建默认样式字体:[normal 400 13px/normal sans-serif]<br/>符合W3C[CSSFONTS]规范
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Font = function(desc){
    var fontElement = document.createElement('span');
    fontElement.style.cssText = "position:absolute;top:-9999px;left:-9999px;white-space:nowrap;font:"
                                        +(desc||"normal 400 13px/normal sans-serif");                         
    /**
     * 字体描述字符串
     */
    this.fontString = fontElement.style.font;

    /**
     * 字体大小
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
     * @returns {soya2d.Font} 新的字体对象
     */
    this.clone = function(){
        return new soya2d.Font(this.getDesc());
    };
    /**
     * 返回字体描述的字符串
     * @returns {String}
     */
    this.getDesc = function(){
        return fontElement.style.font;
    };
    /**
     * 设置或者获取字体样式
     * @param {String} style 字体样式字符串
     * @returns {this|String}
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
     * @param {String} weight 字体粗细字符串
     * @returns {this|String}
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
     * @param {int} size 字体大小字符串
     * @returns {this|int}
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
     * @param {String} family 字体类型字符串
     * @returns {this|String}
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
     * @param {String} str 测试字符串
     * @param {Object} renderer 渲染器
     * @return {Object} 指定字符串在当前字体下的宽高。｛w:w,h:h｝
     */
    this.getBounds = function(str,renderer){
        var ctx = renderer.ctx;
        ctx.font = this.getDesc();
        var w = ctx.measureText(str).width;
        return {w:w,h:this.fontSize};
    };
};

/**
 * 使用纹理集对象，构建一个图像字体类。
 * @classdesc 图像字体类用于创建一个传递给文本精灵的字体对象，通过图片和映射文件创建。映射文件同精灵表。其实n为需要
 * 替换的字符
 * @class
 * @param {soya2d.TextureAtlas} data 用于字体映射的纹理集对象
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ImageFont = function(data){
    
    this.__fontMap = data;

    var oriFontSize = data.texs[Object.keys(data.texs)[0]].h;
    this.fontSize = oriFontSize;
    var fontWidth = data.texs[Object.keys(data.texs)[0]].w
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
                var tex = this.font.__fontMap.getTexture(c);
                if(tex){
                    var w = tex.w*scaleRate;
                    var h = tex.h*scaleRate
                    lastW = w;
                    
                    g.map(tex,
                            offx, offy, w, h,
                            0, 0, tex.w, tex.h);
                }
                
                offx += lastW + this.letterSpacing;
            }
            offy += this.font.fontSize + this.lineSpacing;
        }
    };
                                            
    /**
     * 用当前参数复制一个新的字体对象。<br/>
     * @returns {soya2d.Font} 新的字体对象
     */
    this.clone = function(){
        return new soya2d.ImageFont(this.__fontMap);
    };
    /**
     * 设置或者获取字体大小
     * @param {int} size 字体大小
     * @returns {this|int}
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
     * @param {String} str 测试字符串
     * @return {Object} 指定字符串在当前字体下的宽高。｛w:w,h:h｝
     */
    this.getBounds = function(str){
        var len = str.length;
        return {w:len*fontWidth*scaleRate,h:this.fontSize};
    }
};


/**
 * 创建一个用于渲染文本的实例
 * @classdesc 文本类用于显示指定的文本内容，支持多行文本显示。
 * 文本渲染效果取决于所指定的font，默认为普通字体soya2d.Font。<br/>
 * 注意，需要显示的指定实例的w属性，来让引擎知道文本是否需要分行显示
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 * @see soya2d.Font
 * @see soya2d.ImageFont
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Text = function(data){
	data = data||{};
    soya2d.DisplayObjectContainer.call(this,data);
    soya2d.ext(this,data);

    /**
     * 文本内容
     * *注意，直接设置该属性后，需要手动刷新才会更新显示内容。如果不想手动刷新，可以使用setText函数来更新内容
     * @see soya2d.TextArea.refresh
     * @type {String}
     */
    this.text = data.text||'';
    /**
     * 字符间距
     * @type {int}
     * @default 1
     */
    this.letterSpacing = data.letterSpacing || 0;
    /**
     * 行间距
     * @type {int}
     * @default 5
     */
    this.lineSpacing = data.lineSpacing||0;
    /**
     * 字体对象
     * @type {String | soya2d.Font | soya2d.ImageFont}
     * @default soya2d.Font
     * @see soya2d.Font
     */
    this.font = data.font;
    if(typeof this.font === 'string'){
        this.font = new soya2d.Font(this.font);
    }
    var font = this.font||new soya2d.Font();
    this.font = font;

    this.__changed = true;//默认需要修改
    this.__lines;//分行内容

    this.__renderer = this.font.__renderText;//绑定渲染
};
soya2d.inherits(soya2d.Text,soya2d.DisplayObjectContainer);

soya2d.ext(soya2d.Text.prototype,{
    onRender:function(g){
        this.__renderer(g);
    },
    /**
     * 刷新显示内容<br/>
     * 用在修改了宽度时调用
     */
    refresh:function(){
        this.__changed = true;
    },
    /**
     * 重新设置文本域字体
     * @param {soya2d.Font | soya2d.ImageFont} font 字体
     */
    setFont:function(font){
        if(!font)return;
        this.font = font;
        this.__renderer = this.font.__renderText;//绑定渲染
    },
    /**
     * 设置文本内容，并刷新
     * @param {string} txt 文本内容
     */
	setText:function(txt){
		this.text = txt+'';
		this.refresh();
	},
    _onUpdate:function(game){
        if(!this.__lh){//init basic size
            var bounds_en = this.font.getBounds("s",game.getRenderer());
            var bounds_zh = this.font.getBounds("豆",game.getRenderer());
            this.__lh = (bounds_en.h+bounds_zh.h)/2>>0;//行高
            this.__uw = (bounds_en.w+bounds_zh.w)/2>>0;//单字宽度
        }
        if(this.__changed){
            this.__lines = this.__calc(game.getRenderer());
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
 * 创建一个纹理对象
 * @classdesc 纹理是用来储存展示图像的矩形。它不能直接被渲染，必须映射到一个显示对象上。比如Image。
 * 在纹理生成后，可以释放image对象。纹理则需要单独释放
 * @class 
 * @param {Image | HTMLCanvasElement} data 图形对象
 * @param {int} [w] 图像的宽度
 * @param {int} [h] 图像的高度
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Texture = function(data,w,h){
	/**
	 * 纹理数据，可能是image或者canvas,根据引擎来决定
	 * @private
     */
	this.__data = data;
	/**
	 * 纹理宽度,只读
	 * @type int 
     */
	this.w = parseInt(w) || data.width;
	/**
	 * 纹理高度,只读
	 * @type int 
     */
	this.h = parseInt(h) || data.height;
};

soya2d.ext(soya2d.Texture,/** @lends soya2d.Texture */{
	/**
	* 通过图片来创建一个纹理
	* @param {Image | HTMLCanvasElement} data 图形对象
	*/
	fromImage:function(img){
		return new soya2d.Texture(img,img.width,img.height);
	},
	//创建一个指定大小和颜色的纹理，color可以是渐变对象
	/**
   * 通过指定大小和颜色来创建一个纹理
   * @param {int} w 纹理宽度
   * @param {int} h 纹理高度
   * @param {String} color 命名色彩/RGB色彩/Hex色彩
   * @param {CanvasGradient} color 线性渐变/径向渐变
   * @param {CanvasPattern} color 图案
   * @param {Array} color 顶点颜色数组,内容可以是任意合法颜色字符串,按照0-1-2-3的顺序,如果数组颜色不足4个，使用#000000代替
   * 0---1
   * |   |
   * 2---3
   * @see soya2d.CanvasRenderer.createGradient
   * @see soya2d.CanvasRenderer.createPattern
   */
	fromColor:function(w,h,color){
		var data = document.createElement('canvas');
		data.width = w;
		data.height = h;
		var ctx = data.getContext('2d');
		
		if(color instanceof Array){
			var c1 = soya2d.RGBColor.parse(color[0]||'#000000');
			var c2 = soya2d.RGBColor.parse(color[1]||'#000000');
			var c3 = soya2d.RGBColor.parse(color[2]||'#000000');
			var c4 = soya2d.RGBColor.parse(color[3]||'#000000');
			
			var hsl0 = new soya2d.HSLColor(c1[0],c1[1],c1[2]);
			var baseLight0 = hsl0.l;
			
			var hsl1 = new soya2d.HSLColor(c2[0],c2[1],c2[2]);
			var baseLight1 = hsl1.l;
			
			var hsl2 = new soya2d.HSLColor(c3[0],c3[1],c3[2]);
			var baseLight2 = hsl2.l;
			
			var hsl3 = new soya2d.HSLColor(c4[0],c4[1],c4[2]);
			var baseLight3 = hsl3.l;
			
		  var texData = ctx.createImageData(w,h);
			var tdd = texData.data;
			for(var i =0,len = tdd.length; i<len;i+=4){
				var x = i/4%w;
				var y = i/4/w>>0;
				
				/************ 顶点0 ************/
				var u = (w-x)/w;
				var v = (h-y)/h;
				var delta = u*v;
				hsl0.lighteness(delta*baseLight0);
				var rgb0 = hsl0.getRGB();
				
				/************ 顶点1 ************/
				u = (x)/w;
				v = (h-y)/h;
				delta = u*v;
				hsl1.lighteness(delta*baseLight1);
				var rgb1 = hsl1.getRGB();
				
				/************ 顶点2 ************/
				u = (w-x)/w;
				v = (y)/h;
				delta = u*v;
				hsl2.lighteness(delta*baseLight2);
				var rgb2 = hsl2.getRGB();
				
				/************ 顶点3 ************/
				u = (x)/w;
				v = (y)/h;
				delta = u*v;
				hsl3.lighteness(delta*baseLight3);
				var rgb3 = hsl3.getRGB();
				/*
				tdd[i] = (rgb0[0]^rgb1[0]^rgb2[0]^rgb3[0])/1;
				tdd[i+1] = (rgb0[1]^rgb1[1]^rgb2[1]^rgb3[1])/1;
				tdd[i+2] = (rgb0[2]^rgb1[2]^rgb2[2]^rgb3[2])/1;
				//*/
				tdd[i] = rgb0[0]+rgb1[0]+rgb2[0]+rgb3[0];
				tdd[i+1] = rgb0[1]+rgb1[1]+rgb2[1]+rgb3[1];
				tdd[i+2] = rgb0[2]+rgb1[2]+rgb2[2]+rgb3[2];
				
				tdd[i+3] = 255;
			}
			
			ctx.putImageData(texData,0,0);
		}else{
			ctx.fillStyle = color;
			ctx.fillRect(0,0,w,h);
		}
		
		return new soya2d.Texture(data,w,h);
	}
});

soya2d.Texture.prototype = {
	/**
	 * 释放纹理数据
	 */
	dispose:function(){
		this.__data = null;
	}
};




/**
 * @classdesc 纹理集是一个将许多小的纹理整合到一张大图中，可以从纹理集中快速的读取指定部分的纹理，从而加速动画的渲染。
 * ssheet格式为<br/>
 * <pre>
 * [
 		{n:'hero_001.png',x:0,y:0,w:50,h:50,r:90},//ssheet unit
 		{n:'hero_002.png',x:50,y:50,w:50,h:50,r:180},
 		...
 	]
 	</pre>
 * r:将指定部分资源旋转指定角度后，行程新纹理
 * @class 
 * @param {soya2d.Texture} tex 大图纹理
 * @param {json} ssheet 纹理集描述
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.TextureAtlas = function(tex,ssheet){
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
			console.error('soya2d.TextureAtlas: invalid ssheet unit，w/h must be a positive;[w:'+descW+',h:'+descH+'] ');
			return;
		}
		ctx.drawImage(tex.__data,
						desc.x>>0,desc.y>>0,descW,descH,
						-descW/2>>0,-descH/2>>0,descW,descH);
		this.texs[desc.n] = new soya2d.Texture(data,descW,descH);
	},this);
};

soya2d.TextureAtlas.prototype = {
	/**
	 * 返回由一个指定的字符串开始按字母排序的所有纹理
	 */
	getTextures:function(prefix){
		var rs = [];
		for(var i in this.texs){
			if(i.indexOf(prefix)===0)rs.push(this.texs[i]);
		}
		return rs;
	},
	getTexture:function(name){
		return this.texs[name];
	},
	/**
	 * 释放纹理集数据
	 */
	dispose:function(){
		for(var i in this.texs){
			this.texs[i].dispose();
		}
		this.texs = null;
	}
};




/**
 * 创建一个纹理管理器对象
 * @classdesc 纹理集管理器用来管理所绑定game实例中的所有纹理集，用于获取，创建，删除纹理集。<br/>
 * 该类无需显式创建，引擎会自动绑定到game实例属性中。
 * @extends soya2d.ResourceManager
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.TextureAtlasManager = function(){
    //继承
    soya2d.ResourceManager.call(this);

    this._add = function(tag,res){
        this.urlMap[tag] = res;
    };
};
soya2d.inherits(soya2d.TextureAtlasManager,soya2d.ResourceManager);
/**
 * 创建一个纹理管理器对象
 * @classdesc 纹理管理器用来管理所绑定game实例中的所有纹理，用于获取，创建，删除纹理。<br/>
 * 该类无需显式创建，引擎会自动绑定到game实例属性中。
 * @extends soya2d.ResourceManager
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.TextureManager = function(){
    //继承
    soya2d.ResourceManager.call(this);

    //添加纹理到管理器，用于loader
    this._add = function(src,res){
        this.urlMap[src] = res;
    };
};
soya2d.inherits(soya2d.TextureManager,soya2d.ResourceManager);
/**
 * 异步加载类
 * @namespace soya2d.AJAXLoader
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.AJAXLoader = new function(){

    var timeout = 5000;
    function obj2str(obj){
        var rs = '';
        for(var i in obj){
            rs += '&'+i+'='+ escape(obj[i]);
        }
        return rs.substr(1);
    }

    function downloadRequest(type,url,async,onload,onprogress,ontimeout,onerror,t,data,contentType){
        var xhr = new XMLHttpRequest();
        type = type||"get";
        if(type === 'get'){//转换参数
            data = typeof(data)==='string'?data:obj2str(data);
            if(url.indexOf('?') > -1){
                url = url.replace(/&$/,'');
                url += '&' + data.replace(/^&/,'');
            }else{
                url += '?' + data.replace(/^&/,'');
            }
            data = null;
        }

        xhr.open(type,url, async===false?false:true);
        xhr.timeout = t || timeout;
        xhr.ontimeout = ontimeout;
        xhr.onerror = onerror;
        if(xhr.onload === null){
            xhr.onload = function(){
                if(xhr.status===0 || //native
                    (xhr.status >= 200 && xhr.status <300) || xhr.status === 304){
                    onload(xhr);
                }
            }
            xhr.onprogress=function(e){
                if(onprogress && e.lengthComputable)onprogress(xhr,e.loaded,e.total);
            }
        }else{
            xhr.onreadystatechange = function () {
                if(xhr.status===0 || //native
                    ((xhr.status >= 200 && xhr.status <300) || xhr.status === 304) && xhr.readyState === 4){
                    onload(xhr);
                }
            };
        }
        if(type === 'post'){
            data = typeof(data)==='string'?data:obj2str(data);
            xhr.setRequestHeader("Content-Type",contentType||'application/x-www-form-urlencoded');
        }
        xhr.send(data);
    }

    function uploadRequest(type,url,async,onload,onprogress,ontimeout,onerror,t,data,contentType){
        var xhr = new XMLHttpRequest();
        xhr.open('post',url, async===false?false:true);
        xhr.timeout = t || timeout;
        xhr.ontimeout = ontimeout;
        if(xhr.upload){
            xhr.upload.addEventListener("progress",function(e){
                if(onprogress && e.lengthComputable) {
                    var percentComplete = e.loaded / e.total;
                    onprogress(xhr,e.loaded,e.total);
                }
            }, false);
            xhr.upload.addEventListener("error", onerror, false);
        }
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
        xhr.setRequestHeader("Content-Type",contentType||'application/x-www-form-urlencoded');
        data = typeof(data)==='string'?data:obj2str(data);
        xhr.send(data);
    }

    /**
     * 加载文本信息
     * @param {Object} opts 参数对象
     * @param  {string} opts.data 请求数据
     * @param  {string} opts.url 请求地址
     * @param  {string} [opts.type=get] 请求类型
     * @param  {boolean} [opts.async=true] 是否异步
     * @param  {Function} [opts.onLoad] 回调函数，参数为文本
     * @param  {Function} [opts.onProgress] 回调函数
     * @param  {Function} [opts.onTimeout] 回调函数
     * @param  {Function} [opts.onError] 回调函数
     * @param  {int} [opts.timeout=5000] 超时上限，毫秒数
     */
	this.loadText = function(opts){
        if(!opts)return;
        if(!(opts.onLoad instanceof Function))return;

        downloadRequest(opts.type,opts.url,opts.async,function(xhr){
            opts.onLoad(xhr.responseText);
        },opts.onProgress,opts.onTimeout,opts.onError,opts.timeout,opts.data);
    };

    /**
     * 加载json对象
     * @param {Object} opts 参数对象
     * @param  {string} opts.data 请求数据
     * @param  {string} opts.url 请求地址
     * @param  {string} [opts.type=get] 请求类型
     * @param  {boolean} [opts.async=true] 是否异步
     * @param  {Function} [opts.onLoad] 回调函数，参数为json对象;如果json解析失败，返回错误对象
     * @param  {Function} [opts.onProgress] 回调函数
     * @param  {Function} [opts.onTimeout] 回调函数
     * @param  {Function} [opts.onError] 回调函数
     * @param  {int} [opts.timeout=5000] 超时上限，毫秒数
     */
    this.loadJSON = function(opts){
        if(!opts)return;
        if(!(opts.onLoad instanceof Function))return;

        downloadRequest(opts.type,opts.url,opts.async,function(xhr){
            var json;
            try{
                json = new Function('return '+xhr.responseText)();
            }catch(e){
                json = e;
            }
            opts.onLoad(json);
        },opts.onProgress,opts.onTimeout,opts.onError,opts.timeout,opts.data);
    };

    /**
     * 上传文本
     * @param {Object} opts 参数对象
     * @param  {string} opts.data 上传的文本数据
     * @param  {string} opts.url 请求地址
     * @param  {string} [opts.type=get] 请求类型
     * @param  {boolean} [opts.async=true] 是否异步
     * @param  {Function} [opts.onLoad] 回调函数，参数为文本
     * @param  {Function} [opts.onProgress] 回调函数
     * @param  {Function} [opts.onTimeout] 回调函数
     * @param  {Function} [opts.onError] 回调函数
     * @param  {int} [opts.timeout=5000] 超时上限，毫秒数
     */
    this.uploadText = function(opts){
        if(!opts)return;
        if(!(opts.onLoad instanceof Function))return;

        uploadRequest(opts.type,opts.url,opts.async,function(xhr){
            opts.onLoad(xhr.responseText);
        },opts.onProgress,opts.onTimeout,opts.onError,opts.timeout,opts.data+'');
    };
};
/**
 *  资源加载类<br/>
 *  除脚本支持不同加载方式外，其他资源都是并行加载。
 *  调用者应该注意，在并行请求过多时，可能导致请求失败，需要控制请求并发数
 * @namespace soya2d.Loader
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Loader = new function(){
	/**
	 * 加载图像,如果成功，返回纹理soya2d.Texture
     * @param {Object} cfg 参数
     * @param {Array} cfg.urls 图像路径数组。['1.jpg','2.png','3.gif']
	 * @param {Function} cfg.onLoad 单个图像加载成功事件,可选  回调参数[texture,url]
	 * @param {Function} cfg.onEnd 全部图像加载完成事件,可选 回调参数[texture数组]
     * @param {Function} cfg.onError 单个图像加载错误事件,可选 回调参数[url]
     * @param {Function} cfg.onTimeout 单个图像加载超时事件,可选 回调参数[url]
     * @param {int} cfg.timeout 每个图像加载超时时间,默认5000ms
     * @param {String} cfg.crossOrigin 跨域标识
	 * @see soya2d.Texture
     * @return this
     */
	this.loadTextures = function(cfg){
        var loaded = cfg.urls.length;
        var onLoad = cfg.onLoad;
        var onEnd = cfg.onEnd;
        var onError = cfg.onError;
        var onTimeout = cfg.onTimeout;
        var timeout = cfg.timeout||soya2d.TIMEOUT;
        var crossOrigin = cfg.crossOrigin;
        var rs = new Array(loaded);
        
        for(var i=cfg.urls.length;i--;){
            var img = new Image();
            if(crossOrigin !== undefined)img.crossOrigin = crossOrigin;
            img.i = i;
            img.path = cfg.urls[i];
            img.onload=function(){
                var tex = new soya2d.Texture.fromImage(this);
                rs[this.i] = tex;
                delete this.i;
                if(onLoad && onLoad.call){
                    onLoad(tex,this.path);
                }

                loaded--;
                if(!loaded && onEnd && onEnd.call){
                    onEnd(rs);
                }
                this.onerror = null;
                this.onload = null;
            }
            img.onerror=function(){
                if(onError && onError.call){
                    onError(this.src);
                }
                loaded--;
                if(!loaded && onEnd && onEnd.call){
                    onEnd();
                }
                this.onerror = null;
                this.onload = null;
            }
            img.src = cfg.urls[i];
            if(img.complete){
                img.onload();
            }
        }
        return this;
	}
	
	function loadScript(src,loaded,onLoad,onError,onEnd){
		var script = document.createElement("script");
		script.onload=function(){
            this.onerror = null;
            this.onload = null;
            document.body.removeChild(this);
			if(onLoad && onLoad.call){
                onLoad(this.src);
			}
            loaded--;
            
            if(!loaded){
                if(onEnd && onEnd.call){
		                onEnd();

		            }
                return;
            }
            loadScript(src,loaded,onLoad,onError,onEnd);
		}
		script.onerror=function(){
            this.onerror = null;
            this.onload = null;
            document.body.removeChild(this);
            if(onError && onError.call){
                onError(this.src);
            }
            loaded--;
            if(!loaded){
                if(onEnd && onEnd.call){
		                onEnd();
		            }
                return;
            }
            loadScript(src,loaded,onLoad,onError,onEnd);
		}
        script.src = src.shift();
		document.body.appendChild(script);
	}
	/**
	 * 加载脚本
     * @param {Object} cfg 参数
     * @param {Array} cfg.urls 脚本路径数组。['/lib/a.js','/lib/b.js','/lib/c.js']
     * @param {int} cfg.mode 脚本加载方式，默认为串行加载soya2d.LOADMODE_SEQU
     * @param {Function} cfg.onLoad 单个脚本加载成功事件,可选   回调参数[src]
     * @param {Function} cfg.onEnd 全部脚本加载完成事件,可选
     * @param {Function} cfg.onError 单个脚本加载失败事件,可选
     * @return this
     */
	this.loadScripts = function(cfg){
        var loaded = cfg.urls.length;
        var onLoad = cfg.onLoad;
        var onEnd = cfg.onEnd;
        var onError = cfg.onError;
        var d = document;
        var b = document.body;
        var mode = cfg.mode||soya2d.LOADMODE_SEQU;
        if(mode===soya2d.LOADMODE_SEQU)
		    loadScript(cfg.urls.concat(),loaded,onLoad,onError,onEnd);
        else{
            for(var i=cfg.urls.length;i--;){
                var s = d.createElement("script");//指定src时，类型必须是javascript或者空，无法加载文本资源
                if(!s.async)s.defer = true;
                s.onload = function () {
                    this.onerror = null;
                    this.onload = null;
                    document.body.removeChild(this);
                    if(onLoad && onLoad.call){
                        onLoad(this.src);
                    }
                    loaded--;
                    if(!loaded && onEnd && onEnd.call){
                        onEnd();
                    }
                }
                s.onerror=function(){
                    this.onerror = null;
                    this.onload = null;
                    document.body.removeChild(this);
                    if(onError && onError.call){
                        onError(this.src);
                    }
                    loaded--;
                    if(!loaded && onEnd && onEnd.call){
                        onEnd();
                    }
                }
                s.src = cfg.urls[i];
                b.appendChild(s);
            }
        }
        return this;
	}
	/**
	 * 加载器声音数据
     * @param {Object} cfg 参数
     * @param {Array} cfg.urls 声音路径数组,支持跨平台定义。['a.wav',['b.mp3','b.m4a','b.ogg'],'c.ogg']，子数组内为一个声音的不同格式，引擎会自动加载平台支持的第一个
     * @param {Function} cfg.onLoad 单个声音加载成功事件,可选   回调参数[sound,url]
     * @param {Function} cfg.onEnd 全部声音加载完成事件,可选    回调参数[sound数组]
     * @param {Function} cfg.onError 单个声音加载失败事件,可选 回调参数[url,errorCode]
	 * @see soya2d.MEDIA_ERR_ABORTED
     * @see soya2d.Sound
	 */
	this.loadSounds = function(cfg){
        var loaded = cfg.urls.length;
        var onLoad = cfg.onLoad;
        var onEnd = cfg.onEnd;
        var onError = cfg.onError;
        var d = document;
        var rs = [];
        
        for(var i=cfg.urls.length;i--;){
            var urls = cfg.urls[i];
            var handler = new Howl({
                urls: urls instanceof Array?urls:[urls],
                onload:function(){
                    if(onLoad && onLoad.call){
                        var sound = new soya2d.Sound();
                        sound.__handler = this;
                        rs.push(sound);
                        onLoad(this._src,sound);
                    }
                    loaded--;
                    if(!loaded && onEnd && onEnd.call){
                        onEnd(rs);
                    }
                },
                onloaderror:function(error){
                    if(onError && onError.call){
                        var errorType = soya2d.MEDIA_ERR_DECODE;
                        if(error){
                            errorType = error.type;
                        }
                        onError(this._src,errorType);
                    }
                    loaded--;
                    if(!loaded && onEnd && onEnd.call){
                        onEnd(rs);
                    }
                }
            });
        }
        return this;
	}

    //加载单个字体
    function loadFont(rs,font,onLoad,onTimeout,onEnd,timeout){
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
            span.innerHTML = font.family;
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
                        "font-family: '" + font.family + "';" +
                        "src: url(" + font.url + ")" +
                        "}";
        document.head.appendChild(style);
        for(var i in originSpan){
            originSpan[i].style.fontFamily = font.family+','+originSpan[i].style.fontFamily;
        }
        //监控器启动扫描
        var startTime = new Date().getTime();
        setTimeout(function(){
            fontScan(rs,startTime,timeout,originSpan,originWidth,originHeight,onLoad,onEnd,onTimeout,font.family);
        },100);//100ms用于浏览器识别非法字体，然后还原并使用次等匹配字体
    }
    var fontLoaded=0;//标识字体当前还剩几个没有下载
    //扫描字体是否加载OK
    function fontScan(rs,startTime,timeout,originSpan,originWidth,originHeight,onLoad,onEnd,onTimeout,family){
        setTimeout(function(){
            if(new Date().getTime() - startTime > timeout){
                //超时
                if(onTimeout && onTimeout.call){
                    onTimeout(family);
                }
                fontLoaded--;
                if(!fontLoaded && onEnd && onEnd.call){
                    onEnd();
                }
                return;
            }
            //检查originSpan的宽度是否发生了变化
            for(var i in originSpan){
                originSpan[i].style.left = '-1000px';
                var w = originSpan[i].offsetWidth;
                var h = originSpan[i].offsetHeight;
                if(w !== originWidth[i] || h !== originHeight[i]){//发生了改变
                    //document.body.removeChild(originSpan[i]);
                    var font;
                    if(onLoad && onLoad.call){
                        font = new soya2d.Font().family(family);
                        onLoad(font,family);
                    }
                    rs[fontLoaded--] = font;
                    if(!fontLoaded && onEnd && onEnd.call){
                        onEnd(rs);
                    }
                    return;
                }
            }
            //没有改变，继续扫描
            fontScan(rs,startTime,timeout,originSpan,originWidth,originHeight,onLoad,onEnd,onTimeout,family);
        },20);
    }
    /**
     * 加载外部字体文件
     * @param {Object} cfg 参数
     * @param {Array} cfg.urls 字体描述数组。[{family:'myfont',url:'a/b/c.ttf'},...]
     * @param {Function} cfg.onLoad 单个字体加载成功事件,可选   回调参数 [font对象,family]
     * @param {Function} cfg.onEnd 全部字体加载完成事件,可选    回调参数 [font对象数组]
     * @param {Function} cfg.onTimeout 单个字体加载超时事件,可选 回调参数[family]
     * @param {int} cfg.timeout 每个字体加载超时时间,默认5000ms
     */
    this.loadFonts = function(cfg){
        var loaded = cfg.urls.length;
        var onLoad = cfg.onLoad;
        var onEnd = cfg.onEnd;
        var onTimeout = cfg.onTimeout;
        var timeout = cfg.timeout||soya2d.TIMEOUT;
        var rs = new Array(loaded);

        fontLoaded = loaded;
        //加载字体
        for(var i=cfg.urls.length;i--;){
            loadFont(rs,cfg.urls[i],onLoad,onTimeout,onEnd,timeout);
        }
    }

    /**
     * 加载纹理集
     * @param {Object} cfg 参数
     * @param {Array} cfg.urls 纹理集描述数组。[{ssheet:'a/b/c.ssheet',image:'a/b/c.png'},...]
     * @param {Function} cfg.onLoad 单个纹理集加载成功事件,可选   回调参数 [纹理集对象,纹理对象，精灵表对象]
     * @param {Function} cfg.onEnd 全部纹理集加载完成事件,可选    回调参数 [纹理集对象数组]
     * @param {Function} cfg.onError 单个纹理集加载失败事件,可选  回调参数 [ssheet,image]
     */
    this.loadTexAtlas = function(cfg){
        var loaded = cfg.urls.length;
        var onLoad = cfg.onLoad;
        var onEnd = cfg.onEnd;
        var onError = cfg.onError;

        var imgUrls = [];
        var map = {};
        for(var i=loaded;i--;){
            imgUrls.push(cfg.urls[i].image);
            map[cfg.urls[i].image] = cfg.urls[i].ssheet;
        }
        
        var rs = [];

        //loadTextures
        this.loadTextures({
            urls:imgUrls,
            onLoad:function(tex,url){
                soya2d.AJAXLoader.loadJSON(
                    {
                        url:map[url],
                        onLoad:function(ssheet){
                            var atlas = new soya2d.TextureAtlas(tex,ssheet);
                            if(onLoad){
                                onLoad(atlas,tex,ssheet,url,map[url]);
                            }
                            rs.push(atlas);

                            if(--loaded===0){
                                if(onEnd){
                                    onEnd(rs);
                                }
                            }
                        },
                        onError:function(){
                            loaded--;
                            if(onError){
                                onError(url,map[url]);
                            }
                        }
                    }
                );
            },
            onError:function(url){
                loaded--;
                if(onError){
                    onError(url,map[url]);
                }
            }
        });
    }
};
/**
 * 默认超时时间，5000ms
 */
soya2d.TIMEOUT = 5000;


/**
 * 媒体加载错误类型——MEDIA_ERR_UNCERTAIN<br/>
 * 未知错误
 * @constant
 */
soya2d.MEDIA_ERR_UNCERTAIN = -1;
/**
 * 媒体加载错误类型——MEDIA_ERR_ABORTED<br/>
 * 加载被中断
 * @constant
 */
soya2d.MEDIA_ERR_ABORTED = 1;
/**
 * 媒体加载错误类型——MEDIA_ERR_NETWORK<br/>
 * 网络异常
 * @constant
 */
soya2d.MEDIA_ERR_NETWORK = 2;
/**
 * 媒体加载错误类型——MEDIA_ERR_DECODE<br/>
 * 无法解码
 * @constant
 */
soya2d.MEDIA_ERR_DECODE = 3;
/**
 * 媒体加载错误类型——MEDIA_ERR_SRC_NOT_SUPPORTED<br/>
 * 类型不支持
 * @constant
 */
soya2d.MEDIA_ERR_SRC_NOT_SUPPORTED = 4;
/**
 * 媒体加载错误类型——MEDIA_ERR_SRC_NOT_FORTHCOMING<br/>
 * 无法获取资源数据
 * @constant
 */
soya2d.MEDIA_ERR_SRC_NOT_FORTHCOMING = 101;

/**
 * 加载类型——并行
 * @constant
 */
soya2d.LOADMODE_PARA = 1;
/**
 * 加载类型——串行
 * @constant
 */
soya2d.LOADMODE_SEQU = 2;
/**
 * @classdesc 游戏对象是构建soya2d应用的入口类，用于构建和启动一个soya2d应用。
 * 一个页面可以同时运行多个游戏对象，并且拥有不同的FPS和场景
 * @class 
 * @param {Object} opts 构造参数对象，参数如下：
 * @param {string | HTMLElement} opts.container 游戏渲染的容器，可以是一个选择器字符串或者节点对象
 * @param {int} opts.rendererType 渲染器类型，目前只支持canvas
 * @param {int} opts.w 游戏的宽度
 * @param {int} opts.h 游戏的高度
 * @param {boolean} opts.autoClear 自动清除背景
 * @param {boolean} opts.smoothEnable 是否平滑处理
 * @author {@link http://weibo.com/soya2d MrSoya}
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

	/**
	 * 当前场景
	 * @type {soya2d.Scene}
	 */
	this.scene = null;

	/********** 外部接口 ***********/

	/**
	 * 获取渲染器
	 * @return {Object} 渲染器实例
	 */
	this.getRenderer = function(){
		return renderer;
	};

	/**
	 * 默认视图
	 * @type {soya2d.View}
	 */
	this.view = new soya2d.View(this);

	/**
	 * 纹理管理器
	 * @type {soya2d.TextureManager}
	 */
	this.textureManager = new soya2d.TextureManager();

	/**
	 * 纹理集管理器
	 * @type {soya2d.TextureAtlasManager}
	 */
	this.texAtlasManager = new soya2d.TextureAtlasManager();

	/**
     * 加载资源
     * @param {Object} opts 参数对象
     * @param {Array} opts.textures 需要加载的纹理数组，比如：[url1,url2,...]
     * @param {Array} opts.texAtlas 需要加载的纹理集数组，比如：[{id:'xxx',ssheet:'a/b/c.ssheet',image:'a/b/c.png'},...]
     * @param {Array} opts.sounds 需要加载的声音路径数组,支持跨平台定义。['a.wav',['b.mp3','b.m4a','b.ogg'],'c.ogg']，子数组内为一个声音的不同格式，引擎会自动加载平台支持的第一个
     * @param {Array} opts.fonts 需要加载的字体数组，比如：[{url:xxx,family:xxx},...]
     * @param {Array} opts.scripts 需要加载的脚本数组，比如：[url1,url2,...]
     * @param {String} opts.crossOrigin 跨域加载资源标识，如果设置该标识，则资源按照该标识方式来加载
     * @param {Function} opts.onLoad 回调函数，加载完成、超时、错误时触发
     * @param {Function} opts.onEnd 回调函数，所有资源加载完成时触发
     */
	this.loadRes = function(opts){
		var textures = opts.textures||[];
		var texAtlas = opts.texAtlas||[];
        var fonts = opts.fonts||[];
        var sounds = opts.sounds||[];
        var scripts = opts.scripts||[];
        var onload = opts.onLoad||function(){};
        var onend = opts.onEnd||function(){};
        var crossOrigin = opts.crossOrigin;
        var loader = soya2d.Loader;
                
        //创建加载队列
        var loaders = [];
        if(textures.length>0)loaders.push([loadTextures,textures]);
        if(texAtlas.length>0)loaders.push([loadTexAtlas,texAtlas]);
        if(soya2d.Sound && sounds.length>0)loaders.push([loadSounds,sounds]);
        if(fonts.length>0)loaders.push([loadFonts,fonts]);
        if(scripts.length>0)loaders.push([loadScripts,scripts]);
        
        var llen = loaders.length;
        //开始加载
        if(llen>0)
        loaders[0][0](crossOrigin,loader,loaders[0][1],onload,function(){
            if(llen>1)
            loaders[1][0](crossOrigin,loader,loaders[1][1],onload,function(){
            	if(llen>2)
		            loaders[2][0](crossOrigin,loader,loaders[2][1],onload,function(){
		                if(llen>3)
		                    loaders[3][0](crossOrigin,loader,loaders[3][1],onload,function(){
		                        if(llen>4)
		                            loaders[4][0](crossOrigin,loader,loaders[4][1],onload,onend);
		                        else{onend();}
		                    });
		                    else{onend();}
		            });
		            else{onend();}
            });
            else{onend();}
        });
	};
	/*********** 加载资源 ************/
	function loadTexAtlas(crossOrigin,loader,urls,onload,onEnd){
        "use strict";

        var map = {};
        for(var i=urls.length;i--;){
            map[urls[i].image+'/'+urls[i].ssheet] = urls[i].id;
        }

        loader.loadTexAtlas({
            crossOrigin:crossOrigin,
            urls:urls,
            onLoad:function(atlas,tex,ssheet,texUrl,ssheetUrl){
            	thisGame.textureManager._add(texUrl,tex);
            	var id = map[texUrl+'/'+ssheetUrl];
            	thisGame.texAtlasManager._add(id,atlas);
                onload(atlas,tex,ssheet);
            },
            onError:function(image,ssheet){
                onload(image,ssheet);
            },
            onEnd:function(){
                onEnd();
            }
        });
    }
    function loadScripts(crossOrigin,loader,urls,onload,onEnd){
        "use strict";
        //加载脚本
        loader.loadScripts({
            crossOrigin:crossOrigin,
            urls:urls,
            onLoad:function(src){
                onload(src);
            },
            onError:function(src){
                onload(src);
            },
            onEnd:function(){
                onEnd();
            }
        });
    }
    var thisGame = this;
    function loadSounds(crossOrigin,loader,urls,onload,onEnd){
        "use strict";
        //加载音频
        loader.loadSounds({
            urls:urls,
            onLoad:function(src,sound){
                thisGame.soundManager._add(src,sound);
                onload(src);
            },
            onError:function(src,code){
                onload(src);
            },
            onEnd:function(sounds){
                onEnd(sounds);
            }
        });
    }
    function loadTextures(crossOrigin,loader,urls,onload,onEnd){
        "use strict";
        //加载纹理
        loader.loadTextures({
            crossOrigin:crossOrigin,
            urls:urls,
            onLoad:function(tex,url){
            	thisGame.textureManager._add(url,tex);
                onload();
            },
            onError:function(url){
                onload(url);
            },
            onEnd:function(texs){
                onEnd();
            }
        });
    }
    function loadFonts(crossOrigin,loader,urls,onload,onEnd){
        "use strict";
        loader.loadFonts({
            urls:urls,
            timeout:1000,
            onLoad:function(font,family){
                onload(font,family);
            },
            onTimeout:function(family){
                onload(family);
            },
            onEnd:function(){
                onEnd();
            }
        });
    }

	/**
	 * 当前游戏的宽度
	 * @type {int}
	 * @default 960
	 */
	this.w = renderer.w;

	/**
	 * 当前游戏的高度
	 * @type {int}
	 * @default 480
	 */
	this.h = renderer.h;

	/**
	 * 当前游戏是否正在运行
	 * @type {boolean}
	 * @default false
	 */
	this.running = false;
	/**
	 * 启动当前游戏实例
	 * @param {soya2d.Scene} scene 启动场景
     * @return this
	 */
	this.start = function(scene){
		if(this.running)return;
		this.running = true;
		this.cutTo(scene);

        soya2d.console.log('game starting...');
        if(scene.children.length < 1){
            soya2d.console.warn('empty scene be showing...');
        }

		//scan view
		this.view.scan(this.w,this.h,container,renderer);
		this.view.align(this.view.align());

		//start modules
		var modules = soya2d.module._getAll();
		var beforeUpdates = [],
            onUpdates = [],
            afterUpdates = [],
            beforeRenders = [],
            afterRenders = [];
		for(var k in modules){
			if(modules[k].onStart)modules[k].onStart(this);

            if(modules[k].onBeforeUpdate)beforeUpdates.push(modules[k].onBeforeUpdate);
			if(modules[k].onUpdate)onUpdates.push(modules[k].onUpdate);
            if(modules[k].onAfterUpdate)afterUpdates.push(modules[k].onAfterUpdate);
            if(modules[k].onBeforeRender)beforeRenders.push(modules[k].onBeforeRender);
            if(modules[k].onAfterRender)afterRenders.push(modules[k].onAfterRender);
		}
		
		//start
		threshold = 1000 / currFPS;
		run(function(now,d){

            //before updates
            beforeUpdates.forEach(function(cbk){
                cbk(thisGame,now,d);
            });
			//update modules
            if(onUpdates.length>0){
                now = Date.now();
                onUpdates.forEach(function(cbk){
                    cbk(thisGame,now,d);
                });
            }
            //update entities
            thisGame.scene.__update(thisGame);
            //after updates
            if(afterUpdates.length>0){
                now = Date.now();
                afterUpdates.forEach(function(cbk){
                    cbk(thisGame,now,d);
                });
            }
            

            //before render
            if(beforeRenders.length>0){
                now = Date.now();
                beforeRenders.forEach(function(cbk){
                    cbk(thisGame,now,d);
                });
            }
            //render
            renderer.render(thisGame.scene);
            //after render
            if(afterRenders.length>0){
                now = Date.now();
                afterRenders.forEach(function(cbk){
                    cbk(thisGame,now,d);
                });
            }
		});

		return this;
	};

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
     * 设置该游戏实例的FPS
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

	/**
	 * 跳转场景
	 * @param {soya2d.Scene} scene 需要跳转到的场景
     * @return this
	 */
	this.cutTo = function(scene){
		if(!scene)return;
        var fireModuleCbk = false;
        if(this.scene){
            fireModuleCbk = true;
            //clear old scene
            this.scene.clear();
        }
		this.scene = scene;
		this.scene.game = this;
		//初始化场景
		if(this.scene.onInit && this.scene.onInit.call){
			this.scene.onInit(this);
		}

        if(fireModuleCbk){
            var modules = soya2d.module._getAll();
            for(var k in modules){
                if(modules[k].onSceneChange)modules[k].onSceneChange(this,scene);
            }   
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

    var t1 = 'soya2d Game instance created...';
    var t2 = ms + ' plugins loaded...';
    soya2d.console.log(t1);
    soya2d.console.log(t2);
    
};
var t1 = 'soya2d is working...';
var t2 = '==== thank you for useing soya2d, you\'ll love it! ====';

soya2d.console.log(t1);
soya2d.console.log(t2);



/**
 * 渲染器类型,自动选择。
 * 引擎会根据运行环境自动选择渲染器类型
 */
soya2d.RENDERER_TYPE_AUTO = 1;
/**
 * 渲染器类型,canvas。
 * 引擎会使用canvas 2d方式进行渲染
 */
soya2d.RENDERER_TYPE_CANVAS = 2;
/**
 * 渲染器类型,webgl
 * 引擎会使用webgl方式进行渲染
 */
soya2d.RENDERER_TYPE_WEBGL = 3;
/**
 * @classdesc 资源加载场景合并了资源加载和进度显示功能。
 * 提供了默认的加载进度效果。如果需要自定义加载效果，请重写onStart和onProgress函数
 * @class 
 * @extends soya2d.Scene
 * @param {Object} data 所有父类参数，以及新增参数，如下：
 * @param {soya2d.Scene} data.nextScene 加载完成后需要跳转的场景
 * @param {Array} data.textures 需要加载的纹理数组
 * @param {Array} data.texAtlas 需要加载的纹理集数组
 * @param {Array} data.sounds 需要加载的声音数组
 * @param {Array} data.fonts 需要加载的字体数组
 * @param {function(soya2d.Game,int)} data.onStart 开始加载回调,回调参数[game,length]
 * @param {Function} data.onProgress 加载时回调,回调参数[game,length,index]
 * @param {Function} data.onEnd 加载结束时回调,回调参数[game,length]
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.LoaderScene = function(data){
    data = data||{};
    soya2d.Scene.call(this,data);
    soya2d.ext(this,data);
    
    this.nextScene = data.nextScene;
    if(!(this.nextScene instanceof soya2d.Scene)){
    	console.error('soya2d.LoaderScene: invalid param [nextScene], it must be a instance of soya2d.Scene');
    }
    this.textures = data.textures||[];
    this.texAtlas = data.texAtlas||[];
    this.sounds = data.sounds||[];
    this.scripts = data.scripts||[];
    this.fonts = data.fonts||[];

    var startCbk = data.onStart;
    var progressCbk = data.onProgress;
    var endCbk = data.onEnd;
    
    this.onInit = function(game){
    	//初始化时启动
    	var index = 0;
    	//资源总数
    	var allSize = this.textures.length +this.sounds.length +this.fonts.length;
    
		if(this.onStart)this.onStart(game,allSize);
		if(startCbk instanceof Function)startCbk(game,allSize);
		
		var loader = this;
    	game.loadRes({
			textures: this.textures,
			texAtlas:this.texAtlas,
			sounds: this.sounds,
			fonts: this.fonts,
			scripts: this.scripts,
			onLoad: function() {
				if(loader.onProgress)loader.onProgress(game,allSize,++index);
				if(progressCbk instanceof Function)progressCbk(game,allSize,index);
			},
			onEnd: function() {
				if(loader.onComplete)loader.onComplete(game,allSize);

				if(endCbk instanceof Function)endCbk(game,allSize);

				game.cutTo(loader.nextScene);
			}
		});
    };
    /**
	 * 资源开始加载时调用,默认初始化加载界面，包括soya2d的logo等。
	 * 如果需要修改加载样式，请重写该函数
	 * @abstract
	 * @param  {soya2d.Game} game  游戏实例
	 * @param  {int} length 资源总数
	 */
    this.onStart = function(game,length) {
        var img = new Image();
        var thisScene = this;
        img.onload = function(){
            var tex = soya2d.Texture.fromImage(img);
            thisScene.logo = new soya2d.Sprite({
                x: game.w/2 - tex.w/2,
                y: game.h/2 - tex.h/2 - 20,
                textures:tex
            });
            thisScene.add(thisScene.logo);

            var font = new soya2d.Font('normal 400 23px/normal Arial,Helvetica,sans-serif');
            thisScene.tip = new soya2d.Text({
                x: thisScene.logo.x - 70,
                y: thisScene.logo.y + tex.h + 10,
                font:font,
                text:'Loading... 0/0',
                w:200,
                fillStyle: thisScene.fillStyle || '#fff'
            });
            thisScene.add(thisScene.tip);
        }
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAA8CAYAAACNQSFVAAAFUklEQVR42r3Ye0xbVRwH8DvGQ8Zjo5TxKC8pLW1veY4xQCiyxTE3cIAmZov/INmSbWJ0MmcQZcYRAQFBGMhDGLQ8Op4trxLej4nDifMPY/aX+8dEM7M/pnFbJvf4u5dz66VrS1uKN/kG/uHTw/fcnnPuJQjrr104DpDdECeIC+Q5yJ7S1iC5ckbaol4i/9wO6ghxxqgbxOOtEn9J57S0U70k/weCtovuodGXc3mBbWPizwH8i0bZWIuyFTCoQEJ4Nw6J3+tZJH/noubwXQYwF3WFuEP2VqvCTnfNye4aQ03hpibLFffq+WljyGHVrGzZHGqIbzVZnu+WBUZ2TEn74S5YtwRmcbOTlZu/L6RtXFLXu0Q+shTl4g7GJis21t2nSSsu6l0k/7AW5eLsaPWTVdMnyuual/1iK8rF9aOtaA09BujqdlE9XtYcTJZcC42BO0ADk0XZC2bwjtnoe+pF8ok9UT1eO5ZCtU0foEdM2R2vHlFQ1SNpqH48mVLNRVM7gtP5YlRBNU0mUL2LkZTdcTa1Y6lU+3QcfMgO4GzqJ6Cq+ShqR/CNKNBXugTUsxBpMaqakd0rqgq6YAG+kZrRFNQ2FYfMVdU9J3tY2hxWw+cTcfCljLAYZ1M3noSUc1Gb0N4Fcv3L3vDhuCS3DEBjITKI0GqcrQruKqhKjpq1EWsn3+DlAZYMiYdEQsSQEBvxNFQxnISKu0WPXyvkVTo6EgrAEiF0HSQzaoIItBqv1KaiK2o5uqQM1Oft5oC7R/L2nuVUEgYRWIxXaRWodOAAuqwK2QSzKVQKqPP1frrYY25HrBp5+XAiKuoWGUWNfMjfZ6t96wQSF7FZvFKTikrUpEWoYcoGZb8axekKrvbHmazAXIp7wpBq/kU09UPus9/QsiG6gnCr0fdVQahh4iDSfZ+Npu+8ykSPV2pSoAKZbRUMkUjz7XE9+v/gnw3GU1f7Y2zq9+PeMNS1kM70awgz+DutgjFr0cvQb6PuEJpcyzaK6nHhQdeg/CrfDws7BA8sgSuG5Uh764RZVI/D5QXxk6c6R52r9VVe6hQ8NVqBWoh6Fg+brMAU7gnhM2sBrAlppzyyChr9Vv6rIBhWwESoIMdilIu7s6OHBOPlMvKVAt7F8gHZw5HVTKtRLk4fkfdB9jOLDSw6p87zs74ek3yjXoqEW0wBVeRsG/c5muMlb9KIO9SL8qfcnebGcgwa/e4lq/pm8IwMT55YTPAbBsRFPQvkA3Mb78DNeDRx+4TlOOzUE1s92xhmeCUZJvjk1ritJ9sbS1FodDWdMlcVsd1jc//NOGridobRDyHsdSYfXDlETa5lUTuCb9xVckpzK5WaupNN2R1n07ccTcGtu74j+HWd5MdzHwS8ble8a1b220c1IUXwhZRDRHbB4cv3qKJD2CIId0zC8MZxbns4STUMiCbTMz2PAxYFkULCGZgg/G3G23XSn/Iv+r4JSAwebQQ+xgXhFdbbalw5I71fXBtc4uTEnAvpE60EH9/o0Qbg1ZVewj0sxqHXx5VKYZswwvEFTgUiSCheqn2Z0cLjPd4jXC3ASQqW4amj2V6Z8AfR+IhMT9jznAr4eNn2wI/6LsyLCnP49UnJz2cK/c8Y9CrEO5Y/vQdAeHirdMOvUpzxy4rdRvHuWdn9T66FXoFeWVTCuQsEuFfepgrY0W68t3Fg3uNwcXi2eVLfF94ii3ZNwId4FjXs9dkKNkbrwHnrRABOb2kkBRVMnL7go8BYOP73WdRYr5srMITpq1krKihvD83GgABPUiD+3Q/36mWyV2Mo5/LAI/LG0H78k49R872aQOnrX0x6RNKVlPmnAAAAAElFTkSuQmCC';
        
    };
	/**
	 * 资源加载时调用,默认显示loading...字符。如果需要修改加载样式，请重写该函数
	 * @abstract
	 * @param  {soya2d.Game} game  游戏实例
	 * @param  {int} length 资源总数
	 * @param  {int} index  当前加载索引
	 */
	this.onProgress = function(game,length,index) {
		if(this.tip)
		this.tip.setText('Loading... '+index+'/'+length);
	};
};
soya2d.inherits(soya2d.LoaderScene,soya2d.Scene);