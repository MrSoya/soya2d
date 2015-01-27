soya2d.module.install('physics',{
    onInit:function(game){
        /**
		 * 启动物理系统
		 * @param {Object} opts 物理系统参数
		 * @see soya2d.Physics
		 * @requires physics
		 * @memberOf! soya2d.Game#
         * @alias startPhysics
		 * @return {soya2d.Physics} 返回物理系统
		 */
		game.startPhysics = function(opts){
			if(game.physics)return;
			/**
			 * 该游戏实例的物理接口
			 * @type {soya2d}
			 */
			game.physics = new soya2d.Physics(opts);

			var phyEvents = ['contactstart','contactend'];
			game.events.register(phyEvents,game.physics);
			game.physics.startListen(game);

			return game.physics;
		}
		/**
		 * 停止物理系统
		 * @param  {soya2d.Physics} phy 物理系统实例
		 * @requires physics
		 * @memberOf! soya2d.Game#
         * @alias stopPhysics
		 */
		game.stopPhysics = function(phy){
			game.physics = null;
		}
    },
    onUpdate:function(game){
    	if(game.physics)
		game.physics.update(1 / 60);
    }
});