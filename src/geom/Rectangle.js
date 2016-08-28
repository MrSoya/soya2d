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
