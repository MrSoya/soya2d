/**
 * @classdesc 资源管理器是具体资源管理器的基类，该类不应被直接实例化。
 * 应使用相关资源的子类。
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.ResourceManager = function(){
    this.urlMap = {};//url->obj
};
soya2d.ResourceManager.prototype = {
    /**
     * 获取一个资源对象，如果匹配到多个，只返回第一个
     * @param {string | Object} opts 参数对象,url字符串，或者参数对象，参数如下：
     * @param {string} opts.url 需要查找的资源url，可以是全路径或部分路径，当fuzzy属性为false时，部分路径无效
     * @param {boolean} [opts.fuzzy=true] 是否进行url模糊匹配
     * @return {Object | null} 资源对象或者null
     */
    findOne:function(opts){
        if(!opts)return null;
        if(typeof opts == "string"){
            var url = opts;
            opts = {};
            opts.urls = [url];
        }else{
            opts.urls = [opts.url];
        }
        var rs = this.find(opts);
        if (rs.length == 0) {
            return null;
        } else {
            return rs[0];
        }
    },
    /**
     * 获取一组资源对象
     * @param {string | Object} opts 参数对象(如果为空返回所有资源)。url字符串，或者参数对象，参数如下：
     * @param {Array} opts.urls 需要查找的资源url数组，可以是全路径或部分路径，当fuzzy属性为false时，部分路径无效。支持多标识
     * @param {boolean} [opts.fuzzy=true] 是否进行url模糊匹配
     * @return {Array | null} 资源数组或者null
     */
    find:function(opts){
        var urls = Object.keys(this.urlMap);

        if(typeof opts == "string"){
            var url = opts;
            opts = {};
            opts.urls = [url];

        }
        var fuzzy = opts?opts.fuzzy||true:true;

        var tmp = [];
        if(opts){
            for(var k=opts.urls.length;k--;){
                var url = opts.urls[k];
                if(fuzzy){
                    for(var i=urls.length;i--;){
                        if(urls[i].indexOf(url)>-1)tmp.push(urls[i]);
                    }
                }else{
                    for(var i=urls.length;i--;){
                        if(urls[i] == url)tmp.push(urls[i]);
                    }
                }
            }
        }else{
            tmp = urls;
        }

        var rs = [];
        for(var i=tmp.length;i--;){
            rs.push(this.urlMap[tmp[i]]);
        }
        return rs;
    }
}
