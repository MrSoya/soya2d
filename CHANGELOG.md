# Change Log
## Version 1.3.0 - 2015/3/27
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