/**
 * @classdesc 资源加载场景合并了资源加载和进度显示功能。
 * 提供了默认的加载进度效果。如果需要自定义加载效果，请重写onStart和onProgress函数
 * @class 
 * @extends soya2d.Scene
 * @param {Object} data 所有父类参数，以及新增参数，如下：
 * @param {soya2d.Scene} data.nextScene 加载完成后需要跳转的场景
 * @param {Array} data.textures 需要加载的纹理数组
 * @param {Array} data.texAtlas 需要加载的纹理集数组
 * @param {Array} data.sounds 需要加载的声音数组
 * @param {Array} data.scripts 需要加载的脚本数组
 * @param {Array} data.fonts 需要加载的字体数组
 * @param {function} data.onStart 开始加载回调,回调参数[game,length]
 * @param {function} data.onProgress 加载时回调,回调参数[game,length,index]
 * @param {function} data.onEnd 加载结束时回调,回调参数[game,length]
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.LoaderScene = function(data){
    data = data||{};
    soya2d.Scene.call(this,data);
    soya2d.ext(this,data);
    
    this.nextScene = data.nextScene;
    if(!(this.nextScene instanceof soya2d.Scene)){
        console.error('soya2d.LoaderScene: invalid param [nextScene], it must be a instance of soya2d.Scene');
    }
    this.textures = data.textures||[];
    this.texAtlas = data.texAtlas||[];
    this.sounds = data.sounds||[];
    this.scripts = data.scripts||[];
    this.fonts = data.fonts||[];

    var startCbk = data.onStart;
    var progressCbk = data.onProgress;
    var endCbk = data.onEnd;
    
    this.onInit = function(game){
        //初始化时启动
        var index = 0;
        //资源总数
        var allSize = this.textures.length +this.texAtlas.length +this.sounds.length +this.scripts.length +this.fonts.length;
        if(allSize<1){
            soya2d.console.warn('empty resources be loaded...');
            game.cutTo(this.nextScene);
            return;
        }
    
        if(this.onStart)this.onStart(game,allSize);
        if(startCbk instanceof Function)startCbk.call(this,game,allSize);            
        
        var loader = this;
        game.loadRes({
            textures: this.textures,
            texAtlas:this.texAtlas,
            sounds: this.sounds,
            fonts: this.fonts,
            scripts: this.scripts,
            onLoad: function() {
                if(loader.onProgress)loader.onProgress(game,allSize,++index);
                if(progressCbk instanceof Function)progressCbk.call(loader,game,allSize,index);
            },
            onEnd: function() {
                if(loader.onEnd)loader.onEnd(game,allSize);
                if(endCbk instanceof Function)endCbk.call(loader,game,allSize);

                game.cutTo(loader.nextScene);
            }
        });
        
    };


    /**
     * 资源开始加载时调用
     * 如果需要修改加载样式，请重写该函数
     * @abstract
     * @param  {soya2d.Game} game  游戏实例
     * @param  {int} length 资源总数
     */
    this.onStart = function(game,length) {
        var logo = new soya2d.Shape({
            x: game.w/2 - 11,
            y: game.h/2 - 30 - 20
        });
        var p1 = new soya2d.Rect({
            w:23,h:20,
            skewY:-30,
            fillStyle:'#69CA14'
        });
        var p2 = new soya2d.Rect({
            w:23,h:20,
            skewY:30,
            y:13,
            opacity:.9,
            fillStyle:'#2A5909'
        });
        var p3 = new soya2d.Rect({
            w:23,h:20,
            skewY:-30,
            y:28,
            blendMode:soya2d.BLEND_LIGHTER,
            fillStyle:'#69CA14'
        });
        logo.add(p1,p2,p3);
        this.add(logo);

        var font = new soya2d.Font('normal 400 23px/normal Arial,Helvetica,sans-serif');
        this.tip = new soya2d.Text({
            x: logo.x - 70,
            y: logo.y + 60 + 10,
            font:font,
            text:'Loading... 0/0',
            w:200,
            fillStyle: this.fillStyle || '#fff'
        });
        this.add(this.tip);
    };
    /**
     * 资源加载时调用,默认显示loading...字符。如果需要修改加载样式，请重写该函数
     * @abstract
     * @param  {soya2d.Game} game  游戏实例
     * @param  {int} length 资源总数
     * @param  {int} index  当前加载索引
     */
    this.onProgress = function(game,length,index) {
        if(this.tip)
        this.tip.setText('Loading... '+index+'/'+length);
    };
    /**
     * 资源结束加载时调用
     * 如果需要修改加载样式，请重写该函数
     * @abstract
     * @param  {soya2d.Game} game  游戏实例
     * @param  {int} length 资源总数
     */
    this.onEnd = function(game,length) {};
};
soya2d.inherits(soya2d.LoaderScene,soya2d.Scene);