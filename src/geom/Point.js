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
