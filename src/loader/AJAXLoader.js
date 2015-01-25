/**
 * 异步加载类
 * @namespace soya2d.AJAXLoader
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.AJAXLoader = new function(){

    var timeout = 5000;
    function obj2str(obj){
        var rs = '';
        for(var i in obj){
            rs += '&'+i+'='+ escape(obj[i]);
        }
        return rs.substr(1);
    }

    function downloadRequest(type,url,async,onload,onprogress,ontimeout,onerror,t,data,contentType){
        var xhr = new XMLHttpRequest();
        type = type||"get";
        if(type === 'get'){//转换参数
            data = typeof(data)==='string'?data:obj2str(data);
            if(url.indexOf('?') > -1){
                url = url.replace(/&$/,'');
                url += '&' + data.replace(/^&/,'');
            }else{
                url += '?' + data.replace(/^&/,'');
            }
            data = null;
        }

        xhr.open(type,url, async===false?false:true);
        xhr.timeout = t || timeout;
        xhr.ontimeout = ontimeout;
        xhr.onerror = onerror;
        if(xhr.onload === null){
            xhr.onload = function(){
                if(xhr.status===0 || //native
                    (xhr.status >= 200 && xhr.status <300) || xhr.status === 304){
                    onload(xhr);
                }
            }
            xhr.onprogress=function(e){
                if(onprogress && e.lengthComputable)onprogress(xhr,e.loaded,e.total);
            }
        }else{
            xhr.onreadystatechange = function () {
                if(xhr.status===0 || //native
                    ((xhr.status >= 200 && xhr.status <300) || xhr.status === 304) && xhr.readyState === 4){
                    onload(xhr);
                }
            };
        }
        if(type === 'post'){
            data = typeof(data)==='string'?data:obj2str(data);
            xhr.setRequestHeader("Content-Type",contentType||'application/x-www-form-urlencoded');
        }
        xhr.send(data);
    }

    function uploadRequest(type,url,async,onload,onprogress,ontimeout,onerror,t,data,contentType){
        var xhr = new XMLHttpRequest();
        xhr.open('post',url, async===false?false:true);
        xhr.timeout = t || timeout;
        xhr.ontimeout = ontimeout;
        if(xhr.upload){
            xhr.upload.addEventListener("progress",function(e){
                if(onprogress && e.lengthComputable) {
                    var percentComplete = e.loaded / e.total;
                    onprogress(xhr,e.loaded,e.total);
                }
            }, false);
            xhr.upload.addEventListener("error", onerror, false);
        }
        if(xhr.onload === null){
            xhr.onload = function(){
                if(xhr.status===0 || //native
                    (xhr.status >= 200 && xhr.status <300) || xhr.status === 304){
                    onload(xhr);
                }
            }
        }else{
            xhr.onreadystatechange = function () {
                if(xhr.status===0 || //native
                    ((xhr.status >= 200 && xhr.status <300) || xhr.status === 304) && xhr.readyState === 4){
                    onload(xhr);
                }
            };
        }
        xhr.setRequestHeader("Content-Type",contentType||'application/x-www-form-urlencoded');
        data = typeof(data)==='string'?data:obj2str(data);
        xhr.send(data);
    }

    /**
     * 加载文本信息
     * @param {Object} opts 参数对象
     * @param  {string} opts.data 请求数据
     * @param  {string} opts.url 请求地址
     * @param  {string} [opts.type=get] 请求类型
     * @param  {boolean} [opts.async=true] 是否异步
     * @param  {Function} [opts.onLoad] 回调函数，参数为文本
     * @param  {Function} [opts.onProgress] 回调函数
     * @param  {Function} [opts.onTimeout] 回调函数
     * @param  {Function} [opts.onError] 回调函数
     * @param  {int} [opts.timeout=5000] 超时上限，毫秒数
     */
	this.loadText = function(opts){
        if(!opts)return;
        if(!(opts.onLoad instanceof Function))return;

        downloadRequest(opts.type,opts.url,opts.async,function(xhr){
            opts.onLoad(xhr.responseText);
        },opts.onProgress,opts.onTimeout,opts.onError,opts.timeout,opts.data);
    };

    /**
     * 加载json对象
     * @param {Object} opts 参数对象
     * @param  {string} opts.data 请求数据
     * @param  {string} opts.url 请求地址
     * @param  {string} [opts.type=get] 请求类型
     * @param  {boolean} [opts.async=true] 是否异步
     * @param  {Function} [opts.onLoad] 回调函数，参数为json对象;如果json解析失败，返回错误对象
     * @param  {Function} [opts.onProgress] 回调函数
     * @param  {Function} [opts.onTimeout] 回调函数
     * @param  {Function} [opts.onError] 回调函数
     * @param  {int} [opts.timeout=5000] 超时上限，毫秒数
     */
    this.loadJSON = function(opts){
        if(!opts)return;
        if(!(opts.onLoad instanceof Function))return;

        downloadRequest(opts.type,opts.url,opts.async,function(xhr){
            var json;
            try{
                json = new Function('return '+xhr.responseText)();
            }catch(e){
                json = e;
            }
            opts.onLoad(json);
        },opts.onProgress,opts.onTimeout,opts.onError,opts.timeout,opts.data);
    };

    /**
     * 上传文本
     * @param {Object} opts 参数对象
     * @param  {string} opts.data 上传的文本数据
     * @param  {string} opts.url 请求地址
     * @param  {string} [opts.type=get] 请求类型
     * @param  {boolean} [opts.async=true] 是否异步
     * @param  {Function} [opts.onLoad] 回调函数，参数为文本
     * @param  {Function} [opts.onProgress] 回调函数
     * @param  {Function} [opts.onTimeout] 回调函数
     * @param  {Function} [opts.onError] 回调函数
     * @param  {int} [opts.timeout=5000] 超时上限，毫秒数
     */
    this.uploadText = function(opts){
        if(!opts)return;
        if(!(opts.onLoad instanceof Function))return;

        uploadRequest(opts.type,opts.url,opts.async,function(xhr){
            opts.onLoad(xhr.responseText);
        },opts.onProgress,opts.onTimeout,opts.onError,opts.timeout,opts.data+'');
    };
};