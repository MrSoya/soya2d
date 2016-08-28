/**
 * 引擎当前运行所在设备的信息<br/>
 * @class soya2d.Device
 * @static
 * @module system
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
     * @property iphone
     * @type {Boolean}
     */
    this.iphone = isIphone;
    /**
     * 是否为ipad
     * @property ipad
     * @type {Boolean}
     */
    this.ipad = isIpad;
    /**
     * 是否为ios
     * @property ios
     * @type {Boolean}
     */
    this.ios = isIphone || isIpad;
    /**
     * 是否为android
     * @property android
     * @type {Boolean}
     */
    this.android = isAndroid;
    /**
     * 是否为wp
     * @property wp
     * @type {Boolean}
     */
    this.wp = isWphone;
    /**
     * 是否移动系统
     * @property mobile
     * @type {Boolean}
     */
    this.mobile = this.ios || isAndroid || isWphone;

    //pc端信息
    /**
     * 是否为windows
     * @property windows
     * @type {Boolean}
     */
    this.windows = isWindows;
    /**
     * 是否为linux
     * @property linux
     * @type {Boolean}
     */
    this.linux = isLinux;
    /**
     * 是否为mac os
     * @property mac
     * @type {Boolean}
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
     * @property ie
     * @type {Boolean}
     */
    this.ie = /msie|trident.*rv:/.test(userAgent.toLowerCase());
    /**
     * 如果当前浏览器为FireFox，那么值为true。
     * @property ff
     * @type {Boolean}
     */
    this.ff = type.Firefox?true:false;
    /**
     * 如果当前浏览器为Opera，那么值为true。
     * @property opera
     * @type {Boolean}
     */
    this.opera = type.Opera?true:false;
    /**
     * 如果当前浏览器为Chrome，那么值为true。
     * @property chrome
     * @type {Boolean}
     */
    this.chrome = type.Chrome?true:false;
    /**
     * 如果当前浏览器为Safari，那么值为true。
     * @property safari
     * @type {Boolean}
     */
    this.safari = type.Safari?true:false;
};