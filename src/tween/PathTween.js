/**
     * @classdesc 路径补间类，用于创建路径动画<br/>
     * 该类提供了在周期时间内，按照指定补间类型进行“补间目标”路径的计算，并提供反馈的过程<br/>
     * @example
var MrSoya = new soya2d.Text({
    text:"Hi~~,i'm MrSoya"
});
var path = new soya2d.Path("M250 150 L150 350 L350 350 Z");
var pt = new soya2d.PathTween(MrSoya,
        path,
        1000,{easing:soya2d.Tween.Bounce.Out}
    );
    * @param {Object} target 需要进行对象
    * @param {soya2d.Path} path 路径实例
    * @param {int} duration 补间周期(ms)
    * @param {Object} opts 补间属性
    * @param {function} [opts.easing=soya2d.Tween.Linear] 补间类型
    * @param {int} [opts.iteration=0] 循环播放次数，-1为无限
    * @param {boolean} [opts.alternate=false] 是否交替反向播放动画，只在循环启用时生效
    * @param {function} [opts.onUpdate] 补间更新事件
    * @param {function} [opts.onEnd] 补间结束事件
    * @class
    * @see {soya2d.Tween.Linear}
    * @author {@link http://weibo.com/soya2d MrSoya}
    * @since 1.2.0
    */
soya2d.PathTween = function(target,path,duration,opts){

    this.__pps = [];
    this.__pps_inverse = [];

    this.path = path;
    this.target = target;
    this.duration = duration;

    opts = opts||{};
    this.easing = opts.easing||soya2d.Tween.Linear;
    this.iteration = opts.iteration||0;
    this.alternate = opts.alternate||false;

    /**
     * @name soya2d.PathTween#onUpdate
     * @desc  补间每运行一次时触发，this指向补间器
     * @param {Object} target 补间目标，可能为null
     * @param {Number} ratio 补间系数。当补间器运行时，会回传0-1之间的补间系数
     * @param {Number} angle 切线角
     * @event
     */
    this.onUpdate = opts.onUpdate;
    /**
     * @name soya2d.PathTween#onEnd
     * @desc  补间运行完触发，this指向补间器
     * @param {Object} target 补间目标
     * @event
     */
    this.onEnd = opts.onEnd;

    this.__loops = 0;

    this.__radian;
};
soya2d.PathTween.prototype = {
    __calc:function(un){
        var sx=0,sy=0;
        var ox=0,oy=0;
        this.path._insQ.forEach(function(ins){
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
                            this.__pps.push(x,y);
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
                                l = ks[s][3];
                                break;
                            }
                        }
                        if(r===0)continue;
                        var x = (i-s)*Math.cos(r) + nx;
                        var y = (i-s)*Math.sin(r) + ny;
                        ppsa.push(x,y);
                    }
                    
                    this.__pps = this.__pps.concat(ppsa);
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
                                l = ks[s][3];
                                break;
                            }
                        }
                        if(r===0)continue;
                        var x = (i-s)*Math.cos(r) + nx;
                        var y = (i-s)*Math.sin(r) + ny;
                        ppsa.push(x,y);
                    }
                    
                    this.__pps = this.__pps.concat(ppsa);
                    break;
                case 'z':
                    var r = Math.atan2(oy - sy,ox - sx);
                    var len = soya2d.Math.len2D(sx,sy,ox,oy);
 
                    for(var d=0;d<len;d++){
                        var x = d*Math.cos(r) + sx;
                        var y = d*Math.sin(r) + sy;
                        this.__pps.push(x,y);
                    }

                    break;
            }
        },this);

        for(var i=this.__pps.length-2;i>0;i-=2){
            this.__pps_inverse.push(this.__pps[i],this.__pps[i+1]);
        }
    },
    /**
     * 启动补间器<br/>
     * *启动新的补间实例，会立即停止当前目标正在执行的补间
     */
    start:function(){
        this.__calc();
        this.__startTime = Date.now();

        if(this.target.__pt instanceof soya2d.PathTween){
            this.target.__pt.stop();
        }

        this.target.__pt = this;

        soya2d.TweenManager.add(this);
        return this;
    },
    /**
     * 延迟启动补间器
     * @param {int} delay 延迟毫秒数
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
        var ratio,pps=this.__pps,t=target;
        
        ratio = this.easing(time,0,1,this.duration);
        if(time>this.duration)ratio=1;

        var i = (pps.length-2) * ratio >> 0;
        if(i>pps.length-2)i=pps.length-2;
        if(i<0)i *= -1;
        if(i%2!=0){
            i++;
        }
        
        t.x = pps[i];
        t.y = pps[i+1];

        var nx,ny;
        if(i<1){
            nx = pps[i+2];
            ny = pps[i+3];

            this.__radian = Math.atan2(ny-t.y,nx-t.x);
        }else{
            nx = pps[i-2];
            ny = pps[i-1];

            this.__radian = Math.atan2(t.y-ny,t.x-nx);
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

        if(c>=this.duration){
            if(this.onEnd)this.onEnd(t);
			if(this.iteration===-1 ||
                (this.iteration>0 && this.__loops++ < this.iteration)){
                this.__startTime = Date.now();
                if(this.alternate){
                    var tmp = this.__pps;
                    this.__pps = this.__pps_inverse;
                    this.__pps_inverse = tmp;
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

        if(this.onUpdate)this.onUpdate(t,ratio,this.__radian*soya2d.Math.ONEANG);
    },
    /**
     * 销毁补间实例，释放内存
     */
    destroy:function(){
        this.__pps = null;
        this.__pps_inverse = null;
        this.easing = null;
        this.target = null;
        this.onUpdate = null;
        this.onEnd = null;
    },/**
     * 设置当前补间完成后的下一个补间，进行链式执行<br/>
     * *如果当前补间设置了无限循环，永远不会进入下一个
     * @param  {soya2d.PathTween} tween 下一个补间
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
    * 播放路径补间动画
    * @param {soya2d.Path} path 路径
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
    * @return {soya2d.PathTween} 补间实例
    * @requires tween
    */
    pathAnimate:function(path,duration,opts,si){
        var tween = new soya2d.PathTween(this,path,duration,opts);
        si = si===false?false:si || true;
        if(si)tween.start();
        return tween;
    },
    /**
     * 停止当前对象正在执行的路径补间动画
     * @return {soya2d.DisplayObject} 
     * @requires tween
     */
    stopPathAnimation:function(){
        if(this.__pt){
            this.__pt.stop();
            delete this.__pt;
        }
        return this;
    }
});