
soya2d.module.install('event',{
    onInit:function(game){
        game.events = new soya2d.Events();
        var keyboardEvents = ['keyup','keydown','keypress'];
        var mouseEvents = ['click','dblclick','mousedown','mousewheel',
                            'mousemove','mouseup','mouseover','mouseout'];
        var touchEvents = ['touchstart','touchmove','touchend','touchcancel'];
        var mobileEvents = ['hov','tilt','motion'];

        if(soya2d.Mouse){
            game.events.register(mouseEvents,new soya2d.Mouse());
        }
        if(soya2d.Keyboard){
            game.events.register(keyboardEvents,new soya2d.Keyboard());
        }
        if(soya2d.Touch){
            game.events.register(touchEvents,new soya2d.Touch());
        }
        if(soya2d.Mobile){
            game.events.register(mobileEvents,new soya2d.Mobile());
        }
    },
    onStart:function(game){
        game.events.startListen(game);
    },
    onStop:function(game){
        game.events.stopListen(game);
    },
    onUpdate:function(game){
        game.events.scan();
    }
});

/**
 * 扩展可渲染对象的事件接口
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ext(soya2d.DisplayObject.prototype,/** @lends soya2d.DisplayObject.prototype */{
    /**
     * 绑定一个或者多个事件，使用同一个回调函数
     * @param {soya2d.Game} game 绑定的游戏实例
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数
     * @param {int} [order] 触发顺序，值越大越先触发
     * @requires event
     * @return this
     */
    on:function(game,events,callback,order){
        game.events.addListener(events,callback,this,order);
        return this;
    },
    /**
     * 绑定一个或者多个事件，使用同一个回调函数。但只触发一次
     * @param {soya2d.Game} game 绑定的游戏实例
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数
     * @param {int} [order] 触发顺序，值越大越先触发
     * @requires event
     * @return this
     */
    once:function(game,events,callback,order){
        var that = this;
        var cb = function() {
            that.off(events, cb);
            callback.apply(that, arguments)
        }
        game.events.addListener(events,cb,this,order);
        return this;
    },
    /**
     * 取消一个或者多个已绑定事件
     * @param {soya2d.Game} game 绑定的游戏实例
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数，可选。如果该参数为空。则删除指定类型下所有事件
     * @requires event
     * @return this
     */
    off:function(game,events,callback){
        game.events.removeListener(events,callback,this);
        return this;
    }
});

/**
 * 扩展可游戏对象的事件接口
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ext(soya2d.Game.prototype,/** @lends soya2d.Game.prototype */{
    /**
     * 绑定一个或者多个事件，使用同一个回调函数
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数
     * @param {int} [order] 触发顺序，值越大越先触发
     * @requires event
     * @return this
     */
    on:function(events,callback,order){
        this.events.addListener(events,callback,this,order);
        return this;
    },
    /**
     * 绑定一个或者多个事件，使用同一个回调函数。但只触发一次
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数
     * @param {int} [order] 触发顺序，值越大越先触发
     * @requires event
     * @return this
     */
    once:function(events,callback,order){
        var that = this;
        var cb = function() {
            that.off(events, cb);
            callback.apply(that, arguments)
        }
        this.events.addListener(events,cb,this,order);
        return this;
    },
    /**
     * 取消一个或者多个已绑定事件
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数，可选。如果该参数为空。则删除指定类型下所有事件
     * @requires event
     * @return this
     */
    off:function(events,callback){
        this.events.removeListener(events,callback,this);
        return this;
    }
});