
///////////////////// 鼠标/触摸监听器 /////////////////////
var pointerListener = new InputListener({
    onInit:function(game) {
        var cvs = game.renderer.getCanvas();
        this.cvs = cvs;

        this.fn_md = this.doMousedown.bind(this);
        this.fn_mm = this.doMousemove.bind(this);
        this.fn_mu = this.doMouseup.bind(this);
        this.fn_mo = this.doMouseout.bind(this);
        this.fn_mov = this.doMouseover.bind(this);

        this.fn_ts = this.doStart.bind(this);
        this.fn_tm = this.doMove.bind(this);
        this.fn_te = this.doEnd.bind(this);
        this.fn_tc = this.doCancel.bind(this);
    
        if(soya2d.Device.mobile){
            this.bindTouch(cvs);
        }else{
            this.bindMouse(cvs);
        }

        this.lastTapTime = 0;
        this.lastClickTime = 0;

        this.inList = [];//for over/out

        this.pressStartTime = 0;
    },
    bindMouse:function(cvs) {
        this.pointerType = 'mouse';
        //mouse
        cvs.addEventListener('mousedown',this.fn_md,true);
        cvs.addEventListener('mousemove',this.fn_mm,true);
        cvs.addEventListener('mouseup',this.fn_mu,true);
        window.addEventListener('blur',this.fn_tc,true);
        //stage
        cvs.addEventListener('mouseout',this.fn_mo,true);
        cvs.addEventListener('mouseover',this.fn_mov,true);
    },
    bindTouch:function(cvs) {
        this.pointerType = 'touch';
        //touch
        cvs.addEventListener('touchstart',this.fn_ts,true);
        cvs.addEventListener('touchmove',this.fn_tm,true);
        cvs.addEventListener('touchend',this.fn_te,true);
        cvs.addEventListener('touchcancel',this.fn_tc,true);
    },
    changeType:function(type) {
        if(this.pointerType == type)return;
        var cvs = this.cvs;
        this.pressing = false;
        switch(type){
            case 'mouse':
                cvs.removeEventListener('touchstart',this.fn_ts,true);
                cvs.removeEventListener('touchmove',this.fn_tm,true);
                cvs.removeEventListener('touchend',this.fn_te,true);
                cvs.removeEventListener('touchcancel',this.fn_tc,true);
                this.bindMouse(cvs);
                break;
            case 'touch':
                cvs.removeEventListener('mousedown',this.fn_md,true);
                cvs.removeEventListener('mousemove',this.fn_mm,true);
                cvs.removeEventListener('mouseup',this.fn_mu,true);
                window.removeEventListener('blur',this.fn_tc,true);
                cvs.removeEventListener('mouseout',this.fn_mo,true);
                cvs.removeEventListener('mouseover',this.fn_mov,true);
                this.bindTouch(cvs);
                break;
        }
    },
    onScan:function(game){
        var input = game.input.pointer;
        var renderer = game.renderer;

        var isDown = false,
            isUp = false,
            isMove = false,
            e = null;
        if(this.eventMap['down']){
            isDown = true;
            e = this.eventMap['down'];

            eventSignal.emit('pointerdown',e);
        }else if(this.eventMap['up']){
            isUp = true;
            e = this.eventMap['up'];

            eventSignal.emit('pointerup',e);
        }

        if(this.eventMap['move']){
            isMove = true;
            e = this.eventMap['move'];

            eventSignal.emit('pointermove',e);
        }
        if(this.eventMap['tap']){
            e = this.eventMap['tap'];

            eventSignal.emit('pointertap',e);
        }
        if(this.eventMap['dbltap']){
            e = this.eventMap['dbltap'];

            eventSignal.emit('pointerdbltap',e);
        }

        input.isDown = isDown;
        input.isUp = isUp;
        input.isMove = isMove;
        input.isPressing = this.pressing;
        input.duration = this.pressStartTime==0?0:Date.now() - this.pressStartTime;
        input.e = e;
        input.touches = [];
        
        if(!e)return;

        if(e.changedTouches){
            var points = this.handleTouches(e,e.changedTouches,game);
            input.position = points[0];
            input.touches = points;

            if(isMove){
                for(var i=points.length;i--;){
                    //一次事件只匹配一次
                    if(this.handleOverOut(e,points[i]))break;
                }
            }
        }else{
            input.button = {
                left:e.button==0||e.button==1,
                right:e.button==2,
                middle:e.button==4||e.which==2
            };
            var x = (e.offsetX||e.layerX) / renderer.hr;
            var y = (e.offsetY||e.layerY) / renderer.vr;
            input.position = new soya2d.Point(x,y);

            if(isMove){
                this.handleOverOut(e,input.position);
            }
        }

        if(this.eventMap['enterstage']){
            eventSignal.emit('enterstage',this.eventMap['enterstage']);
        }
        if(this.eventMap['leavestage']){
            eventSignal.emit('leavestage',this.eventMap['leavestage']);
        }

        if(this.eventMap['cancel']){
            eventSignal.emit('pointercancel',this.eventMap['cancel']);
        }
    },
    handleOverOut:function(e,point){
        //over/out
        var ooList = [];
        var map = eventSignal.__sigmap;
        var overList = map['pointerover'];
        var outList = map['pointerout'];
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
            var isMatch = false;
            ooList.forEach(function(o){
                var target = o[1];
                var fn = o[0];
                if(!target.hitTest || !target.hitTest(point.x,point.y))return;

                currIn.push(target);
                if(this.inList.indexOf(target) > -1)return;
                this.inList.push(target);
                
                eventSignal.emit('pointerover',e);

                isMatch = true;
            },this);

            var toDel = [];
            this.inList.forEach(function(sp){
                if(currIn.indexOf(sp) < 0){
                    toDel.push(sp); 
                }
            });
            if(toDel.length<1)return;
            for(var i=toDel.length;i--;){
                var k = this.inList.indexOf(toDel[i]);
                this.inList.splice(k,1);
                var target = toDel[i];

                eventSignal.emit('pointerout',e);

                isMatch = true;
            }
            return isMatch;
        }
    },
    doMousedown:function(e){
        this.setEvent('down',e);

        this.pressing = true;
        this.pressStartTime = Date.now();
    },
    doMousemove:function(e){
        this.setEvent('move',e);
    },
    doMouseup:function(e){
        this.pressing = false;
        this.pressStartTime = 0;

        this.setEvent('up',e);

        if(this.canceled)return;
        if(e.button === 0){
            this.setEvent('tap',e);
            if(Date.now() - this.lastClickTime < 300){
                this.setEvent('dbltap',e);
            }

            this.lastClickTime = Date.now();
        }
    },
    doMouseover:function(e){
        this.setEvent('enterstage',e);
    },
    doMouseout:function(e){
        this.setEvent('leavestage',e);
    },
    handleTouches:function(e,touches,game){
        var touchList = [];
        var points = [];
        if(touches && touches.length>0){
            var t = e.target||e.srcElement;
            var ol=t.offsetLeft,ot=t.offsetTop;
            while((t=t.offsetParent) && t.tagName!='BODY'){
                ol+=t.offsetLeft-t.scrollLeft;
                ot+=t.offsetTop-t.scrollTop;
            }
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
                scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
            for(var i=0;i<touches.length;i++){
                var tev = touches[i];
                touchList[i] = tev.clientX - ol + scrollLeft;
                touchList[i+1] = tev.clientY - ot + scrollTop;
            }
        }

        var renderer = game.renderer;
        var cvs = renderer.getCanvas();
        var marginLeft = window.getComputedStyle(cvs,null).marginLeft;
        marginLeft = parseFloat(marginLeft) || 0;
        var marginTop = window.getComputedStyle(cvs,null).marginTop;
        marginTop = parseFloat(marginTop) || 0;
        
        for(var i=0;i<touchList.length;i+=2){
            var x = touchList[i];
            var y = touchList[i+1];
            
            switch(game.stage.rotateMode){
                case soya2d.ROTATEMODE_90:
                    //平移，计算出canvas内坐标
                    x = x + cvs.offsetLeft - marginTop;
                    y = y + cvs.offsetTop - marginLeft;
                    
                    //旋转
                    var tmp = x;
                    x = y;
                    y = thisGame.stage.w - Math.abs(tmp);
                    break;
                case soya2d.ROTATEMODE_270:
                    //平移，计算出canvas内坐标
                    x = x + cvs.offsetLeft - marginTop;
                    y = y + cvs.offsetTop - marginLeft;
                    
                    //旋转
                    var tmp = y;
                    y = x;
                    x = thisGame.stage.h - Math.abs(tmp);
                    break;
                case soya2d.ROTATEMODE_180:
                    //旋转
                    x = thisGame.stage.w - Math.abs(x);
                    y = thisGame.stage.h - Math.abs(y);
                    break;
            }
            
            x = x / renderer.hr;
            y = y / renderer.vr;  

            points.push(new soya2d.Point(x,y));
        }

        return points;
    },
    doStart:function(e){
        this.setEvent('down',e);

        this.pressing = true;
        this.pressStartTime = Date.now();

        this.hasMoved = false;
        this.canceled = false;
    },
    doMove:function(e){
        this.setEvent('move',e);
        this.hasMoved = true;
    },
    doCancel:function(e){
        this.canceled = true;
        this.setEvent('cancel',e);

        this.pressing = false;
        this.pressStartTime = 0;
    },
    doEnd:function(e){
        this.setEvent('up',e);

        if(e.touches.length < 1){
            this.pressing = false;
            this.pressStartTime = 0;
        }

        if(this.canceled)return;
        if(!this.hasMoved){
            this.setEvent('tap',e);

            if(Date.now() - this.lastTapTime < 300){
                this.setEvent('dbltap',e);
            }

            this.lastTapTime = Date.now();
        }
    }

});

///////////////////// 键盘事件分派器 /////////////////////
var keyboardListener = new InputListener({
    onInit:function() {
        window.addEventListener('keyup',this.doKeyUp.bind(this),false);
        window.addEventListener('keydown',this.doKeyDown.bind(this),false);
        window.addEventListener('blur',this.doBlur.bind(this),false);

        this.preesingKeys = [];//keycode

        this.pressing = false;//is key pressing

        this.lastEv = null;
    },
    onScan:function(game){
        var input = game.input.keyboard;

        var isDown = false,
            isUp = false,
            isPress = false,
            e = this.lastEv;
        if(this.eventMap['down']){
            isDown = true;
            this.lastEv = e = this.eventMap['down'];

            eventSignal.emit('keydown',e);
        }else if(this.eventMap['up']){
            isUp = true;
            this.lastEv = e = this.eventMap['up'];

            eventSignal.emit('keyup',e);
        }

        if(this.pressing){
            eventSignal.emit('keypress',e);
        }
        
        input.isDown = isDown;
        input.isUp = isUp;
        input.isPressing = this.pressing;
        input.e = e;
        input.shiftKey = e?e.shiftKey:false;
        input.metaKey = e?e.metaKey:false;
        input.ctrlKey = e?e.ctrlKey:false;
        input.altKey = e?e.altKey:false;
        input.keys = this.preesingKeys;
    },
    doKeyUp:function(e){
        var keys = this.preesingKeys;
        var keycode = e.keyCode||e.which;
        var i = keys.indexOf(keycode);
        if(i>-1){
            keys.splice(i,1);
        }

        //没有按键
        if(keys.length<1){
            this.pressing = false;
        }

        this.setEvent('up',e);
    },
    doKeyDown:function(e){
        var keys = this.preesingKeys;
        var keycode = e.keyCode||e.which;
        if(keys.indexOf(keycode)<0){
            keys.push(keycode);
        }else{
            return;
        }

        this.pressing = true;

        this.setEvent('down',e);
    },
    doBlur:function(e){
        this.preesingKeys = [];
        this.pressing = false;
    }
});

///////////////////// 设备事件分派器 /////////////////////
var deviceListener = new InputListener({
    onInit:function() {
        window.addEventListener('orientationchange',this.doHOV.bind(this),false);
        window.addEventListener('deviceorientation',this.doTilt.bind(this),false);
        window.addEventListener('devicemotion',this.doMotion.bind(this),false);
    },
    onScan:function(game){
        var input = game.input.device;
        var e = null;

        if(this.eventMap['hov']){
            e = this.eventMap['hov'];

            if(this.timer)clearTimeout(this.timer);
            var that = this;
            //start timer
            this.timer = setTimeout(function(){
                var orientation = that.getOrientation();
                eventSignal.emit('hov',orientation);
            },500);
        }
        if(this.eventMap['tilt']){
            e = this.eventMap['tilt'];

            var tilt = {
                z: e.alpha,
                x: e.beta,
                y: e.gamma,
                absolute: e.absolute
            };
            input.tilt = tilt;

            eventSignal.emit('tilt',tilt);
        }
        if(this.eventMap['motion']){
            e = this.eventMap['motion'];

            var motion = {
                x: e.acceleration.x,
                y: e.acceleration.y,
                z: e.acceleration.z,
                interval: e.interval
            };
            input.motion = motion;

            eventSignal.emit('motion',motion);
        }

        input.e = e;
    },
    getOrientation:function(){
        var w = window.innerWidth;
        var h = window.innerHeight;
        var rs;
        if(w > h){
            rs = 'landscape';
        }else{
            rs = 'portrait';
        }
        return rs;
    },
    doHOV:function(e){
        this.setEvent('hov',e);
    },
    doTilt:function(e){
        this.setEvent('tilt',e);
    },
    doMotion:function(e){
        this.setEvent('motion',e);
    }
});