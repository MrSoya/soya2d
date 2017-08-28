
var globalEventSignal = new Signal();

/**
 * 事件模块包括输入设备状态(Input)和设备事件(Events)两部分。
 * @module event
 */

/**
 * 显示对象事件接口，用来注册输入设备产生的事件监听<br/>
 * 该类会在创建一个显示对象时自动实例化为对象的events属性。
 * 添加一个事件监听的代码如下
 * ```
 * sp.events.onPointerDown(function(pointer,e){
 *     ...
 * });
 * ```
 * 
 * @class Events
 */
function Events(displayObject){
    this.obj = displayObject;

    /**
     * 是否禁止监听
     * @property disabled
     * @default false
     * @type {Boolean}
     */
    this.disabled = false;

    /**
     * 清除显示对象的所有监听
     * @method clear
     */
    this.clear = function(){
        this.obj.game.__pointerSignal.off(null,null,this.obj);
        globalEventSignal.off(null,null,this.obj);
    }
    
    //-------------------pointer
    /**
     * 指针按下事件
     * @method onPointerDown
     * @param  {Function} cbk 
     */
    this.onPointerDown = function(cbk){
        this.obj.game.__pointerSignal.on('pointerdown',cbk,this.obj);
    }
    /**
     * 指针单击事件
     * @method onPointerTap
     * @param  {Function} cbk 
     */
    this.onPointerTap = function(cbk){
        this.obj.game.__pointerSignal.on('pointertap',cbk,this.obj);
    }
    /**
     * 指针双击事件
     * @method onPointerDblTap
     * @param  {Function} cbk 
     */
    this.onPointerDblTap = function(cbk){
        this.obj.game.__pointerSignal.on('pointerdbltap',cbk,this.obj);
    }
    /**
     * 指针弹起事件
     * @method onPointerUp
     * @param  {Function} cbk 
     */
    this.onPointerUp = function(cbk){
        this.obj.game.__pointerSignal.on('pointerup',cbk,this.obj);
    }
    /**
     * 指针移动事件
     * @method onPointerMove
     * @param  {Function} cbk 
     */
    this.onPointerMove = function(cbk){
        this.obj.game.__pointerSignal.on('pointermove',cbk,this.obj);
    }
    /**
     * 指针悬浮事件
     * @method onPointerOver
     * @param  {Function} cbk 
     */
    this.onPointerOver = function(cbk){
        this.obj.game.__pointerSignal.on('pointerover',cbk,this.obj);
    }
    /**
     * 指针离开事件
     * @method onPointerOut
     * @param  {Function} cbk 
     */
    this.onPointerOut = function(cbk){
        this.obj.game.__pointerSignal.on('pointerout',cbk,this.obj);
    }
    /**
     * 指针取消事件。拾取焦点，或来电打断都会触发此事件
     * @method onPointerCancel
     * @param  {Function} cbk 
     */
    this.onPointerCancel = function(cbk){
        this.obj.game.__pointerSignal.on('pointercancel',cbk,this.obj);
    }
    /**
     * 指针进入舞台
     * @method onEnterStage
     * @param  {Function} cbk 
     */
    this.onEnterStage = function(cbk){
        this.obj.game.__pointerSignal.on('enterstage',cbk,this.obj);
    }
    /**
     * 指针离开舞台
     * @method onLeaveStage
     * @param  {Function} cbk 
     */
    this.onLeaveStage = function(cbk){
        this.obj.game.__pointerSignal.on('leavestage',cbk,this.obj);
    }

    //-------------------physics
    /**
     * 显示对象碰撞开始
     * @method onCollisionStart
     * @param  {Function} cbk 
     */
    this.onCollisionStart = function(cbk){
        this.obj.game.__pointerSignal.on('collisionstart',cbk,this.obj);
    }
    /**
     * 显示对象碰撞结束
     * @method onCollisionEnd
     * @param  {Function} cbk 
     */
    this.onCollisionEnd = function(cbk){
        this.obj.game.__pointerSignal.on('collisionend',cbk,this.obj);
    }


    //-------------------keyboard
    /**
     * 按键按下事件。此事件只在按下时触发一次，长按不会多次触发
     * @method onKeyDown
     * @param  {Function} cbk 
     */
    this.onKeyDown = function(cbk){
        globalEventSignal.on('keydown',cbk,this.obj);
    }
    /**
     * 键盘长按事件
     * @method onKeyPress
     * @param  {Function} cbk 
     */
    this.onKeyPress = function(cbk){
        globalEventSignal.on('keypress',cbk,this.obj);
    }
    /**
     * 按键抬起
     * @method onKeyUp
     * @param  {Function} cbk 
     */
    this.onKeyUp = function(cbk){
        globalEventSignal.on('keyup',cbk,this.obj);
    }

    //-------------------device
    /**
     * 设备发生水平/垂直方向变动时触发
     * @method onDeviceHov
     * @param  {Function} cbk 
     */
    this.onDeviceHov = function(cbk){
        globalEventSignal.on('hov',cbk,this.obj);
    }
    /**
     * 设备倾斜时触发
     * @method onDeviceTilt
     * @param  {Function} cbk 
     */
    this.onDeviceTilt = function(cbk){
        globalEventSignal.on('tilt',cbk,this.obj);
    }
    /**
     * 设备晃动时触发
     * @method onDeviceMotion
     * @param  {Function} cbk 
     */
    this.onDeviceMotion = function(cbk){
        globalEventSignal.on('motion',cbk,this.obj);
    }
}


/**
 * 输入设备状态接口。使用该接口可以获取当前帧的设备输入状态，而无需通过注册一个事件监听器<br/>
 * 如果某些场景需要每帧都获取设备输入状态，比如指针坐标的时候，就可以像这样来实时获取
 * ```
 * ...
 * onUpdate:function(game){
 *     game.input.pointer.position;
 * }
 * ...
 * ```
 * soya2d支持三种类型的输入状态查询：
 * <ul>
 *     <li>
 *         <b>pointer: </b>指针状态；包括鼠标、触摸等
 *     </li>
 *     <li>
 *         <b>keyboard: </b>键盘状态
 *     </li>
 *     <li>
 *         <b>device: </b>设备状态；包括倾斜角度、水平方向等
 *     </li>
 * </ul>
 * @class Input
 */

/**
 * 存放指针(鼠标/触摸/其他设备)信息
 * @property pointer
 * @type {Object}
 * @for Input
 */
/**
 * 指针坐标。<br>
 * 在未产生指针事件之前，该属性值为空<br>
 * 在没有继续产生指针事件时，该属性保持最近一次的值
 * @property position
 * @type {soya2d.Point}
 * @for Input.pointer
 */
/**
 * 指针是否按下
 * @property isDown
 * @type {Boolean}
 * @for Input.pointer
 */
/**
 * 指针是否抬起
 * @property isUp
 * @type {Boolean}
 * @for Input.pointer
 */
/**
 * 指针是否长按
 * @property isPressing
 * @type {Boolean}
 * @for Input.pointer
 */
/**
 * 指针按下直到抬起的时长。单位：ms
 * @property duration
 * @type {int}
 * @for Input.pointer
 */
/**
 * 指针是否移动
 * @property isMove
 * @type {Boolean}
 * @for Input.pointer
 */
/**
 * 保存了触摸点列表。只对多点触摸有效
 * @property touches
 * @type {Array<soya2d.Point>}
 * @for Input.pointer
 */
/**
 * 强制改变指针的类型是鼠标还是触摸
 * @method changeType
 * @param {String} type mouse/touch
 * @for Input.pointer
 */
/**
 * DOM事件
 * @property e
 * @type {DOMEvent}
 * @for Input.pointer
 */


/**
 * 存放按键信息
 * @property keyboard
 * @type {Object}
 * @for Input
 */
/**
 * 按键是否按下
 * @property isDown
 * @type {Boolean}
 * @for Input.keyboard
 */
/**
 * 按键是否抬起
 * @property isUp
 * @type {Boolean}
 * @for Input.keyboard
 */
/**
 * 按键是否长按
 * @property isPressing
 * @type {Boolean}
 * @for Input.keyboard
 */
/**
 * shift键是同时触发
 * @property shiftKey
 * @type {Boolean}
 * @for Input.keyboard
 */
/**
 * meta键是同时触发
 * @property metaKey
 * @type {Boolean}
 * @for Input.keyboard
 */
/**
 * ctrl键是同时触发
 * @property ctrlKey
 * @type {Boolean}
 * @for Input.keyboard
 */
/**
 * alt键是同时触发
 * @property altKey
 * @type {Boolean}
 * @for Input.keyboard
 */
/**
 * 当前按下的所有键码列表
 * @property keys
 * @type {Boolean}
 * @for Input.keyboard
 */
/**
 * DOM事件
 * @property e
 * @type {DOMEvent}
 * @for Input.keyboard
 */



/**
 * 存放设备信息
 * @property device
 * @type {Object}
 * @for Input
 */
/**
 * 当前设备方向 landscape / portrait
 * @property orientation
 * @type {Boolean}
 * @for Input.device
 */
/**
 * 当前设备倾斜角度
 * @property tilt
 * @type {Boolean}
 * @for Input.device
 */
/**
 * 当前设备运动数据
 * @property motion
 * @type {Boolean}
 * @for Input.device
 */