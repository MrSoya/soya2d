/**
 * 构造一个用于调度的任务。
 * @classdesc 任务根据所绑定的触发器，在调度器中被调度。
 * 一个任务可以绑定多个触发器，进行多次调度。
 * @class 
 * @param {string} key 任务唯一标识，用于取消调度或者立即触发等操作
 * @param {function} cbk 回调函数，回调参数(触发器标识triggerKey,任务启动毫秒数milliseconds,触发次数times,当前帧数或者当前时间frameCount|[s,m,h])<br/>
 *										*如果手动触发任务，不会有任何回调参数被传递
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Task = function(key,cbk){
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