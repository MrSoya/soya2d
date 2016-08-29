/**
 * 声音管理器类用来管理所绑定game实例中的所有音频，用于统一处理这些声音，
 * 包括静音、停止等。<br/>
 * 该类无需显式创建，引擎会自动绑定到game实例属性中。
 * @class soya2d.SoundManager
 */
soya2d.SoundManager = function(game){
    this.game = game;
    this.__sounds = game.assets.__assets.sound;
    /**
     * 设置所有声音的静音状态
     * @param {boolean} m 是否静音
     */
    this.muteAll = function(m){
        for(var k in this.__sounds){
            this.__sounds[k].mute(m);
        }
    };
    
    /**
     * 停止所有声音
     */
    this.stopAll = function(){
        for(var k in this.__sounds){
            this.__sounds[k].stop();
        }
    }
};