/**
 * 地图层，描述了一层具体的地图信息，并绘制在制定的容器中
 * @class
 * @extends soya2d.DisplayObjectContainer
 */
var TilemapLayer = soya2d.class('',{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(tilemap,data){
        this.tilemap = tilemap;
        this.w = tilemap.w;
        this.h = tilemap.h;
        this.tw = tilemap.tilewidth;
        this.th = tilemap.tileheight;
        this.cols = tilemap.columns;

        this.data = data;
        this.range = {row:[0,tilemap.rows],col:[0,tilemap.columns]};

        this.tilesets = tilemap.tilesets;
    },
    onUpdate:function(){
        //check range
        var sx = this.worldPosition.x - this.anchorPosition.x;
        var sy = this.worldPosition.y - this.anchorPosition.y;
        if(sx < 0 || sy < 0)return ;

        if(this.lastcx == this.game.camera.x && this.lastcy == this.game.camera.y)return;
        this.lastcy = this.game.camera.y;
        this.lastcx = this.game.camera.x;

        var vx = this.game.camera.x;
        var vy = this.game.camera.y;
        var vw = this.game.camera.w;
        var vh = this.game.camera.h;

        var offx = vx - sx;
        var offy = vy - sy;
        var offCols = Math.floor(offx/this.tw);
        var offRows = Math.floor(offy/this.th);
        var cols = Math.floor(vw/this.tw)+1;
        var rows = Math.floor(vh/this.th)+1;

        this.range.col[0] = offCols;
        this.range.col[1] = offCols + cols;
        this.range.row[0] = offRows;
        this.range.row[1] = offRows + rows;
    },
    onRender:function(g){
        var minr = this.range.row[0],
            maxr = this.range.row[1],
            minc = this.range.col[0],
            maxc = this.range.col[1];
        for(var r=minr;r<maxr;r++){
            for(var c=minc;c<maxc;c++){
                var index = this.data[r*this.cols + c];
                var tileImage = this.tilesets.set[index];
                if(tileImage){
                    g.map(tileImage,c*this.tw,r*this.th,this.tw,this.th);
                    if(this.tilemap.__debug){
                        g.fillText(r*this.cols + c,c*this.tw+this.tw/2,r*this.th+this.th/2-10);
                        g.fillText(r+","+c,c*this.tw+this.tw/2,r*this.th+this.th/2+10);
                    }
                    
                }
            }
        }
        
    }
});