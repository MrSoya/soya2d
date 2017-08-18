/**
 * 定时器。基于[秒 分 时]进行调度,支持η表达式，可以创建复杂的定时任务。
 * η表达式基于和主循环同步的时间机制，误差在1个FPS之内。
 * 语法：
 * <table>
 *     <tr>
 *         <th>type</th><th>range</th><th>sym</th><th>desc</th>
 *     </tr>
      <tr>
          <td>Sec</td><td>0-59</td><td>* / , -</td>
          <td>
                ** 每秒触发<br>
                10 第10秒触发<br>
                20-40 第20到40秒触发<br>
                0-50/5 第0到50秒，每5秒触发<br>
                0/1 每秒触发<br>
                0/15 每15秒触发<br>
                5,25,50 第5/25/50秒触发<br>
          </td>
      </tr>
      <tr>
          <td>Min</td><td>0-59</td><td>* / , -</td>
          <td>
              同上
          </td>
      </tr>
      <tr>
          <td>Hou</td><td>0-n</td><td>* / , -</td>
          <td>
              同上
          </td>
      </tr>
 * </table>
 
 * <p>例子</p>

| exp        | desc|
| :------------- |:-------------|
| * 2 *      | 每小时第2分钟到3分钟，每秒触发 |
| 45 * 2     | 第2个小时每分钟第45秒触发 |
| 45 * *     | 每分钟第45秒触发 |
| 0 2 *      | 每小时第2分钟触发 |
| 0 0 *      | 每小时触发一次 |
| 0/5 4 *      | 每小时第4分钟，从0秒开始，每隔5秒触发 |
| 5/15 4,14,28 *      | 每小时第4/14/28分钟，第5秒开始，每15秒触发 |
| 5-10 * *      | 每分钟第5到10秒触发 |

 * 
 * @class Timer
 * @extends Signal
 * @constructor
 */
var Timer = soya2d.class('',{
    extends:Signal,
    constructor:function(){
        this.triggerList = [];
        this.expMap = {};
        this.threshold = 1000;
    },
    /**
     * 添加一个定时器
     * @method on
     * @param  {String} exp  表达式，必须用中括号包裹 [* * *]
     * @param  {Function} cbk  回调函数，回调参数[milliseconds,times,[s,m,h]]
     * @param  {Object} [context] 上下文
     * @return this
     */
    on:function(exp,cbk,context){
        var that = this;
        exp = exp.replace(/\[(.*?)\]/mg,function(all,ex){
            if(!that.expMap[ex]){
                var t = new TimerTrigger(ex);
                that.triggerList.push(t);
                that.expMap[ex] = t;
            }
            return ex.replace(/\s+/mg,'_');
        });
        
        return this._super.on.call(this,exp,cbk,context);
    },
    /**
     * 添加一个定时器，只执行一次
     * @method once
     * @param  {String} exp  表达式，必须用中括号包裹 [* * *]
     * @param  {Function} cbk  回调函数，回调参数[milliseconds,times,[s,m,h]]
     * @param  @param  {Object} [context] 上下文
     * @return this
     */
    once:function(exp,cbk,context){
        var that = this;
        exp = exp.replace(/\[(.*?)\]/mg,function(all,ex){
            if(!that.expMap[ex]){
                var t = new TimerTrigger(ex);
                that.triggerList.push(t);
                that.expMap[ex] = t;
            }
            return ex.replace(/\s+/mg,'_');
        });
        return this._super.once.call(this,exp,cbk,context);
    },
    /**
     * 取消一个定时器
     * @method off
     * @param  {String} exp  表达式，必须用中括号包裹 [* * *]
     * @param  {Function} cbk  回调函数
     */
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
    //内部调用，检查所有触发器是否有可以触发的
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
