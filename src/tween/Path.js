/**
 * @classdesc 路径描述结构。既可用于支持路径动画的路径检索，也可以用于绘制路径
 * @class 
 * @author {@link http://weibo.com/soya2d MrSoya}
 * @since 1.2.0
 */
soya2d.Path = function(d){
    /**
     * 路径指令集。同{@link http://www.w3.org/TR/SVG11/paths.html SVG}，但仅支持绝对坐标，
     * 并限于以下指令：
     * <table border="1">
     *     <tr style="background: #ddd;"><th>段类型</th><th>命令</th><th>参数</th><th>示例</th></tr>
     *     <tr><td>moveto</td><td>M/m</td><td>x y</td><td><code>M 50 50</code> － 将画笔移到 50,50</td></tr>
     *     <tr><td>lineto</td><td>L/l</td><td>(x y)+</td><td><code>L 50 50 100 100</code> － 直线到 50,50再到100,100</td></tr>
     *     <tr><td>quadraticCurveTo</td><td>Q/q</td><td>(cpx cpy x y)+</td><td><code>Q 110 45 90 30</code> - 曲线到 90, 30，控制点位于 110, 45</td></tr>
     *     <tr><td>bezierCurveTo</td><td>C/c</td><td>(cp1x cp1y cp2x cp2y x y)+</td><td><code>C 45 50 20 30 10 20</code> － 曲线到 10, 20，第一个控制点位于 45, 50，第二个控制点位于 20, 30</td></tr>
     *     <tr><td>closepath</td><td>Z/z</td><td>无</td><td>关闭路径</td></tr>
     * </table>
     * @type {string}
     */
    this.d = d || '';

    this.cmd = ['m','l','c','q','z'];

    this._insQ = [];

    this.__parse();
}
soya2d.ext(soya2d.Path.prototype,/** @lends soya2d.Path.prototype */{
    /**
     * 解析指令
     * @private
     */
    __parse:function(){
        var exp = new RegExp("["+this.cmd.join('')+"]([^"+this.cmd.join('')+"]+|$)",'img');
        var segs = this.d.replace(/^\s+|\s+$/,'').match(exp);

        //过滤有效指令，插入指令队列
        segs.forEach(function(seg){
            seg = seg.replace(/^\s+|\s+$/,'');
            var cmd = seg[0].toLowerCase();
            if(this.cmd.indexOf(cmd) > -1){
                //解析坐标值
                var xys = seg.substr(1).replace(/^\s/mg,'').split(/\n|,|\s/gm);

                this._insQ.push([cmd,xys]);
            }
        },this);
    },
    /**
     * 设置path指令串，并解析
     * @param {string} d path指令串
     */
    setData:function(d){
        this.d = d;
        this.__parse();
    }
});