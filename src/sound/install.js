
soya2d.module.install('sound',{
    onInit:function(game){
        /**
         * 声音管理器
         * @type {soya2d.SoundManager}
         * @memberOf! soya2d.Game#
         * @alias soundManager
         * @requires sound
         */
        game.soundManager = new soya2d.SoundManager();
    },
    onStop:function(game){
        game.soundManager.stopAll();
    }
});