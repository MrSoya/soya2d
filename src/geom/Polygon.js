/**
 * 几何结构，多边形。
 * @class soya2d.Polygon
 * @constructor
 * @param {Array} vtx 1维顶点数组,相对左上角0,0点
 */
soya2d.Polygon  = function(vtx){
	this.vtx = vtx;
};
soya2d.Polygon.prototype = {
	/**
     * @method toString
     * @return {String} 
     */
    toString:function(){
        return this.vtx;
    },
    /**
     * @method clone
     * @return {soya2d.Polygon} 
     */
    clone:function(){
        return new soya2d.Polygon(this.vtx.concat());
    }
};
