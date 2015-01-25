/**
 * 创建一个纹理管理器对象
 * @classdesc 纹理集管理器用来管理所绑定game实例中的所有纹理集，用于获取，创建，删除纹理集。<br/>
 * 该类无需显式创建，引擎会自动绑定到game实例属性中。
 * @extends soya2d.ResourceManager
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.TextureAtlasManager = function(){
    //继承
    soya2d.ResourceManager.call(this);

    this._add = function(tag,res){
        this.urlMap[tag] = res;
    };
};
soya2d.inherits(soya2d.TextureAtlasManager,soya2d.ResourceManager);