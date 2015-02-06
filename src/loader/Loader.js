/**
 *  资源加载类<br/>
 *  除脚本支持不同加载方式外，其他资源都是并行加载。
 *  调用者应该注意，在并行请求过多时，可能导致请求失败，需要控制请求并发数
 * @namespace soya2d.Loader
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Loader = new function(){
	/**
	 * 加载图像,如果成功，返回纹理soya2d.Texture
     * @param {Object} cfg 参数
     * @param {Array} cfg.urls 图像路径数组。['1.jpg','2.png','3.gif']
	 * @param {Function} cfg.onLoad 单个图像加载成功事件,可选  回调参数[texture,url]
	 * @param {Function} cfg.onEnd 全部图像加载完成事件,可选 回调参数[texture数组]
     * @param {Function} cfg.onError 单个图像加载错误事件,可选 回调参数[url]
     * @param {Function} cfg.onTimeout 单个图像加载超时事件,可选 回调参数[url]
     * @param {int} cfg.timeout 每个图像加载超时时间,默认5000ms
     * @param {String} cfg.crossOrigin 跨域标识
	 * @see soya2d.Texture
     * @return this
     */
	this.loadTextures = function(cfg){
        var loaded = cfg.urls.length;
        var onLoad = cfg.onLoad;
        var onEnd = cfg.onEnd;
        var onError = cfg.onError;
        var onTimeout = cfg.onTimeout;
        var timeout = cfg.timeout||soya2d.TIMEOUT;
        var crossOrigin = cfg.crossOrigin;
        var rs = new Array(loaded);
        
        for(var i=cfg.urls.length;i--;){
            var img = new Image();
            if(crossOrigin !== undefined)img.crossOrigin = crossOrigin;
            img.i = i;
            img.path = cfg.urls[i];
            img.onload=function(){
                var tex = new soya2d.Texture.fromImage(this);
                rs[this.i] = tex;
                delete this.i;
                if(onLoad && onLoad.call){
                    onLoad(tex,this.path);
                }

                loaded--;
                if(!loaded && onEnd && onEnd.call){
                    onEnd(rs);
                }
                this.onerror = null;
                this.onload = null;
            }
            img.onerror=function(){
                if(onError && onError.call){
                    onError(this.src);
                }
                loaded--;
                if(!loaded && onEnd && onEnd.call){
                    onEnd();
                }
                this.onerror = null;
                this.onload = null;
            }
            img.src = cfg.urls[i];
            if(img.complete){
                img.onload();
            }
        }
        return this;
	}
	
	function loadScript(src,loaded,onLoad,onError,onEnd){
		var script = document.createElement("script");
		script.onload=function(){
            this.onerror = null;
            this.onload = null;
            document.body.removeChild(this);
			if(onLoad && onLoad.call){
                onLoad(this.src);
			}
            loaded--;
            
            if(!loaded){
                if(onEnd && onEnd.call){
		                onEnd();

		            }
                return;
            }
            loadScript(src,loaded,onLoad,onError,onEnd);
		}
		script.onerror=function(){
            this.onerror = null;
            this.onload = null;
            document.body.removeChild(this);
            if(onError && onError.call){
                onError(this.src);
            }
            loaded--;
            if(!loaded){
                if(onEnd && onEnd.call){
		                onEnd();
		            }
                return;
            }
            loadScript(src,loaded,onLoad,onError,onEnd);
		}
        script.src = src.shift();
		document.body.appendChild(script);
	}
	/**
	 * 加载脚本
     * @param {Object} cfg 参数
     * @param {Array} cfg.urls 脚本路径数组。['/lib/a.js','/lib/b.js','/lib/c.js']
     * @param {int} cfg.mode 脚本加载方式，默认为串行加载soya2d.LOADMODE_SEQU
     * @param {Function} cfg.onLoad 单个脚本加载成功事件,可选   回调参数[src]
     * @param {Function} cfg.onEnd 全部脚本加载完成事件,可选
     * @param {Function} cfg.onError 单个脚本加载失败事件,可选
     * @return this
     */
	this.loadScripts = function(cfg){
        var loaded = cfg.urls.length;
        var onLoad = cfg.onLoad;
        var onEnd = cfg.onEnd;
        var onError = cfg.onError;
        var d = document;
        var b = document.body;
        var mode = cfg.mode||soya2d.LOADMODE_SEQU;
        if(mode===soya2d.LOADMODE_SEQU)
		    loadScript(cfg.urls.concat(),loaded,onLoad,onError,onEnd);
        else{
            for(var i=cfg.urls.length;i--;){
                var s = d.createElement("script");//指定src时，类型必须是javascript或者空，无法加载文本资源
                if(!s.async)s.defer = true;
                s.onload = function () {
                    this.onerror = null;
                    this.onload = null;
                    document.body.removeChild(this);
                    if(onLoad && onLoad.call){
                        onLoad(this.src);
                    }
                    loaded--;
                    if(!loaded && onEnd && onEnd.call){
                        onEnd();
                    }
                }
                s.onerror=function(){
                    this.onerror = null;
                    this.onload = null;
                    document.body.removeChild(this);
                    if(onError && onError.call){
                        onError(this.src);
                    }
                    loaded--;
                    if(!loaded && onEnd && onEnd.call){
                        onEnd();
                    }
                }
                s.src = cfg.urls[i];
                b.appendChild(s);
            }
        }
        return this;
	}
	/**
	 * 加载器声音数据
     * @param {Object} cfg 参数
     * @param {Array} cfg.urls 声音路径数组,支持跨平台定义。['a.wav',['b.mp3','b.m4a','b.ogg'],'c.ogg']，子数组内为一个声音的不同格式，引擎会自动加载平台支持的第一个
     * @param {Function} cfg.onLoad 单个声音加载成功事件,可选   回调参数[sound,url]
     * @param {Function} cfg.onEnd 全部声音加载完成事件,可选    回调参数[sound数组]
     * @param {Function} cfg.onError 单个声音加载失败事件,可选 回调参数[url,errorCode]
	 * @see soya2d.MEDIA_ERR_ABORTED
     * @see soya2d.Sound
	 */
	this.loadSounds = function(cfg){
        var loaded = cfg.urls.length;
        var onLoad = cfg.onLoad;
        var onEnd = cfg.onEnd;
        var onError = cfg.onError;
        var d = document;
        var rs = [];
        
        for(var i=cfg.urls.length;i--;){
            var urls = cfg.urls[i];
            var handler = new Howl({
                urls: urls instanceof Array?urls:[urls],
                onload:function(){
                    if(onLoad && onLoad.call){
                        var sound = new soya2d.Sound();
                        sound.__handler = this;
                        rs.push(sound);
                        onLoad(this._src,sound);
                    }
                    loaded--;
                    if(!loaded && onEnd && onEnd.call){
                        onEnd(rs);
                    }
                },
                onloaderror:function(error){
                    if(onError && onError.call){
                        var errorType = soya2d.MEDIA_ERR_DECODE;
                        if(error){
                            errorType = error.type;
                        }
                        onError(this._src,errorType);
                    }
                    loaded--;
                    if(!loaded && onEnd && onEnd.call){
                        onEnd(rs);
                    }
                }
            });
        }
        return this;
	}

    //加载单个字体
    function loadFont(rs,font,onLoad,onTimeout,onEnd,timeout){
        var originFamily = ['serif','sans-serif'];
        var originCSS = "border:none;position:absolute;top:-999px;left:-999px;" +
                        "font-size:100px;width:auto;height:auto;line-height:normal;margin:0;" +
                        "padding:0;font-variant:normal;white-space:nowrap;font-family:";
        var originWidth = {};
        var originHeight = {};
        var originSpan = {};
        for(var i=originFamily.length;i--;){
            var span = document.createElement('div');
            span.style.cssText = originCSS+"'"+originFamily[i]+"'";
            span.innerHTML = font.family;
            document.body.appendChild(span);
            originSpan[originFamily[i]] = span;
            //获取原始size
            originWidth[originFamily[i]] = span.offsetWidth;
            originHeight[originFamily[i]] = span.offsetHeight;
        }
        //开始加载样式
        var style = document.createElement('style');
        style.id = 'FontLoader_'+new Date().getTime();
        style.innerHTML =  "@font-face {" +
                        "font-family: '" + font.family + "';" +
                        "src: url(" + font.url + ")" +
                        "}";
        document.head.appendChild(style);
        for(var i in originSpan){
            originSpan[i].style.fontFamily = font.family+','+originSpan[i].style.fontFamily;
        }
        //监控器启动扫描
        var startTime = new Date().getTime();
        setTimeout(function(){
            fontScan(rs,startTime,timeout,originSpan,originWidth,originHeight,onLoad,onEnd,onTimeout,font.family);
        },100);//100ms用于浏览器识别非法字体，然后还原并使用次等匹配字体
    }
    var fontLoaded=0;//标识字体当前还剩几个没有下载
    //扫描字体是否加载OK
    function fontScan(rs,startTime,timeout,originSpan,originWidth,originHeight,onLoad,onEnd,onTimeout,family){
        setTimeout(function(){
            if(new Date().getTime() - startTime > timeout){
                //超时
                if(onTimeout && onTimeout.call){
                    onTimeout(family);
                }
                fontLoaded--;
                if(!fontLoaded && onEnd && onEnd.call){
                    onEnd();
                }
                return;
            }
            //检查originSpan的宽度是否发生了变化
            for(var i in originSpan){
                originSpan[i].style.left = '-1000px';
                var w = originSpan[i].offsetWidth;
                var h = originSpan[i].offsetHeight;
                if(w !== originWidth[i] || h !== originHeight[i]){//发生了改变
                    //document.body.removeChild(originSpan[i]);
                    var font;
                    if(onLoad && onLoad.call){
                        font = new soya2d.Font().family(family);
                        onLoad(font,family);
                    }
                    rs[fontLoaded--] = font;
                    if(!fontLoaded && onEnd && onEnd.call){
                        onEnd(rs);
                    }
                    return;
                }
            }
            //没有改变，继续扫描
            fontScan(rs,startTime,timeout,originSpan,originWidth,originHeight,onLoad,onEnd,onTimeout,family);
        },20);
    }
    /**
     * 加载外部字体文件
     * @param {Object} cfg 参数
     * @param {Array} cfg.urls 字体描述数组。[{family:'myfont',url:'a/b/c.ttf'},...]
     * @param {Function} cfg.onLoad 单个字体加载成功事件,可选   回调参数 [font对象,family]
     * @param {Function} cfg.onEnd 全部字体加载完成事件,可选    回调参数 [font对象数组]
     * @param {Function} cfg.onTimeout 单个字体加载超时事件,可选 回调参数[family]
     * @param {int} cfg.timeout 每个字体加载超时时间,默认5000ms
     */
    this.loadFonts = function(cfg){
        var loaded = cfg.urls.length;
        var onLoad = cfg.onLoad;
        var onEnd = cfg.onEnd;
        var onTimeout = cfg.onTimeout;
        var timeout = cfg.timeout||soya2d.TIMEOUT;
        var rs = new Array(loaded);

        fontLoaded = loaded;
        //加载字体
        for(var i=cfg.urls.length;i--;){
            loadFont(rs,cfg.urls[i],onLoad,onTimeout,onEnd,timeout);
        }
    }

    /**
     * 加载纹理集
     * @param {Object} cfg 参数
     * @param {Array} cfg.urls 纹理集描述数组。[{ssheet:'a/b/c.ssheet',image:'a/b/c.png'},...]
     * @param {Function} cfg.onLoad 单个纹理集加载成功事件,可选   回调参数 [纹理集对象,纹理对象，精灵表对象]
     * @param {Function} cfg.onEnd 全部纹理集加载完成事件,可选    回调参数 [纹理集对象数组]
     * @param {Function} cfg.onError 单个纹理集加载失败事件,可选  回调参数 [ssheet,image]
     */
    this.loadTexAtlas = function(cfg){
        var loaded = cfg.urls.length;
        var onLoad = cfg.onLoad;
        var onEnd = cfg.onEnd;
        var onError = cfg.onError;

        var imgUrls = [];
        var map = {};
        for(var i=loaded;i--;){
            imgUrls.push(cfg.urls[i].image);
            map[cfg.urls[i].image] = cfg.urls[i].ssheet;
        }
        
        var rs = [];

        //loadTextures
        this.loadTextures({
            urls:imgUrls,
            onLoad:function(tex,url){
                soya2d.AJAXLoader.loadJSON(
                    {
                        url:map[url],
                        onLoad:function(ssheet){
                            var atlas = new soya2d.TextureAtlas(tex,ssheet);
                            if(onLoad){
                                onLoad(atlas,tex,ssheet,url,map[url]);
                            }
                            rs.push(atlas);

                            if(--loaded===0){
                                if(onEnd){
                                    onEnd(rs);
                                }
                            }
                        },
                        onError:function(){
                            loaded--;
                            if(onError){
                                onError(url,map[url]);
                            }
                        }
                    }
                );
            },
            onError:function(url){
                loaded--;
                if(onError){
                    onError(url,map[url]);
                }
            }
        });
    }
};
/**
 * 默认超时时间，5000ms
 */
soya2d.TIMEOUT = 5000;


/**
 * 媒体加载错误类型——MEDIA_ERR_UNCERTAIN<br/>
 * 未知错误
 * @constant
 */
soya2d.MEDIA_ERR_UNCERTAIN = -1;
/**
 * 媒体加载错误类型——MEDIA_ERR_ABORTED<br/>
 * 加载被中断
 * @constant
 */
soya2d.MEDIA_ERR_ABORTED = 1;
/**
 * 媒体加载错误类型——MEDIA_ERR_NETWORK<br/>
 * 网络异常
 * @constant
 */
soya2d.MEDIA_ERR_NETWORK = 2;
/**
 * 媒体加载错误类型——MEDIA_ERR_DECODE<br/>
 * 无法解码
 * @constant
 */
soya2d.MEDIA_ERR_DECODE = 3;
/**
 * 媒体加载错误类型——MEDIA_ERR_SRC_NOT_SUPPORTED<br/>
 * 类型不支持
 * @constant
 */
soya2d.MEDIA_ERR_SRC_NOT_SUPPORTED = 4;
/**
 * 媒体加载错误类型——MEDIA_ERR_SRC_NOT_FORTHCOMING<br/>
 * 无法获取资源数据
 * @constant
 */
soya2d.MEDIA_ERR_SRC_NOT_FORTHCOMING = 101;

/**
 * 加载类型——并行
 * @constant
 */
soya2d.LOADMODE_PARA = 1;
/**
 * 加载类型——串行
 * @constant
 */
soya2d.LOADMODE_SEQU = 2;