/**
 * @classdesc 精灵类。具有绘图功能的容器类<br/>
 * 支持子对象渲染,以及矩阵变换
 * @class
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数，以及新增参数，参数如下：
 * @param {soya2d.Texture | HTMLImageElement | Array} data.textures 纹理对象或者纹理数组
 * @param {int} [data.w] 精灵的宽度,默认纹理宽度
 * @param {int} [data.h] 精灵的高度,默认纹理高度
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Sprite = function(data){
    data = data||{};
    soya2d.DisplayObjectContainer.call(this,data);
    soya2d.ext(this,data);

    var textures = data.textures;

    this.setTextures(textures);
    
    this.w = data.w || this.textures[0].w;
    this.h = data.h || this.textures[0].h;

    /**
     * 是否多帧
     * @type {boolean}
     */
    this.multiFrame = this.textures.length>1?true:false;
    /**
     * 当前帧序号
     * @type {Number}
     * @default 0
     */
    this.frameIndex = 0;//当前帧号
    this.__currTex;//当前使用纹理
    this.__lastUpdateTime = 0;//上次更新纹理时间
    /**
	 * 纹理切换帧率。单位：帧<br/>
	 * @type int
	 * @default 1
	 */
    this.frameRate = data.frameRate||10;    
    /**
	 * 动画是否循环
	 * @type boolean
	 * @default true
	 */
    this.loop = data.loop===false?false:data.loop||true;
    /**
	 * 动画是否自动播放
	 * @type boolean
	 * @default false
	 */
    this.autoplay = data.autoplay||false;

};
soya2d.inherits(soya2d.Sprite,soya2d.DisplayObjectContainer);
soya2d.ext(soya2d.Sprite.prototype,/** @lends soya2d.Sprite.prototype */{
	clone:function(isRecur){//覆盖超类
		var copy = new this.constructor({
			textures:this.textures.concat()
		});
		return soya2d.DisplayObject.prototype.clone.call(this,isRecur,copy);
	},
    onRender:function(g){
    	if(this.multiFrame){
    		if(!this.__lastUpdateTime)this.__lastUpdateTime = new Date().getTime();
	  	    if(this.autoplay){//自动播放
	            var now = new Date().getTime();
	            var delta = now - this.__lastUpdateTime;
	            //处理跳帧情况
	            var deltaFrames = delta/(this.frameRate*16.7/*这里转化为ms*/)>>0;
	            //差值大于帧率，切换帧
	            if(deltaFrames>0){
	                this.frameIndex+=deltaFrames;
	                if(this.frameIndex >= this.textures.length){
	                    if(this.loop){
	                        this.frameIndex = 0;
	                    }else{
	                        this.frameIndex = this.textures.length-1;
	                    }
	                }

	                this.__lastUpdateTime = now;
	            }
	        }
	  	    this.__currTex = this.textures[this.frameIndex];
			g.map(this.__currTex,0,0,this.w,this.h);
    	}else{
    		g.map(this.textures[0],0,0,this.w,this.h);
    	}
    },
    /**
	 * 设置当前帧数+1
	 */
	nextFrame:function(){
		this.frameIndex++;
		if(this.frameIndex >= this.textures.length){
			if(this.loop){
				this.frameIndex = 0;
			}else{
				this.frameIndex = this.textures.length-1;
			}
		}
	},
	/**
	 * 设置当前帧数-1
	 */
	prevFrame:function(){
		this.frameIndex--;
		if(this.frameIndex < 0){
			if(this.loop){
				this.frameIndex = this.textures.length-1;
			}else{
				this.frameIndex = 0;
			}
		}
	},
	/**
	 * 设置或者更改精灵纹理
	 * @param {soya2d.Texture | HTMLImageElement | Array} textures 纹理对象或者纹理数组
	 */
	setTextures:function(textures){
		if(textures instanceof soya2d.Texture){
	        this.textures = [textures];
	    }else if(textures instanceof self.Image){
	    	this.textures = [soya2d.Texture.fromImage(textures)];
	    }else if(textures instanceof Array){
	    	this.textures = textures;
	    }else{
	    	this.textures = [];
	    }

	    if(!this.textures[0]){
	    	console.error('soya2d.Sprite: invalid param [textures]; '+this.textures[0]);
	    }
	}
});