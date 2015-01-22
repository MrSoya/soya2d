/**
 * @classdesc 资源加载场景合并了资源加载和进度显示功能。
 * 提供了默认的加载进度效果。如果需要自定义加载效果，请重写onStart和onProgress函数
 * @class 
 * @extends soya2d.Scene
 * @param {Object} data 所有父类参数，以及新增参数，如下：
 * @param {soya2d.Scene} data.nextScene 加载完成后需要跳转的场景
 * @param {Array} data.textures 需要加载的纹理数组
 * @param {Array} data.texAtlas 需要加载的纹理集数组
 * @param {Array} data.sounds 需要加载的声音数组
 * @param {Array} data.fonts 需要加载的字体数组
 * @param {function(soya2d.Game,int)} data.onStart 开始加载回调,回调参数[game,length]
 * @param {Function} data.onProgress 加载时回调,回调参数[game,length,index]
 * @param {Function} data.onEnd 加载结束时回调,回调参数[game,length]
 * @author {@link http://weibo.com/soya2d soya哥}
 */
soya2d.LoaderScene = function(data){
    data = data||{};
    soya2d.Scene.call(this,data);
    soya2d.ext(this,data);
    
    this.nextScene = data.nextScene;
    if(!(this.nextScene instanceof soya2d.Scene)){
    	console.error('nextScene is not instance of soya2d.Scene');
    }
    this.textures = data.textures||[];
    this.texAtlas = data.texAtlas||[];
    this.sounds = data.sounds||[];
    this.scripts = data.scripts||[];
    this.fonts = data.fonts||[];

    var startCbk = data.onStart;
    var progressCbk = data.onProgress;
    var endCbk = data.onEnd;
    
    this.onInit = function(game){
    	//初始化时启动
    	var index = 0;
    	//资源总数
    	var allSize = this.textures.length +this.sounds.length +this.fonts.length;
    
		if(this.onStart)this.onStart(game,allSize);
		if(startCbk instanceof Function)startCbk(game,allSize);
		
		var loader = this;
    	game.loadRes({
			textures: this.textures,
			texAtlas:this.texAtlas,
			sounds: this.sounds,
			fonts: this.fonts,
			scripts: this.scripts,
			onLoad: function() {
				if(loader.onProgress)loader.onProgress(game,allSize,++index);
				if(progressCbk instanceof Function)progressCbk(game,allSize,index);
			},
			onEnd: function() {
				if(loader.onComplete)loader.onComplete(game,allSize);

				if(endCbk instanceof Function)endCbk(game,allSize);

				game.cutTo(loader.nextScene);
			}
		});
    };
    /**
	 * 资源开始加载时调用,默认初始化加载界面，包括soya2d的logo等。
	 * 如果需要修改加载样式，请重写该函数
	 * @abstract
	 * @param  {soya2d.Game} game  游戏实例
	 * @param  {int} length 资源总数
	 */
    this.onStart = function(game,length) {
    	var img = new Image();
		img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAA8CAYAAACNQSFVAAAFUklEQVR42r3Ye0xbVRwH8DvGQ8Zjo5TxKC8pLW1veY4xQCiyxTE3cIAmZov/INmSbWJ0MmcQZcYRAQFBGMhDGLQ8Op4trxLej4nDifMPY/aX+8dEM7M/pnFbJvf4u5dz66VrS1uKN/kG/uHTw/fcnnPuJQjrr104DpDdECeIC+Q5yJ7S1iC5ckbaol4i/9wO6ghxxqgbxOOtEn9J57S0U70k/weCtovuodGXc3mBbWPizwH8i0bZWIuyFTCoQEJ4Nw6J3+tZJH/noubwXQYwF3WFuEP2VqvCTnfNye4aQ03hpibLFffq+WljyGHVrGzZHGqIbzVZnu+WBUZ2TEn74S5YtwRmcbOTlZu/L6RtXFLXu0Q+shTl4g7GJis21t2nSSsu6l0k/7AW5eLsaPWTVdMnyuual/1iK8rF9aOtaA09BujqdlE9XtYcTJZcC42BO0ADk0XZC2bwjtnoe+pF8ok9UT1eO5ZCtU0foEdM2R2vHlFQ1SNpqH48mVLNRVM7gtP5YlRBNU0mUL2LkZTdcTa1Y6lU+3QcfMgO4GzqJ6Cq+ShqR/CNKNBXugTUsxBpMaqakd0rqgq6YAG+kZrRFNQ2FYfMVdU9J3tY2hxWw+cTcfCljLAYZ1M3noSUc1Gb0N4Fcv3L3vDhuCS3DEBjITKI0GqcrQruKqhKjpq1EWsn3+DlAZYMiYdEQsSQEBvxNFQxnISKu0WPXyvkVTo6EgrAEiF0HSQzaoIItBqv1KaiK2o5uqQM1Oft5oC7R/L2nuVUEgYRWIxXaRWodOAAuqwK2QSzKVQKqPP1frrYY25HrBp5+XAiKuoWGUWNfMjfZ6t96wQSF7FZvFKTikrUpEWoYcoGZb8axekKrvbHmazAXIp7wpBq/kU09UPus9/QsiG6gnCr0fdVQahh4iDSfZ+Npu+8ykSPV2pSoAKZbRUMkUjz7XE9+v/gnw3GU1f7Y2zq9+PeMNS1kM70awgz+DutgjFr0cvQb6PuEJpcyzaK6nHhQdeg/CrfDws7BA8sgSuG5Uh764RZVI/D5QXxk6c6R52r9VVe6hQ8NVqBWoh6Fg+brMAU7gnhM2sBrAlppzyyChr9Vv6rIBhWwESoIMdilIu7s6OHBOPlMvKVAt7F8gHZw5HVTKtRLk4fkfdB9jOLDSw6p87zs74ek3yjXoqEW0wBVeRsG/c5muMlb9KIO9SL8qfcnebGcgwa/e4lq/pm8IwMT55YTPAbBsRFPQvkA3Mb78DNeDRx+4TlOOzUE1s92xhmeCUZJvjk1ritJ9sbS1FodDWdMlcVsd1jc//NOGridobRDyHsdSYfXDlETa5lUTuCb9xVckpzK5WaupNN2R1n07ccTcGtu74j+HWd5MdzHwS8ble8a1b220c1IUXwhZRDRHbB4cv3qKJD2CIId0zC8MZxbns4STUMiCbTMz2PAxYFkULCGZgg/G3G23XSn/Iv+r4JSAwebQQ+xgXhFdbbalw5I71fXBtc4uTEnAvpE60EH9/o0Qbg1ZVewj0sxqHXx5VKYZswwvEFTgUiSCheqn2Z0cLjPd4jXC3ASQqW4amj2V6Z8AfR+IhMT9jznAr4eNn2wI/6LsyLCnP49UnJz2cK/c8Y9CrEO5Y/vQdAeHirdMOvUpzxy4rdRvHuWdn9T66FXoFeWVTCuQsEuFfepgrY0W68t3Fg3uNwcXi2eVLfF94ii3ZNwId4FjXs9dkKNkbrwHnrRABOb2kkBRVMnL7go8BYOP73WdRYr5srMITpq1krKihvD83GgABPUiD+3Q/36mWyV2Mo5/LAI/LG0H78k49R872aQOnrX0x6RNKVlPmnAAAAAElFTkSuQmCC';
		var tex = soya2d.Texture.fromImage(img);
		this.logo = new soya2d.Sprite({
			x: game.w/2 - tex.w/2,
			y: game.h/2 - tex.h/2 - 20,
			textures:tex
		});
		this.add(this.logo);

		var font = new soya2d.Font('normal 400 23px/normal Arial,Helvetica,sans-serif');
		this.tip = new soya2d.Text({
			x: this.logo.x - 70,
			y: this.logo.y + tex.h + 10,
			font:font,
			text:'Loading... 0/0',
			w:200,
			fillStyle: this.fillStyle || '#fff'
		});
		this.add(this.tip);
	};
	/**
	 * 资源加载时调用,默认显示loading...字符。如果需要修改加载样式，请重写该函数
	 * @abstract
	 * @param  {soya2d.Game} game  游戏实例
	 * @param  {int} length 资源总数
	 * @param  {int} index  当前加载索引
	 */
	this.onProgress = function(game,length,index) {
		this.tip.setText('Loading... '+index+'/'+length);
	};
};
soya2d.inherits(soya2d.LoaderScene,soya2d.Scene);