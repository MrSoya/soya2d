;!function(){
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

        var threshold = 1000;
        /**
         * 内部调用，检查所有触发器是否有可以触发的
         * @private
         */
        this._scanTasks = function(d){
            if(state===2)return;

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
                    if(trigger.canTrigger() && delta>=threshold){
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