soya2d.module.install('tween',{
	onInit:function(game){
        /**
         * 补间管理器
         * @type {soya2d.TweenManager}
         * @memberOf! soya2d.Game#
         * @alias tween
         * @requires tween
         */
        game.tween = soya2d.TweenManager;
    },
    onUpdate:function(game,now,d){
    	soya2d.TweenManager.__update(now,d);
    },
    onStop:function(){
    	soya2d.TweenManager.stop();
    }
});