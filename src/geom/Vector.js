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
 