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
 * 控制台输出接口，使用彩色方式
 */
soya2d.console = new function(){
    this.log = function(txt,css){
        if(soya2d.Device.ie){
            console.log(txt);
        }else{
            console.log('%c'+txt,css||'padding:1px 50px;font-size:14px;color:#fff;background:#2DB008;');
        }
    }
    this.debug = function(txt,css){
        if(soya2d.Device.ie){
            console.debug(txt);
        }else{
            console.debug('%c'+txt,css||'padding:1px 50px;font-size:14px;color:#fff;background:#0069D6;');
        }
    }
    this.error = function(txt,css){
        if(soya2d.Device.ie){
            console.error(txt);
        }else{
            console.error('%c'+txt,css||'padding:1px 50px;font-size:14px;color:#fff;background:#ff0000;');
        }
    }
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
     * @return {Array} [topLeftX,topLeftY,
     *                  topRightX,topRightY,
     *                  bottomRightX,bottomRightY,
     *                  bottomLeftX,bottomLeftY
     *                  ]
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

        this.onUpdate();
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
    onUpdate:function(){
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
    	return;
    }
    
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
    onUpdate:function(){
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
    onUpdate:function(game){
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
                urls: urls,
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
     */
    this.setFPS = function(fps){
        currFPS = parseInt(fps) || maxFPS;
        currFPS = currFPS>maxFPS?maxFPS:currFPS;
        threshold = 1000 / currFPS;
    };
	/**
	 * 停止当前游戏实例
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
	 */
	this.cutTo = function(scene){
		if(!scene)return;
        var fireModuleCbk = false;
        if(this.scene)fireModuleCbk = true;
		this.scene = scene;
		this.scene.game = this;
		//初始化场景
		if(this.scene.onInit && this.scene.onInit.call){
			this.scene.onInit(this);
		}

        var modules = soya2d.module._getAll();
        for(var k in modules){
            if(modules[k].onSceneChange)modules[k].onSceneChange(this,scene);
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
/**
     * @classdesc 补间类，用于创建动画<br/>
     * 该类提供了在周期时间内，按照指定补间类型进行“补间目标”属性的计算，并提供反馈的过程<br/>
     * 补间目标可以是一个可渲染对象，比如sprite，也可以是它的matrix属性，比如
     * @example
     var ken = new soya2d.Sprite({
    onRender:function(g){
        g.fillText("Hi~~,i'm ken");
    }
});
         var tween1 = new soya2d.Tween(ken,
         {opacity:1,scaleX:1},
         1000,
         {easing:soya2d.Tween.Expo.Out,cacheable:true,
         onUpdate:function(target,ratio){
             target.sclaeY = ratio;
         }
});
         var tween2 = new soya2d.Tween(ken.matrix,
         {m13:100,m23:200},
         1000,
         {easing:soya2d.Tween.Expo.Out,cacheable:false
});
     * @param {Object} target 需要进行对象
     * @param {Object} attris 补间目标属性
     * @param {int} duration 补间周期(ms)
     * @param {Object} opts 补间属性
     * @param {Object} opts.easing 补间类型，包括线性和非线性,默认Pea.Tween.Linear
     * @param {Object} opts.cacheable 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
     * @param {int} opts.iteration 循环播放次数，-1为无限。默认0
     * @param {Object} opts.alternate 是否交替反向播放动画，只在循环启用时生效，默认false
     * @param {Object} opts.onUpdate 补间更新事件
     * @param {Object} opts.onEnd 补间结束事件
     * @class
     * @see {soya2d.Tween.Linear}
     * @author {@link http://weibo.com/soya2d MrSoya}
     */
soya2d.Tween = function(target,attris,duration,opts){

    //用来保存每个属性的，变化值，补间值
    this.__attr = {};
    this.__attr_inverse = {};
    this.__attriNames;
    this.attris = attris;
    this.target = target;
    this.duration = duration;

    opts = opts||{};
    this.easing = opts.easing||soya2d.Tween.Linear;
    this.iteration = opts.iteration||0;
    this.alternate = opts.alternate||false;

    /**
     * @name soya2d.Tween#onUpdate
     * @desc  补间每运行一次时触发，this指向补间器
     * @param {Object} target 补间目标，可能为null
     * @param {Number} ratio 补间系数。当补间器运行时，会回传0-1之间的补间系数，
     * 系数个数为补间帧数，系数值根据补间类型不同而不同。根据这个系数，可以实现多目标同时补间的效果，比如：
     * @example
     var tween1 = new soya2d.Tween(ken,
             {opacity:1,scaleX:1},
             1000,
             {easing:soya2d.Tween.Expo.Out,cacheable:true,
             onUpdate:function(target,ratio){
                 target.sclaeY = ratio;
             }
    });
     * @event
     */
    this.onUpdate = opts.onUpdate;
    /**
     * @name soya2d.Tween#onEnd
     * @desc  补间运行完触发，this指向补间器
     * @param {Object} target 补间目标
     * @event
     */
    this.onEnd = opts.onEnd;
    this.cacheable = opts.cacheable||false;

    this.__loops = 0;//已经循环的次数
};

soya2d.Tween.prototype = {
    __calc:function(un){
        var keys = this.__attriNames = Object.getOwnPropertyNames(this.attris);
        //初始化指定属性的step
        for(var i=keys.length;i--;){//遍历引擎clone的对象，不包括引擎属性
            var key = keys[i];

            //没有该属性直接跳过
            var tKey = this.target[key];
            if(tKey===un)continue;

            var initVal = parseFloat(tKey||0);//修复初始值为字符的问题，会导致字符和数字相加，数值变大--2014.9.16
            var endVal = this.attris[key];
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
            this.__attr[key] = {'initVal':initVal,'varVal':varVal,'endVal':endVal};
            //inverse
            var varVal_inverse = (initVal-endVal);
            this.__attr_inverse[key] = {'initVal':endVal,'varVal':varVal_inverse,'endVal':initVal};


            //预计算。精度为10MS
            if(this.cacheable){
                this.__ratio = {};//用于传递给onupdate
                this.__ratio_inverse = {};

                var dVal = this.__attr[key].dVal = {};
                var dVal_inverse = this.__attr_inverse[key].dVal = {};
                for(var j=0;(j+=10)<this.duration;){
                    var r = this.easing(j,0,1,this.duration);
                    this.__ratio['p_'+j] = r;
                    dVal['p_'+j] = initVal + varVal*r;
                    //inverse
                    r = this.easing(j,0,1,this.duration);
                    this.__ratio_inverse['p_'+j] = r;
                    dVal_inverse['p_'+j] = endVal + varVal_inverse*r;
                }
            }

        }
    },
    /**
     * 启动补间器<br/>
     * 如果在当前tween还未执行完时再次启动当前tween无效
     */
    start:function(){
        this.__calc();
        this.__startTime = Date.now();

        if(this.target.__tween instanceof soya2d.Tween){
            this.target.__tween.stop();
        }

        this.target.__tween = this;

        soya2d.TweenManager.add(this);
        return this;
    },
    /**
     * 延迟启动补间器
     * @param {int} delay 延迟毫秒数
     */
    delay:function(delay){
        var THAT = this;
        setTimeout(function(){THAT.start()},delay);
        return this;
    },
    /**
     * 停止补间器
     */
    stop:function(){
        soya2d.TweenManager.remove(this);
        return this;
    },
    /**
     * 调转到指定间隔
     */
    goTo:function(target,time,un){
        var ratio,attNames=this.__attriNames,attr=this.__attr,t=target;
        //预计算
        if(this.cacheable){
            var phase = 'p_'+(time/10>>0)*10;
            ratio = this.__ratio[phase];
            if(phase==='p_0')ratio=0;
            if(ratio===un)ratio = 1;
            //更新参数
            for(var i=attNames.length;i--;){
                var k = attNames[i];
                if(!attr[k])continue;
                var v = attr[k].dVal[phase];
                if(v===un)v = attr[k].endVal;
                t[k] = v;
            }
        }else{
            ratio = this.easing(time,0,1,this.duration);
            if(time>this.duration)ratio=1;
            //更新参数
            for(var i=attNames.length;i--;){
                var k = attNames[i];
                if(attr[k])
                t[k] = attr[k].initVal + attr[k].varVal*ratio;
            }
        }
        return ratio;
    },
    /**
     * 更新补间实例
     */
    update:function(now){
        var c = now - this.__startTime;
        var t=this.target;
        var ratio = this.goTo(t,c);

        //判断结束
        if(c>=this.duration){
            if(this.onEnd)this.onEnd(t);
            //是否循环
			if(this.iteration===-1 ||
                (this.iteration>0 && this.__loops++ < this.iteration)){
                //重新计算
                this.__startTime = Date.now();
                if(this.alternate){
                    //替换属性
                    var tmp = this.__attr;
                    this.__attr = this.__attr_inverse;
                    this.__attr_inverse = tmp;
                    //替换缓存
                    tmp = this.__ratio;
                    this.__ratio = this.__ratio_inverse;
                    this.__ratio_inverse = tmp;
                }
                return;
            }
            //销毁
            this.destroy();
            soya2d.TweenManager.remove(this);
            return;
        }
        //调用更新[target,ratio]
        if(this.onUpdate)this.onUpdate(t,ratio);
    },
    /**
     * 销毁补间实例，释放内存
     */
    destroy:function(){
        this.__attr = null;
        this.__ratio = null;
        this.attris = null;
        this.easing = null;
        this.target = null;
        this.onUpdate = null;
        this.onEnd = null;
    }
};

/********* 扩展 **********/
soya2d.ext(soya2d.DisplayObject.prototype,/** @lends soya2d.DisplayObject.prototype */{
    /**
    * 播放补间动画
    * @param {Object} attris 补间目标属性
    * @param {int} duration 补间周期(ms)
    * @param {Object} opts 补间属性
    * @param {Function} opts.easing 补间类型，包括线性和非线性,默认Pea.Tween.Linear
    * @param {boolean} opts.cacheable 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
    * @param {int} opts.iteration 循环播放次数，-1为无限。默认0
    * @param {boolean} opts.alternate 是否交替反向播放动画，只在循环启用时生效，默认false
    * @param {Function} opts.onUpdate 补间更新事件
    * @param {Function} opts.onEnd 补间结束事件
    * @see {soya2d.Tween.Linear}
    * @return {soya2d.Tween} 补间实例
    */
	animate:function(attris,duration,opts){
        var tween = new soya2d.Tween(this,attris,duration,opts).start();
		return tween;
	},
    /**
     * 停止当前对象正在执行的补间动画
     * @return {soya2d.DisplayObject} 
     */
    stopAnimation:function(){
        if(this.__tween){
            this.__tween.stop();
            delete this.__tween;
        }
        return this;
    },
	/**
	 * 播放基于补间模版的动画。
	 * @param {Object} tweenTpl 补间模版数据。主要来自Soya Studio
     * @param {Function} onUpdate 补间更新事件
     * @param {Function} onEnd 补间结束事件
	 * @return {soya2d.Tween} 补间实例
	 */
	playTween:function(tweenTpl,onUpdate,onEnd){
		if(!tweenTpl.tweenTpl)return;
		
		//解析easing
		var easingPair = tweenTpl.easing.split('-');
		var easing = tweenTpl.easing==='Linear'?soya2d.Tween.Linear:soya2d.Tween[easingPair[0]][easingPair[1]];
		//解析属性
		var obj = {};
		for(var i in tweenTpl.attr){
			obj[i] = tweenTpl.attr[i].symbol + tweenTpl.attr[i].value;
		}
		
		return new soya2d.Tween(this,obj,tweenTpl.duration,{
			easing:easing,
			iteration:tweenTpl.isRepeat?-1:0,
			alternate:tweenTpl.alternate,
            onUpdate:onUpdate,
            onEnd:onEnd
		}).start();
	}
});
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
	this.update = function(now){
		for(var i=ins.length;i--;){
			ins[i].update(now);
		}
	};
}
/*
 * t:第几帧
 * b:初始值
 * c:变化量(end - ini)
 * d:总帧数
 */

/**
 * 补间算法类型——Linear
 * 算法来自：http://www.robertpenner.com/easing/
 * @constant
 */
soya2d.Tween.Linear = function(t,b,c,d){ return c*t/d + b; }
/**
 * 补间算法类型——Quad
 * 算法来自：http://www.robertpenner.com/easing/
 * @constant
 */
soya2d.Tween.Quad = {
	In: function(t,b,c,d){
		return c*(t/=d)*t + b;
	},
	Out: function(t,b,c,d){
		return -c *(t/=d)*(t-2) + b;
	},
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	}
}
/**
 * 补间算法类型——Cubic
 * 算法来自：http://www.robertpenner.com/easing/
 * @constant
 */
soya2d.Tween.Cubic = {
	In: function(t,b,c,d){
		return c*(t/=d)*t*t + b;
	},
	Out: function(t,b,c,d){
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}
}
/**
 * 补间算法类型——Quart
 * 算法来自：http://www.robertpenner.com/easing/
 * @constant
 */
soya2d.Tween.Quart = {
	In: function(t,b,c,d){
		return c*(t/=d)*t*t*t + b;
	},
	Out: function(t,b,c,d){
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	}
}
/**
 * 补间算法类型——Quint
 * 算法来自：http://www.robertpenner.com/easing/
 * @constant
 */
soya2d.Tween.Quint = {
	In: function(t,b,c,d){
		return c*(t/=d)*t*t*t*t + b;
	},
	Out: function(t,b,c,d){
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	}
}
/**
 * 补间算法类型——Sine
 * 算法来自：http://www.robertpenner.com/easing/
 * @constant
 */
soya2d.Tween.Sine = {
	In: function(t,b,c,d){
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	Out: function(t,b,c,d){
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	InOut: function(t,b,c,d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}
}
/**
 * 补间算法类型——Expo
 * 算法来自：http://www.robertpenner.com/easing/
 * @constant
 */
soya2d.Tween.Expo = {
	In: function(t,b,c,d){
		return (t===0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	Out: function(t,b,c,d){
		return (t===d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
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
 * @constant
 */
soya2d.Tween.Circ = {
	In: function(t,b,c,d){
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	Out: function(t,b,c,d){
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	}
}
/**
 * 补间算法类型——Elastic
 * 算法来自：http://www.robertpenner.com/easing/
 * @constant
 */
soya2d.Tween.Elastic = {
	In: function(t,b,c,d,a,p){
		if (t===0) return b;  if ((t/=d)===1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	Out: function(t,b,c,d,a,p){
		if (t===0) return b;  if ((t/=d)===1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
	},
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
 * @constant
 */
soya2d.Tween.Back = {
	In: function(t,b,c,d,s){
		if (s === undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	Out: function(t,b,c,d,s){
		if (s === undefined) s = .70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	InOut: function(t,b,c,d,s){
		if (s === undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}
}
/**
 * 补间算法类型——Bounce
 * 算法来自：http://www.robertpenner.com/easing/
 * @constant
 */
soya2d.Tween.Bounce = {
	In: function(t,b,c,d){
		return c - soya2d.Tween.Bounce.Out(d-t, 0, c, d) + b;
	},
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
	InOut: function(t,b,c,d){
		if (t < d/2) return soya2d.Tween.Bounce.In(t*2, 0, c, d) * .5 + b;
		else return soya2d.Tween.Bounce.Out(t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
}

soya2d.module.install('tween',{
    onUpdate:function(game,now,d){
    	soya2d.TweenManager.update(now);
    },
    onStop:function(){
    	soya2d.TweenManager.stop();
    }
});
/**
 * @classdesc 可以进行弧形填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {String} data.startAngle 弧形的开始角度
 * @param {String} data.endAngle 弧形的结束角度
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Arc = function(data){
	data = data||{};
	soya2d.DisplayObjectContainer.call(this,data);
	soya2d.ext(this,data);

    this.fillStyle = data.fillStyle || 'transparent';
};
soya2d.inherits(soya2d.Arc,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.Arc.prototype,{
    onRender:function(g){
        g.beginPath();

        g.fillStyle(this.fillStyle);
        var sr = (this.startAngle||0)*soya2d.Math.ONERAD,
            er = (this.endAngle||0)*soya2d.Math.ONERAD;
        g.arc(this.w/2,this.h/2,this.w/2,sr,er);
        
        if(er-sr != 0 && Math.abs(this.startAngle||0 - this.endAngle||0) != 360){
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

/**
 * @classdesc 可以进行椭圆填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Ellipse = function(data){
	data = data||{};
	soya2d.DisplayObjectContainer.call(this,data);
	soya2d.ext(this,data);

    this.fillStyle = data.fillStyle || 'transparent';
};
soya2d.inherits(soya2d.Ellipse,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.Ellipse.prototype,{
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
 * @classdesc 可以进行多边形填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {Array} data.vtx 一维顶点数组 [x1,y1, x2,y2, ...]
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Poly = function(data){
	data = data||{};
	soya2d.DisplayObjectContainer.call(this,data);
	soya2d.ext(this,data);

    this.bounds = new soya2d.Polygon(data.vtx);
    this.fillStyle = data.fillStyle || 'transparent';
};
soya2d.inherits(soya2d.Poly,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.Poly.prototype,{
    onRender:function(g){
        g.beginPath();
        g.fillStyle(this.fillStyle);
        g.polygon(this.vtx);
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
 * @classdesc 可以进行矩形填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Rect = function(data){
    data = data||{};
    soya2d.DisplayObjectContainer.call(this,data);
    soya2d.ext(this,data);

    this.fillStyle = data.fillStyle || 'transparent';
};
soya2d.inherits(soya2d.Rect,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.Rect.prototype,{
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
 * @classdesc 可以进行规则多边形填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {int} data.edgeCount 多边形的边数，不能小于3
 * @param {Number} data.r1 半径1
 * @param {Number} data.r2 半径2
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.RPoly = function(data){
	data = data||{};
	soya2d.DisplayObjectContainer.call(this,data);
	soya2d.ext(this,data);

    this.fillStyle = data.fillStyle || 'transparent';
};
soya2d.inherits(soya2d.RPoly,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.RPoly.prototype,{
    onRender:function(g){
        g.beginPath();
        g.fillStyle(this.fillStyle);
        g.regularPolygon(this.w/2,this.h/2,this.edgeCount,this.r1,this.r2);
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
 * @classdesc 可以进行圆角矩形填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {number} data.lineWidth 线条宽度
 * @param {number} data.r 圆角半径
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.RRect = function(data){
	data = data||{};
	soya2d.DisplayObjectContainer.call(this,data);
	soya2d.ext(this,data);

    this.fillStyle = data.fillStyle || 'transparent';
};
soya2d.inherits(soya2d.RRect,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.RRect.prototype,{
    onRender:function(g){
        g.beginPath();
        g.fillStyle(this.fillStyle);
        g.roundRect(0,0,this.w,this.h,this.r);
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
 * @classdesc 事件处理器基类,所有具体的事件处理类都需要继承此类
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.EventHandler = function(){
    this.__eventMap = {};
    /**
     * 增加监听器
     * @param {string}   ev       事件类型
     * @param {Function} callback 回调函数
     * @param {Object}   context  事件源，触发上下文
     * @param {int}   order    触发顺序
     */
    this.addListener = function(ev,callback,context,order){
        if(!this.__eventMap[ev])this.__eventMap[ev]=[];
        this.__eventMap[ev].push({fn:callback,order:order||0,context:context});
    }
    /**
     * 删除监听器
     * @param  {string}   ev       事件类型
     * @param  {Function} callback 回调函数
     * @param  {Object}   context  事件源，触发上下文
     * @param  {int}   order    触发顺序
     */
    this.removeListener = function(ev,callback,context){
        if(!this.__eventMap[ev])return;
        if(callback){
            var index = -1;
            for(var i=this.__eventMap[ev].length;i--;){
                if(this.__eventMap[ev].fn == callback && context == this.__eventMap[ev].context){
                    index = i;
                    break;
                }
            }
            if(index > -1)this.__eventMap[ev].splice(index,1);
        }else{
            this.__eventMap[ev] = null;
            delete this.__eventMap[ev];
        }
    }
}
/**
 * @classdesc 事件组用于管理一个soya2d.Game实例内的所有事件的启动，停止，和触法。<br/>
 * 该类无需开发者显式创建，引擎会自动管理
 * @class
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Events = function(){
    
    var evts = [];
    /**
     * 注册一个事件处理器，以及能处理的事件类型,用于扩展事件处理模块
     * @param  {Array} events  事件数组
     * @param  {Object} handler 事件处理器
     */
    this.register = function(events,handler){
        evts.push([events,handler]);
    }

    //扫描是否有事件需要触发
    this.scan = function(){
        for(var i=evts.length;i--;){
            evts[i][1].scan();
        }
    }

    /**
     * 启动所有事件监听
     * @param {soya2d.Game} game 游戏实例
     * @return this
     */
    this.startListen = function(game){
        for(var i=evts.length;i--;){
            evts[i][1].startListen(game);
        }

        return this;
    }

    /**
     * 停止所有事件监听
     * @param {soya2d.Game} game 游戏实例
     * @return this
     */
    this.stopListen = function(game){
        for(var i=evts.length;i--;){
            evts[i][1].stopListen(game);
        }

        return this;
    }
    /**
     * 增加事件监听
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数
     * @param {Object} context 回调函数的上下文，通常会是事件触发的主体
     * @param {int} order 触发顺序，值越大越先触发
     */
    this.addListener = function(events,callback,context,order){
    	var evs = events.split(' ');
        for(var i=evs.length;i--;){
            var ev = evs[i];

            for(var j=evts.length;j--;){
                if(evts[j][0].indexOf(ev)>-1){
                    evts[j][1].addListener(ev,callback,context,order);
                    break;
                }
            }
        }
    }
    /**
     * 删除事件监听
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数，可选。如果该参数为空。则删除指定类型下所有监听
     */
    this.removeListener = function(events,callback,context){
    	var evs = events.split(' ');
        for(var i=evs.length;i--;){
            var ev = evs[i];

            for(var j=evts.length;j--;){
                if(evts[j][0].indexOf(ev)>-1){
                    evts[j][1].removeListener(ev,callback,context);
                    break;
                }
            }
        }
    }
}
/**
 * @classdesc 键盘事件处理类,提供如下事件:<br/>
 * <ul>
 *     <li>keyup</li>
 *     <li>keydown</li>
 *     <li>keypress</li>
 * </ul>
 * 所有事件的唯一回调参数为键盘事件对象KeyboardEvent
 * @class 
 * @extends soya2d.EventHandler
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Keyboard = function(){

	var keys = [];//当前按下的所有按键，keycode

	var downEvent = {};
	var upEvent = {};
	var fireDown = false;
	var fireUp = false;
	var firePress = false;

	function setEvent(event,e){
		event.keyCode = e.keyCode||e.which;
		event.ctrlKey = e.ctrlKey;
		event.shiftKey = e.shiftKey;
		event.altKey = e.altKey;
		event.metaKey = e.metaKey;
		event.keyCodes = keys;
		event.e = e;
	}

	var keyboard = this;
	function keydown(e){
		var keycode = e.keyCode||e.which;
		if(keys.indexOf(keycode)<0){
			keys.push(keycode);
		}

		fireDown = true;
		setEvent(downEvent,e);
		firePress = true;

		stopCheck(e,keycode);
	}
	function keyup(e){
		var keycode = e.keyCode||e.which;
		var i = keys.indexOf(keycode);
		if(i>-1){
			fireDown = false;
			keys.splice(i,1);
		}

		fireUp = true;
		setEvent(upEvent,e);

		//没有按键
		if(keys.length<1){
			firePress = false;
		}

		stopCheck(e,keycode);
	}

	function stopCheck(e,keycode) {
		var pks = soya2d.Keyboard.preventKeys;
		if(pks.indexOf(keycode) > -1){
			if (e.preventDefault) { 
				e.preventDefault(); 
			} else { 
				e.returnValue = false; 
			}
		}
		var sks = soya2d.Keyboard.stopKeys;
		if(sks.indexOf(keycode) > -1){
			if (e.stopPropagation) {
				e.stopPropagation(); 
			} else { 
				e.cancelBubble = true; 
			}
		}
	}

	/**
	 * 扫描是否需要执行键盘事件，如果需要，执行
	 * @return this
	 */
	this.scan = function(){
		var events,ev;
		if(fireDown){
			events = this.__eventMap['keydown'];
			ev = downEvent;
			fireEvent(events,ev);
		}
		if(firePress){
			events = this.__eventMap['keypress'];
			ev = downEvent;
			fireEvent(events,ev);
		}
		if(fireUp){
			events = this.__eventMap['keyup'];
			ev = upEvent;
			fireEvent(events,ev);

			fireUp = false;
		}
	}

	function fireEvent(events,ev){
		if(!events)return;

		//排序
        events.sort(function(a,b){
            return a.order - b.order;
        });

        for(var i=events.length;i--;){
            events[i].fn.call(events[i].context,ev);
        }
	}

	/**
	 * 启动监听
	 * @return this
	 */
	this.startListen = function(){
		self.addEventListener('keydown',keydown,false);
		self.addEventListener('keyup',keyup,false);

		return this;
	}

	/**
	 * 停止监听
	 * @return this
	 */
	this.stopListen = function(){
		self.removeEventListener('keydown',keydown,false);
		self.removeEventListener('keyup',keyup,false);

		return this;
	}

	soya2d.EventHandler.call(this);
};
soya2d.inherits(soya2d.Keyboard,soya2d.EventHandler);

/**
 * 阻止按键默认行为的按键码数组，当键盘事件发生时，会检测该数组，
 * 如果数组包含当前按键码，就会阻止默认行为
 * @type {Array}
 * @default [ ]
 */
soya2d.Keyboard.preventKeys = [];
/**
 * 阻止事件传播的按键码数组，当键盘事件发生时，会检测该数组，
 * 如果数组包含当前按键码，就会阻止事件继续传播
 * @type {Array}
 * @default [ ]
 */
soya2d.Keyboard.stopKeys = [];

/**
 * 键盘事件对象，包含按键相关属性
 * @typedef {Object} KeyboardEvent
 * @property {int} keyCode - 键码值，用来和KeyCode类中的键码值进行比较
 * @property {boolean} ctrlKey - 是否按下了ctrl键
 * @property {boolean} shiftKey - 是否按下了shift键
 * @property {boolean} altKey - 是否按下了shift键
 * @property {boolean} metaKey - 是否按下了shift键
 * @property {boolean} keyCodes - 键码值数组，包含当前按下的所有按键
 * @property {Object} e - HTML事件对象
 */
/**
 * 键码表<br/>
 * @namespace soya2d.KeyCode
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.KeyCode = {
	/**
     * DELETE键码
     * @constant
     */
	DELETE:46,
    /**
     * BACKSPACE键码
     * @constant
     */
    BACKSPACE:8,
    /**
     * TAB键码
     * @constant
     */
    TAB:9,
    /**
     * ENTER键码
     * @constant
     */
    ENTER:13,
    /**
     * SHIFT键码。左右相同
     * @constant
     */
    SHIFT:16,
    /**
     * CONTROL键码。左右相同
     * @constant
     */
    CONTROL:17,
    /**
     * ALT键码。左右相同
     * @constant
     */
    ALT:18,
    /**
     * ESC键码
     * @constant
     */
    ESC:27,
    /**
     * 方向键左键码
     * @constant
     */
    SPACE:32,
    /**
     * ENTER键码
     * @constant
     */
    LEFT:37,
    /**
     * 方向键上键码
     * @constant
     */
    UP:38,
    /**
     * 方向键右键码
     * @constant
     */
    RIGHT:39,
    /**
     * 方向键下键码
     * @constant
     */
    DOWN:40,
    /**
     * @constant
     */
    A:65,
    /**
     * @constant
     */
    B:66,
    /**
     * @constant
     */
    C:67,
    /**
     * @constant
     */
    D:68,
    /**
     * @constant
     */
    E:69,
    /**
     * @constant
     */
    F:70,
    /**
     * @constant
     */
    G:71,
    /**
     * @constant
     */
    H:72,
    /**
     * @constant
     */
    I:73,
    /**
     * @constant
     */
    J:74,
    /**
     * @constant
     */
    K:75,
    /**
     * @constant
     */
    L:76,
    /**
     * @constant
     */
    M:77,
    /**
     * @constant
     */
    N:78,
    /**
     * @constant
     */
    O:79,
    /**
     * @constant
     */
    P:80,
    /**
     * @constant
     */
    Q:81,
    /**
     * @constant
     */
    R:82,
    /**
     * @constant
     */
    S:83,
    /**
     * @constant
     */
    T:84,
    /**
     * @constant
     */
    U:85,
    /**
     * @constant
     */
    V:86,
    /**
     * @constant
     */
    W:87,
    /**
     * @constant
     */
    X:88,
    /**
     * @constant
     */
    Y:89,
    /**
     * @constant
     */
    Z:90,
    /**
     * @constant
     */
    a:97,
    /**
     * @constant
     */
    b:98,
    /**
     * @constant
     */
    c:99,
    /**
     * @constant
     */
    d:100,
    /**
     * @constant
     */
    e:101,
    /**
     * @constant
     */
    f:102,
    /**
     * @constant
     */
    g:103,
    /**
     * @constant
     */
    h:104,
    /**
     * @constant
     */
    i:105,
    /**
     * @constant
     */
    j:106,
    /**
     * @constant
     */
    k:107,
    /**
     * @constant
     */
    l:108,
    /**
     * @constant
     */
    m:109,
    /**
     * @constant
     */
    n:110,
    /**
     * @constant
     */
    o:111,
    /**
     * @constant
     */
    p:112,
    /**
     * @constant
     */
    q:113,
    /**
     * @constant
     */
    r:114,
    /**
     * @constant
     */
    s:115,
    /**
     * @constant
     */
    t:116,
    /**
     * @constant
     */
    u:117,
    /**
     * @constant
     */
    v:118,
    /**
     * @constant
     */
    w:119,
    /**
     * @constant
     */
    x:120,
    /**
     * @constant
     */
    y:121,
    /**
     * @constant
     */
    z:122,
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
    F12:123
};
/**
 * @classdesc 移动设备事件处理类,提供如下事件:<br/>
 * <ul>
 *     <li>tilt</li>
 *     <li>motion</li>
 *     <li>hov</li>
 * </ul>
 * 所有事件的唯一回调参数为设备事件对象MobileEvent
 * @class 
 * @extends soya2d.EventHandler
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Mobile = function(){

    var fireMap = {
        tilt:{},
        motion:{},
        hov:{}
    };

    var mobile = this;

    function setEvent(event,e){
        if(e.orientation)
        mobile.orientation = fireMap[event].orientation = e.orientation;
        if(e.alpha)
        mobile.tilt = fireMap[event].tilt = {
        	z: e.alpha,
			x: e.beta,
			y: e.gamma,
			absolute: e.absolute
        };
        if(e.acceleration){
            mobile.motion = fireMap[event].motion = {
                x: e.acceleration.x,
                y: e.acceleration.y,
                z: e.acceleration.z,
                interval: e.interval
            };
        }
        
        fireMap[event].e = e;
        fireMap[event].type = event;
        fireMap[event].fire = true;
    }

    /******************* handler *******************/
    function tilt(e){
        setEvent('tilt',e);
    }
    function motion(e){
        setEvent('motion',e);
    }
    var timer;
    function hov(e){
    	clearTimeout(timer);
        timer = setTimeout(function(){//for view
            e.orientation = getOrientation();
            setEvent('hov',e);
        },510);
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



    /******************* interface *******************/

    /**
     * 扫描是否需要执行键盘事件，如果需要，执行
     * @return this
     */
    this.scan = function(){
        for(var key in fireMap){
            var event = fireMap[key];
            if(!event)continue;
            if(event.fire){
                var events = this.__eventMap[key];
                fireEvent(events,event);
            }
        }

        reset();
    }

    function reset(){
        for(var key in fireMap){
            var event = fireMap[key];
            if(!event)continue;
            event.fire = false;
        }
    }

    function fireEvent(events,ev){
        if(!events)return;

        //排序
        events.sort(function(a,b){
            return a.order - b.order;
        });

        for(var i=events.length;i--;){
            var target = events[i].context;
            events[i].fn.call(target,ev);
        }
    }

	/**
     * 启动监听
     * @return this
     */
    this.startListen = function(){
        
        self.addEventListener('orientationchange',hov,false);
        self.addEventListener('deviceorientation',tilt,false);
        self.addEventListener('devicemotion',motion,false);

        return this;
    }
    

    /**
     * 停止监听
     * @return this
     */
    this.stopListen = function(game){
        self.removeEventListener('orientationchange',hov,false);
        self.removeEventListener('deviceorientation',tilt,false);
        self.removeEventListener('devicemotion',motion,false);

        return this;
    }

    soya2d.EventHandler.call(this);
};
soya2d.inherits(soya2d.Mobile,soya2d.EventHandler);
/**
 * 移动设备事件对象
 * @typedef {Object} MobileEvent
 * @property {Object} tilt - 设备倾斜量，分为x/y/z三个轴
 * @property {Object} motion - 设备加速移动量，分为x/y/z三个轴
 * @property {string} orientation - 设备横竖方向值portrait或者landscape
 * @property {Object} e - HTML事件对象
 */
/**
 * @classdesc 鼠标事件处理类,提供如下事件:<br/>
 * <ul>
 *     <li>click</li>
 *     <li>dblclick</li>
 *     <li>mousedown</li>
 *     <li>mouseup</li>
 *     <li>mousemove</li>
 *     <li>mousewheel</li>
 *     <li>mouseover</li>
 *     <li>mouseout</li>
 * </ul>
 * 所有事件的唯一回调参数为鼠标事件对象MouseEvent
 * @class 
 * @extends soya2d.EventHandler
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Mouse = function(){

    //{'mousedown':{fire:true,event:{}}}
    var fireMap = {
        click:{},
        dblclick:{},
        mousedown:{},
        mouseup:{},
        mousemove:{},
        mousewheel:{},
        mouseover:{__fireList:[]},
        mouseout:{__fireList:[]}
    };
    var thisGame;
    var mouse = this;

    function setEvent(event,e,target){
        var renderer = thisGame.getRenderer();
        mouse.x = fireMap[event].x = (e.offsetX||e.layerX) / renderer.hr;
        mouse.y = fireMap[event].y = (e.offsetY||e.layerY) / renderer.vr;
        mouse.lButton = fireMap[event].lButton = e.button==0||e.button==1;
        mouse.rButton = fireMap[event].rButton = e.button==2;
        mouse.wButton = fireMap[event].wButton = e.button==4||e.which==2;
        fireMap[event].e = e;
        fireMap[event].type = event;
        fireMap[event].fire = true;
        if(fireMap[event].__fireList)
        fireMap[event].__fireList.push(target);//over & out
    }

    /******************* handler *******************/
    function click(e){
        setEvent('click',e);
    }
    function dblclick(e){
        setEvent('dblclick',e);
    }
    function mousedown(e){
        setEvent('mousedown',e);
    }
    function mousewheel(e){
        setEvent('mousewheel',e);
    }
    var inList = [];
    function mousemove(e){
        setEvent('mousemove',e);

        //over/out
        var ooList = [];
        var overList = mouse.__eventMap['mouseover'];
        var outList = mouse.__eventMap['mouseout'];
        if(overList){
            overList.forEach(function(o){
                ooList.push(o);
            });
        }
        if(outList){
            outList.forEach(function(o){
                for(var i=ooList.length;i--;){
                    if(ooList[i].context == o.context)return;
                }

                ooList.push(o);
            });
        }
        if(ooList.length>0){
            var currIn = [];
            ooList.forEach(function(o){
                var target = o.context;
                var fn = o.fn;
                if(!target.hitTest(mouse.x,mouse.y))return;

                currIn.push(target);
                if(inList.indexOf(target) > -1)return;
                inList.push(target);
                
                setEvent('mouseover',e,target);
            });

            var toDel = [];
            inList.forEach(function(sp){
                if(currIn.indexOf(sp) < 0){
                    toDel.push(sp); 
                }
            });
            if(toDel.length<1)return;
            for(var i=toDel.length;i--;){
                var k = inList.indexOf(toDel[i]);
                inList.splice(k,1);
                var target = toDel[i];

                setEvent('mouseout',e,target);
            }
        }
    }
    function mouseup(e){
        setEvent('mouseup',e);
    }




    /******************* interface *******************/

    /**
     * 扫描是否需要执行键盘事件，如果需要，执行
     * @return this
     */
    this.scan = function(){
        for(var key in fireMap){
            var event = fireMap[key];
            if(!event)continue;
            if(event.fire){
                var events = this.__eventMap[key];
                fireEvent(events,event);
            }
        }

        reset();
    }

    function reset(){
        for(var key in fireMap){
            var event = fireMap[key];
            if(!event)continue;
            event.fire = false;
            if(event.__fireList)
                event.__fireList = [];
        }
    }

    function fireEvent(events,ev){
        if(!events)return;

        //排序
        events.sort(function(a,b){
            return a.order - b.order;
        });

        var scene = thisGame.scene;

        for(var i=events.length;i--;){
            var target = events[i].context;
            if(target instanceof soya2d.DisplayObject && target != scene){
                if(ev.type == 'mouseover' || ev.type == 'mouseout'){
                    if(ev.__fireList.indexOf(target) < 0)continue;
                }else{
                    if(!target.hitTest(mouse.x,mouse.y))continue;
                }
            }

            events[i].fn.call(target,ev);
            
        }
    }

	/**
     * 启动监听
     * @return this
     */
    this.startListen = function(game){
        thisGame = game;
        var cvs = game.getRenderer().getCanvas();
        cvs.addEventListener('click',click,false);
        cvs.addEventListener('dblclick',dblclick,false);
        cvs.addEventListener('mousedown',mousedown,false);
        cvs.addEventListener('mousewheel',mousewheel,false);
        cvs.addEventListener('mousemove',mousemove,false);
        self.addEventListener('mouseup',mouseup,false);

        return this;
    }

    /**
     * 停止监听
     * @return this
     */
    this.stopListen = function(game){
        var cvs = game.getRenderer().getCanvas();
        cvs.removeEventListener('click',click,false);
        cvs.removeEventListener('dblclick',dblclick,false);
        cvs.removeEventListener('mousedown',mousedown,false);
        cvs.removeEventListener('mousewheel',mousewheel,false);
        cvs.removeEventListener('mousemove',mousemove,false);
        self.removeEventListener('mouseup',mouseup,false);

        return this;
    }

    soya2d.EventHandler.call(this);
};
soya2d.inherits(soya2d.Mouse,soya2d.EventHandler);
/**
 * 鼠标事件对象
 * @typedef {Object} MouseEvent
 * @property {int} x - 鼠标当前x坐标
 * @property {int} y - 鼠标当前y坐标
 * @property {boolean} lButton - 是否按下了鼠标左键
 * @property {boolean} rButton - 是否按下了鼠标右键
 * @property {boolean} wButton - 是否按下了鼠标中键
 * @property {Object} e - HTML事件对象
 */

/**
 * @classdesc 触摸事件处理类,提供如下事件:<br/>
 * <ul>
 *     <li>touchstart</li>
 *     <li>touchmove</li>
 *     <li>touchend</li>
 *     <li>touchcancel</li>
 * </ul>
 * 所有事件的唯一回调参数为触摸事件对象TouchEvent
 * @class 
 * @extends soya2d.EventHandler
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Touch = function(){

    var fireMap = {
        touchstart:{},
        touchmove:{},
        touchend:{},
        touchcancel:{}
    };
    var thisGame;
    var touch = this;

    this.touchList = [];

    var pointers = {};
    function setEvent(event,e,isPointer){
        var touchs;
        if(isPointer){
            var pid = e.pointerId;
            if(event === 'touchstart'){
                pointers[pid] = {clientX:e.clientX,clientY:e.clientY};
            }else if(event === 'touchmove'){
                if(!pointers[pid] || 
                    (pointers[pid].clientX==e.clientX && pointers[pid].clientY==e.clientY)){
                    return;
                }
                pointers[pid] = {clientX:e.clientX,clientY:e.clientY};
            }else if(event === 'touchend'){
                delete pointers[pid];
            }else if(event === 'touchcancel'){
                delete pointers[pid];
            }

            touchs = [];
            for(var i in pointers){
                var p = pointers[i];
                touchs.push(p);
            }
        }else{
            touchs = e.changedTouches;
        }

        if(touchs && touchs.length>0){
            var t = e.target||e.srcElement;
            var ol=t.offsetLeft,ot=t.offsetTop;
            while((t=t.offsetParent) && t.tagName!='BODY'){
                ol+=t.offsetLeft-t.scrollLeft;
                ot+=t.offsetTop-t.scrollTop;
            }
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
                scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
            for(var i=0;i<touchs.length;i++){
                var tev = touchs[i];
                touch.touchList[i] = tev.clientX - ol + scrollLeft;
                touch.touchList[i+1] = tev.clientY - ot + scrollTop;
            }
        }

        var touchList = touch.touchList;

        var renderer = thisGame.getRenderer();
        var cvs = renderer.getCanvas();
        var marginLeft = window.getComputedStyle(cvs,null).marginLeft;
        marginLeft = parseFloat(marginLeft) || 0;
        var marginTop = window.getComputedStyle(cvs,null).marginTop;
        marginTop = parseFloat(marginTop) || 0;
        
        for(var i=0;i<touchList.length;i+=2){
            var x = touchList[i];
            var y = touchList[i+1];
            
            switch(this.game.view.rotate()){
                case soya2d.ROTATEMODE_90:
                    //平移，计算出canvas内坐标
                    x = x + cvs.offsetLeft - marginTop;
                    y = y + cvs.offsetTop - marginLeft;
                    
                    //旋转
                    var tmp = x;
                    x = y;
                    y = this.game.view.w - Math.abs(tmp);
                    break;
                case soya2d.ROTATEMODE_270:
                    //平移，计算出canvas内坐标
                    x = x + cvs.offsetLeft - marginTop;
                    y = y + cvs.offsetTop - marginLeft;
                    
                    //旋转
                    var tmp = y;
                    y = x;
                    x = this.game.view.h - Math.abs(tmp);
                    break;
                case soya2d.ROTATEMODE_180:
                    //旋转
                    x = this.game.view.w - Math.abs(x);
                    y = this.game.view.h - Math.abs(y);
                    break;
            }
            
            x = x / renderer.hr;
            y = y / renderer.vr;  
                
            touchList[i] = x;
            touchList[i+1] = y;
        }
        
        fireMap[event].touchList = touchList;
        fireMap[event].e = e;
        fireMap[event].type = event;
        fireMap[event].fire = true;
    }

    /******************* handler *******************/
    function proxy(e){
        if(e.pointerType && (e.pointerType !== e.MSPOINTER_TYPE_TOUCH))return;
        if (e.preventManipulation){
            e.preventManipulation();
        }else{
            e.preventDefault();
        }

        var type = e.type;
        switch(type){
            case 'MSPointerDown':case 'pointerdown':
                setEvent('touchstart',e,true);
                break;
            case 'touchstart':
                setEvent('touchstart',e);
                break;
            case 'MSPointerMove':case 'pointermove':
                setEvent('touchmove',e,true);
                break;
            case 'touchmove':
                setEvent('touchmove',e);
                break;
            case 'MSPointerUp':case 'pointerup':
                setEvent('touchend',e,true);
                break;
            case 'touchend':
                setEvent('touchend',e);
                break;
            case 'MSPointerCancel':case 'pointercancel':
                setEvent('touchcancel',e,true);
                break;
            case 'touchcancel':
                setEvent('touchcancel',e);
                break;
        }
    }



    /******************* interface *******************/

    /**
     * 扫描是否需要执行键盘事件，如果需要，执行
     * @return this
     */
    this.scan = function(){
        for(var key in fireMap){
            var event = fireMap[key];
            if(!event)continue;
            if(event.fire){
                var events = this.__eventMap[key];
                fireEvent(events,event);
            }
        }

        reset();
    }

    function reset(){
        for(var key in fireMap){
            var event = fireMap[key];
            if(!event)continue;
            event.fire = false;
        }
    }

    function fireEvent(events,ev){
        if(!events)return;

        //排序
        events.sort(function(a,b){
            return a.order - b.order;
        });

        var scene = game.scene;

        for(var i=events.length;i--;){
            var target = events[i].context;
            if(target instanceof soya2d.DisplayObject && target != scene){

                var touchList = touch.touchList;
                var hit = false;
                for(var j=0;j<touchList.length;j+=2){
                    x = touchList[j];
                    y = touchList[j+1];

                    if(target.hitTest(x,y)){
                        hit = true;
                        break;
                    }
                }
                if(!hit){
                    continue;
                }
            }

            events[i].fn.call(target,ev);
            
        }
    }

    /**
     * 启动监听
     * @return this
     */
    this.startListen = function(game){
        thisGame = game;
        var cvs = game.getRenderer().getCanvas();

        if (window.PointerEvent) {
            cvs.addEventListener("pointerdown", proxy, false);
            cvs.addEventListener("pointermove", proxy, false);
            self.addEventListener("pointerup", proxy, false);
            self.addEventListener('pointercancel',proxy,false);
        }else if(window.MSPointerEvent){
            cvs.addEventListener("MSPointerDown", proxy, false);
            cvs.addEventListener("MSPointerMove", proxy, false);
            self.addEventListener("MSPointerUp", proxy, false);
            self.addEventListener('MSPointerCancel',proxy,false);
        }else{
            cvs.addEventListener('touchstart',proxy,false);
            cvs.addEventListener('touchmove',proxy,false);
            self.addEventListener('touchend',proxy,false);
            self.addEventListener('touchcancel',proxy,false);
        }
        

        return this;
    }

    /**
     * 停止监听
     * @return this
     */
    this.stopListen = function(game){
        var cvs = game.getRenderer().getCanvas();
        
        if (window.PointerEvent) {
            cvs.removeEventListener("pointerdown", proxy, false);
            cvs.removeEventListener("pointermove", proxy, false);
            self.removeEventListener("pointerup", proxy, false);
            self.removeEventListener('pointercancel',proxy,false);
        }else if(window.MSPointerEvent){
            cvs.removeEventListener("MSPointerDown", proxy, false);
            cvs.removeEventListener("MSPointerMove", proxy, false);
            self.removeEventListener("MSPointerUp", proxy, false);
            self.removeEventListener('MSPointerCancel',proxy,false);
        }else{
            cvs.removeEventListener('touchstart',proxy,false);
            cvs.removeEventListener('touchmove',proxy,false);
            self.removeEventListener('touchend',proxy,false);
            self.removeEventListener('touchcancel',proxy,false);
        }
        return this;
    }

    soya2d.EventHandler.call(this);
};
soya2d.inherits(soya2d.Touch,soya2d.EventHandler);
/**
 * 触摸事件对象
 * @typedef {Object} TouchEvent
 * @property {Array} touchList - 触摸点一维数组[x1,y1, x2,y2, ...]
 * @property {Object} e - HTML事件对象
 */


soya2d.module.install('event',{
    onInit:function(game){
        game.events = new soya2d.Events();
        var keyboardEvents = ['keyup','keydown','keypress'];
        var mouseEvents = ['click','dblclick','mousedown','mousewheel',
                            'mousemove','mouseup','mouseover','mouseout'];
        var touchEvents = ['touchstart','touchmove','touchend','touchcancel'];
        var mobileEvents = ['hov','tilt','motion'];

        if(soya2d.Mouse){
            game.events.register(mouseEvents,new soya2d.Mouse());
        }
        if(soya2d.Keyboard){
            game.events.register(keyboardEvents,new soya2d.Keyboard());
        }
        if(soya2d.Touch){
            game.events.register(touchEvents,new soya2d.Touch());
        }
        if(soya2d.Mobile){
            game.events.register(mobileEvents,new soya2d.Mobile());
        }
    },
    onStart:function(game){
        game.events.startListen(game);
    },
    onStop:function(game){
        game.events.stopListen(game);
    },
    onUpdate:function(game){
        game.events.scan();
    }
});

/**
 * 扩展可渲染对象的事件接口
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ext(soya2d.DisplayObject.prototype,/** @lends soya2d.DisplayObject.prototype */{
    /**
     * 绑定一个或者多个事件，使用同一个回调函数
     * @param {soya2d.Game} game 绑定的游戏实例
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数
     * @param {int} [order] 触发顺序，值越大越先触发
     * @requires event
     */
    on:function(game,events,callback,order){
        game.events.addListener(events,callback,this,order);
    },
    /**
     * 绑定一个或者多个事件，使用同一个回调函数。但只触发一次
     * @param {soya2d.Game} game 绑定的游戏实例
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数
     * @param {int} [order] 触发顺序，值越大越先触发
     * @requires event
     */
    once:function(game,events,callback,order){
        var that = this;
        var cb = function() {
            that.off(events, cb);
            callback.apply(that, arguments)
        }
        game.events.addListener(events,cb,this,order);
    },
    /**
     * 取消一个或者多个已绑定事件
     * @param {soya2d.Game} game 绑定的游戏实例
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数，可选。如果该参数为空。则删除指定类型下所有事件
     * @requires event
     */
    off:function(game,events,callback){
        game.events.removeListener(events,callback,this);
    }
});

/**
 * 扩展可游戏对象的事件接口
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ext(soya2d.Game.prototype,/** @lends soya2d.Game.prototype */{
    /**
     * 绑定一个或者多个事件，使用同一个回调函数
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数
     * @param {int} [order] 触发顺序，值越大越先触发
     * @requires event
     */
    on:function(events,callback,order){
        this.events.addListener(events,callback,this,order);
    },
    /**
     * 绑定一个或者多个事件，使用同一个回调函数。但只触发一次
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数
     * @param {int} [order] 触发顺序，值越大越先触发
     * @requires event
     */
    once:function(events,callback,order){
        var that = this;
        var cb = function() {
            that.off(events, cb);
            callback.apply(that, arguments)
        }
        this.events.addListener(events,cb,this,order);
    },
    /**
     * 取消一个或者多个已绑定事件
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数，可选。如果该参数为空。则删除指定类型下所有事件
     * @requires event
     */
    off:function(events,callback){
        this.events.removeListener(events,callback,this);
    }
});
/*!
 *  howler.js v1.1.25
 *  howlerjs.com
 *
 *  (c) 2013-2014, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */
!function(){var e={},t=null,n=!0,r=!1;try{"undefined"!=typeof AudioContext?t=new AudioContext:"undefined"!=typeof webkitAudioContext?t=new webkitAudioContext:n=!1}catch(i){n=!1}if(!n)if("undefined"!=typeof Audio)try{new Audio}catch(i){r=!0}else r=!0;if(n){var s=void 0===t.createGain?t.createGainNode():t.createGain();s.gain.value=1,s.connect(t.destination)}var o=function(e){this._volume=1,this._muted=!1,this.usingWebAudio=n,this.ctx=t,this.noAudio=r,this._howls=[],this._codecs=e,this.iOSAutoEnable=!0};o.prototype={volume:function(e){var t=this;if(e=parseFloat(e),e>=0&&1>=e){t._volume=e,n&&(s.gain.value=e);for(var r in t._howls)if(t._howls.hasOwnProperty(r)&&t._howls[r]._webAudio===!1)for(var i=0;i<t._howls[r]._audioNode.length;i++)t._howls[r]._audioNode[i].volume=t._howls[r]._volume*t._volume;return t}return n?s.gain.value:t._volume},mute:function(){return this._setMuted(!0),this},unmute:function(){return this._setMuted(!1),this},_setMuted:function(e){var t=this;t._muted=e,n&&(s.gain.value=e?0:t._volume);for(var r in t._howls)if(t._howls.hasOwnProperty(r)&&t._howls[r]._webAudio===!1)for(var i=0;i<t._howls[r]._audioNode.length;i++)t._howls[r]._audioNode[i].muted=e},codecs:function(e){return this._codecs[e]},_enableiOSAudio:function(){var e=this;if(!t||!e._iOSEnabled&&/iPhone|iPad|iPod/i.test(navigator.userAgent)){e._iOSEnabled=!1;var n=function(){var r=t.createBuffer(1,1,22050),i=t.createBufferSource();i.buffer=r,i.connect(t.destination),void 0===i.start?i.noteOn(0):i.start(0),setTimeout(function(){(i.playbackState===i.PLAYING_STATE||i.playbackState===i.FINISHED_STATE)&&(e._iOSEnabled=!0,e.iOSAutoEnable=!1,window.removeEventListener("touchstart",n,!1))},0)};return window.addEventListener("touchstart",n,!1),e}}};var u=null,a={};r||(u=new Audio,a={mp3:!!u.canPlayType("audio/mpeg;").replace(/^no$/,""),opus:!!u.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!u.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!u.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),aac:!!u.canPlayType("audio/aac;").replace(/^no$/,""),m4a:!!(u.canPlayType("audio/x-m4a;")||u.canPlayType("audio/m4a;")||u.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(u.canPlayType("audio/x-mp4;")||u.canPlayType("audio/mp4;")||u.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!u.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")});var f=new o(a),l=function(e){var r=this;r._autoplay=e.autoplay||!1,r._buffer=e.buffer||!1,r._duration=e.duration||0,r._format=e.format||null,r._loop=e.loop||!1,r._loaded=!1,r._sprite=e.sprite||{},r._src=e.src||"",r._pos3d=e.pos3d||[0,0,-.5],r._volume=void 0!==e.volume?e.volume:1,r._urls=e.urls||[],r._rate=e.rate||1,r._model=e.model||null,r._onload=[e.onload||function(){}],r._onloaderror=[e.onloaderror||function(){}],r._onend=[e.onend||function(){}],r._onpause=[e.onpause||function(){}],r._onplay=[e.onplay||function(){}],r._onendTimer=[],r._webAudio=n&&!r._buffer,r._audioNode=[],r._webAudio&&r._setupAudioNode(),void 0!==t&&t&&f.iOSAutoEnable&&f._enableiOSAudio(),f._howls.push(r),r.load()};if(l.prototype={load:function(){var e=this,t=null;if(r)return void e.on("loaderror");for(var n=0;n<e._urls.length;n++){var i,s;if(e._format)i=e._format;else{if(s=e._urls[n],i=/^data:audio\/([^;,]+);/i.exec(s),i||(i=/\.([^.]+)$/.exec(s.split("?",1)[0])),!i)return void e.on("loaderror");i=i[1].toLowerCase()}if(a[i]){t=e._urls[n];break}}if(!t)return void e.on("loaderror");if(e._src=t,e._webAudio)c(e,t);else{var u=new Audio;u.addEventListener("error",function(){u.error&&4===u.error.code&&(o.noAudio=!0),e.on("loaderror",{type:u.error?u.error.code:0})},!1),e._audioNode.push(u),u.src=t,u._pos=0,u.preload="auto",u.volume=f._muted?0:e._volume*f.volume();var l=function(){e._duration=Math.ceil(10*u.duration)/10,0===Object.getOwnPropertyNames(e._sprite).length&&(e._sprite={_default:[0,1e3*e._duration]}),e._loaded||(e._loaded=!0,e.on("load")),e._autoplay&&e.play(),u.removeEventListener("canplaythrough",l,!1)};u.addEventListener("canplaythrough",l,!1),u.load()}return e},urls:function(e){var t=this;return e?(t.stop(),t._urls="string"==typeof e?[e]:e,t._loaded=!1,t.load(),t):t._urls},play:function(e,n){var r=this;return"function"==typeof e&&(n=e),e&&"function"!=typeof e||(e="_default"),r._loaded?r._sprite[e]?(r._inactiveNode(function(i){i._sprite=e;var s=i._pos>0?i._pos:r._sprite[e][0]/1e3,o=0;r._webAudio?(o=r._sprite[e][1]/1e3-i._pos,i._pos>0&&(s=r._sprite[e][0]/1e3+s)):o=r._sprite[e][1]/1e3-(s-r._sprite[e][0]/1e3);var u,a=!(!r._loop&&!r._sprite[e][2]),l="string"==typeof n?n:Math.round(Date.now()*Math.random())+"";if(function(){var t={id:l,sprite:e,loop:a};u=setTimeout(function(){!r._webAudio&&a&&r.stop(t.id).play(e,t.id),r._webAudio&&!a&&(r._nodeById(t.id).paused=!0,r._nodeById(t.id)._pos=0,r._clearEndTimer(t.id)),r._webAudio||a||r.stop(t.id),r.on("end",l)},1e3*o),r._onendTimer.push({timer:u,id:t.id})}(),r._webAudio){var c=r._sprite[e][0]/1e3,h=r._sprite[e][1]/1e3;i.id=l,i.paused=!1,d(r,[a,c,h],l),r._playStart=t.currentTime,i.gain.value=r._volume,void 0===i.bufferSource.start?i.bufferSource.noteGrainOn(0,s,o):i.bufferSource.start(0,s,o)}else{if(4!==i.readyState&&(i.readyState||!navigator.isCocoonJS))return r._clearEndTimer(l),function(){var t=r,s=e,o=n,u=i,a=function(){t.play(s,o),u.removeEventListener("canplaythrough",a,!1)};u.addEventListener("canplaythrough",a,!1)}(),r;i.readyState=4,i.id=l,i.currentTime=s,i.muted=f._muted||i.muted,i.volume=r._volume*f.volume(),setTimeout(function(){i.play()},0)}return r.on("play"),"function"==typeof n&&n(l),r}),r):("function"==typeof n&&n(),r):(r.on("load",function(){r.play(e,n)}),r)},pause:function(e){var t=this;if(!t._loaded)return t.on("play",function(){t.pause(e)}),t;t._clearEndTimer(e);var n=e?t._nodeById(e):t._activeNode();if(n)if(n._pos=t.pos(null,e),t._webAudio){if(!n.bufferSource||n.paused)return t;n.paused=!0,void 0===n.bufferSource.stop?n.bufferSource.noteOff(0):n.bufferSource.stop(0)}else n.pause();return t.on("pause"),t},stop:function(e){var t=this;if(!t._loaded)return t.on("play",function(){t.stop(e)}),t;t._clearEndTimer(e);var n=e?t._nodeById(e):t._activeNode();if(n)if(n._pos=0,t._webAudio){if(!n.bufferSource||n.paused)return t;n.paused=!0,void 0===n.bufferSource.stop?n.bufferSource.noteOff(0):n.bufferSource.stop(0)}else isNaN(n.duration)||(n.pause(),n.currentTime=0);return t},mute:function(e){var t=this;if(!t._loaded)return t.on("play",function(){t.mute(e)}),t;var n=e?t._nodeById(e):t._activeNode();return n&&(t._webAudio?n.gain.value=0:n.muted=!0),t},unmute:function(e){var t=this;if(!t._loaded)return t.on("play",function(){t.unmute(e)}),t;var n=e?t._nodeById(e):t._activeNode();return n&&(t._webAudio?n.gain.value=t._volume:n.muted=!1),t},volume:function(e,t){var n=this;if(e=parseFloat(e),e>=0&&1>=e){if(n._volume=e,!n._loaded)return n.on("play",function(){n.volume(e,t)}),n;var r=t?n._nodeById(t):n._activeNode();return r&&(n._webAudio?r.gain.value=e:r.volume=e*f.volume()),n}return n._volume},loop:function(e){var t=this;return"boolean"==typeof e?(t._loop=e,t):t._loop},sprite:function(e){var t=this;return"object"==typeof e?(t._sprite=e,t):t._sprite},pos:function(e,n){var r=this;if(!r._loaded)return r.on("load",function(){r.pos(e)}),"number"==typeof e?r:r._pos||0;e=parseFloat(e);var i=n?r._nodeById(n):r._activeNode();if(i)return e>=0?(r.pause(n),i._pos=e,r.play(i._sprite,n),r):r._webAudio?i._pos+(t.currentTime-r._playStart):i.currentTime;if(e>=0)return r;for(var s=0;s<r._audioNode.length;s++)if(r._audioNode[s].paused&&4===r._audioNode[s].readyState)return r._webAudio?r._audioNode[s]._pos:r._audioNode[s].currentTime},pos3d:function(e,t,n,r){var i=this;if(t=void 0!==t&&t?t:0,n=void 0!==n&&n?n:-.5,!i._loaded)return i.on("play",function(){i.pos3d(e,t,n,r)}),i;if(!(e>=0||0>e))return i._pos3d;if(i._webAudio){var s=r?i._nodeById(r):i._activeNode();s&&(i._pos3d=[e,t,n],s.panner.setPosition(e,t,n),s.panner.panningModel=i._model||"HRTF")}return i},fade:function(e,t,n,r,i){var s=this,o=Math.abs(e-t),u=e>t?"down":"up",a=o/.01,f=n/a;if(!s._loaded)return s.on("load",function(){s.fade(e,t,n,r,i)}),s;s.volume(e,i);for(var l=1;a>=l;l++)!function(){var e=s._volume+("up"===u?.01:-.01)*l,n=Math.round(1e3*e)/1e3,o=t;setTimeout(function(){s.volume(n,i),n===o&&r&&r()},f*l)}()},fadeIn:function(e,t,n){return this.volume(0).play().fade(0,e,t,n)},fadeOut:function(e,t,n,r){var i=this;return i.fade(i._volume,e,t,function(){n&&n(),i.pause(r),i.on("end")},r)},_nodeById:function(e){for(var t=this,n=t._audioNode[0],r=0;r<t._audioNode.length;r++)if(t._audioNode[r].id===e){n=t._audioNode[r];break}return n},_activeNode:function(){for(var e=this,t=null,n=0;n<e._audioNode.length;n++)if(!e._audioNode[n].paused){t=e._audioNode[n];break}return e._drainPool(),t},_inactiveNode:function(e){for(var t=this,n=null,r=0;r<t._audioNode.length;r++)if(t._audioNode[r].paused&&4===t._audioNode[r].readyState){e(t._audioNode[r]),n=!0;break}if(t._drainPool(),!n){var i;if(t._webAudio)i=t._setupAudioNode(),e(i);else{t.load(),i=t._audioNode[t._audioNode.length-1];var s=navigator.isCocoonJS?"canplaythrough":"loadedmetadata",o=function(){i.removeEventListener(s,o,!1),e(i)};i.addEventListener(s,o,!1)}}},_drainPool:function(){var e,t=this,n=0;for(e=0;e<t._audioNode.length;e++)t._audioNode[e].paused&&n++;for(e=t._audioNode.length-1;e>=0&&!(5>=n);e--)t._audioNode[e].paused&&(t._webAudio&&t._audioNode[e].disconnect(0),n--,t._audioNode.splice(e,1))},_clearEndTimer:function(e){for(var t=this,n=0,r=0;r<t._onendTimer.length;r++)if(t._onendTimer[r].id===e){n=r;break}var i=t._onendTimer[n];i&&(clearTimeout(i.timer),t._onendTimer.splice(n,1))},_setupAudioNode:function(){var e=this,n=e._audioNode,r=e._audioNode.length;return n[r]=void 0===t.createGain?t.createGainNode():t.createGain(),n[r].gain.value=e._volume,n[r].paused=!0,n[r]._pos=0,n[r].readyState=4,n[r].connect(s),n[r].panner=t.createPanner(),n[r].panner.panningModel=e._model||"equalpower",n[r].panner.setPosition(e._pos3d[0],e._pos3d[1],e._pos3d[2]),n[r].panner.connect(n[r]),n[r]},on:function(e,t){var n=this,r=n["_on"+e];if("function"==typeof t)r.push(t);else for(var i=0;i<r.length;i++)t?r[i].call(n,t):r[i].call(n);return n},off:function(e,t){var n=this,r=n["_on"+e],i=t?""+t:null;if(i){for(var s=0;s<r.length;s++)if(i===""+r[s]){r.splice(s,1);break}}else n["_on"+e]=[];return n},unload:function(){for(var t=this,n=t._audioNode,r=0;r<t._audioNode.length;r++)n[r].paused||(t.stop(n[r].id),t.on("end",n[r].id)),t._webAudio?n[r].disconnect(0):n[r].src="";for(r=0;r<t._onendTimer.length;r++)clearTimeout(t._onendTimer[r].timer);var i=f._howls.indexOf(t);null!==i&&i>=0&&f._howls.splice(i,1),delete e[t._src],t=null}},n)var c=function(t,n){if(n in e)return t._duration=e[n].duration,void p(t);if(/^data:[^;]+;base64,/.test(n)){for(var r=atob(n.split(",")[1]),i=new Uint8Array(r.length),s=0;s<r.length;++s)i[s]=r.charCodeAt(s);h(i.buffer,t,n)}else{var o=new XMLHttpRequest;o.open("GET",n,!0),o.responseType="arraybuffer",o.onload=function(){h(o.response,t,n)},o.onerror=function(){t._webAudio&&(t._buffer=!0,t._webAudio=!1,t._audioNode=[],delete t._gainNode,delete e[n],t.load())};try{o.send()}catch(u){o.onerror()}}},h=function(n,r,i){t.decodeAudioData(n,function(t){t&&(e[i]=t,p(r,t))},function(){r.on("loaderror")})},p=function(e,t){e._duration=t?t.duration:e._duration,0===Object.getOwnPropertyNames(e._sprite).length&&(e._sprite={_default:[0,1e3*e._duration]}),e._loaded||(e._loaded=!0,e.on("load")),e._autoplay&&e.play()},d=function(n,r,i){var s=n._nodeById(i);s.bufferSource=t.createBufferSource(),s.bufferSource.buffer=e[n._src],s.bufferSource.connect(s.panner),s.bufferSource.loop=r[0],r[0]&&(s.bufferSource.loopStart=r[1],s.bufferSource.loopEnd=r[1]+r[2]),s.bufferSource.playbackRate.value=n._rate};"function"==typeof define&&define.amd&&define(function(){return{Howler:f,Howl:l}}),"undefined"!=typeof exports&&(exports.Howler=f,exports.Howl=l),"undefined"!=typeof window&&(window.Howler=f,window.Howl=l)}();
/**
 * @classdesc 声音类用来对指定音频执行播放、暂停、静音等操作
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
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
     * @return this
     */
    play:function(){
        this.__handler.play();
        return this;
    },
    /**
     * 暂停音频播放
     * @return this
     */
    pause:function(){
        this.__handler.pause();
        return this;
    },
    /**
     * 停止音频，播放头会跳到最开始
     * @return this
     */
	stop:function(){
 		this.__handler.stop();
        return this;
	},
    /**
     * 设置或者获取当前静音状态
     * @param {Boolean} m 是否静音
     * @return {this|Boolean}
     */
    mute:function(m){
        if(m != undefined){
            this.__muted = m;
            if(m)
                this.__handler.mute();
            else{
                this.__handler.unmute();
            }
            return this;
        }
        else{return this.__muted;}
    },
    /**
     * 设置或者获取当前循环状态
     * @param {Boolean} l 是否循环
     * @return {this|Boolean}
     */
    loop:function(l){
        if(l != undefined){
            this.__loop = l;
            this.__handler.loop(l);
            return this;
        }
        else{return this.__loop;}
    },
    /**
     * 设置或者获取当前音量
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
     * 设置或者获取播放头当前位置。单位:S
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
     * @param  {Number}   from     开始音量 (0.0 to 1.0).
     * @param  {Number}   to       目标音量 (0.0 to 1.0).
     * @param  {Number}   len      渐变时间。毫秒
     * @param  {Function} end (可选) 结束时触发
     */
    fade:function(from, to, len, end){
        this.__handler.fade(from, to, len, end);
        return this;
    }
};

/**
 * @classdesc 声音管理器类用来管理所绑定game实例中的所有音频，用于获取，创建，删除声音。<br/>
 * 该类无需显式创建，引擎会自动绑定到game实例属性中。
 * @class 
 * @extends soya2d.ResourceManager
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.SoundManager = function(){
    //继承
    soya2d.ResourceManager.call(this);

    function getBaseNames(urls){
        var rs = [];
        if(urls.forEach){
            urls.forEach(function(url){
                var baseName = url.split('.')[0];
                if(rs.indexOf(baseName) < 0)rs.push(baseName);
            });
        }
        return rs;
    }

    /**
     * 创建一个声音对象，并立即加载
     * @param {var} opts 创建参数对象，参数如下：
     * @param {Array} opts.urls 文件路径数组，可以指定不同的格式路径用于跨平台，比如：['sound.mp3','sound.ogg','sound.m4a']。文件前缀被称为标识，
        每次创建只支持一个标识，如果有多个，只识别第一个
     * @param {boolean} [opts.autoplay=false] 是否自动播放
     * @param {boolean} [opts.loop] 是否循环播放
     * @param {boolean} [opts.volume] 声音初始音量。0.0 - 1.0
     * @return {soya2d.Sound | null} 声音对象
     */
    this.create = function(opts){
        if(!opts)return null;
        if(!opts.urls || opts.urls.length<1)return null;

        var handler = new Howl(opts);
        var sound = new soya2d.Sound(opts);
        sound.__handler = handler;

        //put map
        var baseNames = getBaseNames(opts.urls);
        this.urlMap[baseNames[0]] = sound;

        return sound;
    };

    /**
     * 添加声音到管理器，用于loader
     * @private
     */
    this._add = function(src,res){
        if(typeof(src) == "string"){
            src = [src];
        }
        var baseNames = getBaseNames(src);
        this.urlMap[baseNames[0]] = res;
    };

    /**
     * 设置所有声音的静音状态
     * @param {boolean} m 是否静音
     */
    this.muteAll = function(m){
        for(var i in this.urlMap){
            var sound = this.urlMap[i];
            sound.mute(m);
        }
    };
    
    /**
     * 停止所有声音
     */
    this.stopAll = function(){
        for(var i in this.urlMap){
            var sound = this.urlMap[i];
            sound.stop();
        }
    }
};
soya2d.inherits(soya2d.SoundManager,soya2d.ResourceManager);

soya2d.module.install('sound',{
    onInit:function(game){
        /**
         * 声音管理器
         * @type {soya2d.SoundManager}
         * @memberOf! soya2d.Game#
         * @alias soundManager
         * @requires sound
         */
        game.soundManager = new soya2d.SoundManager();
    },
    onStop:function(){
        game.soundManager.stopAll();
    }
});
/**
 * @classdesc 发射器用于在给定的坐标发射粒子。默认的粒子都是dead状态，不可见，
 * 引擎会激活粒子为活跃状态，并按照参数发射粒子，这时粒子为可见。
 * @class 
 * @param {Object} opts 构造参数对象，参数如下：
 * @param {Number} [opts.MSPE=16] 粒子发射间隔
 * @param {int} opts.emissionCount 总粒子数
 * @param {int} [opts.blendMode=soya2d.BLEND_LIGHTER] 混合模式
 * @param {int} opts.x 发射器坐标
 * @param {int} [opts.xVar=0] 发射器坐标，可变累加值
 * @param {int} opts.y 发射器坐标
 * @param {int} [opts.yVar=0] 发射器坐标，可变累加值
 * @param {soya2d.DisplayObject} opts.template 粒子模版
 * @param {Number} [opts.lifeSpan=1] 粒子生命周期
 * @param {Number} [opts.lifeSpanVar=0] 粒子生命周期，可变累加值
 * @param {Number} [opts.speed=0] 粒子移动速度
 * @param {Number} [opts.speedVar=0] 粒子移动速度，可变累加值
 * @param {Number} [opts.radialAcc=0] 径向加速度
 * @param {Number} [opts.radialAccVar=0] 径向加速度，可变累加值
 * @param {Number} [opts.tanAcc=0] 切线加速度
 * @param {Number} [opts.tanAccVar=0] 切线加速度，可变累加值
 * @param {Number} [opts.angle=0] 发射角度
 * @param {Number} [opts.angleVar=0] 发射角度，可变累加值
 * @param {Number} [opts.startSpin=0] 自转速度范围起始
 * @param {Number} [opts.startSpinVar=0] 自转速度范围起始，可变累加值
 * @param {Number} [opts.endSpin=0] 自转速度范围结束
 * @param {Number} [opts.endSpinVar=0] 自转速度范围结束，可变累加值
 * @param {function} [opts.onActive] 回调事件，粒子激活时调用。
 * 在粒子发射器停止前，每个粒子都可以无限次激活
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Emitter = function(opts){
	var particles = [];
	var lastTime = 0;
	
	cfg = opts||{};

	soya2d.ext(this,cfg);

	//1.初始化发生器变量
	this.MSPE = cfg.MSPE||16;
	this.emissionCount = cfg.emissionCount;//粒子数
	this.blendMode = cfg.blendMode || soya2d.BLEND_LIGHTER;//混合方式
	this.x = cfg.x;this.xVar = cfg.xVar||0;
	this.y = cfg.y;this.yVar = cfg.yVar||0;
	
	//2.初始化粒子属性
	this.template = soya2d.ParticleWrapper.wrap(cfg.template);//粒子模版
	//生命周期
	this.lifeSpan = cfg.lifeSpan || 1;
	this.lifeSpanVar = cfg.lifeSpanVar||0;
	//默认速度
	this.speed = cfg.speed || 0;
	this.speedVar = cfg.speedVar||0;
	//径向加速度
	this.radialAcc = cfg.radialAcc||0;
	this.radialAccVar = cfg.radialAccVar||0;
	//切线加速度
	this.tanAcc = cfg.tanAcc||0;
	this.tanAccVar = cfg.tanAccVar||0;
	//角度
	this.angle = cfg.angle||0;
	this.angleVar = cfg.angleVar||0;
	//自旋转
	this.startSpin = cfg.startSpin||0;
	this.startSpinVar = cfg.startSpinVar||0;
	this.endSpin = cfg.endSpin||0;
	this.endSpinVar = cfg.endSpinVar||0;

	//回调
	this.onActive = cfg.onActive;
	
	//初始化粒子
	for(var i=this.emissionCount;i--;){
		var p = new this.template(this);
		p.visible = false;
		p.lifeSpan = 0;//dead particle
		p.deadRate = 0;
		particles.push(p);
	}

	/**
	 * 是否运行中
	 * @type {Boolean}
	 */
	this.running = false;
	/**
	 * 把发射器添加到soya2d显示对象上
	 * @param {soya2d.DisplayObject} object 显示对象
	 * @return this
	 */
	this.addTo = function(object){
		if(!soya2d.ParticleManager.add(this))return this;
		
		object.add.apply(object,particles);
		
		return this;
	}
	/**
	 * 把发射器从soya2d显示对象上移除
	 * @param {soya2d.DisplayObject} object 显示对象
	 * @return this
	 */
	this.removeFrom = function(object){
		soya2d.ParticleManager.remove(this);
		
		object.remove.apply(object,particles);
		
		return this;
	}
	/**
	 * 开始发射粒子
	 */
	this.emit = function(){
		if(this.running)return this;
		lastTime = Date.now();
		this.running = true;
		if(this.stopping){
			clearTimeout(this.stopping);
		}
		return this;
	}
	/**
	 * 发射器停止产生新粒子<br/>
	 * *调用emit方法可以解除该状态
	 * @param {int} ms 停止激活的延迟毫秒数
	 */
	this.stop = function(ms){
		if(!this.running)return this;
		if(ms>0){
			var THAT = this;
			this.stopping = setTimeout(function(){
				this.running = false;
				THAT.stopping = 0;
			},ms);
			return;
		}
		//停止激活新粒子
		this.running = false;
		return this;
	};
	
	var deltaSum = 0;
	/*
	 * 更新所有粒子,代理调用
	 * @private
	 */
	this.update = function(now){
		//1.确定该帧激活多少个粒子
		var delta = now - lastTime;
		lastTime = now;
		deltaSum += delta;
		var emittableCount = 0;
		var ps = particles;
		
		//时间差值是否大于粒子发射间隔
		if (deltaSum >= this.MSPE && this.running) {
	      	emittableCount = (deltaSum / this.MSPE)>>0;
	      	deltaSum = 0;
	  	}
  
		//有该帧能发射的粒子
		if(emittableCount>0 && this.running){
		  	emittableCount = emittableCount>this.emissionCount?this.emissionCount:emittableCount;
		  	for(var i=this.emissionCount;i--&&emittableCount;){
		  		var p = ps[i];
				if(p.lifeSpan<=0){
					if(this.onActive instanceof Function)
					this.onActive.call(p);
					p.resetParticle(this);
					emittableCount--;
				}
			}
		}
			
		//2.更新所有活的粒子
		for(var i=ps.length;i--;){
			var p = ps[i];
			if(p.lifeSpan>0){
				p.updateParticle(delta);
			}
		}//over for
	};
};

/**
 * 粒子管理器接口，用于管理粒子发射器的运行<br/>
 * *通常不需要开发者直接使用该类，引擎会自动调度
 * @namespace soya2d.ParticleManager
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ParticleManager = new function(){
	var emitters = [];
	this.add = function(emitter){
		var i = emitters.indexOf(emitter);
		if(i>-1){
			return false;
		}
		emitters.push(emitter);
		return this;
	};
	this.remove = function(emitter) {
		var i = emitters.indexOf(emitter);
		if(i>-1)emitters.splice(emitter, 1);
		return this;
	};

	this.update = function(t){
		for(var i=emitters.length;i--;){
			emitters[i].update(t);	
		}
	};
	
	this.stop = function(emitter){
		if(emitter){
			var i = emitters.indexOf(emitter);
			if(i>-1)emitter.stop();
		}else{
			emitters.splice(0,emitters.length);
		}
	};
};

/**
 * 粒子包装器用于包装soya2d显示对象为一个可用粒子
 * @namespace soya2d.ParticleWrapper
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ParticleWrapper = new function(){

	/**
	 * 包装一个显示类，该类需要提供粒子的绘制方法，比如内置的{@link soya2d.Rect}
	 * @param  {soya2d.DisplayObject} clazz 粒子类
	 * @return {soya2d.DisplayObject} particle 包装后的粒子类
	 */
	this.wrap = function(clazz){
		clazz.prototype.updateParticle = updateParticle;
		clazz.prototype.initParticle = initParticle;
		clazz.prototype.resetParticle = resetParticle;
		clazz.prototype.destroyParticle = function() {
	    	this.parent.remove(this);
		}
		return clazz;
	}

	//this.interpolationType = 'linear';
    //中间值可以使用Tween来进行差值计算
    
    function updateParticle(delta){
    	var m = soya2d.Math;
    	var dt = delta/1000;
    	//1.检测是否已经死亡
    	this.lifeSpan -= dt;
    	if(this.lifeSpan<=0){
    		this.visible = false;
    		this.deadRate = 0;
    		return;
    	}
    	this.deadRate = this.lifeSpan / this.maxLifeSpan;
    	//2.更新所有属性
    	 
    	//位置(射线)
    	this.speed.add(this.deltaSpeed).add(this.radialAcc);
    	 
       	//切线旋转
       	if(this.tanAcc!==0){
	       	this.tanDir.set(this.speed.e[0],this.speed.e[1]).rotate(this.tans);
	       	this.tans += this.tanAcc;
	       	this.tans %= 360;
	       	this.speed.set(this.tanDir.e[0],this.tanDir.e[1]);
	    }
       
       	//自转
       	if(this.deltaSpin)
       		this.startSpin += this.deltaSpin * dt;
       
       	//更新引擎属性
       	this.x = this.sx + this.speed.e[0];
    	this.y = this.sy + this.speed.e[1];
    	if(this.deltaSpin)this.rotation = this.startSpin;
    }
    function initParticle(opts){
		var m = soya2d.Math;
		//初始化配置
		var ls = this.lifeSpan = opts.lifeSpan + opts.lifeSpanVar * Math.random();
		this.maxLifeSpan = ls;
		
		this.sx = opts.x + opts.xVar * Math.random();
		this.sy = opts.y + opts.yVar * Math.random();
		
		//方向速度
		var angle = opts.angle + opts.angleVar * Math.random();
		angle = m.floor(angle %= 360);
		this.angle = angle;
		var speed = opts.speed + opts.speedVar * Math.random();
		var tmp = new soya2d.Vector(m.COSTABLE[angle], m.SINTABLE[angle]);
		this.speed = tmp.clone().mul(speed);
		this.deltaSpeed = new soya2d.Vector(this.speed.e[0]/ls,this.speed.e[1]/ls);
		//径向加速
		this.radialAcc = tmp.mul(opts.radialAcc + opts.radialAccVar * Math.random());
		//切线角加速度
		this.tanAcc = opts.tanAcc + opts.tanAccVar * Math.random();
		if(this.tanAcc!==0){
			this.tans = this.tanAcc;
			this.tanDir = new soya2d.Vector(0,0);
		}
		
		//自转
		this.startSpin = opts.startSpin + opts.startSpinVar * Math.random();
		var endSpin = opts.endSpin + opts.endSpinVar * Math.random();
		this.deltaSpin = (endSpin - this.startSpin) / ls;
		if(this.startSpin === endSpin)this.deltaSpin = null;//不更新
		
	}
	function resetParticle(c) {
		this.initParticle(c);
		this.visible = true;
	}
};
soya2d.module.install('particle',{
    onUpdate:function(game,now,d){
    	soya2d.ParticleManager.update(now);
    },
    onStop:function(){
    	soya2d.ParticleManager.stop();
    }
});
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013 p2.js authors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
!function(a){if("object"==typeof exports)module.exports=a();else if("function"==typeof define&&define.amd)define(a);else{var b;"undefined"!=typeof window?b=window:"undefined"!=typeof global?b=global:"undefined"!=typeof self&&(b=self),b.p2=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){(function(b,d,e){function e(a,b,c){if(!(this instanceof e))return new e(a,b,c);var d=typeof a;if("base64"===b&&"string"===d)for(a=D(a);a.length%4!==0;)a+="=";var f;if("number"===d)f=G(a);else if("string"===d)f=e.byteLength(a,b);else{if("object"!==d)throw new Error("First argument needs to be a number, array or string.");f=G(a.length)}var g;e._useTypedArrays?g=E(new Uint8Array(f)):(g=this,g.length=f,g._isBuffer=!0);var h;if(e._useTypedArrays&&"function"==typeof Uint8Array&&a instanceof Uint8Array)g._set(a);else if(I(a))for(h=0;f>h;h++)g[h]=e.isBuffer(a)?a.readUInt8(h):a[h];else if("string"===d)g.write(a,0,b);else if("number"===d&&!e._useTypedArrays&&!c)for(h=0;f>h;h++)g[h]=0;return g}function f(a,b,c,d){c=Number(c)||0;var f=a.length-c;d?(d=Number(d),d>f&&(d=f)):d=f;var g=b.length;T(g%2===0,"Invalid hex string"),d>g/2&&(d=g/2);for(var h=0;d>h;h++){var i=parseInt(b.substr(2*h,2),16);T(!isNaN(i),"Invalid hex string"),a[c+h]=i}return e._charsWritten=2*h,h}function g(a,b,c,d){var f=e._charsWritten=O(K(b),a,c,d);return f}function h(a,b,c,d){var f=e._charsWritten=O(L(b),a,c,d);return f}function i(a,b,c,d){return h(a,b,c,d)}function j(a,b,c,d){var f=e._charsWritten=O(N(b),a,c,d);return f}function k(a,b,c,d){var f=e._charsWritten=O(M(b),a,c,d);return f}function l(a,b,c){return U.fromByteArray(0===b&&c===a.length?a:a.slice(b,c))}function m(a,b,c){var d="",e="";c=Math.min(a.length,c);for(var f=b;c>f;f++)a[f]<=127?(d+=P(e)+String.fromCharCode(a[f]),e=""):e+="%"+a[f].toString(16);return d+P(e)}function n(a,b,c){var d="";c=Math.min(a.length,c);for(var e=b;c>e;e++)d+=String.fromCharCode(a[e]);return d}function o(a,b,c){return n(a,b,c)}function p(a,b,c){var d=a.length;(!b||0>b)&&(b=0),(!c||0>c||c>d)&&(c=d);for(var e="",f=b;c>f;f++)e+=J(a[f]);return e}function q(a,b,c){for(var d=a.slice(b,c),e="",f=0;f<d.length;f+=2)e+=String.fromCharCode(d[f]+256*d[f+1]);return e}function r(a,b,c,d){d||(T("boolean"==typeof c,"missing or invalid endian"),T(void 0!==b&&null!==b,"missing offset"),T(b+1<a.length,"Trying to read beyond buffer length"));var e=a.length;if(!(b>=e)){var f;return c?(f=a[b],e>b+1&&(f|=a[b+1]<<8)):(f=a[b]<<8,e>b+1&&(f|=a[b+1])),f}}function s(a,b,c,d){d||(T("boolean"==typeof c,"missing or invalid endian"),T(void 0!==b&&null!==b,"missing offset"),T(b+3<a.length,"Trying to read beyond buffer length"));var e=a.length;if(!(b>=e)){var f;return c?(e>b+2&&(f=a[b+2]<<16),e>b+1&&(f|=a[b+1]<<8),f|=a[b],e>b+3&&(f+=a[b+3]<<24>>>0)):(e>b+1&&(f=a[b+1]<<16),e>b+2&&(f|=a[b+2]<<8),e>b+3&&(f|=a[b+3]),f+=a[b]<<24>>>0),f}}function t(a,b,c,d){d||(T("boolean"==typeof c,"missing or invalid endian"),T(void 0!==b&&null!==b,"missing offset"),T(b+1<a.length,"Trying to read beyond buffer length"));var e=a.length;if(!(b>=e)){var f=r(a,b,c,!0),g=32768&f;return g?-1*(65535-f+1):f}}function u(a,b,c,d){d||(T("boolean"==typeof c,"missing or invalid endian"),T(void 0!==b&&null!==b,"missing offset"),T(b+3<a.length,"Trying to read beyond buffer length"));var e=a.length;if(!(b>=e)){var f=s(a,b,c,!0),g=2147483648&f;return g?-1*(4294967295-f+1):f}}function v(a,b,c,d){return d||(T("boolean"==typeof c,"missing or invalid endian"),T(b+3<a.length,"Trying to read beyond buffer length")),V.read(a,b,c,23,4)}function w(a,b,c,d){return d||(T("boolean"==typeof c,"missing or invalid endian"),T(b+7<a.length,"Trying to read beyond buffer length")),V.read(a,b,c,52,8)}function x(a,b,c,d,e){e||(T(void 0!==b&&null!==b,"missing value"),T("boolean"==typeof d,"missing or invalid endian"),T(void 0!==c&&null!==c,"missing offset"),T(c+1<a.length,"trying to write beyond buffer length"),Q(b,65535));var f=a.length;if(!(c>=f))for(var g=0,h=Math.min(f-c,2);h>g;g++)a[c+g]=(b&255<<8*(d?g:1-g))>>>8*(d?g:1-g)}function y(a,b,c,d,e){e||(T(void 0!==b&&null!==b,"missing value"),T("boolean"==typeof d,"missing or invalid endian"),T(void 0!==c&&null!==c,"missing offset"),T(c+3<a.length,"trying to write beyond buffer length"),Q(b,4294967295));var f=a.length;if(!(c>=f))for(var g=0,h=Math.min(f-c,4);h>g;g++)a[c+g]=b>>>8*(d?g:3-g)&255}function z(a,b,c,d,e){e||(T(void 0!==b&&null!==b,"missing value"),T("boolean"==typeof d,"missing or invalid endian"),T(void 0!==c&&null!==c,"missing offset"),T(c+1<a.length,"Trying to write beyond buffer length"),R(b,32767,-32768));var f=a.length;c>=f||(b>=0?x(a,b,c,d,e):x(a,65535+b+1,c,d,e))}function A(a,b,c,d,e){e||(T(void 0!==b&&null!==b,"missing value"),T("boolean"==typeof d,"missing or invalid endian"),T(void 0!==c&&null!==c,"missing offset"),T(c+3<a.length,"Trying to write beyond buffer length"),R(b,2147483647,-2147483648));var f=a.length;c>=f||(b>=0?y(a,b,c,d,e):y(a,4294967295+b+1,c,d,e))}function B(a,b,c,d,e){e||(T(void 0!==b&&null!==b,"missing value"),T("boolean"==typeof d,"missing or invalid endian"),T(void 0!==c&&null!==c,"missing offset"),T(c+3<a.length,"Trying to write beyond buffer length"),S(b,3.4028234663852886e38,-3.4028234663852886e38));var f=a.length;c>=f||V.write(a,b,c,d,23,4)}function C(a,b,c,d,e){e||(T(void 0!==b&&null!==b,"missing value"),T("boolean"==typeof d,"missing or invalid endian"),T(void 0!==c&&null!==c,"missing offset"),T(c+7<a.length,"Trying to write beyond buffer length"),S(b,1.7976931348623157e308,-1.7976931348623157e308));var f=a.length;c>=f||V.write(a,b,c,d,52,8)}function D(a){return a.trim?a.trim():a.replace(/^\s+|\s+$/g,"")}function E(a){return a._isBuffer=!0,a._get=a.get,a._set=a.set,a.get=W.get,a.set=W.set,a.write=W.write,a.toString=W.toString,a.toLocaleString=W.toString,a.toJSON=W.toJSON,a.copy=W.copy,a.slice=W.slice,a.readUInt8=W.readUInt8,a.readUInt16LE=W.readUInt16LE,a.readUInt16BE=W.readUInt16BE,a.readUInt32LE=W.readUInt32LE,a.readUInt32BE=W.readUInt32BE,a.readInt8=W.readInt8,a.readInt16LE=W.readInt16LE,a.readInt16BE=W.readInt16BE,a.readInt32LE=W.readInt32LE,a.readInt32BE=W.readInt32BE,a.readFloatLE=W.readFloatLE,a.readFloatBE=W.readFloatBE,a.readDoubleLE=W.readDoubleLE,a.readDoubleBE=W.readDoubleBE,a.writeUInt8=W.writeUInt8,a.writeUInt16LE=W.writeUInt16LE,a.writeUInt16BE=W.writeUInt16BE,a.writeUInt32LE=W.writeUInt32LE,a.writeUInt32BE=W.writeUInt32BE,a.writeInt8=W.writeInt8,a.writeInt16LE=W.writeInt16LE,a.writeInt16BE=W.writeInt16BE,a.writeInt32LE=W.writeInt32LE,a.writeInt32BE=W.writeInt32BE,a.writeFloatLE=W.writeFloatLE,a.writeFloatBE=W.writeFloatBE,a.writeDoubleLE=W.writeDoubleLE,a.writeDoubleBE=W.writeDoubleBE,a.fill=W.fill,a.inspect=W.inspect,a.toArrayBuffer=W.toArrayBuffer,a}function F(a,b,c){return"number"!=typeof a?c:(a=~~a,a>=b?b:a>=0?a:(a+=b,a>=0?a:0))}function G(a){return a=~~Math.ceil(+a),0>a?0:a}function H(a){return(Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)})(a)}function I(a){return H(a)||e.isBuffer(a)||a&&"object"==typeof a&&"number"==typeof a.length}function J(a){return 16>a?"0"+a.toString(16):a.toString(16)}function K(a){for(var b=[],c=0;c<a.length;c++){var d=a.charCodeAt(c);if(127>=d)b.push(a.charCodeAt(c));else{var e=c;d>=55296&&57343>=d&&c++;for(var f=encodeURIComponent(a.slice(e,c+1)).substr(1).split("%"),g=0;g<f.length;g++)b.push(parseInt(f[g],16))}}return b}function L(a){for(var b=[],c=0;c<a.length;c++)b.push(255&a.charCodeAt(c));return b}function M(a){for(var b,c,d,e=[],f=0;f<a.length;f++)b=a.charCodeAt(f),c=b>>8,d=b%256,e.push(d),e.push(c);return e}function N(a){return U.toByteArray(a)}function O(a,b,c,d){for(var e=0;d>e&&!(e+c>=b.length||e>=a.length);e++)b[e+c]=a[e];return e}function P(a){try{return decodeURIComponent(a)}catch(b){return String.fromCharCode(65533)}}function Q(a,b){T("number"==typeof a,"cannot write a non-number as a number"),T(a>=0,"specified a negative value for writing an unsigned value"),T(b>=a,"value is larger than maximum value for type"),T(Math.floor(a)===a,"value has a fractional component")}function R(a,b,c){T("number"==typeof a,"cannot write a non-number as a number"),T(b>=a,"value larger than maximum allowed value"),T(a>=c,"value smaller than minimum allowed value"),T(Math.floor(a)===a,"value has a fractional component")}function S(a,b,c){T("number"==typeof a,"cannot write a non-number as a number"),T(b>=a,"value larger than maximum allowed value"),T(a>=c,"value smaller than minimum allowed value")}function T(a,b){if(!a)throw new Error(b||"Failed assertion")}var U=a("base64-js"),V=a("ieee754");c.Buffer=e,c.SlowBuffer=e,c.INSPECT_MAX_BYTES=50,e.poolSize=8192,e._useTypedArrays=function(){if("function"!=typeof Uint8Array||"function"!=typeof ArrayBuffer)return!1;try{var a=new Uint8Array(0);return a.foo=function(){return 42},42===a.foo()&&"function"==typeof a.subarray}catch(b){return!1}}(),e.isEncoding=function(a){switch(String(a).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},e.isBuffer=function(a){return!(null===a||void 0===a||!a._isBuffer)},e.byteLength=function(a,b){var c;switch(a+="",b||"utf8"){case"hex":c=a.length/2;break;case"utf8":case"utf-8":c=K(a).length;break;case"ascii":case"binary":case"raw":c=a.length;break;case"base64":c=N(a).length;break;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":c=2*a.length;break;default:throw new Error("Unknown encoding")}return c},e.concat=function(a,b){if(T(H(a),"Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."),0===a.length)return new e(0);if(1===a.length)return a[0];var c;if("number"!=typeof b)for(b=0,c=0;c<a.length;c++)b+=a[c].length;var d=new e(b),f=0;for(c=0;c<a.length;c++){var g=a[c];g.copy(d,f),f+=g.length}return d},e.prototype.write=function(a,b,c,d){if(isFinite(b))isFinite(c)||(d=c,c=void 0);else{var e=d;d=b,b=c,c=e}b=Number(b)||0;var l=this.length-b;c?(c=Number(c),c>l&&(c=l)):c=l,d=String(d||"utf8").toLowerCase();var m;switch(d){case"hex":m=f(this,a,b,c);break;case"utf8":case"utf-8":m=g(this,a,b,c);break;case"ascii":m=h(this,a,b,c);break;case"binary":m=i(this,a,b,c);break;case"base64":m=j(this,a,b,c);break;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":m=k(this,a,b,c);break;default:throw new Error("Unknown encoding")}return m},e.prototype.toString=function(a,b,c){var d=this;if(a=String(a||"utf8").toLowerCase(),b=Number(b)||0,c=void 0!==c?Number(c):c=d.length,c===b)return"";var e;switch(a){case"hex":e=p(d,b,c);break;case"utf8":case"utf-8":e=m(d,b,c);break;case"ascii":e=n(d,b,c);break;case"binary":e=o(d,b,c);break;case"base64":e=l(d,b,c);break;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":e=q(d,b,c);break;default:throw new Error("Unknown encoding")}return e},e.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},e.prototype.copy=function(a,b,c,d){var e=this;if(c||(c=0),d||0===d||(d=this.length),b||(b=0),d!==c&&0!==a.length&&0!==e.length){T(d>=c,"sourceEnd < sourceStart"),T(b>=0&&b<a.length,"targetStart out of bounds"),T(c>=0&&c<e.length,"sourceStart out of bounds"),T(d>=0&&d<=e.length,"sourceEnd out of bounds"),d>this.length&&(d=this.length),a.length-b<d-c&&(d=a.length-b+c);for(var f=0;d-c>f;f++)a[f+b]=this[f+c]}},e.prototype.slice=function(a,b){var c=this.length;if(a=F(a,c,0),b=F(b,c,c),e._useTypedArrays)return E(this.subarray(a,b));for(var d=b-a,f=new e(d,void 0,!0),g=0;d>g;g++)f[g]=this[g+a];return f},e.prototype.get=function(a){return console.log(".get() is deprecated. Access using array indexes instead."),this.readUInt8(a)},e.prototype.set=function(a,b){return console.log(".set() is deprecated. Access using array indexes instead."),this.writeUInt8(a,b)},e.prototype.readUInt8=function(a,b){return b||(T(void 0!==a&&null!==a,"missing offset"),T(a<this.length,"Trying to read beyond buffer length")),a>=this.length?void 0:this[a]},e.prototype.readUInt16LE=function(a,b){return r(this,a,!0,b)},e.prototype.readUInt16BE=function(a,b){return r(this,a,!1,b)},e.prototype.readUInt32LE=function(a,b){return s(this,a,!0,b)},e.prototype.readUInt32BE=function(a,b){return s(this,a,!1,b)},e.prototype.readInt8=function(a,b){if(b||(T(void 0!==a&&null!==a,"missing offset"),T(a<this.length,"Trying to read beyond buffer length")),!(a>=this.length)){var c=128&this[a];return c?-1*(255-this[a]+1):this[a]}},e.prototype.readInt16LE=function(a,b){return t(this,a,!0,b)},e.prototype.readInt16BE=function(a,b){return t(this,a,!1,b)},e.prototype.readInt32LE=function(a,b){return u(this,a,!0,b)},e.prototype.readInt32BE=function(a,b){return u(this,a,!1,b)},e.prototype.readFloatLE=function(a,b){return v(this,a,!0,b)},e.prototype.readFloatBE=function(a,b){return v(this,a,!1,b)},e.prototype.readDoubleLE=function(a,b){return w(this,a,!0,b)},e.prototype.readDoubleBE=function(a,b){return w(this,a,!1,b)},e.prototype.writeUInt8=function(a,b,c){c||(T(void 0!==a&&null!==a,"missing value"),T(void 0!==b&&null!==b,"missing offset"),T(b<this.length,"trying to write beyond buffer length"),Q(a,255)),b>=this.length||(this[b]=a)},e.prototype.writeUInt16LE=function(a,b,c){x(this,a,b,!0,c)},e.prototype.writeUInt16BE=function(a,b,c){x(this,a,b,!1,c)},e.prototype.writeUInt32LE=function(a,b,c){y(this,a,b,!0,c)},e.prototype.writeUInt32BE=function(a,b,c){y(this,a,b,!1,c)},e.prototype.writeInt8=function(a,b,c){c||(T(void 0!==a&&null!==a,"missing value"),T(void 0!==b&&null!==b,"missing offset"),T(b<this.length,"Trying to write beyond buffer length"),R(a,127,-128)),b>=this.length||(a>=0?this.writeUInt8(a,b,c):this.writeUInt8(255+a+1,b,c))},e.prototype.writeInt16LE=function(a,b,c){z(this,a,b,!0,c)},e.prototype.writeInt16BE=function(a,b,c){z(this,a,b,!1,c)},e.prototype.writeInt32LE=function(a,b,c){A(this,a,b,!0,c)},e.prototype.writeInt32BE=function(a,b,c){A(this,a,b,!1,c)},e.prototype.writeFloatLE=function(a,b,c){B(this,a,b,!0,c)},e.prototype.writeFloatBE=function(a,b,c){B(this,a,b,!1,c)},e.prototype.writeDoubleLE=function(a,b,c){C(this,a,b,!0,c)},e.prototype.writeDoubleBE=function(a,b,c){C(this,a,b,!1,c)},e.prototype.fill=function(a,b,c){if(a||(a=0),b||(b=0),c||(c=this.length),"string"==typeof a&&(a=a.charCodeAt(0)),T("number"==typeof a&&!isNaN(a),"value is not a number"),T(c>=b,"end < start"),c!==b&&0!==this.length){T(b>=0&&b<this.length,"start out of bounds"),T(c>=0&&c<=this.length,"end out of bounds");for(var d=b;c>d;d++)this[d]=a}},e.prototype.inspect=function(){for(var a=[],b=this.length,d=0;b>d;d++)if(a[d]=J(this[d]),d===c.INSPECT_MAX_BYTES){a[d+1]="...";break}return"<Buffer "+a.join(" ")+">"},e.prototype.toArrayBuffer=function(){if("function"==typeof Uint8Array){if(e._useTypedArrays)return new e(this).buffer;for(var a=new Uint8Array(this.length),b=0,c=a.length;c>b;b+=1)a[b]=this[b];return a.buffer}throw new Error("Buffer.toArrayBuffer not supported in this browser")};var W=e.prototype}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/grunt-browserify/node_modules/browserify/node_modules/buffer/index.js","/../node_modules/grunt-browserify/node_modules/browserify/node_modules/buffer")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,"base64-js":2,buffer:1,ieee754:3}],2:[function(a,b){(function(){var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";!function(){"use strict";function c(a){var b=a.charCodeAt(0);return b===g?62:b===h?63:i>b?-1:i+10>b?b-i+26+26:k+26>b?b-k:j+26>b?b-j+26:void 0}function d(a){function b(a){j[l++]=a}var d,e,g,h,i,j;if(a.length%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var k=a.length;i="="===a.charAt(k-2)?2:"="===a.charAt(k-1)?1:0,j=new f(3*a.length/4-i),g=i>0?a.length-4:a.length;var l=0;for(d=0,e=0;g>d;d+=4,e+=3)h=c(a.charAt(d))<<18|c(a.charAt(d+1))<<12|c(a.charAt(d+2))<<6|c(a.charAt(d+3)),b((16711680&h)>>16),b((65280&h)>>8),b(255&h);return 2===i?(h=c(a.charAt(d))<<2|c(a.charAt(d+1))>>4,b(255&h)):1===i&&(h=c(a.charAt(d))<<10|c(a.charAt(d+1))<<4|c(a.charAt(d+2))>>2,b(h>>8&255),b(255&h)),j}function e(b){function c(b){return a.charAt(b)}function d(a){return c(a>>18&63)+c(a>>12&63)+c(a>>6&63)+c(63&a)}var e,f,g,h=b.length%3,i="";for(e=0,g=b.length-h;g>e;e+=3)f=(b[e]<<16)+(b[e+1]<<8)+b[e+2],i+=d(f);switch(h){case 1:f=b[b.length-1],i+=c(f>>2),i+=c(f<<4&63),i+="==";break;case 2:f=(b[b.length-2]<<8)+b[b.length-1],i+=c(f>>10),i+=c(f>>4&63),i+=c(f<<2&63),i+="="}return i}var f="undefined"!=typeof Uint8Array?Uint8Array:Array,g=("0".charCodeAt(0),"+".charCodeAt(0)),h="/".charCodeAt(0),i="0".charCodeAt(0),j="a".charCodeAt(0),k="A".charCodeAt(0);b.exports.toByteArray=d,b.exports.fromByteArray=e}()}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/grunt-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js","/../node_modules/grunt-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],3:[function(a,b,c){(function(){c.read=function(a,b,c,d,e){var f,g,h=8*e-d-1,i=(1<<h)-1,j=i>>1,k=-7,l=c?e-1:0,m=c?-1:1,n=a[b+l];for(l+=m,f=n&(1<<-k)-1,n>>=-k,k+=h;k>0;f=256*f+a[b+l],l+=m,k-=8);for(g=f&(1<<-k)-1,f>>=-k,k+=d;k>0;g=256*g+a[b+l],l+=m,k-=8);if(0===f)f=1-j;else{if(f===i)return g?0/0:1/0*(n?-1:1);g+=Math.pow(2,d),f-=j}return(n?-1:1)*g*Math.pow(2,f-d)},c.write=function(a,b,c,d,e,f){var g,h,i,j=8*f-e-1,k=(1<<j)-1,l=k>>1,m=23===e?Math.pow(2,-24)-Math.pow(2,-77):0,n=d?0:f-1,o=d?1:-1,p=0>b||0===b&&0>1/b?1:0;for(b=Math.abs(b),isNaN(b)||1/0===b?(h=isNaN(b)?1:0,g=k):(g=Math.floor(Math.log(b)/Math.LN2),b*(i=Math.pow(2,-g))<1&&(g--,i*=2),b+=g+l>=1?m/i:m*Math.pow(2,1-l),b*i>=2&&(g++,i/=2),g+l>=k?(h=0,g=k):g+l>=1?(h=(b*i-1)*Math.pow(2,e),g+=l):(h=b*Math.pow(2,l-1)*Math.pow(2,e),g=0));e>=8;a[c+n]=255&h,n+=o,h/=256,e-=8);for(g=g<<e|h,j+=e;j>0;a[c+n]=255&g,n+=o,g/=256,j-=8);a[c+n-o]|=128*p}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/grunt-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js","/../node_modules/grunt-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],4:[function(a,b){(function(a){function c(){}var a=b.exports={};a.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),a.title="browser",a.browser=!0,a.env={},a.argv=[],a.on=c,a.once=c,a.off=c,a.emit=c,a.binding=function(){throw new Error("process.binding is not supported")},a.cwd=function(){return"/"},a.chdir=function(){throw new Error("process.chdir is not supported")}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js","/../node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],5:[function(a,b){(function(){function c(){}var d=a("./Scalar");b.exports=c,c.lineInt=function(a,b,c){c=c||0;var e,f,g,h,i,j,k,l=[0,0];return e=a[1][1]-a[0][1],f=a[0][0]-a[1][0],g=e*a[0][0]+f*a[0][1],h=b[1][1]-b[0][1],i=b[0][0]-b[1][0],j=h*b[0][0]+i*b[0][1],k=e*i-h*f,d.eq(k,0,c)||(l[0]=(i*g-f*j)/k,l[1]=(e*j-h*g)/k),l},c.segmentsIntersect=function(a,b,c,d){var e=b[0]-a[0],f=b[1]-a[1],g=d[0]-c[0],h=d[1]-c[1];if(g*f-h*e==0)return!1;var i=(e*(c[1]-a[1])+f*(a[0]-c[0]))/(g*f-h*e),j=(g*(a[1]-c[1])+h*(c[0]-a[0]))/(h*e-g*f);return i>=0&&1>=i&&j>=0&&1>=j}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/poly-decomp/src/Line.js","/../node_modules/poly-decomp/src")},{"./Scalar":8,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],6:[function(a,b){(function(){function a(){}b.exports=a,a.area=function(a,b,c){return(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1])},a.left=function(b,c,d){return a.area(b,c,d)>0},a.leftOn=function(b,c,d){return a.area(b,c,d)>=0},a.right=function(b,c,d){return a.area(b,c,d)<0},a.rightOn=function(b,c,d){return a.area(b,c,d)<=0};var c=[],d=[];a.collinear=function(b,e,f,g){if(g){var h=c,i=d;h[0]=e[0]-b[0],h[1]=e[1]-b[1],i[0]=f[0]-e[0],i[1]=f[1]-e[1];var j=h[0]*i[0]+h[1]*i[1],k=Math.sqrt(h[0]*h[0]+h[1]*h[1]),l=Math.sqrt(i[0]*i[0]+i[1]*i[1]),m=Math.acos(j/(k*l));return g>m}return 0==a.area(b,e,f)},a.sqdist=function(a,b){var c=b[0]-a[0],d=b[1]-a[1];return c*c+d*d}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/poly-decomp/src/Point.js","/../node_modules/poly-decomp/src")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],7:[function(a,b){(function(){function c(){this.vertices=[]}function d(a,b,c,d,e){e=e||0;var f=b[1]-a[1],h=a[0]-b[0],i=f*a[0]+h*a[1],j=d[1]-c[1],k=c[0]-d[0],l=j*c[0]+k*c[1],m=f*k-j*h;return g.eq(m,0,e)?[0,0]:[(k*i-h*l)/m,(f*l-j*i)/m]}var e=a("./Line"),f=a("./Point"),g=a("./Scalar");b.exports=c,c.prototype.at=function(a){var b=this.vertices,c=b.length;return b[0>a?a%c+c:a%c]},c.prototype.first=function(){return this.vertices[0]},c.prototype.last=function(){return this.vertices[this.vertices.length-1]},c.prototype.clear=function(){this.vertices.length=0},c.prototype.append=function(a,b,c){if("undefined"==typeof b)throw new Error("From is not given!");if("undefined"==typeof c)throw new Error("To is not given!");if(b>c-1)throw new Error("lol1");if(c>a.vertices.length)throw new Error("lol2");if(0>b)throw new Error("lol3");for(var d=b;c>d;d++)this.vertices.push(a.vertices[d])},c.prototype.makeCCW=function(){for(var a=0,b=this.vertices,c=1;c<this.vertices.length;++c)(b[c][1]<b[a][1]||b[c][1]==b[a][1]&&b[c][0]>b[a][0])&&(a=c);f.left(this.at(a-1),this.at(a),this.at(a+1))||this.reverse()},c.prototype.reverse=function(){for(var a=[],b=0,c=this.vertices.length;b!==c;b++)a.push(this.vertices.pop());this.vertices=a},c.prototype.isReflex=function(a){return f.right(this.at(a-1),this.at(a),this.at(a+1))};var h=[],i=[];c.prototype.canSee=function(a,b){var c,d,g=h,j=i;if(f.leftOn(this.at(a+1),this.at(a),this.at(b))&&f.rightOn(this.at(a-1),this.at(a),this.at(b)))return!1;d=f.sqdist(this.at(a),this.at(b));for(var k=0;k!==this.vertices.length;++k)if((k+1)%this.vertices.length!==a&&k!==a&&f.leftOn(this.at(a),this.at(b),this.at(k+1))&&f.rightOn(this.at(a),this.at(b),this.at(k))&&(g[0]=this.at(a),g[1]=this.at(b),j[0]=this.at(k),j[1]=this.at(k+1),c=e.lineInt(g,j),f.sqdist(this.at(a),c)<d))return!1;return!0},c.prototype.copy=function(a,b,d){var e=d||new c;if(e.clear(),b>a)for(var f=a;b>=f;f++)e.vertices.push(this.vertices[f]);else{for(var f=0;b>=f;f++)e.vertices.push(this.vertices[f]);for(var f=a;f<this.vertices.length;f++)e.vertices.push(this.vertices[f])}return e},c.prototype.getCutEdges=function(){for(var a=[],b=[],d=[],e=new c,f=Number.MAX_VALUE,g=0;g<this.vertices.length;++g)if(this.isReflex(g))for(var h=0;h<this.vertices.length;++h)if(this.canSee(g,h)){b=this.copy(g,h,e).getCutEdges(),d=this.copy(h,g,e).getCutEdges();for(var i=0;i<d.length;i++)b.push(d[i]);b.length<f&&(a=b,f=b.length,a.push([this.at(g),this.at(h)]))}return a},c.prototype.decomp=function(){var a=this.getCutEdges();return a.length>0?this.slice(a):[this]},c.prototype.slice=function(a){if(0==a.length)return[this];if(a instanceof Array&&a.length&&a[0]instanceof Array&&2==a[0].length&&a[0][0]instanceof Array){for(var b=[this],c=0;c<a.length;c++)for(var d=a[c],e=0;e<b.length;e++){var f=b[e],g=f.slice(d);if(g){b.splice(e,1),b.push(g[0],g[1]);break}}return b}var d=a,c=this.vertices.indexOf(d[0]),e=this.vertices.indexOf(d[1]);return-1!=c&&-1!=e?[this.copy(c,e),this.copy(e,c)]:!1},c.prototype.isSimple=function(){for(var a=this.vertices,b=0;b<a.length-1;b++)for(var c=0;b-1>c;c++)if(e.segmentsIntersect(a[b],a[b+1],a[c],a[c+1]))return!1;for(var b=1;b<a.length-2;b++)if(e.segmentsIntersect(a[0],a[a.length-1],a[b],a[b+1]))return!1;return!0},c.prototype.quickDecomp=function(a,b,e,g,h,i){h=h||100,i=i||0,g=g||25,a="undefined"!=typeof a?a:[],b=b||[],e=e||[];var j=[0,0],k=[0,0],l=[0,0],m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=new c,u=new c,v=this,w=this.vertices;if(w.length<3)return a;if(i++,i>h)return console.warn("quickDecomp: max level ("+h+") reached."),a;for(var x=0;x<this.vertices.length;++x)if(v.isReflex(x)){b.push(v.vertices[x]),m=n=Number.MAX_VALUE;for(var y=0;y<this.vertices.length;++y)f.left(v.at(x-1),v.at(x),v.at(y))&&f.rightOn(v.at(x-1),v.at(x),v.at(y-1))&&(l=d(v.at(x-1),v.at(x),v.at(y),v.at(y-1)),f.right(v.at(x+1),v.at(x),l)&&(o=f.sqdist(v.vertices[x],l),n>o&&(n=o,k=l,r=y))),f.left(v.at(x+1),v.at(x),v.at(y+1))&&f.rightOn(v.at(x+1),v.at(x),v.at(y))&&(l=d(v.at(x+1),v.at(x),v.at(y),v.at(y+1)),f.left(v.at(x-1),v.at(x),l)&&(o=f.sqdist(v.vertices[x],l),m>o&&(m=o,j=l,q=y)));if(r==(q+1)%this.vertices.length)l[0]=(k[0]+j[0])/2,l[1]=(k[1]+j[1])/2,e.push(l),q>x?(t.append(v,x,q+1),t.vertices.push(l),u.vertices.push(l),0!=r&&u.append(v,r,v.vertices.length),u.append(v,0,x+1)):(0!=x&&t.append(v,x,v.vertices.length),t.append(v,0,q+1),t.vertices.push(l),u.vertices.push(l),u.append(v,r,x+1));else{if(r>q&&(q+=this.vertices.length),p=Number.MAX_VALUE,r>q)return a;for(var y=r;q>=y;++y)f.leftOn(v.at(x-1),v.at(x),v.at(y))&&f.rightOn(v.at(x+1),v.at(x),v.at(y))&&(o=f.sqdist(v.at(x),v.at(y)),p>o&&(p=o,s=y%this.vertices.length));s>x?(t.append(v,x,s+1),0!=s&&u.append(v,s,w.length),u.append(v,0,x+1)):(0!=x&&t.append(v,x,w.length),t.append(v,0,s+1),u.append(v,s,x+1))}return t.vertices.length<u.vertices.length?(t.quickDecomp(a,b,e,g,h,i),u.quickDecomp(a,b,e,g,h,i)):(u.quickDecomp(a,b,e,g,h,i),t.quickDecomp(a,b,e,g,h,i)),a}return a.push(this),a},c.prototype.removeCollinearPoints=function(a){for(var b=0,c=this.vertices.length-1;this.vertices.length>3&&c>=0;--c)f.collinear(this.at(c-1),this.at(c),this.at(c+1),a)&&(this.vertices.splice(c%this.vertices.length,1),c--,b++);return b}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/poly-decomp/src/Polygon.js","/../node_modules/poly-decomp/src")},{"./Line":5,"./Point":6,"./Scalar":8,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],8:[function(a,b){(function(){function a(){}b.exports=a,a.eq=function(a,b,c){return c=c||0,Math.abs(a-b)<c}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/poly-decomp/src/Scalar.js","/../node_modules/poly-decomp/src")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],9:[function(a,b){(function(){b.exports={Polygon:a("./Polygon"),Point:a("./Point")}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/poly-decomp/src/index.js","/../node_modules/poly-decomp/src")},{"./Point":6,"./Polygon":7,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],10:[function(a,b){b.exports={name:"p2",version:"0.6.0",description:"A JavaScript 2D physics engine.",author:"Stefan Hedman <schteppe@gmail.com> (http://steffe.se)",keywords:["p2.js","p2","physics","engine","2d"],main:"./src/p2.js",engines:{node:"*"},repository:{type:"git",url:"https://github.com/schteppe/p2.js.git"},bugs:{url:"https://github.com/schteppe/p2.js/issues"},licenses:[{type:"MIT"}],devDependencies:{grunt:"~0.4.0","grunt-contrib-jshint":"~0.9.2","grunt-contrib-nodeunit":"~0.1.2","grunt-contrib-uglify":"~0.4.0","grunt-contrib-watch":"~0.5.0","grunt-browserify":"~2.0.1","grunt-contrib-concat":"^0.4.0"},dependencies:{"poly-decomp":"0.1.0"}}},{}],11:[function(a,b){(function(){function c(a){this.lowerBound=d.create(),a&&a.lowerBound&&d.copy(this.lowerBound,a.lowerBound),this.upperBound=d.create(),a&&a.upperBound&&d.copy(this.upperBound,a.upperBound)}{var d=a("../math/vec2");a("../utils/Utils")}b.exports=c;var e=d.create();c.prototype.setFromPoints=function(a,b,c,f){var g=this.lowerBound,h=this.upperBound;"number"!=typeof c&&(c=0),0!==c?d.rotate(g,a[0],c):d.copy(g,a[0]),d.copy(h,g);for(var i=Math.cos(c),j=Math.sin(c),k=1;k<a.length;k++){var l=a[k];if(0!==c){var m=l[0],n=l[1];e[0]=i*m-j*n,e[1]=j*m+i*n,l=e}for(var o=0;2>o;o++)l[o]>h[o]&&(h[o]=l[o]),l[o]<g[o]&&(g[o]=l[o])}b&&(d.add(this.lowerBound,this.lowerBound,b),d.add(this.upperBound,this.upperBound,b)),f&&(this.lowerBound[0]-=f,this.lowerBound[1]-=f,this.upperBound[0]+=f,this.upperBound[1]+=f)},c.prototype.copy=function(a){d.copy(this.lowerBound,a.lowerBound),d.copy(this.upperBound,a.upperBound)
},c.prototype.extend=function(a){for(var b=2;b--;){var c=a.lowerBound[b];this.lowerBound[b]>c&&(this.lowerBound[b]=c);var d=a.upperBound[b];this.upperBound[b]<d&&(this.upperBound[b]=d)}},c.prototype.overlaps=function(a){var b=this.lowerBound,c=this.upperBound,d=a.lowerBound,e=a.upperBound;return(d[0]<=c[0]&&c[0]<=e[0]||b[0]<=e[0]&&e[0]<=c[0])&&(d[1]<=c[1]&&c[1]<=e[1]||b[1]<=e[1]&&e[1]<=c[1])}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/collision/AABB.js","/collision")},{"../math/vec2":33,"../utils/Utils":52,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],12:[function(a,b){(function(){function c(a){this.type=a,this.result=[],this.world=null,this.boundingVolumeType=c.AABB}var d=a("../math/vec2"),e=a("../objects/Body");b.exports=c,c.AABB=1,c.BOUNDING_CIRCLE=2,c.prototype.setWorld=function(a){this.world=a},c.prototype.getCollisionPairs=function(){throw new Error("getCollisionPairs must be implemented in a subclass!")};var f=d.create();c.boundingRadiusCheck=function(a,b){d.sub(f,a.position,b.position);var c=d.squaredLength(f),e=a.boundingRadius+b.boundingRadius;return e*e>=c},c.aabbCheck=function(a,b){return a.aabbNeedsUpdate&&a.updateAABB(),b.aabbNeedsUpdate&&b.updateAABB(),a.aabb.overlaps(b.aabb)},c.prototype.boundingVolumeCheck=function(a,b){var d;switch(this.boundingVolumeType){case c.BOUNDING_CIRCLE:d=c.boundingRadiusCheck(a,b);break;case c.AABB:d=c.aabbCheck(a,b);break;default:throw new Error("Bounding volume type not recognized: "+this.boundingVolumeType)}return d},c.canCollide=function(a,b){return a.type===e.STATIC&&b.type===e.STATIC?!1:a.type===e.KINEMATIC&&b.type===e.STATIC||a.type===e.STATIC&&b.type===e.KINEMATIC?!1:a.type===e.KINEMATIC&&b.type===e.KINEMATIC?!1:a.sleepState===e.SLEEPING&&b.sleepState===e.SLEEPING?!1:a.sleepState===e.SLEEPING&&b.type===e.STATIC||b.sleepState===e.SLEEPING&&a.type===e.STATIC?!1:!0},c.NAIVE=1,c.SAP=2}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/collision/Broadphase.js","/collision")},{"../math/vec2":33,"../objects/Body":34,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],13:[function(a,b){(function(){function c(a){d.apply(this),a=e.defaults(a,{xmin:-100,xmax:100,ymin:-100,ymax:100,nx:10,ny:10}),this.xmin=a.xmin,this.ymin=a.ymin,this.xmax=a.xmax,this.ymax=a.ymax,this.nx=a.nx,this.ny=a.ny,this.binsizeX=(this.xmax-this.xmin)/this.nx,this.binsizeY=(this.ymax-this.ymin)/this.ny}var d=(a("../shapes/Circle"),a("../shapes/Plane"),a("../shapes/Particle"),a("../collision/Broadphase")),e=(a("../math/vec2"),a("../utils/Utils"));b.exports=c,c.prototype=new d,c.prototype.getCollisionPairs=function(a){for(var b=[],c=a.bodies,e=c.length,f=(this.binsizeX,this.binsizeY,this.nx),g=this.ny,h=this.xmin,i=this.ymin,j=this.xmax,k=this.ymax,l=[],m=f*g,n=0;m>n;n++)l.push([]);for(var o=f/(j-h),p=g/(k-i),n=0;n!==e;n++)for(var q=c[n],r=q.aabb,s=Math.max(r.lowerBound[0],h),t=Math.max(r.lowerBound[1],i),u=Math.min(r.upperBound[0],j),v=Math.min(r.upperBound[1],k),w=Math.floor(o*(s-h)),x=Math.floor(p*(t-i)),y=Math.floor(o*(u-h)),z=Math.floor(p*(v-i)),A=w;y>=A;A++)for(var B=x;z>=B;B++){var C=A,D=B,E=C*(g-1)+D;E>=0&&m>E&&l[E].push(q)}for(var n=0;n!==m;n++)for(var F=l[n],A=0,G=F.length;A!==G;A++)for(var q=F[A],B=0;B!==A;B++){var H=F[B];d.canCollide(q,H)&&this.boundingVolumeCheck(q,H)&&b.push(q,H)}return b}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/collision/GridBroadphase.js","/collision")},{"../collision/Broadphase":12,"../math/vec2":33,"../shapes/Circle":40,"../shapes/Particle":44,"../shapes/Plane":45,"../utils/Utils":52,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],14:[function(a,b){(function(){function c(){d.call(this,d.NAIVE)}{var d=(a("../shapes/Circle"),a("../shapes/Plane"),a("../shapes/Shape"),a("../shapes/Particle"),a("../collision/Broadphase"));a("../math/vec2")}b.exports=c,c.prototype=new d,c.prototype.getCollisionPairs=function(a){var b=a.bodies,c=this.result;c.length=0;for(var e=0,f=b.length;e!==f;e++)for(var g=b[e],h=0;e>h;h++){var i=b[h];d.canCollide(g,i)&&this.boundingVolumeCheck(g,i)&&c.push(g,i)}return c}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/collision/NaiveBroadphase.js","/collision")},{"../collision/Broadphase":12,"../math/vec2":33,"../shapes/Circle":40,"../shapes/Particle":44,"../shapes/Plane":45,"../shapes/Shape":47,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],15:[function(a,b){(function(){function c(){this.contactEquations=[],this.frictionEquations=[],this.enableFriction=!0,this.slipForce=10,this.frictionCoefficient=.3,this.surfaceVelocity=0,this.reuseObjects=!0,this.reusableContactEquations=[],this.reusableFrictionEquations=[],this.restitution=0,this.stiffness=l.DEFAULT_STIFFNESS,this.relaxation=l.DEFAULT_RELAXATION,this.frictionStiffness=l.DEFAULT_STIFFNESS,this.frictionRelaxation=l.DEFAULT_RELAXATION,this.enableFrictionReduction=!0,this.collidingBodiesLastStep=new k,this.contactSkinSize=.01}function d(a,b){f.set(a.vertices[0],.5*-b.length,-b.radius),f.set(a.vertices[1],.5*b.length,-b.radius),f.set(a.vertices[2],.5*b.length,b.radius),f.set(a.vertices[3],.5*-b.length,b.radius)}function e(a,b,c,d){for(var e=R,i=S,j=T,k=U,l=a,m=b.vertices,n=null,o=0;o!==m.length+1;o++){var p=m[o%m.length],q=m[(o+1)%m.length];f.rotate(e,p,d),f.rotate(i,q,d),h(e,e,c),h(i,i,c),g(j,e,l),g(k,i,l);var r=f.crossLength(j,k);if(null===n&&(n=r),0>=r*n)return!1;n=r}return!0}var f=a("../math/vec2"),g=f.sub,h=f.add,i=f.dot,j=a("../utils/Utils"),k=a("../utils/TupleDictionary"),l=a("../equations/Equation"),m=a("../equations/ContactEquation"),n=a("../equations/FrictionEquation"),o=a("../shapes/Circle"),p=a("../shapes/Convex"),q=a("../shapes/Shape"),r=(a("../objects/Body"),a("../shapes/Rectangle"));b.exports=c;var s=f.fromValues(0,1),t=f.fromValues(0,0),u=f.fromValues(0,0),v=f.fromValues(0,0),w=f.fromValues(0,0),x=f.fromValues(0,0),y=f.fromValues(0,0),z=f.fromValues(0,0),A=f.fromValues(0,0),B=f.fromValues(0,0),C=f.fromValues(0,0),D=f.fromValues(0,0),E=f.fromValues(0,0),F=f.fromValues(0,0),G=f.fromValues(0,0),H=f.fromValues(0,0),I=f.fromValues(0,0),J=f.fromValues(0,0),K=f.fromValues(0,0),L=[];c.prototype.collidedLastStep=function(a,b){var c=0|a.id,d=0|b.id;return!!this.collidingBodiesLastStep.get(c,d)},c.prototype.reset=function(){this.collidingBodiesLastStep.reset();for(var a=this.contactEquations,b=a.length;b--;){var c=a[b],d=c.bodyA.id,e=c.bodyB.id;this.collidingBodiesLastStep.set(d,e,!0)}if(this.reuseObjects){var f=this.contactEquations,g=this.frictionEquations,h=this.reusableFrictionEquations,i=this.reusableContactEquations;j.appendArray(i,f),j.appendArray(h,g)}this.contactEquations.length=this.frictionEquations.length=0},c.prototype.createContactEquation=function(a,b,c,d){var e=this.reusableContactEquations.length?this.reusableContactEquations.pop():new m(a,b);return e.bodyA=a,e.bodyB=b,e.shapeA=c,e.shapeB=d,e.restitution=this.restitution,e.firstImpact=!this.collidedLastStep(a,b),e.stiffness=this.stiffness,e.relaxation=this.relaxation,e.needsUpdate=!0,e.enabled=!0,e.offset=this.contactSkinSize,e},c.prototype.createFrictionEquation=function(a,b,c,d){var e=this.reusableFrictionEquations.length?this.reusableFrictionEquations.pop():new n(a,b);return e.bodyA=a,e.bodyB=b,e.shapeA=c,e.shapeB=d,e.setSlipForce(this.slipForce),e.frictionCoefficient=this.frictionCoefficient,e.relativeVelocity=this.surfaceVelocity,e.enabled=!0,e.needsUpdate=!0,e.stiffness=this.frictionStiffness,e.relaxation=this.frictionRelaxation,e.contactEquations.length=0,e},c.prototype.createFrictionFromContact=function(a){var b=this.createFrictionEquation(a.bodyA,a.bodyB,a.shapeA,a.shapeB);return f.copy(b.contactPointA,a.contactPointA),f.copy(b.contactPointB,a.contactPointB),f.rotate90cw(b.t,a.normalA),b.contactEquations.push(a),b},c.prototype.createFrictionFromAverage=function(a){if(!a)throw new Error("numContacts == 0!");{var b=this.contactEquations[this.contactEquations.length-1],c=this.createFrictionEquation(b.bodyA,b.bodyB,b.shapeA,b.shapeB),d=b.bodyA;b.bodyB}f.set(c.contactPointA,0,0),f.set(c.contactPointB,0,0),f.set(c.t,0,0);for(var e=0;e!==a;e++)b=this.contactEquations[this.contactEquations.length-1-e],b.bodyA===d?(f.add(c.t,c.t,b.normalA),f.add(c.contactPointA,c.contactPointA,b.contactPointA),f.add(c.contactPointB,c.contactPointB,b.contactPointB)):(f.sub(c.t,c.t,b.normalA),f.add(c.contactPointA,c.contactPointA,b.contactPointB),f.add(c.contactPointB,c.contactPointB,b.contactPointA)),c.contactEquations.push(b);var g=1/a;return f.scale(c.contactPointA,c.contactPointA,g),f.scale(c.contactPointB,c.contactPointB,g),f.normalize(c.t,c.t),f.rotate90cw(c.t,c.t),c},c.prototype[q.LINE|q.CONVEX]=c.prototype.convexLine=function(a,b,c,d,e,f,g,h,i){return i?!1:0},c.prototype[q.LINE|q.RECTANGLE]=c.prototype.lineRectangle=function(a,b,c,d,e,f,g,h,i){return i?!1:0};var M=new r(1,1),N=f.create();c.prototype[q.CAPSULE|q.CONVEX]=c.prototype[q.CAPSULE|q.RECTANGLE]=c.prototype.convexCapsule=function(a,b,c,e,g,h,i,j,k){var l=N;f.set(l,h.length/2,0),f.rotate(l,l,j),f.add(l,l,i);var m=this.circleConvex(g,h,l,j,a,b,c,e,k,h.radius);f.set(l,-h.length/2,0),f.rotate(l,l,j),f.add(l,l,i);var n=this.circleConvex(g,h,l,j,a,b,c,e,k,h.radius);if(k&&(m||n))return!0;var o=M;d(o,h);var p=this.convexConvex(a,b,c,e,g,o,i,j,k);return p+m+n},c.prototype[q.CAPSULE|q.LINE]=c.prototype.lineCapsule=function(a,b,c,d,e,f,g,h,i){return i?!1:0};var O=f.create(),P=f.create(),Q=new r(1,1);c.prototype[q.CAPSULE|q.CAPSULE]=c.prototype.capsuleCapsule=function(a,b,c,e,g,h,i,j,k){for(var l,m=O,n=P,o=0,p=0;2>p;p++){f.set(m,(0===p?-1:1)*b.length/2,0),f.rotate(m,m,e),f.add(m,m,c);for(var q=0;2>q;q++){f.set(n,(0===q?-1:1)*h.length/2,0),f.rotate(n,n,j),f.add(n,n,i),this.enableFrictionReduction&&(l=this.enableFriction,this.enableFriction=!1);var r=this.circleCircle(a,b,m,e,g,h,n,j,k,b.radius,h.radius);if(this.enableFrictionReduction&&(this.enableFriction=l),k&&r)return!0;o+=r}}this.enableFrictionReduction&&(l=this.enableFriction,this.enableFriction=!1);var s=Q;d(s,b);var t=this.convexCapsule(a,s,c,e,g,h,i,j,k);if(this.enableFrictionReduction&&(this.enableFriction=l),k&&t)return!0;if(o+=t,this.enableFrictionReduction){var l=this.enableFriction;this.enableFriction=!1}d(s,h);var u=this.convexCapsule(g,s,i,j,a,b,c,e,k);return this.enableFrictionReduction&&(this.enableFriction=l),k&&u?!0:(o+=u,this.enableFrictionReduction&&o&&this.enableFriction&&this.frictionEquations.push(this.createFrictionFromAverage(o)),o)},c.prototype[q.LINE|q.LINE]=c.prototype.lineLine=function(a,b,c,d,e,f,g,h,i){return i?!1:0},c.prototype[q.PLANE|q.LINE]=c.prototype.planeLine=function(a,b,c,d,e,j,k,l,m){var n=t,o=u,p=v,q=w,r=x,C=y,D=z,E=A,F=B,G=L,H=0;f.set(n,-j.length/2,0),f.set(o,j.length/2,0),f.rotate(p,n,l),f.rotate(q,o,l),h(p,p,k),h(q,q,k),f.copy(n,p),f.copy(o,q),g(r,o,n),f.normalize(C,r),f.rotate90cw(F,C),f.rotate(E,s,d),G[0]=n,G[1]=o;for(var I=0;I<G.length;I++){var J=G[I];g(D,J,c);var K=i(D,E);if(0>K){if(m)return!0;var M=this.createContactEquation(a,e,b,j);H++,f.copy(M.normalA,E),f.normalize(M.normalA,M.normalA),f.scale(D,E,K),g(M.contactPointA,J,D),g(M.contactPointA,M.contactPointA,a.position),g(M.contactPointB,J,k),h(M.contactPointB,M.contactPointB,k),g(M.contactPointB,M.contactPointB,e.position),this.contactEquations.push(M),this.enableFrictionReduction||this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(M))}}return m?!1:(this.enableFrictionReduction||H&&this.enableFriction&&this.frictionEquations.push(this.createFrictionFromAverage(H)),H)},c.prototype[q.PARTICLE|q.CAPSULE]=c.prototype.particleCapsule=function(a,b,c,d,e,f,g,h,i){return this.circleLine(a,b,c,d,e,f,g,h,i,f.radius,0)},c.prototype[q.CIRCLE|q.LINE]=c.prototype.circleLine=function(a,b,c,d,e,j,k,l,m,n,o){var n=n||0,o="undefined"!=typeof o?o:b.radius,p=t,q=u,r=v,s=w,H=x,I=y,J=z,K=A,M=B,N=C,O=D,P=E,Q=F,R=G,S=L;f.set(K,-j.length/2,0),f.set(M,j.length/2,0),f.rotate(N,K,l),f.rotate(O,M,l),h(N,N,k),h(O,O,k),f.copy(K,N),f.copy(M,O),g(I,M,K),f.normalize(J,I),f.rotate90cw(H,J),g(P,c,K);var T=i(P,H);g(s,K,k),g(Q,c,k);var U=o+n;if(Math.abs(T)<U){f.scale(p,H,T),g(r,c,p),f.scale(q,H,i(H,Q)),f.normalize(q,q),f.scale(q,q,n),h(r,r,q);var V=i(J,r),W=i(J,K),X=i(J,M);if(V>W&&X>V){if(m)return!0;var Y=this.createContactEquation(a,e,b,j);return f.scale(Y.normalA,p,-1),f.normalize(Y.normalA,Y.normalA),f.scale(Y.contactPointA,Y.normalA,o),h(Y.contactPointA,Y.contactPointA,c),g(Y.contactPointA,Y.contactPointA,a.position),g(Y.contactPointB,r,k),h(Y.contactPointB,Y.contactPointB,k),g(Y.contactPointB,Y.contactPointB,e.position),this.contactEquations.push(Y),this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(Y)),1}}S[0]=K,S[1]=M;for(var Z=0;Z<S.length;Z++){var $=S[Z];if(g(P,$,c),f.squaredLength(P)<Math.pow(U,2)){if(m)return!0;var Y=this.createContactEquation(a,e,b,j);return f.copy(Y.normalA,P),f.normalize(Y.normalA,Y.normalA),f.scale(Y.contactPointA,Y.normalA,o),h(Y.contactPointA,Y.contactPointA,c),g(Y.contactPointA,Y.contactPointA,a.position),g(Y.contactPointB,$,k),f.scale(R,Y.normalA,-n),h(Y.contactPointB,Y.contactPointB,R),h(Y.contactPointB,Y.contactPointB,k),g(Y.contactPointB,Y.contactPointB,e.position),this.contactEquations.push(Y),this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(Y)),1}}return 0},c.prototype[q.CIRCLE|q.CAPSULE]=c.prototype.circleCapsule=function(a,b,c,d,e,f,g,h,i){return this.circleLine(a,b,c,d,e,f,g,h,i,f.radius)},c.prototype[q.CIRCLE|q.CONVEX]=c.prototype[q.CIRCLE|q.RECTANGLE]=c.prototype.circleConvex=function(a,b,c,d,i,j,k,l,m,n){for(var n="number"==typeof n?n:b.radius,o=t,p=u,q=v,r=w,s=x,y=C,z=D,A=F,B=G,E=H,J=I,K=!1,L=Number.MAX_VALUE,M=j.vertices,N=0;N!==M.length+1;N++){var O=M[N%M.length],P=M[(N+1)%M.length];if(f.rotate(o,O,l),f.rotate(p,P,l),h(o,o,k),h(p,p,k),g(q,p,o),f.normalize(r,q),f.rotate90cw(s,r),f.scale(B,s,-b.radius),h(B,B,c),e(B,j,k,l)){f.sub(E,o,B);var Q=Math.abs(f.dot(E,s));L>Q&&(f.copy(J,B),L=Q,f.scale(A,s,Q),f.add(A,A,B),K=!0)}}if(K){if(m)return!0;var R=this.createContactEquation(a,i,b,j);return f.sub(R.normalA,J,c),f.normalize(R.normalA,R.normalA),f.scale(R.contactPointA,R.normalA,n),h(R.contactPointA,R.contactPointA,c),g(R.contactPointA,R.contactPointA,a.position),g(R.contactPointB,A,k),h(R.contactPointB,R.contactPointB,k),g(R.contactPointB,R.contactPointB,i.position),this.contactEquations.push(R),this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(R)),1}if(n>0)for(var N=0;N<M.length;N++){var S=M[N];if(f.rotate(z,S,l),h(z,z,k),g(y,z,c),f.squaredLength(y)<Math.pow(n,2)){if(m)return!0;var R=this.createContactEquation(a,i,b,j);return f.copy(R.normalA,y),f.normalize(R.normalA,R.normalA),f.scale(R.contactPointA,R.normalA,n),h(R.contactPointA,R.contactPointA,c),g(R.contactPointA,R.contactPointA,a.position),g(R.contactPointB,z,k),h(R.contactPointB,R.contactPointB,k),g(R.contactPointB,R.contactPointB,i.position),this.contactEquations.push(R),this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(R)),1}}return 0};var R=f.create(),S=f.create(),T=f.create(),U=f.create();c.prototype[q.PARTICLE|q.CONVEX]=c.prototype[q.PARTICLE|q.RECTANGLE]=c.prototype.particleConvex=function(a,b,c,d,j,k,l,m,n){var o=t,p=u,q=v,r=w,s=x,A=y,B=z,D=C,E=F,G=J,H=K,I=Number.MAX_VALUE,L=!1,M=k.vertices;if(!e(c,k,l,m))return 0;if(n)return!0;for(var N=0;N!==M.length+1;N++){var O=M[N%M.length],P=M[(N+1)%M.length];f.rotate(o,O,m),f.rotate(p,P,m),h(o,o,l),h(p,p,l),g(q,p,o),f.normalize(r,q),f.rotate90cw(s,r),g(D,c,o);{i(D,s)}g(A,o,l),g(B,c,l),f.sub(G,o,c);var Q=Math.abs(f.dot(G,s));I>Q&&(I=Q,f.scale(E,s,Q),f.add(E,E,c),f.copy(H,s),L=!0)}if(L){var R=this.createContactEquation(a,j,b,k);return f.scale(R.normalA,H,-1),f.normalize(R.normalA,R.normalA),f.set(R.contactPointA,0,0),h(R.contactPointA,R.contactPointA,c),g(R.contactPointA,R.contactPointA,a.position),g(R.contactPointB,E,l),h(R.contactPointB,R.contactPointB,l),g(R.contactPointB,R.contactPointB,j.position),this.contactEquations.push(R),this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(R)),1}return 0},c.prototype[q.CIRCLE]=c.prototype.circleCircle=function(a,b,c,d,e,i,j,k,l,m,n){var o=t,m=m||b.radius,n=n||i.radius;g(o,c,j);var p=m+n;if(f.squaredLength(o)>Math.pow(p,2))return 0;if(l)return!0;var q=this.createContactEquation(a,e,b,i);return g(q.normalA,j,c),f.normalize(q.normalA,q.normalA),f.scale(q.contactPointA,q.normalA,m),f.scale(q.contactPointB,q.normalA,-n),h(q.contactPointA,q.contactPointA,c),g(q.contactPointA,q.contactPointA,a.position),h(q.contactPointB,q.contactPointB,j),g(q.contactPointB,q.contactPointB,e.position),this.contactEquations.push(q),this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(q)),1},c.prototype[q.PLANE|q.CONVEX]=c.prototype[q.PLANE|q.RECTANGLE]=c.prototype.planeConvex=function(a,b,c,d,e,j,k,l,m){var n=t,o=u,p=v,q=0;f.rotate(o,s,d);for(var r=0;r!==j.vertices.length;r++){var w=j.vertices[r];if(f.rotate(n,w,l),h(n,n,k),g(p,n,c),i(p,o)<=0){if(m)return!0;q++;var x=this.createContactEquation(a,e,b,j);g(p,n,c),f.copy(x.normalA,o);var y=i(p,x.normalA);f.scale(p,x.normalA,y),g(x.contactPointB,n,e.position),g(x.contactPointA,n,p),g(x.contactPointA,x.contactPointA,a.position),this.contactEquations.push(x),this.enableFrictionReduction||this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(x))}}return this.enableFrictionReduction&&this.enableFriction&&q&&this.frictionEquations.push(this.createFrictionFromAverage(q)),q},c.prototype[q.PARTICLE|q.PLANE]=c.prototype.particlePlane=function(a,b,c,d,e,h,j,k,l){var m=t,n=u;k=k||0,g(m,c,j),f.rotate(n,s,k);var o=i(m,n);if(o>0)return 0;if(l)return!0;var p=this.createContactEquation(e,a,h,b);return f.copy(p.normalA,n),f.scale(m,p.normalA,o),g(p.contactPointA,c,m),g(p.contactPointA,p.contactPointA,e.position),g(p.contactPointB,c,a.position),this.contactEquations.push(p),this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(p)),1},c.prototype[q.CIRCLE|q.PARTICLE]=c.prototype.circleParticle=function(a,b,c,d,e,i,j,k,l){var m=t;if(g(m,j,c),f.squaredLength(m)>Math.pow(b.radius,2))return 0;if(l)return!0;var n=this.createContactEquation(a,e,b,i);return f.copy(n.normalA,m),f.normalize(n.normalA,n.normalA),f.scale(n.contactPointA,n.normalA,b.radius),h(n.contactPointA,n.contactPointA,c),g(n.contactPointA,n.contactPointA,a.position),g(n.contactPointB,j,e.position),this.contactEquations.push(n),this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(n)),1};{var V=new o(1),W=f.create(),X=f.create();f.create()}c.prototype[q.PLANE|q.CAPSULE]=c.prototype.planeCapsule=function(a,b,c,d,e,g,i,j,k){var l=W,m=X,n=V;f.set(l,-g.length/2,0),f.rotate(l,l,j),h(l,l,i),f.set(m,g.length/2,0),f.rotate(m,m,j),h(m,m,i),n.radius=g.radius;var o;this.enableFrictionReduction&&(o=this.enableFriction,this.enableFriction=!1);var p=this.circlePlane(e,n,l,0,a,b,c,d,k),q=this.circlePlane(e,n,m,0,a,b,c,d,k);if(this.enableFrictionReduction&&(this.enableFriction=o),k)return p||q;var r=p+q;return this.enableFrictionReduction&&r&&this.frictionEquations.push(this.createFrictionFromAverage(r)),r},c.prototype[q.CIRCLE|q.PLANE]=c.prototype.circlePlane=function(a,b,c,d,e,j,k,l,m){var n=a,o=b,p=c,q=e,r=k,w=l;w=w||0;var x=t,y=u,z=v;g(x,p,r),f.rotate(y,s,w);var A=i(y,x);if(A>o.radius)return 0;if(m)return!0;var B=this.createContactEquation(q,n,j,b);return f.copy(B.normalA,y),f.scale(B.contactPointB,B.normalA,-o.radius),h(B.contactPointB,B.contactPointB,p),g(B.contactPointB,B.contactPointB,n.position),f.scale(z,B.normalA,A),g(B.contactPointA,x,z),h(B.contactPointA,B.contactPointA,r),g(B.contactPointA,B.contactPointA,q.position),this.contactEquations.push(B),this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(B)),1},c.prototype[q.CONVEX]=c.prototype[q.CONVEX|q.RECTANGLE]=c.prototype[q.RECTANGLE]=c.prototype.convexConvex=function(a,b,d,e,j,k,l,m,n,o){var p=t,q=u,r=v,s=w,y=x,C=z,D=A,E=B,F=0,o="number"==typeof o?o:0,G=c.findSeparatingAxis(b,d,e,k,l,m,p);if(!G)return 0;g(D,l,d),i(p,D)>0&&f.scale(p,p,-1);var H=c.getClosestEdge(b,e,p,!0),I=c.getClosestEdge(k,m,p);if(-1===H||-1===I)return 0;for(var J=0;2>J;J++){var K=H,L=I,M=b,N=k,O=d,P=l,Q=e,R=m,S=a,T=j;if(0===J){var U;U=K,K=L,L=U,U=M,M=N,N=U,U=O,O=P,P=U,U=Q,Q=R,R=U,U=S,S=T,T=U}for(var V=L;L+2>V;V++){var W=N.vertices[(V+N.vertices.length)%N.vertices.length];f.rotate(q,W,R),h(q,q,P);for(var X=0,Y=K-1;K+2>Y;Y++){var Z=M.vertices[(Y+M.vertices.length)%M.vertices.length],$=M.vertices[(Y+1+M.vertices.length)%M.vertices.length];f.rotate(r,Z,Q),f.rotate(s,$,Q),h(r,r,O),h(s,s,O),g(y,s,r),f.rotate90cw(E,y),f.normalize(E,E),g(D,q,r);var _=i(E,D);(Y===K&&o>=_||Y!==K&&0>=_)&&X++}if(X>=3){if(n)return!0;var ab=this.createContactEquation(S,T,M,N);F++;var Z=M.vertices[K%M.vertices.length],$=M.vertices[(K+1)%M.vertices.length];f.rotate(r,Z,Q),f.rotate(s,$,Q),h(r,r,O),h(s,s,O),g(y,s,r),f.rotate90cw(ab.normalA,y),f.normalize(ab.normalA,ab.normalA),g(D,q,r);var _=i(ab.normalA,D);f.scale(C,ab.normalA,_),g(ab.contactPointA,q,O),g(ab.contactPointA,ab.contactPointA,C),h(ab.contactPointA,ab.contactPointA,O),g(ab.contactPointA,ab.contactPointA,S.position),g(ab.contactPointB,q,P),h(ab.contactPointB,ab.contactPointB,P),g(ab.contactPointB,ab.contactPointB,T.position),this.contactEquations.push(ab),this.enableFrictionReduction||this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(ab))}}}return this.enableFrictionReduction&&this.enableFriction&&F&&this.frictionEquations.push(this.createFrictionFromAverage(F)),F};var Y=f.fromValues(0,0);c.projectConvexOntoAxis=function(a,b,c,d,e){var g,h,j=null,k=null,l=Y;f.rotate(l,d,-c);for(var m=0;m<a.vertices.length;m++)g=a.vertices[m],h=i(g,l),(null===j||h>j)&&(j=h),(null===k||k>h)&&(k=h);if(k>j){var n=k;k=j,j=n}var o=i(b,d);f.set(e,k+o,j+o)};var Z=f.fromValues(0,0),$=f.fromValues(0,0),_=f.fromValues(0,0),ab=f.fromValues(0,0),bb=f.fromValues(0,0),cb=f.fromValues(0,0);c.findSeparatingAxis=function(a,b,d,e,h,i,j){var k=null,l=!1,m=!1,n=Z,o=$,p=_,q=ab,s=bb,t=cb;if(a instanceof r&&e instanceof r)for(var u=0;2!==u;u++){var v=a,w=d;1===u&&(v=e,w=i);for(var x=0;2!==x;x++){0===x?f.set(q,0,1):1===x&&f.set(q,1,0),0!==w&&f.rotate(q,q,w),c.projectConvexOntoAxis(a,b,d,q,s),c.projectConvexOntoAxis(e,h,i,q,t);var y=s,z=t,A=!1;s[0]>t[0]&&(z=s,y=t,A=!0);var B=z[0]-y[1];l=0>=B,(null===k||B>k)&&(f.copy(j,q),k=B,m=l)}}else for(var u=0;2!==u;u++){var v=a,w=d;1===u&&(v=e,w=i);for(var x=0;x!==v.vertices.length;x++){f.rotate(o,v.vertices[x],w),f.rotate(p,v.vertices[(x+1)%v.vertices.length],w),g(n,p,o),f.rotate90cw(q,n),f.normalize(q,q),c.projectConvexOntoAxis(a,b,d,q,s),c.projectConvexOntoAxis(e,h,i,q,t);var y=s,z=t,A=!1;s[0]>t[0]&&(z=s,y=t,A=!0);var B=z[0]-y[1];l=0>=B,(null===k||B>k)&&(f.copy(j,q),k=B,m=l)}}return m};var db=f.fromValues(0,0),eb=f.fromValues(0,0),fb=f.fromValues(0,0);c.getClosestEdge=function(a,b,c,d){var e=db,h=eb,j=fb;f.rotate(e,c,-b),d&&f.scale(e,e,-1);for(var k=-1,l=a.vertices.length,m=-1,n=0;n!==l;n++){g(h,a.vertices[(n+1)%l],a.vertices[n%l]),f.rotate90cw(j,h),f.normalize(j,j);var o=i(j,e);(-1===k||o>m)&&(k=n%l,m=o)}return k};var gb=f.create(),hb=f.create(),ib=f.create(),jb=f.create(),kb=f.create(),lb=f.create(),mb=f.create();c.prototype[q.CIRCLE|q.HEIGHTFIELD]=c.prototype.circleHeightfield=function(a,b,c,d,e,i,j,k,l,m){var n=i.data,m=m||b.radius,o=i.elementWidth,p=hb,q=gb,r=kb,s=mb,t=lb,u=ib,v=jb,w=Math.floor((c[0]-m-j[0])/o),x=Math.ceil((c[0]+m-j[0])/o);0>w&&(w=0),x>=n.length&&(x=n.length-1);for(var y=n[w],z=n[x],A=w;x>A;A++)n[A]<z&&(z=n[A]),n[A]>y&&(y=n[A]);if(c[1]-m>y)return l?!1:0;c[1]+m<z;for(var B=!1,A=w;x>A;A++){f.set(u,A*o,n[A]),f.set(v,(A+1)*o,n[A+1]),f.add(u,u,j),f.add(v,v,j),f.sub(t,v,u),f.rotate(t,t,Math.PI/2),f.normalize(t,t),f.scale(q,t,-m),f.add(q,q,c),f.sub(p,q,u);var C=f.dot(p,t);if(q[0]>=u[0]&&q[0]<v[0]&&0>=C){if(l)return!0;B=!0,f.scale(p,t,-C),f.add(r,q,p),f.copy(s,t);var D=this.createContactEquation(e,a,i,b);f.copy(D.normalA,s),f.scale(D.contactPointB,D.normalA,-m),h(D.contactPointB,D.contactPointB,c),g(D.contactPointB,D.contactPointB,a.position),f.copy(D.contactPointA,r),f.sub(D.contactPointA,D.contactPointA,e.position),this.contactEquations.push(D),this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(D))}}if(B=!1,m>0)for(var A=w;x>=A;A++)if(f.set(u,A*o,n[A]),f.add(u,u,j),f.sub(p,c,u),f.squaredLength(p)<Math.pow(m,2)){if(l)return!0;B=!0;var D=this.createContactEquation(e,a,i,b);f.copy(D.normalA,p),f.normalize(D.normalA,D.normalA),f.scale(D.contactPointB,D.normalA,-m),h(D.contactPointB,D.contactPointB,c),g(D.contactPointB,D.contactPointB,a.position),g(D.contactPointA,u,j),h(D.contactPointA,D.contactPointA,j),g(D.contactPointA,D.contactPointA,e.position),this.contactEquations.push(D),this.enableFriction&&this.frictionEquations.push(this.createFrictionFromContact(D))}return B?1:0};var nb=f.create(),ob=f.create(),pb=f.create(),qb=new p([f.create(),f.create(),f.create(),f.create()]);c.prototype[q.RECTANGLE|q.HEIGHTFIELD]=c.prototype[q.CONVEX|q.HEIGHTFIELD]=c.prototype.convexHeightfield=function(a,b,c,d,e,g,h,i,j){var k=g.data,l=g.elementWidth,m=nb,n=ob,o=pb,p=qb,q=Math.floor((a.aabb.lowerBound[0]-h[0])/l),r=Math.ceil((a.aabb.upperBound[0]-h[0])/l);0>q&&(q=0),r>=k.length&&(r=k.length-1);for(var s=k[q],t=k[r],u=q;r>u;u++)k[u]<t&&(t=k[u]),k[u]>s&&(s=k[u]);if(a.aabb.lowerBound[1]>s)return j?!1:0;for(var v=0,u=q;r>u;u++){f.set(m,u*l,k[u]),f.set(n,(u+1)*l,k[u+1]),f.add(m,m,h),f.add(n,n,h);var w=100;f.set(o,.5*(n[0]+m[0]),.5*(n[1]+m[1]-w)),f.sub(p.vertices[0],n,o),f.sub(p.vertices[1],m,o),f.copy(p.vertices[2],p.vertices[1]),f.copy(p.vertices[3],p.vertices[0]),p.vertices[2][1]-=w,p.vertices[3][1]-=w,v+=this.convexConvex(a,b,c,d,e,p,o,0,j)}return v}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/collision/Narrowphase.js","/collision")},{"../equations/ContactEquation":24,"../equations/Equation":25,"../equations/FrictionEquation":26,"../math/vec2":33,"../objects/Body":34,"../shapes/Circle":40,"../shapes/Convex":41,"../shapes/Rectangle":46,"../shapes/Shape":47,"../utils/TupleDictionary":51,"../utils/Utils":52,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],16:[function(a,b){(function(){function c(){e.call(this,e.SAP),this.axisList=[],this.world=null,this.axisIndex=0;var a=this.axisList;this._addBodyHandler=function(b){a.push(b.body)},this._removeBodyHandler=function(b){var c=a.indexOf(b.body);-1!==c&&a.splice(c,1)}}var d=a("../utils/Utils"),e=a("../collision/Broadphase");b.exports=c,c.prototype=new e,c.prototype.setWorld=function(a){this.axisList.length=0,d.appendArray(this.axisList,a.bodies),a.off("addBody",this._addBodyHandler).off("removeBody",this._removeBodyHandler),a.on("addBody",this._addBodyHandler).on("removeBody",this._removeBodyHandler),this.world=a},c.sortAxisList=function(a,b){b=0|b;for(var c=1,d=a.length;d>c;c++){for(var e=a[c],f=c-1;f>=0&&!(a[f].aabb.lowerBound[b]<=e.aabb.lowerBound[b]);f--)a[f+1]=a[f];a[f+1]=e}return a},c.prototype.getCollisionPairs=function(){var a=this.axisList,b=this.result,d=this.axisIndex;b.length=0;for(var f=a.length;f--;){var g=a[f];g.aabbNeedsUpdate&&g.updateAABB()}c.sortAxisList(a,d);for(var h=0,i=0|a.length;h!==i;h++)for(var j=a[h],k=h+1;i>k;k++){var l=a[k],m=l.aabb.lowerBound[d]<=j.aabb.upperBound[d];if(!m)break;e.canCollide(j,l)&&this.boundingVolumeCheck(j,l)&&b.push(j,l)}return b}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/collision/SAPBroadphase.js","/collision")},{"../collision/Broadphase":12,"../utils/Utils":52,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],17:[function(a,b){(function(){function c(a,b,c,e){this.type=c,e=d.defaults(e,{collideConnected:!0,wakeUpBodies:!0}),this.equations=[],this.bodyA=a,this.bodyB=b,this.collideConnected=e.collideConnected,e.wakeUpBodies&&(a&&a.wakeUp(),b&&b.wakeUp())}b.exports=c;var d=a("../utils/Utils");c.prototype.update=function(){throw new Error("method update() not implmemented in this Constraint subclass!")},c.DISTANCE=1,c.GEAR=2,c.LOCK=3,c.PRISMATIC=4,c.REVOLUTE=5,c.prototype.setStiffness=function(a){for(var b=this.equations,c=0;c!==b.length;c++){var d=b[c];d.stiffness=a,d.needsUpdate=!0}},c.prototype.setRelaxation=function(a){for(var b=this.equations,c=0;c!==b.length;c++){var d=b[c];d.relaxation=a,d.needsUpdate=!0}}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/constraints/Constraint.js","/constraints")},{"../utils/Utils":52,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],18:[function(a,b){(function(){function c(a,b,c){c=g.defaults(c,{localAnchorA:[0,0],localAnchorB:[0,0]}),d.call(this,a,b,d.DISTANCE,c),this.localAnchorA=f.fromValues(c.localAnchorA[0],c.localAnchorA[1]),this.localAnchorB=f.fromValues(c.localAnchorB[0],c.localAnchorB[1]);var h=this.localAnchorA,i=this.localAnchorB;if(this.distance=0,"number"==typeof c.distance)this.distance=c.distance;else{var j=f.create(),k=f.create(),l=f.create();f.rotate(j,h,a.angle),f.rotate(k,i,b.angle),f.add(l,b.position,k),f.sub(l,l,j),f.sub(l,l,a.position),this.distance=f.length(l)}var m;m="undefined"==typeof c.maxForce?Number.MAX_VALUE:c.maxForce;var n=new e(a,b,-m,m);this.equations=[n],this.maxForce=m;var l=f.create(),o=f.create(),p=f.create(),q=this;n.computeGq=function(){var a=this.bodyA,b=this.bodyB,c=a.position,d=b.position;return f.rotate(o,h,a.angle),f.rotate(p,i,b.angle),f.add(l,d,p),f.sub(l,l,o),f.sub(l,l,c),f.length(l)-q.distance},this.setMaxForce(m),this.upperLimitEnabled=!1,this.upperLimit=1,this.lowerLimitEnabled=!1,this.lowerLimit=0,this.position=0}var d=a("./Constraint"),e=a("../equations/Equation"),f=a("../math/vec2"),g=a("../utils/Utils");
b.exports=c,c.prototype=new d;var h=f.create(),i=f.create(),j=f.create();c.prototype.update=function(){var a=this.equations[0],b=this.bodyA,c=this.bodyB,d=(this.distance,b.position),e=c.position,g=this.equations[0],k=a.G;f.rotate(i,this.localAnchorA,b.angle),f.rotate(j,this.localAnchorB,c.angle),f.add(h,e,j),f.sub(h,h,i),f.sub(h,h,d),this.position=f.length(h);var l=!1;if(this.upperLimitEnabled&&this.position>this.upperLimit&&(g.maxForce=0,g.minForce=-this.maxForce,this.distance=this.upperLimit,l=!0),this.lowerLimitEnabled&&this.position<this.lowerLimit&&(g.maxForce=this.maxForce,g.minForce=0,this.distance=this.lowerLimit,l=!0),(this.lowerLimitEnabled||this.upperLimitEnabled)&&!l)return void(g.enabled=!1);g.enabled=!0,f.normalize(h,h);var m=f.crossLength(i,h),n=f.crossLength(j,h);k[0]=-h[0],k[1]=-h[1],k[2]=-m,k[3]=h[0],k[4]=h[1],k[5]=n},c.prototype.setMaxForce=function(a){var b=this.equations[0];b.minForce=-a,b.maxForce=a},c.prototype.getMaxForce=function(){var a=this.equations[0];return a.maxForce}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/constraints/DistanceConstraint.js","/constraints")},{"../equations/Equation":25,"../math/vec2":33,"../utils/Utils":52,"./Constraint":17,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],19:[function(a,b){(function(){function c(a,b,c){c=c||{},d.call(this,a,b,d.GEAR,c),this.ratio="number"==typeof c.ratio?c.ratio:1,this.angle="number"==typeof c.angle?c.angle:b.angle-this.ratio*a.angle,c.angle=this.angle,c.ratio=this.ratio,this.equations=[new e(a,b,c)],"number"==typeof c.maxTorque&&this.setMaxTorque(c.maxTorque)}{var d=a("./Constraint"),e=(a("../equations/Equation"),a("../equations/AngleLockEquation"));a("../math/vec2")}b.exports=c,c.prototype=new d,c.prototype.update=function(){var a=this.equations[0];a.ratio!==this.ratio&&a.setRatio(this.ratio),a.angle=this.angle},c.prototype.setMaxTorque=function(a){this.equations[0].setMaxTorque(a)},c.prototype.getMaxTorque=function(){return this.equations[0].maxForce}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/constraints/GearConstraint.js","/constraints")},{"../equations/AngleLockEquation":23,"../equations/Equation":25,"../math/vec2":33,"./Constraint":17,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],20:[function(a,b){(function(){function c(a,b,c){c=c||{},d.call(this,a,b,d.LOCK,c);var g="undefined"==typeof c.maxForce?Number.MAX_VALUE:c.maxForce,h=(c.localAngleB||0,new f(a,b,-g,g)),i=new f(a,b,-g,g),j=new f(a,b,-g,g),k=e.create(),l=e.create(),m=this;h.computeGq=function(){return e.rotate(k,m.localOffsetB,a.angle),e.sub(l,b.position,a.position),e.sub(l,l,k),l[0]},i.computeGq=function(){return e.rotate(k,m.localOffsetB,a.angle),e.sub(l,b.position,a.position),e.sub(l,l,k),l[1]};var n=e.create(),o=e.create();j.computeGq=function(){return e.rotate(n,m.localOffsetB,b.angle-m.localAngleB),e.scale(n,n,-1),e.sub(l,a.position,b.position),e.add(l,l,n),e.rotate(o,n,-Math.PI/2),e.normalize(o,o),e.dot(l,o)},this.localOffsetB=e.create(),c.localOffsetB?e.copy(this.localOffsetB,c.localOffsetB):(e.sub(this.localOffsetB,b.position,a.position),e.rotate(this.localOffsetB,this.localOffsetB,-a.angle)),this.localAngleB=0,this.localAngleB="number"==typeof c.localAngleB?c.localAngleB:b.angle-a.angle,this.equations.push(h,i,j),this.setMaxForce(g)}var d=a("./Constraint"),e=a("../math/vec2"),f=a("../equations/Equation");b.exports=c,c.prototype=new d,c.prototype.setMaxForce=function(a){for(var b=this.equations,c=0;c<this.equations.length;c++)b[c].maxForce=a,b[c].minForce=-a},c.prototype.getMaxForce=function(){return this.equations[0].maxForce};var g=e.create(),h=e.create(),i=e.create(),j=e.fromValues(1,0),k=e.fromValues(0,1);c.prototype.update=function(){var a=this.equations[0],b=this.equations[1],c=this.equations[2],d=this.bodyA,f=this.bodyB;e.rotate(g,this.localOffsetB,d.angle),e.rotate(h,this.localOffsetB,f.angle-this.localAngleB),e.scale(h,h,-1),e.rotate(i,h,Math.PI/2),e.normalize(i,i),a.G[0]=-1,a.G[1]=0,a.G[2]=-e.crossLength(g,j),a.G[3]=1,b.G[0]=0,b.G[1]=-1,b.G[2]=-e.crossLength(g,k),b.G[4]=1,c.G[0]=-i[0],c.G[1]=-i[1],c.G[3]=i[0],c.G[4]=i[1],c.G[5]=e.crossLength(h,i)}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/constraints/LockConstraint.js","/constraints")},{"../equations/Equation":25,"../math/vec2":33,"./Constraint":17,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],21:[function(a,b){(function(){function c(a,b,c){c=c||{},d.call(this,a,b,d.PRISMATIC,c);var i=g.fromValues(0,0),j=g.fromValues(1,0),k=g.fromValues(0,0);c.localAnchorA&&g.copy(i,c.localAnchorA),c.localAxisA&&g.copy(j,c.localAxisA),c.localAnchorB&&g.copy(k,c.localAnchorB),this.localAnchorA=i,this.localAnchorB=k,this.localAxisA=j;var l=this.maxForce="undefined"!=typeof c.maxForce?c.maxForce:Number.MAX_VALUE,m=new f(a,b,-l,l),n=new g.create,o=new g.create,p=new g.create,q=new g.create;if(m.computeGq=function(){return g.dot(p,q)},m.updateJacobian=function(){var c=this.G,d=a.position,e=b.position;g.rotate(n,i,a.angle),g.rotate(o,k,b.angle),g.add(p,e,o),g.sub(p,p,d),g.sub(p,p,n),g.rotate(q,j,a.angle+Math.PI/2),c[0]=-q[0],c[1]=-q[1],c[2]=-g.crossLength(n,q)+g.crossLength(q,p),c[3]=q[0],c[4]=q[1],c[5]=g.crossLength(o,q)},this.equations.push(m),!c.disableRotationalLock){var r=new h(a,b,-l,l);this.equations.push(r)}this.position=0,this.velocity=0,this.lowerLimitEnabled="undefined"!=typeof c.lowerLimit?!0:!1,this.upperLimitEnabled="undefined"!=typeof c.upperLimit?!0:!1,this.lowerLimit="undefined"!=typeof c.lowerLimit?c.lowerLimit:0,this.upperLimit="undefined"!=typeof c.upperLimit?c.upperLimit:1,this.upperLimitEquation=new e(a,b),this.lowerLimitEquation=new e(a,b),this.upperLimitEquation.minForce=this.lowerLimitEquation.minForce=0,this.upperLimitEquation.maxForce=this.lowerLimitEquation.maxForce=l,this.motorEquation=new f(a,b),this.motorEnabled=!1,this.motorSpeed=0;{var s=this,t=this.motorEquation;t.computeGW}t.computeGq=function(){return 0},t.computeGW=function(){var a=this.G,b=this.bodyA,c=this.bodyB,d=b.velocity,e=c.velocity,f=b.angularVelocity,g=c.angularVelocity;return this.gmult(a,d,f,e,g)+s.motorSpeed}}var d=a("./Constraint"),e=a("../equations/ContactEquation"),f=a("../equations/Equation"),g=a("../math/vec2"),h=a("../equations/RotationalLockEquation");b.exports=c,c.prototype=new d;var i=g.create(),j=g.create(),k=g.create(),l=g.create(),m=g.create(),n=g.create();c.prototype.update=function(){var a=this.equations,b=a[0],c=this.upperLimit,d=this.lowerLimit,e=this.upperLimitEquation,f=this.lowerLimitEquation,h=this.bodyA,o=this.bodyB,p=this.localAxisA,q=this.localAnchorA,r=this.localAnchorB;b.updateJacobian(),g.rotate(i,p,h.angle),g.rotate(l,q,h.angle),g.add(j,l,h.position),g.rotate(m,r,o.angle),g.add(k,m,o.position);var s=this.position=g.dot(k,i)-g.dot(j,i);if(this.motorEnabled){var t=this.motorEquation.G;t[0]=i[0],t[1]=i[1],t[2]=g.crossLength(i,m),t[3]=-i[0],t[4]=-i[1],t[5]=-g.crossLength(i,l)}if(this.upperLimitEnabled&&s>c)g.scale(e.normalA,i,-1),g.sub(e.contactPointA,j,h.position),g.sub(e.contactPointB,k,o.position),g.scale(n,i,c),g.add(e.contactPointA,e.contactPointA,n),-1===a.indexOf(e)&&a.push(e);else{var u=a.indexOf(e);-1!==u&&a.splice(u,1)}if(this.lowerLimitEnabled&&d>s)g.scale(f.normalA,i,1),g.sub(f.contactPointA,j,h.position),g.sub(f.contactPointB,k,o.position),g.scale(n,i,d),g.sub(f.contactPointB,f.contactPointB,n),-1===a.indexOf(f)&&a.push(f);else{var u=a.indexOf(f);-1!==u&&a.splice(u,1)}},c.prototype.enableMotor=function(){this.motorEnabled||(this.equations.push(this.motorEquation),this.motorEnabled=!0)},c.prototype.disableMotor=function(){if(this.motorEnabled){var a=this.equations.indexOf(this.motorEquation);this.equations.splice(a,1),this.motorEnabled=!1}},c.prototype.setLimits=function(a,b){"number"==typeof a?(this.lowerLimit=a,this.lowerLimitEnabled=!0):(this.lowerLimit=a,this.lowerLimitEnabled=!1),"number"==typeof b?(this.upperLimit=b,this.upperLimitEnabled=!0):(this.upperLimit=b,this.upperLimitEnabled=!1)}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/constraints/PrismaticConstraint.js","/constraints")},{"../equations/ContactEquation":24,"../equations/Equation":25,"../equations/RotationalLockEquation":27,"../math/vec2":33,"./Constraint":17,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],22:[function(a,b){(function(){function c(a,b,c){c=c||{},d.call(this,a,b,d.REVOLUTE,c);var n=this.maxForce="undefined"!=typeof c.maxForce?c.maxForce:Number.MAX_VALUE;this.pivotA=h.create(),this.pivotB=h.create(),c.worldPivot?(h.sub(this.pivotA,c.worldPivot,a.position),h.sub(this.pivotB,c.worldPivot,b.position),h.rotate(this.pivotA,this.pivotA,-a.angle),h.rotate(this.pivotB,this.pivotB,-b.angle)):(h.copy(this.pivotA,c.localPivotA),h.copy(this.pivotB,c.localPivotB));var o=this.equations=[new e(a,b,-n,n),new e(a,b,-n,n)],p=o[0],q=o[1],r=this;p.computeGq=function(){return h.rotate(i,r.pivotA,a.angle),h.rotate(j,r.pivotB,b.angle),h.add(m,b.position,j),h.sub(m,m,a.position),h.sub(m,m,i),h.dot(m,k)},q.computeGq=function(){return h.rotate(i,r.pivotA,a.angle),h.rotate(j,r.pivotB,b.angle),h.add(m,b.position,j),h.sub(m,m,a.position),h.sub(m,m,i),h.dot(m,l)},q.minForce=p.minForce=-n,q.maxForce=p.maxForce=n,this.motorEquation=new f(a,b),this.motorEnabled=!1,this.angle=0,this.lowerLimitEnabled=!1,this.upperLimitEnabled=!1,this.lowerLimit=0,this.upperLimit=0,this.upperLimitEquation=new g(a,b),this.lowerLimitEquation=new g(a,b),this.upperLimitEquation.minForce=0,this.lowerLimitEquation.maxForce=0}var d=a("./Constraint"),e=a("../equations/Equation"),f=a("../equations/RotationalVelocityEquation"),g=a("../equations/RotationalLockEquation"),h=a("../math/vec2");b.exports=c;var i=h.create(),j=h.create(),k=h.fromValues(1,0),l=h.fromValues(0,1),m=h.create();c.prototype=new d,c.prototype.setLimits=function(a,b){"number"==typeof a?(this.lowerLimit=a,this.lowerLimitEnabled=!0):(this.lowerLimit=a,this.lowerLimitEnabled=!1),"number"==typeof b?(this.upperLimit=b,this.upperLimitEnabled=!0):(this.upperLimit=b,this.upperLimitEnabled=!1)},c.prototype.update=function(){var a=this.bodyA,b=this.bodyB,c=this.pivotA,d=this.pivotB,e=this.equations,f=(e[0],e[1],e[0]),g=e[1],m=this.upperLimit,n=this.lowerLimit,o=this.upperLimitEquation,p=this.lowerLimitEquation,q=this.angle=b.angle-a.angle;if(this.upperLimitEnabled&&q>m)o.angle=m,-1===e.indexOf(o)&&e.push(o);else{var r=e.indexOf(o);-1!==r&&e.splice(r,1)}if(this.lowerLimitEnabled&&n>q)p.angle=n,-1===e.indexOf(p)&&e.push(p);else{var r=e.indexOf(p);-1!==r&&e.splice(r,1)}h.rotate(i,c,a.angle),h.rotate(j,d,b.angle),f.G[0]=-1,f.G[1]=0,f.G[2]=-h.crossLength(i,k),f.G[3]=1,f.G[4]=0,f.G[5]=h.crossLength(j,k),g.G[0]=0,g.G[1]=-1,g.G[2]=-h.crossLength(i,l),g.G[3]=0,g.G[4]=1,g.G[5]=h.crossLength(j,l)},c.prototype.enableMotor=function(){this.motorEnabled||(this.equations.push(this.motorEquation),this.motorEnabled=!0)},c.prototype.disableMotor=function(){if(this.motorEnabled){var a=this.equations.indexOf(this.motorEquation);this.equations.splice(a,1),this.motorEnabled=!1}},c.prototype.motorIsEnabled=function(){return!!this.motorEnabled},c.prototype.setMotorSpeed=function(a){if(this.motorEnabled){var b=this.equations.indexOf(this.motorEquation);this.equations[b].relativeVelocity=a}},c.prototype.getMotorSpeed=function(){return this.motorEnabled?this.motorEquation.relativeVelocity:!1}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/constraints/RevoluteConstraint.js","/constraints")},{"../equations/Equation":25,"../equations/RotationalLockEquation":27,"../equations/RotationalVelocityEquation":28,"../math/vec2":33,"./Constraint":17,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],23:[function(a,b){(function(){function c(a,b,c){c=c||{},d.call(this,a,b,-Number.MAX_VALUE,Number.MAX_VALUE),this.angle=c.angle||0,this.ratio="number"==typeof c.ratio?c.ratio:1,this.setRatio(this.ratio)}{var d=a("./Equation");a("../math/vec2")}b.exports=c,c.prototype=new d,c.prototype.constructor=c,c.prototype.computeGq=function(){return this.ratio*this.bodyA.angle-this.bodyB.angle+this.angle},c.prototype.setRatio=function(a){var b=this.G;b[2]=a,b[5]=-1,this.ratio=a},c.prototype.setMaxTorque=function(a){this.maxForce=a,this.minForce=-a}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/equations/AngleLockEquation.js","/equations")},{"../math/vec2":33,"./Equation":25,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],24:[function(a,b){(function(){function c(a,b){d.call(this,a,b,0,Number.MAX_VALUE),this.contactPointA=e.create(),this.penetrationVec=e.create(),this.contactPointB=e.create(),this.normalA=e.create(),this.restitution=0,this.firstImpact=!1,this.shapeA=null,this.shapeB=null}var d=a("./Equation"),e=a("../math/vec2");b.exports=c,c.prototype=new d,c.prototype.constructor=c,c.prototype.computeB=function(a,b,c){var d=this.bodyA,f=this.bodyB,g=this.contactPointA,h=this.contactPointB,i=d.position,j=f.position,k=this.penetrationVec,l=this.normalA,m=this.G,n=e.crossLength(g,l),o=e.crossLength(h,l);m[0]=-l[0],m[1]=-l[1],m[2]=-n,m[3]=l[0],m[4]=l[1],m[5]=o,e.add(k,j,h),e.sub(k,k,i),e.sub(k,k,g);var p,q;this.firstImpact&&0!==this.restitution?(q=0,p=1/b*(1+this.restitution)*this.computeGW()):(q=e.dot(l,k)+this.offset,p=this.computeGW());var r=this.computeGiMf(),s=-q*a-p*b-c*r;return s}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/equations/ContactEquation.js","/equations")},{"../math/vec2":33,"./Equation":25,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],25:[function(a,b){(function(){function c(a,b,d,f){this.minForce="undefined"==typeof d?-Number.MAX_VALUE:d,this.maxForce="undefined"==typeof f?Number.MAX_VALUE:f,this.bodyA=a,this.bodyB=b,this.stiffness=c.DEFAULT_STIFFNESS,this.relaxation=c.DEFAULT_RELAXATION,this.G=new e.ARRAY_TYPE(6);for(var g=0;6>g;g++)this.G[g]=0;this.offset=0,this.a=0,this.b=0,this.epsilon=0,this.timeStep=1/60,this.needsUpdate=!0,this.multiplier=0,this.relativeVelocity=0,this.enabled=!0}b.exports=c;{var d=a("../math/vec2"),e=a("../utils/Utils");a("../objects/Body")}c.prototype.constructor=c,c.DEFAULT_STIFFNESS=1e6,c.DEFAULT_RELAXATION=4,c.prototype.update=function(){var a=this.stiffness,b=this.relaxation,c=this.timeStep;this.a=4/(c*(1+4*b)),this.b=4*b/(1+4*b),this.epsilon=4/(c*c*a*(1+4*b)),this.needsUpdate=!1},c.prototype.gmult=function(a,b,c,d,e){return a[0]*b[0]+a[1]*b[1]+a[2]*c+a[3]*d[0]+a[4]*d[1]+a[5]*e},c.prototype.computeB=function(a,b,c){var d=this.computeGW(),e=this.computeGq(),f=this.computeGiMf();return-e*a-d*b-f*c};var f=d.create(),g=d.create();c.prototype.computeGq=function(){var a=this.G,b=this.bodyA,c=this.bodyB,d=(b.position,c.position,b.angle),e=c.angle;return this.gmult(a,f,d,g,e)+this.offset},c.prototype.computeGW=function(){var a=this.G,b=this.bodyA,c=this.bodyB,d=b.velocity,e=c.velocity,f=b.angularVelocity,g=c.angularVelocity;return this.gmult(a,d,f,e,g)+this.relativeVelocity},c.prototype.computeGWlambda=function(){var a=this.G,b=this.bodyA,c=this.bodyB,d=b.vlambda,e=c.vlambda,f=b.wlambda,g=c.wlambda;return this.gmult(a,d,f,e,g)};var h=d.create(),i=d.create();c.prototype.computeGiMf=function(){var a=this.bodyA,b=this.bodyB,c=a.force,e=a.angularForce,f=b.force,g=b.angularForce,j=a.invMassSolve,k=b.invMassSolve,l=a.invInertiaSolve,m=b.invInertiaSolve,n=this.G;return d.scale(h,c,j),d.scale(i,f,k),this.gmult(n,h,e*l,i,g*m)},c.prototype.computeGiMGt=function(){var a=this.bodyA,b=this.bodyB,c=a.invMassSolve,d=b.invMassSolve,e=a.invInertiaSolve,f=b.invInertiaSolve,g=this.G;return g[0]*g[0]*c+g[1]*g[1]*c+g[2]*g[2]*e+g[3]*g[3]*d+g[4]*g[4]*d+g[5]*g[5]*f};{var j=d.create(),k=d.create(),l=d.create();d.create(),d.create(),d.create()}c.prototype.addToWlambda=function(a){var b=this.bodyA,c=this.bodyB,e=j,f=k,g=l,h=b.invMassSolve,i=c.invMassSolve,m=b.invInertiaSolve,n=c.invInertiaSolve,o=this.G;f[0]=o[0],f[1]=o[1],g[0]=o[3],g[1]=o[4],d.scale(e,f,h*a),d.add(b.vlambda,b.vlambda,e),b.wlambda+=m*o[2]*a,d.scale(e,g,i*a),d.add(c.vlambda,c.vlambda,e),c.wlambda+=n*o[5]*a},c.prototype.computeInvC=function(a){return 1/(this.computeGiMGt()+a)}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/equations/Equation.js","/equations")},{"../math/vec2":33,"../objects/Body":34,"../utils/Utils":52,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],26:[function(a,b){(function(){function c(a,b,c){e.call(this,a,b,-c,c),this.contactPointA=d.create(),this.contactPointB=d.create(),this.t=d.create(),this.contactEquations=[],this.shapeA=null,this.shapeB=null,this.frictionCoefficient=.3}{var d=a("../math/vec2"),e=a("./Equation");a("../utils/Utils")}b.exports=c,c.prototype=new e,c.prototype.constructor=c,c.prototype.setSlipForce=function(a){this.maxForce=a,this.minForce=-a},c.prototype.getSlipForce=function(){return this.maxForce},c.prototype.computeB=function(a,b,c){var e=(this.bodyA,this.bodyB,this.contactPointA),f=this.contactPointB,g=this.t,h=this.G;h[0]=-g[0],h[1]=-g[1],h[2]=-d.crossLength(e,g),h[3]=g[0],h[4]=g[1],h[5]=d.crossLength(f,g);var i=this.computeGW(),j=this.computeGiMf(),k=-i*b-c*j;return k}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/equations/FrictionEquation.js","/equations")},{"../math/vec2":33,"../utils/Utils":52,"./Equation":25,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],27:[function(a,b){(function(){function c(a,b,c){c=c||{},d.call(this,a,b,-Number.MAX_VALUE,Number.MAX_VALUE),this.angle=c.angle||0;var e=this.G;e[2]=1,e[5]=-1}var d=a("./Equation"),e=a("../math/vec2");b.exports=c,c.prototype=new d,c.prototype.constructor=c;var f=e.create(),g=e.create(),h=e.fromValues(1,0),i=e.fromValues(0,1);c.prototype.computeGq=function(){return e.rotate(f,h,this.bodyA.angle+this.angle),e.rotate(g,i,this.bodyB.angle),e.dot(f,g)}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/equations/RotationalLockEquation.js","/equations")},{"../math/vec2":33,"./Equation":25,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],28:[function(a,b){(function(){function c(a,b){d.call(this,a,b,-Number.MAX_VALUE,Number.MAX_VALUE),this.relativeVelocity=1,this.ratio=1}{var d=a("./Equation");a("../math/vec2")}b.exports=c,c.prototype=new d,c.prototype.constructor=c,c.prototype.computeB=function(a,b,c){var d=this.G;d[2]=-1,d[5]=this.ratio;var e=this.computeGiMf(),f=this.computeGW(),g=-f*b-c*e;return g}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/equations/RotationalVelocityEquation.js","/equations")},{"../math/vec2":33,"./Equation":25,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],29:[function(a,b){(function(){var a=function(){};b.exports=a,a.prototype={constructor:a,on:function(a,b,c){b.context=c||this,void 0===this._listeners&&(this._listeners={});var d=this._listeners;return void 0===d[a]&&(d[a]=[]),-1===d[a].indexOf(b)&&d[a].push(b),this},has:function(a,b){if(void 0===this._listeners)return!1;var c=this._listeners;if(b){if(void 0!==c[a]&&-1!==c[a].indexOf(b))return!0}else if(void 0!==c[a])return!0;return!1},off:function(a,b){if(void 0===this._listeners)return this;var c=this._listeners,d=c[a].indexOf(b);return-1!==d&&c[a].splice(d,1),this},emit:function(a){if(void 0===this._listeners)return this;var b=this._listeners,c=b[a.type];if(void 0!==c){a.target=this;for(var d=0,e=c.length;e>d;d++){var f=c[d];f.call(f.context,a)}}return this}}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/events/EventEmitter.js","/events")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],30:[function(a,b){(function(){function c(a,b,f){if(f=f||{},!(a instanceof d&&b instanceof d))throw new Error("First two arguments must be Material instances.");this.id=c.idCounter++,this.materialA=a,this.materialB=b,this.friction="undefined"!=typeof f.friction?Number(f.friction):.3,this.restitution="undefined"!=typeof f.restitution?Number(f.restitution):0,this.stiffness="undefined"!=typeof f.stiffness?Number(f.stiffness):e.DEFAULT_STIFFNESS,this.relaxation="undefined"!=typeof f.relaxation?Number(f.relaxation):e.DEFAULT_RELAXATION,this.frictionStiffness="undefined"!=typeof f.frictionStiffness?Number(f.frictionStiffness):e.DEFAULT_STIFFNESS,this.frictionRelaxation="undefined"!=typeof f.frictionRelaxation?Number(f.frictionRelaxation):e.DEFAULT_RELAXATION,this.surfaceVelocity="undefined"!=typeof f.surfaceVelocity?Number(f.surfaceVelocity):0,this.contactSkinSize=.005}var d=a("./Material"),e=a("../equations/Equation");b.exports=c,c.idCounter=0}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/material/ContactMaterial.js","/material")},{"../equations/Equation":25,"./Material":31,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],31:[function(a,b){(function(){function a(b){this.id=b||a.idCounter++}b.exports=a,a.idCounter=0}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/material/Material.js","/material")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],32:[function(a,b){(function(){var a={};a.GetArea=function(a){if(a.length<6)return 0;for(var b=a.length-2,c=0,d=0;b>d;d+=2)c+=(a[d+2]-a[d])*(a[d+1]+a[d+3]);return c+=(a[0]-a[b])*(a[b+1]+a[1]),.5*-c},a.Triangulate=function(b){var c=b.length>>1;if(3>c)return[];for(var d=[],e=[],f=0;c>f;f++)e.push(f);for(var f=0,g=c;g>3;){var h=e[(f+0)%g],i=e[(f+1)%g],j=e[(f+2)%g],k=b[2*h],l=b[2*h+1],m=b[2*i],n=b[2*i+1],o=b[2*j],p=b[2*j+1],q=!1;if(a._convex(k,l,m,n,o,p)){q=!0;for(var r=0;g>r;r++){var s=e[r];if(s!=h&&s!=i&&s!=j&&a._PointInTriangle(b[2*s],b[2*s+1],k,l,m,n,o,p)){q=!1;break}}}if(q)d.push(h,i,j),e.splice((f+1)%g,1),g--,f=0;else if(f++>3*g)break}return d.push(e[0],e[1],e[2]),d},a._PointInTriangle=function(a,b,c,d,e,f,g,h){var i=g-c,j=h-d,k=e-c,l=f-d,m=a-c,n=b-d,o=i*i+j*j,p=i*k+j*l,q=i*m+j*n,r=k*k+l*l,s=k*m+l*n,t=1/(o*r-p*p),u=(r*q-p*s)*t,v=(o*s-p*q)*t;return u>=0&&v>=0&&1>u+v},a._convex=function(a,b,c,d,e,f){return(b-d)*(e-c)+(c-a)*(f-d)>=0},b.exports=a}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/math/polyk.js","/math")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],33:[function(a,b){(function(){var c=b.exports={},d=a("../utils/Utils");c.crossLength=function(a,b){return a[0]*b[1]-a[1]*b[0]},c.crossVZ=function(a,b,d){return c.rotate(a,b,-Math.PI/2),c.scale(a,a,d),a},c.crossZV=function(a,b,d){return c.rotate(a,d,Math.PI/2),c.scale(a,a,b),a},c.rotate=function(a,b,c){if(0!==c){var d=Math.cos(c),e=Math.sin(c),f=b[0],g=b[1];a[0]=d*f-e*g,a[1]=e*f+d*g}else a[0]=b[0],a[1]=b[1]},c.rotate90cw=function(a,b){var c=b[0],d=b[1];a[0]=d,a[1]=-c},c.toLocalFrame=function(a,b,d,e){c.copy(a,b),c.sub(a,a,d),c.rotate(a,a,-e)},c.toGlobalFrame=function(a,b,d,e){c.copy(a,b),c.rotate(a,a,e),c.add(a,a,d)},c.centroid=function(a,b,d,e){return c.add(a,b,d),c.add(a,a,e),c.scale(a,a,1/3),a},c.create=function(){var a=new d.ARRAY_TYPE(2);return a[0]=0,a[1]=0,a},c.clone=function(a){var b=new d.ARRAY_TYPE(2);return b[0]=a[0],b[1]=a[1],b},c.fromValues=function(a,b){var c=new d.ARRAY_TYPE(2);return c[0]=a,c[1]=b,c},c.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a},c.set=function(a,b,c){return a[0]=b,a[1]=c,a},c.add=function(a,b,c){return a[0]=b[0]+c[0],a[1]=b[1]+c[1],a},c.subtract=function(a,b,c){return a[0]=b[0]-c[0],a[1]=b[1]-c[1],a},c.sub=c.subtract,c.multiply=function(a,b,c){return a[0]=b[0]*c[0],a[1]=b[1]*c[1],a},c.mul=c.multiply,c.divide=function(a,b,c){return a[0]=b[0]/c[0],a[1]=b[1]/c[1],a},c.div=c.divide,c.scale=function(a,b,c){return a[0]=b[0]*c,a[1]=b[1]*c,a},c.distance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1];return Math.sqrt(c*c+d*d)},c.dist=c.distance,c.squaredDistance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1];return c*c+d*d},c.sqrDist=c.squaredDistance,c.length=function(a){var b=a[0],c=a[1];return Math.sqrt(b*b+c*c)},c.len=c.length,c.squaredLength=function(a){var b=a[0],c=a[1];return b*b+c*c},c.sqrLen=c.squaredLength,c.negate=function(a,b){return a[0]=-b[0],a[1]=-b[1],a},c.normalize=function(a,b){var c=b[0],d=b[1],e=c*c+d*d;return e>0&&(e=1/Math.sqrt(e),a[0]=b[0]*e,a[1]=b[1]*e),a},c.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]},c.str=function(a){return"vec2("+a[0]+", "+a[1]+")"}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/math/vec2.js","/math")},{"../utils/Utils":52,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],34:[function(a,b){(function(){function c(a){a=a||{},h.call(this),this.id=++c._idCounter,this.world=null,this.shapes=[],this.shapeOffsets=[],this.shapeAngles=[],this.mass=a.mass||0,this.invMass=0,this.inertia=0,this.invInertia=0,this.invMassSolve=0,this.invInertiaSolve=0,this.fixedRotation=!!a.fixedRotation||!1,this.position=d.fromValues(0,0),a.position&&d.copy(this.position,a.position),this.interpolatedPosition=d.fromValues(0,0),this.interpolatedAngle=0,this.previousPosition=d.fromValues(0,0),this.previousAngle=0,this.velocity=d.fromValues(0,0),a.velocity&&d.copy(this.velocity,a.velocity),this.vlambda=d.fromValues(0,0),this.wlambda=0,this.angle=a.angle||0,this.angularVelocity=a.angularVelocity||0,this.force=d.create(),a.force&&d.copy(this.force,a.force),this.angularForce=a.angularForce||0,this.damping="number"==typeof a.damping?a.damping:.1,this.angularDamping="number"==typeof a.angularDamping?a.angularDamping:.1,this.type=c.STATIC,this.type="undefined"!=typeof a.type?a.type:a.mass?c.DYNAMIC:c.STATIC,this.boundingRadius=0,this.aabb=new g,this.aabbNeedsUpdate=!0,this.allowSleep=!0,this.wantsToSleep=!1,this.sleepState=c.AWAKE,this.sleepSpeedLimit=.2,this.sleepTimeLimit=1,this.gravityScale=1,this.timeLastSleepy=0,this.concavePath=null,this.lastDampingScale=1,this.lastAngularDampingScale=1,this.lastDampingTimeStep=-1,this._wakeUpAfterNarrowphase=!1,this.updateMassProperties()}var d=a("../math/vec2"),e=a("poly-decomp"),f=a("../shapes/Convex"),g=a("../collision/AABB"),h=a("../events/EventEmitter");b.exports=c,c.prototype=new h,c._idCounter=0,c.prototype.updateSolveMassProperties=function(){this.sleepState===c.SLEEPING||this.type===c.KINEMATIC?(this.invMassSolve=0,this.invInertiaSolve=0):(this.invMassSolve=this.invMass,this.invInertiaSolve=this.invInertia)},c.prototype.setDensity=function(a){var b=this.getArea();this.mass=b*a,this.updateMassProperties()},c.prototype.getArea=function(){for(var a=0,b=0;b<this.shapes.length;b++)a+=this.shapes[b].area;return a},c.prototype.getAABB=function(){return this.aabbNeedsUpdate&&this.updateAABB(),this.aabb};var i=new g,j=d.create();c.prototype.updateAABB=function(){for(var a=this.shapes,b=this.shapeOffsets,c=this.shapeAngles,e=a.length,f=j,g=this.angle,h=0;h!==e;h++){var k=a[h],l=c[h]+g;d.rotate(f,b[h],g),d.add(f,f,this.position),k.computeAABB(i,f,l),0===h?this.aabb.copy(i):this.aabb.extend(i)}this.aabbNeedsUpdate=!1
},c.prototype.updateBoundingRadius=function(){for(var a=this.shapes,b=this.shapeOffsets,c=a.length,e=0,f=0;f!==c;f++){var g=a[f],h=d.length(b[f]),i=g.boundingRadius;h+i>e&&(e=h+i)}this.boundingRadius=e},c.prototype.addShape=function(a,b,c){c=c||0,b=b?d.fromValues(b[0],b[1]):d.fromValues(0,0),this.shapes.push(a),this.shapeOffsets.push(b),this.shapeAngles.push(c),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0},c.prototype.removeShape=function(a){var b=this.shapes.indexOf(a);return-1!==b?(this.shapes.splice(b,1),this.shapeOffsets.splice(b,1),this.shapeAngles.splice(b,1),this.aabbNeedsUpdate=!0,!0):!1},c.prototype.updateMassProperties=function(){if(this.type===c.STATIC||this.type===c.KINEMATIC)this.mass=Number.MAX_VALUE,this.invMass=0,this.inertia=Number.MAX_VALUE,this.invInertia=0;else{var a=this.shapes,b=a.length,e=this.mass/b,f=0;if(this.fixedRotation)this.inertia=Number.MAX_VALUE,this.invInertia=0;else{for(var g=0;b>g;g++){var h=a[g],i=d.squaredLength(this.shapeOffsets[g]),j=h.computeMomentOfInertia(e);f+=j+e*i}this.inertia=f,this.invInertia=f>0?1/f:0}this.invMass=1/this.mass}};var k=d.create();c.prototype.applyForce=function(a,b){var c=k;d.sub(c,b,this.position),d.add(this.force,this.force,a);var e=d.crossLength(c,a);this.angularForce+=e},c.prototype.toLocalFrame=function(a,b){d.toLocalFrame(a,b,this.position,this.angle)},c.prototype.toWorldFrame=function(a,b){d.toGlobalFrame(a,b,this.position,this.angle)},c.prototype.fromPolygon=function(a,b){b=b||{};for(var c=this.shapes.length;c>=0;--c)this.removeShape(this.shapes[c]);var g=new e.Polygon;if(g.vertices=a,g.makeCCW(),"number"==typeof b.removeCollinearPoints&&g.removeCollinearPoints(b.removeCollinearPoints),"undefined"==typeof b.skipSimpleCheck&&!g.isSimple())return!1;this.concavePath=g.vertices.slice(0);for(var c=0;c<this.concavePath.length;c++){var h=[0,0];d.copy(h,this.concavePath[c]),this.concavePath[c]=h}var i;i=b.optimalDecomp?g.decomp():g.quickDecomp();for(var j=d.create(),c=0;c!==i.length;c++){for(var k=new f(i[c].vertices),l=0;l!==k.vertices.length;l++){var h=k.vertices[l];d.sub(h,h,k.centerOfMass)}d.scale(j,k.centerOfMass,1),k.updateTriangles(),k.updateCenterOfMass(),k.updateBoundingRadius(),this.addShape(k,j)}return this.adjustCenterOfMass(),this.aabbNeedsUpdate=!0,!0};var l=(d.fromValues(0,0),d.fromValues(0,0)),m=d.fromValues(0,0),n=d.fromValues(0,0);c.prototype.adjustCenterOfMass=function(){var a=l,b=m,c=n,e=0;d.set(b,0,0);for(var f=0;f!==this.shapes.length;f++){var g=this.shapes[f],h=this.shapeOffsets[f];d.scale(a,h,g.area),d.add(b,b,a),e+=g.area}d.scale(c,b,1/e);for(var f=0;f!==this.shapes.length;f++){var g=this.shapes[f],h=this.shapeOffsets[f];h||(h=this.shapeOffsets[f]=d.create()),d.sub(h,h,c)}d.add(this.position,this.position,c);for(var f=0;this.concavePath&&f<this.concavePath.length;f++)d.sub(this.concavePath[f],this.concavePath[f],c);this.updateMassProperties(),this.updateBoundingRadius()},c.prototype.setZeroForce=function(){d.set(this.force,0,0),this.angularForce=0},c.prototype.resetConstraintVelocity=function(){var a=this,b=a.vlambda;d.set(b,0,0),a.wlambda=0},c.prototype.addConstraintVelocity=function(){var a=this,b=a.velocity;d.add(b,b,a.vlambda),a.angularVelocity+=a.wlambda},c.prototype.applyDamping=function(a){if(this.type===c.DYNAMIC){a!==this.lastDampingTimeStep&&(this.lastDampingScale=Math.pow(1-this.damping,a),this.lastAngularDampingScale=Math.pow(1-this.angularDamping,a),this.lastDampingTimeStep=a);var b=this.velocity;d.scale(b,b,this.lastDampingScale),this.angularVelocity*=this.lastAngularDampingScale}},c.prototype.wakeUp=function(){var a=this.sleepState;this.sleepState=c.AWAKE,this.idleTime=0,a!==c.AWAKE&&this.emit(c.wakeUpEvent)},c.prototype.sleep=function(){this.sleepState=c.SLEEPING,this.angularVelocity=0,this.angularForce=0,d.set(this.velocity,0,0),d.set(this.force,0,0),this.emit(c.sleepEvent)},c.prototype.sleepTick=function(a,b,e){if(this.allowSleep&&this.type!==c.SLEEPING){this.wantsToSleep=!1;var f=(this.sleepState,d.squaredLength(this.velocity)+Math.pow(this.angularVelocity,2)),g=Math.pow(this.sleepSpeedLimit,2);f>=g?(this.idleTime=0,this.sleepState=c.AWAKE):(this.idleTime+=e,this.sleepState=c.SLEEPY),this.idleTime>this.sleepTimeLimit&&(b?this.wantsToSleep=!0:this.sleep())}},c.prototype.getVelocityFromPosition=function(a,b){return a=a||d.create(),d.sub(a,this.position,this.previousPosition),d.scale(a,a,1/b),a},c.prototype.getAngularVelocityFromPosition=function(a){return(this.angle-this.previousAngle)/a},c.prototype.overlaps=function(a){return this.world.overlapKeeper.bodiesAreOverlapping(this,a)},c.sleepyEvent={type:"sleepy"},c.sleepEvent={type:"sleep"},c.wakeUpEvent={type:"wakeup"},c.DYNAMIC=1,c.STATIC=2,c.KINEMATIC=4,c.AWAKE=0,c.SLEEPY=1,c.SLEEPING=2}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/objects/Body.js","/objects")},{"../collision/AABB":11,"../events/EventEmitter":29,"../math/vec2":33,"../shapes/Convex":41,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1,"poly-decomp":9}],35:[function(a,b){(function(){function c(a,b,c){c=c||{},e.call(this,a,b,c),this.localAnchorA=d.fromValues(0,0),this.localAnchorB=d.fromValues(0,0),c.localAnchorA&&d.copy(this.localAnchorA,c.localAnchorA),c.localAnchorB&&d.copy(this.localAnchorB,c.localAnchorB),c.worldAnchorA&&this.setWorldAnchorA(c.worldAnchorA),c.worldAnchorB&&this.setWorldAnchorB(c.worldAnchorB);var f=d.create(),g=d.create();this.getWorldAnchorA(f),this.getWorldAnchorB(g);var h=d.distance(f,g);this.restLength="number"==typeof c.restLength?c.restLength:h}{var d=a("../math/vec2"),e=a("./Spring");a("../utils/Utils")}b.exports=c,c.prototype=new e,c.prototype.setWorldAnchorA=function(a){this.bodyA.toLocalFrame(this.localAnchorA,a)},c.prototype.setWorldAnchorB=function(a){this.bodyB.toLocalFrame(this.localAnchorB,a)},c.prototype.getWorldAnchorA=function(a){this.bodyA.toWorldFrame(a,this.localAnchorA)},c.prototype.getWorldAnchorB=function(a){this.bodyB.toWorldFrame(a,this.localAnchorB)};var f=d.create(),g=d.create(),h=d.create(),i=d.create(),j=d.create(),k=d.create(),l=d.create(),m=d.create(),n=d.create();c.prototype.applyForce=function(){var a=this.stiffness,b=this.damping,c=this.restLength,e=this.bodyA,o=this.bodyB,p=f,q=g,r=h,s=i,t=n,u=j,v=k,w=l,x=m;this.getWorldAnchorA(u),this.getWorldAnchorB(v),d.sub(w,u,e.position),d.sub(x,v,o.position),d.sub(p,v,u);var y=d.len(p);d.normalize(q,p),d.sub(r,o.velocity,e.velocity),d.crossZV(t,o.angularVelocity,x),d.add(r,r,t),d.crossZV(t,e.angularVelocity,w),d.sub(r,r,t),d.scale(s,q,-a*(y-c)-b*d.dot(r,q)),d.sub(e.force,e.force,s),d.add(o.force,o.force,s);var z=d.crossLength(w,s),A=d.crossLength(x,s);e.angularForce-=z,o.angularForce+=A}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/objects/LinearSpring.js","/objects")},{"../math/vec2":33,"../utils/Utils":52,"./Spring":37,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],36:[function(a,b){(function(){function c(a,b,c){c=c||{},d.call(this,a,b,c),this.restAngle="number"==typeof c.restAngle?c.restAngle:b.angle-a.angle}var d=(a("../math/vec2"),a("./Spring"));b.exports=c,c.prototype=new d,c.prototype.applyForce=function(){var a=this.stiffness,b=this.damping,c=this.restAngle,d=this.bodyA,e=this.bodyB,f=e.angle-d.angle,g=e.angularVelocity-d.angularVelocity,h=-a*(f-c)-b*g*0;d.angularForce-=h,e.angularForce+=h}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/objects/RotationalSpring.js","/objects")},{"../math/vec2":33,"./Spring":37,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],37:[function(a,b){(function(){function c(a,b,c){c=d.defaults(c,{stiffness:100,damping:1}),this.stiffness=c.stiffness,this.damping=c.damping,this.bodyA=a,this.bodyB=b}var d=(a("../math/vec2"),a("../utils/Utils"));b.exports=c,c.prototype.applyForce=function(){}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/objects/Spring.js","/objects")},{"../math/vec2":33,"../utils/Utils":52,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],38:[function(a,b){(function(){b.exports={AABB:a("./collision/AABB"),AngleLockEquation:a("./equations/AngleLockEquation"),Body:a("./objects/Body"),Broadphase:a("./collision/Broadphase"),Capsule:a("./shapes/Capsule"),Circle:a("./shapes/Circle"),Constraint:a("./constraints/Constraint"),ContactEquation:a("./equations/ContactEquation"),ContactMaterial:a("./material/ContactMaterial"),Convex:a("./shapes/Convex"),DistanceConstraint:a("./constraints/DistanceConstraint"),Equation:a("./equations/Equation"),EventEmitter:a("./events/EventEmitter"),FrictionEquation:a("./equations/FrictionEquation"),GearConstraint:a("./constraints/GearConstraint"),GridBroadphase:a("./collision/GridBroadphase"),GSSolver:a("./solver/GSSolver"),Heightfield:a("./shapes/Heightfield"),Line:a("./shapes/Line"),LockConstraint:a("./constraints/LockConstraint"),Material:a("./material/Material"),Narrowphase:a("./collision/Narrowphase"),NaiveBroadphase:a("./collision/NaiveBroadphase"),Particle:a("./shapes/Particle"),Plane:a("./shapes/Plane"),RevoluteConstraint:a("./constraints/RevoluteConstraint"),PrismaticConstraint:a("./constraints/PrismaticConstraint"),Rectangle:a("./shapes/Rectangle"),RotationalVelocityEquation:a("./equations/RotationalVelocityEquation"),SAPBroadphase:a("./collision/SAPBroadphase"),Shape:a("./shapes/Shape"),Solver:a("./solver/Solver"),Spring:a("./objects/Spring"),LinearSpring:a("./objects/LinearSpring"),RotationalSpring:a("./objects/RotationalSpring"),Utils:a("./utils/Utils"),World:a("./world/World"),vec2:a("./math/vec2"),version:a("../package.json").version}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/p2.js","/")},{"../package.json":10,"./collision/AABB":11,"./collision/Broadphase":12,"./collision/GridBroadphase":13,"./collision/NaiveBroadphase":14,"./collision/Narrowphase":15,"./collision/SAPBroadphase":16,"./constraints/Constraint":17,"./constraints/DistanceConstraint":18,"./constraints/GearConstraint":19,"./constraints/LockConstraint":20,"./constraints/PrismaticConstraint":21,"./constraints/RevoluteConstraint":22,"./equations/AngleLockEquation":23,"./equations/ContactEquation":24,"./equations/Equation":25,"./equations/FrictionEquation":26,"./equations/RotationalVelocityEquation":28,"./events/EventEmitter":29,"./material/ContactMaterial":30,"./material/Material":31,"./math/vec2":33,"./objects/Body":34,"./objects/LinearSpring":35,"./objects/RotationalSpring":36,"./objects/Spring":37,"./shapes/Capsule":39,"./shapes/Circle":40,"./shapes/Convex":41,"./shapes/Heightfield":42,"./shapes/Line":43,"./shapes/Particle":44,"./shapes/Plane":45,"./shapes/Rectangle":46,"./shapes/Shape":47,"./solver/GSSolver":48,"./solver/Solver":49,"./utils/Utils":52,"./world/World":56,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],39:[function(a,b){(function(){function c(a,b){this.length=a||1,this.radius=b||1,d.call(this,d.CAPSULE)}var d=a("./Shape"),e=a("../math/vec2");b.exports=c,c.prototype=new d,c.prototype.computeMomentOfInertia=function(a){var b=this.radius,c=this.length+b,d=2*b;return a*(d*d+c*c)/12},c.prototype.updateBoundingRadius=function(){this.boundingRadius=this.radius+this.length/2},c.prototype.updateArea=function(){this.area=Math.PI*this.radius*this.radius+2*this.radius*this.length};var f=e.create();c.prototype.computeAABB=function(a,b,c){var d=this.radius;e.set(f,this.length/2,0),0!==c&&e.rotate(f,f,c),e.set(a.upperBound,Math.max(f[0]+d,-f[0]+d),Math.max(f[1]+d,-f[1]+d)),e.set(a.lowerBound,Math.min(f[0]-d,-f[0]-d),Math.min(f[1]-d,-f[1]-d)),e.add(a.lowerBound,a.lowerBound,b),e.add(a.upperBound,a.upperBound,b)}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/shapes/Capsule.js","/shapes")},{"../math/vec2":33,"./Shape":47,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],40:[function(a,b){(function(){function c(a){this.radius=a||1,d.call(this,d.CIRCLE)}var d=a("./Shape"),e=a("../math/vec2");b.exports=c,c.prototype=new d,c.prototype.computeMomentOfInertia=function(a){var b=this.radius;return a*b*b/2},c.prototype.updateBoundingRadius=function(){this.boundingRadius=this.radius},c.prototype.updateArea=function(){this.area=Math.PI*this.radius*this.radius},c.prototype.computeAABB=function(a,b){var c=this.radius;e.set(a.upperBound,c,c),e.set(a.lowerBound,-c,-c),b&&(e.add(a.lowerBound,a.lowerBound,b),e.add(a.upperBound,a.upperBound,b))}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/shapes/Circle.js","/shapes")},{"../math/vec2":33,"./Shape":47,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],41:[function(a,b){(function(){function c(a,b){this.vertices=[],this.axes=[];for(var c=0;c<a.length;c++){var f=e.create();e.copy(f,a[c]),this.vertices.push(f)}if(b)for(var c=0;c<b.length;c++){var g=e.create();e.copy(g,b[c]),this.axes.push(g)}else for(var c=0;c<a.length;c++){var h=a[c],i=a[(c+1)%a.length],j=e.create();e.sub(j,i,h),e.rotate90cw(j,j),e.normalize(j,j),this.axes.push(j)}if(this.centerOfMass=e.fromValues(0,0),this.triangles=[],this.vertices.length&&(this.updateTriangles(),this.updateCenterOfMass()),this.boundingRadius=0,d.call(this,d.CONVEX),this.updateBoundingRadius(),this.updateArea(),this.area<0)throw new Error("Convex vertices must be given in conter-clockwise winding.")}{var d=a("./Shape"),e=a("../math/vec2"),f=a("../math/polyk");a("poly-decomp")}b.exports=c,c.prototype=new d;var g=e.create(),h=e.create();c.prototype.projectOntoLocalAxis=function(a,b){for(var c,d,f=null,h=null,a=g,i=0;i<this.vertices.length;i++)c=this.vertices[i],d=e.dot(c,a),(null===f||d>f)&&(f=d),(null===h||h>d)&&(h=d);if(h>f){var j=h;h=f,f=j}e.set(b,h,f)},c.prototype.projectOntoWorldAxis=function(a,b,c,d){var f=h;this.projectOntoLocalAxis(a,d),0!==c?e.rotate(f,a,c):f=a;var g=e.dot(b,f);e.set(d,d[0]+g,d[1]+g)},c.prototype.updateTriangles=function(){this.triangles.length=0;for(var a=[],b=0;b<this.vertices.length;b++){var c=this.vertices[b];a.push(c[0],c[1])}for(var d=f.Triangulate(a),b=0;b<d.length;b+=3){var e=d[b],g=d[b+1],h=d[b+2];this.triangles.push([e,g,h])}};{var i=e.create(),j=e.create(),k=e.create(),l=e.create(),m=e.create();e.create(),e.create(),e.create(),e.create()}c.prototype.updateCenterOfMass=function(){var a=this.triangles,b=this.vertices,d=this.centerOfMass,f=i,g=k,h=l,n=m,o=j;e.set(d,0,0);for(var p=0,q=0;q!==a.length;q++){var r=a[q],g=b[r[0]],h=b[r[1]],n=b[r[2]];e.centroid(f,g,h,n);var s=c.triangleArea(g,h,n);p+=s,e.scale(o,f,s),e.add(d,d,o)}e.scale(d,d,1/p)},c.prototype.computeMomentOfInertia=function(a){for(var b=0,c=0,d=this.vertices.length,f=d-1,g=0;d>g;f=g,g++){var h=this.vertices[f],i=this.vertices[g],j=Math.abs(e.crossLength(h,i)),k=e.dot(i,i)+e.dot(i,h)+e.dot(h,h);b+=j*k,c+=j}return a/6*(b/c)},c.prototype.updateBoundingRadius=function(){for(var a=this.vertices,b=0,c=0;c!==a.length;c++){var d=e.squaredLength(a[c]);d>b&&(b=d)}this.boundingRadius=Math.sqrt(b)},c.triangleArea=function(a,b,c){return.5*((b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]))},c.prototype.updateArea=function(){this.updateTriangles(),this.area=0;for(var a=this.triangles,b=this.vertices,d=0;d!==a.length;d++){var e=a[d],f=b[e[0]],g=b[e[1]],h=b[e[2]],i=c.triangleArea(f,g,h);this.area+=i}},c.prototype.computeAABB=function(a,b,c){a.setFromPoints(this.vertices,b,c,0)}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/shapes/Convex.js","/shapes")},{"../math/polyk":32,"../math/vec2":33,"./Shape":47,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1,"poly-decomp":9}],42:[function(a,b){(function(){function c(a,b){if(b=e.defaults(b,{maxValue:null,minValue:null,elementWidth:.1}),null===b.minValue||null===b.maxValue){b.maxValue=a[0],b.minValue=a[0];for(var c=0;c!==a.length;c++){var f=a[c];f>b.maxValue&&(b.maxValue=f),f<b.minValue&&(b.minValue=f)}}this.data=a,this.maxValue=b.maxValue,this.minValue=b.minValue,this.elementWidth=b.elementWidth,d.call(this,d.HEIGHTFIELD)}var d=a("./Shape"),e=(a("../math/vec2"),a("../utils/Utils"));b.exports=c,c.prototype=new d,c.prototype.computeMomentOfInertia=function(){return Number.MAX_VALUE},c.prototype.updateBoundingRadius=function(){this.boundingRadius=Number.MAX_VALUE},c.prototype.updateArea=function(){for(var a=this.data,b=0,c=0;c<a.length-1;c++)b+=(a[c]+a[c+1])/2*this.elementWidth;this.area=b},c.prototype.computeAABB=function(a,b){a.upperBound[0]=this.elementWidth*this.data.length+b[0],a.upperBound[1]=this.maxValue+b[1],a.lowerBound[0]=b[0],a.lowerBound[1]=-Number.MAX_VALUE}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/shapes/Heightfield.js","/shapes")},{"../math/vec2":33,"../utils/Utils":52,"./Shape":47,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],43:[function(a,b){(function(){function c(a){this.length=a||1,d.call(this,d.LINE)}var d=a("./Shape"),e=a("../math/vec2");b.exports=c,c.prototype=new d,c.prototype.computeMomentOfInertia=function(a){return a*Math.pow(this.length,2)/12},c.prototype.updateBoundingRadius=function(){this.boundingRadius=this.length/2};var f=[e.create(),e.create()];c.prototype.computeAABB=function(a,b,c){var d=this.length/2;e.set(f[0],-d,0),e.set(f[1],d,0),a.setFromPoints(f,b,c,0)}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/shapes/Line.js","/shapes")},{"../math/vec2":33,"./Shape":47,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],44:[function(a,b){(function(){function c(){d.call(this,d.PARTICLE)}var d=a("./Shape"),e=a("../math/vec2");b.exports=c,c.prototype=new d,c.prototype.computeMomentOfInertia=function(){return 0},c.prototype.updateBoundingRadius=function(){this.boundingRadius=0},c.prototype.computeAABB=function(a,b){e.copy(a.lowerBound,b),e.copy(a.upperBound,b)}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/shapes/Particle.js","/shapes")},{"../math/vec2":33,"./Shape":47,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],45:[function(a,b){(function(){function c(){d.call(this,d.PLANE)}{var d=a("./Shape"),e=a("../math/vec2");a("../utils/Utils")}b.exports=c,c.prototype=new d,c.prototype.computeMomentOfInertia=function(){return 0},c.prototype.updateBoundingRadius=function(){this.boundingRadius=Number.MAX_VALUE},c.prototype.computeAABB=function(a,b,c){var d=0,f=e.set;"number"==typeof c&&(d=c%(2*Math.PI)),0===d?(f(a.lowerBound,-Number.MAX_VALUE,-Number.MAX_VALUE),f(a.upperBound,Number.MAX_VALUE,0)):d===Math.PI/2?(f(a.lowerBound,0,-Number.MAX_VALUE),f(a.upperBound,Number.MAX_VALUE,Number.MAX_VALUE)):d===Math.PI?(f(a.lowerBound,-Number.MAX_VALUE,0),f(a.upperBound,Number.MAX_VALUE,Number.MAX_VALUE)):d===3*Math.PI/2?(f(a.lowerBound,-Number.MAX_VALUE,-Number.MAX_VALUE),f(a.upperBound,0,Number.MAX_VALUE)):(f(a.lowerBound,-Number.MAX_VALUE,-Number.MAX_VALUE),f(a.upperBound,Number.MAX_VALUE,Number.MAX_VALUE)),e.add(a.lowerBound,a.lowerBound,b),e.add(a.upperBound,a.upperBound,b)},c.prototype.updateArea=function(){this.area=Number.MAX_VALUE}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/shapes/Plane.js","/shapes")},{"../math/vec2":33,"../utils/Utils":52,"./Shape":47,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],46:[function(a,b){(function(){function c(a,b){this.width=a||1,this.height=b||1;var c=[d.fromValues(-a/2,-b/2),d.fromValues(a/2,-b/2),d.fromValues(a/2,b/2),d.fromValues(-a/2,b/2)],g=[d.fromValues(1,0),d.fromValues(0,1)];f.call(this,c,g),this.type=e.RECTANGLE}var d=a("../math/vec2"),e=a("./Shape"),f=a("./Convex");b.exports=c,c.prototype=new f([]),c.prototype.computeMomentOfInertia=function(a){var b=this.width,c=this.height;return a*(c*c+b*b)/12},c.prototype.updateBoundingRadius=function(){var a=this.width,b=this.height;this.boundingRadius=Math.sqrt(a*a+b*b)/2};d.create(),d.create(),d.create(),d.create();c.prototype.computeAABB=function(a,b,c){a.setFromPoints(this.vertices,b,c,0)},c.prototype.updateArea=function(){this.area=this.width*this.height}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/shapes/Rectangle.js","/shapes")},{"../math/vec2":33,"./Convex":41,"./Shape":47,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],47:[function(a,b){(function(){function a(b){this.type=b,this.id=a.idCounter++,this.boundingRadius=0,this.collisionGroup=1,this.collisionMask=1,b&&this.updateBoundingRadius(),this.material=null,this.area=0,this.sensor=!1,this.updateArea()}b.exports=a,a.idCounter=0,a.CIRCLE=1,a.PARTICLE=2,a.PLANE=4,a.CONVEX=8,a.LINE=16,a.RECTANGLE=32,a.CAPSULE=64,a.HEIGHTFIELD=128,a.prototype.computeMomentOfInertia=function(){throw new Error("Shape.computeMomentOfInertia is not implemented in this Shape...")},a.prototype.updateBoundingRadius=function(){throw new Error("Shape.updateBoundingRadius is not implemented in this Shape...")},a.prototype.updateArea=function(){},a.prototype.computeAABB=function(){}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/shapes/Shape.js","/shapes")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],48:[function(a,b){(function(){function c(a){f.call(this,a,f.GS),a=a||{},this.iterations=a.iterations||10,this.tolerance=a.tolerance||1e-10,this.arrayStep=30,this.lambda=new g.ARRAY_TYPE(this.arrayStep),this.Bs=new g.ARRAY_TYPE(this.arrayStep),this.invCs=new g.ARRAY_TYPE(this.arrayStep),this.useZeroRHS=!1,this.frictionIterations=0,this.usedIterations=0}function d(a){for(var b=a.length;b--;)a[b]=0}var e=a("../math/vec2"),f=a("./Solver"),g=a("../utils/Utils"),h=a("../equations/FrictionEquation");b.exports=c,c.prototype=new f,c.prototype.solve=function(a,b){this.sortEquations();var f=0,i=this.iterations,j=this.frictionIterations,k=this.equations,l=k.length,m=Math.pow(this.tolerance*l,2),n=b.bodies,o=b.bodies.length,p=(e.add,e.set,this.useZeroRHS),q=this.lambda;if(this.usedIterations=0,l)for(var r=0;r!==o;r++){var s=n[r];s.updateSolveMassProperties()}q.length<l&&(q=this.lambda=new g.ARRAY_TYPE(l+this.arrayStep),this.Bs=new g.ARRAY_TYPE(l+this.arrayStep),this.invCs=new g.ARRAY_TYPE(l+this.arrayStep)),d(q);for(var t=this.invCs,u=this.Bs,q=this.lambda,r=0;r!==k.length;r++){var v=k[r];(v.timeStep!==a||v.needsUpdate)&&(v.timeStep=a,v.update()),u[r]=v.computeB(v.a,v.b,a),t[r]=v.computeInvC(v.epsilon)}var v,w,r,x;if(0!==l){for(r=0;r!==o;r++){var s=n[r];s.resetConstraintVelocity()}if(j){for(f=0;f!==j;f++){for(w=0,x=0;x!==l;x++){v=k[x];var y=c.iterateEquation(x,v,v.epsilon,u,t,q,p,a,f);w+=Math.abs(y)}if(this.usedIterations++,m>=w*w)break}for(c.updateMultipliers(k,q,1/a),x=0;x!==l;x++){var z=k[x];if(z instanceof h){for(var A=0,B=0;B!==z.contactEquations.length;B++)A+=z.contactEquations[B].multiplier;A*=z.frictionCoefficient/z.contactEquations.length,z.maxForce=A,z.minForce=-A}}}for(f=0;f!==i;f++){for(w=0,x=0;x!==l;x++){v=k[x];var y=c.iterateEquation(x,v,v.epsilon,u,t,q,p,a,f);w+=Math.abs(y)}if(this.usedIterations++,m>=w*w)break}for(r=0;r!==o;r++)n[r].addConstraintVelocity();c.updateMultipliers(k,q,1/a)}},c.updateMultipliers=function(a,b,c){for(var d=a.length;d--;)a[d].multiplier=b[d]*c},c.iterateEquation=function(a,b,c,d,e,f,g,h){var i=d[a],j=e[a],k=f[a],l=b.computeGWlambda(),m=b.maxForce,n=b.minForce;g&&(i=0);var o=j*(i-l-c*k),p=k+o;return n*h>p?o=n*h-k:p>m*h&&(o=m*h-k),f[a]+=o,b.addToWlambda(o),o}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/solver/GSSolver.js","/solver")},{"../equations/FrictionEquation":26,"../math/vec2":33,"../utils/Utils":52,"./Solver":49,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],49:[function(a,b){(function(){function c(a,b){a=a||{},d.call(this),this.type=b,this.equations=[],this.equationSortFunction=a.equationSortFunction||!1}var d=(a("../utils/Utils"),a("../events/EventEmitter"));b.exports=c,c.prototype=new d,c.prototype.solve=function(){throw new Error("Solver.solve should be implemented by subclasses!")};var e={bodies:[]};c.prototype.solveIsland=function(a,b){this.removeAllEquations(),b.equations.length&&(this.addEquations(b.equations),e.bodies.length=0,b.getBodies(e.bodies),e.bodies.length&&this.solve(a,e))},c.prototype.sortEquations=function(){this.equationSortFunction&&this.equations.sort(this.equationSortFunction)},c.prototype.addEquation=function(a){a.enabled&&this.equations.push(a)},c.prototype.addEquations=function(a){for(var b=0,c=a.length;b!==c;b++){var d=a[b];d.enabled&&this.equations.push(d)}},c.prototype.removeEquation=function(a){var b=this.equations.indexOf(a);-1!==b&&this.equations.splice(b,1)},c.prototype.removeAllEquations=function(){this.equations.length=0},c.GS=1,c.ISLAND=2}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/solver/Solver.js","/solver")},{"../events/EventEmitter":29,"../utils/Utils":52,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],50:[function(a,b){(function(){function c(){this.overlappingShapesLastState=new e,this.overlappingShapesCurrentState=new e,this.recordPool=[],this.tmpDict=new e,this.tmpArray1=[]}function d(a,b,c,d){this.shapeA=b,this.shapeB=d,this.bodyA=a,this.bodyB=c}{var e=a("./TupleDictionary");a("./Utils")}b.exports=c,c.prototype.tick=function(){for(var a=this.overlappingShapesLastState,b=this.overlappingShapesCurrentState,c=a.keys.length;c--;){var d=a.keys[c],e=a.getByKey(d),f=b.getByKey(d);e&&!f&&this.recordPool.push(e)}a.reset(),a.copy(b),b.reset()},c.prototype.setOverlapping=function(a,b,c,e){var f=(this.overlappingShapesLastState,this.overlappingShapesCurrentState);if(!f.get(b.id,e.id)){var g;this.recordPool.length?(g=this.recordPool.pop(),g.set(a,b,c,e)):g=new d(a,b,c,e),f.set(b.id,e.id,g)}},c.prototype.getNewOverlaps=function(a){return this.getDiff(this.overlappingShapesLastState,this.overlappingShapesCurrentState,a)},c.prototype.getEndOverlaps=function(a){return this.getDiff(this.overlappingShapesCurrentState,this.overlappingShapesLastState,a)},c.prototype.bodiesAreOverlapping=function(a,b){for(var c=this.overlappingShapesCurrentState,d=c.keys.length;d--;){var e=c.keys[d],f=c.data[e];if(f.bodyA===a&&f.bodyB===b||f.bodyA===b&&f.bodyB===a)return!0}return!1},c.prototype.getDiff=function(a,b,c){var c=c||[],d=a,e=b;c.length=0;for(var f=e.keys.length;f--;){var g=e.keys[f],h=e.data[g];if(!h)throw new Error("Key "+g+" had no data!");var i=d.data[g];i||c.push(h)}return c},c.prototype.isNewOverlap=function(a,b){var c=0|a.id,d=0|b.id,e=this.overlappingShapesLastState,f=this.overlappingShapesCurrentState;return!e.get(c,d)&&!!f.get(c,d)},c.prototype.getNewBodyOverlaps=function(a){this.tmpArray1.length=0;var b=this.getNewOverlaps(this.tmpArray1);return this.getBodyDiff(b,a)},c.prototype.getEndBodyOverlaps=function(a){this.tmpArray1.length=0;var b=this.getEndOverlaps(this.tmpArray1);return this.getBodyDiff(b,a)},c.prototype.getBodyDiff=function(a,b){b=b||[];for(var c=this.tmpDict,d=a.length;d--;){var e=a[d];
c.set(0|e.bodyA.id,0|e.bodyB.id,e)}for(d=c.keys.length;d--;){var e=c.getByKey(c.keys[d]);e&&b.push(e.bodyA,e.bodyB)}return c.reset(),b},d.prototype.set=function(a,b,c,e){d.call(this,a,b,c,e)}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/utils/OverlapKeeper.js","/utils")},{"./TupleDictionary":51,"./Utils":52,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],51:[function(a,b){(function(){function c(){this.data={},this.keys=[]}var d=a("./Utils");b.exports=c,c.prototype.getKey=function(a,b){return a=0|a,b=0|b,(0|a)===(0|b)?-1:0|((0|a)>(0|b)?a<<16|65535&b:b<<16|65535&a)},c.prototype.getByKey=function(a){return a=0|a,this.data[a]},c.prototype.get=function(a,b){return this.data[this.getKey(a,b)]},c.prototype.set=function(a,b,c){if(!c)throw new Error("No data!");var d=this.getKey(a,b);return this.data[d]||this.keys.push(d),this.data[d]=c,d},c.prototype.reset=function(){for(var a=this.data,b=this.keys,c=b.length;c--;)delete a[b[c]];b.length=0},c.prototype.copy=function(a){this.reset(),d.appendArray(this.keys,a.keys);for(var b=a.keys.length;b--;){var c=a.keys[b];this.data[c]=a.data[c]}}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/utils/TupleDictionary.js","/utils")},{"./Utils":52,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],52:[function(a,b){(function(){function a(){}b.exports=a,a.appendArray=function(a,b){if(b.length<15e4)a.push.apply(a,b);else for(var c=0,d=b.length;c!==d;++c)a.push(b[c])},a.splice=function(a,b,c){c=c||1;for(var d=b,e=a.length-c;e>d;d++)a[d]=a[d+c];a.length=e},a.ARRAY_TYPE="undefined"!=typeof P2_ARRAY_TYPE?P2_ARRAY_TYPE:"undefined"!=typeof Float32Array?Float32Array:Array,a.extend=function(a,b){for(var c in b)a[c]=b[c]},a.defaults=function(a,b){a=a||{};for(var c in b)c in a||(a[c]=b[c]);return a}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/utils/Utils.js","/utils")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],53:[function(a,b){(function(){function c(){this.equations=[],this.bodies=[]}var d=a("../objects/Body");b.exports=c,c.prototype.reset=function(){this.equations.length=this.bodies.length=0};var e=[];c.prototype.getBodies=function(a){var b=a||[],c=this.equations;e.length=0;for(var d=0;d!==c.length;d++){var f=c[d];-1===e.indexOf(f.bodyA.id)&&(b.push(f.bodyA),e.push(f.bodyA.id)),-1===e.indexOf(f.bodyB.id)&&(b.push(f.bodyB),e.push(f.bodyB.id))}return b},c.prototype.wantsToSleep=function(){for(var a=0;a<this.bodies.length;a++){var b=this.bodies[a];if(b.type===d.DYNAMIC&&!b.wantsToSleep)return!1}return!0},c.prototype.sleep=function(){for(var a=0;a<this.bodies.length;a++){var b=this.bodies[a];b.sleep()}return!0}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/world/Island.js","/world")},{"../objects/Body":34,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],54:[function(a,b){(function(){function c(){this._nodePool=[],this._islandPool=[],this.equations=[],this.islands=[],this.nodes=[],this.queue=[]}var d=(a("../math/vec2"),a("./Island")),e=a("./IslandNode"),f=a("../objects/Body");b.exports=c,c.getUnvisitedNode=function(a){for(var b=a.length,c=0;c!==b;c++){var d=a[c];if(!d.visited&&d.body.type===f.DYNAMIC)return d}return!1},c.prototype.visit=function(a,b,c){b.push(a.body);for(var d=a.equations.length,e=0;e!==d;e++){var f=a.equations[e];-1===c.indexOf(f)&&c.push(f)}},c.prototype.bfs=function(a,b,d){var e=this.queue;for(e.length=0,e.push(a),a.visited=!0,this.visit(a,b,d);e.length;)for(var g,h=e.pop();g=c.getUnvisitedNode(h.neighbors);)g.visited=!0,this.visit(g,b,d),g.body.type===f.DYNAMIC&&e.push(g)},c.prototype.split=function(a){for(var b=a.bodies,f=this.nodes,g=this.equations;f.length;)this._nodePool.push(f.pop());for(var h=0;h!==b.length;h++)if(this._nodePool.length){var i=this._nodePool.pop();i.reset(),i.body=b[h],f.push(i)}else f.push(new e(b[h]));for(var j=0;j!==g.length;j++){var k=g[j],h=b.indexOf(k.bodyA),l=b.indexOf(k.bodyB),m=f[h],n=f[l];m.neighbors.push(n),n.neighbors.push(m),m.equations.push(k),n.equations.push(k)}for(var o=this.islands;o.length;){var p=o.pop();p.reset(),this._islandPool.push(p)}for(var q;q=c.getUnvisitedNode(f);){var p=this._islandPool.length?this._islandPool.pop():new d;this.bfs(q,p.bodies,p.equations),o.push(p)}return o}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/world/IslandManager.js","/world")},{"../math/vec2":33,"../objects/Body":34,"./Island":53,"./IslandNode":55,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],55:[function(a,b){(function(){function a(a){this.body=a,this.neighbors=[],this.equations=[],this.visited=!1}b.exports=a,a.prototype.reset=function(){this.equations.length=0,this.neighbors.length=0,this.visited=!1,this.body=null}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/world/IslandNode.js","/world")},{"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}],56:[function(a,b){(function(){function c(a){l.apply(this),a=a||{},this.springs=[],this.bodies=[],this.disabledBodyCollisionPairs=[],this.solver=a.solver||new d,this.narrowphase=new p(this),this.islandManager=new s,this.gravity=f.fromValues(0,-9.78),a.gravity&&f.copy(this.gravity,a.gravity),this.frictionGravity=f.length(this.gravity)||10,this.useWorldGravityAsFrictionGravity=!0,this.useFrictionGravityOnZeroGravity=!0,this.doProfiling=a.doProfiling||!1,this.lastStepTime=0,this.broadphase=a.broadphase||new e,this.broadphase.setWorld(this),this.constraints=[],this.defaultMaterial=new n,this.defaultContactMaterial=new o(this.defaultMaterial,this.defaultMaterial),this.lastTimeStep=1/60,this.applySpringForces=!0,this.applyDamping=!0,this.applyGravity=!0,this.solveConstraints=!0,this.contactMaterials=[],this.time=0,this.stepping=!1,this.bodiesToBeRemoved=[],this.fixedStepTime=0,this.islandSplit="undefined"!=typeof a.islandSplit?!!a.islandSplit:!1,this.emitImpactEvent=!0,this._constraintIdCounter=0,this._bodyIdCounter=0,this.postStepEvent={type:"postStep"},this.addBodyEvent={type:"addBody",body:null},this.removeBodyEvent={type:"removeBody",body:null},this.addSpringEvent={type:"addSpring",spring:null},this.impactEvent={type:"impact",bodyA:null,bodyB:null,shapeA:null,shapeB:null,contactEquation:null},this.postBroadphaseEvent={type:"postBroadphase",pairs:null},this.sleepMode=c.NO_SLEEPING,this.beginContactEvent={type:"beginContact",shapeA:null,shapeB:null,bodyA:null,bodyB:null,contactEquations:[]},this.endContactEvent={type:"endContact",shapeA:null,shapeB:null,bodyA:null,bodyB:null},this.preSolveEvent={type:"preSolve",contactEquations:null,frictionEquations:null},this.overlappingShapesLastState={keys:[]},this.overlappingShapesCurrentState={keys:[]},this.overlapKeeper=new r}{var d=a("../solver/GSSolver"),e=(a("../solver/Solver"),a("../collision/NaiveBroadphase")),f=a("../math/vec2"),g=a("../shapes/Circle"),h=(a("../shapes/Rectangle"),a("../shapes/Convex")),i=(a("../shapes/Line"),a("../shapes/Plane")),j=a("../shapes/Capsule"),k=a("../shapes/Particle"),l=a("../events/EventEmitter"),m=a("../objects/Body"),n=(a("../shapes/Shape"),a("../objects/LinearSpring"),a("../material/Material")),o=a("../material/ContactMaterial"),p=(a("../constraints/DistanceConstraint"),a("../constraints/Constraint"),a("../constraints/LockConstraint"),a("../constraints/RevoluteConstraint"),a("../constraints/PrismaticConstraint"),a("../constraints/GearConstraint"),a("../../package.json"),a("../collision/Broadphase"),a("../collision/SAPBroadphase"),a("../collision/Narrowphase")),q=a("../utils/Utils"),r=a("../utils/OverlapKeeper"),s=a("./IslandManager");a("../objects/RotationalSpring")}if(b.exports=c,"undefined"==typeof performance&&(performance={}),!performance.now){var t=Date.now();performance.timing&&performance.timing.navigationStart&&(t=performance.timing.navigationStart),performance.now=function(){return Date.now()-t}}c.prototype=new Object(l.prototype),c.NO_SLEEPING=1,c.BODY_SLEEPING=2,c.ISLAND_SLEEPING=4,c.prototype.addConstraint=function(a){this.constraints.push(a)},c.prototype.addContactMaterial=function(a){this.contactMaterials.push(a)},c.prototype.removeContactMaterial=function(a){var b=this.contactMaterials.indexOf(a);-1!==b&&q.splice(this.contactMaterials,b,1)},c.prototype.getContactMaterial=function(a,b){for(var c=this.contactMaterials,d=0,e=c.length;d!==e;d++){var f=c[d];if(f.materialA.id===a.id&&f.materialB.id===b.id||f.materialA.id===b.id&&f.materialB.id===a.id)return f}return!1},c.prototype.removeConstraint=function(a){var b=this.constraints.indexOf(a);-1!==b&&q.splice(this.constraints,b,1)};var u=(f.create(),f.create(),f.create(),f.create(),f.create(),f.create(),f.create()),v=f.fromValues(0,0),w=f.fromValues(0,0),x=(f.fromValues(0,0),f.fromValues(0,0));c.prototype.step=function(a,b,c){if(c=c||10,b=b||0,0===b)this.internalStep(a),this.time+=a;else{var d=Math.floor((this.time+b)/a)-Math.floor(this.time/a);d=Math.min(d,c);for(var e=performance.now(),g=0;g!==d&&(this.internalStep(a),!(performance.now()-e>1e3*a));g++);this.time+=b;for(var h=this.time%a,i=h/a,j=0;j!==this.bodies.length;j++){var k=this.bodies[j];k.type!==m.STATIC&&k.sleepState!==m.SLEEPING?(f.sub(x,k.position,k.previousPosition),f.scale(x,x,i),f.add(k.interpolatedPosition,k.position,x),k.interpolatedAngle=k.angle+(k.angle-k.previousAngle)*i):(f.copy(k.interpolatedPosition,k.position),k.interpolatedAngle=k.angle)}}};var y=[];c.prototype.internalStep=function(a){this.stepping=!0;var b,d,e=this,g=this.doProfiling,h=this.springs.length,i=this.springs,j=this.bodies,k=this.gravity,l=this.solver,n=this.bodies.length,o=this.broadphase,p=this.narrowphase,r=this.constraints,s=u,t=(f.scale,f.add),v=(f.rotate,this.islandManager);if(this.overlapKeeper.tick(),this.lastTimeStep=a,g&&(b=performance.now()),this.useWorldGravityAsFrictionGravity){var w=f.length(this.gravity);0===w&&this.useFrictionGravityOnZeroGravity||(this.frictionGravity=w)}if(this.applyGravity)for(var x=0;x!==n;x++){var z=j[x],A=z.force;z.type===m.DYNAMIC&&z.sleepState!==m.SLEEPING&&(f.scale(s,k,z.mass*z.gravityScale),t(A,A,s))}if(this.applySpringForces)for(var x=0;x!==h;x++){var B=i[x];B.applyForce()}if(this.applyDamping)for(var x=0;x!==n;x++){var z=j[x];z.type===m.DYNAMIC&&z.applyDamping(a)}for(var C=o.getCollisionPairs(this),D=this.disabledBodyCollisionPairs,x=D.length-2;x>=0;x-=2)for(var E=C.length-2;E>=0;E-=2)(D[x]===C[E]&&D[x+1]===C[E+1]||D[x+1]===C[E]&&D[x]===C[E+1])&&C.splice(E,2);var F=r.length;for(x=0;x!==F;x++){var G=r[x];if(!G.collideConnected)for(var E=C.length-2;E>=0;E-=2)(G.bodyA===C[E]&&G.bodyB===C[E+1]||G.bodyB===C[E]&&G.bodyA===C[E+1])&&C.splice(E,2)}this.postBroadphaseEvent.pairs=C,this.emit(this.postBroadphaseEvent),p.reset(this);for(var x=0,H=C.length;x!==H;x+=2)for(var I=C[x],J=C[x+1],K=0,L=I.shapes.length;K!==L;K++)for(var M=I.shapes[K],N=I.shapeOffsets[K],O=I.shapeAngles[K],P=0,Q=J.shapes.length;P!==Q;P++){var R=J.shapes[P],S=J.shapeOffsets[P],T=J.shapeAngles[P],U=this.defaultContactMaterial;if(M.material&&R.material){var V=this.getContactMaterial(M.material,R.material);V&&(U=V)}this.runNarrowphase(p,I,M,N,O,J,R,S,T,U,this.frictionGravity)}for(var x=0;x!==n;x++){var W=j[x];W._wakeUpAfterNarrowphase&&(W.wakeUp(),W._wakeUpAfterNarrowphase=!1)}if(this.has("endContact")){this.overlapKeeper.getEndOverlaps(y);for(var X=this.endContactEvent,P=y.length;P--;){var Y=y[P];X.shapeA=Y.shapeA,X.shapeB=Y.shapeB,X.bodyA=Y.bodyA,X.bodyB=Y.bodyA,this.emit(X)}}var Z=this.preSolveEvent;Z.contactEquations=p.contactEquations,Z.frictionEquations=p.frictionEquations,this.emit(Z);var F=r.length;for(x=0;x!==F;x++)r[x].update();if(p.contactEquations.length||p.frictionEquations.length||r.length)if(this.islandSplit){for(v.equations.length=0,q.appendArray(v.equations,p.contactEquations),q.appendArray(v.equations,p.frictionEquations),x=0;x!==F;x++)q.appendArray(v.equations,r[x].equations);v.split(this);for(var x=0;x!==v.islands.length;x++){var $=v.islands[x];$.equations.length&&l.solveIsland(a,$)}}else{for(l.addEquations(p.contactEquations),l.addEquations(p.frictionEquations),x=0;x!==F;x++)l.addEquations(r[x].equations);this.solveConstraints&&l.solve(a,this),l.removeAllEquations()}for(var x=0;x!==n;x++){var W=j[x];W.sleepState!==m.SLEEPING&&W.type!==m.STATIC&&c.integrateBody(W,a)}for(var x=0;x!==n;x++)j[x].setZeroForce();if(g&&(d=performance.now(),e.lastStepTime=d-b),this.emitImpactEvent&&this.has("impact"))for(var _=this.impactEvent,x=0;x!==p.contactEquations.length;x++){var ab=p.contactEquations[x];ab.firstImpact&&(_.bodyA=ab.bodyA,_.bodyB=ab.bodyB,_.shapeA=ab.shapeA,_.shapeB=ab.shapeB,_.contactEquation=ab,this.emit(_))}if(this.sleepMode===c.BODY_SLEEPING)for(x=0;x!==n;x++)j[x].sleepTick(this.time,!1,a);else if(this.sleepMode===c.ISLAND_SLEEPING&&this.islandSplit){for(x=0;x!==n;x++)j[x].sleepTick(this.time,!0,a);for(var x=0;x<this.islandManager.islands.length;x++){var $=this.islandManager.islands[x];$.wantsToSleep()&&$.sleep()}}if(this.stepping=!1,this.bodiesToBeRemoved.length){for(var x=0;x!==this.bodiesToBeRemoved.length;x++)this.removeBody(this.bodiesToBeRemoved[x]);this.bodiesToBeRemoved.length=0}this.emit(this.postStepEvent)};var z=f.create(),A=f.create();c.integrateBody=function(a,b){var c=a.invMass,d=a.force,e=a.position,g=a.velocity;f.copy(a.previousPosition,a.position),a.previousAngle=a.angle,a.fixedRotation||(a.angularVelocity+=a.angularForce*a.invInertia*b,a.angle+=a.angularVelocity*b),f.scale(z,d,b*c),f.add(g,z,g),f.scale(A,g,b),f.add(e,e,A),a.aabbNeedsUpdate=!0},c.prototype.runNarrowphase=function(a,b,c,d,e,g,h,i,j,k,l){if(0!==(c.collisionGroup&h.collisionMask)&&0!==(h.collisionGroup&c.collisionMask)){f.rotate(v,d,b.angle),f.rotate(w,i,g.angle),f.add(v,v,b.position),f.add(w,w,g.position);var n=e+b.angle,o=j+g.angle;a.enableFriction=k.friction>0,a.frictionCoefficient=k.friction;var p;p=b.type===m.STATIC||b.type===m.KINEMATIC?g.mass:g.type===m.STATIC||g.type===m.KINEMATIC?b.mass:b.mass*g.mass/(b.mass+g.mass),a.slipForce=k.friction*l*p,a.restitution=k.restitution,a.surfaceVelocity=k.surfaceVelocity,a.frictionStiffness=k.frictionStiffness,a.frictionRelaxation=k.frictionRelaxation,a.stiffness=k.stiffness,a.relaxation=k.relaxation,a.contactSkinSize=k.contactSkinSize;var q=a[c.type|h.type],r=0;if(q){var s=c.sensor||h.sensor,t=a.frictionEquations.length;r=c.type<h.type?q.call(a,b,c,v,n,g,h,w,o,s):q.call(a,g,h,w,o,b,c,v,n,s);var u=a.frictionEquations.length-t;if(r){if(b.allowSleep&&b.type===m.DYNAMIC&&b.sleepState===m.SLEEPING&&g.sleepState===m.AWAKE&&g.type!==m.STATIC){var x=f.squaredLength(g.velocity)+Math.pow(g.angularVelocity,2),y=Math.pow(g.sleepSpeedLimit,2);x>=2*y&&(b._wakeUpAfterNarrowphase=!0)}if(g.allowSleep&&g.type===m.DYNAMIC&&g.sleepState===m.SLEEPING&&b.sleepState===m.AWAKE&&b.type!==m.STATIC){var z=f.squaredLength(b.velocity)+Math.pow(b.angularVelocity,2),A=Math.pow(b.sleepSpeedLimit,2);z>=2*A&&(g._wakeUpAfterNarrowphase=!0)}if(this.overlapKeeper.setOverlapping(b,c,g,h),this.has("beginContact")&&this.overlapKeeper.isNewOverlap(c,h)){var B=this.beginContactEvent;if(B.shapeA=c,B.shapeB=h,B.bodyA=b,B.bodyB=g,B.contactEquations.length=0,"number"==typeof r)for(var C=a.contactEquations.length-r;C<a.contactEquations.length;C++)B.contactEquations.push(a.contactEquations[C]);this.emit(B)}if("number"==typeof r&&u>1)for(var C=a.frictionEquations.length-u;C<a.frictionEquations.length;C++){var D=a.frictionEquations[C];D.setSlipForce(D.getSlipForce()/u)}}}}},c.prototype.addSpring=function(a){this.springs.push(a),this.addSpringEvent.spring=a,this.emit(this.addSpringEvent)},c.prototype.removeSpring=function(a){var b=this.springs.indexOf(a);-1!==b&&q.splice(this.springs,b,1)},c.prototype.addBody=function(a){-1===this.bodies.indexOf(a)&&(this.bodies.push(a),a.world=this,this.addBodyEvent.body=a,this.emit(this.addBodyEvent))},c.prototype.removeBody=function(a){if(this.stepping)this.bodiesToBeRemoved.push(a);else{a.world=null;var b=this.bodies.indexOf(a);-1!==b&&(q.splice(this.bodies,b,1),this.removeBodyEvent.body=a,a.resetConstraintVelocity(),this.emit(this.removeBodyEvent))}},c.prototype.getBodyById=function(a){for(var b=this.bodies,c=0;c<b.length;c++){var d=b[c];if(d.id===a)return d}return!1},c.prototype.disableBodyCollision=function(a,b){this.disabledBodyCollisionPairs.push(a,b)},c.prototype.enableBodyCollision=function(a,b){for(var c=this.disabledBodyCollisionPairs,d=0;d<c.length;d+=2)if(c[d]===a&&c[d+1]===b||c[d+1]===a&&c[d]===b)return void c.splice(d,2)},c.prototype.clear=function(){this.time=0,this.fixedStepTime=0,this.solver&&this.solver.equations.length&&this.solver.removeAllEquations();for(var a=this.constraints,b=a.length-1;b>=0;b--)this.removeConstraint(a[b]);for(var d=this.bodies,b=d.length-1;b>=0;b--)this.removeBody(d[b]);for(var e=this.springs,b=e.length-1;b>=0;b--)this.removeSpring(e[b]);for(var f=this.contactMaterials,b=f.length-1;b>=0;b--)this.removeContactMaterial(f[b]);c.apply(this)},c.prototype.clone=function(){var a=new c;return a.fromJSON(this.toJSON()),a};var B=f.create(),C=f.fromValues(0,0),D=f.fromValues(0,0);c.prototype.hitTest=function(a,b,c){c=c||0;var d=new m({position:a}),e=new k,l=a,n=0,o=B,p=C,q=D;d.addShape(e);for(var r=this.narrowphase,s=[],t=0,u=b.length;t!==u;t++)for(var v=b[t],w=0,x=v.shapes.length;w!==x;w++){var y=v.shapes[w],z=v.shapeOffsets[w]||p,A=v.shapeAngles[w]||0;f.rotate(o,z,v.angle),f.add(o,o,v.position);var E=A+v.angle;(y instanceof g&&r.circleParticle(v,y,o,E,d,e,l,n,!0)||y instanceof h&&r.particleConvex(d,e,l,n,v,y,o,E,!0)||y instanceof i&&r.particlePlane(d,e,l,n,v,y,o,E,!0)||y instanceof j&&r.particleCapsule(d,e,l,n,v,y,o,E,!0)||y instanceof k&&f.squaredLength(f.sub(q,o,a))<c*c)&&s.push(v)}return s},c.prototype.setGlobalEquationParameters=function(a){a=a||{};for(var b=0;b!==this.constraints.length;b++)for(var c=this.constraints[b],d=0;d!==c.equations.length;d++){var e=c.equations[d];"undefined"!=typeof a.stiffness&&(e.stiffness=a.stiffness),"undefined"!=typeof a.relaxation&&(e.relaxation=a.relaxation),e.needsUpdate=!0}for(var b=0;b!==this.contactMaterials.length;b++){var c=this.contactMaterials[b];"undefined"!=typeof a.stiffness&&(c.stiffness=a.stiffness,c.frictionStiffness=a.stiffness),"undefined"!=typeof a.relaxation&&(c.relaxation=a.relaxation,c.frictionRelaxation=a.relaxation)}var c=this.defaultContactMaterial;"undefined"!=typeof a.stiffness&&(c.stiffness=a.stiffness,c.frictionStiffness=a.stiffness),"undefined"!=typeof a.relaxation&&(c.relaxation=a.relaxation,c.frictionRelaxation=a.relaxation)},c.prototype.setGlobalStiffness=function(a){this.setGlobalEquationParameters({stiffness:a})},c.prototype.setGlobalRelaxation=function(a){this.setGlobalEquationParameters({relaxation:a})}}).call(this,a("/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/world/World.js","/world")},{"../../package.json":10,"../collision/Broadphase":12,"../collision/NaiveBroadphase":14,"../collision/Narrowphase":15,"../collision/SAPBroadphase":16,"../constraints/Constraint":17,"../constraints/DistanceConstraint":18,"../constraints/GearConstraint":19,"../constraints/LockConstraint":20,"../constraints/PrismaticConstraint":21,"../constraints/RevoluteConstraint":22,"../events/EventEmitter":29,"../material/ContactMaterial":30,"../material/Material":31,"../math/vec2":33,"../objects/Body":34,"../objects/LinearSpring":35,"../objects/RotationalSpring":36,"../shapes/Capsule":39,"../shapes/Circle":40,"../shapes/Convex":41,"../shapes/Line":43,"../shapes/Particle":44,"../shapes/Plane":45,"../shapes/Rectangle":46,"../shapes/Shape":47,"../solver/GSSolver":48,"../solver/Solver":49,"../utils/OverlapKeeper":50,"../utils/Utils":52,"./IslandManager":54,"/Users/schteppe/git/p2.js/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,buffer:1}]},{},[38])(38)});
/**
 * @classdesc 该类是soya中应用物理系统的统一接口，默认使用p2(https://github.com/schteppe/p2.js)物理引擎，
 * 其他引擎还在扩展中。<br/>引擎本身的设置参数请参考引擎对应文档
 * 
 * @class 
 * @param {Object} opts 物理系统参数
 * @param {Array} opts.gravity 重力向量[x,y]
 * @param {Number} opts.friction 全局摩擦力
 * @param {Number} opts.bounce 全局弹力
 * @param {Number} opts.stiffness 全局物体刚度
 * @param {Number} opts.relaxation 全局弛豫度
 * @param {Number} opts.tolerance 全局公差
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Physics = function(opts){
	opts = opts || {};

	opts.gravity = opts.gravity || [0,9.8];
	opts.friction = opts.friction || 1;
	opts.bounce = opts.bounce || 0.5;
	opts.stiffness = opts.stiffness || 100000;
	opts.relaxation = opts.relaxation || 20;
	opts.tolerance = opts.tolerance || 0.01;

	/**
	 * 物理世界
	 * @type {Object}
	 */
	this.world = new p2.World(opts);

	this.world.defaultContactMaterial.friction = 1 || opts.friction;
	this.world.defaultContactMaterial.restitution = opts.bounce;
	this.world.defaultContactMaterial.stiffness = opts.stiffness;
	this.world.defaultContactMaterial.relaxation = opts.relaxation;

	this.world.solver.tolerance = opts.tolerance;
	//todo 根据世界内的物体量，自动控制iterations
	//this.world.solver.iterations = 20;
	
	var bcs = [],
		ecs = [];

	var thisGame;
	/**
     * 启动监听
     * @return this
     * @private
     */
    this.startListen = function(game){
        thisGame = game;
        //监听碰撞开始事件
		this.world.on("beginContact", function(event) {

			bcs.push({a:event.bodyA.ro,b:event.bodyB.ro});
		}, this);

		//监听碰撞结束事件
		this.world.on("endContact", function(event) {

			ecs.push({a:event.bodyA.ro,b:event.bodyB.ro});
		}, this);

        return this;
    }

    /**
     * 停止监听
     * @return this
     * @private
     */
    this.stopListen = function(game){
        
        return this;
    }

    /**
     * 扫描是否需要执行事件，如果需要，执行
     * @private
     */
	this.scan = function(){
		if(bcs.length>0){
			var events = this.__eventMap['contactstart'];
            fireEvent(events,'contactstart');
		}
		if(ecs.length>0){
			var events = this.__eventMap['contactend'];
            fireEvent(events,'contactend');
		}

        reset();
    }
    function reset(){
        bcs = [];
        ecs = [];
    }
    var eventObj = {
    	collisionPairs:null,
    	otherCollider:null
    };
    function fireEvent(events,type){
        if(!events)return;

        //排序
        events.sort(function(a,b){
            return a.order - b.order;
        });

        var scene = thisGame.scene;

        for(var i=events.length;i--;){
            var target = events[i].context;
            var pairs = null,
            	otherCollider = null;
            if(target instanceof soya2d.DisplayObject && target != scene){
                if(type == 'contactstart' ||
                	type == 'contactend'){

                	var pairs = type == 'contactstart'?bcs:ecs;

                	var canfire = false;
                	for(var j=pairs.length;j--;){
                		var obj = pairs[j];
                		if(obj.a == target || obj.b == target){
                			canfire = true;
                			otherCollider = obj.a == target?obj.b:obj.a;
                			break;
                		}
                	}
                	if(!canfire)continue;
                }
            }
            eventObj.collisionPairs = pairs;
            eventObj.otherCollider = otherCollider;

            events[i].fn.call(target,eventObj);
        }
    }
	/***************** 外部接口 ******************/
	
	/**
	 * 绑定一个soya2d可渲染对象到物理环境中
	 * @param  {soya2d.DisplayObject} ro soya2d可渲染对象
	 * @param  {Object} opts 绑定参数对象，参数如下：
	 * @param  {int} [opts.type=soya2d.PHY_DYNAMIC] 响应类型，控制该物体是应用物理效果。
	 * 如果mass为0时，又想应用物理效果，可以设置该属性为soya2d.PHY_DYNAMIC
	 * @param  {Number} [opts.mass=1] 物体质量，如果为0，则默认该物体不应用物理效果
	 * @param  {Number} [opts.angularVelocity=0] 角速度
	 * @param  {boolean} [opts.fixedRotation=false] 是否固定旋转
	 * @param  {boolean} [opts.sensor=false] 是否不与其他物体碰撞
	 * 
	 * @see soya2d.PHY_DYNAMIC
	 */
	this.bind = function(ro, opts) {
		opts = opts||{};
		var shape;

		var offx = 0,offy = 0;
		offx = ro.w/2,offy = ro.h/2;

		if (ro.bounds instanceof soya2d.Rectangle) {
			shape = new p2.Rectangle(ro.w, ro.h);
		} else if (ro.bounds instanceof soya2d.Circle) {
			shape = new p2.Circle(ro.bounds.r);
		}else if (ro.bounds instanceof soya2d.Polygon) {
			var vtx = ro.bounds.vtx;
			//转换1维数组
			var convex = [];
			for(var i=0;i<vtx.length;i+=2){
				convex.push([vtx[i] - offx,vtx[i+1] - offy]);
			}
			shape = new p2.Convex(convex);
		}


		//刚体默认参数
		opts.mass = opts.mass === 0?0:opts.mass || 1;
		opts.sensor = opts.sensor || false;
		opts.position = [ro.x + offx, ro.y  + offy];
		opts.angularVelocity = opts.angularVelocity || 0;
		opts.fixedRotation = opts.fixedRotation || false;
		switch(opts.type){
			case soya2d.PHY_STATIC:
				opts.type = p2.Body.STATIC;
				break;
			case soya2d.PHY_DYNAMIC:
			default:
				if(opts.mass == 0)opts.type = p2.Body.KINEMATIC;
				break;
		}

		//创建刚体
		var body = new p2.Body(opts);

		shape.sensor = opts.sensor;
		body.addShape(shape);
		this.world.addBody(body);
		
		//用于方便相互查找
		ro.body = body;
		body.ro = ro;

	};

	/**
	 * 从物理环境中解除soya2d可渲染对象
	 * @param  {soya2d.DisplayObject} ro soya2d可渲染对象
	 */
	this.unbind = function(ro) {
		this.world.removeBody(ro.body);
		ro.body = null;
		delete ro.body;
	};

	/**
	 * 更新物理世界，通常不需要手动调用
	 * @private
	 */
	this.update = function(dt) {
		this.world.step(dt);
		for(var i=this.world.bodies.length; i--;){
			var body = this.world.bodies[i];
			var ro = body.ro;
			if(!ro)continue;
			if(isNaN(body.position[0]))continue;

			//传给绘图引擎的偏移量
			var offx = 0,offy = 0;
			offx = ro.w/2,offy = ro.h/2;
			
			
			ro.x = body.position[0] - offx;
			ro.y = body.position[1] - offy;
			ro.rotation = body.angle * 180 / Math.PI;
		}
	};

	soya2d.EventHandler.call(this);
};
soya2d.inherits(soya2d.Physics,soya2d.EventHandler);
/**
 * 物理响应类型，静态
 * @type {Number}
 */
soya2d.PHY_STATIC = 1;
/**
 * 物理响应类型，动态
 * @type {Number}
 */
soya2d.PHY_DYNAMIC = 2;
soya2d.module.install('physics',{
    onInit:function(game){
        /**
		 * 启动物理系统
		 * @param {Object} opts 物理系统参数
		 * @see soya2d.Physics
		 * @requires physics
		 * @memberOf! soya2d.Game#
         * @alias startPhysics
		 * @return {soya2d.Physics} 返回物理系统
		 */
		game.startPhysics = function(opts){
			if(game.physics)return;
			/**
			 * 该游戏实例的物理接口
			 * @type {soya2d}
			 */
			game.physics = new soya2d.Physics(opts);

			var phyEvents = ['contactstart','contactend'];
			game.events.register(phyEvents,game.physics);
			game.physics.startListen(game);

			return game.physics;
		}
		/**
		 * 停止物理系统
		 * @param  {soya2d.Physics} phy 物理系统实例
		 * @requires physics
		 * @memberOf! soya2d.Game#
         * @alias stopPhysics
		 */
		game.stopPhysics = function(phy){
			game.physics = null;
		}
    },
    onUpdate:function(game){
    	if(game.physics)
		game.physics.update(1 / 60);
    }
});
;!function(){
    "use strict";

    /**
     * @classdesc 任务调度器，用来管理引擎所有定时任务<br/>
     * 该类为singleton实现，无法直接创建实例，需要通过{@link soya2d.getScheduler}方法获取
     * 唯一实例。
     * @class 
     * @author {@link http://weibo.com/soya2d MrSoya}
     */
    function Scheduler(){
        var state = 1;//1.运行，2.暂停
        var triggerList = [];
        var taskMap = {};
        //安排任务
        /**
         * 把一个任务以及触发器，排进调度计划<br/>
         * 如果触发器之前已经被安排过，且并没有取消调度，那么会抛出异常
         * @param task
         * @param trigger
         */
        this.scheduleTask = function(task,trigger){
            if(trigger._taskKey){
                console.error('a trigger can only bind one task simultaneously');
            }
            taskMap[task.key] = task;//任务map
            trigger._taskKey = task.key;
            triggerList.push(trigger);
        }
        /**
         * 取消安排
         * @param taskKey
         */
        this.unscheduleTask = function(taskKey){
            delete taskMap[taskKey];
            var i=0;
            for(;i<triggerList.length;i++){
                if(triggerList[i]._taskKey == taskKey){
                    break;
                }
            }
            if(triggerList.length < 1)return;
            triggerList[i]._reset();
            triggerList.splice(i,1);
        }
        /**
         * 清除调度器
         */
        this.clear = function(){
            taskMap = {};
            for(var i=0;i<triggerList.length;i++){
                triggerList[i]._reset();
            }
            triggerList = [];
        }
        /**
         * 立即触发任务
         * @param taskKey 任务key
         */
        this.triggerTask = function(taskKey){
            if(taskMap[taskKey].cbk){
                taskMap[taskKey].cbk();
            }
        }
        /**
         * 调度器是否正在运行
         */
        this.isRunning = function(){
            return state===1?true:false;
        }
        /**
         * 暂停调度器
         */
        this.pause = function(){
            state = 2;
        }
        /**
         * 继续调度器
         */
        this.resume = function(){
            state = 1;
        }

        var threshold = 1000;
        /**
         * 内部调用，检查所有触发器是否有可以触发的
         * @private
         */
        this._scanTasks = function(d){
            if(state===2)return;

            //扫描所有触发器
            var deleteTaskList = [];
            for(var i=triggerList.length;i--;){
                var trigger = triggerList[i];
                var task = taskMap[trigger._taskKey];
                var canTrigger = false;
                trigger.milliseconds += d;//毫秒数增加
                if(trigger.type === soya2d.TRIGGER_TYPE_FRAME){
                    trigger._frameCount++;//帧数++
                    if(trigger.canTrigger()){
                        canTrigger = true;
                        if(trigger._frameInfo.canTriggerTimes === 1)
                            deleteTaskList.push(task.key);
                    }
                }else if(trigger.type === soya2d.TRIGGER_TYPE_TIME){
                    var delta = trigger.milliseconds - trigger._lastTriggerMilliseconds;
                    //是否可触发
                    if(trigger.canTrigger() && delta>=threshold){
                        canTrigger = true;
                        //重置触发时间
                        trigger._lastTriggerMilliseconds = trigger.milliseconds;
                    }
                    if(trigger._canUnload())deleteTaskList.push(task.key);
                }

                if(canTrigger && task.cbk){
                    trigger.times++;//触发次数加1
                    task.cbk(trigger.key,trigger.milliseconds,trigger.times,trigger._frameCount||trigger._t);
                }
            }
            //删除可以卸载的任务
            for(var i=deleteTaskList.length;i--;){
                this.unscheduleTask(deleteTaskList[i]);
            }
        }
    }

    var scheduler = new Scheduler();
    /**
     * 获取任务调度器
     * @return {Scheduler} 调度器
     */
    soya2d.getScheduler = function(){
        //singleton
        return scheduler;
    }

}();
/**
 * 调度触法类型，每帧
 * @type {Number}
 */
soya2d.TRIGGER_TYPE_FRAME = 1;
/**
 * 调度触法类型，时间
 * @type {Number}
 */
soya2d.TRIGGER_TYPE_TIME = 2;
/**
 * 构造一个用于调度的任务。
 * @classdesc 任务根据所绑定的触发器，在调度器中被调度。
 * 一个任务可以绑定多个触发器，进行多次调度。
 * @class 
 * @param {string} key 任务唯一标识，用于取消调度或者立即触发等操作
 * @param {function} cbk 回调函数，回调参数(触发器标识triggerKey,任务启动毫秒数milliseconds,触发次数times,当前帧数或者当前时间frameCount|[s,m,h])<br/>
 *										*如果手动触发任务，不会有任何回调参数被传递
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Task = function(key,cbk){
    /**
     * 唯一标识符
     * @type {String}
     */
    this.key = key;
    /**
     * 回调函数
     * @type {Function}
     */
    this.cbk = cbk;
}
;!function(){
    /**
     * 构造一个用于任务调度的触发器。
     * @classdesc 触发器是调度器进行任务调度时，触发任务的依据。根据触发器提供的表达式，进行触发。一个触发器只能绑定一个任务。
     * @class 
     * @param {string} key 触发器标识，用于在任务回调中识别触发器
     * @param {string} exp 触发器表达式，根据触发类型而定
     * @param {int} [type=soya2d.TRIGGER_TYPE_FRAME] 触发类型，可以是时间触发或者帧触发
     * @author {@link http://weibo.com/soya2d MrSoya}
     */
    soya2d.Trigger = function(key,exp,type){
        /**
         * 触发器类型
         * @type {int}
         * @default soya2d.TRIGGER_TYPE_FRAME
         */
        this.type = type||soya2d.TRIGGER_TYPE_FRAME;
        /**
         * 触发表达式
         * @type {String}
         */
        this.exp = exp;
        /**
         * 触发器标识
         * @type {String}
         */
        this.key = key;
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
        //关联的任务key,有此属性时，如果被安排给另一个任务，报错
        this._taskKey;


        //帧模式下，总执行的帧数
        this._frameCount = 0;
        //上次触发毫秒数，相差不足1000，就不触发
        this._lastTriggerMilliseconds = -1000;
        //时间模式下，当前时间s,m,h
        this._t = [];
        //重置触发器
        this._reset = function(){
            this.times = 0;
            this._taskKey = null;
            this._frameCount = 0;
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
            switch(this.type){
                case soya2d.TRIGGER_TYPE_FRAME:
                    return checkFrameTriggerable(this._frameInfo,this._frameCount);
                    break;
                case soya2d.TRIGGER_TYPE_TIME:
                    return checkTimeTriggerable(this);
                    break;
            }
        }

        /************ build trigger ************/
        //解析表达式
        switch(this.type){
            case soya2d.TRIGGER_TYPE_FRAME:
                if(!/^(\*|(?:(?:[0-9]+|\*)\/[0-9]+)|[0-9]+)$/.test(exp)){
                    console.error('invalid trigger expression -- '+exp);
                }
                //解析帧信息
                var info = parseExp(RegExp.$1);
                this._frameInfo = {
                    canTriggerTimes:info[2],//可触发次数
                    startOff:info[1],//启动偏移
                    interval:info[0]//间隔
                };
                break;
            case soya2d.TRIGGER_TYPE_TIME:
                if(!/^(\*|(?:[0-9]+(?:,[0-9]+)*)|(?:[0-9]+-[0-9]+)|(?:(?:(?:[0-9]+(?:-[0-9]+)?)|\*)\/[0-9]+)) (\*|(?:[0-9]+(?:,[0-9]+)*)|(?:[0-9]+-[0-9]+)|(?:(?:(?:[0-9]+(?:-[0-9]+)?)|\*)\/[0-9]+)) (\*|(?:[0-9]+(?:,[0-9]+)*)|(?:[0-9]+-[0-9]+)|(?:(?:(?:[0-9]+(?:-[0-9]+)?)|\*)\/[0-9]+))$/.test(exp)){
                    console.error('invalid trigger expression -- '+exp);
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
                break;
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
    //检测帧触发器是否可以触发
    function checkFrameTriggerable(fi,frames){
        //无限次数
        if(fi.canTriggerTimes === -1){
            if(fi.interval===-1)return true;
            var actValue = frames-fi.startOff;
            if(actValue === 0)return false;//防止0除数触发
            if(!(actValue % fi.interval))return true;
        }else if(fi.canTriggerTimes === 1){
            if(frames === fi.startOff)return true;
        }
        return false;
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
            if(part[0]!==v)return false;
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
}();

soya2d.module.install('task',{
    onInit:function(game){
        /**
		 * 添加一个任务，可以指定任务执行的频率和方式
		 * @param {Function} fn 任务回调函数,回调参数(当前游戏对象实例game,任务执行的毫秒数milliseconds,执行次数times)
		 * @param {string} triggerExp 调度表达式，根据调度类型决定。默认每帧触发
		 * @param {int} triggerType 调度类型，默认帧调度
		 * @return {string} taskId 任务标识，用于删除任务
		 * @see {soya2d.TRIGGER_TYPE_FRAME}
		 * @see {soya2d.Trigger}
		 * @memberOf! soya2d.Game#
         * @alias addTask
		 * @requires task
		 */
		game.addTask = function(fn,triggerExp,triggerType){
			var taskId = 'soya_task_'+Date.now()+Math.random()*999;
			var scheduler = soya2d.getScheduler();
			var g = this;
			var task = new soya2d.Task(taskId,function(trigger,ms,times,tag){
				if(fn && fn.call)fn(g,triggerExp||'*',ms,times,tag);
			});
			var trigger = new soya2d.Trigger(taskId+'_trigger',triggerExp||'*',triggerType);
			scheduler.scheduleTask(task,trigger);

			return taskId;
		}

		/**
		 * 删除任务
		 * @param  {string} taskId 需要删除的任务id
		 * @memberOf! soya2d.Game#
         * @alias removeTask
		 * @requires task
		 */
		game.removeTask = function(taskId){
			var scheduler = soya2d.getScheduler();
			scheduler.unscheduleTask(taskId);
		}
    },
    onUpdate:function(game,now,d){
    	var scheduler = soya2d.getScheduler();
        scheduler._scanTasks(d<0?-d:d);
    }
});