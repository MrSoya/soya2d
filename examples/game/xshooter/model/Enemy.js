soya2d.class('Enemy',{
	extends:soya2d.Sprite,
	constructor:function(data){

		this.bomber = new soya.Arc({
			w:50,h:50,
			strokeStyle:'#8d8d8d',
			fillStyle:'transparent',
			lineWidth:13,
			opacity:0,
			boom:function(x,y){
				if(this.booming)return;

				this.x = x;
				this.y = y;
				this.booming = true;
				this.opacity = .5;
			},
			reset:function(){
				this.booming = false;
				this.scaleTo(1);
				this.opacity = 0;
				this.lineWidth = 13;

				this.parent.remove(this);
			},	
			onUpdate:function(){
				if(this.booming){
					this.scaleBy(.2);
					this.lineWidth -= 2;
					if(this.lineWidth < 0.1){
						this.reset();
					}
				}
			}
		});

		this.opacity = 0;
		this.destroying = false;
	},
	boom:function(game){
		this.parent.add(this.bomber);
		this.bomber.boom(this.x,this.y);
		this.opacity = 0;
		var i = Observer.enemies.indexOf(this);
        if(i>-1){
        	Observer.enemies.splice(i,1);
        	this.parent.remove(this);
        }

		var boomSound = game.assets.sound('expo');
		if(boomSound)
		boomSound.play();
	},
	show:function(){
		var that = this;
		that.opacity = 1;
		this.parent.add(this.bomber);
		that.bomber.boom(that.x,that.y);
		var showSound = game.assets.sound('appear1');
		if(showSound)
		showSound.play();
	},
	//判断攻击
	checkAttack:function(game){
		//1.check player
		var player = Observer.player;
		var len = player.collideRadius + this.collideRadius;
        var dis = soya2d.Math.len2Df(player.x-this.x,player.y-this.y);
        if(dis<=len){
            this.boom(game);
            player.beAttacked(this);
            return;
        }

		//2.check bullets
		var bullets = Observer.flyingBullets;
		var disposeAry = [];
		for(var i=bullets.length;i--;){
			var len = bullets[i].collideRadius + this.collideRadius;
	        var dis = soya2d.Math.len2Df(bullets[i].x-this.x,bullets[i].y-this.y);
	        if(dis<=len){
	        	this.beAttacked(game,player,bullets[i],disposeAry);
	            break;
	        }
		}

		//dispose bullets
		for(var i=disposeAry.length;i--;){
			disposeAry[i].dispose(game);
		}
	},
	beAttacked:function(game,player,bullet,disposeAry){
    	this.hp -= bullet.atk;
    	if(this.hp <= 0){
    		this.boom(game);
    		disposeAry.push(bullet);
            player.addScore(this);
    	}
    },
    onUpdate:function(game){
    	this.checkAttack(game);
    }
});

/*************** instance ****************/
soya2d.class('Arrow',{
	extends:Enemy,
	constructor:function(data){
		soya2d.ext(this,data);

	    this.hp = 1;
	    this.atk = 1;
	    this.spd = 4;
	    this.score = 100;
	    this.o = 3;//角速度
	    this.angle = soya2d.Math.randomi(0,360);

	    this.player = data.player;

	    this.collideRadius = 12;//碰撞半径
	},
	onUpdate:function(game){
		this._super.onUpdate.call(this,game);

		//targetAngle
		var playx = this.player.x + this.player.w/2;
		var playy = this.player.y + this.player.h/2;

		var x = this.x + this.w/2;
		var y = this.y + this.h/2;
		
        var radian = Math.atan2(playy-y,playx-x);
		var targetAngle = (Math.round(soya2d.Math.toAngle(radian))+360)%360;

		//rotate
		var diff = Math.abs(targetAngle - (this.angle%360+360)%360);
		if(diff <= this.o){
			this.angle = targetAngle;
		}else{
			var pDiff,nDiff;
			if(this.angle < targetAngle){
				pDiff = targetAngle - this.angle;
				nDiff = 360 - targetAngle + this.angle;
			}else{
				nDiff = this.angle - targetAngle;
				pDiff = 360 - this.angle + targetAngle;
			}
			if(nDiff < pDiff){
				this.angle -= this.o;
			}else{
				this.angle += this.o;
			}
		}

		//move
		var sx = Math.cos(soya2d.Math.toRadian(this.angle))*this.spd;
        var sy = Math.sin(soya2d.Math.toRadian(this.angle))*this.spd;

        this.x += sx;
        this.y += sy;
	}
});

soya2d.class('Arrow2',{
	extends:Enemy,
	constructor:function(data){
		soya2d.ext(this,data);

	    this.hp = 1;
	    this.atk = 1;
	    this.spd = 7;
	    this.score = 150;
	    this.o = 4;//角速度
	    this.angle = soya2d.Math.randomi(0,360);

	    this.player = data.player;

	    this.collideRadius = 12;//碰撞半径
	},
	onUpdate:function(game){
		this._super.onUpdate.call(this,game);

		//targetAngle
		var playx = this.player.x + this.player.w/2;
		var playy = this.player.y + this.player.h/2;

		var x = this.x + this.w/2;
		var y = this.y + this.h/2;
		
        var radian = Math.atan2(playy-y,playx-x);
		var targetAngle = (Math.round(soya2d.Math.toAngle(radian))+360)%360;

		//rotate
		var diff = Math.abs(targetAngle - (this.angle%360+360)%360);
		if(diff <= this.o){
			this.angle = targetAngle;
		}else{
			var pDiff,nDiff;
			if(this.angle < targetAngle){
				pDiff = targetAngle - this.angle;
				nDiff = 360 - targetAngle + this.angle;
			}else{
				nDiff = this.angle - targetAngle;
				pDiff = 360 - this.angle + targetAngle;
			}
			if(nDiff < pDiff){
				this.angle -= this.o;
			}else{
				this.angle += this.o;
			}
		}

		//move
		var sx = Math.cos(soya2d.Math.toRadian(this.angle))*this.spd;
        var sy = Math.sin(soya2d.Math.toRadian(this.angle))*this.spd;

        this.x += sx;
        this.y += sy;
	}
});

soya2d.class('Sun',{
	extends:Enemy,
	constructor:function(data){
		soya2d.ext(this,data);
		this.hp = 1;
	    this.atk = 3;
	    this.spd = 4;
	    this.o = 3;
	    this.score = 200;

	    this.player = data.player;

	    this.collideRadius = 25;//碰撞半径
	},
	onUpdate:function(game){
		this._super.onUpdate.call(this,game);

		this.angle += this.o;
		//targetAngle
		var playx = this.player.x + this.player.w/2;
		var playy = this.player.y + this.player.h/2;

		var x = this.x + this.w/2;
		var y = this.y + this.h/2;
		
        var radian = Math.atan2(playy-y,playx-x);

		//move
		var sx = Math.cos(radian)*this.spd;
        var sy = Math.sin(radian)*this.spd;

        this.x += sx;
        this.y += sy;
	}
});

