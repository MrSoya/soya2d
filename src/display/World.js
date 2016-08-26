/**
 * World保存了当前所有的活动对象，同时也为这些对象提供物理环境。
 * 每个game实例只有唯一的world对象
 * 
 * @class World
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 */
var World = soya2d.class("",{
    extends:soya2d.DisplayObjectContainer,
    constructor:function() {
    	this.__soya_type = 'world';
    },
    setBounds:function(w,h){
    	this.bounds.w = w;
    	this.bounds.h = h;
    	this.w = w;
    	this.h = h;
    }
});
