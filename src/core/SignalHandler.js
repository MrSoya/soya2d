/**
 * 信号类用来实现soya2D内部的消息系统
 * @class SignalHandler
 */
function SignalHandler(){
    this.map = {};
}
SignalHandler.prototype = {
    on:function(type,cbk,order,context){
        var ts = type.replace(/\s+/mg,' ').split(' ');
        for(var i=ts.length;i--;){
            var listeners = this.map[ts[i]];
            if(!listeners)listeners = this.map[ts[i]] = [];
            listeners.push([cbk,context,order]);
        }
    },
    once:function(type,cbk,order,context){
        var ts = type.replace(/\s+/mg,' ').split(' ');
        for(var i=ts.length;i--;){
            var listeners = this.map[ts[i]];
            if(!listeners)listeners = this.map[ts[i]] = [];
            listeners.push([cbk,context,order,true]);
        }
    },
    off:function(type,cbk,context){
        var types = null;
        if(!type){
            types = Object.keys(this.map);
        }else{
            types = type.replace(/\s+/mg,' ').split(' ');
        }

        for(var i=types.length;i--;){
            var listeners = this.map[types[i]];
            if(listeners){
                var toDel = [];
                for(var j=listeners.length;j--;){
                    if(context === listeners[j][1] && 
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
    },
    //type,src
    emit:function(){
        var listeners = this.map[arguments[0]];
        if(!listeners)return;
        
        var target = arguments[1];
        var params = [target];
        for(var i=2;i<arguments.length;i++){
            params.push(arguments[i]);
        }

        listeners.sort(function(a,b){
            return b[2] - a[2];
        });

        listeners.filter(function(item){
            if(item[1] === target)
                item[0].apply(item[1],params);
        });
        var last = listeners.filter(function(item){
            if(!item[3])return true;
        });

        this.map[arguments[0]] = last;
    }
}