/**
 * 创建一个纹理对象
 * @classdesc 纹理是用来储存展示图像的矩形。它不能直接被渲染，必须映射到一个显示对象上。比如Image。
 * 在纹理生成后，可以释放image对象。纹理则需要单独释放
 * @class 
 * @param {Image | HTMLCanvasElement} data 图形对象
 * @param {int} [w] 图像的宽度
 * @param {int} [h] 图像的高度
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Texture = function(data,w,h){
	/**
	 * 纹理数据，可能是image或者canvas,根据引擎来决定
	 * @private
     */
	this.__data = data;
	/**
	 * 纹理宽度,只读
	 * @type int 
     */
	this.w = parseInt(w) || data.width;
	/**
	 * 纹理高度,只读
	 * @type int 
     */
	this.h = parseInt(h) || data.height;
};

soya2d.ext(soya2d.Texture,/** @lends soya2d.Texture */{
	/**
	* 通过图片来创建一个纹理
	* @param {Image | HTMLCanvasElement} data 图形对象
	*/
	fromImage:function(img){
		return new soya2d.Texture(img,img.width,img.height);
	},
	//创建一个指定大小和颜色的纹理，color可以是渐变对象
	/**
   * 通过指定大小和颜色来创建一个纹理
   * @param {int} w 纹理宽度
   * @param {int} h 纹理高度
   * @param {String} color 命名色彩/RGB色彩/Hex色彩
   * @param {CanvasGradient} color 线性渐变/径向渐变
   * @param {CanvasPattern} color 图案
   * @param {Array} color 顶点颜色数组,内容可以是任意合法颜色字符串,按照0-1-2-3的顺序,如果数组颜色不足4个，使用#000000代替
   * 0---1
   * |   |
   * 2---3
   * @see soya2d.CanvasRenderer.createGradient
   * @see soya2d.CanvasRenderer.createPattern
   */
	fromColor:function(w,h,color){
		var data = document.createElement('canvas');
		data.width = w;
		data.height = h;
		var ctx = data.getContext('2d');
		
		if(color instanceof Array){
			var c1 = soya2d.RGBColor.parse(color[0]||'#000000');
			var c2 = soya2d.RGBColor.parse(color[1]||'#000000');
			var c3 = soya2d.RGBColor.parse(color[2]||'#000000');
			var c4 = soya2d.RGBColor.parse(color[3]||'#000000');
			
			var hsl0 = new soya2d.HSLColor(c1[0],c1[1],c1[2]);
			var baseLight0 = hsl0.l;
			
			var hsl1 = new soya2d.HSLColor(c2[0],c2[1],c2[2]);
			var baseLight1 = hsl1.l;
			
			var hsl2 = new soya2d.HSLColor(c3[0],c3[1],c3[2]);
			var baseLight2 = hsl2.l;
			
			var hsl3 = new soya2d.HSLColor(c4[0],c4[1],c4[2]);
			var baseLight3 = hsl3.l;
			
		  var texData = ctx.createImageData(w,h);
			var tdd = texData.data;
			for(var i =0,len = tdd.length; i<len;i+=4){
				var x = i/4%w;
				var y = i/4/w>>0;
				
				/************ 顶点0 ************/
				var u = (w-x)/w;
				var v = (h-y)/h;
				var delta = u*v;
				hsl0.lighteness(delta*baseLight0);
				var rgb0 = hsl0.getRGB();
				
				/************ 顶点1 ************/
				u = (x)/w;
				v = (h-y)/h;
				delta = u*v;
				hsl1.lighteness(delta*baseLight1);
				var rgb1 = hsl1.getRGB();
				
				/************ 顶点2 ************/
				u = (w-x)/w;
				v = (y)/h;
				delta = u*v;
				hsl2.lighteness(delta*baseLight2);
				var rgb2 = hsl2.getRGB();
				
				/************ 顶点3 ************/
				u = (x)/w;
				v = (y)/h;
				delta = u*v;
				hsl3.lighteness(delta*baseLight3);
				var rgb3 = hsl3.getRGB();
				/*
				tdd[i] = (rgb0[0]^rgb1[0]^rgb2[0]^rgb3[0])/1;
				tdd[i+1] = (rgb0[1]^rgb1[1]^rgb2[1]^rgb3[1])/1;
				tdd[i+2] = (rgb0[2]^rgb1[2]^rgb2[2]^rgb3[2])/1;
				//*/
				tdd[i] = rgb0[0]+rgb1[0]+rgb2[0]+rgb3[0];
				tdd[i+1] = rgb0[1]+rgb1[1]+rgb2[1]+rgb3[1];
				tdd[i+2] = rgb0[2]+rgb1[2]+rgb2[2]+rgb3[2];
				
				tdd[i+3] = 255;
			}
			
			ctx.putImageData(texData,0,0);
		}else{
			ctx.fillStyle = color;
			ctx.fillRect(0,0,w,h);
		}
		
		return new soya2d.Texture(data,w,h);
	}
});

soya2d.Texture.prototype = {
	/**
	 * 释放纹理数据
	 */
	dispose:function(){
		this.__data = null;
	}
};



