/**
 * 可以进行矩形填充或线框绘制的显示对象
 * @class soya2d.Rect
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 */
soya2d.class("soya2d.Rect",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        data = data||{};
        this.fillStyle = data.fillStyle || 'transparent';
    },
    onRender:function(g){
        g.beginPath();
        g.fillStyle(this.fillStyle);
        g.rect(0,0,this.w,this.h);
        g.fill();
        g.closePath();

        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
    }
});