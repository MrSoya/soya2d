/**
 * 定时器
 * 
 * @class Timer
 */
var Timer = soya2d.class('',{
    extends:Signal,
    constructor:function(){
        this.__signalHandler = new SignalHandler();
        this.triggerList = [];
        this.expMap = {};
        this.threshold = 1000;
    },
    on:function(exp,cbk,order){
        var that = this;
        exp = exp.replace(/\[(.*?)\]/mg,function(all,ex){
            if(!that.expMap[ex]){
                var t = new TimerTrigger(ex);
                that.triggerList.push(t);
                that.expMap[ex] = t;
            }
            return ex.replace(/\s+/mg,'_');
        });
        
        return this._super.on.call(this,exp,cbk,order);
    },
    once:function(exp,cbk,order){
        var that = this;
        exp = exp.replace(/\[(.*?)\]/mg,function(all,ex){
            if(!that.expMap[ex]){
                var t = new TimerTrigger(ex);
                that.triggerList.push(t);
                that.expMap[ex] = t;
            }
            return ex.replace(/\s+/mg,'_');
        });
        return this._super.once.call(this,exp,cbk,order);
    },
    off:function(exp,cbk){
        var exArray = [];
        exp = exp.replace(/\[(.*?)\]/mg,function(all,ex){
            exArray.push(ex);
            return ex.replace(/\s+/mg,'_');
        });
        this._super.off.call(this,exp,cbk);
        exArray.forEach(function(ex){
            var cbks = this.__signalHandler.map[ex.replace(/\s+/mg,'_')];
            if(Object.keys(cbks).length<1){
                this.expMap[ex] = null;
                this.__removeTrigger(ex);
            }
        },this);
    },
    /**
     * 内部调用，检查所有触发器是否有可以触发的
     * @private
     */
    __scan : function(d){
        //扫描所有触发器
        var deleteTriggerList = [];
        var deleteExp = [];
        for(var i=this.triggerList.length;i--;){
            var trigger = this.triggerList[i];
            var tasks = this.__signalHandler.map[trigger.exp.replace(/\s+/mg,'_')];
            var canTrigger = false;
            trigger.milliseconds += d;//毫秒数增加
            var delta = trigger.milliseconds - trigger._lastTriggerMilliseconds;
            //是否可触发
            if(trigger.canTrigger() && delta>=this.threshold){
                canTrigger = true;
                //重置触发时间
                trigger._lastTriggerMilliseconds = trigger.milliseconds;
            }
            if(trigger._canUnload())deleteTriggerList.push(trigger.exp);

            if(canTrigger){
                trigger.times++;//触发次数加1
                tasks.forEach(function(task,ti){
                    if(task[3]){
                        deleteExp.push([trigger.exp,task[0]]);
                    }
                    task[0].call(this,trigger.milliseconds,trigger.times,trigger._t);
                },this);
            }
        }
        //删除可以卸载的任务
        for(var i=deleteTriggerList.length;i--;){
            this.__removeTrigger(deleteTriggerList[i]);
        }

        for(var i=deleteExp.length;i--;){
            this.off(deleteExp[i][0],deleteExp[i][1]);
        }
    },
    __removeTrigger:function(exp){
        for(var i=this.triggerList.length;i--;){
            var trigger = this.triggerList[i];
            if(trigger.exp === exp){
                break;
            }
        }
        this.triggerList.splice(i,1);
    }
});
