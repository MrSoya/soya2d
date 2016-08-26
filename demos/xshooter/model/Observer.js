var Observer = {
	enemies:[],
	rushQueue:[],
	flyingBullets:[],
	initRushQ:function(game){
		this.rushQueue.push(
			new Rush({
	            enemies:[
	            	ENEMY_ARROW
	           	]
	        })
	        ,
	        new Rush({
	        	conditions:function(observer,ms){
	        		if(ms > 1000)
	                return true;
	            },
	            enemies:[
	            	ENEMY_ARROW,
					ENEMY_SUN
	           	]
	        }),
	        new Rush({
	        	conditions:function(observer,ms){
	        		if(ms > 1000)
	                return true;
	            },
	            enemies:[
	            	ENEMY_ARROW,
					ENEMY_ARROW,
					ENEMY_ARROW
	           	]
	        }),
	        new Rush({
	        	conditions:function(observer,ms){
	        		if(ms > 1*1000)
	                return true;
	            },
	            enemies:[
	            	ENEMY_SUN,
					ENEMY_SUN
	           	]
	        }),
	        new Rush({
	        	conditions:function(observer,ms){
	        		if(ms < 2*1000)return false;
	        		//已经没有sun了
	        		var rs = observer.enemies.filter(function(e){
	        			if(e instanceof Sun)return true;
	        		});
	                if(rs.length<1 && !this.rushing){
	        			this.rushing = true;
	        			return true;
	        		}
	                
	                return this.rushing;
	            },
	            enemies:[
	            	ENEMY_SUN,
					ENEMY_SUN,
					ENEMY_SUN,
					ENEMY_SUN
	           	]
	        }),
	        new Rush({
	        	conditions:function(observer,ms){
	        		if(ms < 3*1000)return false;
	        		//怪物少于3个
	        		if(observer.enemies.length < 3 && !this.rushing){
	        			this.rushing = true;
	        			return true;
	        		}
	                
	                return this.rushing;
	            },
	            samePos:true,
	            enemies:[
	            	ENEMY_ARROW
	            	,ENEMY_ARROW
	            	,ENEMY_ARROW
	            	,ENEMY_ARROW
	            	,ENEMY_ARROW
	            	,ENEMY_ARROW
	            	,ENEMY_ARROW
	            	,ENEMY_ARROW
	            	,ENEMY_ARROW
	            	,ENEMY_ARROW
	           	]
	        }),
	        new Rush({
	        	conditions:function(observer,ms){
	        		if(ms < 5*1000)return false;
	        		//怪物少于3个
	        		if(observer.enemies.length < 3 && !this.rushing){
	        			this.rushing = true;
	        			return true;
	        		}
	                
	                return this.rushing;
	            },
	            samePos:true,
	            enemies:[
	            	ENEMY_ARROW2
	            	,ENEMY_ARROW2
	            	,ENEMY_ARROW2
	            	,ENEMY_ARROW2
	            	,ENEMY_ARROW2
	            	,ENEMY_ARROW2
	            	,ENEMY_ARROW2
	            	,ENEMY_ARROW2
	            	,ENEMY_ARROW2
	            	,ENEMY_ARROW2
	           	]
	        })
        );
	},
	start:function(game,player,scene){
		this.initRushQ(game);
		this.player = player;
		var warningLayer = scene.findView('warningLayer');
		warningLayer.onUpdate = function(){
			if(this.opacity>0){
				this.opacity -= .1;
			}
		}
		this.warningLayer = warningLayer;

		this.scoreTxt = scene.findView('scoreTxt');
		this.bombTxt = scene.findView('bombTxt');
		var energyBar = scene.findView('energyBar');
		var maxW = 188;
		energyBar.onUpdate = function(game){
			var maxHp = player.maxHp;
			var hp = player.hp;
			this.w = hp/maxHp * maxW;
			if(this.w < 0)this.w=0;
		}
		
	},
	over:function(){
		game.status.score = this.player.score;
	}
}

var ENEMY_ARROW = 1,ENEMY_ARROW2 = 2,
	ENEMY_SUN = 3;
/**
 * 出怪逻辑
 */
function Rush(data){
    data = data||{};
    this.conditions = data.conditions;
    this.enemies = data.enemies;
    this.positions = data.positions;
}