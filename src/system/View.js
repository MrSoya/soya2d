!function(){
    /**
     * 创建视图对象
     * @classdesc 视图对象用于设置游戏实例的视图规则，包括分辨率适应、窗口事件回调等
     * @class 
     * @param {soya2d.Game} game 游戏实例
     * @author {@link http://weibo.com/soya2d MrSoya}
     */
    soya2d.View = function(game){
        /********************* 属性定义 *********************/
        this.game = game;
        /**
         * 缩放类型
         * @type {int}
         * @default soya2d.SCALEMODE_SHOWALL
         */
        this.scaleMode = soya2d.SCALEMODE_SHOWALL;
        /**
         * 缩放最小宽度
         * @type {Number}
         * @default 0
         */
        this.minWidth = 0;
        /**
         * 缩放最小高度
         * @type {Number}
         * @default 0
         */
        this.minHeight = 0;
        /**
         * 缩放最大宽度
         * @type {Number}
         * @default 0
         */
        this.maxWidth = 0;
        /**
         * 缩放最大高度
         * @type {Number}
         * @default 0
         */
        this.maxHeight = 0;
        /**
         * 是否在横竖屏切换、resize窗口时，都进行缩放
         * @type {boolean}
         * @default true
         */
        this.autoScale = true;

        /********************* 行为定义 *********************/
        /**
         * 扫描是否需要缩放，如果需要，则根据缩放参数进行缩放
         * @private
         */
        this.scan = function(){
            if(!this.game)return;

            var designWidth = this.game.w;
            var designHeight = this.game.h;
            
            //选择缩放器
            var scaler;
            switch(this.scaleMode){
                case soya2d.SCALEMODE_NOSCALE:break;
                case soya2d.SCALEMODE_NOBORDER:scaler = NOBORDER;break;
                case soya2d.SCALEMODE_EXACTFIT:scaler = EXACTFIT;break;
                case soya2d.SCALEMODE_SHOWALL:
                default:
                scaler = SHOWALL;
            }
            if(!scaler)return;
            var renderer = this.game.getRenderer();
            var container = renderer.getCanvas().parentNode;
            //判断设计size是否超过了容器size
            var cw = container.clientWidth;
            var ch = container.clientHeight;
            if(container.tagName === 'BODY'){
                ch = window.innerHeight;
            }
            var wh = scaler(designWidth,designHeight,cw,ch,this.minWidth,this.minHeight,this.maxWidth,this.maxHeight);
            renderer.resize(wh[0],wh[1]);
            this.w = wh[0];
            this.h = wh[1];

            //rotate
            rotate(this.scaleMode,rotation,renderer.getCanvas(),renderer);
        }

        /**
         * 视图方向。portrait或者landscape
         * @type {string}
         * @default portrait
         */
        this.orientation = getOrientation();
        var that = this;
        var timer;
        window.addEventListener("orientationchange", function(e){
            clearTimeout(timer);
            timer = setTimeout(function() {
                that.orientation = getOrientation();
            }, 500);
            if(that.autoScale){
                that.scan();
            }
        }, false);
        window.addEventListener("resize", function(e){
            that.orientation = getOrientation();
            if(that.autoScale){
                that.scan();
            }
        }, false);

        function getOrientation(){
            var w = window.innerWidth;
            var h = window.innerHeight;
            var rs;
            if(w > h){
                rs = 'landscape';
            }else{
                rs = 'portrait';
            }
            return rs;
        }

        var rotation = soya2d.ROTATEMODE_0;
        /**
         * 设置或者获取该视图旋转模式
         * @param  {int} rotateMode 旋转模式
         * @return {int | this} 返回view或者旋转模式
         */
        this.rotate = function(rotateMode){
            if(!this.game)return;
            if(rotateMode){
                
                rotation = rotateMode;
                this.scan();

                return this;
            }else{
                return rotation;
            }
        }

        function rotate(scaleMode,rotateMode,canvas,renderer){
            switch(rotateMode){
                case soya2d.ROTATEMODE_90:
                    rs = 'rotate('+90+'deg)';
                    break;
                case soya2d.ROTATEMODE_180:
                    rs = 'rotate('+180+'deg)';
                    break;
                case soya2d.ROTATEMODE_270:
                    rs = 'rotate('+270+'deg)';
                    break;
                case soya2d.ROTATEMODE_0:
                default:
                    rs = 'rotate('+0+'deg)';
                    rotation = soya2d.ROTATEMODE_0;
                    break;
            }

            canvas.style.transform = 
            canvas.style.webkitTransform = 
            canvas.style.mozTransform = 
            canvas.style.msTransform = 
            canvas.style.oTransform = rs;

            canvas.style.left = canvas.style.top = 0;

            //reset bounds
            if(rotateMode === soya2d.ROTATEMODE_90 || rotateMode === soya2d.ROTATEMODE_270){
                var h = canvas.offsetWidth;
                var w = canvas.offsetHeight;

                if(scaleMode === soya2d.SCALEMODE_NOBORDER){
                    var designWidth = this.game.w;
                    var designHeight = this.game.h;
                    h = h>designHeight?designHeight:h;
                    w = w>designWidth?designWidth:w;
                }
                renderer.resize(w,h);

                if(scaleMode === soya2d.SCALEMODE_EXACTFIT){
                    var offLeft = (h - w)/2;
                    offLeft = w%2===0?offLeft:Math.floor(offLeft);
                    var offTop = (w - h)/2;
                    offTop = h%2===0?offTop:Math.floor(offTop);
                    
                    canvas.style.left = offLeft +'px';
                    canvas.style.top = offTop +'px';
                }
            }
        }

        var align = soya2d.ALIGNMODE_CENTER;
        /**
         * 设置或者获取该视图对齐模式。SHOWALL模式下有效
         * @param  {int} alignMode 对齐模式
         * @return {int | this} 返回view或者对齐模式
         */
        this.align = function(alignMode){
            if(!this.game)return;
            if(alignMode && this.scaleMode === soya2d.SCALEMODE_SHOWALL){
                var canvas = this.game.getRenderer().getCanvas();
                align = alignMode;
                switch(alignMode){
                    case soya2d.ALIGNMODE_LEFT:
                        canvas.style.left = 0;
                        canvas.style.right = 'auto';
                        break;
                    case soya2d.ALIGNMODE_RIGHT:
                        canvas.style.left = 'auto';
                        canvas.style.right = 0;
                        break;
                    case soya2d.ALIGNMODE_CENTER:
                    default:
                        canvas.style.left = 0;
                        canvas.style.right = 0;
                        align = soya2d.ALIGNMODE_CENTER;//覆盖错误参数
                        break;
                }
                canvas.style.margin = 'auto';
                return this;
            }else{
                return align;
            }
        }
        
    };

    /**
     * 视图缩放类型，不缩放。游戏默认值
     */
    soya2d.SCALEMODE_NOSCALE = 0;
    /**
     * 视图缩放类型，等比缩放，总是显示全部
     */
    soya2d.SCALEMODE_SHOWALL = 1;
    /**
     * 视图缩放类型，等比缩放，不一定显示全部
     */
    soya2d.SCALEMODE_NOBORDER = 2;
    /**
     * 视图缩放类型，非等比缩放。完全适配容器
     */
    soya2d.SCALEMODE_EXACTFIT = 3;

    /**
     * 视图对齐类型
     */
    soya2d.ALIGNMODE_LEFT = 1;
    /**
     * 视图对齐类型
     */
    soya2d.ALIGNMODE_CENTER = 2;
    /**
     * 视图对齐类型
     */
    soya2d.ALIGNMODE_RIGHT = 3;

    /**
     * 视图旋转类型
     */
    soya2d.ROTATEMODE_0 = 1;
    /**
     * 视图旋转类型
     */
    soya2d.ROTATEMODE_90 = 2;
    /**
     * 视图旋转类型
     */
    soya2d.ROTATEMODE_180 = 3;
    /**
     * 视图旋转类型
     */
    soya2d.ROTATEMODE_270 = 4;

    /********************* 规则定义 *********************/
    function NOBORDER(dw,dh,cw,ch,mw,mh,mxw,mxh){
        cw = mxw && cw > mxw?mxw:cw;
        ch = mxh && ch > mxh?mxh:ch;

        var r = Math.max(cw/dw,ch/dh);
        var w = dw*r,
            h = dh*r;
        return [w,h];
    }
    function SHOWALL(dw,dh,cw,ch,mw,mh,mxw,mxh){
        cw = mxw && cw > mxw?mxw:cw;
        ch = mxh && ch > mxh?mxh:ch;

        var r = Math.min(cw/dw,ch/dh);
        var w = dw*r,
            h = dh*r;
        return [w,h];
    }
    function EXACTFIT(dw,dh,cw,ch,mw,mh,mxw,mxh){
        var w,h;
        if(mw && cw < mw){
            w = mw;
        }else if(mxw && cw > mxw){
            w = mxw;
        }else{
            w = cw;
        }
        if(mh && ch < mh){
            h = mh;
        }else if(mxh && ch > mxh){
            h = mxh;
        }else{
            h = ch;
        }
        return [w,h];
    }
}();


