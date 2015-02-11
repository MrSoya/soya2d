/**
 * @classdesc 资源加载场景合并了资源加载和进度显示功能。
 * 提供了默认的加载进度效果。如果需要自定义加载效果，请重写onStart和onProgress函数
 * @class 
 * @extends soya2d.Scene
 * @param {Object} data 所有父类参数，以及新增参数，如下：
 * @param {soya2d.Scene} data.nextScene 加载完成后需要跳转的场景
 * @param {Array} data.textures 需要加载的纹理数组
 * @param {Array} data.texAtlas 需要加载的纹理集数组
 * @param {Array} data.sounds 需要加载的声音数组
 * @param {Array} data.fonts 需要加载的字体数组
 * @param {function} data.onStart 开始加载回调,回调参数[game,length]
 * @param {function} data.onProgress 加载时回调,回调参数[game,length,index]
 * @param {function} data.onEnd 加载结束时回调,回调参数[game,length]
 * @author {@link http://weibo.com/soya2d MrSoya}
 */
soya2d.LoaderScene = function(data){
    data = data||{};
    soya2d.Scene.call(this,data);
    soya2d.ext(this,data);
    
    this.nextScene = data.nextScene;
    if(!(this.nextScene instanceof soya2d.Scene)){
        console.error('soya2d.LoaderScene: invalid param [nextScene], it must be a instance of soya2d.Scene');
    }
    this.textures = data.textures||[];
    this.texAtlas = data.texAtlas||[];
    this.sounds = data.sounds||[];
    this.scripts = data.scripts||[];
    this.fonts = data.fonts||[];

    var startCbk = data.onStart;
    var progressCbk = data.onProgress;
    var endCbk = data.onEnd;
    
    this.onInit = function(game){
        //初始化时启动
        var index = 0;
        //资源总数
        var allSize = this.textures.length +this.sounds.length +this.fonts.length;
    
        if(this.onStart)this.onStart(game,allSize);
        if(startCbk instanceof Function)startCbk(game,allSize);

        var loader = this;
        var img = new Image();
        function logoLoad(){
            var tex = soya2d.Texture.fromImage(this);
            var logo = new soya2d.Sprite({
                x: game.w/2 - tex.w/2,
                y: game.h/2 - tex.h/2 - 20,
                textures:tex
            });
            loader.add(logo);

            var font = new soya2d.Font('normal 400 23px/normal Arial,Helvetica,sans-serif');
            loader.tip = new soya2d.Text({
                x: logo.x - 70,
                y: logo.y + tex.h + 10,
                font:font,
                text:'Loading... 0/0',
                w:200,
                fillStyle: loader.fillStyle || '#fff'
            });
            loader.add(loader.tip);
            
            game.loadRes({
                textures: loader.textures,
                texAtlas:loader.texAtlas,
                sounds: loader.sounds,
                fonts: loader.fonts,
                scripts: loader.scripts,
                onLoad: function() {
                    if(loader.onProgress)loader.onProgress(game,allSize,++index);
                    if(progressCbk instanceof Function)progressCbk(game,allSize,index);
                },
                onEnd: function() {
                    if(loader.onComplete)loader.onComplete(game,allSize);

                    if(endCbk instanceof Function)endCbk(game,allSize);

                    game.cutTo(loader.nextScene);
                }
            });
        }
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAA8CAYAAACNQSFVAAAGeklEQVR42tWYC2xTVRjHr6yz79vec7t2YzCesq3dg/cUmLIg713Ccx0wxmNsaxsmIAoKG2CMSISoPAWFCDHy0EQjaBQyF3mM0YHxAUqC+AKiidIxooKLg+N3zz23vX23QEy8yT9tmvZ3vvP/vnPO18MwyT8PUHUBpYBSQWqQhslgdBO26POrPkOv1zbz5+4FqgI9SKAMowcZi9cY7Asaub2uVtRR28L77hWqE6H2GZqsOR+bN7ha0B9uL8LuVh7Hg8eF2oYx1tkfcMtrTqFfRaC71eJX7Sm+LRZUBqsUvopQA2NiOOcBc2VNM7okQWVZ/K+R4NGgWgJlGNOkHey46uPotPsMuq2MNFQ1zfz1eBWgpcliS9axRVVN/CGXl+90eyE6L48TgceqALZ4mcE+76h5F0BvxQNGgndRQGVfjdmjdV0rj6CXaltQm7sV4WTABH5KgquUvrLdGFT+nnlpTTN3hSTHq0yWJZnI2xl/tIhhnW+z5VAB52ER3CHRJgj1RINP3sMOnbTTXLLwOHdMqoDko4waecVh7rLLizqCa/U+wYXtxg7nQROuPolw+IKIPOWE4aXbjB2l241Y2GHEFYdN2OXl7ssM/gu4gcCJthnxlD0snv8pDEB2N3TXA5FFFARXqOwAC1/g/AN47hYuhICF7az0uhOsOmTGrtNJzgBmDevFFzVy2SZi1ZtgVSMXsZoCFSV/jjrnHUGnB1brShlBAQ+fQWAA2arqk1yUfQbhqibu+1HP6RfDLlUAq76fv1oiSQidhVxVxCqaDxio+gRqF7aymzRpzAiA9gflgnoTuBDNlhhWTd5txPOOcrhsn+l9S15KKcAeAQ0C5YEeAmXFjDzqTLYa8YiVepxXocFZI1NfhX11JMCKQANAdlAfUGZgESkUChMUtoxaZ8D9q7TYXi5Lg3OmqX/IKOqyJMiSYDgb0WsJbMBjXzbgIXU6AnPMDIbL6jdZ3WgpSBEUkYeXohI+YYsRD1+hw47ZACUQLcB1RHY6CHlPB8t1qm/2FdRvGNIZR5AtyoRNBJU8r8cF82WAMtoominNJL9Sg6e/Zb4alFB5gDEbDXiQW/piaLT+qKPAH3/RgJddsuB6n/XPIFsmbDbgYcvhx7NkmPSDUHD4IBpctFSHXS0cXt1uxWvabbjBZ/uLgbLqEG0YuVZPpkOi9E9RssOh8DYwqJTEQrDN+Y4J119Lk8A3bAC3QuS2m0zREu2NgbWKrEeZuiMoeRoCH/eKAT/1oyUAVaj+GsB7T0x128vVbVKJ6agNsoIHEj/LdWqgevTYcxaFAcPg8CBLHjO475QH9wLgb2Vy/BZQX8XFMxv2lQZfGpl6InATyArqbhucMil7qvoswO4o/XXM0mDhNRavuCL7GhtM4D4JbgTxoAxQT1BO5rBUd8509WUx2uJVelz3tUUBTQ4uNpxmOXpQX5Cj28Mp4ysOm681tFnjWhDLFh21Jk3cD4wZTM7U3exaOKaui/v10os8KbNkBwiDT9zCViw8hs5DW3dH2YSKlfH0T5I1SXk+ZpMhb/QGtmhBE/oIIr0d3k4Ezs1FX/D4mavB/q9ujxE59N8XoVe8ldjpzpOTffE3PF75G1h1I7pdJHL4wT+JN6GK0/8Mj5+EfDS0yQNYwyOX4JEAifQoCHs+h3z8rNwCrIrIvaHwxJr7QAMkBVL3FY+f/SUwi4ThiYk0RHjJtxa86vc0asv/Ax4YANYJfuKc5QLA0X2NHP4itk/ZZVqvtzH5EeGeZKGQVPF/lfMgt7/HcFUJ7V36+G3xxK2UaOXJ3678kDtROFdbBsACP1jcBO/OFsmCBU3cd8Wr2EW00xJ7xGxQL1A3kI3xtCaaUN5vgbhjCltN67XpzFCA5NNoxa26B6gr3WE5WKGJRo7Efxi3Zuwz7c8cohpFLbDTjrYnjTadHjwmcoUSXoqhFzMkWZ1zwFdHmXYa/KhQPExIcy81nN3pKSZFK51sOnLz4Y5oCx/wtZG78Fi9oU7haw5NWJbCAiRen9BTTUNvQFRREir6yvmEbcYXUllmSARfM+mxiPwWSLceanoRlEKuWgKei9Pnia/l76I9GQNUj9JIc6P4alZYIENVFCzdPEmRE3Dn3CPok8L5+rF06tk00l4xfZUtkKMNXGkxTG0zOrfwOPqydLNpOp1yTwrsEQKN7GskqPyM32geYO0FBS95mE6TlEHfp8X1NRKUPv8CGn7DXd3B5GwAAAAASUVORK5CYII=';
        if(img.complete){
            logoLoad.call(img);
        }else{
            img.onload = logoLoad;
        }
    };


    /**
     * 资源开始加载时调用,默认初始化加载界面，包括soya2d的logo等。
     * 如果需要修改加载样式，请重写该函数
     * @abstract
     * @param  {soya2d.Game} game  游戏实例
     * @param  {int} length 资源总数
     */
    this.onStart = function(game,length) {
    };
    /**
     * 资源加载时调用,默认显示loading...字符。如果需要修改加载样式，请重写该函数
     * @abstract
     * @param  {soya2d.Game} game  游戏实例
     * @param  {int} length 资源总数
     * @param  {int} index  当前加载索引
     */
    this.onProgress = function(game,length,index) {
        if(this.tip)
        this.tip.setText('Loading... '+index+'/'+length);
    };
};
soya2d.inherits(soya2d.LoaderScene,soya2d.Scene);