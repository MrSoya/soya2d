/**
 * 可以进行圆角矩形填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {number} data.lineWidth 线条宽度
 * @param {number} data.r 圆角半径
 */
soya2d.class("soya2d.RRect",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        this.fillStyle = data.fillStyle || 'transparent';
        this.r = data.r || 0;
    },
    onRender:function(g){
        g.beginPath();
        g.moveTo(0,0);
        g.fillStyle(this.fillStyle);
        g.roundRect(0,0,this.w,this.h,this.r);
        g.fill();
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
        g.closePath();
    }
});