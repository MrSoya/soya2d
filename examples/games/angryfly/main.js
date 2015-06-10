
/************* model ****************/

var scene = new soya2d.Scene({
	state:'',
	hit:true,//是否打中
	onInit:function(game){
		this.font = new soya2d.Font('normal 400 30px/normal 微软雅黑,sans-serif');

		var thisScene = this;
		var bw = game.w*2,
			bh = game.h*1;
		var view = new soya2d.ScrollSprite({
			w:game.w,
			h:game.h,
			scope:new soya2d.Rectangle(0,0,bw,bh)
		});
		this.add(view);
		this.view = view;

		this.dialogLayer = new soya2d.Rect({
			w:game.w,
			h:game.h,
			z:9,
			fillStyle:'#000',
			opacity:.5
		});
		this.add(this.dialogLayer);

		var phy = game.startPhysics({gravity:[0,150]});

		//bg
		var bg = new soya2d.TileSprite({
			sprite:game.textureManager.find('bg.png'),
			w:bw
		});
		view.add(bg);
		//ground
		var groundTex = game.textureManager.find('sand.png');
		var groundH = groundTex.h - 2;
		var ground = new soya2d.TileSprite({
			sprite:groundTex,
			speed:1,
			w:bw,
			y:game.h - groundH
		});
		view.add(ground);
		phy.bind(ground,{mass:0});

		//rocks
		var rockTex = game.textureManager.find('rock.png');
		var rock = new soya2d.Sprite({
			textures:rockTex,
			x:game.w/2,
			y:game.h - groundTex.h + 2 - rockTex.h
		});
		view.add(rock);

		//rocks
		var rockTex = game.textureManager.find('rock.png');
		var rock = new soya2d.Sprite({
			textures:rockTex,
			x:game.w/2,
			y:game.h - groundTex.h + 2 - rockTex.h
		});
		view.add(rock,rock.clone().moveTo(100,rock.y));

		//cactus
		var cactusTex = game.textureManager.find('cactus.png');
		var cactus = new soya2d.Sprite({
			textures:cactusTex,
			x:game.w/2+100,
			y:game.h - groundTex.h + 2 - cactusTex.h
		});
		view.add(cactus);

		this.setItems(view,game,groundH,phy);
		this.state = STATE_INIT;

		this.start(game);
	},
	setItems:function(view,game,groundH,phy){
		//stones
		var stoneTex = game.textureManager.find('stone1.png');
		var s1 = new soya2d.Sprite({
			textures:stoneTex,
			x:340,
			y:game.h - stoneTex.h-groundH
		});
		var s2 = new soya2d.Sprite({
			textures:stoneTex,
			x:340,
			y:game.h - stoneTex.h*2-groundH
		});
		var s3 = new soya2d.Sprite({
			textures:stoneTex,
			x:540,
			y:game.h - stoneTex.h-groundH
		});
		var s4 = new soya2d.Sprite({
			textures:stoneTex,
			x:540,
			y:game.h - stoneTex.h*2-groundH
		});
		phy.bind(s1,{mass:5});
		phy.bind(s2,{mass:5});
		phy.bind(s3,{mass:5});
		phy.bind(s4,{mass:5});
		view.add(s1,s2,s3,s4);
		var stoneH = game.h - stoneTex.h*2-groundH;

		//enemy
		var enemyTex = game.textureManager.find('enemy.png');
		var enemy = new soya2d.Sprite({
			textures:enemyTex,
			bounds:new soya2d.Circle(0,0,enemyTex.w/2),
			x:345+stoneTex.w,
			y:game.h - enemyTex.h-groundH
		});
		view.add(enemy);
		phy.bind(enemy,{mass:1});

		//woods
		var woodTex = game.textureManager.find('wood2.png');
		var wood1Tex = game.textureManager.find('wood1.png');
		var w2 = new soya2d.Sprite({
			textures:woodTex,
			x:360,
			y:stoneH - woodTex.h
		});
		var w1 = new soya2d.Sprite({
			textures:wood1Tex,
			x:400,
			y:stoneH - woodTex.h - wood1Tex.h
		});
		view.add(w1,w2);
		phy.bind(w1,{mass:2});
		phy.bind(w2,{mass:2});

		//expo
		var expoTex = game.textureManager.find('expo.png');
		var expoW = expoTex.w,
			expoH = expoTex.h;
		var expo = new soya2d.Sprite({
			textures:expoTex,
			bounds:new soya2d.Polygon([
				expoW/2,0,
				expoW,expoH,
				0,expoH]),
			x:400,
			y:stoneH - woodTex.h - expoTex.h - wood1Tex.h
		});
		view.add(expo);
		
		phy.bind(expo,{
			mass:3
		});

		//fly
		var flyTexs = game.textureManager.findAll('assets/fly');
		var fly = new soya2d.Sprite({
			textures:flyTexs,
			x:400 + 35,
			autoplay:true,
			y:50,
			dir:-1,
			spd:3,
			z:1,
			onUpdate:function(){
				//添加到物理环境后，设置本身的属性无效
				var spd = this.spd * this.dir;
				this.body.position[0] += spd;
				if(this.body.position[0]-this.w/2 < 0 || this.body.position[0]+this.w/2 > game.w){
					this.dir *= -1;
					this.scaleX *= -1;
				}
				/*
				this.x += spd;
				if(this.x < 0 || this.x+this.w > game.w){
					this.dir *= -1;
					this.scaleX *= -1;
				}
				//*/
			}
		});
		var line = new soya2d.Shape({
			x:0,y:0,
			tx:0,ty:0,
			onRender:function(g){
				g.strokeStyle('#000');
				g.beginPath();
				g.moveTo(0,0);
				g.lineTo(this.tx,this.ty);
				g.stroke();
			},
			onUpdate:function(){
				this.x = fly.x + fly.w/2;
				this.y = fly.y + fly.h/2;
				this.tx = ball.x - fly.x;
				this.ty = ball.y - fly.y;
			}
		});
		view.add(line);
		var ballTex = game.textureManager.find('ball.png');
		var ball = new soya2d.Sprite({
			textures:ballTex,
			x:400+10,
			bounds:new soya2d.Circle(0,0,ballTex.w/2),
			y:150 + ballTex.h
		});
		this.ball = ball;
		view.add(fly,ball);
		phy.bind(fly,{mass:3,type:soya2d.PHY_STATIC});
		phy.bind(ball,{mass:5});

		//使用约束
		var cr = new p2.DistanceConstraint(fly.body, ball.body);
		phy.world.addConstraint(cr);

		this.on('click',function(){
			if(this.state != STATE_RUNNING)return;
			phy.world.removeConstraint(cr);
			line.opacity = 0;
		});

		var thisScene = this;
		enemy.on('contactstart',function(e){
			console.log(e);
			if(thisScene.state == STATE_RUNNING){
				phy.unbind(this);
				alert('哦也，打中!!');
				this.animate({scaleY:3,scaleX:3},500,{
					easing:soya2d.Tween.Bounce.In,
					onEnd:function(t){
						t.opacity = 0;
					}
				});
			}
		});
        
        var lastX = 0;
        var taskId = game.addTask(function(){
        	//速度减慢
        	if(ball.x - lastX < 2){
        		game.removeTask(taskId);
        	}else 
        	if(ball.x < 0 || ball.x>thisScene.view.scope.getRight()){
        		game.removeTask(taskId);
        	}
        	lastX = ball.x;

        },'0/2 * *',soya2d.TRIGGER_TYPE_TIME);
	},
	start:function(game){
		//show dialog
		var textX = game.w/3+50,
			textY = game.h/3;
		//fly
		var flyTexs = game.textureManager.findAll('assets/fly');
		var fly = new soya2d.Sprite({
			textures:flyTexs,
			x:game.w/3-100,
			autoplay:true,
			y:game.h/3,
			scaleX:-2,
			scaleY:2,
			spd:3,
			z:10
		});
		this.add(fly);
		var flyTxt1 = new soya2d.Text({
			text:'(╯‵□′)╯我讨厌这些黄色的小沙子...',
			lineSpacing:1,
			fillStyle:'#fff',
			font:this.font,
			w:500,
			z:10,
			x:textX,
			y:textY
		});
		this.add(flyTxt1);
		var flyTxt2 = new soya2d.Text({
			text:"!'_'...我可是有武器的哦",
			fillStyle:'#fff',
			font:this.font,
			w:500,
			z:10,
			x:textX,
			y:textY,
			visible:false
		});
		var flyTxt3 = new soya2d.Text({
			text:"(=ﾟДﾟ=) ...我要炸的你屁股开花",
			fillStyle:'#fff',
			font:this.font,
			w:500,
			z:10,
			x:textX,
			y:textY,
			visible:false
		});
		this.add(flyTxt1,flyTxt2,flyTxt3);

		//baby
		var babyTex = game.textureManager.find('enemy.png');
		var baby = new soya2d.Sprite({
			textures:babyTex,
			x:game.w/3-100,
			autoplay:true,
			y:game.h/3,
			scaleX:2,
			scaleY:2,
			spd:3,
			z:10,
			visible:false
		});
		this.add(baby);
		var babyTxt1 = new soya2d.Text({
			text:' ㄟ( ▔, ▔ )ㄏ...管我鸟事',
			lineSpacing:1,
			fillStyle:'#fff',
			font:this.font,
			w:500,
			z:10,
			x:textX,
			y:textY,
			visible:false
		});
		this.add(babyTxt1);

		this.dialog = 1;
		this.on('click',function(){
			switch(this.dialog){
				case 1:
					this.dialog = 2;
					fly.visible = flyTxt1.visible = false;
					baby.visible = babyTxt1.visible = true;
					break;
				case 2:
					this.dialog = 3;
					fly.visible = flyTxt2.visible = true;
					baby.visible = babyTxt1.visible = false;
					break;
				case 3:
					this.dialog = 4;
					fly.visible = flyTxt2.visible = false;
					baby.visible = babyTxt1.visible = true;
					break;
				case 4:
					this.dialog = 5;
					fly.visible = flyTxt3.visible = true;
					baby.visible = babyTxt1.visible = false;
					break;
				case 5:
					this.dialog = 6;
					fly.visible = flyTxt3.visible = false;
					baby.visible = babyTxt1.visible = true;
					break;
				case 6:
					this.dialogLayer.visible = false;
					baby.visible = babyTxt1.visible = false;
					var thisScene = this;
					setTimeout(function(){
						thisScene.state = STATE_RUNNING;
					},50);
					this.view.follow(this.ball);
					break;
			}
		});

		//view.follow(ball);
	},
	play:function(game){
		
	},
	gameover:function(){
		
	}
});

//加载资源
var loader = new soya.LoaderScene({
		nextScene:scene,
		textures:['assets/bg.png'
					,'assets/sand.png'
					,'assets/cactus.png'
					,'assets/rock.png'
					,'assets/ball.png'
					,'assets/enemy.png'
					,'assets/wood1.png'
					,'assets/wood2.png'
					,'assets/glass1.png'
					,'assets/glass2.png'
					,'assets/stone1.png'
					,'assets/stone2.png'
					,'assets/stone3.png'
					,'assets/expo1.png'
					,'assets/expo2.png'
					,'assets/expo3.png'
					,'assets/expo.png'
					,'assets/fly1.png'
					,'assets/fly2.png'
				]
});