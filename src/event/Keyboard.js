/**
 * @classdesc 键盘事件处理类,提供如下事件:<br/>
 * <ul>
 *     <li>keyup</li>
 *     <li>keydown</li>
 *     <li>keypress</li>
 * </ul>
 * 所有事件的唯一回调参数为键盘事件对象KeyboardEvent
 * @class 
 * @extends soya2d.EventHandler
 * @author {@link http://weibo.com/soya2d soya哥}
 */
soya2d.Keyboard = function(){

	var keys = [];//当前按下的所有按键，keycode

	var downEvent = {};
	var upEvent = {};
	var fireDown = false;
	var fireUp = false;
	var firePress = false;

	function setEvent(event,e){
		event.keyCode = e.keyCode||e.which;
		event.ctrlKey = e.ctrlKey;
		event.shiftKey = e.shiftKey;
		event.altKey = e.altKey;
		event.metaKey = e.metaKey;
		event.keyCodes = keys;
		event.e = e;
	}

	var keyboard = this;
	function keydown(e){
		var keycode = e.keyCode||e.which;
		if(keys.indexOf(keycode)<0){
			keys.push(keycode);
		}

		fireDown = true;
		setEvent(downEvent,e);
		firePress = true;
	}
	function keyup(e){
		var keycode = e.keyCode||e.which;
		var i = keys.indexOf(keycode);
		if(i>-1){
			fireDown = false;
			keys.splice(i,1);
		}

		fireUp = true;
		setEvent(upEvent,e);

		//没有按键
		if(keys.length<1){
			firePress = false;
		}
	}

	/**
	 * 扫描是否需要执行键盘事件，如果需要，执行
	 * @return this
	 */
	this.scan = function(){
		var events,ev;
		if(fireDown){
			events = this.__eventMap['keydown'];
			ev = downEvent;
			fireEvent(events,ev);
		}
		if(firePress){
			events = this.__eventMap['keypress'];
			ev = downEvent;
			fireEvent(events,ev);
		}
		if(fireUp){
			events = this.__eventMap['keyup'];
			ev = upEvent;
			fireEvent(events,ev);

			fireUp = false;
		}
	}

	function fireEvent(events,ev){
		if(!events)return;

		//排序
        events.sort(function(a,b){
            return a.order - b.order;
        });

        for(var i=events.length;i--;){
            events[i].fn.call(events[i].context,ev);
        }
	}

	/**
	 * 启动监听
	 * @return this
	 */
	this.startListen = function(){
		self.addEventListener('keydown',keydown,false);
		self.addEventListener('keyup',keyup,false);

		return this;
	}

	/**
	 * 停止监听
	 * @return this
	 */
	this.stopListen = function(){
		self.removeEventListener('keydown',keydown,false);
		self.removeEventListener('keyup',keyup,false);

		return this;
	}

	soya2d.EventHandler.call(this);
};
soya2d.inherits(soya2d.Keyboard,soya2d.EventHandler);
/**
 * 键盘事件对象，包含按键相关属性
 * @typedef {Object} KeyboardEvent
 * @property {int} keyCode - 键码值，用来和KeyCode类中的键码值进行比较
 * @property {boolean} ctrlKey - 是否按下了ctrl键
 * @property {boolean} shiftKey - 是否按下了shift键
 * @property {boolean} altKey - 是否按下了shift键
 * @property {boolean} metaKey - 是否按下了shift键
 * @property {boolean} keyCodes - 键码值数组，包含当前按下的所有按键
 * @property {Object} e - HTML事件对象
 */