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
