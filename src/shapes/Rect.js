/**
 * 可以进行(圆角)矩形填充或线框绘制的显示对象
 * @class soya2d.Rect
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {Number|Array} data.r 圆角半径，或者4个角的半径数组 [左上，右上，右下，左下]
 */
soya2d.class("soya2d.Rect",{
    extends:VS,
    constructor:function(data){
        data = data||{};
        this.fillStyle = data.fillStyle || 'transparent';

        //计算path
        this.vtx = [
            0,this.r,   0,0,0,0,this.r,0,   this.w - this.r,0,
                                                this.w,0,this.w,0,this.w,this.r,
                                                this.w,this.h-this.r,
                                                this.w,this.h,this.w,this.h,this.w-this.r,this.h,
                        this.r,this.h,
            0,this.h,0,this.h,0,this.h-this.r
            ];
        this.cmds = ['m','c','l','c','l','c','l','c'];
    }
});