/**
 *  物理刚体接口，用于屏蔽不同物理系统的实现差异，对调用者统一接口。
 *  如果更换物理系统，只需要修改底层实现，不影响应用层
 *  @class Body
 *  @extends Signal
 *  @module physics
 */
var Body = soya2d.class("",{
    extends:Signal,
    constructor:function(displayObject){
        /**
         * 显示对象引用
         */
        this.sprite = displayObject;
        /**
         * 物理刚体引用
         * @property rigid
         */
        this.rigid = null;//物理刚体
    },
    /**
     * 设置是否为传感器。传感器刚体会触发碰撞事件，但不会显现碰撞效果
     * @method sensor
     * @param  {Boolean} tof 
     * @chainable
     */
    sensor:function(tof) {
        this.__cbk && this.__cbk.sensor(this.rigid,tof);
        return this;
    },
    /**
     * 移动到指定坐标
     * @method moveTo
     * @param  {Number} x 
     * @param  {Number} y 
     * @chainable
     */
    moveTo:function(x,y){
        this.__cbk && this.__cbk.moveTo(this.rigid,x,y);
        return this;
    },
    /**
     * 移动指定偏移
     * @method moveBy
     * @param  {Number} offx 
     * @param  {Number} offy
     * @chainable
     */
    moveBy:function(offx,offy){
        this.__cbk && this.__cbk.moveBy(this.rigid,offx,offy);
        return this;
    },
    /**
     * 设置是否为静态刚体。静态刚体会呈现碰撞，但没有重力效果
     * @method static
     * @param  {Boolean} tof 
     * @chainable
     */
    static:function(tof){
        this.__cbk && this.__cbk.static(this.rigid,tof);
        return this;
    },
    /**
     * 设置刚体的质量
     * @method mass
     * @param  {Number} v 
     * @chainable
     */
    mass:function(v){
        this.__cbk && this.__cbk.mass(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体旋转偏移
     * @method rotateBy
     * @param  {Number} v 
     * @chainable
     */
    rotateBy:function(v){
        this.__cbk && this.__cbk.rotateBy(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体旋转角度
     * @method rotateTo
     * @param  {Number} v 
     * @chainable
     */
    rotateTo:function(v){
        this.__cbk && this.__cbk.rotateTo(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体摩擦系数
     * @method friction
     * @param  {Number} v 
     * @chainable
     */
    friction:function(v){
        this.__cbk && this.__cbk.friction(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体弹性系数
     * @method restitution
     * @param  {Number} v 
     * @chainable
     */
    restitution:function(v){
        this.__cbk && this.__cbk.restitution(this.rigid,v);
        return this;
    },
    /**
     * 设置刚体速度
     * @method velocity
     * @param  {Number} x 
     * @param  {Number} y 
     * @chainable
     */
    velocity:function(x,y){
        this.__cbk && this.__cbk.velocity(this.rigid,x||0,y||0);
        return this;
    },
    /**
     * 设置刚体惯性
     * @method inertia
     * @param  {Number} v 
     * @chainable
     */
    inertia:function(v){
        this.__cbk && this.__cbk.inertia(this.rigid,v||0);
        return this;
    }
});
