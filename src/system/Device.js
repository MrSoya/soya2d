/**
 * 引擎当前运行所在设备的信息<br/>
 * @namespace soya2d.Device
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Device = new function(){
  	var userAgent = this.userAgent = self.navigator.userAgent.toLowerCase();

    var isWindows = userAgent.indexOf('windows')>0?true:false;
    var isLinux = userAgent.indexOf('linux')>0?true:false;
    var isMacOS = userAgent.indexOf('mac os')>0?true:false;
    var isAndroid = userAgent.indexOf('android')>0?true:false;
    var isIphone = userAgent.indexOf('iphone')>0?true:false;
    var isIpad = userAgent.indexOf('ipad')>0?true:false;
    var isWphone = userAgent.indexOf('windows phone')>0?true:false;

    //移动端信息
    /**
     * 是否为iphone
     * @type {boolean}
     */
    this.iphone = isIphone;
    /**
     * 是否为ipad
     * @type {boolean}
     */
    this.ipad = isIpad;
    /**
     * 是否为ios
     * @type {boolean}
     */
    this.ios = isIphone || isIpad;
    /**
     * 是否为android
     * @type {boolean}
     */
    this.android = isAndroid;
    /**
     * 是否为wp
     * @type {boolean}
     */
    this.wp = isWphone;
    /**
     * 是否移动系统
     * @type {boolean}
     */
    this.mobile = this.ios || isAndroid || isWphone;

    //pc端信息
    /**
     * 是否为windows
     * @type {boolean}
     */
    this.windows = isWindows;
    /**
     * 是否为linux
     * @type {boolean}
     */
    this.linux = isLinux;
    /**
     * 是否为mac os
     * @type {boolean}
     */
    this.mac = isMacOS;

    //浏览器信息
    var type = {
      Firefox:userAgent.indexOf('firefox')+1,
      Opera:userAgent.indexOf('opera')+1,
      Chrome:userAgent.indexOf('chrome')+1,
      Safari:userAgent.indexOf('safari')>-1 && userAgent.indexOf('chrome')<0
    };
    /**
     * 如果当前浏览器为IE，那么值为true。
     * @type boolean
     */
    this.ie = /msie|trident.*rv:/.test(userAgent.toLowerCase());
    /**
     * 如果当前浏览器为FireFox，那么值为true。
     * @type boolean
     */
    this.ff = type.Firefox?true:false;
    /**
     * 如果当前浏览器为Opera，那么值为true。
     * @type boolean
     */
    this.opera = type.Opera?true:false;
    /**
     * 如果当前浏览器为Chrome，那么值为true。
     * @type boolean
     */
    this.chrome = type.Chrome?true:false;
    /**
     * 如果当前浏览器为Safari，那么值为true。
     * @type boolean
     */
    this.safari = type.Safari?true:false;
};