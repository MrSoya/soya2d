/**
 * 按钮类
 * @class soya2d.Button
 * @extends soya2d.Sprite
 * @param {Object} data 所有父类参数
 * @param {Object} [data.frameMap] 不同状态的帧映射
 * @param {int} [data.frameMap.over] 悬浮状态，只有鼠标
 * @param {int} [data.frameMap.out] 离开状态，只有鼠标
 * @param {int} [data.frameMap.down] 按下状态
 * @param {int} [data.frameMap.up] 抬起状态。此状态和默认状态相同
 * @param {Function} [data.action] 当按钮被点击时执行
 */
soya2d.class("soya2d.Button",{
	extends:soya2d.Sprite,
	constructor:function(data){
		if(data.action)
			this.events.onPointerTap(data.action);
		var map = data.frameMap || {};
		var that = this;
		if(map.over != undefined){
			this.events.onPointerOver(function(){
				this.frameIndex = map.over;
			});
		}
		if(map.out != undefined){
			this.events.onPointerOut(function(){
				this.frameIndex = map.out;
			});
		}
		if(map.down != undefined){
			this.events.onPointerDown(function(){
				this.frameIndex = map.down;
			});
		}
		if(map.up != undefined){
			this.game.stage.events.onPointerUp(function(){
				that.frameIndex = map.up;
			});
		}

		this.frameIndex = map.up || 0;
	}
});