/**
 * 图像集通过精灵表(ssheet)自动切割出多个小图，并按照topLeft-bottomRight的方式，
 * 索引从0-n和小图对应。
 * ssheet格式为<br/>
 * ```
 * [
 		{n:'hero_001.png',x:0,y:0,w:50,h:50,r:90},//ssheet unit，index 0
 		{n:'hero_002.png',x:50,y:50,w:50,h:50,r:180},//index 1
 		...
 	]
 	```
 * r:将指定部分资源旋转指定角度后，形成新纹理
 * @class soya2d.Atlas
 * @constructor
 * @param {HTMLImageElement} image 大图纹理
 * @param {Object} ssheet 图像集描述
 * 
 */
soya2d.Atlas = function(image,ssheet){
	this.texs = {};//纹理集
	ssheet.forEach(function(desc){
		var data = document.createElement('canvas');
		data.width = desc.w;
		data.height = desc.h;
		var ctx = data.getContext('2d');
		ctx.translate(desc.w/2,desc.h/2);
		ctx.rotate((desc.r||0)*Math.PI/180);

		var descW = desc.w>>0,
			descH = desc.h>>0;
		if(descW===0 || descH===0){
			soya2d.console.error('soya2d.Atlas: invalid ssheet unit，w/h must be a positive;[w:'+descW+',h:'+descH+'] ');
			return;
		}
		ctx.drawImage(image,
						desc.x>>0,desc.y>>0,descW,descH,
						-descW/2>>0,-descH/2>>0,descW,descH);
		this.texs[desc.n] = data;
	},this);
};

soya2d.Atlas.prototype = {
	/**
	 * 返回由一个指定的字符串开始按字母排序的所有纹理
	 * @method getAll
	 * @param  {String} prefix 前缀
	 * @return {Array}
	 */
	getAll:function(prefix){
		var rs = [];
		for(var i in this.texs){
			if(!prefix || prefix==='*' || (prefix && i.indexOf(prefix)===0))
				rs.push(this.texs[i]);
		}
		
		return rs;
	},
	/**
	 * 通过索引区间获取图像帧数组
	 * @method getByIndex
	 * @param  {Number} s 开始索引
	 * @param  {Number} e 结束索引
	 * @return {Array} 
	 */
	getByIndex:function(s,e){
		var rs = [];
		var ks = Object.keys(this.texs);
		for(var i=s;i<=e;i++){
			var t = this.texs[ks[i]];
			rs.push(t);
		}
		return rs;
	},
	/**
	 * 通过图像帧名称获取对应图像帧
	 * @method get
	 * @param  {String} name 在ssheet中指定的n
	 * @return {HTMLImageElement}
	 */
	get:function(name){
		return this.texs[name];
	},
	/**
	 * 释放图像集数据
	 * @method destroy
	 */
	destroy:function(){
		this.texs = null;
	}
};



