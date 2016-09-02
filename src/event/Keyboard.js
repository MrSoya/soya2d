/**
 * 键盘事件处理类,提供如下事件:<br/>
 * <ul>
 *     <li>keyup</li>
 *     <li>keydown</li>
 *     <li>keypress</li>
 * </ul>
 * @class soya2d.Keyboard
 */
soya2d.Keyboard = function(){

	var keys = [];//当前按下的所有按键，keycode

	var downEvent = {};
	var upEvent = {};
	var fireDown = false;
	var fireUp = false;
	var firePress = false;

	var eventMap = soya2d.DisplayObject.prototype.__signalHandler.map;

	function setEvent(event,e){
		event.keyCode = e.keyCode||e.which;
		event.ctrlKey = e.ctrlKey;
		event.shiftKey = e.shiftKey;
		event.altKey = e.altKey;
		event.metaKey = e.metaKey;
		event.keyCodes = keys;
		event.e = e;
		event.containsAll = function(){
			for(var i=0;i<arguments.length;i++){
	            var kc = arguments[i];

	            if(this.keyCodes.length>0){
	            	if(this.keyCodes.indexOf(kc) < 0)return false;
	            }else{
	            	if(this.keyCode != kc)return false;
	            }
	        }
	        return true;
		}
		event.contains = function(){
			for(var i=0;i<arguments.length;i++){
	            var kc = arguments[i];

	            if(this.keyCodes.length>0){
	            	if(this.keyCodes.indexOf(kc) > -1)return true;
	            }else{
	            	if(this.keyCode === kc)return true;
	            }

	        }
	        return false;	
		}
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

		stopCheck(e,keycode);
	}
	function keyup(e){
		var keycode = e.keyCode||e.which;
		var i = keys.indexOf(keycode);
		if(i>-1){
			keys.splice(i,1);
		}

		fireUp = true;
		setEvent(upEvent,e);

		//没有按键
		if(keys.length<1){
			firePress = false;
		}

		stopCheck(e,keycode);
	}
	function blur(){
		fireDown = fireUp = firePress = false;
		keys = [];
	}
	function stopCheck(e,keycode) {
		var pks = soya2d.Keyboard.preventKeys;
		if(pks.indexOf(keycode) > -1){
			if (e.preventDefault) { 
				e.preventDefault(); 
			} else { 
				e.returnValue = false; 
			}
		}
		var sks = soya2d.Keyboard.stopKeys;
		if(sks.indexOf(keycode) > -1){
			if (e.stopPropagation) {
				e.stopPropagation(); 
			} else { 
				e.cancelBubble = true; 
			}
		}
	}

	/**
	 * 扫描是否需要执行键盘事件，如果需要，执行
	 * @return this
	 */
	this.scan = function(){
		var events,ev;
		if(fireDown){
			events = eventMap['keydown'];
			ev = downEvent;
			fireEvent(events,ev,'keydown');

			fireDown = false;
		}
		if(firePress){
			events = eventMap['keypress'];
			ev = downEvent;
			fireEvent(events,ev,'keypress');
		}
		if(fireUp){
			events = eventMap['keyup'];
			ev = upEvent;
			fireEvent(events,ev,'keyup');

			fireUp = false;
		}
	}

	function fireEvent(events,ev,evtype){
		if(!events)return;

		//排序
        events.sort(function(a,b){
            return b[2] - a[2];
        });

        var onceEvents = [];
        for(var i=events.length;i--;){
            events[i][0].call(events[i][1],ev);
            if(events[i][3]){
                onceEvents.push(events[i]);
            }
        }
        for(var i=onceEvents.length;i--;){
            onceEvents[i][1].off(evtype,onceEvents[i][0]);
        }
	}

	/**
	 * 启动监听
	 * @chainable
	 */
	this.startListen = function(){
		self.addEventListener('keydown',keydown,false);
		self.addEventListener('keyup',keyup,false);
		self.addEventListener('blur',blur,false);

		return this;
	}

	/**
	 * 停止监听
	 * @chainable
	 */
	this.stopListen = function(){
		self.removeEventListener('keydown',keydown,false);
		self.removeEventListener('keyup',keyup,false);
		self.removeEventListener('blur',blur,false);

		return this;
	}

};

/**
 * 阻止按键默认行为的按键码数组，当键盘事件发生时，会检测该数组，
 * 如果数组包含当前按键码，就会阻止默认行为
 * @property soya2d.Keyboard
 * @type {Array}
 * @default []
 */
soya2d.Keyboard.preventKeys = [];
/**
 * 阻止事件传播的按键码数组，当键盘事件发生时，会检测该数组，
 * 如果数组包含当前按键码，就会阻止事件继续传播
 * @property soya2d.Keyboard
 * @type {Array}
 * @default []
 */
soya2d.Keyboard.stopKeys = [];

/**
 * 键盘事件对象，包含按键相关属性
 * @class soya2d.KeyboardEvent
 * 
 */
/**
 * 键码值，用来和KeyCode类中的键码值进行比较
 * @property keyCode
 * @type {Number}
 * @for soya2d.KeyboardEvent
 */
/**
 * 是否按下了ctrl键
 * @property ctrlKey
 * @type {Boolean}
 * @for soya2d.KeyboardEvent
 */
/**
 * 是否按下了shift键
 * @property shiftKey
 * @type {Boolean}
 * @for soya2d.KeyboardEvent
 */
/**
 * 是否按下了alt键
 * @property altKey
 * @type {Boolean}
 * @for soya2d.KeyboardEvent
 */
/**
 * 是否按下了meta键
 * @property metaKey
 * @type {Boolean}
 * @for soya2d.KeyboardEvent
 */
/**
 * 键码值数组，包含当前按下的所有按键
 * @property keyCodes
 * @type {Array}
 * @for soya2d.KeyboardEvent
 */
/**
 * DOM事件对象
 * @property e
 * @type {Object}
 * @for soya2d.KeyboardEvent
 */

/**
 * 按键抬起
 * @event keyup
 * @for soya2d.DisplayObject
 * @param {soya2d.KeyboardEvent} ev 事件对象
 */
/**
 * 按键按下
 * @event keydown
 * @for soya2d.DisplayObject
 * @param {soya2d.KeyboardEvent} ev 事件对象
 */
/**
 * 键盘持续按住
 * @event keypress
 * @for soya2d.DisplayObject
 * @param {soya2d.KeyboardEvent} ev 事件对象
 */