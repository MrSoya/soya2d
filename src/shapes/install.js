
soya2d.module.install('shapes',{
    onInit:function(game){
        game.objects.register('rect',soya2d.Rect);
        game.objects.register('poly',soya2d.Poly);
        game.objects.register('rpoly',soya2d.RPoly);
        game.objects.register('arc',soya2d.Arc);
        game.objects.register('earc',soya2d.EArc);
        game.objects.register('ellipse',soya2d.Ellipse);
    }
});