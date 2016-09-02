/**
 * 显示模块定义了soya2d中所有内置的显示对象，显示对象是实际控制图像渲染的实体。
 * 同时，显示模块中也定义了soya2d的显示架构
 * ```
 *    stage
 *      |
 *    world
 *     /|\
 *    others   
 * ```
 * @module display
 */
/**
 * 显示对象是引擎中的所有可见对象的基类,该类中包含的属性用来控制一个可见对象的显示效果以及渲染方式。<br/>
 该类不能被实例化 
 * @class soya2d.DisplayObject
 * @param {Object} data 定义参数,见类参数定义
 */
soya2d.class("soya2d.DisplayObject",{
    extends:Signal,
    __signalHandler : new SignalHandler(),
    constructor: function(data){
        data = data||{};
        	
        this.__seq = soya2d.__roIndex++;
        /**
         * 对父类的引用
         * @property _super
         * @type {soya2d.DisplayObject}
         */

        /**
         * 渲染对象id
         * @property roid
         * @readOnly
         * @type {string}
         */
        this.roid = 'roid_' + this.__seq;
        /**
         * 名称——用于识别显示对象。如果创建时不指定，默认和roid相同
         * @property name
         * @type {string}
         */
        this.name = data.name||this.roid;
        /**
         * 是否可见
         * @property visible
         * @type boolean
         * @default true
         */
        this.visible = data.visible===false?false:data.visible||true;
        /**
         * 布局对象允许以更灵活的方式设置显示对象的尺寸或坐标，属性列表如下：
         * left 当值是百分比时，相对父类的宽度
         * top  当值是百分比时，相对父类的高度
         * offsetLeft 当值是百分比时，相对自身的宽度
         * offsetTop 当值是百分比时，相对自身的高度
         * 都支持数值和百分比
         * @property layout
         * @type {Object}
         */
        this.layout = data.layout;

        this.__opacity = data.opacity===0?0:data.opacity||1;
        this.__x = data.x||0;
        this.__y = data.y||0;
        this.__w = data.w||0;
        this.__h = data.h||0;
        this.__anchorX = data.anchorX === 0?0:(data.anchorX||'50%');
        this.__anchorY = data.anchorY === 0?0:(data.anchorY||'50%');
        this.__angle = data.angle||0;
        this.__scaleX = data.scaleX==0?0:data.scaleX||1;
        this.__scaleY = data.scaleY==0?0:data.scaleY||1;
        this.__skewX = data.skewX||0;
        this.__skewY = data.skewY||0;

        Object.defineProperties(this,{
            /**
             * 不可见度0-1
             * 1:不透明
             * 0:全透明
             * @type Number
             * @property opacity
             * @default 1
             */
            opacity:{
                set:function(v){
                    if(v == 0)v = 0;
                    else{
                        v = parseFloat(v)||1;
                    }
                    this.__opacity = v<0?0:v>1?1:v;
                },
                get:function(){
                    return this.__opacity;
                },
                enumerable:true
            },
            /**
             * x坐标。使用top-left坐标系
             * @type Number
             * @property x
             * @default 0
             */
            x:{
                set:function(v){
                    this.__x = v || 0;
                    this.__localChange = true;

                    if(this.game.physics.running){
                        this.body.moveTo(this.__x,this.__y);
                    }
                },
                get:function(){
                    return this.__x;
                },
                enumerable:true
            },
            /**
             * y坐标。使用top-left坐标系
             * @type Number
             * @property y
             * @default 0
             */
            y:{
                set:function(v){
                    this.__y = v || 0;
                    this.__localChange = true;

                    if(this.game.physics.running){
                        this.body.moveTo(this.__x,this.__y);
                    }
                },
                get:function(){
                    return this.__y;
                },
                enumerable:true
            },
            /**
             * 宽度。和高度一起，标识对象的碰撞区、以及事件触发区<br/>
             * *anchorX属性也依赖该属性
             * @type Number
             * @property w
             * @default 0
             */
            w:{
                set:function(v){
                    this.__w = v;
                    this.__anchorChange = true;
                },
                get:function(){
                    return this.__w;
                },
                enumerable:true
            },
            /**
             * 高度。和宽度一起，标识对象的碰撞区、以及事件触发区<br/>
             * *anchorY属性也依赖该属性
             * @type Number
             * @property h
             * @default 0
             */
            h:{
                set:function(v){
                    this.__h = v;
                    this.__anchorChange = true;
                },
                get:function(){
                    return this.__h;
                },
                enumerable:true
            },
            /**
             * x轴参考点，对象变形时的原点,可以设置百分比字符串或者数字
             * @type {String|Number}
             * @property anchorX
             * @default 0
             */
            anchorX:{
                set:function(v){
                    this.__anchorX = v;
                    this.__anchorChange = true;
                },
                get:function(){
                    return this.__anchorX;
                },
                enumerable:true
            },
            /**
             * y轴参考点，对象变形时的原点,可以设置百分比字符串或者数字
             * @type {String|Number}
             * @property anchorY
             * @default 0
             */
            anchorY:{
                set:function(v){
                    this.__anchorY = v;
                    this.__anchorChange = true;
                },
                get:function(){
                    return this.__anchorY;
                },
                enumerable:true
            },
            /**
             * 当前旋转角度
             * @type {Number}
             * @property angle
             * @default 0
             */
            angle:{
                set:function(v){
                    this.__angle = v;
                    this.__localChange = true;

                    if(this.game.physics.running){
                        this.body.rotateTo(this.__angle);
                    }
                },
                get:function(){
                    return this.__angle;
                },
                enumerable:true
            },
            /**
             * x轴缩放比<br/>
             * 如果大于1，则会把对象横向拉伸<br/>
             * 如果等于1，不改变<br/>
             * 如果小于1，则会把对象横向缩短
             * @type {Number}
             * @property scaleX
             * @default 1
             */
            scaleX:{
                set:function(v){
                    this.__scaleX = v;
                    this.__localChange = true;
                },
                get:function(){
                    return this.__scaleX;
                },
                enumerable:true
            },
            /**
             * y轴缩放比<br/>
             * 如果大于1，则会把对象纵向拉伸<br/>
             * 如果等于1，不改变<br/>
             * 如果小于1，则会把对象纵向缩短
             * @type {Number}
             * @property scaleY
             * @default 1
             */
            scaleY:{
                set:function(v){
                    this.__scaleY = v;
                    this.__localChange = true;
                },
                get:function(){
                    return this.__scaleY;
                },
                enumerable:true
            },
            /**
             * x轴偏移角。单位：角度
             * @type {Number}
             * @property skewX
             * @default 0
             */
            skewX:{
                set:function(v){
                    this.__skewX = v;
                    this.__localChange = true;
                },
                get:function(){
                    return this.__skewX;
                },
                enumerable:true
            },
            /**
             * y轴偏移角。单位：角度
             * @type {Number}
             * @property skewY
             * @default 0
             */
            skewY:{
                set:function(v){
                    this.__skewY = v;
                    this.__localChange = true;
                },
                get:function(){
                    return this.__skewY;
                },
                enumerable:true
            }
        });

        /**
         * z坐标。标识对象所属图层，并且引擎会按照z值的大小进行渲染
         * @type {Number}
         * @property z
         * @default 0
         */
        this.z = data.z||0;
        /**
         * 是否需要本地变换
         * @type {Boolean}
         * @private
         */
        this.__localChange = true;
        /**
         * 是否需要参考点变换
         * @type {Boolean}
         * @private
         */
        this.__anchorChange = true;
        /**
         * 本地变形
         * @type {soya2d.Matrix2x2}
         * @private
         */
        this.__localTransform = new soya2d.Matrix2x2();
        /**
         * 世界变形，用于渲染
         * @type {soya2d.Matrix2x2}
         * @private
         */
        this.__worldTransform = new soya2d.Matrix2x2();
        /**
         * 世界坐标
         * @readOnly
         * @property worldPosition
         * @type {soya2d.Point}
         */
        this.worldPosition = new soya2d.Point();
        /**
         * 锚点坐标
         * @property anchorPosition
         * @readOnly
         * @type {soya2d.Point}
         */
        this.anchorPosition = new soya2d.Point();
        /**
         * 屏幕坐标
         * @type {soya2d.Point}
         * @private
         */
        this.__screenPosition = new soya2d.Point();
        /**
         * 混合方式
         * @property blendMode
         * @type String
         * @default soya2d.BLEND_NORMAL
         * @see soya2d.BLEND_NORMAL
         */
        this.blendMode = data.blendMode || 'source-over';

        this.__mask = data.mask || null;
        this.__fixedToCamera = data.fixedToCamera || false;
        Object.defineProperties(this,{
            /**
             * 遮罩。可以是一个绘制的简单图形比如圆，也可以是包含了多个形状子节点的复合形状。
             * 被用于遮罩的对象只能同时存在一个需要遮罩的对象上，多次设置只会保留最后一次，
             * 并且被用于遮罩的对象不会出现在画面上<br/>
             * *如果需要动态控制遮罩对象，需要把遮罩对象添加到场景中
             * @property mask
             * @type {soya2d.DisplayObject}
             * @default null; 
             */
            mask:{
                set:function(m){
                    if(m){
                        if(m.__masker){
                            m.__masker.__mask = null;
                        }
                        this.__mask = m;
                        m.__masker = this;
                    }
                },
                get:function(){
                    return this.__mask;
                },
                enumerable:true
            },
            /**
             * 是否固定到摄像机。如果该属性为true，当摄像机移动时，精灵会固定在摄像机的指定位置
             * @property fixedToCamera
             * @type {Boolean}
             */
            fixedToCamera:{
                set:function(v){
                    this.__fixedToCamera = v;
                    if(v)
                        this.cameraOffset.set(this.x,this.y);
                },
                get:function(){
                    return this.__fixedToCamera;
                },
                enumerable:true
            }
        });
        /**
         * 使用当前对象作为遮罩的对象，如果该属性有值，则不会被渲染
         * @private
         */
        this.__masker = null;
        /**
         * 对象范围，用于拾取测试和物理碰撞
         * @property bounds
         * @type {soya2d.Rectangle | soya2d.Circle | soya2d.Polygon}
         * @default soya2d.Rectangle实例
         */
        this.bounds = data.bounds || new soya2d.Rectangle(0,0,this.__w,this.__h);
        /**
         * 存储boundingbox
         * @private
         */
        this.__boundRect = new soya2d.Rectangle(0,0,1,1);
        /**
         * 对象在物理世界中的实体
         * @property body
         * @type {Body}
         */
        this.body = new Body(this);
        /**
         * 对象所属的游戏实例。当对象被添加到一个game上时，该值为game实例的引用。
         * 当对象被创建或从game实例上删除时，该值为null<br/>
         * 必须先创建game实例(这样引擎会自动引用该实例)或者显式指定game参数，否则会引起异常
         * @property game
         * @default null
         * @readOnly
         * @type {soya2d.Game}
         */
        this.game = data.game || soya2d.games[0];
        /**
         * 对象缓存的的内部图形。删除该属性可以取消缓存
         * @property imageCache
         * @type {HTMLCanvasElement}
         * @default null 
         */
        this.imageCache = null;
        this.__updateCache = false;

        /**
         * 相对镜头左上角的偏移对象
         * @property cameraOffset
         * @type {Object}
         * @default {x:0,y:0}
         */
        this.cameraOffset = new soya2d.Point();

        //check valid
        if(!this.game){
            throw new Error('soya2d.DisplayObject: invalid param [game]; '+this.game);
        }

        soya2d.ext(this, data);

        this.fixedToCamera = this.__fixedToCamera;
    },
    __onAdded:function(){
        this.centerX = this.w/2;
        this.centerY = this.h/2;
        this.setLayout(this.layout);

        //calc camera offset
        if(this.fixedToCamera && this.layout){
            this.cameraOffset.set(this.x,this.y);
        }

        if(this.onAdded)this.onAdded();
    },
    /**
     * 设置显示对象的布局
     * @method setLayout
     * @param {Object} layout 布局对象
     * @chainable
     */
    setLayout:function(layout){
        if(!layout)return this;
        
        var l = layout.left || 0;
        var t = layout.top || 0;
        var w = layout.width;
        var h = layout.height;
        var ol = layout.offsetLeft;
        var ot = layout.offsetTop;

        if(w)
        this.__w = getXW(w,this.parent)||0;
        if(h)
        this.__h = getYH(h,this.parent)||0;

        var offL = 0;
        var offT = 0;
        if(ol)offL = getOff(ol,this.__w);
        if(ot)offT = getOff(ot,this.__h);

        if(l || ol)
        this.__x = getXW(l,this.parent) + offL;
        if(t || ot)
        this.__y = getYH(t,this.parent) + offT;

        return this;
    },
    /**
     * @method toString
     * @return {String}
     */
    toString:function(){
        return '{roid:"'+this.roid+'";name:"'+this.name+'"}';
    },
    /**
     * 更新本地和世界变换。通常该方法由引擎自己调用
     * @method tranform
     */
    transform:function(){
        var x = this.__x,
            y = this.__y;
        if(this.__localChange){
            this.__localTransform.identity();
            this.__localTransform
            .scale(this.__scaleX,this.__scaleY)
            .rotate(this.__angle).skew(this.__skewX,this.__skewY);
        }

        var lt = this.__localTransform;
        var wt = this.__worldTransform;
        var ap = this.anchorPosition;
        var le = lt.e;

        var ox=ap.x,oy=ap.y;
        if(this.__anchorChange){
            ox = this.__anchorX,
            oy = this.__anchorY;
            ox = typeof ox==='number'?ox:parseFloat(ox)/100* this.__w,
            oy = typeof oy==='number'?oy:parseFloat(oy)/100* this.__h;

            ap.set(ox,oy);
        }
        //css style
        x += ox,
        y += oy;

        
        wt.set(le[0],le[1],le[2],le[3]);
        if(this.parent){
            var pt = this.parent.__worldTransform;
            var pte = pt.e;
            var pwp = this.parent.worldPosition;
            var pap = this.parent.anchorPosition;
            var popx = pap.x*pte[0]+pap.y*pte[2],
                popy = pap.x*pte[1]+pap.y*pte[3];
            

            var wx = x*pte[0]+y*pte[2],
                wy = x*pte[1]+y*pte[3];

            x = wx + pwp.x - popx,
            y = wy + pwp.y - popy;

            wt.mul(pt);
        }

        //physics
        if(this.body.rigid){
            x -= ap.x;
            y -= ap.y;
        }

        this.worldPosition.set(x,y);

        //重置变换标识
        this.__localChange = this.__anchorChange = false;
    },
    /**
     * 返回当前对象是否被渲染了。比如父节点被隐藏时，子节点实际上不会被渲染
     * @method isRendered
     * @return {Boolean} true/false
     */
    isRendered:function(){
        if(!this.visible || this.opacity===0)return false;
        var p = this.parent;
        while(p){
            if(!p.visible || p.opacity===0)return false;
            if(!p.parent && !(p instanceof Stage))return false;
            p = p.parent;
        }
        return true;
    },
    /**
	 * 复制方法,不会复制当前节点的子节点
     * @method clone
     * @param {boolean} [isRecur=false] 递归复制标识
     * @param {soya2d.DisplayObject} [copy=null] 副本,用于子类覆盖
     * @return {soya2d.DisplayObject} 新的实例
	 */
	clone:function(isRecur,copy){
		copy = copy || new this.constructor();
        var keys = Object.keys(this);
		for (var k=keys.length;k--;) {
            var i = keys[k];
			if( i === 'parent' 
            || i==='__seq' 
            || i==='roid' 
			|| i==='__localTransform'
            || i==='__worldTransform'
            || i==='worldPosition'
            || i==='anchorPosition'
            || i==='__screenPosition'

            )continue;
            if(!isRecur && i==='children')continue;      
            //复制子节点
            if(isRecur && i==='children' && this[i] && this[i].length>0){
                copy[i] = [];
                for(var j=0;j<this[i].length;j++){
                    var child = this[i][j];
                    var childCopy = child.clone(isRecur);
                    childCopy.parent = copy;
                    copy[i].push(childCopy);
                }
                continue;
            }

            if(this[i] instanceof Array){
				copy[i] = this[i].slice(0);
			}else{
				copy[i] = this[i];
			}
        }
		return copy;
	},
	/**
	 * 增加精灵偏移
     * @method moveBy
	 * @param {Number} ox x轴偏移
	 * @param {Number} oy y轴偏移
     * @chainable
	 */
	moveBy:function(ox,oy){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;
        
		this.x += a1;
		this.y += a2;
        return this;
	},
	/**
	 * 移动精灵到指定的坐标
     * @method moveTo
	 * @param {Number} x x坐标
	 * @param {Number} y y坐标
     * @chainable
	 */
	moveTo:function(x,y){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

		this.x = a1;
		this.y = a2;
        return this;
	},
	/**
	 * 设置透明度
     * @method opacifyTo
	 * @param {Number} o 透明度值
     * @chainable
	 */
	opacifyTo:function(o){
		this.opacity = o>1?1:o<0?0:o;
        return this;
	},
	/**
	 * 设置透明度偏移
     * @method opacifyBy
	 * @param {Number} o 透明度差值
     * @chainable
	 */
	opacifyBy:function(o){
		this.opacity += o;
		if(this.opacity > 1)this.opacity = 1;
		if(this.opacity < 0)this.opacity = 0;
        return this;
	},
    /**
     * 设置尺寸
     * @method resizeTo
     * @param {Number} w 宽
     * @param {Number} h 高
     * @chainable
     */
	resizeTo:function(w,h){
        var a1 = arguments[0] || 0;
       var a2 = arguments[1]===0?0:arguments[1]|| a1;

		this.w = a1;
		this.h = a2;
        return this;
	},
    /**
     * 增加精灵的缩放比例
     * @method scaleBy
     * @param {Number} sx x轴缩放比
     * @param {Number} sy y轴缩放比
     * @chainable
     */
    scaleBy:function(sx,sy){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.scaleX += a1;
        this.scaleY += a2;
        return this;
    },
    /**
     * 缩放精灵到指定的比例
     * @method scaleTo
     * @param {Number} sx x轴缩放比
     * @param {Number} sy y轴缩放比
     * @chainable
     */
    scaleTo:function(sx,sy){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.scaleX = a1;
        this.scaleY = a2;
        return this;
    },
    /**
     * 增加精灵偏移角度
     * @method skewBy
     * @param {Number} rx x轴偏移角度
     * @param {Number} ry y轴偏移角度
     * @chainable
     */
    skewBy:function(rx,ry){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.skewX += a1;
        this.skewY += a2;
        return this;
    },
    /**
     * 偏移精灵到指定角度
     * @method skewTo
     * @param {Number} rx x轴偏移角度
     * @param {Number} ry y轴偏移角度
     * @chainable
     */
    skewTo:function(rx,ry){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.skewX = a1;
        this.skewY = a2;
        return this;
    },
    /**
     * 增加精灵旋转角度
     * @method rotateBy
     * @param {Number} rn 旋转角度
     * @chainable
     */
    rotateBy:function(rn){
        this.angle += rn;
        return this;
    },
    /**
     * 旋转精灵到指定角度
     * @method rotateTo
     * @param {Number} rn 角度
     * @chainable
     */
    rotateTo:function(rn){
        this.angle = rn;
        return this;
    },
    /**
     * 增加精灵参考点
     * @method anchorBy
     * @param {String|Number} x 相对精灵左上角的x坐标偏移,可以设置百分比字符串或者数字
     * @param {String|Number} y 相对精灵左上角的y坐标偏移,可以设置百分比字符串或者数字
     * @chainable
     */
    anchorBy:function(x,y){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.anchorX += a1;
        this.anchorY += a2;
        return this;
    },
    /**
     * 设置精灵参考点
     * @method anchorTo
     * @param {String|Number} x 相对精灵左上角的x坐标偏移,可以设置百分比字符串或者数字
     * @param {String|Number} y 相对精灵左上角的y坐标偏移,可以设置百分比字符串或者数字
     * @chainable
     */
    anchorTo:function(x,y){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.anchorX = a1;
        this.anchorY = a2;
        return this;
    },
    /**
     * 返回该对象当前变形状态的4个顶点<br/>
     * *该方法依赖对象的[x、y、w、h、anchorX、anchorY]6个属性
     * @method getBoundingPoints
     * @return {Array} [ topLeftX,topLeftY,
     *                  topRightX,topRightY,
     *                  bottomRightX,bottomRightY,
     *                  bottomLeftX,bottomLeftY ]
     */
    getBoundingPoints:function(){
        //加载矩阵
        var e = this.__worldTransform.e;
        var wp = this.worldPosition;
        var ap = this.anchorPosition;
        var bx = wp.x,by = wp.y;
        var m11 = e[0],m12 = e[1],
            m21 = e[2],m22 = e[3];
        var ox = ap.x,oy = ap.y;

        //计算原始顶点
        var tl_x = -ox,tl_y = -oy;
        var tr_x = this.w-ox,tr_y = -oy;
        var bl_x = -ox,bl_y = this.h-oy;
        var br_x = this.w-ox,br_y = this.h-oy;
        
        //计算顶点[x,y,1] * m
        return [tl_x*m11+tl_y*m21+bx,tl_x*m12+tl_y*m22+by,
            tr_x*m11+tr_y*m21+bx,tr_x*m12+tr_y*m22+by,
            br_x*m11+br_y*m21+bx,br_x*m12+br_y*m22+by,
            bl_x*m11+bl_y*m21+bx,bl_x*m12+bl_y*m22+by
        ];
    },
    /**
     * 返回该对象当前变形状态的包围矩形<br/>
     * *该方法依赖对象的[x、y、w、h、anchorX、anchorY]6个属性
     * @method getBoundingBox
     * @return {soya2d.Rectangle} 矩形几何对象
     */
    getBoundingBox:function(){
        var xys = this.getBoundingPoints();
        var minX,minY,maxX,maxY;
        maxX=xys[0],minX=xys[0],maxY=xys[1],minY=xys[1];
        for(var i=xys.length;i--;){
            if(i%2 === 0){
                if(xys[i]>maxX)maxX=xys[i];
                if(xys[i]<minX)minX=xys[i];
            }else{
                if(xys[i]>maxY)maxY=xys[i];
                if(xys[i]<minY)minY=xys[i];
            }
        }
        var sx = minX,
            sy = minY,
            sw = maxX - minX,
            sh = maxY - minY;

        this.__boundRect.x = sx;
        this.__boundRect.y = sy;
        this.__boundRect.w = sw;
        this.__boundRect.h = sh;

        return this.__boundRect;
    },
    /**
     * 拾取测试。依赖当前显示对象的bounds
     * @method hitTest
     * @param  {number} x x坐标
     * @param  {number} y y坐标
     * @return {Boolean} 点是否在bounds内
     * @see soya2d.DisplayObject#bounds
     */
    hitTest:function(x,y){
        var wp = this.worldPosition;
        if(this.bounds instanceof soya2d.Circle){
            var dis = Math.abs(soya2d.Math.len2D(wp.x,wp.y,x,y));
            if(dis <= this.bounds.r)return true;
        }else if(this.bounds instanceof soya2d.Rectangle ||
            this.bounds instanceof soya2d.Polygon){
            var vtx;
            if(this.bounds.vtx){
                var e = this.__worldTransform.e;
                var ap = this.anchorPosition;
                var bx = wp.x,by = wp.y;
                var m11 = e[0],m12 = e[1],
                    m21 = e[2],m22 = e[3];
                var ox = ap.x,oy = ap.y;

                //计算原始顶点
                var tl_x = -ox,tl_y = -oy;

                vtx = [];
                for(var i=0;i<this.bounds.vtx.length;i+=2){
                    var sx = this.bounds.vtx[i] + tl_x,
                        sy = this.bounds.vtx[i+1] + tl_y;
                    vtx.push(sx*m11+sy*m21+bx, sx*m12+sy*m22+by);
                }
            }else{
                vtx = this.getBoundingPoints();
            }
            var hit = false;
            for(var i=0;i<vtx.length;i+=2){
                var sx = vtx[i],
                    sy = vtx[i+1],
                    tx = vtx[i+2] || vtx[0],
                    ty = vtx[i+3] || vtx[1];
                
                if((sx === x && sy === y) || (tx === x && ty === y)){
                    return true;
                }

                if((sy < y && ty >= y) || (sy >= y && ty < y)){
                    var rx = (y-sy)/(ty-sy)*(tx-sx)+sx;

                    if(rx === x){
                        return true;
                    }
                    if(rx > x){
                        hit = !hit;
                    }
                }//over if
            }//over for

            return hit;
        }

        return false;
    },
    /**
     * 检测两个对象是否相交
     * @method intersectWith
     * @param  {DisplayObject} obj
     * @return {Boolean}
     */
    intersectWith:function(obj) {
        var sb = this.getBoundingBox();
        var db = obj.getBoundingBox();

        return sb.intersectWith(db);
    },
    /**
     * 获取锚点坐标
     * @method getAnchorPosition
     * @return {soya2d.Point} 
     */
    getAnchorPosition:function(){
        //加载矩阵
        var e = this.__worldTransform.e;
        var wp = this.worldPosition;
        var ap = this.anchorPosition;
        var bx = wp.x,by = wp.y;
        var m11 = e[0],m12 = e[1],
            m21 = e[2],m22 = e[3];
        var ox = ap.x,oy = ap.y;

        //计算原始顶点
        var tl_x = -ox,tl_y = -oy;
        
        //计算原始锚点
        var anchorX = this.w * parseInt(this.anchorX)/100,
            anchorY = this.h * parseInt(this.anchorY)/100;
        //求出0°时的半径
        var r = Math.sqrt(anchorY*anchorY + anchorX*anchorX);
        //计算出锚点和左上角的夹角
        var angle = Math.atan2(anchorY,anchorX);
        
        //相对于精灵左上角的锚点值
        anchorX =  Math.cos(angle)*r + tl_x;
        anchorY =  Math.sin(angle)*r + tl_y;
        
        //计算顶点[x,y,1] * m
        return new soya2d.Point(anchorX*m11+anchorY*m21+bx,anchorX*m12+anchorY*m22+by);
    },
    /**
     * 缓存当前对象的矢量绘图为贴图，提高显示性能。提高幅度根据所使用的path API的复杂度决定。
     * 越复杂的path绘制，cache效果越明显。缓存大小根据对象的w/h决定，但是不能超过1024*1024。
     * 需要注意的是，缓存不会自动更新，当对象发生变形时，并不会反馈到缓存，直到你显式调用该方法
     * @method cache
     */
    cache:function(){
        if(this.__w > 1024 || this.__h > 1024)return;
        if(!this.imageCache){
            this.imageCache = document.createElement('canvas');
        }
        this.imageCache.width = this.__w;
        this.imageCache.height = this.__h;
        //redraw
        this.transform();
        this.__updateCache = true;
        this.__renderable = true;
        var ctx = this.imageCache.getContext('2d');
        var g = new soya2d.CanvasGraphics(ctx);
        this.game.renderer.renderDO(this.game.camera.__view,ctx,this,g,true);
        this.__updateCache = false;
    },
    /**
     * 销毁当前对象，以及所有子对象。
     * @method destroy
     */
    destroy:function(){
        this.game.physics.unbind(this);
        this.off();//remove all signals
        if(!this.__seq)return;
        if(this.children.length>0){
            this.children.forEach(function(child){
                child.destroy();
            });
        }
        var ks = Object.keys(this);
        for(var i=ks.length;i--;){
            if(ks[i].indexOf('__') < 0)continue;
            this[ks[i]] = null;
        }
        if(this.parent)
            this.parent.remove(this);

        this.onRender = 
        this.onUpdate = 
        this.parent = 
        this.children = 
        this.imageCache =
        this.fillStyle = 
        this.game = 
        this.body = null;
    }
});

function getXW(val,parent){
    if(/^(-?\d+)%$/.test(val)){
        var per = parseFloat(RegExp.$1) / 100;
        return getW(parent,per);
    }else{
        return val;
    }
}
function getYH(val,parent){
    if(/^(-?\d+)%$/.test(val)){
        var per = parseFloat(RegExp.$1) / 100;
        return getH(parent,per);
    }else{
        return val;
    }
}

function getOff(offset,typeVal){
    if(!isNaN(offset))return parseFloat(offset);

    var off = typeVal;
    var per = 0;
    if(/^(-?\d+)%$/.test(offset)){
        per = parseFloat(RegExp.$1) / 100;
    }
    return off*per;
}

function getW(parent,rate){
    var pw = parent.w;
    if(pw === 0 && parent.parent){
        return getW(parent.parent,rate);
    }
    return pw * rate;
}
function getH(parent,rate){
    var ph = parent.h;
    if(ph === 0 && parent.parent){
        return getH(parent.parent,rate);
    }
    return ph * rate;
}

/**
 * 渲染回调，每帧调用。在该回调中使用绘图对象g进行图像绘制
 * @method onRender
 * @param {soya2d.CanvasGraphics} g 绘图对象，根据渲染器类型不同而不同
 */
/**
 * 更新回调，每帧调用。在该回调中可以编写更新逻辑
 * @method onUpdate
 * @param {soya2d.Game} game 当前精灵所在的游戏实例
 */
/**
 * 添加到渲染树回调
 * @method onAdded
 */
