/**
 * 显示对象工厂代理提供用于从显示对象工厂中获取指定类型实例，并自动插入world中。
 * 工厂提供了一种代理服务，能够从别名中识别出对应的构造函数
 * @class DisplayObjectFactoryProxy
 */
function DisplayObjectFactoryProxy(game){
    this.game = game;

    this.__newInstance = function(type,data){
    	data.game = this.game;
    	var instance = new this.game.objects.map[type](data);
    	// instance.game = this.game;
    	this.game.world.add(instance);
    	return instance;
    }
}