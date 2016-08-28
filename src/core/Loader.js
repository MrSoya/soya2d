/**
 *  资源加载类加载所有相关资源，并放入{{#crossLink "Assets"}}{{/crossLink}}中。
 *  该类不能被实例化，系统会自动创建实例给game。
 *  每个game有且只有一个load属性，通过该属性可以加载资源。
 *  ```
 *      game.load.baseUrl = 'assets/xml/';
 *      game.load.xml({
 *          ui:'ui.xml'
 *      });
 * ```
 *  @class Loader
 */
var Loader = soya2d.class("",{
    extends:Signal,
    timeout:5000,
    constructor:function(game){
        this.__signalHandler = new SignalHandler();
        this.__assetsQueue = [];

        this.game = game;
        this.__assets = game.assets.__assets;

        this.baseUrl = '';

        var show = true;
        Object.defineProperties(this,{
            /**
             * 是否显示默认的进度条
             * @property show
             * @type {Boolean}
             */
            show : {
                set:function(v){
                    show = v;
                },
                get:function(){
                    return show;
                }
            },
            /**
             * 进度条文字样式
             * @property fillStyle
             * @type {String}
             */
            fillStyle:{
                set:function(v){
                    this.__tip.fillStyle = v;
                },
                get:function(){
                    return this.__tip.fillStyle;
                }
            }
        });

        this.__logo = new soya2d.Shape({
            game:game,
            opacity:0,
            x: game.w/2 - 11,
            y: game.h/2 - 30 - 20,
            z:9999
        });
        var p1 = new soya2d.Shape({
            w:23,h:20,
            skewY:-30,
            game:game,
            fillStyle:'#69CA14',
            onRender:function(g){
                g.beginPath();
                g.fillStyle(this.fillStyle);
                g.rect(0,0,this.w,this.h);
                g.fill();
                g.closePath();
            }
        });
        var p2 = new soya2d.Shape({
            game:game,
            w:23,h:20,
            skewY:30,
            y:13,
            opacity:.9,
            fillStyle:'#2A5909',
            onRender:function(g){
                g.beginPath();
                g.fillStyle(this.fillStyle);
                g.rect(0,0,this.w,this.h);
                g.fill();
                g.closePath();
            }
        });
        var p3 = new soya2d.Shape({
            game:game,
            w:23,h:20,
            skewY:-30,
            y:28,
            blendMode:soya2d.BLEND_LIGHTER,
            fillStyle:'#69CA14',
            onRender:function(g){
                g.beginPath();
                g.fillStyle(this.fillStyle);
                g.rect(0,0,this.w,this.h);
                g.fill();
                g.closePath();
            }
        });
        
        var font = new soya2d.Font('normal 400 23px/normal Arial,Helvetica,sans-serif');
        this.__tip = new soya2d.Text({
            game:game,
            x: -70,
            y: 60 + 10,
            font:font,
            text:'Loading... 0/0',
            w:200,
            fillStyle: '#000'
        });
        this.__logo.add(p1,p2,p3,this.__tip);
        game.world.add(this.__logo);
    },
    __addToAssets:function(type,data){
        for(var k in data){
            this.__assetsQueue.push({type:type,k:k,data:data[k],baseUrl:this.baseUrl});
        }
    },
    /**
     * 加载图像
     * @method image
     * @param  {Object | Array} data 图像的key和url对象，如{btn:'button.png',bullet:'x01.png'}。
     * 或者图像url数组，key为不包含后缀的图像名，如果重复会覆盖
     */
    image:function(data){
        var map = data;
        if(data instanceof Array){
            map = {};
            data.forEach(function(url){
                var sPos = url.lastIndexOf('/')+1;
                var ePos = url.lastIndexOf('.');
                var k = url.substring(sPos,ePos);
                map[k] = url;
            });
        }
        this.__addToAssets('image',map);
    },
    /**
     * 加载声音
     * @method sound
     * @param  {Object} data 声音的key和url。url可以是数组或者字符串。当url是数组类型时，
     * 系统会自动判断当前环境支持的声音格式，并加载。{bird:'bird.ogg',boom:['b1.mp3','b1.ogg']}
     */
    sound:function(data){
        this.__addToAssets('sound',data);
    },
    /**
     * 加载字体
     * @method font
     * @param  {Object} data 字体的key和url。key就是字体的family。{serif:'serif.woff'}
     */
    font:function(data){
        this.__addToAssets('font',data);
    },
    /**
     * 加载图像文字
     * @method imageFont
     * @param  {Object} data 图像文字的key和url。url是一个包含了图像地址和精灵表地址的数组。
     * {title:['title.png','title_ss.json'|{{n:'xx',x:0,y:0,w:100,h:100}}]}
     */
    imageFont:function(data){
        this.__addToAssets('imageFont',data);
    },
    /**
     * 加载图像集
     * @method atlas
     * @param  {Object} data 图像集的key和url。url是一个包含了图像地址和精灵表地址的数组。
     * {birds:['birds.png','birds_ss.json']}
     *
     * @param {String} key 图像集的key
     * @param {String} url 图像的url
     * @param {Number} width 单个图像的宽度
     * @param {Number} height 单个图像的高度
     */
    atlas:function(data){
        var map = data;
        if(arguments.length === 4){
            map = {};
            var k = arguments[0];
            var url = arguments[1];
            var w = arguments[2];
            var h = arguments[3];
            map[k] = [url,w,h];
        }
        this.__addToAssets('atlas',map);
    },
    /**
     * 加载文本
     * @method text
     * @param {Object} data 文本的key和url
     */
    text:function(data){
        this.__addToAssets('text',data);
    },
    /**
     * 加载XML
     * @method xml
     * @param  {Object} data xml的key和url
     */
    xml:function(data){
        this.__addToAssets('xml',data);
    },
    /**
     * 加载json
     * @method json
     * @param  {Object} data json的key和url
     */
    json:function(data){
        this.__addToAssets('json',data);
    },
    __loadImage:function(baseUrl,url,onload){
        var img = new Image();
        if(this.crossOrigin !== undefined)img.crossOrigin = this.crossOrigin;
        img.path = url;
        var loader = this;
        img.onload=function(){
            onload('load',this);

            this.onerror = null;
            this.onload = null;
        }
        img.onerror=function(){
            onload('error',this.path);

            this.onerror = null;
            this.onload = null;
        }
        img.src = baseUrl + url;
        if(img.complete){
            onload('load',img);

            img.onerror = null;
            img.onload = null;
        }
    },
    __loadSound:function(baseUrl,url,onload){
        var loader = this;
        var urls = url instanceof Array?url:[url];
        for(var i=urls.length;i--;){
            urls[i] = baseUrl + urls[i];
        }
        new Howl({
            src: urls,
            onload:function(){
                var sound = new soya2d.Sound();
                sound.__handler = this;

                onload('load',sound);
            },
            onloaderror:function(error){
                var errorType = soya2d.MEDIA_ERR_DECODE;
                if(error){
                    errorType = error.type;
                }
                onload('error',this._src,errorType);
            }
        });
    },
    __loadFont:function(baseUrl,family,url,onload){
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
            span.innerHTML = family;
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
                        "font-family: '" + family + "';" +
                        "src: url(" + baseUrl+url + ")" +
                        "}";
        document.head.appendChild(style);
        for(var i in originSpan){
            originSpan[i].style.fontFamily = family+','+originSpan[i].style.fontFamily;
        }
        //监控器启动扫描
        var startTime = new Date().getTime();
        var that = this;
        setTimeout(function(){
            scanFont(startTime,that.timeout,originSpan,originWidth,originHeight,function(family){
                onload('timeout',family);
            },function(family){
                onload('load',family);
            },family);
        },100);//100ms用于浏览器识别非法字体，然后还原并使用次等匹配字体
    },
    __loadAtlas:function(baseUrl,key,data,onload){
        var loader = this;
        this.__loadImage(baseUrl,data[0],function(type,img){
            if(type === 'load'){
                if(typeof(data[1]) === 'string' && data.length===2)
                    loader.__getXhr(baseUrl,data[1],function(type,xhr){
                        var atlas = xhr;
                        if(type === 'load'){
                            var json;
                            try{
                                json = new Function('return '+xhr.responseText)();
                            }catch(e){
                                json = e;
                            }
                            //创建图像集
                            atlas = new soya2d.Atlas(img,json);
                        }
                        
                        onload(type,atlas);
                    });
                else{
                    var json = data[1];
                    if(data.length > 2){
                        json = [];
                        var imgW = img.width;
                        var imgH = img.height;
                        var w = data[1];
                        var h = data[2];
                        var index = 1;
                        for(var j=h;j<=imgH;j+=h){
                            for(var i=w;i<=imgW;i+=w){
                                json.push({
                                    n:key+'_'+index,
                                    x:i-w,y:j-h,
                                    w:w,h:h});
                                index++;
                            }
                        }
                    }
                    var atlas = new soya2d.Atlas(img,json);
                    onload(type,atlas);
                }
            }else{
                onload(type,img);
            }
        });
    },
    __getXhr:function(baseUrl,url,onload){
        var loader = this;
        xhrLoad(baseUrl+url,this.timeout,function(){
            onload('timeout',url);
        },function(){
            onload('error',url);
        },function(xhr){
            onload('load',xhr);
        });
    },
    __loadAssets:function(){
        var loader = this;
        this.__assetsQueue.forEach(function(asset){
            switch(asset.type){
                case 'image':
                    loader.__loadImage(asset.baseUrl,asset.data,function(type,img){
                        if(type==='load')
                            loader.__assets.image[asset.k] = img;
                        loader.__onLoad(type,img);
                    });
                    break;
                case 'sound':
                    if(!soya2d.Sound){
                        soya2d.console.warn("can't load sounds, module [sound] needs to be loaded");
                        return;
                    }
                    loader.__loadSound(asset.baseUrl,asset.data,function(type,sound){
                        if(type==='load')
                            loader.__assets.sound[asset.k] = sound;
                        loader.__onLoad(type,sound,arguments[2]);
                    });
                    break;
                case 'atlas':
                    loader.__loadAtlas(asset.baseUrl,asset.k,asset.data,function(type,atlas){
                        if(type==='load')
                            loader.__assets.atlas[asset.k] = atlas;
                        loader.__onLoad(type,atlas);
                    });
                    break;
                case 'font':
                    loader.__loadFont(asset.baseUrl,asset.k,asset.data,function(type,family){
                        var font = family;
                        if(type==='load'){
                            font = new soya2d.Font().family(family);
                            loader.__assets.imageFont[asset.k] = font;
                        }
                        loader.__onLoad(type,font);
                    });
                    break;
                case 'imageFont':
                    loader.__loadAtlas(asset.baseUrl,asset.k,asset.data,function(type,atlas){
                        var font = atlas;
                        if(type==='load'){
                            font = new soya2d.ImageFont(atlas);
                            loader.__assets.imageFont[asset.k] = font;
                        }
                        loader.__onLoad(type,font);
                    });
                    break;
                case 'text':
                    loader.__getXhr(asset.baseUrl,asset.data,function(type,xhr){
                        var text = xhr;
                        if(type==='load'){
                            loader.__assets.text[asset.k] = xhr.responseText;
                            text = xhr.responseText
                        }
                        loader.__onLoad(type,text);
                    });
                    break;
                case 'xml':
                    loader.__getXhr(asset.baseUrl,asset.data,function(type,xhr){
                        var doc = xhr;
                        if(type==='load'){
                            doc = loader.__assets.xml[asset.k] = xhr.responseXML;
                        }
                        loader.__onLoad(type,doc);
                    });
                    break;
                case 'json':
                    loader.__getXhr(asset.baseUrl,asset.data,function(type,xhr){
                        var json = xhr;
                        if(type==='load'){
                            try{
                                json = new Function('return '+xhr.responseText)();
                            }catch(e){
                                json = e;
                            }
                            loader.__assets.json[asset.k] = json;
                        }
                        loader.__onLoad(type,json);
                    });
                    break;
            }
        });
    },
    __onLoad:function(type,rs){
        this.__tip.setText('Loading... '+ (++this.__index) +'/'+this.__assetsQueue.length);
        if(type === 'load'){
            this.emit(type,rs,this.__index,this.__assetsQueue.length);
        }else{
            this.emit(type,rs,arguments[2]);   
        }
        if(this.__index == this.__assetsQueue.length){
            this.__assetsQueue = [];
            this.emit('end');
            this.__logo.parent.remove(this.__logo);
            this.__logo.opacity = 0;
        }
    },
    /**
     * 启动加载器。在preload中，引擎会自动调用
     * @method start 
     */
    start:function(){
        this.__index = 0;
        if(this.show){
            if(!this.__logo.parent){
                this.game.world.add(this.__logo);
            }
            this.__logo.opacity = 1;
        }

        this.__loadAssets();
    }
});
function xhrLoad(url,timeout,ontimeout,onerror,onload){
    var xhr = new XMLHttpRequest();
    xhr.open('get',url,true);
    xhr.timeout = timeout;
    xhr.ontimeout = ontimeout;
    xhr.onerror = onerror;
    if(xhr.onload === null){
        xhr.onload = function(){
            if(xhr.status===0 || //native
                (xhr.status >= 200 && xhr.status <300) || xhr.status === 304){
                onload(xhr);
            }
        }
    }else{
        xhr.onreadystatechange = function () {
            if(xhr.status===0 || //native
                ((xhr.status >= 200 && xhr.status <300) || xhr.status === 304) && xhr.readyState === 4){
                onload(xhr);
            }
        };
    }
    xhr.send(null);
}
function scanFont(startTime,timeout,originSpan,originWidth,originHeight,onTimeout,onLoad,family){
    setTimeout(function(){
        if(new Date().getTime() - startTime > timeout){
            onTimeout(family);
            return;
        }
        //检查originSpan的宽度是否发生了变化
        for(var i in originSpan){
            originSpan[i].style.left = '-1000px';
            var w = originSpan[i].offsetWidth;
            var h = originSpan[i].offsetHeight;
            if(w !== originWidth[i] || h !== originHeight[i]){//发生了改变
                //document.body.removeChild(originSpan[i]);
                
                    onLoad(family);
                
                return;
            }
        }
        //没有改变，继续扫描
        scanFont(startTime,timeout,originSpan,originWidth,originHeight,onTimeout,onLoad,family);
    },20);
}

/**
 * 媒体加载错误类型——MEDIA_ERR_UNCERTAIN<br/>
 * 未知错误
 * @property MEDIA_ERR_UNCERTAIN
 * @final
 */
soya2d.MEDIA_ERR_UNCERTAIN = -1;
/**
 * 媒体加载错误类型——MEDIA_ERR_ABORTED<br/>
 * 加载被中断
 * @property MEDIA_ERR_ABORTED
 * @final
 */
soya2d.MEDIA_ERR_ABORTED = 1;
/**
 * 媒体加载错误类型——MEDIA_ERR_NETWORK<br/>
 * 网络异常
 * @property MEDIA_ERR_NETWORK
 * @final
 */
soya2d.MEDIA_ERR_NETWORK = 2;
/**
 * 媒体加载错误类型——MEDIA_ERR_DECODE<br/>
 * 无法解码
 * @property MEDIA_ERR_DECODE
 * @final
 */
soya2d.MEDIA_ERR_DECODE = 3;
/**
 * 媒体加载错误类型——MEDIA_ERR_SRC_NOT_SUPPORTED<br/>
 * 类型不支持
 * @property MEDIA_ERR_SRC_NOT_SUPPORTED
 * @final
 */
soya2d.MEDIA_ERR_SRC_NOT_SUPPORTED = 4;
/**
 * 媒体加载错误类型——MEDIA_ERR_SRC_NOT_FORTHCOMING<br/>
 * 无法获取资源数据
 * @property MEDIA_ERR_SRC_NOT_FORTHCOMING
 * @final
 */
soya2d.MEDIA_ERR_SRC_NOT_FORTHCOMING = 101;