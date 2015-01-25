!function(){
    "use strict";

    /**
     * @classdesc 任务调度器，用来管理引擎所有定时任务<br/>
     * 该类为singleton实现，无法直接创建实例，需要通过{@link soya2d.getScheduler}方法获取
     * 唯一实例。
     * @class
     * @author {@link http://weibo.com/soya2d MrSoya}
     */
    function Scheduler(){
        var state = 1;//1.运行，2.暂停
        var triggerList = [];
        var taskMap = {};
        //安排任务
        /**
         * 把一个任务以及触发器，排进调度计划<br/>
         * 如果触发器之前已经被安排过，且并没有取消调度，那么会抛出异常
         * @param task
         * @param trigger
         */
        this.scheduleTask = function(task,trigger){
            if(trigger._taskKey){
                console.error('a trigger can only bind one task simultaneously');
            }
            taskMap[task.key] = task;//任务map
            trigger._taskKey = task.key;
            triggerList.push(trigger);
        }
        /**
         * 取消安排
         * @param taskKey
         */
        this.unscheduleTask = function(taskKey){
            delete taskMap[taskKey];
            var i=0;
            for(;i<triggerList.length;i++){
                if(triggerList[i]._taskKey == taskKey){
                    break;
                }
            }
            if(triggerList.length < 1)return;
            triggerList[i]._reset();
            triggerList.splice(i,1);
        }
        /**
         * 清除调度器
         */
        this.clear = function(){
            taskMap = {};
            for(var i=0;i<triggerList.length;i++){
                triggerList[i]._reset();
            }
            triggerList = [];
        }
        /**
         * 立即触发任务
         * @param taskKey 任务key
         */
        this.triggerTask = function(taskKey){
            if(taskMap[taskKey].cbk){
                taskMap[taskKey].cbk();
            }
        }
        /**
         * 调度器是否正在运行
         */
        this.isRunning = function(){
            return state===1?true:false;
        }
        /**
         * 暂停调度器
         */
        this.pause = function(){
            state = 2;
        }
        /**
         * 继续调度器
         */
        this.resume = function(){
            state = 1;
        }
        /**
         * 内部调用，检查所有触发器是否有可以触发的
         * @private
         */
        this._scanTasks = function(d){
            if(state===2)return;
            //排序触发器,从大到小
//            triggerList.sort(function(t1,t2){
//                return t1.priority - t2.priority;
//            });
            //扫描所有触发器
            var deleteTaskList = [];
            for(var i=triggerList.length;i--;){
                var trigger = triggerList[i];
                var task = taskMap[trigger._taskKey];
                var canTrigger = false;
                trigger.milliseconds += d;//毫秒数增加
                if(trigger.type === soya2d.TRIGGER_TYPE_FRAME){
                    trigger._frameCount++;//帧数++
                    if(trigger.canTrigger()){
                        canTrigger = true;
                        if(trigger._frameInfo.canTriggerTimes === 1)
                            deleteTaskList.push(task.key);
                    }
                }else if(trigger.type === soya2d.TRIGGER_TYPE_TIME){
                    var delta = trigger.milliseconds - trigger._lastTriggerMilliseconds;
                    //是否可触发
                    if(trigger.canTrigger() && delta>=1000){
                        canTrigger = true;
                        //重置触发时间
                        trigger._lastTriggerMilliseconds = trigger.milliseconds;
                    }
                    if(trigger._canUnload())deleteTaskList.push(task.key);
                }

                if(canTrigger && task.cbk){
                    trigger.times++;//触发次数加1
                    task.cbk(trigger.key,trigger.milliseconds,trigger.times,trigger._frameCount||trigger._t);
                }
            }
            //删除可以卸载的任务
            for(var i=deleteTaskList.length;i--;){
                this.unscheduleTask(deleteTaskList[i]);
            }
        }
    }

    var scheduler = new Scheduler();
    /**
     * 获取任务调度器
     * @return {Scheduler} 调度器
     */
    soya2d.getScheduler = function(){
        //singleton
        return scheduler;
    }

    /**
	 * 构造一个用于调度的任务。
	 * @classdesc 任务根据所绑定的触发器，在调度器中被调度。一个任务可以绑定多个触发器，进行多次调度
	 * @class 
	 * @param {string} key 任务唯一标识，用于取消调度或者立即触发等操作
     * @param {Function} cbk 回调函数，回调参数(触发器标识triggerKey,任务启动毫秒数milliseconds,触发次数times,当前帧数或者当前时间frameCount|[s,m,h])<br/>
     *										*如果手动触发任务，不会有任何回调参数被传递
	 * @author {@link http://weibo.com/soya2d MrSoya}
	 */
    soya2d.Task = function(key,cbk){
        "use strict";
        /**
         * 唯一标识符
         * @type {String}
         */
        this.key = key;
        /**
         * 回调函数
         * @type {Function}
         */
        this.cbk = cbk;
    }

    //触发器调用，解析表达式,并返回
    // [
    // interval,//间隔模式的间隔时长,以及单值模式的值
    // startOff,//间隔模式的启动偏移
    // triggerTimes,//总触发次数,-1为无限
    // values //多值模式，或者区间模式下存储所有合法值
    // ]
    function parseExp(exp){
        var i,so,tt,values;
        var tmp;
        if(exp == '*'){
            i = -1;//无间隔
            so = 0;
            tt = -1;
        }else if((so = parseInt(exp)) == exp){//匹配整数
            tt = 1;
            i = 0;
        }else if((tmp=exp.split('/')).length===2){//匹配间隔符&区间间隔
            i = parseInt(tmp[1]);
            var tmp2;
            if((tmp2=tmp[0].split('-')).length===2){//存在区间
                values = [];
                for(var s=tmp2[0]>>0,e=tmp2[1]>>0;s<=e;s++){
                    values.push(s);
                }
                values.sort(function(a,b){
                    return a-b;
                });
                tt = values.length;
            }else{
                if(!(so = parseInt(tmp[0]))){
                    so = 0;
                }
                tt = -1;
            }
        }else if((tmp=exp.split(',')).length>1){//匹配多值符
            values = [];
            for(var i=tmp.length;i--;){
                values.push(tmp[i]>>0);
            }
            values.sort(function(a,b){
                return a-b;
            });
            tt = tmp.length;
        }else if((tmp=exp.split('-')).length===2){//匹配区间符
            values = [];
            for(var s=tmp[0]>>0,e=tmp[1]>>0;s<=e;s++){
                values.push(s);
            }
            values.sort(function(a,b){
                return a-b;
            });
            tt = values.length;
        }
        return [i,so,tt,values];
    }
    //检测帧触发器是否可以触发
    function checkFrameTriggerable(fi,frames){
        //无限次数
        if(fi.canTriggerTimes === -1){
            if(fi.interval===-1)return true;
            var actValue = frames-fi.startOff;
            if(actValue === 0)return false;//防止0除数触发
            if(!(actValue % fi.interval))return true;
        }else if(fi.canTriggerTimes === 1){
            if(frames === fi.startOff)return true;
        }
        return false;
    }
    //检测时间触发器是否可以触发
    function checkTimeTriggerable(trigger){
        //换算时间
        var tmp = trigger.milliseconds/1000;
        var s = trigger._t[0] = tmp%60>>0;
        var m = trigger._t[1] = tmp/60%60>>0;
        var h = trigger._t[2] = tmp/60/60>>0;
        /////////////////// 计算每个段 ///////////////////
        if(!checkTimePart(trigger._timeInfo.hour,h))return false;
        if(!checkTimePart(trigger._timeInfo.min,m))return false;
        if(!checkTimePart(trigger._timeInfo.sec,s))return false;
        return true;
    }
    //检测时间每个部分是否OK
    function checkTimePart(part,v){
        if(part[2]===1){//只触发一次,计算值是否相同
            if(part[0]!==v)return false;
        }else if(part[2]===-1 && part[0]===-1){//无限
        }else if(part[3] && !part[0]){//多值
            if(part[3].indexOf(v)<0)return false;
        }else if((part[2]===-1 && part[0]>0) ||
                (part[0]>0 && part[3])){//间隔
            if(part[3] && part[3].indexOf(v)<0)return false;//间隔内的区间
            var actValue = v-part[1];
            if(actValue <= 0 && part[1]!=0)return false;//防止0除数触发
            if(actValue % part[0])return false;
        }
        return true;
    }


    /**
	 * 构造一个用于任务调度的触发器。
	 * @classdesc 触发器是调度器进行任务调度时，触发任务的依据。根据触发器提供的表达式，进行触发。一个触发器只能绑定一个任务。
	 * @class 
	 * @param {string} key 触发器标识，用于在任务回调中识别触发器
	 * @param {string} exp 触发器表达式，根据触发类型而定
	 * @param {int} [type=soya2d.TRIGGER_TYPE_FRAME] 触发类型，可以是时间触发或者帧触发
	 * @author {@link http://weibo.com/soya2d MrSoya}
	 */
    soya2d.Trigger = function(key,exp,type){
        /**
         * 触发器类型
         * @type {int}
         * @default soya2d.TRIGGER_TYPE_FRAME
         */
        this.type = type||soya2d.TRIGGER_TYPE_FRAME;
        /**
         * 触发表达式
         * @type {String}
         */
        this.exp = exp;
        /**
         * 触发器标识
         * @type {String}
         */
        this.key = key;
        /**
         * 触发次数
         * @type {Number}
         */
        this.times = 0;
        /**
         * 优先级
         * @type {Number}
         */
        this.priority = 0;
        /**
         * 从调度开始，到最近一次触发的毫秒数
         * @type {Number}
         */
        this.milliseconds = 0;
        //关联的任务key,有此属性时，如果被安排给另一个任务，报错
        this._taskKey;


        //帧模式下，总执行的帧数
        this._frameCount = 0;
        //上次触发毫秒数，相差不足1000，就不触发
        this._lastTriggerMilliseconds = -1000;
        //时间模式下，当前时间s,m,h
        this._t = [];
        //重置触发器
        this._reset = function(){
            this.times = 0;
            this._taskKey = null;
            this._frameCount = 0;
            this.milliseconds = 0;
            this._lastTriggerMilliseconds = -1000;
            this._t = [];
            delete this._frameInfo;
            delete this._timeInfo;
        }

        //是否可以卸载
        this._canUnload = function(){
            var h = this._timeInfo.hour;
            if(h[2] === 1){//单次
                if(this._t[2]>h[0])return true;
            }else if(h[2] > 1){//多次
                if(this._t[2]>h[3][h[3].length-1])return true;
            }
        }
        /**
         * 是否可以触发
         */
        this.canTrigger = function(){
            switch(this.type){
                case soya2d.TRIGGER_TYPE_FRAME:
                    return checkFrameTriggerable(this._frameInfo,this._frameCount);
                    break;
                case soya2d.TRIGGER_TYPE_TIME:
                    return checkTimeTriggerable(this);
                    break;
            }
        }

        /************ build trigger ************/
        //解析表达式
        switch(this.type){
            case soya2d.TRIGGER_TYPE_FRAME:
                if(!/^(\*|(?:(?:[0-9]+|\*)\/[0-9]+)|[0-9]+)$/.test(exp)){
                    soya2d.assert(false,'invalid trigger expression -- '+exp);
                }
                //解析帧信息
                var info = parseExp(RegExp.$1);
                this._frameInfo = {
                    canTriggerTimes:info[2],//可触发次数
                    startOff:info[1],//启动偏移
                    interval:info[0]//间隔
                };
                break;
            case soya2d.TRIGGER_TYPE_TIME:
                if(!/^(\*|(?:[0-9]+(?:,[0-9]+)*)|(?:[0-9]+-[0-9]+)|(?:(?:(?:[0-9]+(?:-[0-9]+)?)|\*)\/[0-9]+)) (\*|(?:[0-9]+(?:,[0-9]+)*)|(?:[0-9]+-[0-9]+)|(?:(?:(?:[0-9]+(?:-[0-9]+)?)|\*)\/[0-9]+)) (\*|(?:[0-9]+(?:,[0-9]+)*)|(?:[0-9]+-[0-9]+)|(?:(?:(?:[0-9]+(?:-[0-9]+)?)|\*)\/[0-9]+))$/.test(exp)){
                    soya2d.assert(false,'invalid trigger expression -- '+exp);
                }
                //解析时间信息
                var secInfo = parseExp(RegExp.$1);
                var minInfo = parseExp(RegExp.$2);
                var hourInfo = parseExp(RegExp.$3);
                this._timeInfo = {
                    sec:secInfo,
                    min:minInfo,
                    hour:hourInfo
                }
                break;
        }
    }
}();
/**
 * 调度触法类型，每帧
 * @type {Number}
 */
soya2d.TRIGGER_TYPE_FRAME = 1;
/**
 * 调度触法类型，时间
 * @type {Number}
 */
soya2d.TRIGGER_TYPE_TIME = 2;