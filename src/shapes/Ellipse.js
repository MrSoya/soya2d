/**
 * 可以进行椭圆填充或线框绘制的显示对象
 * @class soya2d.Ellipse
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 */
soya2d.class("soya2d.Ellipse",{
    extends:VS,
    constructor:function(data){
        data = data||{};
        this.fillStyle = data.fillStyle || 'transparent';

        var vtx = [];
        var kappa = 0.5522848;
        var ox = (this.w / 2) * kappa, // control point offset horizontal
            oy = (this.h / 2) * kappa, // control point offset vertical
            xe = this.w,           // x-end
            ye = this.h,           // y-end
            xm = this.w / 2,       // x-middle
            ym = this.h / 2;       // y-middle

        this.vtx = [
            0,ym,
            0,ym-oy,xm - ox,0,xm,0,
            xm + ox, 0, xe, ym - oy, xe, ym,
            xe, ym + oy, xm + ox, ye, xm, ye,
            xm - ox, ye, 0, ym + oy, 0, ym,
            ]
        this.cmds = ['m','c','c','c','c'];
    }
});