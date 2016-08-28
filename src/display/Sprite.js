/**
 * 精灵类。用于显示.9贴图、静态贴图以及贴图动画，精灵中包含了多个图像帧，可以通过创建
 * 多个{{#crossLink "Animation"}}{{/crossLink}}来实现精灵不同动画效果的表现和改变
 * 
 * @class soya2d.Sprite
 * @extends soya2d.DisplayObjectContainer
 * @constructor
 * @param {Object} data 所有父类参数，以及新增参数，参数如下：
 * @param {String | HTMLImageElement | Array<String> | Array<HTMLImageElement>} images 图像加载时的key/key数组/图形对象/图形对象数组
 * @param {int} [data.w] 精灵的宽度,默认纹理宽度
 * @param {int} [data.h] 精灵的高度,默认纹理高度
 */
soya2d.class("soya2d.Sprite",{
	extends:soya2d.DisplayObjectContainer,
	constructor:function(data){

	    var images = data.images;
	    if(!images)return;

	     /**
	     * 动画管理器
	     * @type {AnimationManager}
	     */
	    this.animations = null;

	    this.setImages(images);
	    
	    this.w = data.w || this.images[0].width;
	    this.h = data.h || this.images[0].height;

	    /**
	     * 当前帧序号
	     * @type {Number}
	     * @default 0
	     */
	    this.frameIndex = data.frameIndex || 0;//当前帧号
	    /**
	     * 对图片进行九宫格缩放
	     * @type {soya2d.Rectangle}
	     */
	    this.__scale9grid = data.scale9grid;
	    if(this.__scale9grid && (this.__w != this.images[0].width || this.__h != this.images[0].height)){
	    	this.__parseScale9();
	    }
	    Object.defineProperties(this,{
	    	scale9grid:{
	    		set:function(v){
	    			if(!(v instanceof soya2d.Rectangle))return;
	    			this.__scale9grid = v;
	    			this.__anchorChange = true;
	    			this.__parseScale9();
	    		},
	    		get:function(){
                    return this.__scale9grid;
                },
                enumerable:true
	    	}
	    });
	},
	/**
	 * 复制精灵
	 * @method clone
	 * @param  {Boolean} isRecur 是否递归复制
	 * @return {soya2d.Sprite}  
	 */
	clone:function(isRecur){
		var copy = new this.constructor({
			images:this.images.concat()
		});
		return soya2d.DisplayObject.prototype.clone.call(this,isRecur,copy);
	},
	_onUpdate:function(){
		if(this.__anchorChange && 
			this.__scale9grid instanceof soya2d.Rectangle && 
			(this.__w != this.images[0].width || this.__h != this.images[0].height)){
			this.cache();
		}
	},
	__parseScale9:function(){
		var imgW = this.images[0].width;
		var imgH = this.images[0].height;
		var by = this.__scale9grid.y + this.__scale9grid.h;
		var bh = imgH - by;
		var rx = this.__scale9grid.x + this.__scale9grid.w;
		var rw = imgW - rx;

		var dmw = this.__w - this.__scale9grid.x - rw;
		var dmh = this.__h - this.__scale9grid.y - bh;
		var dmx = dmw + this.__scale9grid.x;
		var dmy = dmh + this.__scale9grid.y;

		var x = this.__scale9grid.x,
			y = this.__scale9grid.y,
			w = this.__scale9grid.w,
			h = this.__scale9grid.h;
		this.__scale9Data = {
			t1:{
				x:0,
				y:0,
				w:x,
				h:y
			},
			t2:{
				x:x,
				y:0,
				w:w,
				h:y,
				dw:dmw
			},
			t3:{
				x:rx,
				y:0,
				w:rw,
				h:y,
				dx:dmx
			},
			m1:{
				x:0,
				y:y,
				w:x,
				h:h,
				dh:dmh
			},
			m2:{
				x:x,
				y:y,
				w:w,
				h:h,
				dw:dmw,
				dh:dmh
			},
			m3:{
				x:rx,
				y:y,
				w:rw,
				h:h,
				dx:dmx,
				dh:dmh
			},
			b1:{
				x:0,
				y:by,
				w:x,
				h:bh,
				dy:dmy
			},
			b2:{
				x:x,
				y:by,
				w:w,
				h:bh,
				dw:dmw,
				dy:dmy
			},
			b3:{
				x:rx,
				y:by,
				w:rw,
				h:bh,
				dx:dmx,
				dy:dmy
			}
		}
	},
    onRender:function(g){
    	if(this.animations.playingK){
    		var ani = this.animations.animation;
    		if(!ani.lastUpdateTime)ani.lastUpdateTime = new Date().getTime();
            var now = new Date().getTime();
            var delta = now - ani.lastUpdateTime;
            //处理跳帧情况
            var deltaFrames = delta/(ani.frameRate*16.7)>>0;
            
            //差值大于帧率，切换帧
            if(deltaFrames>0){
                ani.index += deltaFrames;
                if(ani.index >= ani.frames.length){
                    if(ani.loop){
                        ani.index = 0;
                    }else{
                    	var k = this.animations.playingK;
                        this.animations.stop();
                        this.animations.emit('stop',k);
                        return;
                    }
                }

                ani.lastUpdateTime = now;
            }
	        
	  	    var frame = ani.frames[ani.index];
			g.map(this.images[frame],0,0,this.w,this.h);
    	}else if(this.__scale9grid && this.__updateCache){
    		var img = this.images[0];
    		var sd = this.__scale9Data;
    		var t1 = sd.t1,t2 = sd.t2,t3 = sd.t3,
    			m1 = sd.m1,m2 = sd.m2,m3 = sd.m3,
    			b1 = sd.b1,b2 = sd.b2,b3 = sd.b3;

    		//top
    		g.map(img,t1.x,t1.y,t1.w,t1.h,t1.x,t1.y,t1.w,t1.h);
    		g.map(img,t2.x,t2.y,t2.dw,t2.h,t2.x,t2.y,t2.w,t2.h);
    		g.map(img,t3.dx,t3.y,t3.w,t3.h,t3.x,t3.y,t3.w,t3.h);
    		//middle
    		g.map(img,m1.x,m1.y,m1.w,m1.dh,m1.x,m1.y,m1.w,m1.h);
    		g.map(img,m2.x,m2.y,m2.dw,m2.dh,m2.x,m2.y,m2.w,m2.h);
    		g.map(img,m3.dx,m3.y,m3.w,m3.dh,m3.x,m3.y,m3.w,m3.h);
    		//bottom
    		g.map(img,b1.x,b1.dy,b1.w,b1.h,b1.x,b1.y,b1.w,b1.h);
    		g.map(img,b2.x,b2.dy,b2.dw,b2.h,b2.x,b2.y,b2.w,b2.h);
    		g.map(img,b3.dx,b3.dy,b3.w,b3.h,b3.x,b3.y,b3.w,b3.h);

    	}else{
    		g.map(this.images[this.frameIndex],0,0,this.w,this.h);
    	}
    },
    /**
	 * 设置当前帧数+1
	 * @method nextFrame
	 */
	nextFrame:function(){
		this.frameIndex++;
		if(this.frameIndex >= this.images.length){
			if(this.loop){
				this.frameIndex = 0;
			}else{
				this.frameIndex = this.images.length-1;
			}
		}
	},
	/**
	 * 设置当前帧数-1
	 * @method prevFrame
	 */
	prevFrame:function(){
		this.frameIndex--;
		if(this.frameIndex < 0){
			if(this.loop){
				this.frameIndex = this.images.length-1;
			}else{
				this.frameIndex = 0;
			}
		}
	},
	/**
	 * 设置或者更改精灵纹理
	 * @method setImages
	 * @param {String | HTMLImageElement | Array<String> | Array<HTMLImageElement>} images 图像加载时的key/key数组/图形对象/图形对象数组
	 * @param {Boolean} [changeSize] 同步修改精灵的w/h
	 */
	setImages:function(images,changeSize){
		if(typeof images === 'string'){
	    	this.images = [this.game.assets.image(images)];
	    }else if(images instanceof self.Image || (images.getContext && images.nodeType == 1)){
	    	this.images = [images];
	    }else if(images instanceof Array){
	    	var imgs = [];
	    	images.forEach(function(img){
	    		if(typeof img === 'string'){
	    			imgs.push(this.game.assets.image(img));
	    		}else{
	    			imgs.push(img);
	    		}
	    	},this);
	    	this.images = imgs;
	    }else{
	    	this.images = [];
	    }

	    if(!this.images[0]){
	    	soya2d.console.error('soya2d.Sprite: invalid param [images]; '+this.images[0]);
	    }
	    this.frameIndex = 0;

	    if(changeSize){
	    	this.w = this.images[0].width;
	    	this.h = this.images[0].height;
	    }

	    if(this.animations)
	    	this.animations.destroy();
	    this.animations = new AnimationManager(this,this.images.length);

	    return this;
	}
});