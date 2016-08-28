
/**
 * 图块集合。管理地图相关的图块信息。
 * 图块集合以起始索引为基准，对每一个图块进行topLeft-bottomRight方式的编号，
 * 每个编号的图块都对应地图中的一个tile
 * @class Tileset
 */
var Tileset = soya2d.class('',{
    constructor:function(image,sIndex,tileWidth,tileHeight) {
        this.set = {};
        this.index = sIndex;

        var ws = image.width / tileWidth;
        var hs = image.height / tileHeight;
        for(var i=0;i<hs;i++){
            for(var j=0;j<ws;j++){
                this.__getTileImage(image,j*tileWidth,i*tileHeight,tileWidth,tileHeight);
            }
        }

    },
    __getTileImage:function(image,x,y,w,h){
        var data = document.createElement('canvas');
        data.width = w;
        data.height = h;
        var ctx = data.getContext('2d');
        ctx.translate(w/2,h/2);
        ctx.drawImage(image,
                        x,y,w,h,
                        -w/2>>0,-h/2>>0,w,h);
        this.set[this.index++] = data;
    }
});