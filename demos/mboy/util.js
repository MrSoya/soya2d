
var Base64 = new function(){
    var base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split("");
    var base64inv = {}; 
    for (var i = 0; i < base64chars.length; i++) { 
      base64inv[base64chars[i]] = i; 
    }
    this.decode = function(str){
        str = str.replace(new RegExp('[^'+base64chars.join("")+'=]', 'g'), "");
        var p = (str.charAt(str.length-1) == '=' ? (str.charAt(str.length-2) == '=' ? 'AA' : 'A') : ""); 
        var r = []; 
        str = str.substr(0, str.length - p.length) + p;
        for (var c = 0; c < str.length; c += 4) {
            var n = (base64inv[str.charAt(c)] << 18) + (base64inv[str.charAt(c+1)] << 12) +
                (base64inv[str.charAt(c+2)] << 6) + base64inv[str.charAt(c+3)];

            r.push((n >>> 16) & 255);
            r.push((n >>> 8) & 255);
            r.push(n & 255);
        }
        return r;
    }
}

var TiledParser = new function(){

    this.parseJson = function(json){
        var layers = {};
        var tilesets = {};
        json.layers.forEach(function(layer){
            if(layer.type == 'tilelayer'){
                var data = layer.data;
                if(layer.encoding == 'base64'){
                    data = Base64.decode(data);
                }
                var map = [];
                for(var i=0;i<data.length;i+=4){
                    var tileId = data[i] | 
                                data[i + 1] << 8 | 
                                data[i + 2] << 16 | 
                                data[i + 3] << 24;
                    map.push(tileId);
                }

                var tmp = {
                    data:map
                }
                layers[layer.name] = tmp;
            }
        });
        json.tilesets.forEach(function(tileset){
            var tmp = {
                sid:tileset.firstgid
            };
            tilesets[tileset.name] = tmp;
            
        });

        var rs = {
            tilewidth:json.tilewidth,
            tileheight:json.tileheight,
            rows:json.height,
            columns:json.width,
            layers:layers,
            tilesets:tilesets
        }

        return rs;
    }
}