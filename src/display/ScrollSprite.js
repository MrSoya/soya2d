/**
 * @classdesc 卷轴精灵，用于实现卷轴效果，允许对内部精灵进行移动，精灵定位等<br/>
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数，以及新增参数，如下：
 * @param {soya2d.GeoRect} data.scope 卷轴范围
 * @param {soya2d.GeoRect} data.freezone 自由区范围，相对于卷轴视口。当跟踪目标在自由区内移动时，
 * 视口不会跟随目标进行移动
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ScrollSprite = function(data) {
    data = data || {};
    soya2d.DisplayObjectContainer.call(this, data);
    soya2d.ext(this, data);
    
    /**
     * 卷轴范围
     * @type {soya2d.GeoRect}
     */
    this.scope = data.scope;

    /**
     * 视口内限制目标跟踪范围的矩形区域，跟踪目标时有效
     * @type {soya2d.GeoRect}
     */
    this.freezone = data.freezone;

    this.__boundContainer = new soya2d.DisplayObjectContainer();

    this.children.push(this.__boundContainer);
};
soya2d.inherits(soya2d.ScrollSprite, soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.ScrollSprite.prototype, /** @lends soya2d.ScrollSprite.prototype */{
   /**
    * @override
    */
    add:function(){
        this.__boundContainer.add.apply(this.__boundContainer,arguments);
        return this;
    },
    /**
    * @override
    */
    remove:function(){
        this.__boundContainer.remove.apply(this.__boundContainer,arguments);
        return this;
    },
    /**
    * @override
    */
    clear:function(){
        return this.__boundContainer.clear();
    },
    /**
    * @override
    */
    find:function(filter,isRecur){
        return this.__boundContainer.find(filter,isRecur);
    },
    /**
     * 设置卷轴视口跟踪一个内部精灵。<br/>一旦设置有效精灵后，视窗将根据freezone设置进行精灵位置跟踪，
     * 而忽略视窗本身的任何移动方法。
     * @param  {soya2d.DisplayObject} target 视口跟踪目标，必须是容器内的精灵
     * @return {soya2d.ScrollSprite} this
     */
    follow:function(target){
        var tmp = this.__boundContainer.find(function(ro){
            if(target.roid === ro.roid)return true;
        },true);
        if(tmp.length<0){
            console.error('soya2d.ScrollSprite: '+target.toString()+' must be a child node of soya2d.ScrollSprite');
        }
        this.target = target;

        this._onUpdate();
        return this;
    },
    /**
     * 取消跟踪
     */
    unfollow:function(){
        this.target = null;
    },
	/**
     * 移动卷轴指定坐标
     * @param  {number} x x轴坐标
     * @param  {number} y y轴坐标
     */
    scrollTo:function(x,y){
        if(this.target)return;
        this.__boundContainer.x = x;
        this.__boundContainer.y = y;
        
        this.__checkBounds();
    },
    /**
     * 移动卷轴指定偏移
     * @param  {number} offX x轴偏移量
     * @param  {number} offY y轴偏移量
     */
    scrollBy:function(offX,offY){
        if(this.target)return;
        this.__boundContainer.x += offX;
        this.__boundContainer.y += offY;
        
        this.__checkBounds();
    },
    /**
     * @private
     */
    __checkBounds:function(){
        if(!this.scope)return;

        var left = this.scope.x,
            top = this.scope.y,
            right = this.scope.w,
            bottom = this.scope.h;

        //l & r
        var bx = this.__boundContainer.x;
        if(bx > left)this.__boundContainer.x = left;
        if(right>0 && bx < this.w - right)
            this.__boundContainer.x = this.w - right;
        //t & b
        var by = this.__boundContainer.y;
        if(by > top)this.__boundContainer.y = top;
        if(bottom>0 && by < this.h - bottom)
            this.__boundContainer.y = this.h - bottom;
    },
    /**
     * 设置卷轴范围
     * @param {soya2d.Rectangle} scope 范围矩形
     */
    setScope:function(scope){
        if(!scope)return;
        this.scope = scope;

        //容器
        this.__boundContainer.w = scope.w;
        this.__boundContainer.h = scope.h;
    },
    _onUpdate:function(){
        if(!this.target)return;

        var tgx,tgy;
        this.target.updateTransform();
        var wpe = this.target.__worldPosition.e;
        tgx = wpe[0],
        tgy = wpe[1];
        var tw = this.target.w,
            th = this.target.h;

        var xys = this.__boundContainer.getBoundingPoints();
        var cgx = xys[0],
            cgy = xys[1];
            
        var offx = tgx - cgx,
            offy = tgy - cgy;
        var vx,vy;

        if(this.freezone){
            var vox = this.__boundContainer.x * -1,
                voy = this.__boundContainer.y * -1;
            var disx = offx - vox,
                disy = offy - voy;
            var halfTw = tw/2,
                halfTh = th/2;
            var fx = this.freezone.x,
                fy = this.freezone.y,
                fw = this.freezone.w,
                fh = this.freezone.h;
            if(disx - halfTw < fx){
                vx = offx - halfTw - fx;
            }else if(disx + halfTw > fx + fw){
                vx = offx + halfTw - fx - fw;
            }
            if(disy - halfTh < fy){
                vy = offy - halfTh - fy;
            }else if(disy + halfTh > fy + fh){
                vy = offy + halfTh - fy - fh;
            }
            if(!vx && !vy)return;
        }else{
            vx = offx - this.w/2,
            vy = offy - this.h/2;
        }
        if(vx)
        this.__boundContainer.x = -vx;
        if(vy)
        this.__boundContainer.y = -vy;

        this.__checkBounds();
    },
    onRender: function(g) {
        g.beginPath();
        g.rect(0, 0, this.w, this.h);
        g.clip();
    }
});