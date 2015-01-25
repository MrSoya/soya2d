/**
 * @classdesc 触摸事件处理类,提供如下事件:<br/>
 * <ul>
 *     <li>touchstart</li>
 *     <li>touchmove</li>
 *     <li>touchend</li>
 *     <li>touchcancel</li>
 * </ul>
 * 所有事件的唯一回调参数为触摸事件对象TouchEvent
 * @class 
 * @extends soya2d.EventHandler
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Touch = function(){

    var fireMap = {
        touchstart:{},
        touchmove:{},
        touchend:{},
        touchcancel:{}
    };
    var thisGame;
    var touch = this;

    this.touchList = [];

    function setEvent(event,e){
        var touchs = e.changedTouches;
        if(touchs && touchs.length>0){
            var t = e.target||e.srcElement;
            var ol=t.offsetLeft,ot=t.offsetTop;
            while((t=t.offsetParent) && t.tagName!='BODY'){
                ol+=t.offsetLeft-t.scrollLeft;
                ot+=t.offsetTop-t.scrollTop;
            }
            for(var i=0;i<touchs.length;i+=2){
                var tev = touchs[i];
                touch.touchList[i] = tev.clientX-ol;
                touch.touchList[i+1] = tev.clientY-ot;
            }
        }

        var touchList = touch.touchList;

        var renderer = thisGame.getRenderer();
        var cvs = renderer.getCanvas();
        var marginLeft = window.getComputedStyle(cvs,null).marginLeft;
        marginLeft = parseFloat(marginLeft) || 0;
        var marginTop = window.getComputedStyle(cvs,null).marginTop;
        marginTop = parseFloat(marginTop) || 0;
        
        for(var i=0;i<touchList.length;i+=2){
            var x = touchList[i];
            var y = touchList[i+1];
            
            switch(this.game.view.rotate()){
                case soya2d.ROTATEMODE_90:
                    //平移，计算出canvas内坐标
                    x = x + cvs.offsetLeft - marginTop;
                    y = y + cvs.offsetTop - marginLeft;
                    
                    //旋转
                    var tmp = x;
                    x = y;
                    y = this.game.view.w - Math.abs(tmp);
                    break;
                case soya2d.ROTATEMODE_270:
                    //平移，计算出canvas内坐标
                    x = x + cvs.offsetLeft - marginTop;
                    y = y + cvs.offsetTop - marginLeft;
                    
                    //旋转
                    var tmp = y;
                    y = x;
                    x = this.game.view.h - Math.abs(tmp);
                    break;
                case soya2d.ROTATEMODE_180:
                    //旋转
                    x = this.game.view.w - Math.abs(x);
                    y = this.game.view.h - Math.abs(y);
                    break;
            }
            
            x = x / renderer.hr;
            y = y / renderer.vr;  
                
            touchList[i] = x;
            touchList[i+1] = y;
        }

        
        fireMap[event].touchList = touchList;
        fireMap[event].e = e;
        fireMap[event].type = event;
        fireMap[event].fire = true;
    }

    /******************* handler *******************/
    function touchstart(e){
        setEvent('touchstart',e);
    }
    function touchmove(e){
        setEvent('touchmove',e);
    }
    function touchend(e){
        setEvent('touchend',e);
    }
    function touchcancel(e){
        setEvent('touchcancel',e);
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

        var scene = game.scene;

        for(var i=events.length;i--;){
            var target = events[i].context;
            if(target instanceof soya2d.DisplayObject && target != scene){

                var touchList = touch.touchList;
                var hit = false;
                for(var j=0;j<touchList.length;j+=2){
                    x = touchList[j];
                    y = touchList[j+1];

                    if(target.hitTest(x,y)){
                        hit = true;
                        break;
                    }
                }
                if(!hit){
                    continue;
                }
            }

            events[i].fn.call(target,ev);
            
        }
    }

	/**
     * 启动监听
     * @return this
     */
    this.startListen = function(game){
        thisGame = game;
        var cvs = game.getRenderer().getCanvas();
        cvs.addEventListener('touchstart',touchstart,false);
        cvs.addEventListener('touchmove',touchmove,false);
        self.addEventListener('touchend',touchend,false);
        self.addEventListener('touchcancel',touchcancel,false);

        return this;
    }

    /**
     * 停止监听
     * @return this
     */
    this.stopListen = function(game){
        var cvs = game.getRenderer().getCanvas();
        cvs.removeEventListener('touchstart',touchstart,false);
        cvs.removeEventListener('touchmove',touchmove,false);
        self.removeEventListener('touchend',touchend,false);
        self.removeEventListener('touchcancel',touchcancel,false);

        return this;
    }

    soya2d.EventHandler.call(this);
};
soya2d.inherits(soya2d.Touch,soya2d.EventHandler);
/**
 * 触摸事件对象
 * @typedef {Object} TouchEvent
 * @property {Array} touchList - 触摸点一维数组[x1,y1, x2,y2, ...]
 * @property {Object} e - HTML事件对象
 */
