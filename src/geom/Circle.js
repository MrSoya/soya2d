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
