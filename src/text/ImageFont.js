/**
 * 使用纹理集对象，构建一个图像字体类。
 * @classdesc 图像字体类用于创建一个传递给文本精灵的字体对象，通过图片和映射文件创建。映射文件同精灵表。其实n为需要
 * 替换的字符
 * @class
 * @param {soya2d.TextureAtlas} data 用于字体映射的纹理集对象
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ImageFont = function(data){
    
    this.__fontMap = data;

    var oriFontSize = data.texs[Object.keys(data.texs)[0]].h;
    this.fontSize = oriFontSize;
    var fontWidth = data.texs[Object.keys(data.texs)[0]].w
    var scaleRate = 1;//缩放比率
    var lineH = 1;


    /**
     * 该字体的渲染内容
     * @private
     */
    this.__renderText = function(g){
        if(!this.__lines)return;

        var offy = 0;
        var lastW = 0;
        for(var i= 0,l=this.__lines.length;i<l;i++){
            var text = this.__lines[i];
            var offx = 0;
            for(var j=0,k=text.length;j<k;j++){
                var c = text[j];
                var tex = this.font.__fontMap.getTexture(c);
                if(tex){
                    var w = tex.w*scaleRate;
                    var h = tex.h*scaleRate
                    lastW = w;
                    
                    g.map(tex,
                            offx, offy, w, h,
                            0, 0, tex.w, tex.h);
                }
                
                offx += lastW + this.letterSpacing;
            }
            offy += this.font.fontSize + this.lineSpacing;
        }
    };
                                            
    /**
     * 用当前参数复制一个新的字体对象。<br/>
     * @returns {soya2d.Font} 新的字体对象
     */
    this.clone = function(){
        return new soya2d.ImageFont(this.__fontMap);
    };
    /**
     * 设置或者获取字体大小
     * @param {int} size 字体大小
     * @returns {this|int}
     */
    this.size = function(size){
        if(arguments.length>0){
            this.fontSize = parseInt(size) || oriFontSize;
            //重新计算rate
            scaleRate = this.fontSize/oriFontSize;
            return this;
        }else{
            return this.fontSize;
        }
    };
    /**
     * 获取字体宽高
     * @param {String} str 测试字符串
     * @return {Object} 指定字符串在当前字体下的宽高。｛w:w,h:h｝
     */
    this.getBounds = function(str){
        var len = str.length;
        return {w:len*fontWidth*scaleRate,h:this.fontSize};
    }
};
