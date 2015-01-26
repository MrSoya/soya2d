Soya2D —— 为了做最好的HTML5游戏而生

# Soya2D HTML5 Game Engine

Soya2D是一个好学、易用、强大、开源的HTML5游戏引擎，可以在所有支持HTML5特性的环境中运行。
即刻点亮心中灵感，创造精彩世界

## 案例

Soya2D为你准备了丰富的案例以及详细的入门教程，每一个案例都可以在线编辑，让你不止能看，还能玩，还犹豫什么，快点这里 [Soya2D website](http://soya2d.com/examples/exp-hello.php).

## 特性

为你准备了什么？

* **模块化**
    * 模块化能让你扩展更轻松，构建更灵活
    * 更多扩展模块供你使用
* **物理系统**
    * 统一的事件接口，让碰撞变的更简单
* **资源管理**
    * 引擎内置了纹理、声音、纹理集等管理器，不必再为繁杂的素材管理烦恼
* **屏幕适配**
    * 无论桌面还是移动设备，引擎都会自动为你适配
* **任务系统**
    * η表达式允许开发者定义复杂的定时任务
* **粒子系统**
    * 让你的应用看上去更炫酷
* **事件系统**
    * 鼠标、键盘、触摸、碰撞，还有更多。。。

## API

API的设计始终是为了减少开发者的编写量 write less,do more

```html
<script>
    // 定义游戏实例
    var game = new soya2d.Game({
        container:'.soya-container'
    });

	// 定义场景
    var scene = new soya2d.Scene({
        onInit:function(game){
            //这里进行其他显示对象初始化
            var text = new soya2d.Text({
                text:'Hello Soya2D'
            });
            //放入场景
            this.add(text);
        }
    });

    //设置该实例的缩放模式
    game.view.scaleMode = soya2d.SCALEMODE_NOSCALE;

    //启动场景
    game.start(scene);
</script>
```

想快速了解Soya2D？这里为你提供 [Soya2D入门指南](http://soya2d.com/lessons/0.php).

## 如何构建

Soya2D使用 [gulp](http://gulpjs.com) 来构建源码，而在这之前你需要安装了nodejs，然后只需要在Soya2D工程目录执行如下命令

    gulp

看吧，这有多简单
## API Doc

详细的API文档请点击这里 [Soya2D API Doc](http://soya2d.com/api/soya2d.php)

## 获取开发资源?

想要获得API自动提示插件？或者额外的引擎模块扩展？点这里 [Soya2D 开发者](http://soya2d.com/resource.php)

## 贡献

Soya2D引擎仅仅是一个基础平台，更多的扩展需要大家的更多关注和帮助，如果你想为Soya2D贡献，那真是太好了！

### Github Issues

如果有bug或者新的特性需求，请提交在issues中

### FAQ

如果你遇见了问题或者发现了bug，请先查阅issues和wiki中，是否已经有了解决方案。如果你发现了满意的答案，那会为你节省很多时间。

## License

Soya2D基于 [MIT](http://opensource.org/licenses/MIT) 协议发布。请查阅LICENSE文件
