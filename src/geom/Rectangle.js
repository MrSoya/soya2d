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
