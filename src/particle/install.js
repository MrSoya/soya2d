soya2d.module.install('particle',{
    onUpdate:function(game,now,d){
    	soya2d.ParticleManager.update(now);
    },
    onStop:function(){
    	soya2d.ParticleManager.stop();
    }
});