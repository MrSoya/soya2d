/**
 * 图像集是一个将许多小的图像整合到一张大图中，可以从图像集中快速的读取指定部分的图像，从而加速动画的渲染。
 * ssheet格式为<br/>
 * <pre>
 * [
 		{n:'hero_001.png',x:0,y:0,w:50,h:50,r:90},//ssheet unit
 		{n:'hero_002.png',x:50,y:50,w:50,h:50,r:180},
 		...
 	]
 	</pre>
 * r:将指定部分资源旋转指定角度后，形成新纹理
 * @class soya2d.Atlas
 * @constructor
 * @param {Image} image 大图纹理
 * @param {Object} ssheet 图像集描述
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
	 * @param  {[type]} prefix [description]
	 * @return {[type]}        [description]
	 */
	getAll:function(prefix){
		var rs = [];
		for(var i in this.texs){
			if(!prefix || prefix==='*' || (prefix && i.indexOf(prefix)===0))
				rs.push(this.texs[i]);
		}
		
		return rs;
	},
	getByIndex:function(s,e){
		var rs = [];
		var ks = Object.keys(this.texs);
		for(var i=s;i<=e;i++){
			var t = this.texs[ks[i]];
			rs.push(t);
		}
		return rs;
	},
	get:function(name){
		return this.texs[name];
	},
	/**
	 * 释放图像集数据
	 */
	destroy:function(){
		this.texs = null;
	}
};



