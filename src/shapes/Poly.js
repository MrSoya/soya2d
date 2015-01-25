/**
 * @classdesc 可以进行多边形填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {Array} data.vtx 一维顶点数组 [x1,y1, x2,y2, ...]
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Poly = function(data){
	data = data||{};
	soya2d.DisplayObjectContainer.call(this,data);
	soya2d.ext(this,data);

    this.bounds = new soya2d.Polygon(data.vtx);
    this.fillStyle = data.fillStyle || 'transparent';
};
soya2d.inherits(soya2d.Poly,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.Poly.prototype,{
    onRender:function(g){
        g.beginPath();
        g.fillStyle(this.fillStyle);
        g.polygon(this.vtx);
        g.closePath();
        g.fill();
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
    }
});
