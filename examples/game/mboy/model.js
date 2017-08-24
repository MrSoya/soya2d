var STATE_STAY = 1,
STATE_JUMPING = 2,
STATE_MOVING = 3,
STATE_DIE = 4;
soya2d.class("Hero",{
	extends:soya2d.Sprite,
	constructor:function(){
		this.game.world.add(this);

		this.frameIndex = 5;
		this.animations.add('jump',[4]);
		this.animations.add('move',[0,1,2],5);

		//stay moving jumping
		this.state = 1;
		this.coins = 0;
		this.hp = 6;

	},
	onUpdate:function(game){
		if(this.state == STATE_DIE)return;
		var kb = game.input.keyboard;
		if(kb.isPressing){
			if(kb.keys.indexOf(soya2d.KeyCode.A) > -1){
				this.move(-1);
				this.x -= 8;

			}else if(kb.keys.indexOf(soya2d.KeyCode.D) > -1){
				this.move(1);
				this.x += 8;
			}

			if(kb.keys.indexOf(soya2d.KeyCode.J) > -1){
				this.shoot(1);
			}
		}
		if(kb.isDown){
			if(kb.keys.indexOf(soya2d.KeyCode.K) > -1){
				this.jump();
			}
		}
		if(kb.isUp){
			this.stay();
		}
	},
	disappear:function(){
		this.events.clear();
		var game = this.game;
		var t = this.game.tween.add(this).to({scaleX:0,scaleY:0,angle:720},1).play();
		t.on('stop',function(){
			game.scene.start(overScene,true);
		});
	},
	onTileCollision:function(tile){
		if(tile.direction == 'top'){
			this.state = STATE_MOVING;
			this.stay();
		}
	},
	jump:function(){
		if(this.state == STATE_JUMPING)return;
		this.state = STATE_JUMPING;
		this.animations.stop();
		this.frameIndex = 4;
		this.body.velocity(0,-13);
	},
	//left or right
	move:function(dir){
		if(this.state == STATE_STAY){
			this.state = STATE_MOVING;
		}
		if(this.state == STATE_MOVING){
			if(dir < 0 && this.scaleX > -1){
				this.scaleX = -1;
			}else if(dir > 0){
				this.scaleX = 1;
			}
		
			var that = this;
			if(this.state != STATE_MOVING && this.state != STATE_STAY)return;
			this.animations.play('move');
		}
	},
	stay:function(){
		if(this.state == STATE_MOVING){
			this.animations.stop();
			this.frameIndex = 5;
			this.state = STATE_STAY;
		}
	},
	shoot:function(){
		this.frameIndex = 3;
	},
	addCoin:function(scene){
		var coins = scene.findView('coins');
		coins.setText(++this.coins);
	},
	hurt:function(scene){
		if(this.invincible)return;

		var hp = scene.findView('hp');
		hp.frameIndex = --this.hp - 1;
		if(hp.frameIndex < 0 )hp.frameIndex = 0;

		//hurt action
		this.body.velocity(-5,-5);
		this.frameIndex = 6;

		this.invincible = true;
		var hero = this;
		var t = game.tween.add(this).to({opacity:0},.2,{repeat:3,yoyo:true}).play();
		t.on('stop',function(){
			hero.invincible = false;
		});

		if(this.hp == 0){
			this.die();
		}
	},
	die:function(){
		this.frameIndex = 7;
		this.state = STATE_DIE;
	}
});