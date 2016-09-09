/**
 *  场景用来管理通过XML构建的UI
 *  @class Scene
 */
function Scene(data,game) {
    soya2d.ext(this,data);

    this.map = {};
    this.game = game;
}

Scene.prototype = {
    /**
     * 通过XML文档设置UI
     * @method setView
     * @param {XMLDocument} doc xml文档对象
     */
    setView:function(doc){
        var world = doc.childNodes[0];
        build(this,world,this.game.world,this.game);
    },
    /**
     * 通过id属性查找显示对象
     * @method findview
     * @param  {String} id xml中节点的id属性
     * @return {soya2d.DisplayObject}
     */
    findView:function(id){
        return this.map[id];
    }
}


/**
 * 预加载回调，该回调中可以进行资源加载操作。资源加载完成后，会自动调用onInit回调
 * @method onPreload
 * @param {soya2d.Game} game 场景所属game
 */
/**
 * 初始化回调，在onPreload后调用
 * @method onInit
 * @param {soya2d.Game} game 场景所属game
 */
/**
 * 更新回调，每帧调用
 * @method onUpdate
 * @param {soya2d.Game} game 场景所属game
 * @param {Number} delta 上一次调用的间隔
 */

function build(scene,node,parent,game){
    for(var i=0;i<node.childNodes.length;i++){
        var n = node.childNodes[i];
        if(n.nodeType == 3)continue;
        
        var type = n.tagName;
        var id = n.attributes['id'] ? n.attributes['id'].value : null;
        var data = {};
        var ks = Object.keys(n.attributes);
        for(var j=ks.length;j--;){
            var k = ks[j];
            var kName = n.attributes[k].name;
            data[kName] = n.attributes[k].value;
        }
        //filter data
        if(game.objects.map[type].prototype.onBuild){
            game.objects.map[type].prototype.onBuild(data,n,game);
        }
        var ins = newInstance(type,data,game);

        bindEvent(n.attributes,ins,scene);
        if(id){
            scene.map[id] = ins;
        }
        parent.add(ins);

        if(n.childNodes.length>0){
            build(scene,n,ins,game);
        }
    }
}


function bindEvent(attrs,ins,scene){
    var ks = Object.keys(attrs);
    for(var i=ks.length;i--;){
        var k = ks[i];
        var kName = attrs[k].name;
        var val = attrs[k].value;
        if(kName.indexOf('on-') !== 0)continue;
        var evType = kName.substr(3);
        var evFn = scene[val];
        if(evFn instanceof Function){
            ins.on(evType,evFn);
        }else{
            soya2d.console.warn('invalid callback "'+val+'" of '+kName);
        }
    }
}

function newInstance(type,data,game){
    var instance = new game.objects.map[type](data);
    return instance;
}
