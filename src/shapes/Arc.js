/**
 * @classdesc 可以进行弧形填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {String} data.startAngle 弧形的开始角度
 * @param {String} data.endAngle 弧形的结束角度
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Arc = function(data){
	data = data||{};
	soya2d.DisplayObjectContainer.call(this,data);
	soya2d.ext(this,data);

    this.fillStyle = data.fillStyle || 'transparent';
};
soya2d.inherits(soya2d.Arc,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.Arc.prototype,{
    onRender:function(g){
        g.beginPath();

        g.fillStyle(this.fillStyle);
        var sr = (this.startAngle||0)*soya2d.Math.ONERAD,
            er = (this.endAngle||0)*soya2d.Math.ONERAD;
        g.arc(this.w/2,this.h/2,this.w/2,sr,er);
        
        if(er-sr != 0 && Math.abs(this.startAngle||0 - this.endAngle||0) != 360){
            g.lineTo(this.w/2,this.h/2);
        }
        g.fill();
        g.closePath();
        
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
    }
});
