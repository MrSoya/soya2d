/**
 * 创建一个纹理管理器对象
 * @classdesc 纹理管理器用来管理所绑定game实例中的所有纹理，用于获取，创建，删除纹理。<br/>
 * 该类无需显式创建，引擎会自动绑定到game实例属性中。
 * @extends soya2d.ResourceManager
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.TextureManager = function(){
    //继承
    soya2d.ResourceManager.call(this);

    //添加纹理到管理器，用于loader
    this._add = function(src,res){
        this.urlMap[src] = res;
    };
};
soya2d.inherits(soya2d.TextureManager,soya2d.ResourceManager);