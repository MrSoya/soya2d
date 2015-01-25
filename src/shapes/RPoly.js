/**
 * @classdesc 可以进行规则多边形填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {int} data.edgeCount 多边形的边数，不能小于3
 * @param {Number} data.r1 半径1
 * @param {Number} data.r2 半径2
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.RPoly = function(data){
	data = data||{};
	soya2d.DisplayObjectContainer.call(this,data);
	soya2d.ext(this,data);

    this.fillStyle = data.fillStyle || 'transparent';
};
soya2d.inherits(soya2d.RPoly,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.RPoly.prototype,{
    onRender:function(g){
        g.beginPath();
        g.fillStyle(this.fillStyle);
        g.regularPolygon(this.w/2,this.h/2,this.edgeCount,this.r1,this.r2);
        g.closePath();
        g.fill();
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
    }
});
