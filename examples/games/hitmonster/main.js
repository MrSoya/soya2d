
/************* model ****************/

function Monster(data){
	data = data||{};
    soya2d.Sprite.call(this,data);
    soya2d.ext(this,data);

	this.hiding = false;
	this.showing = false;
}
soya2d.inherits(Monster,soya2d.Sprite);
soya2d.ext(Monster.prototype,{
	reset:function(){
		this.stopAnimation();
		this.hiding = this.showing = false;
		this.y = this.sy;
	},
	hit:function(game,e){
		if(this.hiding)return;
		this.hiding = true;
		var that = this;
		this.stopAnimation().animate({y:this.sy},200,{
			easing:soya2d.Tween.Expo.Out,
			onEnd:function(){
				that.showing = false;
				that.port.showInGame();
				that.hiding = false;
				
				//play sound
				var hit = game.soundManager.find('hit');
				hit.play();
			}	
		});

		//play sound
		var score = game.soundManager.find({url:'score',fuzzy:true});
		score.play();
		
		//refresh scores
		var x = e.x,y = e.y;
		if(soya2d.Device.mobile){
			var touchList = e.touchList;
			x = touchList[0];
			y = touchList[1];
		}
		var addText = new soya2d.Text({
			text:'+10',
			font:game.scene.font,
			w:80,
			y:y,
			x:x - 40
		});
		game.scene.add(addText);
		addText.animate({opacity:0,y:'-80'},700,{onEnd:function(t){
			t.parent.remove(t);
		}});
		
		game.scene.score += 10;
		game.scene.scoreText.setText(game.scene.score);
	}
});

function Port(monsters,game){
	this.x = 0;
	this.y = 0;
	this.monsters = monsters;
	
	this.getMonster = function(){
		var tmp = this.monsters.filter(function(m){
			if(!m.showing && !m.hiding)return true;
		});
		var seed = soya2d.Math.randomi(0,tmp.length);
		var faceDir = Math.random()*10 > 5?1:-1;
		var m = tmp[seed];
		m.scaleX = faceDir;
		
		return m;
	}

	this.showingMonster = null;

	this.stop = function(){
		clearTimeout(timer);
		if(this.showingMonster){
			this.showingMonster.showing = false;
		}
		return this;
	}

	var timer;
	this.show = function(){
		var that = this;
		timer = setTimeout(function(){
			var m = that.getMonster();
			m.y = that.y;
			m.x = that.x;
			m.sy = m.y;
			m.port = that;
			m.showing = true;
			that.showingMonster = m;
			var l=1;
			m.animate({y:'-100'},500,{
				alternate:true,
				iteration:1,
				easing:soya2d.Tween.Sine.InOut,
				onEnd:function(){
					if(l++ < 2)return;
					m.showing = false;
					if(game.scene.state == STATE_RUNNING){
						that.showInGame();
					}else if(game.scene.state != STATE_CUTTO){
						that.show();
					}
				}
			});
		},Math.random()*2000+500);
	}
	
	this.showInGame = function(){
		var that = this;
		timer = setTimeout(function(){
			if(game.scene.state != STATE_RUNNING)return;
			var m = that.getMonster();
			m.y = that.y;
			m.x = that.x;
			m.sy = m.y;
			m.port = that;
			m.showing = true;
			that.showingMonster = m;
			var l=1;
			m.animate({y:'-260'},Math.random()*500+500,{
				alternate:true,
				iteration:1,
				easing:soya2d.Tween.Sine.InOut,
				onEnd:function(){
					if(l++ < 2)return;
					m.showing = false;
					
					if(game.scene.state == STATE_RUNNING){
							that.showInGame();
					}else if(game.scene.state != STATE_CUTTO){
						that.show();
					}
				}
			});
			
			//play sound
			var sounds = game.soundManager.findAll({urls:['spawn1','spawn2','spawn3','spawn4','spawn5'],fuzzy:true});
			var sd = soya2d.Math.randomi(0,sounds.length-1);
			sounds[sd].play();
			
		},Math.random()*2000+500);
	}
}

var scene = new soya.Scene({
	state:'',
	score:0,
	duration:30,
	onInit:function(game){
		var thisScene = this;

		var atlas = game.texAtlasManager.find('imgFont');
		this.font = new soya2d.ImageFont(atlas);
		var soyaFont = this.font.clone();
		soyaFont.size(30);
				
		var soyaText = new soya2d.Text({
			text:'MADE BY SOYA2D',
			font:soyaFont,
			letterSpacing:0,
			w:300,
			y:game.h - 60,
			x:game.w/2 - 150,
			z:1
		});
		this.add(soyaText);
		
		this.timeText = new soya2d.Text({
			text:'',
			font:this.font,
			w:140,
			y:20,
			opacity:0,
			x:game.w/2 - 70,
			z:1
		});
		this.add(this.timeText);
		
		this.scoreText = new soya2d.Text({
			text:'0',
			font:this.font,
			letterSpacing:0,
			w:1010,
			y:20,
			x:20,
			z:1
		});
		this.add(this.scoreText);
		
		this.tipText = new soya2d.Text({
			text:'CLICK TO START',
			font:this.font,
			letterSpacing:0,
			w:370,
			y:20,
			x:game.w/2 - 370/2,
			z:1
		});
		this.add(this.tipText);
		
		//tile
		var tile = new soya.TileSprite({
			sprite:game.textureManager.find('assets/bg.png'),
			autoScroll:true,
			speed:1
		});
		this.add(tile);
		

		//show logo
		this.logo = new soya2d.Sprite({
			textures:game.textureManager.find('assets/logo.png'),
			x:game.w/2 - 300,
			y:150,
			z:1,
			scaleX:0.1,
			scaleY:0.1
		});
		this.add(this.logo);
		
		this.over = new soya2d.Sprite({
			textures:game.textureManager.find('assets/gameover.png'),
			x:game.w/2 - 225,
			y:130,
			z:1,
			scaleX:0.1,
			scaleY:0.1,
			visible:false
		});
		this.add(this.over);

		
		this.restart = new soya2d.Sprite({
			textures:game.textureManager.find('assets/restart.png'),
			x:game.w/2 - 115,
			y:game.h - 300,
			z:1,
			scaleX:0.1,
			scaleY:0.1,
			visible:false
		});
		this.add(this.restart);
		
		this.restart.on(soya2d.Device.mobile?'touchstart':'click',function(e){
			if(this.isRendered())
			thisScene.start(game);
		});
		//pc only
		this.restart.on('mouseover',function(e){
			this.scaleBy(0.1);
		});
		this.restart.on('mouseout',function(e){
			this.scaleBy(-0.1);
		});
		
		var readyTex = game.textureManager.find('assets/ready.png');
		this.ready = new soya2d.Sprite({
			textures:readyTex,
			x:-readyTex.w,
			sx:-readyTex.w,
			y:150,
			opacity:0
		});
		this.add(this.ready);
		

		
		//init monsters
		this.monsters = [
			new Monster({
				textures:game.textureManager.find('assets/monster1.png'),
				x:-1300
			}),
			new Monster({
				textures:game.textureManager.find('assets/monster2.png'),
				x:-3100
			}),
			new Monster({
				textures:game.textureManager.find('assets/monster3.png'),
				x:-1300
			}),
			new Monster({
				textures:game.textureManager.find('assets/monster4.png'),
				x:-1300
			}),
			new Monster({
				textures:game.textureManager.find('assets/monster5.png'),
				x:-1300
			})
		];
		
		for(var i=this.monsters.length;i--;){
			var m = this.monsters[i];
			this.add(m);
			m.on(soya2d.Device.mobile?'touchstart':'click',function(e){
				if(thisScene.state == STATE_RUNNING){
					var y = e.y;
					if(soya2d.Device.mobile){
						var touchList = e.touchList;
						y = touchList[1];
					}

					if(y > game.h - 200){
						return;
					}
					thisScene.lastHit = this;
					
					this.hit(game,e);
				}
			},1);
		}
		
		//init ports
		var p1 = new Port(this.monsters,game);
		p1.x = 73;
		var p2 = new Port(this.monsters,game);
		p2.x = 273;
		var p3 = new Port(this.monsters,game);
		p3.x = 473;
		var p4 = new Port(this.monsters,game);
		p4.x = 673;
		var p5 = new Port(this.monsters,game);
		p5.x = 873;
		p1.y = p2.y = p3.y = p4.y = p5.y = 575;
		
		this.ports = [p1,p2,p3,p4,p5];

		//ground
		var ground = new soya2d.Sprite({
			textures:game.textureManager.find('assets/fg.png'),
			y:game.h - 200
		});
		this.add(ground);

		this.start(game);
	},
	start:function(game){
		this.state = STATE_INIT;
		this.score = 0;
		this.duration = 30;

		this.logo.scaleX = this.logo.scaleY = 0.1;
		this.logo.animate({scaleX:1,scaleY:1},2000,{easing:soya2d.Tween.Elastic.Out,onEnd:function(t){
			t.animate({y:'+20'},1500,{
				iteration:-1,
				alternate:true
			});
		}});
		this.logo.visible = true;
		if(this.tipText)this.tipText.visible = true;

		//show monsters
		for(var i=this.ports.length;i--;){
			this.ports[i].stop();
			this.monsters[i].reset();
			this.ports[i].show();
		}

		//bgm
		var music = game.soundManager.find({url:'music',fuzzy:true});
		if(music)music.loop(true).fade(0,0.5,4000).play();

		this.over.visible = false;
		this.restart.visible = false;

		this.scoreText.setText(0);

		if(this.timeText){
			this.timeText.opacifyTo(0).setText(this.duration);
		}
		
	},
	play:function(game){
		if(this.state != STATE_INIT)return;
		this.state = STATE_CUTTO;
		//
		this.logo.visible = false;
		this.logo.stopAnimation();
		this.tipText.visible = false;

		var thisScene = this;
		this.ready.x = this.ready.sx;
		this.ready.opacifyTo(1).animate({x:game.w},3000,{
			onEnd:function(t){
				t.opacity = 0;
				var music = game.soundManager.find({url:'music',fuzzy:true});
				if(music)music.fade(1,0,500);
				
				//
				thisScene.state = STATE_RUNNING;
				//show monsters
				for(var i=thisScene.ports.length;i--;){
					thisScene.ports[i].stop();
					thisScene.monsters[i].reset();
					thisScene.ports[i].showInGame();
				}
				//show timer
				thisScene.timeText.opacifyTo(1);
			}
		});
	},
	gameover:function(){
		if(this.state != STATE_RUNNING)return;
		this.state = STATE_OVER;
		//
		//show monsters
		for(var i=this.ports.length;i--;){
			this.ports[i].stop();
			this.monsters[i].reset();
			this.ports[i].show();
		}
		this.timeText.opacifyTo(1);

		//show tip
		this.over.visible = true;
		this.over.scaleX = this.over.scaleY = 0.1;//等于0时有问题，需要解决
		this.over.animate({scaleX:1,scaleY:1},2000,{easing:soya2d.Tween.Elastic.Out,onEnd:function(t){
			t.animate({y:'+20'},1500,{
				iteration:-1,
				alternate:true
			});
		}});
		
		this.restart.visible = true;
		this.restart.scaleX = this.restart.scaleY = 0.1;//等于0时有问题，需要解决
		this.restart.animate({scaleX:1,scaleY:1},1000,{easing:soya2d.Tween.Elastic.Out});
	},
	hit:function(x,y){
		if(this.lastHit){
			this.lastHit = null;
			return;
		}
		var deduct = new soya2d.Text({
			text:'-10',
			font:this.font,
			w:80,
			y:y,
			x:x - 40
		});
		this.add(deduct);
		deduct.animate({opacity:0,y:'-80'},700,{onEnd:function(t){
			t.parent.remove(t);
		}});
				
		//play sound
		var miss = game.soundManager.find({url:'miss',fuzzy:true});
		miss.play();
				
		//refresh scores
		this.score -= 10;
		if(this.score < 0)this.score=0;
		this.scoreText.setText(this.score);
		
	}
});
//加载资源
var loader = new soya.LoaderScene({
		nextScene:scene,
		texAtlas:[
			{id:'imgFont',ssheet:'assets/font.ssheet',image:'assets/font.png'},
		],
		textures:['assets/bg.png'
					,'assets/fg.png'
					,'assets/font.png'
					,'assets/gameover.png'
					,'assets/logo.png'
					,'assets/monster1.png'
					,'assets/monster2.png'
					,'assets/monster3.png'
					,'assets/monster4.png'
					,'assets/monster5.png'
					,'assets/particle.png'
					,'assets/ready.png'
					,'assets/restart.png'
				]
		/* 有些移动环境不支持主动加载
		,sounds:[
			['assets/sound/music.m4a','assets/sound/music.ogg','assets/sound/music.mp3']
			,['assets/sound/hit.m4a','assets/sound/hit.ogg']
			,['assets/sound/score.m4a','assets/sound/score.ogg']
			,['assets/sound/miss.m4a','assets/sound/miss.ogg']
			,['assets/sound/spawn1.m4a','assets/sound/spawn1.ogg']
			,['assets/sound/spawn2.m4a','assets/sound/spawn2.ogg']
			,['assets/sound/spawn3.m4a','assets/sound/spawn3.ogg']
			,['assets/sound/spawn4.m4a','assets/sound/spawn4.ogg']
			,['assets/sound/spawn5.m4a','assets/sound/spawn5.ogg']
		]
		//*/
});

/***************** 事件 ******************/
scene.on(soya2d.Device.mobile?'touchstart':'click',function(e){
	var music = game.soundManager.find({url:'music',fuzzy:true});
	if(!music){
		//加载音频，针对必须由事件触发的环境
		game.loadRes({
			sounds: [
		['assets/sound/music.m4a','assets/sound/music.ogg','assets/sound/music.mp3']
		,['assets/sound/hit.m4a','assets/sound/hit.ogg']
		,['assets/sound/score.m4a','assets/sound/score.ogg']
		,['assets/sound/miss.m4a','assets/sound/miss.ogg']
		,['assets/sound/spawn1.m4a','assets/sound/spawn1.ogg']
		,['assets/sound/spawn2.m4a','assets/sound/spawn2.ogg']
		,['assets/sound/spawn3.m4a','assets/sound/spawn3.ogg']
		,['assets/sound/spawn4.m4a','assets/sound/spawn4.ogg']
		,['assets/sound/spawn5.m4a','assets/sound/spawn5.ogg']
		],
			onLoad: function() {
				
			},
			onEnd: function() {
				
			}
		});
	}
	
	if(this.state == STATE_INIT){
		this.play(game);
	}
	
	if(this.state == STATE_RUNNING){
		var x = e.x,y = e.y;
		
		if(soya2d.Device.mobile){
			var touchList = e.touchList;
			x = touchList[0];
			y = touchList[1];
		}
		this.hit(x,y);
	}
});