/**
 *  瓦片地图管理器
 */
function TilemapManager(game) {
    this.map = {};
    this.game = game;
}

TilemapManager.prototype = {
    get:function(key){
        return this.map[key];
    },
    /**
     * 创建一个tilemap实例。创建tilemap，需要满足参数中data的要求。
     * 这些参数可以通过tile制作工具或其他方式获取。
     * @param {String} key  唯一的key
     * @param {Object} data  tilemap参数
     * @param {Object} data.tilewidth   瓦片宽度
     * @param {Object} data.tileheight   瓦片高度
     * @param {Object} data.rows   总行数
     * @param {Object} data.columns   总列数
     * @param {Object} data.tilesets   图块集 {key:{sid:1}}
     * @param {Object} data.layers   图层集 {key:{data:[]}}
     */
    add:function(key,data){
        data.game = this.game;
        this.map[key] = new Tilemap(data);

        return this.map[key];
    }
}