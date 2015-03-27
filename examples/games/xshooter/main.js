/**
 * 出怪逻辑
 */
function Rush(data){
    data = data||{};
    this.conditions = data.conditions;
    this.enemies = data.enemies;
    this.positions = data.positions;
}

var ENEMY_ARROW = 1,
	ENEMY_SUN = 2;

var scene = new soya.Scene({
	state:'',
	score:0,
	duration:30,
	rushQueue:[],
	flyingBullets:[],
	enemies:[],
	onInit:function(game){
		var thisScene = this;
		var spacew = game.w * 1.2,
			spaceh;
		var view = new soya2d.ScrollSprite({
			w:game.w,
			h:game.h,
			//freezone:new soya2d.GeoRect(game.w/2-50,game.h/2-25,100,50)
		});
		this.add(view);
		this.view = view;

		var warningLayer = new soya2d.Rect({
			w:game.w,
			h:game.h,
			opacity:0,
			fillStyle:'#ddd',
			onUpdate:function(){
				if(this.opacity>0){
					this.opacity--;
				}
			}
		});
		this.add(warningLayer);
		
		//bg
		var bgTex = game.textureManager.findOne('assets/image/bg.jpg');
		var bgTexw = bgTex.w,
			bgTexh = bgTex.h;
		var factor = bgTexh / bgTexw;
		var spaceh = factor * spacew;
		var bg = new soya.Sprite({
			textures:bgTex,
			w:spacew,h:spaceh
		});
		view.add(bg);
		view.setScope(new soya2d.Rectangle(0,0,spacew,spaceh));


		var bg2 = new soya.Sprite({
			textures:game.textureManager.findOne('assets/image/bg2.png'),
			x:spacew - 200,
			y:100,
			scaleX:1.5,
			scaleY:1.5
		});
		view.add(bg2);
		this.fog = new soya.TileSprite({
			sprite:game.textureManager.findOne('assets/image/fog.png'),
			w:spacew,h:spaceh,
			speed:1
		});
		view.add(this.fog);

		var bg1 = new soya.Sprite({
			textures:game.textureManager.findOne('assets/image/bg1.png'),
			x:-100,
			y:spaceh - 300,
			scaleX:1.5,
			scaleY:1.5
		});
		view.add(bg1);
		

		//player
		var bullet = new Bullet({
			textures:game.textureManager.findOne('assets/image/bullet1.png')
		});
		this.player = new Player({
			textures:game.textureManager.findOne('assets/image/player.png'),
			bulletType:bullet,
			x:game.w/2,
			y:game.h/2,
			rotation:0,
			scope:view.scope,
			view:view
		});
		view.add(this.player);
		view.follow(this.player);
		this.player.warningLayer = warningLayer;
		this.player.scene = this;
		this.player.game = game;
		//this.start(game);

		var speed = 7;
		game.on('mousemove',function(e){
			var x = e.x;
			var y = e.y;

			var wpe = thisScene.player.__worldPosition.e;
            var radian = Math.atan2(wpe[1]-y,wpe[0]-x);
            radian = soya2d.Math.toAngle(radian);
            thisScene.player.spin(radian+180);
		});
		game.on('mousedown',function(e){
			thisScene.player.fire();
		});
		game.on('mouseup',function(e){
			thisScene.player.holdfire();
		});
		thisScene.player.on('keydown',function(e){
			if(e.keyCode == soya2d.KeyCode.SPACE){
				this.boom();
			}
		});
		this.on('keypress',function(e){
			var playerx=0,playery=0;
			var x=0,y=0;
			var tileSpd = 2;
			if(e.keyCodes.indexOf(soya2d.KeyCode.A) > -1){
				playerx = -speed;
				x = tileSpd;
			}else if(e.keyCodes.indexOf(soya2d.KeyCode.D) > -1){
				playerx = speed;
				x = -tileSpd;
			}

			if(e.keyCodes.indexOf(soya2d.KeyCode.W) > -1){
				playery = -speed;
				y = tileSpd;
			}else if(e.keyCodes.indexOf(soya2d.KeyCode.S) > -1){
				playery = speed;
				y = -tileSpd;
			}
			thisScene.player.move(playerx,playery);
			this.fog.scroll(x,y);
		});

		this.initTips(game);
		this.initRush(game);

		this.start(game);
	},
	//显示游戏场景文字内容
	initTips:function(game){
		var atlas = game.texAtlasManager.findOne('imgFont');
		this.font = new soya2d.ImageFont(atlas);
		this.font.size(15);

		//score
		var scoreTip = new soya2d.Text({
			text:'score:',
			font:this.font,
			w:140,
			y:10,
			x:10,
			z:9
		});
		this.add(scoreTip);
		var thisScene = this;
		this.scoreTxt = new soya2d.Text({
			text:'0',
			font:this.font,
			x:55,
			scaleY:.8,
			w:100
		});
		scoreTip.add(this.scoreTxt);

		//bomb
		var bombTip = new soya.Sprite({
			textures:game.textureManager.findOne('assets/image/bomb.png'),
			x:game.w/2 - 20,
			y:game.h - 10 - 15
		});
		this.add(bombTip);
		this.bombTxt = new soya2d.Text({
			text:'3',
			font:this.font,
			x:15,
			y:1,
			w:10
		});
		bombTip.add(this.bombTxt);

		//energy
		var energyTip = new soya2d.Text({
			text:'energy:',
			font:this.font,
			w:140,
			y:10,
			x:game.w - 260,
			z:9
		});
		this.add(energyTip);
		var EnergyBarBox = new soya2d.Rect({
			w:190,h:12,
			x:50 + 15,
			strokeStyle:'#fff',
			lineWidth:2,
			fillStyle:'transparent'
		});
		var EnergyBar = new soya2d.Rect({
			w:188,h:10,
			maxW:188,
			x:1,y:1,
			fillStyle:'red',
			onUpdate:function(game){
				var maxHp = game.scene.player.maxHp;
				var hp = game.scene.player.hp;
				this.w = hp/maxHp * this.maxW;
			}
		});
		EnergyBarBox.add(EnergyBar);
		energyTip.add(EnergyBarBox);

		//beans
		var beansTip = new soya2d.Text({
			text:'beans:',
			font:this.font,
			w:140,
			y:game.h - 25,
			x:10,
			z:9
		});
		this.add(beansTip);
		this.beansTxt = new soya2d.Text({
			text:'0',
			font:this.font,
			x:40+15,
			y:1,
			w:100
		});
		beansTip.add(this.beansTxt);
	},
	initRush:function(game){
		this.rushQueue.push(
			new Rush({
	            enemies:[
	            	ENEMY_ARROW
	           	]
	        })
	        ,
	        new Rush({
	        	conditions:function(scene,ms,frames){
	        		if(ms > 2*1000)
	                return true;
	            },
	            enemies:[
	            	ENEMY_ARROW,
					ENEMY_SUN
	           	]
	        }),
	        new Rush({
	        	conditions:function(scene,ms,frames){
	        		if(ms > 4*1000)
	                return true;
	            },
	            enemies:[
	            	ENEMY_ARROW,
					ENEMY_ARROW,
					ENEMY_ARROW
	           	]
	        }),
	        new Rush({
	        	conditions:function(scene,ms,frames){
	        		if(ms > 6*1000)
	                return true;
	            },
	            enemies:[
	            	ENEMY_SUN,
					ENEMY_SUN
	           	]
	        }),
	        new Rush({
	        	conditions:function(scene,ms){
	        		if(ms < 6*1000)return false;
	        		//已经没有sun了
	        		var rs = scene.enemies.filter(function(e){
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
	        	conditions:function(scene,ms){
	        		if(ms < 6*1000)return false;
	        		//怪物少于3个
	        		if(scene.enemies.length < 3 && !this.rushing){
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
	        })
        );
	},
	start:function(game){
		this.state = STATE_INIT;
		this.score = 0;

		//bgm
		var music = game.soundManager.findOne('bgm');
		if(music)music.loop(true).play().fade(0,.5,4000);

		//启动出怪逻辑
		var thisScene = this;
		game.addTask(function(game,exp,ms,times,frames){
			if(thisScene.rushQueue.length===0)return;

			var rcx = thisScene.player.x,
		        rcy = thisScene.player.y;
	        var r = 300;
        	var rad = soya2d.Math.toRadian(soya2d.Math.randomi(0,360));
        	var rx = Math.cos(rad)*r + rcx,
        		ry = Math.sin(rad)*r + rcy;

			thisScene.rushQueue.forEach(function(rush){
				if(!rush.conditions || 
					(rush.conditions && rush.conditions(thisScene,ms,frames))){

		            var enemy = rush.enemies.shift();
		        	if(!enemy)return;
	            	var sp;
	            	switch(enemy){
	            		case ENEMY_ARROW:
	            			sp = new Arrow({
								player:thisScene.player,
								textures:game.textureManager.findOne('assets/image/enemy1.png')
							});
							break;
						case ENEMY_SUN:
	            			sp = new Sun({
								player:thisScene.player,
								textures:game.textureManager.findOne('assets/image/enemy2.png')
							});
							break;
	            	}
	                var x = rush.x || rx;
	                var y = rush.y || ry;

	                if(rush.enemies.length>1 && rush.samePos){
	                	rush.x = x;
	                	rush.y = y;
	                }

	                sp.x = x;
	                sp.y = y;
	                thisScene.view.add(sp);
	                thisScene.enemies.push(sp);
	                sp.show();
				}
			});
		},'0/5');
	},
	gameover:function(){
		if(this.state != STATE_RUNNING)return;
		this.state = STATE_OVER;
		

	},
	hit:function(x,y){
		
	}
});

//加载资源
var loader = new soya.LoaderScene({
    nextScene:scene,
    texAtlas:[
        {
            id:'imgFont',
            ssheet:'xshooter/assets/image/font.ssheet',
            image:'xshooter/assets/image/font.png'
        },
    ],
    textures:['xshooter/assets/image/bg.jpg'
        ,'xshooter/assets/image/bg1.png'
        ,'xshooter/assets/image/fog.png'
        ,'xshooter/assets/image/bg2.png'
        ,'xshooter/assets/image/player.png'
        ,'xshooter/assets/image/bullet1.png'
        ,'xshooter/assets/image/enemy1.png'
        ,'xshooter/assets/image/enemy2.png'
        ,'xshooter/assets/image/enemy4.png'
        ,'xshooter/assets/image/enemy44.png'
        ,'xshooter/assets/image/pstar.png'
        ,'xshooter/assets/image/bean1.png'
        ,'xshooter/assets/image/bean2.png'
        ,'xshooter/assets/image/bean3.png'
        ,'xshooter/assets/image/bean4.png'
        ,'xshooter/assets/image/bomb.png'
    ],
    sounds: [
        ['xshooter/assets/sound/bgm.mp3']
        ,['xshooter/assets/sound/bean1.mp3']
        ,['xshooter/assets/sound/bean2.mp3']
        ,['xshooter/assets/sound/bean3.mp3']
        ,['xshooter/assets/sound/bean4.mp3']
        ,['xshooter/assets/sound/appear1.mp3']
        ,['xshooter/assets/sound/expo.mp3']
        ,['xshooter/assets/sound/fire.mp3']
        ,['xshooter/assets/sound/hurt.mp3']
        ,['xshooter/assets/sound/gameover.mp3']
    ]
});