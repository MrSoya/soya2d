soya2d.module.install('tween',{
    onUpdate:function(game,now,d){
    	soya2d.TweenManager.update(now,d);
    },
    onStop:function(){
    	soya2d.TweenManager.stop();
    }
});