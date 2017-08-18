/**
 * tilemap模块定义了一套通用的瓦片地图处理系统。无论地图数据从何而来，
 * 只要符合格式的数据都会被正确的渲染。
 * <b>该模块是扩展模块，可以自行卸载</b>
 * @module tilemap
 */
/**
 * 瓦片地图。管理固定尺寸瓦片拼接的地图模型。这些地图通常由地图制作工具生成
 * @class Tilemap
 * @extends Signal
 */
var Tilemap = soya2d.class("",{
    extends:Signal,
    constructor: function(data){
        /**
         * 单个瓦片宽度
         * @property tilewidth
         * @type {Number}
         */
        this.tilewidth = data.tilewidth;
        /**
         * 单个瓦片高度
         * @property tileheight
         * @type {Number}
         */
        this.tileheight = data.tileheight;

        /**
         * 整个地图行数
         * @property rows
         * @type {Number}
         */
        this.rows = data.rows;
        /**
         * 整个地图列数
         * @property columns
         * @type {Number}
         */
        this.columns = data.columns;

        //图层数据
        this.layersData = data.layers;
        //图块集数据
        this.tilesetsData = data.tilesets;


        this.tilesets = {};
        this.layers = {};

        //记录所有tile的偏移坐标
        this.tiles = {};

        var i = 0;
        for(var r=0;r<this.rows;r++){
            for(var c=0;c<this.columns;c++){
                var x = c * this.tilewidth;
                var y = r * this.tileheight;
                this.tiles[i++] = {x:x,y:y};
            }
        }

        this.tileMatrix = {};
        for(var r=0;r<this.rows;r++){
            for(var c=0;c<this.columns;c++){
                var x = c * this.tilewidth;
                var y = r * this.tileheight;
                this.tileMatrix[r+"_"+c] = {x:x,y:y};
            }
        }


        this.w = this.tilewidth * this.columns;
        this.h = this.tileheight * this.rows;

        this.game = data.game;

        //所有碰撞区
        this.__blocks = [];

        this.__debug = false;
        Object.defineProperty(this,"debug",{
            get:function(){
                return this.__debug;
            },
            set:function(v){
                this.__debug = v;
                if(v){
                    this.__blocks.forEach(function(b){
                        b.fillStyle='red';
                        b.opacity = .5;
                    });
                }
            }
        });
    },
    /**
     * 把图块集数据和纹理绑定
     * @method bindTileset
     * @param  {String} key   地图数据中制定的key
     * @param  {HTMLImageElement|String} image 图像
     * @return this
     */
    bindTileset:function(key,image){
        var tileset = this.tilesetsData[key];

        var img = null;
        if(typeof image === 'string'){
            img = this.game.assets.image(image);
        }
        var ts = new Tileset(img,tileset.sid,this.tilewidth,this.tileheight);
        
        soya2d.ext(this.tilesets,ts);

        return this;
    },
    /**
     * 创建图层
     * @method createLayer
     * @param  {String} key  图层key，用于查找地图数据中对应的图层
     * @param  {soya2d.DisplayObjectContainer} container 所属容器，默认world
     * @param  {Array} data 地图数据
     */
    createLayer:function(key,container,data){
        var layer = this.layersData[key];
        var dataAry = data;
        if(layer){
            dataAry = layer.data;
        }
        this.layers[key] = new TilemapLayer(this,dataAry);
        container = container || this.game.world;
        container.add(this.layers[key]);
        return this.layers[key];
    },
    /**
     * 设置世界size和map相同
     * @method resizeWorld
     */
    resizeWorld:function(){
        this.game.world.setBounds(this.w,this.h);
    },
    /**
     * 设置碰撞的瓦片索引区间，比如1-4，那么序号为1,2,3,4的4个瓦片都会响应碰撞
     * @method setCollisionBetween
     * @param {Number} start 起始索引
     * @param {Number} end 结束索引
     */
    setCollisionBetween:function(start,end){
        var startPos = this.tiles[start];
        var endPos = this.tiles[end];
        if(!startPos || !endPos)return;

        var w = endPos.x - startPos.x + this.tilewidth;
        var h = endPos.y - startPos.y + this.tileheight;

        var block = game.add.rect({
            w:w,
            h:h,
            x:startPos.x + w/2,
            y:startPos.y + h/2
        });
        this.game.physics.enable(block);
        block.tilemap = this;
        block.on('collisionStart',onTileCollision);
        block.body.static(true).friction(0);

        this.__blocks.push(block);

        return this;
    },
    /**
     * 设置碰撞的一块瓦片，通过行列号
     * @method setCollision
     * @param {Number} row 行号
     * @param {Number} col 列号
     */
    setCollision:function(row,col){
        var startPos = this.tileMatrix[row+"_"+col];
        if(!startPos)return;

        var w = this.tilewidth;
        var h = this.tileheight;

        var block = game.add.rect({
            w:w,
            h:h,
            x:startPos.x + w/2,
            y:startPos.y + h/2
        });
        this.game.physics.enable(block);
        block.tilemap = this;
        block.on('collisionStart',onTileCollision);
        block.body.static(true).friction(0);

        this.__blocks.push(block);

        return this;
    },
    /**
     * 使用行列值，确定碰撞范围
     * @method setCollisionZone
     * @param {Number} startRow 起始行
     * @param {Number} startCol 起始列
     * @param {Number} endRow   结束行
     * @param {Number} endCol   结束列
     */
    setCollisionZone:function(startRow,startCol,endRow,endCol){
        var startPos = this.tileMatrix[startRow+"_"+startCol];
        var endPos = this.tileMatrix[endRow+"_"+endCol];
        if(!startPos || !endPos)return;

        var w = endPos.x - startPos.x + this.tilewidth;
        var h = endPos.y - startPos.y + this.tileheight;

        var block = game.add.rect({
            w:w,
            h:h,
            x:startPos.x + w/2,
            y:startPos.y + h/2
        });
        block.tilemap = this;
        block.on('collisionStart',onTileCollision);
        this.game.physics.enable(block);
        block.body.static(true).friction(0);

        this.__blocks.push(block);

        return this;
    },
    /**
     * 获取指定行列上的tile对象
     * @method getTile
     * @param {Number} row 行号
     * @param {Number} col 列号
     * @return {Object}  
     */
    getTile:function(row,col){
        return this.tileMatrix[row+"_"+col];
    }
});
function onTileCollision(target,another){
    var tw = target.w,th = target.h;
    var aw = another.w,ah = another.h;
    var speed = another.body.rigid.speed;
    var offset = 1;
    var tx = target.x - target.w/2,
        ty = target.y - target.h/2;
    var ax = another.x - another.w/2,
        ay = another.y - another.h/2;

    var xPos,yPos;
    if(ax >= tx){
        xPos = 'center';
        if(ax+speed+offset >= tx+tw){
            xPos = 'right';
        }
    }else{
        xPos = 'left';
    }

    if(ay >= ty){
        yPos = 'middle';
        if(ay > ty+th){
            yPos = 'bottom';
        }
    }else{
        yPos = 'top';
    }
    
    var dir;
    
    switch(yPos){
        case 'top':
            if(ty < ay + ah){
                switch(xPos){
                    case 'left':dir='left';break;
                    case 'right':dir='right';break;
                    case 'center':dir='top';break;
                }
            }else{
                dir='top';
            }
            break;
        case 'bottom':dir='bottom';break;
        case 'middle':
            switch(xPos){
                case 'left':dir='left';break;
                case 'right':dir='right';break;
            }
    }
    this.tilemap.emit('tileCollision',another,{direction:dir,x:this.x,y:this.y});
}

/**
 * 瓦片碰撞事件
 * @event tileCollision
 * @for Tilemap
 * @param {soya2d.DisplayObject} otherCollider 碰撞对象
 * @param {Object} collision 碰撞信息 {direction:,x:,y:} 
 */