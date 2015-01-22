soya2d.module.install('particle',{
    onLoop:function(game,d,now){
    	soya2d.ParticleManager.update(now);
    },
    onStop:function(){
    	soya2d.ParticleManager.stop();
    }
});