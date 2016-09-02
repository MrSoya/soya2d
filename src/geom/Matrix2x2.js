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
