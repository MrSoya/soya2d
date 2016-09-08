soya2d.module.install('tween',{
	onInit:function(game){
        /**
         * 补间管理器
         * @property tween
         * @type {soya2d.TweenManager}
         * @for soya2d.Game
         * @requires tween
         */
        game.tween = soya2d.TweenManager;
    },
    onBeforeUpdate:function(game,now,d){
    	soya2d.TweenManager.__update(now,d);
    },
    onStop:function(){
    	soya2d.TweenManager.pauseAll();
    }
});