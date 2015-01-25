/**
 * @classdesc 遮罩类，通过一个或多个几何元素创建遮罩效果
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Mask = function(type){
    /**
     * 遮罩形状列表
     * @type {Array}
     */
    this.list = [];
}
soya2d.ext(soya2d.Mask.prototype,/** @lends soya2d.Mask.prototype */{
    /**
     * 添加一个或多个mask形状
     * @param {soya2d.Circle | soya2d.Rectangle | soya2d.Polygon} geoms 几何形状，可变参数
     */
    add:function(){
        for(var i=0;i<arguments.length;i++){
            var obj = arguments[i];

            this.list.push(obj);
        }
        return this;
    },
    /**
     * 获取遮罩图形
     * @param  {int} index 索引
     * @return {soya2d.Circle | soya2d.Rectangle | soya2d.Polygon}  几何图形
     */
    getShape:function(index){
        return this.list[index];
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

                this.list.splice(index,1);
            }
        }else{
            this.list = [];
        }
        
        return this;
    }
});