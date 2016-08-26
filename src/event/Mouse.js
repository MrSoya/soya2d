/**
 * 鼠标事件处理类,提供如下事件:<br/>
 * <ul>
 *     <li>click</li>
 *     <li>dblclick</li>
 *     <li>mousedown</li>
 *     <li>mouseup</li>
 *     <li>mousemove</li>
 *     <li>mousewheel</li>
 *     <li>mouseover</li>
 *     <li>mouseout</li>
 * </ul>
 * 所有事件的唯一回调参数为鼠标事件对象{@link soya2d.MouseEvent}<br/>
 * *该事件支持传播
 * @class 
 * @extends soya2d.EventHandler
 */
soya2d.Mouse = function(){

    //{'mousedown':{fire:true,event:{}}}
    var fireMap = {
        click:{},
        dblclick:{},
        mousedown:{},
        mouseup:{},
        mousemove:{},
        mousewheel:{},
        mouseover:{__fireList:[]},
        mouseout:{__fireList:[]}
    };
    var thisGame;
    var mouse = this;
    var eventMap = soya2d.DisplayObject.prototype.__signalHandler.map;

    function setEvent(event,e,target){
        var renderer = thisGame.renderer;
        mouse.x = fireMap[event].x = (e.offsetX||e.layerX) / renderer.hr;
        mouse.y = fireMap[event].y = (e.offsetY||e.layerY) / renderer.vr;
        mouse.lButton = fireMap[event].lButton = e.button==0||e.button==1;
        mouse.rButton = fireMap[event].rButton = e.button==2;
        mouse.wButton = fireMap[event].wButton = e.button==4||e.which==2;
        fireMap[event].e = e;
        fireMap[event].__propagate = true;
        fireMap[event].stopPropagation = stopPropagation;
        fireMap[event].type = event;
        fireMap[event].fire = true;
        if(fireMap[event].__fireList)
        fireMap[event].__fireList.push(target);//over & out
    }

    function stopPropagation(){
        this.__propagate = false;
    }

    /******************* handler *******************/
    function click(e){
        setEvent('click',e);
    }
    function dblclick(e){
        setEvent('dblclick',e);
    }
    function mousedown(e){
        setEvent('mousedown',e);
    }
    function mousewheel(e){
        setEvent('mousewheel',e);
    }
    var inList = [];
    function mousemove(e){
        setEvent('mousemove',e);

        //over/out
        var ooList = [];
        var overList = eventMap['mouseover'];
        var outList = eventMap['mouseout'];
        if(overList){
            overList.forEach(function(o){
                ooList.push(o);
            });
        }
        if(outList){
            outList.forEach(function(o){
                for(var i=ooList.length;i--;){
                    if(ooList[i][1] == o[1])return;
                }

                ooList.push(o);
            });
        }
        if(ooList.length>0){
            var currIn = [];
            ooList.forEach(function(o){
                var target = o[1];
                var fn = o[0];
                if(!target.hitTest || !target.hitTest(mouse.x,mouse.y))return;

                currIn.push(target);
                if(inList.indexOf(target) > -1)return;
                inList.push(target);
                
                setEvent('mouseover',e,target);
            });

            var toDel = [];
            inList.forEach(function(sp){
                if(currIn.indexOf(sp) < 0){
                    toDel.push(sp); 
                }
            });
            if(toDel.length<1)return;
            for(var i=toDel.length;i--;){
                var k = inList.indexOf(toDel[i]);
                inList.splice(k,1);
                var target = toDel[i];

                setEvent('mouseout',e,target);
            }
        }
    }
    function mouseup(e){
        setEvent('mouseup',e);
    }

    /******************* interface *******************/

    /**
     * 扫描是否需要执行鼠标事件，如果需要，执行
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
            if(event.__fireList)
                event.__fireList = [];
        }
    }

    function fireEvent(events,ev){
        if(!events)return;

        var contextSet = [];
        var scene = null;
        for(var i=events.length;i--;){
            var target = events[i][1];
            if(ev.type == 'mouseover' || ev.type == 'mouseout'){
                if(ev.__fireList.indexOf(target) >= 0 && target.isRendered()){
                    contextSet.push(target);
                }
            }
            if(contextSet.indexOf(target) < 0 && target.hitTest(mouse.x,mouse.y) && target.isRendered()){
                contextSet.push(target);
            }
        }
        
        contextSet.sort(function(a,b){
            return b.z - a.z;
        });
        if(contextSet.length<1)return;

        var target = contextSet[0];
        
        var ev = fireListeners(target,events,ev);

        if(!ev.__propagate)return;

        //bubble
        var p = target.parent;
        while(p){
            
            ev = fireListeners(p,events,ev);
            
            if(!ev.__propagate)return;

            p = p.parent;
        }

        if(target != thisGame){
            fireListeners(thisGame,events,ev);
        }
    }

    function fireListeners(target,events,ev){
        var listeners = [];
        events.forEach(function(ev){
            if(ev[1] == target){
                listeners.push(ev);
            }
        });

        listeners.sort(function(a,b){
            return b[2] - a[2];
        });

        for(var i=listeners.length;i--;){
            listeners[i][0].call(target,ev);
            if(listeners[i][3]){
                listeners[i][1].off(ev.type,listeners[i][0]);
            }
        }
        return ev;
    }

	/**
     * 启动监听
     * @return this
     */
    this.startListen = function(game){
        thisGame = game;
        var cvs = game.renderer.getCanvas();
        cvs.addEventListener('click',click,false);
        cvs.addEventListener('dblclick',dblclick,false);
        cvs.addEventListener('mousedown',mousedown,false);
        cvs.addEventListener('mousewheel',mousewheel,false);
        cvs.addEventListener('mousemove',mousemove,false);
        self.addEventListener('mouseup',mouseup,false);

        return this;
    }

    /**
     * 停止监听
     * @return this
     */
    this.stopListen = function(game){
        var cvs = game.renderer.getCanvas();
        cvs.removeEventListener('click',click,false);
        cvs.removeEventListener('dblclick',dblclick,false);
        cvs.removeEventListener('mousedown',mousedown,false);
        cvs.removeEventListener('mousewheel',mousewheel,false);
        cvs.removeEventListener('mousemove',mousemove,false);
        self.removeEventListener('mouseup',mouseup,false);

        return this;
    }

};

/**
 * 事件类型 - 单击
 * @type {String}
 */
soya2d.EVENT_CLICK = 'click';
/**
 * 事件类型 - 双击
 * @type {String}
 */
soya2d.EVENT_DBLCLICK = 'dblclick';
/**
 * 事件类型 - 鼠标按下
 * @type {String}
 */
soya2d.EVENT_MOUSEDOWN = 'mousedown';
/**
 * 事件类型 - 鼠标滚轮
 * @type {String}
 */
soya2d.EVENT_MOUSEWHEEL = 'mousewheel';
/**
 * 事件类型 - 鼠标移动
 * @type {String}
 */
soya2d.EVENT_MOUSEMOVE = 'mousemove';
/**
 * 事件类型 - 鼠标抬起
 * @type {String}
 */
soya2d.EVENT_MOUSEUP = 'mouseup';
/**
 * 事件类型 - 鼠标浮动在显示对象
 * @type {String}
 */
soya2d.EVENT_MOUSEOVER = 'mouseover';
/**
 * 事件类型 - 鼠标从显示对象移走
 * @type {String}
 */
soya2d.EVENT_MOUSEOUT = 'mouseout';

/**
 * 鼠标事件对象
 * @type {Object}
 * @typedef {Object} soya2d.MouseEvent
 * @property {function} stopPropagation 停止事件传播。冒泡方式
 * @property {int} x - 鼠标当前x坐标
 * @property {int} y - 鼠标当前y坐标
 * @property {boolean} lButton - 是否按下了鼠标左键
 * @property {boolean} rButton - 是否按下了鼠标右键
 * @property {boolean} wButton - 是否按下了鼠标中键
 * @property {Object} e - HTML事件对象
 */