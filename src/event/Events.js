/**
 * @classdesc 事件组用于管理一个soya2d.Game实例内的所有事件的启动，停止，和触法。<br/>
 * 该类无需开发者显式创建，引擎会自动管理
 * @class
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Events = function(){
    
    var evts = [];
    /**
     * 注册一个事件处理器，以及能处理的事件类型,用于扩展事件处理模块
     * @param  {Array} events  事件数组
     * @param  {Object} handler 事件处理器
     */
    this.register = function(events,handler){
        evts.push([events,handler]);
    }

    //扫描是否有事件需要触发
    this.scan = function(){
        for(var i=evts.length;i--;){
            evts[i][1].scan();
        }
    }

    /**
     * 启动所有事件监听
     * @param {soya2d.Game} game 游戏实例
     * @return this
     */
    this.startListen = function(game){
        for(var i=evts.length;i--;){
            evts[i][1].startListen(game);
        }

        return this;
    }

    /**
     * 停止所有事件监听
     * @param {soya2d.Game} game 游戏实例
     * @return this
     */
    this.stopListen = function(game){
        for(var i=evts.length;i--;){
            evts[i][1].stopListen(game);
        }

        return this;
    }
    /**
     * 增加事件监听
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数
     * @param {Object} context 回调函数的上下文，通常会是事件触发的主体
     * @param {int} order 触发顺序，值越大越先触发
     */
    this.addListener = function(events,callback,context,order){
    	var evs = events.split(' ');
        for(var i=evs.length;i--;){
            var ev = evs[i];

            for(var j=evts.length;j--;){
                if(evts[j][0].indexOf(ev)>-1){
                    evts[j][1].addListener(ev,callback,context,order);
                    break;
                }
            }
        }
    }
    /**
     * 删除事件监听
     * @param {string} events 一个或多个用空格分隔的事件类型
     * @param {Function} callback 回调函数，可选。如果该参数为空。则删除指定类型下所有监听
     */
    this.removeListener = function(events,callback,context){
    	var evs = events.split(' ');
        for(var i=evs.length;i--;){
            var ev = evs[i];

            for(var j=evts.length;j--;){
                if(evts[j][0].indexOf(ev)>-1){
                    evts[j][1].removeListener(ev,callback,context);
                    break;
                }
            }
        }
    }
}