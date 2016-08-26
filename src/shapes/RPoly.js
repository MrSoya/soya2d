/**
 * 可以进行规则多边形填充或线框绘制的显示对象。该多边形拥有内外两个半径，
 * 可以构成有趣的形状。外半径由对象的w属性决定，内半径则需要指定r属性
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {int} data.edgeCount 多边形的边数，不能小于3
 * @param {Number} [data.r] 内半径。默认和外半径相同
 */
soya2d.class("soya2d.RPoly",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        this.fillStyle = data.fillStyle || 'transparent';
    },
    onRender:function(g){
        g.beginPath();
        g.fillStyle(this.fillStyle);
        g.regularPolygon(this.w/2,this.h/2,this.edgeCount,this.r||this.w/2,this.w/2);
        g.closePath();
        g.fill();
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
    }
});