/**
 * 可以进行多边形填充或线框绘制的显示对象
 * @class soya2d.Poly
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {Array} data.vtx 一维顶点数组 [x1,y1, x2,y2, ...]
 */
soya2d.class("soya2d.Poly",{
    extends:VS,
    constructor:function(data){
        data = data||{};
        this.bounds = new soya2d.Polygon(data.vtx);
        this.fillStyle = data.fillStyle || 'transparent';

        this.vtx = data.vtx;
    }
});