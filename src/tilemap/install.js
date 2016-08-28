
soya2d.module.install('tilemap',{
    onInit:function(game){
        /**
         * 瓦片地图管理器
         * @property tilemap
         * @type {TilemapManager}
         * @for soya2d.Game
         * @requires tilemap
         */
        game.tilemap = new TilemapManager(game);
    }
});