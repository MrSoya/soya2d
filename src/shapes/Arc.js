/**
 * 可以进行圆弧形填充或线框绘制的显示对象
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {String} data.startAngle 弧形的开始角度
 * @param {String} data.endAngle 弧形的结束角度
 */
soya2d.class("soya2d.Arc",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){

        this.bounds = new soya2d.Circle(0,0,this.w/2);
        this.fillStyle = data.fillStyle || 'transparent';
    },
    onRender:function(g){
        g.beginPath();

        var hw = this.w/2,
            hh = this.h/2;
        
        g.fillStyle(this.fillStyle);
        var sr = (this.startAngle||0)*soya2d.Math.ONERAD,
            er = (this.endAngle||0)*soya2d.Math.ONERAD;
        g.arc(hw,hh,this.w/2,sr,er);
        
        if(er-sr != 0 && Math.abs(this.startAngle||0 - this.endAngle||0) != 360){
            g.lineTo(hw,hh);
        }
        g.fill();
        g.closePath();
        
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
        g.moveTo(hw,hh);
    }
});