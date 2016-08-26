/**
 * 舞台对象表现为一个soya2D的渲染窗口，每个game实例都只包含唯一的一个stage。
 * stage也是渲染树中的顶级对象，stage的大小和渲染窗口一致。
 * stage是渲染树的顶级节点
 * stage对象可以用于设置窗口视图规则，包括分辨率适应、窗口事件回调等
 * @class Stage
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 */
var Stage = soya2d.class("",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function(data){
        this.game = data.game;
        this.__anchorX = this.__anchorY = 0;
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
                that.__scan();
            }
        }, false);
        window.addEventListener("resize", function(e){
            that.orientation = getOrientation();
            if(that.autoScale){
                that.__scan();
            }
        }, false);

        this.__bg = null;
        this.__rotat = soya2d.ROTATEMODE_0;
        var align = soya2d.ALIGNMODE_CENTER;
        var scaleMode = soya2d.SCALEMODE_SHOWALL;
        Object.defineProperties(this,{
            ////////////////////////////舞台相关
            /**
             * 缩放类型
             * @type {int}
             * @default soya2d.SCALEMODE_SHOWALL
             */
            scaleMode : {
                set:function(){
                    this.__scan();
                },
                get:function(){
                    return scaleMode;
                }
            },
            /**
             * 设置或者获取该视图对齐模式。SHOWALL模式下有效
             * @type  {int} alignMode 对齐模式
             */
            alignMode : {
                set:function(alignMode){
                    if(alignMode && this.scaleMode === soya2d.SCALEMODE_SHOWALL){
                        var canvas = this.game.renderer.getCanvas();
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
                    }
                },
                get:function(){
                    return align;
                }
            },
            /**
             * 设置或者获取该视图旋转模式
             * @type  {int} rotateMode 旋转模式
             */
            rotateMode:{
                set:function(rotateMode){
                    this.__rotat = rotateMode;
                    this.__scan();
                },
                get:function(){
                    return this.__rotat;
                }
            }
        });
    },
    /**
     * 更新矩阵树，并记录可渲染的RO。场景自身不处理
     * @private
     */
    __updateMatrix : function(){
        updateMx(this);
    },
    /**
     * 更新整个场景
     * @private
     */
    __update : function(game,d){
        if(this.children)
            update(this.children,game,d);
    },
    onRender:function(g){
        if(this.__bg){
            g.fillStyle(this.__bg);
            g.fillRect(0,0,this.w,this.h);
        }
    },
    /**
     * 设置背景
     * @param  {Object} color 根据类型不同，会解析为不同的背景设置<br/>
     * String 颜色字符串，支持HEX或者RGB
     * Image  背景图，支持第二个参数设置repeat
     * Int    渐变方式，支持GRADIENT_LINEAR / GRADIENT_RADIAL，后面参数依次为ratio数组，颜色数组，渐变长度
     * 
     */
    background:function(color){
        if(typeof(color) === 'string'){
            this.__bg = color;
        }else if(color instanceof self.Image){
            this.__bg = this.game.renderer.createPattern(color,arguments[1]);
        }else if(!isNaN(color)){
            var opt = {};
            if(arguments[4])
                soya2d.ext(opt,arguments[4]);
            opt.type = color;
            var gradient = this.game.renderer.createGradient(arguments[1],arguments[2],arguments[3]||1,opt);
            this.__bg = gradient;
        }
    },
    /**
     * 扫描是否需要缩放，如果需要，则根据缩放参数进行缩放
     * @private
     */
    __scan : function(){
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
        var renderer = this.game.renderer;
        var container = renderer.getCanvas().parentNode;
        //判断设计size是否超过了容器size
        var cw = container.clientWidth;
        var ch = container.clientHeight;
        if(container.tagName === 'BODY'){
            ch = window.innerHeight;
        }
        var wh = scaler(designWidth,designHeight,cw,ch,this.minWidth,this.minHeight,this.maxWidth,this.maxHeight);
        renderer.resize(wh[0],wh[1]);

        //rotate
        rotate(this.scaleMode,this.__rotat,renderer.getCanvas(),renderer,this);
    }
});
//更新矩阵
function updateMx(ro){
    ro.transform();
    ro.__renderable = true;
    if(ro.children)
        for(var i=ro.children.length;i--;){
            var c = ro.children[i];
            if(c.visible){
                updateMx(c);
            }
        }
}

function update(list,game,delta){
    for(var i=list.length;i--;){
        var c = list[i];
        if(c._onUpdate){
            c._onUpdate(game,delta);
        }
        if(c.onUpdate){
            c.onUpdate(game,delta);
        }
        if(c.children && c.children.length>0){
            update(c.children,game,delta);
        }
    }
}
function rotate(scaleMode,rotateMode,canvas,renderer,stage){
    var rs;
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
            stage.__rotat = soya2d.ROTATEMODE_0;
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

    var r = 1;
    if(dw > cw || dh > ch)
        r = Math.min(cw/dw,ch/dh);

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

/**
 * 纹理重复类型——REPEAT
 * @constant
 */
soya2d.BG_REPEAT = 'repeat';
/**
 * 纹理重复类型——NOREPEAT
 * @constant
 */
soya2d.BG_NOREPEAT = 'no-repeat';
/**
 * 纹理重复类型——REPEAT_X
 * @constant
 */
soya2d.BG_REPEAT_X = 'repeat-x';
/**
 * 纹理重复类型——REPEAT_Y
 * @constant
 */
soya2d.BG_REPEAT_Y = 'repeat-y';