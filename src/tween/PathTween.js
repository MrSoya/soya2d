!function(){
    /**
     * tween模块定义了soya2d中内置的补间系统。支持路径补间和普通补间。
     * 支持针对同一个target的补间链以及并行补间。
     * <b>该模块是扩展模块，可以自行卸载</b>
     * @module tween
     */
    /**
     * 路径补间对象，功能和{{#crossLink "soya2d.Tween"}}{{/crossLink}}相同，但路径补间只针对
     * 补间目标的x/y进行补间。
     * @class soya2d.PathTween
     * @constructor
     * @param {Object} target 补间目标
     * @extends Signal
     */
    soya2d.PathTween = function(target){
        /**
         * 补间目标
         * @property target
         * @type {Object}
         */
        this.target = target;
        this.__tds = {};
        this.__startTimes = [];
        this.__long = 0;
        /**
         * 播放头位置
         * @property position
         * @type {Number}
         */
        this.position = 0;
        this.__reversed = false;
        this.__paused = false;
        this.__infinite = false;

        this.__status = 'paused';

        this.__runningTD;

        this.__changeTimes = 0;
        this.__lastChangeTD;
    };
    soya2d.PathTween.prototype = {
        __calc:function(path,duration,easing){
            var sx=0,sy=0;
            var ox=0,oy=0;
            var __pps = [];
            if(typeof(path) === 'string'){
                path = new soya2d.Path(path);
            }
            path._insQ.forEach(function(ins){
                var type = ins[0].toLowerCase();
                switch(type){
                    case 'm':ox=sx=parseFloat(ins[1][0]),oy=sy=parseFloat(ins[1][1]);break;
                    case 'l':
                        var xys = ins[1];
                        for(var i=0;i<xys.length;i+=2){

                            var r = Math.atan2(xys[i+1] - sy,xys[i] - sx);
                            var len = soya2d.Math.len2D(sx,sy,xys[i],xys[i+1]);
                            
                            for(var d=0;d<len;d++){
                                var x = d*Math.cos(r) + sx;
                                var y = d*Math.sin(r) + sy;
                                __pps.push(x,y);
                            }

                            sx=parseFloat(xys[i]),sy=parseFloat(xys[i+1]);
                        }
                        break;
                    case 'c':
                        var pps = [];
                        var xys = ins[1];
                        for(var i=0;i<xys.length;i+=6){
                            for(var t=0;t<1;t+=.01){
                                var ts = t*t;
                                var tc = ts*t;

                                var x = sx*(1-3*t+3*ts-tc) + 3*xys[i]*t*(1-2*t+ts) + 3*xys[i+2]*ts*(1-t) + xys[i+4]*tc;
                                var y = sy*(1-3*t+3*ts-tc) + 3*xys[i+1]*t*(1-2*t+ts) + 3*xys[i+3]*ts*(1-t) + xys[i+5]*tc;
                                pps.push(x,y);
                            }
                            sx=parseFloat(xys[i+4]),sy=parseFloat(xys[i+5]);
                        }
                        if(pps[pps.length-2] != xys[xys.length-2] || 
                            pps[pps.length-1] != xys[xys.length-1] ){
                            pps.push(xys[xys.length-2],xys[xys.length-1]);
                        }
                        var totalLen = 0;
                        var ks = {};
                        for(var i=0;i<pps.length-2;i+=2){
                            var len = soya2d.Math.len2D(pps[i],pps[i+1],pps[i+2],pps[i+3]);
                            
                            var r = Math.atan2(pps[i+3]-pps[i+1],pps[i+2]-pps[i]);
                            ks[totalLen] = [r,pps[i],pps[i+1],len];

                            totalLen += len;
                        }
                        var ppsa = [pps[0],pps[1]];
                        for(var i=1;i<totalLen;i++){
                            var r=0,nx,ny,s;
                            var keys = Object.keys(ks);
                            for(var k=keys.length;k--;){
                                s = parseFloat(keys[k]);
                                if(i>=s){
                                    r = ks[s][0];
                                    nx = ks[s][1];
                                    ny = ks[s][2];
                                    break;
                                }
                            }
                            if(r===0)continue;
                            var x = (i-s)*Math.cos(r) + nx;
                            var y = (i-s)*Math.sin(r) + ny;
                            ppsa.push(x,y);
                        }
                        
                        __pps = __pps.concat(ppsa);
                        break;
                    case 'q':
                        var pps = [];
                        var xys = ins[1];
                        for(var i=0;i<xys.length;i+=4){
                   
                            for(var t=0;t<1;t+=.01){
                                var ts = t*t;
                                var tc = ts*t;

                                var x = sx*(1-2*t+ts) + 2*xys[i]*t*(1-t) + xys[i+2]*ts;
                                var y = sy*(1-2*t+ts) + 2*xys[i+1]*t*(1-t) + xys[i+3]*ts;
                                pps.push(x,y);
                            }
                            sx=parseFloat(xys[i+2]),sy=parseFloat(xys[i+3]);
                        }
                        if(pps[pps.length-2] != xys[xys.length-2] || 
                            pps[pps.length-1] != xys[xys.length-1] ){
                            pps.push(xys[xys.length-2],xys[xys.length-1]);
                        }
                        var totalLen = 0;
                        var ks = {};
                        for(var i=0;i<pps.length-2;i+=2){
                            var len = soya2d.Math.len2D(pps[i],pps[i+1],pps[i+2],pps[i+3]);
                            
                            var r = Math.atan2(pps[i+3]-pps[i+1],pps[i+2]-pps[i]);
                            ks[totalLen] = [r,pps[i],pps[i+1],len];

                            totalLen += len;
                        }
                        var ppsa = [pps[0],pps[1]];
                        for(var i=1;i<totalLen;i++){
                            var r=0,nx,ny,s;
                            var keys = Object.keys(ks);
                            for(var k=keys.length;k--;){
                                s = parseFloat(keys[k]);
                                if(i>=s){
                                    r = ks[s][0];
                                    nx = ks[s][1];
                                    ny = ks[s][2];
                                    break;
                                }
                            }
                            if(r===0)continue;
                            var x = (i-s)*Math.cos(r) + nx;
                            var y = (i-s)*Math.sin(r) + ny;
                            ppsa.push(x,y);
                        }
                        
                        __pps = __pps.concat(ppsa);
                        break;
                    case 'z':
                        var r = Math.atan2(oy - sy,ox - sx);
                        var len = soya2d.Math.len2D(sx,sy,ox,oy);
     
                        for(var d=0;d<len;d++){
                            var x = d*Math.cos(r) + sx;
                            var y = d*Math.sin(r) + sy;
                            __pps.push(x,y);
                        }

                        break;
                }
            },this);

            return __pps;
        },
        /**
         * 给当前补间链添加一个路径
         * @method to
         * @param {String | soya2d.Path} path path字符串或者path对象
        * @param {int} duration 补间周期(ms)
        * @param {Object} [opts] 补间属性
        * @param {function} [opts.easing=soya2d.Tween.Linear] 补间类型
        * @param {boolean} [opts.cacheable=false] 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
        * @param {int} [opts.repeat=0] 循环播放次数，-1为无限
        * @param {boolean} [opts.yoyo=false] 是否交替反向播放动画，只在循环启用时生效
        * @param {int} [opts.delay] 延迟时间(ms)
        * @see {soya2d.Tween.Linear}
         */
        to:function(path,duration,opts){
            if(this.__infinite)return this;
            opts = opts || {};
            var easing = opts.easing||soya2d.Tween.Linear;
            var data = this.__calc(path,duration,easing);

            var td = new TweenData(data,duration,opts);
            this.__long += td.delay;

            this.__tds[this.__long] = td;
            this.__startTimes.push(this.__long);
            td.__startPos = this.__long;
            if(td.repeat === -1){
                this.__infinite = true;
                soya2d.console.warn('infinite loop instance');
            }
            this.__long += td.duration * (td.repeat+1);

            return this;
        },
        /**
         * 启动补间器。执行完后自动删除该补间实例
         * @method play
         * @param {Boolean} keepAlive 是否在补间执行完后继续保留实例
         * @chainable
         */
        play:function(keepAlive){
            this.__reversed = false;
            this.__status = 'running';

            this.keepAlive = keepAlive;
            
            return this;
        },
        /**
         * 反向执行补间
         * @method reverse
         * @chainable
         */
        reverse:function(){
            if(this.__infinite)return;
            this.__status = 'running';
            this.__reversed = true;

            return this;
        },
        /**
         * 暂停补间器
         * @method pause
         * @chainable
         */
        pause:function(){
            this.__status = 'paused';
            if(this.onPause)this.onPause();
            return this;
        },
        /**
         * 重置补间，播放头归0
         * @method restart
         * @chainable
         */
        restart:function(){
            this.position = 0;
            this.play();
            return this;
        },
        __getTD:function(){
            for(var i=this.__startTimes.length;i--;){
                if(this.position >= this.__startTimes[i]){
                    return this.__tds[this.__startTimes[i]];
                }
            }
        },
        __onUpdate:function(r,angle,td){
            if(this.onProcess)this.onProcess(r,this.position / this.__long,angle);
            if(((r === 1 && !this.__reversed ) || (r === 0 && this.__reversed)) && 
                this.__lastChangeTD != td){
                
                if(this.onChange)this.onChange(++this.__changeTimes);
                this.__lastChangeTD = td;
            }
        },
        __onEnd:function(){
            if(this.onStop)this.onStop();

            if(!this.keepAlive){
                this.destroy();
            }
        },
        __update:function(now,d){
            if(this.__status !== 'running')return;

            if(this.position > this.__long && !this.__reversed){
                this.position = this.__long;
                this.pause();
                this.__onEnd();
                return;
            }else if(this.position < 0 && this.__reversed){
                this.position = 0;
                this.pause();
                this.__onEnd();
                return;
            }

            d = this.__reversed?-d:d;
            this.position += d;

            var td = this.__getTD();
            if(!td)return;
            if(this.__runningTD !== td){
                this.__runningTD = td;
                this.__runningTD.__inited = false;
            }
            

            td.update(
                this,
                this.position);
        },
        /**
         * 销毁补间实例
         * @method destroy
         */
        destroy:function(){
            this.__manager.__remove(this);
            
            for(var k in this.__tds){
                this.__tds[k].destroy();
            }
            this.__tds = null;
            this.target = null;
            this.__currentTD = null;
        }
    };

    //补间数据
    function TweenData(data,duration,opts){
        /**
         * 补间时长(s)
         * @type {Number}
         */
        this.duration = duration * 1000;

        opts = opts||{};
        /**
         * 补间算法
         * @type {Function}
         */
        this.easing = opts.easing||soya2d.Tween.Linear;
        /**
         * 循环播放次数，-1为无限
         * @type {int}
         */
        this.repeat = opts.repeat||0;
        /**
         * 是否交替反向播放动画，只在循环多于1次时有效
         * @type {Boolean}
         */
        this.yoyo = opts.yoyo||false;
        /**
         * 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
         * @type {Boolean}
         */
        this.cacheable = opts.cacheable||false;
        /**
         * 延迟时间(s)
         * @type {Number}
         */
        this.delay = (opts.delay||0) * 1000;

        //path points
        this.__pps = data;

        this.__radian = 0;
        this.__loops = 0;//已经循环的次数
    }
    TweenData.prototype = {
        update:function(tween,pos){
            var c = pos - this.__startPos;
            if(this.repeat !== 0){
                this.__loops = Math.ceil(c / this.duration) - 1;

                if(this.repeat > 0 && this.__loops > this.repeat)return;

                c = c % this.duration;
            }else{
                c = c>this.duration?this.duration:c;
            }

            var t = tween.target;
            if(!this.__inited){
                t.x = this.__pps[0];
                t.y = this.__pps[1];
                this.__inited = true;
            }
            
            var ratio;
            if(this.repeat === 0){
                ratio = this.goTo(t,c);
            }else{
                var odd = this.__loops % 2;
                if(odd && this.__loops > 0 && this.yoyo){
                    ratio = this.goTo(t,c,true);
                }else{
                    ratio = this.goTo(t,c);
                }
            }

            tween.__onUpdate(ratio,this.__radian*soya2d.Math.ONEANG,this);
        },
        goTo:function(target,time,reverse){
            var ratio,pps=this.__pps,t=target;
        
            if(time < 0)time = 0;
            ratio = this.easing(time,0,1,this.duration);

            var i = (pps.length-2) * (reverse?1-ratio:ratio) >> 0;
            if(i>pps.length-2)i=pps.length-2;
            if(i<0)i *= -1;
            if(i%2!=0){
                i++;
            }
            
            var ap = t.anchorPosition;
            t.x = pps[i] - ap.x;
            t.y = pps[i+1] - ap.y;

            var x = pps[i],
                y = pps[i+1];
            var nx,ny;
            if(i<1){
                nx = pps[i+2];
                ny = pps[i+3];

                this.__radian = Math.atan2(ny-y,nx-x);
            }else{
                nx = pps[i-2];
                ny = pps[i-1];

                this.__radian = Math.atan2(y-ny,x-nx);
            }
            
            return ratio;
        },
        destroy:function(){
            this.__pps = null;
            this.easing = null;
            this.target = null;
            this.onUpdate = null;
            this.onEnd = null;
        }
    };

}();

/**
 * 补间执行事件
 * @event onProcess
 * @for soya2d.PathTween
 * @param {Number} ratio 补间段执行率
 * @param {Number} rate 补间完成率
 * @param {Number} angle 当前路径角度
 */
/**
 * 补间段切换时触发
 * @event onChange
 * @for soya2d.PathTween
 * @param {Number} times 切换次数
 */
/**
 * 补间停止事件
 * @event onStop
 * @for soya2d.PathTween
 */
/**
 * 补间暂停事件
 * @event onPause
 * @for soya2d.PathTween
 */