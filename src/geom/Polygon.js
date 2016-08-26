/**
 * 几何结构，多边形。
 * @class 
 * @param {Array} vtx 1维顶点数组
 */
soya2d.Polygon  = function(vtx){
	this.vtx = vtx;
};
soya2d.Polygon.prototype = {
    toString:function(){
        return this.vtx;
    },
    clone:function(){
        return new soya2d.Polygon(this.vtx.concat());
    }
};
