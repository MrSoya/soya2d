
soya2d.class('Player',{
	extends:soya2d.Sprite,
	constructor:function(data){
		soya2d.ext(this,data);

		this.view = data.view;

		//默认只有一个枪槽
		this.bulletType = data.bulletType;
	    this.setBarrel(3);

	    this.bomb = 3;//保护
	    this.score = 0;
	    this.hp = 10;
	    this.maxHp = 10;

	    this.collideRadius = 20;//碰撞半径

	    this.bomber = new soya.Arc({
			x:this.w/2 - 50,y:this.h/2 - 50,
			w:100,h:100,
			strokeStyle:'#ddd',
			fillStyle:'transparent',
			lineWidth:15,
			opacity:0,
			startAngle:0,
			endAngle:360,
			boom:function(){
				if(this.booming)return;
				this.booming = true;
				this.opacity = .5;
			},
			reset:function(){
				this.booming = false;
				this.scaleTo(1);
				this.opacity = 0;
				this.lineWidth = 15;
			},
			onUpdate:function(){
				if(this.booming){
					this.scaleBy(.7);
					this.lineWidth -= 1;
					if(this.lineWidth < 0.1){
						this.reset();
					}
				}
			}
		});
		this.add(this.bomber);

	    this.scope = data.scope;
	    this.speed = 7;

	    this.on('keydown',function(e){
			if(e.keyCode == soya2d.KeyCode.SPACE){
				this.boom();
			}
		});

	    //move
		this.on('keypress',function(e){
			var playerx=0,playery=0;
			var x=0,y=0;
			var tileSpd = 2;
			if(e.contains(soya2d.KeyCode.A)){
				playerx = -this.speed;
				x = tileSpd;
			}else if(e.contains(soya2d.KeyCode.D)){
				playerx = this.speed;
				x = -tileSpd;
			}

			if(e.contains(soya2d.KeyCode.W)){
				playery = -this.speed;
				y = tileSpd;
			}else if(e.contains(soya2d.KeyCode.S)){
				playery = this.speed;
				y = -tileSpd;
			}
			this.move(playerx,playery);
		});
	},
	setBarrel:function(num){
		if(num<2){
			this.add(new GunBarrel({
		    	x:this.w,
		    	y:this.h/2-5,
		    	ship:this
		    }));
		}else 
		if(num<3){
			this.add(new GunBarrel({
		    	x:this.w,
		    	y:this.h/4,
		    	ship:this
		    }));
		    this.add(new GunBarrel({
		    	x:this.w,
		    	y:this.h/1.5,
		    	ship:this
		    }));
		}else 
		if(num<4){
			this.add(new GunBarrel({
		    	x:this.w,
		    	y:this.h/2-20,
		    	angle:350,
		    	ship:this
		    }));

		    this.add(new GunBarrel({
		    	x:this.w,
		    	y:this.h/2,
		    	ship:this
		    }));

		    this.add(new GunBarrel({
		    	x:this.w,
		    	y:this.h/2+20,
		    	angle:9,
		    	ship:this
		    }));
		}
		
	},
	onUpdate:function(game){
		if(this.swing-- > 0){
			var rad = soya2d.Math.toRadian(soya2d.Math.randomi(0,360));
        	var rx = Math.cos(rad)*this.swing + this.sx,
        		ry = Math.sin(rad)*this.swing + this.sy;
			this.x = rx;
			this.y = ry;

			return;
		}

		if(this.firing){
			this.children.forEach(function(s){
				if(s.fire)
	            s.fire(game);
	        });
		}
	},
	fire:function(t){
		this.firing = true;
    	this.children.forEach(function(s){
    		if(s.fire)
            s.canfire = true;
        });
    },
    holdfire:function(){
    	this.firing = false;
        this.children.forEach(function(s){
        	if(s.fire)
            s.canfire = false;
        });
    },
    addScore:function(enemy){
    	this.score += enemy.score;
		Observer.scoreTxt.setText(this.score);
    },
    beAttacked:function(enemy){
    	this.hp -= enemy.atk;
    	if(this.hp <= 0){
    		this.boom();
    		this.game.events.emit('gameover');
    	}
    	Observer.warningLayer.opacity = 1;
    },
    move:function(x,y){
    	this.x += x,
    	this.y += y;
    	if(this.x < this.scope.x){
    		this.x = 0;
    	}else if(this.x+this.w > this.scope.getRight()){
    		this.x = this.scope.getRight()-this.w;
    	}

    	if(this.y < this.scope.y){
    		this.y = 0;
    	}else if(this.y+this.h > this.scope.getBottom()){
    		this.y = this.scope.getBottom()-this.h;
    	}
    },
	spin:function(angle){
		this.angle = angle;
	},
	shake:function(){
		this.swing = 30;
		this.sx = this.x;
		this.sy = this.y;
	},
	boom:function(){
		if(this.bomb < 1 || this.swing>0)return;
		this.bomb --;
		this.bomber.boom();

		//shake view
		this.shake();
		
		var boomSound = this.game.assets.sound('gameover');
		if(boomSound)
		boomSound.volume(.5).play();

		//enemies
		for(var i=Observer.enemies.length;i--;){
			Observer.enemies[i].boom(this.game);
		}

		Observer.bombTxt.setText(this.bomb);
	}
});

soya2d.class('Bullet',{
	extends:soya2d.Sprite,
	constructor:function(data){
		soya2d.ext(this,data);
		this.spd = [];
		this.atk = 1;
		this.opacity = 0;

		this.collideRadius = 5;//碰撞半径
	},
	onUpdate:function(game){
		var sx = this.spd[0];
		var sy = this.spd[1];
		this.x += sx;
		this.y += sy;

		//check bounds
		if(this.x < 0 
			|| this.y < 0
			|| this.x > game.world.w
			|| this.y > game.world.h){
			this.dispose();
		}
	},
	dispose:function(){
        this.opacity = 0;
        var i = Observer.flyingBullets.indexOf(this);
        if(i>-1){
        	Observer.flyingBullets.splice(i,1);
        	this.parent.remove(this);
        }
    }
});

soya2d.class('GunBarrel',{
	extends:soya2d.Shape,
	constructor:function(data){
		soya2d.ext(this,data);

		this.ship = data.ship;
	    this.spd = 13;//发射速度
	    this.bullets = [];
	    
	    this.rate = 1.0;//.5
	    this.canfire = false;
	    this.d = 0;

	    this.init();
	},
	init:function(){
		for(var i=30;i--;){
	        var bc = this.ship.bulletType.clone();
	        this.bullets.push(bc);
	    }
	},
	onRender:function(g){
		//debug
		g.fillStyle('red');
		//g.fillRect(0,0,10,10);
	},
	fire:function(game){
        if(!this.canfire)return;
        if(!this.lastTime){
            this.lastTime = Date.now();
        }else{
        	var now = Date.now();
	        this.d += (now - this.lastTime)/1000;
	        if(this.d < this.rate)return;
	        this.lastTime = now;
        	this.d = 0;
        }

        var fireSound = game.assets.sound('fire');

        var m = soya2d.Math;
        var rotation = this.ship.angle + this.angle;
        //var sx = m.COSTABLE[this.angle>>0]*this.spd;
        //var sy = m.SINTABLE[this.angle>>0]*this.spd;
        var sx = Math.cos(soya2d.Math.toRadian(rotation))*this.spd;
        var sy = Math.sin(soya2d.Math.toRadian(rotation))*this.spd;

        for(var i=this.bullets.length;i--;){
            var b = this.bullets[i];
            if(b.opacity)continue;
            b.angle = rotation;

            //relocate
            b.x = this.ship.x + this.ship.w/2 - b.w/2;
            b.y = this.ship.y + this.ship.h/2 - b.h/2;
            
            b.spd[0] = sx;
            b.spd[1] = sy;
            b.opacity = 1;
            this.game.world.add(b);
            Observer.flyingBullets.push(b);
            if(fireSound)
            fireSound.play();

            break;
        }
    }
});