/**
 * 资源类提供了用于获取指定类型资源的服务。这是一个内部类，无法在外部实例化。
 * 每个game有且只有一个assets属性，通过该属性可以获取资源。
 * ```
 *     game.assets.sound('bgm').play();
 * ```
 * @class Assets
 * 
 */
function Assets(){
    this.__assets = {
        image:{},
        sound:{},
        imageFont:{},
        atlas:{},
        text:{},
        xml:{},
        json:{}
    };
};
Assets.prototype = {
    /**
     * 获取一个图像资源
     * @method image
     * @param  {String} key 加载资源时指定的key
     * @return {HTMLImageElement}  
     */
    image:function(key){
        return this.__assets.image[key];
    },
    /**
     * 获取一个声音资源。
     * 如果没有装载声音模块，该方法永远不会返回有效值
     * @method sound
     * @param  {String} key 加载资源时指定的key
     * @return {soya2d.Sound}  
     */
    sound:function(key){
        return this.__assets.sound[key];
    },
    /**
     * 获取一个图像文字资源
     * @method imageFont
     * @param  {String} key 加载资源时指定的key
     * @return {soya2d.ImageFont}  
     */
    imageFont:function(key){
        return this.__assets.imageFont[key];
    },
    /**
     * 获取一个图像集资源
     * @method atlas
     * @param  {String} key 加载资源时指定的key
     * @return {soya2d.Atlas}  
     */
    atlas:function(key){
        return this.__assets.atlas[key];
    },
    /**
     * 获取一个文本资源
     * @method text
     * @param  {String} key 加载资源时指定的key
     * @return {String}  
     */
    text:function(key){
        return this.__assets.text[key];
    },
    /**
     * 获取一个xml资源
     * @method xml
     * @param  {String} key 加载资源时指定的key
     * @return {Document}  
     */
    xml:function(key){
        return this.__assets.xml[key];
    },
    /**
     * 获取一个json资源
     * @method json
     * @param  {String} key 加载资源时指定的key
     * @return {Object}  
     */
    json:function(key){
        return this.__assets.json[key];
    }
}
