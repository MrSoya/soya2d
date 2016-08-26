/**
 * 几何结构，圆形。用于保存圆形结构数据
 * @class 
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
    toString:function(){
        return "{x:"+this.x+",y:"+this.y+",r:"+this.r+"}";
    },
    clone:function(){
        return new soya2d.Circle(this.x,this.y,this.r);
    },
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
