
soya2d.module.install('event',{
    onInit:function(game){
        this.events = new soya2d.Events();
        var keyboardEvents = ['keyup','keydown','keypress'];
        var mouseEvents = ['click','dblclick','mousedown','mousewheel',
                            'mousemove','mouseup','mouseover','mouseout'];
        var touchEvents = ['touchstart','touchmove','touchend','touchcancel'];
        var mobileEvents = ['hov','tilt','motion'];

        if(soya2d.Mouse){
            this.events.register(mouseEvents,new soya2d.Mouse());
        }
        if(soya2d.Keyboard){
            this.events.register(keyboardEvents,new soya2d.Keyboard());
        }
        if(soya2d.Touch){
            this.events.register(touchEvents,new soya2d.Touch());
        }
        if(soya2d.Mobile){
            this.events.register(mobileEvents,new soya2d.Mobile());
        }
    },
    onStart:function(game){
        this.events.startListen(game);
    },
    onStop:function(game){
        this.events.stopListen(game);
    },
    onBeforeUpdate:function(game){
        this.events.scan();
    }
});

/**
 * 点击事件类型 - 点下
 * 该事件会自动判断所在平台，决定是触摸还是鼠标
 * @type {String}
 */
soya2d.EVENT_POINTDOWN = 'pointdown';
soya2d.EVENT_POINTMOVE = 'pointmove';
soya2d.EVENT_POINTUP = 'pointup';