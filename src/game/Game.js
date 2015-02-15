/**
 * @classdesc 游戏对象是构建soya2d应用的入口类，用于构建和启动一个soya2d应用。
 * 一个页面可以同时运行多个游戏对象，并且拥有不同的FPS和场景
 * @class 
 * @param {Object} opts 构造参数对象，参数如下：
 * @param {string | HTMLElement} opts.container 游戏渲染的容器，可以是一个选择器字符串或者节点对象
 * @param {int} opts.rendererType 渲染器类型，目前只支持canvas
 * @param {int} opts.w 游戏的宽度
 * @param {int} opts.h 游戏的高度
 * @param {boolean} opts.autoClear 自动清除背景
 * @param {boolean} opts.smoothEnable 是否平滑处理
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Game = function(opts){
	opts = opts || {};
	var container = opts.container || document.body;

	if(typeof container === 'string'){
		container = document.querySelector(container);
	}

	var rendererType = opts.rendererType || soya2d.RENDERER_TYPE_CANVAS;
    var cw = container.offsetWidth || 100,
        ch = container.offsetHeight || 100;

	var renderer = null;
	//if(rendererType == soya2d.RENDERER_TYPE_CANVAS){
		renderer = new soya2d.CanvasRenderer({
			smoothEnable: opts.smoothEnable,
			autoClear: opts.autoClear,
			container: container,
			sortEnable:true,
			w: opts.w || cw,
			h: opts.h || ch
		});
	//}

	soya2d.ext(this,opts);

	/**
	 * 当前场景
	 * @type {soya2d.Scene}
	 */
	this.scene = null;

	/********** 外部接口 ***********/

	/**
	 * 获取渲染器
	 * @return {Object} 渲染器实例
	 */
	this.getRenderer = function(){
		return renderer;
	};

	/**
	 * 默认视图
	 * @type {soya2d.View}
	 */
	this.view = new soya2d.View(this);

	/**
	 * 纹理管理器
	 * @type {soya2d.TextureManager}
	 */
	this.textureManager = new soya2d.TextureManager();

	/**
	 * 纹理集管理器
	 * @type {soya2d.TextureAtlasManager}
	 */
	this.texAtlasManager = new soya2d.TextureAtlasManager();

	/**
     * 加载资源
     * @param {Object} opts 参数对象
     * @param {Array} opts.textures 需要加载的纹理数组，比如：[url1,url2,...]
     * @param {Array} opts.texAtlas 需要加载的纹理集数组，比如：[{id:'xxx',ssheet:'a/b/c.ssheet',image:'a/b/c.png'},...]
     * @param {Array} opts.sounds 需要加载的声音路径数组,支持跨平台定义。['a.wav',['b.mp3','b.m4a','b.ogg'],'c.ogg']，子数组内为一个声音的不同格式，引擎会自动加载平台支持的第一个
     * @param {Array} opts.fonts 需要加载的字体数组，比如：[{url:xxx,family:xxx},...]
     * @param {Array} opts.scripts 需要加载的脚本数组，比如：[url1,url2,...]
     * @param {String} opts.crossOrigin 跨域加载资源标识，如果设置该标识，则资源按照该标识方式来加载
     * @param {Function} opts.onLoad 回调函数，加载完成、超时、错误时触发
     * @param {Function} opts.onEnd 回调函数，所有资源加载完成时触发
     */
	this.loadRes = function(opts){
		var textures = opts.textures||[];
		var texAtlas = opts.texAtlas||[];
        var fonts = opts.fonts||[];
        var sounds = opts.sounds||[];
        var scripts = opts.scripts||[];
        var onload = opts.onLoad||function(){};
        var onend = opts.onEnd||function(){};
        var crossOrigin = opts.crossOrigin;
        var loader = soya2d.Loader;
                
        //创建加载队列
        var loaders = [];
        if(textures.length>0)loaders.push([loadTextures,textures]);
        if(texAtlas.length>0)loaders.push([loadTexAtlas,texAtlas]);
        if(soya2d.Sound && sounds.length>0)loaders.push([loadSounds,sounds]);
        if(fonts.length>0)loaders.push([loadFonts,fonts]);
        if(scripts.length>0)loaders.push([loadScripts,scripts]);
        
        var llen = loaders.length;
        //开始加载
        if(llen>0)
        loaders[0][0](crossOrigin,loader,loaders[0][1],onload,function(){
            if(llen>1)
            loaders[1][0](crossOrigin,loader,loaders[1][1],onload,function(){
            	if(llen>2)
		            loaders[2][0](crossOrigin,loader,loaders[2][1],onload,function(){
		                if(llen>3)
		                    loaders[3][0](crossOrigin,loader,loaders[3][1],onload,function(){
		                        if(llen>4)
		                            loaders[4][0](crossOrigin,loader,loaders[4][1],onload,onend);
		                        else{onend();}
		                    });
		                    else{onend();}
		            });
		            else{onend();}
            });
            else{onend();}
        });
	};
	/*********** 加载资源 ************/
	function loadTexAtlas(crossOrigin,loader,urls,onload,onEnd){
        "use strict";

        var map = {};
        for(var i=urls.length;i--;){
            map[urls[i].image+'/'+urls[i].ssheet] = urls[i].id;
        }

        loader.loadTexAtlas({
            crossOrigin:crossOrigin,
            urls:urls,
            onLoad:function(atlas,tex,ssheet,texUrl,ssheetUrl){
            	thisGame.textureManager._add(texUrl,tex);
            	var id = map[texUrl+'/'+ssheetUrl];
            	thisGame.texAtlasManager._add(id,atlas);
                onload(atlas,tex,ssheet);
            },
            onError:function(image,ssheet){
                onload(image,ssheet);
            },
            onEnd:function(){
                onEnd();
            }
        });
    }
    function loadScripts(crossOrigin,loader,urls,onload,onEnd){
        "use strict";
        //加载脚本
        loader.loadScripts({
            crossOrigin:crossOrigin,
            urls:urls,
            onLoad:function(src){
                onload(src);
            },
            onError:function(src){
                onload(src);
            },
            onEnd:function(){
                onEnd();
            }
        });
    }
    var thisGame = this;
    function loadSounds(crossOrigin,loader,urls,onload,onEnd){
        "use strict";
        //加载音频
        loader.loadSounds({
            urls:urls,
            onLoad:function(src,sound){
                thisGame.soundManager._add(src,sound);
                onload(src);
            },
            onError:function(src,code){
                onload(src);
            },
            onEnd:function(sounds){
                onEnd(sounds);
            }
        });
    }
    function loadTextures(crossOrigin,loader,urls,onload,onEnd){
        "use strict";
        //加载纹理
        loader.loadTextures({
            crossOrigin:crossOrigin,
            urls:urls,
            onLoad:function(tex,url){
            	thisGame.textureManager._add(url,tex);
                onload();
            },
            onError:function(url){
                onload(url);
            },
            onEnd:function(texs){
                onEnd();
            }
        });
    }
    function loadFonts(crossOrigin,loader,urls,onload,onEnd){
        "use strict";
        loader.loadFonts({
            urls:urls,
            timeout:1000,
            onLoad:function(font,family){
                onload(font,family);
            },
            onTimeout:function(family){
                onload(family);
            },
            onEnd:function(){
                onEnd();
            }
        });
    }

	/**
	 * 当前游戏的宽度
	 * @type {int}
	 * @default 960
	 */
	this.w = renderer.w;

	/**
	 * 当前游戏的高度
	 * @type {int}
	 * @default 480
	 */
	this.h = renderer.h;

	/**
	 * 当前游戏是否正在运行
	 * @type {boolean}
	 * @default false
	 */
	this.running = false;
	/**
	 * 启动当前游戏实例
	 * @param {soya2d.Scene} scene 启动场景
     * @return this
	 */
	this.start = function(scene){
		if(this.running)return;
		this.running = true;
        if(!this.scene){
		  this.cutTo(scene);
        }

        soya2d.console.log('game starting...');
        if(scene.children.length < 1){
            soya2d.console.warn('empty scene be showing...');
        }

		//scan view
		this.view.scan(this.w,this.h,container,renderer);
		this.view.align(this.view.align());

		//start modules
		var modules = soya2d.module._getAll();
		var beforeUpdates = [],
            onUpdates = [],
            afterUpdates = [],
            beforeRenders = [],
            afterRenders = [];
		for(var k in modules){
			if(modules[k].onStart)modules[k].onStart(this);

            if(modules[k].onBeforeUpdate)beforeUpdates.push(modules[k].onBeforeUpdate);
			if(modules[k].onUpdate)onUpdates.push(modules[k].onUpdate);
            if(modules[k].onAfterUpdate)afterUpdates.push(modules[k].onAfterUpdate);
            if(modules[k].onBeforeRender)beforeRenders.push(modules[k].onBeforeRender);
            if(modules[k].onAfterRender)afterRenders.push(modules[k].onAfterRender);
		}
		
		//start
		threshold = 1000 / currFPS;
		run(function(now,d){

            //before updates
            beforeUpdates.forEach(function(cbk){
                cbk(thisGame,now,d);
            });
			//update modules
            if(onUpdates.length>0){
                now = Date.now();
                onUpdates.forEach(function(cbk){
                    cbk(thisGame,now,d);
                });
            }
            //update entities
            thisGame.scene.__update(thisGame);
            //after updates
            if(afterUpdates.length>0){
                now = Date.now();
                afterUpdates.forEach(function(cbk){
                    cbk(thisGame,now,d);
                });
            }
            

            //before render
            if(beforeRenders.length>0){
                now = Date.now();
                beforeRenders.forEach(function(cbk){
                    cbk(thisGame,now,d);
                });
            }
            //render
            renderer.render(thisGame.scene);
            //after render
            if(afterRenders.length>0){
                now = Date.now();
                afterRenders.forEach(function(cbk){
                    cbk(thisGame,now,d);
                });
            }
		});

		return this;
	};

	var lastCountTime=0;
	var maxFPS = 60;
    var currFPS = 60;
    var threshold,
        totalTime=0;
    var RAFTag;
	function run(fn){
        if (!thisGame.running) return;
        RAFTag = requestAFrame(function(t){
            if(lastCountTime===0){
	            lastCountTime = t;
	        }
            var d = t - lastCountTime;
            lastCountTime = t;

            //main body
            if(totalTime > threshold){
                var now = Date.now();
                if(fn)fn(now,d);

                totalTime = totalTime % threshold;
            }
            totalTime += d;
            
            run(fn);
        });
    };

    /**
     * 设置该游戏实例的FPS
     * @param {Number} fps 最大60
     * @return this
     */
    this.setFPS = function(fps){
        currFPS = parseInt(fps) || maxFPS;
        currFPS = currFPS>maxFPS?maxFPS:currFPS;
        threshold = 1000 / currFPS;

        return this;
    };
	/**
	 * 停止当前游戏实例
     * @return this
	 */
	this.stop = function() {
		cancelAFrame(RAFTag);
		this.running = false;

		var modules = soya2d.module._getAll();
		for(var k in modules){
			if(modules[k].onStop)modules[k].onStop(this);
		}

		return this;
	};

	/**
	 * 跳转场景
	 * @param {soya2d.Scene} scene 需要跳转到的场景
     * @return this
	 */
	this.cutTo = function(scene){
		if(!scene)return;
        var fireModuleCbk = false;
        if(this.scene){
            fireModuleCbk = true;
            //clear old scene
            this.scene.clear();
        }
		this.scene = scene;
		this.scene.game = this;
		//初始化场景
		if(this.scene.onInit && this.scene.onInit.call){
			this.scene.onInit(this);
		}

        if(fireModuleCbk){
            var modules = soya2d.module._getAll();
            for(var k in modules){
                if(modules[k].onSceneChange)modules[k].onSceneChange(this,scene);
            }   
        }

		return this;
	};

	//init modules
	var modules = soya2d.module._getAll();
    var ms = 0;
	for(var k in modules){
		if(modules[k].onInit)modules[k].onInit(this);
        ms++;
	}

    var t1 = 'soya2d Game instance created...';
    var t2 = ms + ' plugins loaded...';
    soya2d.console.log(t1);
    soya2d.console.log(t2);
    
};
var t1 = 'soya2d is working...';
var t2 = '==== thank you for using soya2d, you\'ll love it! ====';

soya2d.console.log(t1);
soya2d.console.log(t2);



/**
 * 渲染器类型,自动选择。
 * 引擎会根据运行环境自动选择渲染器类型
 */
soya2d.RENDERER_TYPE_AUTO = 1;
/**
 * 渲染器类型,canvas。
 * 引擎会使用canvas 2d方式进行渲染
 */
soya2d.RENDERER_TYPE_CANVAS = 2;
/**
 * 渲染器类型,webgl
 * 引擎会使用webgl方式进行渲染
 */
soya2d.RENDERER_TYPE_WEBGL = 3;