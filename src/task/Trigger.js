;!function(){
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
                    console.error('invalid trigger expression -- '+exp);
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
                    console.error('invalid trigger expression -- '+exp);
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
}();