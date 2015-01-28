/**
 * @classdesc 声音管理器类用来管理所绑定game实例中的所有音频，用于获取，创建，删除声音。<br/>
 * 该类无需显式创建，引擎会自动绑定到game实例属性中。
 * @class 
 * @extends soya2d.ResourceManager
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.SoundManager = function(){
    //继承
    soya2d.ResourceManager.call(this);

    function getBaseNames(urls){
        var rs = [];
        if(urls.forEach){
            urls.forEach(function(url){
                var baseName = url.split('.')[0];
                if(rs.indexOf(baseName) < 0)rs.push(baseName);
            });
        }
        return rs;
    }

    /**
     * 创建一个声音对象，并立即加载
     * @param {var} opts 创建参数对象，参数如下：
     * @param {Array} opts.urls 文件路径数组，可以指定不同的格式路径用于跨平台，比如：['sound.mp3','sound.ogg','sound.m4a']。文件前缀被称为标识，
        每次创建只支持一个标识，如果有多个，只识别第一个
     * @param {boolean} [opts.autoplay=false] 是否自动播放
     * @param {boolean} [opts.loop] 是否循环播放
     * @param {boolean} [opts.volume] 声音初始音量。0.0 - 1.0
     * @return {soya2d.Sound | null} 声音对象
     */
    this.create = function(opts){
        if(!opts)return null;
        if(!opts.urls || opts.urls.length<1)return null;

        var handler = new Howl(opts);
        var sound = new soya2d.Sound(opts);
        sound.__handler = handler;

        //put map
        var baseNames = getBaseNames(opts.urls);
        this.urlMap[baseNames[0]] = sound;

        return sound;
    };

    /**
     * 添加声音到管理器，用于loader
     * @private
     */
    this._add = function(src,res){
        if(typeof(src) == "string"){
            src = [src];
        }
        var baseNames = getBaseNames(src);
        this.urlMap[baseNames[0]] = res;
    };

    /**
     * 设置所有声音的静音状态
     * @param {boolean} m 是否静音
     */
    this.muteAll = function(m){
        for(var i in this.urlMap){
            var sound = this.urlMap[i];
            sound.mute(m);
        }
    };
    
    /**
     * 停止所有声音
     */
    this.stopAll = function(){
        for(var i in this.urlMap){
            var sound = this.urlMap[i];
            sound.stop();
        }
    }
};
soya2d.inherits(soya2d.SoundManager,soya2d.ResourceManager);