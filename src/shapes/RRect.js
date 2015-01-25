/**
 * @classdesc 可以进行圆角矩形填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {number} data.lineWidth 线条宽度
 * @param {number} data.r 圆角半径
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.RRect = function(data){
	data = data||{};
	soya2d.DisplayObjectContainer.call(this,data);
	soya2d.ext(this,data);

    this.fillStyle = data.fillStyle || 'transparent';
};
soya2d.inherits(soya2d.RRect,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.RRect.prototype,{
    onRender:function(g){
        g.beginPath();
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
