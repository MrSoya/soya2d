/**
 * 显示对象工厂提供了一种代理服务，简化了创建soya2d中所有可显示对象的工作，并且会自动加入game.world中.
 * 同时，该类提供了用于注册自定义显示对象到快捷列表中的方法，这样可以在使用XML构建UI时，使用自定义标签
 * ```
 *     game.objects.register('rect',soya2d.Rect);
 * ```
 * <rect></rect>
 * 
 * @class DisplayObjectFactory
 */
function DisplayObjectFactory(game){
    this.map = {};
    this.game = game;
}

DisplayObjectFactory.prototype = {
    register:function(type,constructor){
        this.map[type] = constructor;
        this.game.add[type] = function(data){
            return this.__newInstance(type,data);
        }
    }
};