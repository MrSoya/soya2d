/**
 * 显示对象工厂代理提供用于从显示对象工厂中获取指定类型实例，并自动插入world中
 * @class 
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