# Change Log
## Version 1.4.0 - 2015/6/8
### 新增
* ResourceManager.findAll()查找所有匹配资源
* 可以通过sp.body.x/sp.body.x/sp.body.rotation来设置坐标和角度，同步物理和显示

### 更新
* ResourceManager.find()只查找一个匹配资源
* 鼠标事件现在支持事件冒泡，并可以设置阻止冒泡
* 触摸事件现在支持事件冒泡，并可以设置阻止冒泡
* 精灵角度可以被初始化到物理系统
* RPoly的外半径根据w属性决定
* 声音处理库更新

### bug修复
* 键盘事件没有取消
* Game.loadRes空资源不执行onend

### 移除
* ResourceManager.findOne()

## Version 1.3.0beta - 2015/3/27
# ! 注意,该版本不向下兼容
### 新增
* console.level()用于控制输出级别
* EArc用于绘制椭圆弧
* DisplayObject.cache()方法用于缓存矢量绘图为图形

### 更新
* DisplayObject.mask属性接收任意的DisplayObject实例为有效值
* 所有DisplayObject在创建时可以指定Game实例，并保存在DisplayObject.game中
* 事件接口不再需要game参数

### bug修复
* LoaderScene的size判断
* PathTween算法导致某些情况无法执行引导
* 事件监听删除未区分context

### 移除
* Mask类

## Version 1.2.0rc - 2015/2/26

### 新特性
* Path。用于绘制路径或者引导路径补间动画
* PathTween。用于执行路径补间
* Tween.next()和PathTween.next()。用于执行链式调用
* CanvasGraphics.path()。用于绘制指定Path实例

### 更新
* Tween和PathTween的delay实现。在start后才开始延迟
