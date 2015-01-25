/**
 * @class 
 * @extends soya2d.DisplayObject
 * @classdesc 显示对象容器继承自显示对象，是所有显示容器的基类。<br/>
 * 该类用于管理包含子节点的容器相关的方法。<br/>
 注意，该类不应直接实例化,应使用该类的子类或继承该类
 * @param {Object} data 同父类定义参数
 * @author {@link http://weibo.com/soya2d MrSoya} 
 */
soya2d.DisplayObjectContainer = function(data){
    data = data||{};
    soya2d.DisplayObject.call(this,data);
    /**
     * 子节点数组
     * @type {Array}
     * @default []
     */
    this.children = [];
    /**
     * 父节点引用
     * @type {soya2d.DisplayObject}
     * @default null
     */
    this.parent = null;
};
soya2d.inherits(soya2d.DisplayObjectContainer,soya2d.DisplayObject);
soya2d.ext(soya2d.DisplayObjectContainer.prototype,/** @lends soya2d.DisplayObjectContainer.prototype */{
    /**
     * 增加子节点
     * @param {...soya2d.DisplayObject} children 一个或者多个可渲染对象，使用逗号分割
     * @return this
     */
	add:function(){
        for(var i=0;i<arguments.length;i++){
            var child = arguments[i];
            if(child.parent)continue;

            this.children.push(child);
            child.parent = this;
        }

        return this;
	},
    /**
     * 删除子节点
     * @param {...soya2d.DisplayObject} children 一个或者多个可渲染对象，使用逗号分割
     * @return this
     */
	remove:function(){
        for(var i=0;i<arguments.length;i++){
            var child = arguments[i];
            var index = this.children.indexOf(child);
            if(index<0)continue;

            this.children.splice(index,1);
            child.parent = null;
        }
 		
        return this;
	},
    /**
     * 清除所有子节点
     * @return {Array} 子节点
     */
    clear:function(){
        for(var i=this.children.length;i--;){
            this.children[i].parent = null;
        }
        var rs = this.children;
        this.children = [];
        return rs;
    },
    /**
     * 在当前节点下查找符合条件的所有子节点
     * @param {function(obj)} filter 过滤回调，接收显示对象为参数，返回true表示该对象返回
     * @param {boolean} [isRecur=false] 递归查找标识
     * @return {Array} 符合过滤条件的节点数组，如果没有，返回空数组
     */
    find:function(filter,isRecur){
        if(this.children.length<1)return [];

        var rs;
        if(isRecur){
            rs = [];
            //创建递归函数
            !function(parent){
                for(var i=parent.children.length;i--;){
                    var c = parent.children[i];
                    if(filter(c)){
                        rs.push(c);
                    }
                    if(c.children && c.children.length>0){
                        arguments.callee(c);
                    }
                }
            }(this);
        }else{
            rs = this.children.filter(filter);
        }
        return rs;
    }
});