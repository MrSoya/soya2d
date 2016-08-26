/**
 * 瓦片精灵，可以让该精灵内部平铺指定的纹理<br/>
 * @class soya2d.TileSprite
 * @extends soya2d.DisplayObjectContainer
 *
 * @constructor
 * @param {Object} data 所有父类参数，以及新增参数，如下：
 * @param {soya2d.Sprite | HTMLImageElement | String} data.sprite 瓦片精灵，必须
 * @param {boolean} [data.autoScroll=false] 自动移动瓦片
 * @param {int} data.speed 移动速度,默认1。单位px
 * @param {int} data.scrollAngle 移动角度,默认0
 */
soya2d.class("soya2d.TileSprite",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data) {
        /**
         * 瓦片精灵，可以设置该属性的缩放等特性
         * @type {soya2d.Sprite}
         */
        this.sprite = null;
        
        if(data.sprite instanceof soya2d.Sprite){
            this.sprite = data.sprite;
        }else{
            this.sprite = new soya2d.Sprite({images:data.sprite});
        } 
        
        //同步为纹理size
        this.w = data.w || this.sprite.w;
        this.h = data.h || this.sprite.h;

        /**
         * 是否自动滚动瓦片
         * @type {Boolean}
         * @default false
         */
        this.autoScroll = data.autoScroll||false;
        /**
         * 移动瓦片的速度
         * @type {Number}
         * @default 1
         */
        this.speed = data.speed||1;
        /**
         * 瓦片移动的角度
         * @type {int}
         * @default 0
         */
        this.scrollAngle = data.scrollAngle||0;
        
        //用于内部移动处理
        this.__tileOffx = 0;
        this.__tileOffy = 0;
    },
	/**
     * 滚动tile中的纹理。
     * 滚动速度和方向依赖实例对应参数
     */
    scroll:function(x,y){
        if(x || y){
            this.__tileOffx += x||0;
            this.__tileOffy += y||0;
        }else{
            var angle = (this.scrollAngle>>0)%360;
            this.__tileOffx += soya2d.Math.COSTABLE[angle]*this.speed;
            this.__tileOffy += soya2d.Math.SINTABLE[angle]*this.speed;
        }
    },
    clone: function(isRecur) {
        var copy = new this.constructor({
            sprite: this.sprite
        });
        soya2d.DisplayObject.prototype.clone.call(this,isRecur,copy);
        return copy;
    },
    _onUpdate:function(){
        if(this.autoScroll){
            var angle = (this.scrollAngle>>0)%360;
            
            this.__tileOffx += soya2d.Math.COSTABLE[angle]*this.speed;
            this.__tileOffy += soya2d.Math.SINTABLE[angle]*this.speed;
        }
    },
    onRender: function(g) {
        //裁减可渲染区域
        g.beginPath();
        g.push();
        g.rect(0, 0, this.w, this.h);
        g.clip();

        //计算行列数
        var img = this.sprite;
        var texW = img.w,
            texH = img.h;
        var texScaledW = texW * img.scaleX,
            texScaledH = texH * img.scaleY;
        //check
        texScaledW = texScaledW<0?texScaledW*-1:texScaledW;
        texScaledH = texScaledH<0?texScaledH*-1:texScaledH;
        
        var colNum = (this.w/texScaledW>>0)+2,
            rowNum = (this.h/texScaledH>>0)+2;

        var offsetX = (this.__tileOffx % texScaledW),
            offsetY = (this.__tileOffy % texScaledH);
        if (this.__tileOffx > 0) {
            offsetX -= texScaledW;
        }
        if (this.__tileOffy > 0) {
            offsetY -= texScaledH;
        }

        var tex = this.sprite.images[0];

        for (var i = rowNum;i--;) {
            for (var j = colNum;j--;) {
                
                var x = j * texScaledW;
                var y = i * texScaledH;

                g.map(tex,
                    x + offsetX, y + offsetY, texScaledW, texScaledH,
                    0, 0, texW, texH);
            }
        }

        g.pop();
    }
});