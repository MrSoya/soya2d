Soya2D is a web interactive animation(game) engine for modern web browsers

# Version2 is in beta now

## Entry

```html
<script>
    //define scene
    var scene = {
        onPreload:function(game){
            //set scale mode
            game.stage.scaleMode = soya2d.SCALEMODE_NOSCALE;
            //set align mode
            game.stage.alignMode = soya2d.ALIGNMODE_CENTER;

            //load assets
            game.load.baseUrl = 'assets/image/';
            game.load.image(['soya.png','logo.png']);

            game.load.atlas({'imgFont':['font.png','font.ssheet']});

            game.load.baseUrl = 'assets/xml/';
            game.load.xml({
                ui:'ui.xml'
            });
        },
        onInit:function(game){
            //set background
            game.stage.background('#000');
            //apply ui
            this.setView(game.assets.xml('ui'));


            //add a text to world
            game.add.text({
                text:'Hello Soya2D',
                font:game.assets.atlas('imgFont')//use image font
            });
        }
    }

    //render all
    soya.render('#stage',1024,768,scene);
</script>
```
## Website
http://soya2d.com

## Local Examples

```
1. npm install http-server -g
2. http-server ./examples/ -p30760 -o
```

## Gen API doc

```
1. npm -g install yuidocjs
2. yuidoc
```

## License
base on [MIT](http://opensource.org/licenses/MIT)