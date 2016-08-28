/**
 * 移动设备事件处理类,提供如下事件:<br/>
 * <ul>
 *     <li>tilt</li>
 *     <li>motion</li>
 *     <li>hov</li>
 * </ul>
 * @class soya2d.Mobile
 */
soya2d.Mobile = function(){

    var fireMap = {
        tilt:{},
        motion:{},
        hov:{}
    };

    var mobile = this;
    var eventMap = soya2d.DisplayObject.prototype.__signalHandler.map;

    function setEvent(event,e){
        if(e.orientation)
        mobile.orientation = fireMap[event].orientation = e.orientation;
        if(e.alpha)
        mobile.tilt = fireMap[event].tilt = {
        	z: e.alpha,
			x: e.beta,
			y: e.gamma,
			absolute: e.absolute
        };
        if(e.acceleration){
            mobile.motion = fireMap[event].motion = {
                x: e.acceleration.x,
                y: e.acceleration.y,
                z: e.acceleration.z,
                interval: e.interval
            };
        }
        
        fireMap[event].e = e;
        fireMap[event].type = event;
        fireMap[event].fire = true;
    }

    /******************* handler *******************/
    function tilt(e){
        setEvent('tilt',e);
    }
    function motion(e){
        setEvent('motion',e);
    }
    var timer;
    function hov(e){
    	clearTimeout(timer);
        timer = setTimeout(function(){//for view
            e.orientation = getOrientation();
            setEvent('hov',e);
        },510);
    }

    function getOrientation(){
        var w = window.innerWidth;
        var h = window.innerHeight;
        var rs;
        if(w > h){
            rs = 'landscape';
        }else{
            rs = 'portrait';
        }
        return rs;
    }



    /******************* interface *******************/

    /**
     * 扫描是否需要执行键盘事件，如果需要，执行
     * @return this
     */
    this.scan = function(){
        for(var key in fireMap){
            var event = fireMap[key];
            if(!event)continue;
            if(event.fire){
                var events = eventMap[key];
                fireEvent(events,event);
            }
        }

        reset();
    }

    function reset(){
        for(var key in fireMap){
            var event = fireMap[key];
            if(!event)continue;
            event.fire = false;
        }
    }

    function fireEvent(events,ev){
        if(!events)return;

        //排序
        events.sort(function(a,b){
            return b[2] - a[2];
        });

        var onceEvents = [];
        for(var i=events.length;i--;){
            var target = events[i][1];
            events[i][0].call(target,ev);
            if(events[i][3]){
                onceEvents.push(events[i]);
            }
        }
        for(var i=onceEvents.length;i--;){
            onceEvents[i][1].off(ev.type,onceEvents[i][0]);
        }
    }

	/**
     * 启动监听
     * @return this
     */
    this.startListen = function(){
        
        self.addEventListener('orientationchange',hov,false);
        self.addEventListener('deviceorientation',tilt,false);
        self.addEventListener('devicemotion',motion,false);

        return this;
    }
    

    /**
     * 停止监听
     * @return this
     */
    this.stopListen = function(game){
        self.removeEventListener('orientationchange',hov,false);
        self.removeEventListener('deviceorientation',tilt,false);
        self.removeEventListener('devicemotion',motion,false);

        return this;
    }
};
/**
 * 移动设备事件对象
 * @class soya2d.MobileEvent
 * 
 */
/**
 * 设备倾斜量，分为x/y/z三个轴
 * @property tilt
 * @type {Object}
 * @for soya2d.MobileEvent
 */
/**
 * 设备加速移动量，分为x/y/z三个轴
 * @property motion
 * @type {Object}
 * @for soya2d.MobileEvent
 */
/**
 * 设备横竖方向值portrait或者landscape
 * @property orientation
 * @type {String}
 * @for soya2d.MobileEvent
 */
/**
 * DOM事件对象
 * @property e
 * @type {Object}
 * @for soya2d.MobileEvent
 */

/**
 * 设备倾斜时触发
 * @event tilt
 * @for soya2d.DisplayObject
 * @param {soya2d.MobileEvent} ev 事件对象
 */
/**
 * 设备运动时触发
 * @event motion
 * @for soya2d.DisplayObject
 * @param {soya2d.MobileEvent} ev 事件对象
 */
/**
 * 设备横竖切换时触发
 * @event hov
 * @for soya2d.DisplayObject
 * @param {soya2d.MobileEvent} ev 事件对象
 */