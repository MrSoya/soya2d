/**
 * 显示对象工厂保存了显示对象的别名，简化了创建soya2d中所有可显示对象的工作，并且会自动加入game.world中.
 * 该类提供了用于注册自定义显示对象到快捷列表中的方法，这样可以在使用XML构建UI时，使用自定义标签
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
	/**
	 * 注册一个别称到显示对象工厂中。注册后，可以在XML中使用别称，以及使用快速创建接口，如下
	 * ```
 	*     game.add.alias({...});
 	* ```
 	* ```html
 	* <alias></alias>
 	* ```
 	* @method register
	 * @param  {String} alias  别名
	 * @param  {Function} constructor 构造函数
	 */
    register:function(alias,constructor){
        this.map[alias] = constructor;
        this.game.add[alias] = function(data){
            return this.__newInstance(alias,data);
        }
    }
};