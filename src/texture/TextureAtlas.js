/**
 * @classdesc 纹理集是一个将许多小的纹理整合到一张大图中，可以从纹理集中快速的读取指定部分的纹理，从而加速动画的渲染。
 * ssheet格式为<br/>
 * <pre>
 * [
 		{n:'hero_001.png',x:0,y:0,w:50,h:50,r:90},//ssheet unit
 		{n:'hero_002.png',x:50,y:50,w:50,h:50,r:180},
 		...
 	]
 	</pre>
 * r:将指定部分资源旋转指定角度后，行程新纹理
 * @class 
 * @param {soya2d.Texture} tex 大图纹理
 * @param {json} ssheet 纹理集描述
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.TextureAtlas = function(tex,ssheet){
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
			console.error('soya2d.TextureAtlas: invalid ssheet unit，w/h must be a positive;[w:'+descW+',h:'+descH+'] ');
			return;
		}
		ctx.drawImage(tex.__data,
						desc.x>>0,desc.y>>0,descW,descH,
						-descW/2>>0,-descH/2>>0,descW,descH);
		this.texs[desc.n] = new soya2d.Texture(data,descW,descH);
	},this);
};

soya2d.TextureAtlas.prototype = {
	/**
	 * 返回由一个指定的字符串开始按字母排序的所有纹理
	 */
	getTextures:function(prefix){
		var rs = [];
		for(var i in this.texs){
			if(i.indexOf(prefix)===0)rs.push(this.texs[i]);
		}
		return rs;
	},
	getTexture:function(name){
		return this.texs[name];
	},
	/**
	 * 释放纹理集数据
	 */
	dispose:function(){
		for(var i in this.texs){
			this.texs[i].dispose();
		}
		this.texs = null;
	}
};



