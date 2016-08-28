!function(){
    /**
     * 补间对象，可以对显示对象的属性进行线性插值，从而实现平滑的变换动画。
     * 补间对象是一个链式结构，内部保存了一个补间序列，根据创建时添加的补间块，
     * 可以实现多段顺序补间效果。
     * ```
     * game.tween.add(this).to(...).to(...).to(...).play();
     * ```
     * 同时，针对一个显示对象可以创建多个补间对象，形成并行补间效果。注意，如果不同补间对象
     * 针对同一个属性进行补间，那么先执行的会被覆盖
     * ```
     * game.tween.add(this).to({x:'+50',y:'+150'},0.1).play();
     * game.tween.add(this).to({w:200,h:400},1).play();
     * ```
     * @class soya2d.Tween
     * @constructor
     * @param {Object} target 补间目标
     * @module tween
     */
    soya2d.class("soya2d.Tween",{
        extends:Signal,
        constructor:function(target){
            this.__signalHandler = new SignalHandler();
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

            this.__state = {};

            this.__status = 'paused';

            this.__runningTD;

            this.__changeTimes = 0;
            this.__lastChangeTD;
        },
        __calc:function(attris,duration,easing){
            var keys = Object.keys(attris);
            var attr = {},
                cacheRatio = {};//用于传递给onupdate
            //初始化指定属性的step
            for(var i=keys.length;i--;){//遍历引擎clone的对象，不包括引擎属性
                var k = keys[i];

                //没有该属性直接跳过
                var val = this.__state[k];
                if(val===undefined){
                    val = this.target[k];
                }
                if(val===undefined)continue;

                var initVal = parseFloat(val||0);
                var endVal = attris[k];
                if(typeof endVal === 'string' || endVal instanceof String){//relative
                    if(endVal.indexOf('-')===0){
                        endVal = initVal-parseFloat(endVal.substring(1,endVal.length));
                    }else if(endVal.indexOf('+')===0){
                        endVal = initVal+parseFloat(endVal.substring(1,endVal.length));
                    }else{
                        endVal = parseFloat(endVal);
                    }
                }
                var varVal = (endVal-initVal);
                attr[k] = {'initVal':initVal,'varVal':varVal,'endVal':endVal};
                this.__state[k] = endVal;

                //预计算。精度为10MS
                if(this.cacheable){
                    var dVal = attr[k].dVal = {};
                    for(var j=0;(j+=10)<duration;){
                        var r = easing(j,0,1,duration);
                        cacheRatio['p_'+j] = r;
                        dVal['p_'+j] = initVal + varVal*r;
                    }
                }//over if
            }//over for

            return [attr,cacheRatio];
        },
        /**
        * 给当前补间链添加一个补间块
        * @method to
        * @param {Object} attris 补间目标属性
        * @param {int} duration 补间周期(ms)
        * @param {Object} [opts] 补间属性
        * @param {Function} [opts.easing=soya2d.Tween.Linear] 补间类型
        * @param {Boolean} [opts.cacheable=false] 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
        * @param {Number} [opts.repeat=0] 循环播放次数，-1为无限
        * @param {Boolean} [opts.yoyo=false] 是否交替反向播放动画，只在循环启用时生效
        * @param {Number} [opts.delay] 延迟时间(ms)
        * @param {Boolean} [opts.clear=true] 是否在执行完成后自动销毁释放内存
        * @see {soya2d.Tween.Linear}
         */
        to:function(attris,duration,opts){
            if(this.__infinite)return this;
            opts = opts || {};
            var easing = opts.easing||soya2d.Tween.Linear;
            var data = this.__calc(attris,duration,easing);

            var yoyo = opts.yoyo||false;
            var repeat = opts.repeat||0;
            var odd = repeat % 2;
            if(yoyo && odd){
                for(var k in data[0]){
                    this.__state[k] = data[0][k].initVal;
                }
            }
            var state = {};
            soya2d.ext(state,this.__state);

            var td = new TweenData(data,state,duration,opts);
            this.__long += td.delay;

            for(var tdk in this.__tds){
                var t = this.__tds[tdk];
                for(var k in data[0]){
                    if(t.__initState[k] === undefined)
                        t.__initState[k] = data[0][k].initVal;
                }
            }

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
         * @return this
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
         * @return this
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
         * @return this
         */
        pause:function(){
            this.__status = 'paused';
            this.emit('pause');
            return this;
        },
        /**
         * 重置补间，播放头归0
         * @return this
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
        __onUpdate:function(r,td){
            this.emit('process',r,this.position / this.__long);
            if(((r === 1 && !this.__reversed) || (r === 0 && this.__reversed)) && 
                this.__lastChangeTD != td){
                
                this.__onChange(++this.__changeTimes);
                this.__lastChangeTD = td;
            }
        },
        __onChange:function(times){
            this.emit('change',times);
        },
        __onEnd:function(){
            this.emit('stop');
            
            if(!this.keepAlive){
                this.destroy();
            }
        },
        __update:function(now,d){
            if(this.__status !== 'running')return;

            if(this.position > this.__long && !this.__reversed && !this.__infinite){
                this.position = this.__long;
                this.pause();
                this.__onEnd();
                return;
            }else if(this.position < 0 && this.__reversed && !this.__infinite){
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
    });

    /**
     * 补间数据，保存了一个补间段的相关信息。一个补间实例包含1-N个补间数据
     * @class TweenData
     */
    function TweenData(data,state,duration,opts){
        /**
         * 补间时长(s)
         * @property duration
         * @type {Number}
         */
        this.duration = duration * 1000;

        opts = opts||{};
        /**
         * 补间算法
         * @property easing
         * @type {Function}
         */
        this.easing = opts.easing||soya2d.Tween.Linear;
        /**
         * 循环播放次数，-1为无限
         * @property repeat
         * @type {int}
         */
        this.repeat = opts.repeat||0;
        /**
         * 是否交替反向播放动画，只在循环多于1次时有效
         * @property yoyo
         * @type {Boolean}
         */
        this.yoyo = opts.yoyo||false;
        /**
         * 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
         * @property cacheable
         * @type {Boolean}
         */
        this.cacheable = opts.cacheable||false;
        /**
         * 延迟时间(s)
         * @property delay
         * @type {Number}
         */
        this.delay = (opts.delay||0) * 1000;

        //用来保存每个属性的，变化值，补间值
        this.__attr = data[0];
        this.__attriNames = Object.keys(data[0]);
        this.__ratio = data[1];

        this.__initState = state;

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
                for(var k in this.__initState){
                    t[k] = this.__initState[k];
                }
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

            tween.__onUpdate(ratio,this);
        },
        goTo:function(target,time,reverse){
            var ratio,attNames=this.__attriNames,attr=this.__attr,t=target;
            //预计算
            if(this.cacheable){
                var phase = 'p_'+(time/10>>0)*10;
                ratio = this.__ratio[phase];
                if(phase==='p_0')ratio=0;
                if(ratio===undefined)ratio = 1;
                //更新参数
                for(var i=attNames.length;i--;){
                    var k = attNames[i];
                    if(!attr[k])continue;
                    var v = attr[k].dVal[phase];
                    if(v===undefined)v = attr[k].endVal;
                    t[k] = v;
                }
            }else{
                if(time < 0)time = 0;
                ratio = this.easing(time,0,1,this.duration);
                if(time > this.duration)ratio=1;
                // console.log(ratio)
                //更新参数
                for(var i=attNames.length;i--;){
                    var k = attNames[i];
                    if(attr[k])
                    t[k] = attr[k].initVal + attr[k].varVal*(reverse?1-ratio:ratio);
                }
            }
            return ratio;
        },
        destroy:function(){
            this.__attr = null;
            this.__ratio = null;
            this.easing = null;
            this.target = null;
            this.onUpdate = null;
            this.onEnd = null;
        }
    };

}();

/**
 * 补间执行事件
 * @event process
 * @for soya2d.Tween
 * @param {Number} ratio 补间段执行率
 * @param {Number} rate 补间完成率
 */
/**
 * 补间段切换时触发
 * @event change
 * @for soya2d.Tween
 * @param {Number} times 切换次数
 */
/**
 * 补间停止事件
 * @event stop
 * @for soya2d.Tween
 */
/**
 * 补间暂停事件
 * @event pause
 * @for soya2d.Tween
 */