/**
 * 信号类用来实现soya2D内部的消息系统。
 * 同时，对于自定义全局消息，也可以直接创建信号通道进行通信
 * 
 * @class soya2d.Signal
 */

var Signal = soya2d.Signal = function (){
    this.__sigmap = {};
}
soya2d.Signal.prototype = {
    /**
     * 监听一个信号
     * @method on
     * @param {String} type 信号类型，多个类型使用空格分割
     * @param {Function} cbk 回调函数，回调参数和emit时所传参数一致
     * @param {Object} [context] 函数执行上下文
     * @chainable
     */
    on:function(type,cbk,context){
        var ts = type.replace(/\s+/mg,' ').split(' ');
        for(var i=ts.length;i--;){
            var listeners = this.__sigmap[ts[i]];
            if(!listeners)listeners = this.__sigmap[ts[i]] = [];
            listeners.push([cbk,context||this]);
        }
        return this;
    },
    /**
     * 监听一个信号一次
     * @method once
     * @param {String} type 信号类型，多个类型使用空格分割
     * @param {Function} cbk 回调函数
     * @param {Object} [context] 函数执行上下文
     * @chainable
     */
    once:function(type,cbk,context){
        var ts = type.replace(/\s+/mg,' ').split(' ');
        for(var i=ts.length;i--;){
            var listeners = this.__sigmap[ts[i]];
            if(!listeners)listeners = this.__sigmap[ts[i]] = [];
            listeners.push([cbk,context||this,true]);
        }
        return this;
    },
    /**
     * 取消监听
     * @method off
     * @param {String} [type] 信号类型，多个类型使用空格分割。如果为空，删除所有信号监听
     * @param {Function} [cbk] 监听时的函数引用。如果为空，删除该类型下所有监听
     * @param {Object} [context] 函数执行上下文
     * @chainable
     */
    off:function(type,cbk,context){
        var types = null;
        if(!type){
            types = Object.keys(this.__sigmap);
        }else{
            types = type.replace(/\s+/mg,' ').split(' ');
        }

        for(var i=types.length;i--;){
            var listeners = this.__sigmap[types[i]];
            if(listeners){
                var toDel = [];
                for(var j=listeners.length;j--;){
                    if((context||this) === listeners[j][1] && 
                        (cbk?listeners[j][0] === cbk:true)){
                        toDel.push(listeners[j]);
                    }
                }
                toDel.forEach(function(listener){
                    var index = listeners.indexOf(listener);
                    listeners.splice(index,1);
                });
            }
        }
        return this
    },
    /**
     * 发射指定类型信号
     * @method emit
     * @param {String} type 信号类型
     * @param {...} params 不定类型和数量的参数
     * @chainable
     */
    emit:function(){
        console.log(arguments[0])
        var listeners = this.__sigmap[arguments[0]];
        if(!listeners)return;        
        
        var target = this;
        var params = [];
        for(var i=1;i<arguments.length;i++){
            params.push(arguments[i]);
        }

        listeners.filter(function(item){
            item[0].apply(item[1],params);
        });
        var last = listeners.filter(function(item){
            if(!item[2])return true;
        });

        this.__sigmap[arguments[0]] = last;

        return this;
    }
}
