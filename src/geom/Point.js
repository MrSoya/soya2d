/**
 * 几何结构，点
 * @class 
 * @param {Number} x
 * @param {Number} y
 */
soya2d.Point = function(x,y){
	this.x = x || 0;
    this.y = y || 0;
};
soya2d.Point.prototype = {
    toString:function(){
        return "{x:"+this.x+",y:"+this.y+"}";
    },
    clone:function(){
        return new soya2d.Point(this.x,this.y);
    },
    set:function(x,y){
        this.x = x;
        this.y = y;
        return this;
    }
};
