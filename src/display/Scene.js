/**
 * @classdesc 场景用于组织所有需要在该范围内显示的可渲染单位。<br/>
 * 场景是渲染器接收的参数，其他渲染对象无法直接进行渲染
 * @class 
 * @extends soya2d.DisplayObjectContainer
 * @param {Object} data 所有父类参数
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.Scene = function(data){
    data = data||{};
    soya2d.DisplayObjectContainer.call(this,data);
    soya2d.ext(this,data);

    //更新矩阵
    function updateMx(ro,queue){
        ro.updateTransform();
        //生成renderQueue
        if(ro.children)
            for(var i=ro.children.length;i--;){
                var c = ro.children[i];
                if(c.opacity>0 && c.visible){
                    queue.push(c);
                    updateMx(c,queue);
                }
            }
    }

    /**
     * 更新矩阵树，并记录可渲染的RO。场景自身不处理
     * @private
     */
    this.__updateMatrix = function(){
        this.__renderQueue = [];
        updateMx(this,this.__renderQueue);
    };

    /**
     * 更新整个场景
     * @private
     */
    this.__update = function(game){
        if(this.children)
            update(this.children,game);
    }

    function update(list,game){
        for(var i=list.length;i--;){
            var c = list[i];
            if(c._onUpdate){
                c._onUpdate(game);
            }
            if(c.onUpdate){
                c.onUpdate(game);
            }
            if(c.children){
                update(c.children,game);
            }
        }
    }

    /**
     * 查找当前场景中符合条件的对象
     * *只在可显示对象(opacity>0 && visible)中查询
     * @param {Function} filter 过滤函数，接收ro为参数，返回true表示该对象返回
     * @return {Array} 符合过滤条件的节点数组，如果没有，返回空数组
     */
    this.findVisible = function(filter){
        if(!this.__renderQueue)return [];
        return this.__renderQueue.filter(filter);
    }
};
soya2d.inherits(soya2d.Scene,soya2d.DisplayObjectContainer);

/**
 * @name soya2d.Scene#onInit
 * @desc 当游戏启动或切换场景时触发
 * @event
 * @param {soya2d.Game} game 游戏实例对象，可以获取当前游戏的尺寸等信息
 */