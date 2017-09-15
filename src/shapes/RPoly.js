/**
 * 可以进行规则多边形填充或线框绘制的显示对象。该多边形拥有内外两个半径，
 * 可以构成有趣的形状。外半径由对象的w属性决定，内半径则需要指定r属性
 * @class soya2d.RPoly
 * @constructor
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数,以及新增参数
 * @param {String} data.fillStyle 填充样式
 * @param {String} data.strokeStyle 线框样式
 * @param {String} data.lineWidth 线条宽度
 * @param {int} data.edgeCount 多边形的边数，不能小于3
 * @param {Number} [data.r] 内半径。默认和外半径相同
 */
soya2d.class("soya2d.RPoly",{
    extends:VS,
    constructor:function(data){
        data = data||{};
        this.fillStyle = data.fillStyle || 'transparent';

        var r1 = this.r||this.w/2
        var r2 = this.w/2;
        var cx,cy,ec = this.edgeCount||0;
        cx = cx||0;
        cy = cy||0;
        ec = ec<3?3:ec;
        var M = soya2d.Math;
        var vtx = [];
        var step = 360/ec;
        for(var i=0,j=0;i<360;i+=step,j++){
            var tr = r1;
            if(r2){
                if(j%2!==0)tr=r1;
                else{tr=r2};
            }

            if(!M.COSTABLE[i]){
                vtx.push(cx+tr*M.COSTABLE[Math.round(i)],cy+tr*M.SINTABLE[Math.round(i)]);
            }else{
                vtx.push(cx+tr*M.COSTABLE[i],cy+tr*M.SINTABLE[i]);
            }
        }
        this.vtx = vtx;
    }
});