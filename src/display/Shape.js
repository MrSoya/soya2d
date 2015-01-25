/**
 * @classdesc 空绘图类，需要实现onRender回调
 * @class
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Shape = function(data){
    data = data||{};
    soya2d.DisplayObjectContainer.call(this,data);
    soya2d.ext(this,data);
};
soya2d.inherits(soya2d.Shape,soya2d.DisplayObjectContainer);