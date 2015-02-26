/**
    * @classdesc 补间类，用于创建动画<br/>
    * 该类提供了在周期时间内，按照指定补间类型进行“补间目标”属性的计算，并提供反馈的过程<br/>
    * 补间目标可以是一个可渲染对象，比如sprite，也可以是它的对象属性，比如
    * @example
var MrSoya = new soya2d.Text({
    text:"Hi~~,i'm MrSoya"
});
var tween1 = new soya2d.Tween(MrSoya,
        {opacity:1,scaleX:1},
        1000,{easing:soya2d.Tween.Expo.Out,
        cacheable:true,
        onUpdate:function(target,ratio){
            target.sclaeY = ratio;
        }
});
var tween2 = new soya2d.Tween(MrSoya.bounds,
        {w:100,h:200},
        1000,
        {easing:soya2d.Tween.Expo.Out,cacheable:false
});
    * @param {Object} target 需要进行对象
    * @param {Object} attris 补间目标属性
    * @param {int} duration 补间周期(ms)
    * @param {Object} [opts] 补间属性
    * @param {function} [opts.easing=soya2d.Tween.Linear] 补间类型
    * @param {boolean} [opts.cacheable=false] 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
    * @param {int} [opts.iteration=0] 循环播放次数，-1为无限
    * @param {boolean} [opts.alternate=false] 是否交替反向播放动画，只在循环启用时生效
    * @param {function} [opts.onUpdate] 补间更新事件
    * @param {function} [opts.onEnd] 补间结束事件
    * @class
    * @see {soya2d.Tween.Linear}
    * @author {@link http://weibo.com/soya2d MrSoya}
    */
soya2d.Tween = function(target,attris,duration,opts){

    //用来保存每个属性的，变化值，补间值
    this.__attr = {};
    this.__attr_inverse = {};
    this.__attriNames;
    this.attris = attris;
    this.target = target;
    this.duration = duration;

    opts = opts||{};
    this.easing = opts.easing||soya2d.Tween.Linear;
    this.iteration = opts.iteration||0;
    this.alternate = opts.alternate||false;

    /**
     * @name soya2d.Tween#onUpdate
     * @desc  补间每运行一次时触发，this指向补间器
     * @param {Object} target 补间目标，可能为null
     * @param {Number} ratio 补间系数。当补间器运行时，会回传0-1之间的补间系数，
     * 系数个数为补间帧数，系数值根据补间类型不同而不同。根据这个系数，可以实现多目标同时补间的效果，比如：
     * @example
     var tween1 = new soya2d.Tween(ken,
             {opacity:1,scaleX:1},
             1000,
             {easing:soya2d.Tween.Expo.Out,cacheable:true,
             onUpdate:function(target,ratio){
                 target.sclaeY = ratio;
             }
    });
     * @event
     */
    this.onUpdate = opts.onUpdate;
    /**
     * @name soya2d.Tween#onEnd
     * @desc  补间运行完触发，this指向补间器
     * @param {Object} target 补间目标
     * @event
     */
    this.onEnd = opts.onEnd;
    this.cacheable = opts.cacheable||false;

    this.__loops = 0;//已经循环的次数
    this.__delay = 0;
};

soya2d.Tween.prototype = {
    __calc:function(un){
        var keys = this.__attriNames = Object.getOwnPropertyNames(this.attris);
        //初始化指定属性的step
        for(var i=keys.length;i--;){//遍历引擎clone的对象，不包括引擎属性
            var key = keys[i];

            //没有该属性直接跳过
            var tKey = this.target[key];
            if(tKey===un)continue;

            var initVal = parseFloat(tKey||0);//修复初始值为字符的问题，会导致字符和数字相加，数值变大--2014.9.16
            var endVal = this.attris[key];
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
            this.__attr[key] = {'initVal':initVal,'varVal':varVal,'endVal':endVal};
            //inverse
            var varVal_inverse = (initVal-endVal);
            this.__attr_inverse[key] = {'initVal':endVal,'varVal':varVal_inverse,'endVal':initVal};


            //预计算。精度为10MS
            if(this.cacheable){
                this.__ratio = {};//用于传递给onupdate
                this.__ratio_inverse = {};

                var dVal = this.__attr[key].dVal = {};
                var dVal_inverse = this.__attr_inverse[key].dVal = {};
                for(var j=0;(j+=10)<this.duration;){
                    var r = this.easing(j,0,1,this.duration);
                    this.__ratio['p_'+j] = r;
                    dVal['p_'+j] = initVal + varVal*r;
                    //inverse
                    r = this.easing(j,0,1,this.duration);
                    this.__ratio_inverse['p_'+j] = r;
                    dVal_inverse['p_'+j] = endVal + varVal_inverse*r;
                }
            }

        }
    },
    /**
     * 启动补间器<br/>
     * *启动新的补间实例，会立即停止当前目标正在执行的补间
     * @return this
     */
    start:function(){
        this.__calc();
        this.__startTime = Date.now();

        if(this.target.__tween instanceof soya2d.Tween){
            this.target.__tween.stop();
        }

        this.target.__tween = this;

        soya2d.TweenManager.add(this);
        return this;
    },
    /**
     * 延迟启动补间器
     * @param {int} delay 延迟毫秒数
     * @return this
     */
    delay:function(delay){
        this.__delay = delay;
        return this;
    },
    /**
     * 停止补间器
     */
    stop:function(){
        soya2d.TweenManager.remove(this);
        return this;
    },
    /**
     * 跳转到指定间隔
     */
    goTo:function(target,time,un){
        var ratio,attNames=this.__attriNames,attr=this.__attr,t=target;
        //预计算
        if(this.cacheable){
            var phase = 'p_'+(time/10>>0)*10;
            ratio = this.__ratio[phase];
            if(phase==='p_0')ratio=0;
            if(ratio===un)ratio = 1;
            //更新参数
            for(var i=attNames.length;i--;){
                var k = attNames[i];
                if(!attr[k])continue;
                var v = attr[k].dVal[phase];
                if(v===un)v = attr[k].endVal;
                t[k] = v;
            }
        }else{
            ratio = this.easing(time,0,1,this.duration);
            if(time>this.duration)ratio=1;
            //更新参数
            for(var i=attNames.length;i--;){
                var k = attNames[i];
                if(attr[k])
                t[k] = attr[k].initVal + attr[k].varVal*ratio;
            }
        }
        return ratio;
    },
    /**
     * 更新补间实例
     */
    update:function(now,d){
        var c = now - this.__startTime;
        if(this.__delay > 0){
            this.__delay -= d;
            if(this.__delay <=0)this.__startTime = Date.now();
            return;
        }
        var t=this.target;
        var ratio = this.goTo(t,c);

        //判断结束
        if(c>=this.duration){
            if(this.onEnd)this.onEnd(t);
            //是否循环
			if(this.iteration===-1 ||
                (this.iteration>0 && this.__loops++ < this.iteration)){
                //重新计算
                this.__startTime = Date.now();
                if(this.alternate){
                    //替换属性
                    var tmp = this.__attr;
                    this.__attr = this.__attr_inverse;
                    this.__attr_inverse = tmp;
                    //替换缓存
                    tmp = this.__ratio;
                    this.__ratio = this.__ratio_inverse;
                    this.__ratio_inverse = tmp;
                }
                return;
            }
            //销毁
            this.destroy();
            soya2d.TweenManager.remove(this);

            if(this.__next){
                this.__next.start();
            }

            return;
        }
        //调用更新[target,ratio]
        if(this.onUpdate)this.onUpdate(t,ratio);
    },
    /**
     * 销毁补间实例，释放内存
     */
    destroy:function(){
        this.__attr = null;
        this.__ratio = null;
        this.attris = null;
        this.easing = null;
        this.target = null;
        this.onUpdate = null;
        this.onEnd = null;
    },
    /**
     * 设置当前补间完成后的下一个补间，进行链式执行<br/>
     * *如果当前补间设置了无限循环，永远不会进入下一个
     * @param  {soya2d.Tween} tween 下一个补间
     * @return this
     */
    next:function(tween){
        this.__next = tween;
        if(this.iteration===-1){
            soya2d.console.warn('invalid [next] setting on infinite loop instance...');
        }
        return this;
    }
};

/********* 扩展 **********/
soya2d.ext(soya2d.DisplayObject.prototype,/** @lends soya2d.DisplayObject.prototype */{
    /**
    * 播放补间动画
    * @param {Object} attris 补间目标属性
    * @param {int} duration 补间周期(ms)
    * @param {Object} [opts] 补间属性
    * @param {function} [opts.easing=soya2d.Tween.Linear] 补间类型
    * @param {boolean} [opts.cacheable=false] 是否缓存，启用缓存可以提高动画性能，但是动画过程会有些许误差
    * @param {int} [opts.iteration=0] 循环播放次数，-1为无限
    * @param {boolean} [opts.alternate=false] 是否交替反向播放动画，只在循环启用时生效
    * @param {function} [opts.onUpdate] 补间更新事件
    * @param {function} [opts.onEnd] 补间结束事件
    * @param {boolean} [si=true] 是否立即启动
    * @see {soya2d.Tween.Linear}
    * @return {soya2d.Tween} 补间实例
    * @requires tween
    */
	animate:function(attris,duration,opts,si){
        var tween = new soya2d.Tween(this,attris,duration,opts);
        si = si===false?false:si || true;
        if(si)tween.start();
		return tween;
	},
    /**
     * 停止当前对象正在执行的补间动画
     * @return {soya2d.DisplayObject} 
     * @requires tween
     */
    stopAnimation:function(){
        if(this.__tween){
            this.__tween.stop();
            delete this.__tween;
        }
        return this;
    }
});