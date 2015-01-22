/**
 * @classdesc 遮罩类，通过一个或多个几何元素创建遮罩效果
 * @class 
 * @param {soya2d.MASK_TYPE_FILL | soya2d.MASK_TYPE_STROKE} type 遮罩绘制方式
 * @see soya2d.MASK_TYPE_FILL
 * @author {@link http://weibo.com/soya2d soya哥}
 */
soya2d.Mask = function(type){
    this.__list = [];
    this.maskType = type || soya2d.MASK_TYPE_FILL;
}
soya2d.ext(soya2d.Mask.prototype,/** @lends soya2d.Mask.prototype */{
    /**
     * 添加一个或多个mask形状
     * @param {soya2d.Circle | soya2d.Rectangle | soya2d.Polygon} geoms 几何形状，可变参数
     */
    add:function(){
        for(var i=0;i<arguments.length;i++){
            var obj = arguments[i];

            this.__list.push(obj);
        }
        return this;
    },
    /**
     * 获取遮罩图形
     * @param  {int} index 索引
     * @return {soya2d.Circle | soya2d.Rectangle | soya2d.Polygon}  几何图形
     */
    getShape:function(index){
        return this.__list[index];
    },
    /**
     * 清除遮罩内所有元素
     * @return this
     */
    clear:function(){
        if(arguments.length>0){
            for(var i=0;i<arguments.length;i++){
                var child = arguments[i];
                var index = this.children.indexOf(child);
                if(index<0)continue;

                this.__list.splice(index,1);
            }
        }else{
            this.__list = [];
        }
        
        return this;
    }
});
/**
 * 遮罩方式，填充
 */
soya2d.MASK_TYPE_FILL = 1;
/**
 * 遮罩方式，线框
 */
soya2d.MASK_TYPE_STROKE = 2;