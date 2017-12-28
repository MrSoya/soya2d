/**
 * 矢量图形基类
*/
var VS = soya2d.class("",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        this.vtx = [];
        this.cmds = [];
    },
    onRender:function(g){
        g.fillStyle(this.fillStyle);
        g.beginPath();
        g.path(this.vtx,this.cmds);
        g.closePath();
        g.fill();
        if(this.lineWidth>0){
            g.lineStyle(this.lineWidth);
            g.strokeStyle(this.strokeStyle);
            g.stroke();
        }
    },
    rebuild:function(){
        this._reCalc();
    }
});