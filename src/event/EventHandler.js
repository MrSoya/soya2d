/**
 * @classdesc 事件处理器基类,所有具体的事件处理类都需要继承此类
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.EventHandler = function(){
    this.__eventMap = {};
    /**
     * 增加监听器
     * @param {string}   ev       事件类型
     * @param {Function} callback 回调函数
     * @param {Object}   context  事件源，触发上下文
     * @param {int}   order    触发顺序
     */
    this.addListener = function(ev,callback,context,order){
        if(!this.__eventMap[ev])this.__eventMap[ev]=[];
        this.__eventMap[ev].push({fn:callback,order:order||0,context:context});
    }
    /**
     * 删除监听器
     * @param  {string}   ev       事件类型
     * @param  {Function} callback 回调函数
     * @param  {Object}   context  事件源，触发上下文
     * @param  {int}   order    触发顺序
     */
    this.removeListener = function(ev,callback,context){
        if(!this.__eventMap[ev])return;

        var index = -1;
        for(var i=this.__eventMap[ev].length;i--;){
            if(context == this.__eventMap[ev].context && 
                (callback?this.__eventMap[ev].fn == callback:true)){
                index = i;
                break;
            }
        }
        if(index > -1)this.__eventMap[ev].splice(index,1);
    }

    /**
     * 清除事件监听
     * @param  {string} [ev] 事件类型。如果为空，清除该事件处理器下的所有监听器
     * @return {[type]}    [description]
     */
    this.clearListener = function(ev){
        if(ev){
            this.__eventMap[ev] = null;
            delete this.__eventMap[ev];
        }else{
            this.__eventMap = {};
        }
    }
}