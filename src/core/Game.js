/**
 * 游戏对象是构建soya2d应用的入口类，用于构建和启动一个soya2d应用。
 * 一个页面可以同时运行多个游戏对象，并且拥有不同的FPS和场景
 * @class soya2d.Game
 * @param {Object} opts 构造参数对象，参数如下：
 * @param {string | HTMLElement} opts.container 游戏渲染的容器，可以是一个选择器字符串或者节点对象
 * @param {int} opts.rendererType 渲染器类型，目前只支持canvas
 * @param {int} opts.w 游戏的宽度
 * @param {int} opts.h 游戏的高度
 * @param {boolean} opts.autoClear 自动清除背景
 * @param {boolean} opts.smoothEnable 是否平滑处理
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
	/********** 外部接口 ***********/

    /**
     * 渲染器
     */
    this.renderer = renderer;
    /**
     * 对象工厂，用来注册新的显示对象类型
     * @type {DisplayObjectFactory}
     */
    this.objects = new DisplayObjectFactory(this);
    /**
     * 对象工厂，用来注册新的显示对象类型
     * @type {DisplayObjectFactoryProxy}
     */
    this.add = new DisplayObjectFactoryProxy(this);
    /**
     * 全局事件监听器，包括DOM事件和自定义事件
     * @type {Signal}
     */
    this.events = new Signal();
    this.events.__signalHandler = new SignalHandler();
    /**
     * 场景管理器
     * @type {SceneManager}
     */
    this.scene = new SceneManager(this);
	/**
	 * 舞台
	 * @type {soya2d.Stage}
	 */
	this.stage = new Stage({game:this,w:renderer.w,h:renderer.h});
    /**
     * 世界
     * @type {soya2d.World}
     */
    this.world = new World({game:this,w:renderer.w,h:renderer.h});
    this.stage.add(this.world);
    /**
     * 每个game实例只存在唯一的一个摄像机，摄像机展示了世界中的内容
     * @type {Camera}
     */
    this.camera = new Camera(renderer.w,renderer.h,this);
	/**
	 * 资源管理器
	 * @type {Assets}
	 */
	this.assets = new Assets();
	/**
     * 加载器
     * @type {Loader}
     */
	this.load = new Loader(this);
    /**
     * 定时器
     * @type {Timer}
     */
    this.timer = new Timer();
    /**
     * 物理系统
     * @type {Physics}
     */
    this.physics = new Physics();
    /**
     * 瓦片地图管理器
     * @type {TilemapManager}
     */
    this.tilemap = new TilemapManager(this);
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
	this.start = function(){
		if(this.running)return;
		this.running = true;

		//scan stage
		this.stage.__scan(this.w,this.h,container,renderer);

		//start modules
		var modules = soya2d.module._getAll();
		var beforeUpdates = [],
            onUpdates = [],
            afterUpdates = [],
            beforeRenders = [],
            afterRenders = [];
		for(var k in modules){
			if(modules[k].onStart)modules[k].onStart(this);

            if(modules[k].onBeforeUpdate)beforeUpdates.push([modules[k],modules[k].onBeforeUpdate]);
			if(modules[k].onUpdate)onUpdates.push([modules[k],modules[k].onUpdate]);
            if(modules[k].onAfterUpdate)afterUpdates.push([modules[k],modules[k].onAfterUpdate]);
            if(modules[k].onBeforeRender)beforeRenders.push([modules[k],modules[k].onBeforeRender]);
            if(modules[k].onAfterRender)afterRenders.push([modules[k],modules[k].onAfterRender]);
		}
		
		//start
		threshold = 1000 / currFPS;
		run(function(now,d){
            //before updates
            beforeUpdates.forEach(function(cbk){
                cbk[1].call(cbk[0],thisGame,now,d);
            });
            //update modules
            if(onUpdates.length>0){
                now = Date.now();
                onUpdates.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d);
                });
            }

            //physics
            if(thisGame.physics.running)game.physics.update();

            //calc camera rect
            thisGame.camera.__onUpdate();

            //update entities
            //update matrix——>sort(optional)——>onUpdate(matrix)——>onRender(g)
            
            thisGame.timer.__scan(d);

            thisGame.stage.__updateMatrix();
            thisGame.stage.__update(thisGame,d);
            
            
            if(thisGame.currentScene.onUpdate)
                thisGame.currentScene.onUpdate(thisGame,d);
            //after updates
            if(afterUpdates.length>0){
                now = Date.now();
                afterUpdates.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d);
                });
            }

            
            thisGame.camera.__cull(thisGame.stage);

            thisGame.camera.__viewport(thisGame.world);
            
            //before render
            if(beforeRenders.length>0){
                now = Date.now();
                beforeRenders.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d);
                });
            }
            //render
            renderer.render(thisGame.stage,thisGame.camera);
            
            //after render
            if(afterRenders.length>0){
                now = Date.now();
                afterRenders.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d);
                });
            }
		});

		return this;
	};

    var thisGame = this;
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

	//init modules
	var modules = soya2d.module._getAll();
    var ms = 0;
	for(var k in modules){
		if(modules[k].onInit)modules[k].onInit(this);
        ms++;
	}

    //init DOF
    this.objects.register('shape',soya2d.Shape);
    this.objects.register('sprite',soya2d.Sprite);
    this.objects.register('tileSprite',soya2d.TileSprite);
    this.objects.register('group',soya2d.DisplayObjectContainer);
    this.objects.register('text',soya2d.Text);

    var t1 = 'soya2d Game instance created...';
    var t2 = ms + ' plugins loaded...';
    soya2d.console.info(t1);
    soya2d.console.info(t2);
    
    soya2d.games.push(this);
};
/**
 * 游戏实例列表，保存当前域所有的game实例
 * @type {Array}
 */
soya2d.games = [];
var t1 = 'soya2d '+soya2d.version.toString()+' is working...';
var t2 = '==== thank you for using soya2d, you\'ll love it! ====';

soya2d.console.info(t1);
soya2d.console.info(t2);



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