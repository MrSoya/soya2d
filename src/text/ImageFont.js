/**
 * 使用图像集对象，构建一个图像字体类。
 * 图像字体类用于创建一个传递给文本精灵的字体对象，通过图片和映射文件创建。
 * 映射文件同精灵表。其中n为需要
 * 替换的字符
 * @class soya2d.ImageFont
 * @param {soya2d.Atlas} data 用于字体映射的图像集对象
 * @param {Number} size 图像字体大小
 * @module text
 */
soya2d.ImageFont = function(data,size){
    
    this.__fontMap = data;

    var oriFontSize = data.texs[Object.keys(data.texs)[0]].height;
    /**
     * 字体大小
     * @property fontSize
     * @type {int}
     */
    this.fontSize = oriFontSize;
    this.fontWidth = data.texs[Object.keys(data.texs)[0]].width;
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
                var tex = this.font.__fontMap.get(c);
                if(tex){
                    var w = tex.width*scaleRate;
                    var h = tex.height*scaleRate
                    lastW = w;
                    
                    g.map(tex,
                            offx, offy, w, h,
                            0, 0, tex.width, tex.height);
                }
                
                offx += lastW + this.letterSpacing;
            }
            offy += this.font.fontSize + this.lineSpacing;
        }
    };
                                            
    /**
     * 用当前参数复制一个新的字体对象。<br/>
     * @method clone
     * @return {soya2d.Font} 新的字体对象
     */
    this.clone = function(){
        return new soya2d.ImageFont(this.__fontMap);
    };
    /**
     * 设置或者获取字体大小
     * @method size
     * @param {int} size 字体大小
     * @return {this|int}
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
     * @method getBounds
     * @param {String} str 测试字符串
     * @return {Object} 指定字符串在当前字体下的宽高。｛w:w,h:h｝
     */
    this.getBounds = function(str){
        var len = str.length;
        return {w:len*this.fontWidth*scaleRate,h:this.fontSize};
    }

    if(size)this.size(size);
};
