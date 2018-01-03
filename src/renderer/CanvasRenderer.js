
/**
 * 渲染器是引擎提供可视化内容展示的底层基础。
 * 不同的渲染器构建在不同的技术之上比如CSS/WEBGL/CANVAS/SVG等等。<br/>
 * 每个渲染器都和一个soya2d.Game实例绑定，一个应用有且只有一个渲染器。
 * 如果要实现多层渲染，那么你需要创建多个soya2d.Game实例。<br/>
 * 该类不应被显示实例化，引擎会自动创建<br/>
 * 注意，该渲染器基于Canvas构建
 * @param {Object} data 构造参数对象
 * @param {DOMElement} data.container 渲染容器，渲染器会在该容器范围内进行渲染
 * 容器可以是一个块级元素比如div。
 * @param {Boolean} [data.autoClear=true] 是否自动清除图层，如果不清除，则渲染效果会叠加
 * @param {Boolean} [data.sortEnable=false] 是否开启自动排序。如果开启渲染器会在渲染前对所有DO进行Z轴排序
 * @param {Boolean} [data.smoothEnable=true] 是否启用对图像边缘的平滑处理
 * @param {Boolean} [data.crispEnable=false] 是否启用图像非平滑渲染
 * @class soya2d.CanvasRenderer
 * @module renderer
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
     * @property w
     * @type {Number}
     * @default 960
     */
    this.w = data.w||(container?container.clientWidth:0);
    /**
     * 世界高度，通常为可视窗口高度
     * @property h
     * @type {Number}
     * @default 480
     */
    this.h = data.h||(container?container.clientHeight:0);
    /**
     * 是否自动清除图层，如果不清除，则渲染效果会叠加
     * @property autoClear
     * @type {Boolean}
     * @default true
     */
    this.autoClear = data.autoClear===undefined?true:data.autoClear;
    /**
     * 是否开启自动排序。如果开启渲染器会在渲染前对所有DO进行Z轴排序
     * @property sortEnable
     * @type {Boolean}
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
     * @method getCanvas
     * @return {HTMLCanvasElement} 
     */
    this.getCanvas = function(){
        return cvs;
    }

    var count = 0;
    /**
     * 渲染方法。每调用一次，只进行一次渲染
     * @method render
     */
    this.render = function(stage,camera){
        if(!stage instanceof Stage)return;

        //render
        ctx.setTransform(1,0,0,1,0,0);
        if(this.autoClear){
            ctx.clearRect(0,0,this.w,this.h);
        }

        var rect = camera.__view;
        count = 0;
        render(rect,ctx,stage,g,this.sortEnable,renderStyle);
        return count;
    };

    var ctxFnMap = {
        stroke:ctx.stroke,
        fill:ctx.fill,
        fillRect:ctx.fillRect,
        strokeRect:ctx.strokeRect,
        drawImage:ctx.drawImage,
        fillText:ctx.fillText,
        strokeText:ctx.strokeText,
        beginPath:ctx.beginPath,
        closePath:ctx.closePath
    };
    function invalidCtx(ctx) {
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
        ctx.beginPath = function(){};
        ctx.closePath = function(){};
    }
    function validCtx(ctx) {
        ctx.stroke = ctxFnMap.stroke;
        ctx.fill = ctxFnMap.fill;
        ctx.fillRect = ctxFnMap.fillRect;
        ctx.strokeRect = ctxFnMap.strokeRect;
        ctx.drawImage = ctxFnMap.drawImage;
        ctx.fillText = ctxFnMap.fillText;
        ctx.strokeText = ctxFnMap.strokeText;
        ctx.beginPath = ctxFnMap.beginPath;
        ctx.closePath = ctxFnMap.closePath;
    }
    function renderMask(ctx,mask){
        if(mask.onRender){
            var te = mask.__worldTransform.e;
            var wp = mask.worldPosition;
            ctx.setTransform(te[0],te[1],te[2],te[3],wp.x,wp.y);

            //css style
            var ap = mask.anchorPosition;
            ctx.translate(-ap.x, -ap.y);
            mask.onRender(g);
        }//over onRender
        //渲染子节点
        if(mask.children && mask.children.length>0){
            var children = mask.children;

            for(var i=0;i<children.length;i++){
                renderMask(ctx,children[i]);
            }
        }
    }
    function render(cameraRect,ctx,ro,g,sortEnable,rs){
        if(ro.opacity===0 
        || !ro.visible
        || ro.__masker)return;

        var sp = ro.__screenPosition;

        if(!ro.__renderable && (sp.x != Infinity && sp.y != Infinity))return;

        count++;

        if(ro.mask instanceof soya2d.DisplayObject){
            ctx.save();
            ctx.beginPath();
            invalidCtx(ctx);
                renderMask(ctx,ro.mask);
                ctx.clip();
            validCtx(ctx);
            ctx.closePath();
        }
        
        if(ro.onRender){
            var te = ro.__worldTransform.e;
            var ap = ro.anchorPosition;
            var wp = ro.worldPosition;
            if(ro.__updateCache){
                var x = ap.x,
                    y = ap.y;
                ctx.setTransform(1,0,0,1,x,y);
            }else{
                var x = sp.x,
                    y = sp.y;
                if(x == Infinity && y == Infinity){//for stage children
                    x = wp.x,
                    y = wp.y;
                }
                
                ctx.setTransform(te[0],te[1],te[2],te[3],x,y);
            }

            //apply alpha
            if(rs && ro.opacity<=1 && ro.opacity!==rs.opacity){
                rs.opacity = ro.opacity;
                ctx.globalAlpha = ro.opacity;
            }
            //apply blendMode
            if(rs && rs.blendMode !== ro.blendMode){
                rs.blendMode = ro.blendMode;
                ctx.globalCompositeOperation = ro.blendMode;
            }

            //css style
            ctx.translate(-ap.x, -ap.y);
            if(ro.imageCache && !ro.__updateCache){
                ctx.drawImage(ro.imageCache,0,0);
            }else{
                ro.onRender(g);
            }

        }//over onRender
        //reset render tag
        ro.__renderable = false;
        //渲染子节点
        if(ro.children && ro.children.length>0 && !ro.__updateCache){
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
                render(cameraRect,ctx,children[i],g,sortEnable,rs);
            }
        }

        //mask
        if(ro.mask instanceof soya2d.DisplayObject){
            ctx.restore();
        }
        //apply alpha
        if(rs && rs.opacity!==ctx.globalAlpha){
            ctx.globalAlpha = rs.opacity;
        }
        //apply blendMode
        if(rs && rs.blendMode !== ctx.globalCompositeOperation){
            ctx.globalCompositeOperation = rs.blendMode;
        }
    }

    /**
     * 渲染显示对象
     * @private
     */
    this.renderDO = render;

    /**
     * 销毁渲染器
     * @method destroy
     */
    this.destroy = function(){
        if(cvs.parentNode)
            cvs.parentNode.removeChild(cvs);
        ctxFnMap = 
        g = 
        this.ctx = null;
    }
    
    /**
     * 缩放所渲染窗口
     * @method resize
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
     * @method smooth
     * @param {Boolean} enabled 开启/关闭
     * @return this
     */
    this.smooth = function(enabled){
        if(enabled !== undefined){
            ctx.imageSmoothingEnabled = 
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
     * @method crisp
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
     * @method getImageData
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
     * @method toDataURL
     * @param {String} type 图片类型
     * @default image/png
     * @return {String} URL
     */
    this.toDataURL = function(type){
        return cvs.toDataURL(type||"image/png");
    };

    /**
     * 创建一个图像绘制模式
     * @method createPattern
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
     * @method createGradient
     * @param {Array} ratios 渐变比率数组，有效值为[0.0,1.0]
     * @param {Array} colors 渐变颜色数组，和ratios对应，一个比率对应一个颜色，如果对应不上，默认rgba(0,0,0,0)
     * @param {Number} len 渐变长度；线性渐变为长度，放射渐变为半径
     * @param {Object} opt 可选参数
     * @param {Number} [opt.x=0] 渐变坐标；线性渐变为起点，放射渐变为圆心
     * @param {Number} [opt.y=0] 渐变坐标；线性渐变为起点，放射渐变为圆心
     * @param {Number} [opt.angle=0] 渐变角度；线性渐变为渐变方向，放射渐变为焦点改变方向
     * @param {Number} [opt.type=soya2d.GRADIENT_LINEAR] 渐变类型
     * @param {Number} [opt.focalRatio=0] 放射渐变焦点偏移比率
     * @param {Number} [opt.focalRadius=0] 焦点半径
     * @see soya2d.GRADIENT_LINEAR
     */
    this.createGradient = function(ratios,colors,len,opt){
        var angle=0,x=0,y=0,type=soya2d.GRADIENT_LINEAR,focalRatio=0,focalRadius=0;
        if(opt){
            angle = opt.angle||0,
            x=opt.x||0,
            y=opt.y||0,
            type=opt.type||soya2d.GRADIENT_LINEAR,
            focalRatio=opt.focalRatio||0,
            focalRadius=opt.focalRadius||0;
        }

        var g,m=soya2d.Math;
        angle = Math.abs((angle||0)>>0);
        switch(type){
            case soya2d.GRADIENT_LINEAR:
                g = ctx.createLinearGradient(x,y,x+len* m.COSTABLE[angle],y+len* m.SINTABLE[angle]);
                for(var i=0,l=ratios.length;i<l;i++){
                    g.addColorStop(ratios[i],colors[i]||"RGBA(0,0,0,0)");
                }
                break;
            case soya2d.GRADIENT_RADIAL:
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
 * @method getImageFrom
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