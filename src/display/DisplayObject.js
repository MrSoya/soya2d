/**
 * @classdesc 显示对象类是引擎中的所有可见组件类的基类。
 * <br/>该类中包含的属性用来控制一个可见对象的显示效果以及渲染方式。<br/>
 注意，该类不应直接实例化,应使用该类的子类或继承该类
 * @class 
 * @param {Object} data 定义参数,见类参数定义
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.DisplayObject = function(data){
    data = data||{};
		
	this.__seq = soya2d.__roIndex++;
    /**
     * 对父类的引用
     * @var {soya2d.DisplayObject} soya2d.DisplayObject#_super
     */
    
    /**
     * 渲染对象id，只读
     * @type {string}
     */
    this.roid = 'roid_' + this.__seq;
    /**
     * 名称
     * @type {string}
     */
    this.name = data.name||this.roid;
    /**
     * 精灵是否可见<br/>
     * true:可见
     * false:不可见
     * @type boolean
     * @default true
     */
    this.visible = data.visible===false?false:data.visible||true;
    
    this.__opacity = data.opacity===0?0:data.opacity||1;
    this.__x = data.x||0;
    this.__y = data.y||0;
    this.__w = data.w||0;
    this.__h = data.h||0;
    this.__originX = data.originX === 0?0:(data.originX||'50%');
    this.__originY = data.originY === 0?0:(data.originY||'50%');
    this.__rotation = data.rotation||0;
    this.__scaleX = data.scaleX||1;
    this.__scaleY = data.scaleY||1;
    this.__skewX = data.skewX||0;
    this.__skewY = data.skewY||0;
    Object.defineProperties(this,{
        /**
         * 可见度0-1
         * 1:不透明
         * 0:全透明
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
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
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 0
         */
        x:{
            set:function(v){
                this.__x = v || 0;
                this.__localChange = true;
            },
            get:function(){
                return this.__x;
            },
            enumerable:true
        },
        /**
         * y坐标。使用top-left坐标系
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 0
         */
        y:{
            set:function(v){
                this.__y = v || 0;
                this.__localChange = true;
            },
            get:function(){
                return this.__y;
            },
            enumerable:true
        },
        /**
         * 宽度。和高度一起，标识精灵的碰撞区、以及事件触发区<br/>
         * *originX属性也依赖该属性
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 0
         */
        w:{
            set:function(v){
                this.__w = v;
                this.__originChange = true;
            },
            get:function(){
                return this.__w;
            },
            enumerable:true
        },
        /**
         * 高度。和宽度一起，标识精灵的碰撞区、以及事件触发区<br/>
         * *originY属性也依赖该属性
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 0
         */
        h:{
            set:function(v){
                this.__h = v;
                this.__originChange = true;
            },
            get:function(){
                return this.__h;
            },
            enumerable:true
        },
        /**
         * x轴参考点，精灵变形时的原点,可以设置百分比字符串或者数字。
         * @type {String|Number}
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 50%
         */
        originX:{
            set:function(v){
                this.__originX = v;
                this.__originChange = true;
            },
            get:function(){
                return this.__originX;
            },
            enumerable:true
        },
        /**
         * y轴参考点，精灵变形时的原点,可以设置百分比字符串或者数字。
         * @type {String|Number}
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 50%
         */
        originY:{
            set:function(v){
                this.__originY = v;
                this.__originChange = true;
            },
            get:function(){
                return this.__originY;
            },
            enumerable:true
        },
        /**
         * 当前旋转角度
         * @type {Number}
         * @instance
         * @memberof soya2d.DisplayObject
         * @default 0
         */
        rotation:{
            set:function(v){
                this.__rotation = v;
                this.__localChange = true;
            },
            get:function(){
                return this.__rotation;
            },
            enumerable:true
        },
        /**
         * x轴缩放比<br/>
         * 如果大于1，则会把精灵变宽<br/>
         * 如果等于1，不改变<br/>
         * 如果小于1，则会把精灵变窄
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
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
         * 如果大于1，则会把精灵变长<br/>
         * 如果等于1，不改变<br/>
         * 如果小于1，则会把精灵变短
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
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
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
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
         * @type Number
         * @instance
         * @memberof soya2d.DisplayObject
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
     * z坐标。标识精灵所属图层，并且引擎会按照z值的大小进行渲染
     * @type Number
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
    this.__originChange = true;
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
    this.__worldPosition = new soya2d.Vector();
    this.__originPosition = new soya2d.Vector();
    /**
     * 混合方式
     * @type String
     * @default soya2d.BLEND_NORMAL
     * @see soya2d.BLEND_NORMAL
     */
    this.blendMode = data.blendMode||'source-over';
    /**
     * 遮罩设置
     * @type {soya2d.Mask}
     */
    this.mask = data.mask || new soya2d.Mask();
    /**
     * 精灵范围，用于拾取测试和物理碰撞
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
     * @type {Object}
     */
    this.body = null;
};
/**
 * @name soya2d.DisplayObject#onRender
 * @desc 渲染事件，每帧触法。在该回调中使用绘图对象g进行图像绘制
 * @event
 * @param {soya2d.CanvasGraphics} g 绘图对象，根据渲染器类型不同而不同
 */
/**
 * @name soya2d.DisplayObject#onUpdate
 * @desc 更新事件，每帧触法。在该回调中可以编写更新逻辑
 * @event
 * @param {soya2d.Game} game 当前精灵所在的游戏实例
 */
 
//扩展方法包装
soya2d.ext(soya2d.DisplayObject.prototype,/** @lends soya2d.DisplayObject.prototype */{
    toString:function(){
        return '{roid:"'+this.roid+'";name:"'+this.name+'"}';
    },
    /**
     * 更新本地和世界变形
     */
    updateTransform:function(){
        var x = this.__x,
            y = this.__y;
        if(this.__localChange){
            this.__localTransform.identity();
            this.__localTransform
            .scale(this.__scaleX,this.__scaleY)
            .rotate(this.__rotation).skew(this.__skewX,this.__skewY);
        }

        var lt = this.__localTransform;
        var wt = this.__worldTransform;
        var op = this.__originPosition;
        var le = lt.e;
        var oe = op.e;

        var ox=oe[0],oy=oe[1];
        if(this.__originChange){
            ox = this.__originX,
            oy = this.__originY;
            ox = typeof ox==='number'?ox:parseFloat(ox)/100* this.__w,
            oy = typeof oy==='number'?oy:parseFloat(oy)/100* this.__h;

            op.set(ox,oy);
        }
        //css style
        x += ox,
        y += oy;

        
        wt.set(le[0],le[1],le[2],le[3]);
        if(this.parent){
            var pt = this.parent.__worldTransform;
            var pte = pt.e;
            var ppe = this.parent.__worldPosition.e;
            var poe = this.parent.__originPosition.e;
            var popx = poe[0]*pte[0]+poe[1]*pte[2],
                popy = poe[0]*pte[1]+poe[1]*pte[3];
            

            var wx = x*pte[0]+y*pte[2],
                wy = x*pte[1]+y*pte[3];

            x = wx + ppe[0] - popx,
            y = wy + ppe[1] - popy;

            wt.mul(pt);
        }
        this.__worldPosition.set(x,y);

        //重置变换标识
        this.__localChange = this.__originChange = false;
    },
    /**
     * 返回当前对象是否被渲染了
     * @return {boolean} true/false
     */
    isRendered:function(){
        if(!this.visible || this.opacity===0)return false;
        var p = this.parent;
        while(p){
            if(!p.visible || p.opacity===0)return false;
            p = p.parent;
        }
        return true;
    },
    /**
	 * 复制方法,不会复制当前节点的子节点
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
            || i==='__worldPosition'
            || i==='__originPosition'

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
	 * @param {Number} ox x轴偏移
	 * @param {Number} oy y轴偏移
     * @return {soya2d.DisplayObject} this
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
	 * @param {Number} x x坐标
	 * @param {Number} y y坐标
     * @return {soya2d.DisplayObject} this
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
	 * @param {Number} o 透明度值
     * @return {soya2d.DisplayObject} this
	 */
	opacifyTo:function(o){
		this.opacity = o>1?1:o<0?0:o;
        return this;
	},
	/**
	 * 设置透明度偏移
	 * @param {Number} o 透明度差值
     * @return {soya2d.DisplayObject} this
	 */
	opacifyBy:function(o){
		this.opacity += o;
		if(this.opacity > 1)this.opacity = 1;
		if(this.opacity < 0)this.opacity = 0;
        return this;
	},
    /**
     * 设置尺寸
     * @param {Number} w 宽
     * @param {Number} h 高
     * @return {soya2d.DisplayObject} this
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
     * @param {Number} sx x轴缩放比
     * @param {Number} sy y轴缩放比
     * @return this
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
     * @param {Number} sx x轴缩放比
     * @param {Number} sy y轴缩放比
     * @return this
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
     * @param {Number} rx x轴偏移角度
     * @param {Number} ry y轴偏移角度
     * @return this
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
     * @param {Number} rx x轴偏移角度
     * @param {Number} ry y轴偏移角度
     * @return this
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
     * @param {Number} rn 旋转角度
     * @return this
     */
    rotateBy:function(rn){
        this.angle += rn;
        return this;
    },
    /**
     * 旋转精灵到指定角度
     * @param {Number} rn 角度
     * @return this
     */
    rotateTo:function(rn){
        this.angle = rn;
        return this;
    },
    /**
     * 增加精灵参考点
     * @param {String|Number} x 相对精灵左上角的x坐标偏移,可以设置百分比字符串或者数字
     * @param {String|Number} y 相对精灵左上角的y坐标偏移,可以设置百分比字符串或者数字
     * @return this
     */
    originBy:function(x,y){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.originX += a1;
        this.originY += a2;
        return this;
    },
    /**
     * 设置精灵参考点
     * @param {String|Number} x 相对精灵左上角的x坐标偏移,可以设置百分比字符串或者数字
     * @param {String|Number} y 相对精灵左上角的y坐标偏移,可以设置百分比字符串或者数字
     * @return this
     */
    originTo:function(x,y){
        var a1 = arguments[0] || 0;
        var a2 = arguments[1]===0?0:arguments[1]|| a1;

        this.originX = a1;
        this.originY = a2;
        return this;
    },
    /**
     * 返回该对象当前变形状态的4个顶点<br/>
     * *该方法依赖对象的[x、y、w、h、originX、originY]6个属性
     * @return {Array} [ topLeftX,topLeftY,
     *                  topRightX,topRightY,
     *                  bottomRightX,bottomRightY,
     *                  bottomLeftX,bottomLeftY ]
     */
    getBoundingPoints:function(){
        //加载矩阵
        var e = this.__worldTransform.e;
        var p = this.__worldPosition.e;
        var op = this.__originPosition.e;
        var bx = p[0],by = p[1];
        var m11 = e[0],m12 = e[1],
            m21 = e[2],m22 = e[3];
        var ox = op[0],oy = op[1];

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
     * *该方法依赖对象的[x、y、w、h、originX、originY]6个属性
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
        sx = minX,sy = minY;
        sw = maxX - minX;
        sh = maxY - minY;

        this.__boundRect.x = sx;
        this.__boundRect.y = sy;
        this.__boundRect.w = sw;
        this.__boundRect.h = sh;

        return this.__boundRect;
    },
    /**
     * 拾取测试。依赖当前显示对象的bounds
     * @param  {number} x x坐标
     * @param  {number} y y坐标
     * @return {boolean} 点是否在bounds内
     * @see soya2d.DisplayObject#bounds
     */
    hitTest:function(x,y){
        var p = this.__worldPosition.e;
        if(this.bounds instanceof soya2d.Circle){
            var dis = Math.abs(soya2d.Math.len2D(p[0],p[1],x,y));
            if(dis <= this.bounds.r)return true;
        }else if(this.bounds instanceof soya2d.Rectangle ||
            this.bounds instanceof soya2d.Polygon){
            var vtx;
            if(this.bounds.vtx){
                var e = this.__worldTransform.e;
                var op = this.__originPosition.e;
                var bx = p[0],by = p[1];
                var m11 = e[0],m12 = e[1],
                    m21 = e[2],m22 = e[3];
                var ox = op[0],oy = op[1];

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
    getAnchorPosition:function(){
        //加载矩阵
        var e = this.__worldTransform.e;
        var p = this.__worldPosition.e;
        var op = this.__originPosition.e;
        var bx = p[0],by = p[1];
        var m11 = e[0],m12 = e[1],
            m21 = e[2],m22 = e[3];
        var ox = op[0],oy = op[1];

        //计算原始顶点
        var tl_x = -ox,tl_y = -oy;
        
        //计算原始锚点
        var anchorX = this.w * parseInt(this.originX)/100,
            anchorY = this.h * parseInt(this.originY)/100;
        //求出0°时的半径
        var r = Math.sqrt(anchorY*anchorY + anchorX*anchorX);
        //计算出锚点和左上角的夹角
        var angle = Math.atan2(anchorY,anchorX);
        
        //相对于精灵左上角的锚点值
        anchorX =  Math.cos(angle)*r + tl_x;
        anchorY =  Math.sin(angle)*r + tl_y;
        
        //计算顶点[x,y,1] * m
        return [anchorX*m11+anchorY*m21+bx,anchorX*m12+anchorY*m22+by];
    }
});