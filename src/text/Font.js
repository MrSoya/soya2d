/**
 * 字体模块定义了soya2d中内置的字体显示类，支持字体文件和图片字体
 * @module text
 */
/**
 * 字体类。用于指定绘制字体的样式、大小等
 * @class soya2d.Font
 * @param {String} desc 字体描述字符串，可以为空。为空时创建默认样式字体:[normal 400 13px/normal sans-serif]<br/>符合W3C[CSSFONTS]规范
 */
soya2d.Font = function(desc){
    var fontElement = document.createElement('span');
    var style = ['padding:0 !important;','margin:0 !important;'
                ,'top:-9999px !important;','left:-9999px !important;'
                ,'white-space:nowrap !important;','position:absolute !important;'];
    fontElement.style.cssText = style.join('')+"font:"
                                        +(desc||"normal 400 13px/normal sans-serif");
    document.body.appendChild(fontElement);
    /**
     * 字体描述字符串
     * @property fontString
     * @type {String}
     */
    this.fontString = fontElement.style.font;

    /**
     * 该字体的渲染内容
     * @private
     */
    this.__textRenderer = function(g){
        g.font(this.font);
        if(!this.__lines)return;

        g.fillStyle(this.fillStyle);
        for(var i= 0,l=this.__lines.length;i<l;i++){
            var text = this.__lines[i];
            if(this.letterSpacing > 0){
                var offx = 0;
                for(var j=0,k=text.length;j<k;j++){
                    g.fillText(text[j],offx,(this.__lh+this.lineSpacing)*i);
                    offx += this.letterSpacing + this.__uw;
                }
            }else{
                g.fillText(text,0,(this.__lh+this.lineSpacing)*i);
            }
        }
    };
                                        
    /**
     * 用当前参数复制一个新的字体对象。<br/>
     * @method clone
     * @return {soya2d.Font} 新的字体对象
     */
    this.clone = function(){
        return new soya2d.Font(this.getDesc());
    };
    /**
     * 返回字体描述的字符串
     * @method getDesc
     * @return {String}
     */
    this.getDesc = function(){
        return fontElement.style.font;
    };
    /**
     * 设置或者获取字体样式
     * @method style
     * @param {String} style 字体样式字符串
     * @return {this|String}
     */
    this.style = function(style){
        if(arguments.length>0){
            fontElement.style.fontStyle = style;
            //更新描述字符串
            this.fontString = fontElement.style.font;
            return this;
        }else{
            return fontElement.style.fontStyle;
        }
    };
    /**
     * 设置或者获取字体粗细
     * @method weight
     * @param {String} weight 字体粗细字符串
     * @return {this|String}
     */
    this.weight = function(weight){
        if(arguments.length>0){
            fontElement.style.fontWeight = weight;
            //更新描述字符串
            this.fontString = fontElement.style.font;
            return this;
        }else{
            return fontElement.style.fontWeight;
        }
    };
    /**
     * 设置或者获取字体大小
     * @method size
     * @param {int} size 字体大小字符串
     * @return {this|int}
     */
    this.size = function(size){
        if(arguments.length>0){
            fontElement.style.fontSize = size+'px';
            //更新描述字符串
            this.fontString = fontElement.style.font;

            return this;
        }else{
            return fontElement.style.fontSize;
        }
    };
    /**
     * 设置或者获取字体类型
     * @method family
     * @param {String} family 字体类型字符串
     * @return {this|String}
     */
    this.family = function(family){
        if(arguments.length>0){
            if(family){
                fontElement.style.fontFamily = family;
                //更新描述字符串
                this.fontString = fontElement.style.font;
            }
            return this;
        }else{
            return fontElement.style.fontFamily;
        }
    };
    /**
     * 获取字体宽高
     * @method getBounds
     * @param {String} str 测试字符串
     * @return {Object} 指定字符串在当前字体下的宽高。｛w:w,h:h｝
     */
    this.getBounds = function(str){
        fontElement.innerText = str;
        var h = fontElement.offsetHeight;
        var w = fontElement.offsetWidth;
        return {w:w,h:h};
    };
};
