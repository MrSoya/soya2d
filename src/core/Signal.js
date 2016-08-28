/**
 * 信号类用来实现soya2D内部的消息系统
 * 
 * @class Signal
 */

function Signal(){
    // this.__signalHandler;
}
Signal.prototype = {
    /**
     * 监听一个信号
     * @method on
     * @param {String} type 信号类型，多个类型使用空格分割
     * @param {Function} cbk 回调函数，回调参数[target,...]
     * @param {int} order 触发序号，越大的值越先触发
     * @return this
     */
    on:function(type,cbk,order){
        if(this instanceof soya2d.DisplayObject){
            switch(type){
                case 'pointdown':
                    type = soya2d.Device.mobile?'touchstart':'mousedown';
                    break;
                case 'pointmove':
                    type = soya2d.Device.mobile?'touchmove':'mousemove';
                    break;
                case 'pointup':
                    type = soya2d.Device.mobile?'touchend':'mouseup';
                    break;
            }
        }
        this.__signalHandler.on(type,cbk,order,this);
        return this;
    },
    /**
     * 监听一个信号一次
     * @method once
     * @param {String} type 信号类型，多个类型使用空格分割
     * @param {Function} cbk 回调函数
     * @param {int} order 触发序号，越大的值越先触发
     * @return this
     */
    once:function(type,cbk,order){
        this.__signalHandler.once(type,cbk,order,this);
        return this;
    },
    /**
     * 取消监听
     * @method off
     * @param {String} [type] 信号类型，多个类型使用空格分割。如果为空，删除所有信号监听
     * @param {Function} [cbk] 监听时的函数引用。如果为空，删除该类型下所有监听
     */
    off:function(type,cbk){
        this.__signalHandler.off(type,cbk,this);
    },
    /**
     * 发射指定类型信号
     * @method emit
     * @param {String} type 信号类型
     * @param {...} params 不定类型和数量的参数
     */
    emit:function(){
        var params = [arguments[0],this];
        for(var i=1;i<arguments.length;i++){
            params.push(arguments[i]);
        }
        this.__signalHandler.emit.apply(this.__signalHandler,params);
        return this;
    }
}
