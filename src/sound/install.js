
soya2d.module.install('sound',{
    onInit:function(game){
        /**
         * 声音管理器
         * @property sound
         * @type {soya2d.SoundManager}
         * @for soya2d.Game
         * @requires sound
         */
        game.sound = new soya2d.SoundManager(game);
    },
    onStop:function(game){
        game.sound.stopAll();
    }
});