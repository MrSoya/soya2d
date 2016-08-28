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