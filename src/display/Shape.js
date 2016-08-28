/**
 * 空绘图类，需要实现onRender回调。如果需要创建一种自定义绘图逻辑的显示对象，
 * 该类可以实现这个功能
 * @class soya2d.Shape
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 */
soya2d.class("soya2d.Shape",{
	extends:soya2d.DisplayObjectContainer
});