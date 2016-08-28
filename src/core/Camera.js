/**
 * 摄像机是世界的视口，game.world里的内容都会呈现在camera的镜头内。
 * 当移动镜头时，world中的内容会向反方向移动，就像真实世界中样
 * @class Camera
 * 
 */
function Camera(w,h,game) {
    Object.defineProperties(this,{
        /**
         * camera在world中的位置
         * @property x
         * @type {Number}
         */
        x : {
            set:function(v){
                this.__view.x = v;
                this.__checkBounds();
            },
            get:function(){
                return this.__view.x;
            }
        },
        /**
         * camera在world中的位置
         * @property y
         * @type {Number}
         */
        y : {
            set:function(v){
                this.__view.y = v;
                this.__checkBounds();
            },
            get:function(){
                return this.__view.y;
            }
        },
        /**
         * camera的宽度，等同于舞台宽度
         * @property w
         * @type {Number}
         */
        w : {
            get:function(){
                return this.__view.w;
            }
        },
        /**
         * camera的高度，等同于舞台高度
         * @property w
         * @type {Number}
         */
        h : {
            get:function(){
                return this.__view.h;
            }
        }
    });
    /**
     * 镜头内限制目标跟踪范围的矩形区域，跟踪目标时有效。
     * freezone的x/y/w/h都是相对于camera的
     * @property freezone
     * @type {soya2d.Rectangle}
     */
    this.freezone = null;

    this.__view = new soya2d.Rectangle(0,0,w,h);
    this.__game = game;
}
Camera.prototype = {
    /**
     * 设置camera跟踪一个精灵。<br/>一旦设置有效精灵后，camera将根据freezone设置进行精灵位置跟踪，
     * 而忽略camera本身的任何移动方法。
     * @method follow
     * @param  {soya2d.DisplayObject} target camera跟踪目标，必须是容器内的精灵
     */
    follow:function(target){
        var tmp = this.__game.world.find(function(ro){
            if(target.roid === ro.roid)return true;
        },true);
        if(tmp.length<0){
            soya2d.console.error('camera: '+target.toString()+' must be a child node of game.world');
        }
        this.target = target;
    },
    /**
     * 取消跟踪
     * @method unfollow
     */
    unfollow:function(){
        this.target = null;
    },
    /**
     * 移动卷轴指定坐标
     * @method moveTo
     * @param  {number} x x轴坐标
     * @param  {number} y y轴坐标
     */
    moveTo:function(x,y){
        if(this.target)return;
        this.__view.x = x;
        this.__view.y = y;
        
        this.__checkBounds();
    },
    /**
     * 移动卷轴指定偏移
     * @method moveBy
     * @param  {number} offX x轴偏移量
     * @param  {number} offY y轴偏移量
     */
    moveBy:function(offX,offY){
        if(this.target)return;
        this.__view.x += offX;
        this.__view.y += offY;
        
        this.__checkBounds();
    },
    /**
     * 重置camera的位置为 0,0
     * @method reset
     */
    reset:function(){
        this.__view.x = this.__view.y = 0;
    },
    __checkBounds:function(){
        var scope = this.__game.world.bounds;

        var left = scope.x,
            top = scope.y,
            right = scope.w,
            bottom = scope.h;

        //l & r
        var bx = this.__view.x;
        if(bx < left)this.__view.x = left;
        if(right>0 && bx + this.__view.w > right)
            this.__view.x = right - this.__view.w;
        //t & b
        var by = this.__view.y;
        if(by < top)this.__view.y = top;
        if(bottom>0 && by + this.__view.h > bottom)
            this.__view.y = bottom - this.__view.h;
    },
    /**
     * 设置camera freezone范围
     * @method setFreezone
     * @param {soya2d.Rectangle} freezone 范围矩形
     */
    setFreezone:function(scope){
        if(!scope)return;
        this.freezone = scope;
    },
    __onUpdate:function(){
        if(!this.target || !this.target.game)return;

        var tx,ty;
        var wp = this.target.worldPosition;
        tx = wp.x,
        ty = wp.y;
        var tw = this.target.w,
            th = this.target.h;
            
        var offx = tx - this.__view.x,
            offy = ty - this.__view.y;
        if(this.freezone){
            var fx = this.freezone.x,
                fy = this.freezone.y,
                fw = this.freezone.w,
                fh = this.freezone.h;
            var left = this.__view.x + fx,
                top = this.__view.y + fy,
                right = this.__view.x + fx + fw,
                bottom = this.__view.y + fy + fh;
            var halfTw = tw/2,
                halfTh = th/2;
            if(tx - halfTw < left){
                this.__view.x = tx - fx - halfTw;
            }else if(tx+halfTw > right){
                this.__view.x = tx - fw - fx + halfTw;
            }

            if(ty - halfTh < top){
                this.__view.y = ty - fy - halfTh;
            }else if(ty+halfTh > bottom){
                this.__view.y = ty - fh - fy + halfTh;
            }
        }else{
            this.__view.x = tx - this.__view.w/2;
            this.__view.y = ty - this.__view.h/2;
        }

        this.__checkBounds();
    },
    //裁剪舞台，修改全局坐标
    __cull:function(stage){
        var c = stage.children;
        for(var i=c.length;i--;){
            cull(c[i],this.__view);
        }
    },
    //转换世界坐标到屏幕坐标
    __viewport:function(world){
        var c = world.children;
        for(var i=c.length;i--;){
            viewport(c[i],this.__view);
        }
    }
}

function cull(ro,cameraRect){
    if(ro.__renderable){
        //don't cull fixed DO
        if(ro.__fixedToCamera)return;

        if(!cameraRect.intersectWith(ro.getBoundingBox())){
            ro.__renderable = false;
            return;
        }

        if(ro.children)
            for(var i=ro.children.length;i--;){
                var c = ro.children[i];
                if(c.__renderable){
                    cull(c,cameraRect);
                }
            }
    }
}

function viewport(ro,cameraRect,toFixed){
    if(ro.__renderable){
        var x = null,y = null;
        if(ro.__fixedToCamera){
            var x = ro.cameraOffset.x + ro.anchorPosition.x;
            var y = ro.cameraOffset.y + ro.anchorPosition.y;
            toFixed = true;

        }else if(toFixed){
            x = ro.parent.__screenPosition.x - ro.parent.anchorPosition.x + ro.x + ro.anchorPosition.x;
            y = ro.parent.__screenPosition.y - ro.parent.anchorPosition.y + ro.y + ro.anchorPosition.y;
        }else{
            x = ro.worldPosition.x;
            y = ro.worldPosition.y;
            x -= cameraRect.x;
            y -= cameraRect.y;
        }
        ro.__screenPosition.set(x,y);

        if(ro.children)
            for(var i=ro.children.length;i--;){
                var c = ro.children[i];
                if(c.__renderable){
                    viewport(c,cameraRect,toFixed);
                }
            }
    }
}