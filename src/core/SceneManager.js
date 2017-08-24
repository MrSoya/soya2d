/**
 *  场景管理器，提供场景注册和切换等。每个game实例都有且只有一个场景管理器game.scene。
 *  <br/>该类不能被实例化
 *  @class SceneManager
 */
function SceneManager(game) {
    this.map = {};
    this.game = game;
}

SceneManager.prototype = {
    /**
     * 启动场景
     * @method start
     * @param  {String | Object} scene   场景对象，或者注册名称。
     * @param  {Boolean} clearWorld 是否清空world
     * @chainable
     */
    start:function(scene,clearWorld){
        var that = this;
        var game = this.game;

        if(typeof(scene) === 'string'){
            scene = this.map[scene];
        }else{
            scene = new Scene(scene,game);
        }
        
        game.currentScene = scene;
        if(clearWorld){
            //clear world
            game.world.clear(true);
            game.world.events.clear();
            game.camera.reset();
        }
        if(scene.onPreload){
            scene.onPreload(game);
            game.load.once('end',function(){
                //初始化场景
                if(game.currentScene.onInit){
                    setTimeout(function(){
                        game.currentScene.onInit(game);
                    },0);
                }
            });
            game.load.start();
        }else 
        //初始化场景
        if(scene.onInit){
            scene.onInit(game);
        }

        var modules = soya2d.module._getAll();
        for(var k in modules){
            if(modules[k].onSceneChange)modules[k].onSceneChange(game,scene);
        }

        return this;
    },
    /**
     * 添加一个场景，系统自动把描述对象转换成{{#crossLink "Scene"}}{{/crossLink}}实例
     * @method add
     * @param {String} key 
     * @param {Object} scene 带有回调函数的对象，注意并不是{{#crossLink "Scene"}}{{/crossLink}}实例
     */
    add:function(key,scene){
        this.map[key] = new Scene(scene,game);
        return this.map[key];
    }
}