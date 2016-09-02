/**
 * 显示对象容器继承自显示对象，是所有显示容器的基类。该类提供了用于管理包含子节点的容器相关的方法。<br/>
 该类不能被实例化
 * 
 * @class soya2d.DisplayObjectContainer
 * @extends soya2d.DisplayObject
 * @param {Object} data 同父类定义参数
 */
soya2d.class("soya2d.DisplayObjectContainer",{
    extends:soya2d.DisplayObject,
    constructor:function(data){
        /**
         * 子节点数组
         * @property children
         * @type {Array}
         * @default []
         */
        this.children = [];
        /**
         * 父节点引用
         * @property parent
         * @type {soya2d.DisplayObject}
         * @default null
         */
        this.parent = null;
    },
    /**
     * 增加子节点
     * @method add
     * @param {...soya2d.DisplayObject} children 一个或者多个可渲染对象，使用逗号分割
     * @chainable
     */
    add:function(){
        for(var i=0;i<arguments.length;i++){
            var child = arguments[i];

            if(child.parent){
                child.parent.remove(child);
            }
            this.children.push(child);
            child.parent = this;

            //触发onAdded事件
            child.__onAdded();
        }

        return this;
    },
    /**
     * 删除子节点
     * @method remove
     * @param {...soya2d.DisplayObject} children 一个或者多个可渲染对象，使用逗号分割
     * @chainable
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
     * @method clear
     * @return {Array} 子节点
     */
    clear:function(destroy){
        for(var i=this.children.length;i--;){
            this.children[i].parent = null;
        }
        var rs = this.children;
        this.children = [];
        if(destroy){
            for(var i=rs.length;i--;){
                rs[i].destroy();
            }
        }
        return rs;
    },
    /**
     * 在当前节点下查找符合条件的所有子节点
     * @method find
     * @param {Function} filter 过滤回调，接收显示对象为参数，返回true表示该对象返回
     * @param {Boolean} [isRecur=false] 递归查找标识
     * @return {Array} 符合过滤条件的节点数组，如果没有，返回空数组
     */
    find:function(filter,isRecur){
        if(this.children.length<1)return [];

        var rs;
        if(isRecur){
            rs = [];
            recur(this,filter,rs);
        }else{
            rs = this.children.filter(filter);
        }
        return rs;
    }
});

function recur(parent,filter,rs){
    for(var i=parent.children.length;i--;){
        var c = parent.children[i];
        if(filter(c)){
            rs.push(c);
        }
        if(c.children && c.children.length>0){
            recur(c,filter,rs);
        }
    }
}