/**
 * 事件监听器。用来监听输入设备产生的原生事件。
 * 在每帧渲染前，如果有事件发生，监听器会更新对应类型的输入设备参数
 */
function InputListener(data) {
	this.eventMap = {};

	soya2d.ext(this,data);
};
InputListener.prototype = {
	/**
	 * 保存事件。类型相同覆盖
	 * @param  {String} type 事件名
	 * @param  {Object} e 事件对象
	 */
	setEvent:function(type,e){
		this.eventMap[type] = e;
	},
	/**
	 * 每帧调用
	 */
    clear:function(){
    	for(var k in this.eventMap){
    		this.eventMap[k] = null;
    	}
    	this.eventMap = {};
    },
    start:function(game){
    	this.onInit(game);
    },
    scan:function(game){
    	this.onScan(game);
    }
};
