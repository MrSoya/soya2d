/**
 * World是逻辑上所有显示对象的容器，并为这些对象提供物理环境。
 * world是stage下的直接子节点，所以并不会受到{{#crossLink "Camera"}}{{/crossLink}}的影响，
 * 而world中的显示对象都会受到{{#crossLink "Camera"}}{{/crossLink}}的影响。
 * 这样就可以实现镜头跟踪，相对移动等效果。<br>
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
    /**
     * 设置世界范围
     * @method setBounds
     * @param {Number} w 宽度
     * @param {Number} h 高度
     */
    setBounds:function(w,h){
    	this.bounds.w = w;
    	this.bounds.h = h;
    	this.w = w;
    	this.h = h;
    }
});
