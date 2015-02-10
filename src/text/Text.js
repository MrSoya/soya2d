
/**
 * 创建一个用于渲染文本的实例
 * @classdesc 文本类用于显示指定的文本内容，支持多行文本显示。
 * 文本渲染效果取决于所指定的font，默认为普通字体soya2d.Font。<br/>
 * 注意，需要显示的指定实例的w属性，来让引擎知道文本是否需要分行显示
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 * @see soya2d.Font
 * @see soya2d.ImageFont
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Text = function(data){
	data = data||{};
    soya2d.DisplayObjectContainer.call(this,data);
    soya2d.ext(this,data);

    /**
     * 文本内容
     * *注意，直接设置该属性后，需要手动刷新才会更新显示内容。如果不想手动刷新，可以使用setText函数来更新内容
     * @see soya2d.Text.refresh
     * @type {String}
     */
    this.text = data.text||'';
    /**
     * 字符间距
     * @type {int}
     * @default 1
     */
    this.letterSpacing = data.letterSpacing || 0;
    /**
     * 行间距
     * @type {int}
     * @default 5
     */
    this.lineSpacing = data.lineSpacing||0;
    /**
     * 字体对象
     * @type {String | soya2d.Font | soya2d.ImageFont}
     * @default soya2d.Font
     * @see soya2d.Font
     */
    this.font = data.font;
    if(typeof this.font === 'string'){
        this.font = new soya2d.Font(this.font);
    }
    var font = this.font||new soya2d.Font();
    this.font = font;

    this.__changed = true;//默认需要修改
    this.__lines;//分行内容

    this.__renderer = this.font.__renderText;//绑定渲染
};
soya2d.inherits(soya2d.Text,soya2d.DisplayObjectContainer);

soya2d.ext(soya2d.Text.prototype,{
    onRender:function(g){
        this.__renderer(g);
    },
    /**
     * 刷新显示内容<br/>
     * 用在修改了宽度时调用
     */
    refresh:function(){
        this.__changed = true;
    },
    /**
     * 重新设置文本域字体
     * @param {soya2d.Font | soya2d.ImageFont} font 字体
     */
    setFont:function(font){
        if(!font)return;
        this.font = font;
        this.__renderer = this.font.__renderText;//绑定渲染
    },
    /**
     * 设置文本内容，并刷新
     * @param {string} txt 文本内容
     */
	setText:function(txt){
		this.text = txt+'';
		this.refresh();
	},
    _onUpdate:function(game){
        if(!this.__lh){//init basic size
            var bounds_en = this.font.getBounds("s",game.getRenderer());
            var bounds_zh = this.font.getBounds("豆",game.getRenderer());
            this.__lh = (bounds_en.h+bounds_zh.h)/2>>0;//行高
            this.__uw = (bounds_en.w+bounds_zh.w)/2>>0;//单字宽度
        }
        if(this.__changed){
            this.__lines = this.__calc(game.getRenderer());
            this.__changed = false;
        }
    },
    //计算每行内容
    __calc:function(renderer){
        var ls = this.letterSpacing;
        var charNum = this.w / (this.__uw+ls) >>0;//理论单行个数
        if(charNum<1){
            this.w = this.__uw * 1.5;
            charNum = 1;
        }
        var f = this.font;
        var primeLines = this.text.split('\n');//原始行
        var lines=[];/*lines=[[startChar,len,str],...]*/;
        for(var s= 0,e=primeLines.length;s<e;s++){
            var text = primeLines[s];
            if(!text){//处理空行
                lines.push('');
                continue;
            }
            var l = text.length;
            var currCharPos=0;
            while(currCharPos<l){
                var lineString = text.substr(currCharPos,charNum+1);
                //计算宽度是否超过
                var lineWidth = f.getBounds(lineString,renderer).w + lineString.length*ls;//增加字间距
                if(lineWidth > this.w){//超宽了
                    for(var j=charNum+1;j--;){
                        lineString = lineString.substr(0,lineString.length-1);
                        lineWidth = f.getBounds(lineString,renderer).w + lineString.length*ls;
                        if(lineWidth <= this.w){
                            if(lineWidth===0)return;//防止死循环
                            //该行处理完成
                            lines.push(lineString);
                            currCharPos += lineString.length;
                            break;
                        }
                    }
                }else{
                    var charPos = currCharPos;
                    for(var j=1;j<l-currCharPos;j++){
                        lineString = text.substr(currCharPos,charNum+1+j);
                        lineWidth = f.getBounds(lineString,renderer).w + lineString.length*ls;
                        if(lineWidth > this.w){
                            //该行处理完成
                            lines.push(lineString.substr(0,lineString.length-1));
                            currCharPos += lineString.length-1;
                            break;
                        }
                        //如果该行已经读完，直接退出
                        if(lineString === text){
                        		charNum = text.length-1;
                        		break;
                        }
                    }
                    if(currCharPos===charPos){//结束了
                        lineString = text.substr(currCharPos,charNum+1);
                        lines.push(lineString);
                        break;
                    }
                }
            }
        }


        return lines;
    }
});