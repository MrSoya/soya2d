/**
 * 游戏对象是构建soya2d应用的核心类，调度soya2d内的所有过程。
 * 一个页面可以同时运行多个游戏对象，并且拥有不同的FPS和场景
 * @class soya2d.Game
 * @constructor
 * @param {Object} opts 构造参数对象，参数如下：
 * @param {String | HTMLElement} opts.container 游戏渲染的容器，可以是一个选择器字符串或者节点对象
 * @param {Number} [opts.rendererType] 渲染器类型，目前只支持canvas
 * @param {Number} [opts.w] 游戏的宽度
 * @param {Number} [opts.h] 游戏的高度
 * @param {Boolean} opts.autoClear 自动清除背景
 * @param {Boolean} opts.smoothEnable 是否平滑处理
 * 
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
	//////////////////////////////////外部接口 

    /**
     * 渲染器
     * @property renderer
     */
    this.renderer = renderer;
    /**
     * 对象注册工厂，用来注册新的显示对象类型
     * @property objects
     * @type {DisplayObjectFactory}
     */
    this.objects = new DisplayObjectFactory(this);
    /**
     * 对象添加工厂，用来添加新的显示对象到世界中
     * @property add
     * @type {DisplayObjectFactoryProxy}
     */
    this.add = new DisplayObjectFactoryProxy(this);
    /**
     * 场景管理器
     * @property scene
     * @type {SceneManager}
     */
    this.scene = new SceneManager(this);
	/**
	 * 舞台
     * @property stage
	 * @type {soya2d.Stage}
	 */
	this.stage = new Stage({game:this,w:renderer.w,h:renderer.h});
    /**
     * 世界
     * @property world
     * @type {soya2d.World}
     */
    this.world = new World({game:this,w:renderer.w,h:renderer.h});
    this.stage.add(this.world);
    /**
     * 每个game实例只存在唯一的一个摄像机，摄像机展示了世界中的内容
     * @property camera
     * @type {Camera}
     */
    this.camera = new Camera(renderer.w,renderer.h,this);
	/**
	 * 资源管理器
     * @property assets
	 * @type {Assets}
	 */
	this.assets = new Assets();
	/**
     * 加载器
     * @property load
     * @type {Loader}
     */
	this.load = new Loader(this);
    /**
     * 定时器
     * @property timer
     * @type {Timer}
     */
    this.timer = new Timer();
    /**
     * 物理系统
     * @property physics
     * @type {Physics}
     */
    this.physics = new Physics();
	/**
	 * 当前游戏的宽度
     * @property w
	 * @type {int}
	 * @default 960
	 */
	this.w = renderer.w;

	/**
	 * 当前游戏的高度
     * @property h
	 * @type {int}
	 * @default 480
	 */
	this.h = renderer.h;

	/**
	 * 当前游戏是否正在运行
     * @property running
	 * @type {boolean}
	 * @default false
	 */
	this.running = false;

    /**
     * 保存当前输入设备的相关状态
     * @type {Object}
     */
    this.input = {
        pointer:{
            changeType:function(type){
                pointerListener.changeType(type);
            }
        },
        keyboard:{
        },
        device:{}
    };

    var pointerListener = new InputListener(pointerListenerPrototype);
    this.__pointerSignal = new Signal();

	/**
	 * 启动当前游戏实例
     * @method start
     * @private
	 * @param {soya2d.Scene} scene 启动场景
     * @chainable
	 */
	this.start = function(){
		if(this.running)return;
		this.running = true;

		//scan stage
		this.stage.__scan(this.w,this.h,container,renderer);

		//start modules
		var modules = soya2d.module._getAll();
		var beforeUpdates = [],
            postUpdates = [],
            beforeRenders = [],
            postRenders = [];
		for(var k in modules){
			if(modules[k].onStart)modules[k].onStart(this);

            if(modules[k].onBeforeUpdate)beforeUpdates.push([modules[k],modules[k].onBeforeUpdate]);
            if(modules[k].onPostUpdate)postUpdates.push([modules[k],modules[k].onPostUpdate]);
            if(modules[k].onBeforeRender)beforeRenders.push([modules[k],modules[k].onBeforeRender]);
            if(modules[k].onPostRender)postRenders.push([modules[k],modules[k].onPostRender]);
		}

        //start listeners
        pointerListener.start(this);
        keyboardListener.start(this);
        deviceListener.start(this);
		
		//start
		threshold = 1000 / currFPS;
		run(function(now,d){
            //before updates
            beforeUpdates.forEach(function(cbk){
                cbk[1].call(cbk[0],thisGame,now,d);
            });

            //physics
            if(thisGame.physics.running)thisGame.physics.update();
            //calc camera rect
            thisGame.camera.__onUpdate();
            thisGame.timer.__scan(d);

            //update input state & dispatch events
            pointerListener.scan(thisGame);
            keyboardListener.scan(thisGame);
            deviceListener.scan(thisGame);

            //update entities
            //update matrix——>sort(optional)——>onUpdate(matrix)——>onRender(g)
            if(thisGame.currentScene.onUpdate)
                thisGame.currentScene.onUpdate(thisGame,d);

            thisGame.stage.__preUpdate(thisGame,d);
            thisGame.stage.__updateMatrix();
            thisGame.stage.__postUpdate(thisGame,d);
            
            //post updates
            if(postUpdates.length>0){
                now = Date.now();
                postUpdates.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d);
                });
            }
            pointerListener.clear();
            keyboardListener.clear();
            deviceListener.clear();

            
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
            var count = renderer.render(thisGame.stage,thisGame.camera);
            
            //after render
            if(postRenders.length>0){
                now = Date.now();
                postRenders.forEach(function(cbk){
                    cbk[1].call(cbk[0],thisGame,now,d,count);
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
     * 设置该game实例的FPS。一个页面上可以同时存在多个不同FPS的game实例
     * @method setFPS
     * @param {Number} fps 最大60
     * @chainable
     */
    this.setFPS = function(fps){
        currFPS = parseInt(fps) || maxFPS;
        currFPS = currFPS>maxFPS?maxFPS:currFPS;
        threshold = 1000 / currFPS;

        return this;
    };
	/**
	 * 停止当前游戏实例
     * @method stop
     * @chainable
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
     * 销毁当前游戏实例，以及内部所有对象。
     * 会调用模块的onDestroy回调
     * @method destroy
     */
    this.destroy = function(){
        if(this.running)this.stop();

        var modules = soya2d.module._getAll();
        for(var k in modules){
            if(modules[k].onDestroy)modules[k].onDestroy(this);
        }
        this.renderer.destroy();
        this.stage.destroy();
        var i = soya2d.games.indexOf(this);
        if(i>-1){
            soya2d.games.splice(i,1);
        }
    }

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
    this.objects.register('button',soya2d.Button);

    var t1 = 'soya2d Game instance created...';
    var t2 = ms + ' plugins loaded...';
    soya2d.console.info(t1);
    soya2d.console.info(t2);
    
    soya2d.games.push(this);
};
/**
 * 游戏实例列表，保存当前域所有的game实例
 * @property games
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
 * @property RENDERER_TYPE_AUTO
 * @private
 */
soya2d.RENDERER_TYPE_AUTO = 1;
/**
 * 渲染器类型,canvas。
 * 引擎会使用canvas 2d方式进行渲染
 * @property RENDERER_TYPE_CANVAS
 * @private
 */
soya2d.RENDERER_TYPE_CANVAS = 2;
/**
 * 渲染器类型,webgl
 * 引擎会使用webgl方式进行渲染
 * @property RENDERER_TYPE_WEBGL
 * @private
 */
soya2d.RENDERER_TYPE_WEBGL = 3;