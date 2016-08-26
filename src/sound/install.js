
soya2d.module.install('sound',{
    onInit:function(game){
        /**
         * 声音管理器
         * @type {soya2d.SoundManager}
         * @memberOf! soya2d.Game#
         * @alias sound
         * @requires sound
         */
        game.sound = new soya2d.SoundManager(game);
    },
    onStop:function(game){
        game.sound.stopAll();
    }
});