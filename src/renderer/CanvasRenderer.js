/**
 * @classdesc 渲染器是引擎提供可视化内容展示的底层基础。
 * 不同的渲染器构建在不同的技术之上比如CSS/WEBGL/CANVAS/SVG等等。<br/>
 * 每个渲染器都和一个soya2d.Game实例绑定，一个应用有且只有一个渲染器。
 * 如果要实现多层渲染，那么你需要创建多个soya2d.Game实例。<br/>
 * 该类不应被显示实例化，引擎会自动创建<br/>
 * 注意，该渲染器基于Canvas构建
 * @param {Object} data 构造参数对象
 * @param {DOMElement} data.container 渲染容器，渲染器会在该容器范围内进行渲染
 * 容器可以是一个块级元素比如div。
 * @param {boolean} [data.autoClear=true] 是否自动清除图层，如果不清除，则渲染效果会叠加
 * @param {boolean} [data.sortEnable=false] 是否开启自动排序。如果开启渲染器会在渲染前对所有DO进行Z轴排序
 * @param {boolean} [data.smoothEnable=true] 是否启用对图像边缘的平滑处理
 * @param {boolean} [data.crispEnable=false] 是否启用图像非平滑渲染
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.CanvasRenderer = function(data){
    data = data||{};
    /**
     * 渲染容器，其中会内置canvas
     * @type element
     * @private
     */
    var container = data.container;
    /**
     * 世界宽度，通常为可视窗口宽度
     * @type int
     * @default 960
     */
    this.w = data.w||(container?container.clientWidth:0);
    /**
     * 世界高度，通常为可视窗口高度
     * @type int
     * @default 480
     */
    this.h = data.h||(container?container.clientHeight:0);
    /**
     * 是否自动清除图层，如果不清除，则渲染效果会叠加
     * @default true
     */
    this.autoClear = data.autoClear===undefined?true:data.autoClear;
    /**
     * 是否开启自动排序。如果开启渲染器会在渲染前对所有DO进行Z轴排序
     * @default false
     */
    this.sortEnable = data.sortEnable || false;

    var smoothEnable = data.smoothEnable===false?false:data.smoothEnable||true;
    var crispEnable = data.crispEnable || false;


    var cvs = document.createElement('canvas');cvs.style.position = 'absolute';
    var display = window.getComputedStyle(data.container, null)['position'];
    if(display !== 'absolute' && display !== 'relative')container.style['position'] = 'relative';
    display = null;
    container.appendChild(cvs);
    container = null;

    var ctx = cvs.getContext('2d');
    var g = new soya2d.CanvasGraphics(ctx);
    
    cvs.width =  this.w;
	cvs.height = this.h;
	//当前渲染器的绘制上下文
    this.ctx = ctx;

	//init canvas
    ctx.textBaseline = soya2d.TEXTVALIGN_TOP;//默认字体对齐样式

    var renderStyle = {opacity:1,blendMode:'source-over'};

    /**
     * 获取渲染器绑定的canvas
     * @return {HTMLCanvasElement} 
     */
    this.getCanvas = function(){
        return cvs;
    }

    /**
     * 渲染方法。每调用一次，只进行一次渲染
     * @param {soya2d.Scene} scene 需要渲染的场景实例
     */
    this.render = function(scene){
        if(!scene instanceof soya2d.Scene)return;
        //update matrix——>sort(optional)——>onUpdate(matrix)——>onRender(g)

        scene.__updateMatrix();

        //render
        ctx.setTransform(1,0,0,1,0,0);
        if(this.autoClear){
            ctx.clearRect(0,0,this.w,this.h);
        }

        render(ctx,scene,renderStyle,this.sortEnable);
    };

    function render(ctx,ro,rs,sortEnable){
        if(ro.opacity===0 || !ro.visible)return;

        if(ro.mask instanceof soya2d.Mask && ro.mask.list.length>0){
            ctx.save();
            ctx.beginPath();
            ctx.setTransform(1,0,0,1,0,0);
            var list = ro.mask.list;
            for(var l=0;l<list.length;l++){
                var geom = list[l];
                if(geom instanceof soya2d.Rectangle){
                    g.rect(geom.x,geom.y,geom.w,geom.h);
                }else if(geom instanceof soya2d.Circle){
                    ctx.moveTo(geom.x+geom.r,geom.y);
                    g.arc(geom.x,geom.y,geom.r);
                }else if(geom instanceof soya2d.Polygon){
                    g.polygon(geom.vtx);
                }
            }
            ctx.closePath();
            ctx.clip();
        }

        if(ro instanceof soya2d.ScrollSprite){
            ctx.save();
        }

        if(ro.onRender){
            var te = ro.__worldTransform.e;
            var pe = ro.__worldPosition.e;
            ctx.setTransform(te[0],te[1],te[2],te[3],pe[0],pe[1]);

            //apply alpha
            if(ro.opacity<=1 && ro.opacity!==rs.opacity){
                rs.opacity = ro.opacity;
                ctx.globalAlpha = ro.opacity;
            }
            //apply blendMode
            if(rs.blendMode !== ro.blendMode){
                rs.blendMode = ro.blendMode;
                ctx.globalCompositeOperation = ro.blendMode;
            }

            //css style
            var oe = ro.__originPosition.e;
            ctx.translate(-oe[0], -oe[1]);
            ro.onRender(g);
        }//over onRender
        //渲染子节点
        if(ro.children && ro.children.length>0){
            var children = ro.children;
            //排序
            if(sortEnable)children.sort(function(a,b){
                if(a.z === b.z){
                    return a.__seq - b.__seq;
                }else{
                    return a.z - b.z;
                }
            });

            for(var i=0;i<children.length;i++){
                render(ctx,children[i],rs,sortEnable);
            }
        }

        if(ro instanceof soya2d.ScrollSprite){
            ctx.restore();
        }

        //mask
        if(ro.mask instanceof soya2d.Mask && ro.mask.list.length>0){
            ctx.restore();
        }
    }
    
    /**
     * 缩放所渲染窗口
     * @param {int} w 宽度
     * @param {int} h 高度
     */
    this.resize = function(w,h){
        var sw = cvs.width,
            sh = cvs.height;
        //计算比率
        this.hr = w / sw,
        this.vr = h / sh;
    	cvs.style.width = w + 'px';
		cvs.style.height = h + 'px';
    }
    
    this.hr=1;//水平缩放比率
    this.vr=1;//垂直缩放比率

    /********************全局图像接口***********************/

    /**
     * 设置或者获取渲染器的平滑选项
     * @param {Boolean} enabled 开启/关闭
     * @return this
     */
    this.smooth = function(enabled){
        if(enabled !== undefined){
            ctx.imageSmoothingEnabled = 
            ctx.webkitImageSmoothingEnabled = 
            ctx.mozImageSmoothingEnabled = 
            ctx.oImageSmoothingEnabled = 
            ctx.msImageSmoothingEnabled = 
            enabled;

            smoothEnable = enabled;
            return this;
        }else{
            return smoothEnable;
        }
    };
    this.smooth(smoothEnable);

    /**
     * 设置或者获取图像清晰渲染
     * @param {Boolean} enabled 开启/关闭
     * @return this
     */
    this.crisp = function(enabled){
        if(enabled){
            cvs.style['image-rendering'] = 'optimizeSpeed';
            cvs.style['image-rendering'] = 'crisp-edges';
            cvs.style['image-rendering'] = '-moz-crisp-edges';
            cvs.style['image-rendering'] = '-webkit-optimize-contrast';
            cvs.style['image-rendering'] = 'optimize-contrast';
            cvs.style['image-rendering'] = 'pixelated';
            cvs.style.msInterpolationMode = 'nearest-neighbor';
        }else{
            cvs.style['image-rendering'] = 'auto';
            cvs.style.msInterpolationMode = 'bicubic';
        }
    };
    this.crisp(crispEnable);

    /**
     * 获取指定范围的图像数据
     * @param {int} x x坐标
     * @param {int} y y坐标
     * @param {int} w 宽度
     * @param {int} h 高度
     * @returns {Array} 指定大小的截图数据数组
     */
    this.getImageData = function(x,y,w,h){
        x = x||0;
        y = y||0;
        w = w||this.w;
        h = h||this.h;

        return ctx.getImageData(x,y,w,h);
    };
    /**
     * 返回当前渲染器的图片数据描述串
     * @param {String} type 图片类型
     * @default image/png
     * @return {String} URL
     */
    this.toDataURL = function(type){
        return cvs.toDataURL(type||"image/png");
    };

    /**
     * 获取一个该渲染器的点击测试器
     * @param {int} type 测试器类型.默认路径检测
     * @return {soya2d.HitTester} 测试器
     */
    this.getHitTester = function(type){
        switch(type){
            case 2:return this.__pixelTester;
            case 1:default:
            return this.__pathTester;
        }
    }
    //优化为每个渲染器只对应各类型一个检测器
    this.__pixelTester = new soya2d.__HitPixelTester(this.w,this.h);
    this.__pathTester = new soya2d.__HitPathTester(this.w,this.h);



    /**
     * 创建一个图像绘制模式
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} image 图像
     * @param {string} [repetition=soya2d.REPEAT] 重复类型
     * @return pattern
     * @see soya2d.REPEAT
     */
    this.createPattern = function(image,repetition){
        return ctx.createPattern(image,repetition||'repeat');
    };

    /**
     * 创建一个渐变实例，用于填充和线框的绘制
     * @param {Array} ratios 渐变比率数组，有效值为[0.0,1.0]
     * @param {Array} colors 渐变颜色数组，和ratios对应，一个比率对应一个颜色，如果对应不上，默认rgba(0,0,0,0)
     * @param {Number} len 渐变长度；线性渐变为长度，放射渐变为半径
     * @param {Object} opt 可选参数
     * @param {Number} [opt.x=0] 渐变坐标；线性渐变为起点，放射渐变为圆心
     * @param {Number} [opt.y=0] 渐变坐标；线性渐变为起点，放射渐变为圆心
     * @param {Number} [opt.angle=0] 渐变角度；线性渐变为渐变方向，放射渐变为焦点改变方向
     * @param {Number} [opt.type=soya2d.GRADIENTTYPE_LINEAR] 渐变类型
     * @param {Number} [opt.focalRatio=0] 放射渐变焦点偏移比率
     * @param {Number} [opt.focalRadius=0] 焦点半径
     * @see soya2d.GRADIENTTYPE_LINEAR
     */
    this.createGradient = function(ratios,colors,len,opt){
        var angle=0,x=0,y=0,type=soya2d.GRADIENTTYPE_LINEAR,focalRatio=0,focalRadius=0;
        if(opt){
            angle = opt.angle||0,
            x=opt.x||0,
            y=opt.y||0,
            type=opt.type||soya2d.GRADIENTTYPE_LINEAR,
            focalRatio=opt.focalRatio||0,
            focalRadius=opt.focalRadius||0;
        }

        var g,m=soya2d.Math;
        angle = Math.abs((angle||0)>>0);
        switch(type){
            case soya2d.GRADIENTTYPE_LINEAR:
                g = ctx.createLinearGradient(x,y,x+len* m.COSTABLE[angle],y+len* m.SINTABLE[angle]);
                for(var i=0,l=ratios.length;i<l;i++){
                    g.addColorStop(ratios[i],colors[i]||"RGBA(0,0,0,0)");
                }
                break;
            case soya2d.GRADIENTTYPE_RADIAL:
                var fl = len*focalRatio;
                g = ctx.createRadialGradient(x,y,focalRadius,x+fl* m.COSTABLE[angle],y+fl* m.SINTABLE[angle],len);
                for(var i=0,l=ratios.length;i<l;i++){
                    g.addColorStop(ratios[i],colors[i]||"RGBA(0,0,0,0)");
                }
                break;
        }
        return g;
    };
};


/**
 * 把一个可渲染对象转换成一个Image对象
 * @param {soya2d.DisplayObject} ro 可渲染对象
 * @param {int} [w] image宽度.可选，默认ro尺寸
 * @param {int} [h] image高度.可选，默认ro尺寸
 * @return {Image} 对应图像对象
 */
soya2d.CanvasRenderer.prototype.getImageFrom = function(ro,w,h){
    var tc = document.createElement('canvas');
    //change size
    tc.width = w||ro.w;
    tc.height = h||ro.h;
    //render
    var ctx = tc.getContext('2d');
    var g = new soya2d.CanvasGraphics(ctx);
    
    //render

    var img = new Image();
    img.src = tc.toDataURL("image/png");

    //clear
    g = null;
    tc = null;
    return img;
};

/********************点击测试器***********************/

soya2d.__HitPathTester = function(w,h){

    function voidPathCtx(ctx) {
        ctx.stroke = function() {};
        ctx.fill = function() {};
        ctx.fillRect = function(x, y, w, h) {
            ctx.rect(x, y, w, h);
        };
        ctx.strokeRect = function(x, y, w, h) {
            ctx.rect(x, y, w, h);
        };
        ctx.drawImage = function(img,sx,sy,sw,sh,dx,dy,dw,dh){
        	if(arguments.length===3){
        		ctx.rect(sx,sy,img.width,img.height);
        	}else if(arguments.length===5){
        		ctx.rect(sx,sy,sw,sh);
        	}else if(arguments.length===9){
        		ctx.rect(dx,dy,dw,dh);
        	}
        		
        };
        ctx.fillText = function(){};
        ctx.strokeText = function(){};
    }

    //创建path检测层
    var layer = document.createElement('canvas');
    layer.width = w;layer.height = h;

    var ctx = layer.getContext('2d');
    var cg = new soya2d.CanvasGraphics(ctx);
    voidPathCtx(ctx);

    this.test = function(ro,x,y){
        render(ro,ctx,cg);
        return ctx.isPointInPath(x,y);
    }

    function render(ro,ctx,cg){
        var te = ro.__worldTransform.e;
        var pe = ro.__worldPosition.e;
        ctx.setTransform(te[0],te[1],te[2],te[3],pe[0],pe[1]);
        if (ro.onRender) {
            ctx.beginPath();
            var oe = ro.__originPosition.e;
            ctx.translate(-oe[0], -oe[1]);
            ro.onRender(cg);
        }
    }
};

soya2d.__HitPixelTester = function(w,h){
    var w,h;
    //创建pixel检测层
    var layer = document.createElement('canvas');
    layer.width = w;layer.height = h;
    var ctx = layer.getContext('2d');
    var cg = new soya2d.CanvasGraphics(ctx);

    this.test = function(ro,x,y){
        render(ro,ctx,cg);

        var d = ctx.getImageData(0,0,w,h).data;
        return !!d[((w * y) + x) * 4 + 3];
    };

    function render(ro,ctx,cg){
        var te = ro.__worldTransform.e;
        var pe = ro.__worldPosition.e;
        ctx.setTransform(te[0],te[1],te[2],te[3],pe[0],pe[1]);
        if (ro.onRender) {
            ctx.beginPath();
            var oe = ro.__originPosition.e;
            ctx.translate(-oe[0], -oe[1]);
            ro.onRender(cg);
        }
    }
};

/**
 * @classdesc 点击测试器，可以检测2D点是否在绘制图形中，
 * 只适用于基于canvas的2D图形点击检测<br/>
 * 注意，除非你确定需要使用基于canvas2d的检测API，否则应该使用DisplayObject自带的检测函数。<br/>
 * 注意，该类无法直接实例化，只能通过渲染器获取
 * <p>
 * 渲染器有基于路径和像素两种，基于路径的检测器性能更高，但只能检测由path构成的闭合图元。<br/>
 * 如果需要检测一个RO中绘制的非连续图形，比如点状分布的多边形或者像素，则可以使用像素检测
 * 注意：在像素检测中，透明色会被认为无效点击
 * </p>
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.HitTester = function(){
    /**
     * 测试渲染对象<br/>
     * 注意：不要在onRender事件中调用该方法
     * @param {soya2d.DisplayObject} ro 渲染对象
     * @param {int} x 相对于场景的坐标
     * @param {int} y 相对于场景的坐标
     * @return {Boolean} 指定2D坐标是否在测试的渲染对象内
     */
    soya2d.HitTester.prototype.test = function(ro,x,y){};
};