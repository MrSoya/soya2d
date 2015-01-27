
soya2d.module.install('task',{
    onInit:function(game){
        /**
		 * 添加一个任务，可以指定任务执行的频率和方式
		 * @param {Function} fn 任务回调函数,回调参数(当前游戏对象实例game,任务执行的毫秒数milliseconds,执行次数times)
		 * @param {string} triggerExp 调度表达式，根据调度类型决定。默认每帧触发
		 * @param {int} triggerType 调度类型，默认帧调度
		 * @return {string} taskId 任务标识，用于删除任务
		 * @see {soya2d.TRIGGER_TYPE_FRAME}
		 * @see {soya2d.Trigger}
		 * @memberOf! soya2d.Game#
         * @alias addTask
		 * @requires task
		 */
		game.addTask = function(fn,triggerExp,triggerType){
			var taskId = 'soya_task_'+Date.now()+Math.random()*999;
			var scheduler = soya2d.getScheduler();
			var g = this;
			var task = new soya2d.Task(taskId,function(trigger,ms,times,tag){
				if(fn && fn.call)fn(g,triggerExp||'*',ms,times,tag);
			});
			var trigger = new soya2d.Trigger(taskId+'_trigger',triggerExp||'*',triggerType);
			scheduler.scheduleTask(task,trigger);

			return taskId;
		}

		/**
		 * 删除任务
		 * @param  {string} taskId 需要删除的任务id
		 * @memberOf! soya2d.Game#
         * @alias removeTask
		 * @requires task
		 */
		game.removeTask = function(taskId){
			var scheduler = soya2d.getScheduler();
			scheduler.unscheduleTask(taskId);
		}
    },
    onUpdate:function(game,now,d){
    	var scheduler = soya2d.getScheduler();
        scheduler._scanTasks(d<0?-d:d);
    }
});