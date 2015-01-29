/**
 * @classdesc 移动设备事件处理类,提供如下事件:<br/>
 * <ul>
 *     <li>tilt</li>
 *     <li>motion</li>
 *     <li>hov</li>
 * </ul>
 * 所有事件的唯一回调参数为设备事件对象{@link soya2d.MobileEvent}
 * @class 
 * @extends soya2d.EventHandler
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Mobile = function(){

    var fireMap = {
        tilt:{},
        motion:{},
        hov:{}
    };

    var mobile = this;

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
                var events = this.__eventMap[key];
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
            return a.order - b.order;
        });

        for(var i=events.length;i--;){
            var target = events[i].context;
            events[i].fn.call(target,ev);
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

    soya2d.EventHandler.call(this);
};
soya2d.inherits(soya2d.Mobile,soya2d.EventHandler);
/**
 * 移动设备事件对象
 * @type {Object}
 * @typedef {Object} soya2d.MobileEvent
 * @property {Object} tilt - 设备倾斜量，分为x/y/z三个轴
 * @property {Object} motion - 设备加速移动量，分为x/y/z三个轴
 * @property {string} orientation - 设备横竖方向值portrait或者landscape
 * @property {Object} e - HTML事件对象
 */