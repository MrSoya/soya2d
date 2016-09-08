function addButton(opts,onclick){
	var btn = game.add.sprite(opts);

	var t2 = game.tween.add(btn)
	.to({scaleX:1,scaleY:1},.8,{delay:.1,easing:soya2d.Tween.Elastic.Out}).play();
	var t3;
	t2.on('stop',function(){
		t3 = game.tween.add(btn).to({scaleX:'+.2',scaleY:'+.2'},.1);
	})

	btn.on('mouseover',function(){
		if(t3)
		t3.play(true);
	});
	btn.on('mouseout',function(){
		if(t3)
		t3.reverse();
	});
	btn.on('click',function(){
		game.assets.sound('btn').play();

		onclick.apply(btn,arguments);
	});

	return btn;
}


var Pilot = soya2d.class("",{
	extends:soya2d.Arc,
	constructor:function(opts){
		this.x = opts.x;
		this.y = opts.y;
		this.z = 9;

		this.opacity = 0;
		this.w = 75;
		this.h = 75;
		this.strokeStyle = '#fff';
		this.angle = -90;
		this.lineWidth = 5;
		this.startAngle = 0;

		//重写该参数以触发点击事件
		this.bounds.r = this.w/2;

		this.type = opts.type;
		this.on('click',function(){
			this.hide();
			game.events.emit(opts.type,this.nextPlane);
		});

		var tip = game.add.sprite({
			images:'icon_'+opts.type,
			angle:90,
			x:2,y:2.5
		});
		this.add(tip);
	},
	show:function(planeType,residence,plane){
		if(this.showing)return;

		this.nextPlane = plane;
		if(this.type === 'landing')
			this.nextPlane = getPlane(planeType,residence);
		
		this.opacity = 1;
		this.showing = true;
		this.startAngle = 0;
	},
	hide:function(){
		this.opacity = 0;
		this.showing = false;
	},
	onUpdate:function(){
		if(!this.showing)return;

		if(this.startAngle >= 360){
			this.hide();
			game.events.emit(this.type,this.nextPlane);
		}
		this.startAngle += .5 ;
	}
});

function getPlane(type,res){
	var p = game.add.sprite({
		x:game.w,
		y:200,
		opacity:0,
		midair:true,
		images:game.assets.atlas('p' + type).getAll(),
		res:res,
		type:type,
		landing:function(landingPath,terminalPath){
			this.opacity = 1;
			var tp = game.tween.add(this,soya2d.TWEEN_TYPE_PATH)
					.to(landingPath,5,{easing:soya2d.Tween.Circ.Out})
					.to(terminalPath,2,{delay:1})
					.play();
			this.tween = tp;
			tp.on('change',function(){
				var tween = this;
				setTimeout(function(){
					if(tween.target)
					tween.target.frameIndex = 3;
				},1000);
            });
            tp.on('process',function(src,rate,process,angle){

				if(angle > 100 && angle <140 && !this.target.midair){//降落不碰撞
					this.target.midair = true;
				}else if(this.target.midair){
					this.target.midair = false;
				}
			});
            tp.on('stop',function(){
                game.events.emit('request2Apron',this.target);
            });
            game.assets.sound('landing').play();
		},
		taxi2Apron:function(t1,t2,no){
			var tp = game.tween.add(this,soya2d.TWEEN_TYPE_PATH)
					.to(no<1?t1:t2,4)
					.play();
			this.tween = tp;
			tp.on('process',function(src,rate,process,angle){
				var a = angle >> 0;
				
				var t = this.target;
				if(a < -30){
					if(t.frameIndex !== 3)t.frameIndex = 3;
				}else{
					if(t.frameIndex !== 0)t.frameIndex = 0;
				}
			});
			tp.on('stop',function(){
                game.events.emit('inposition',this.target);
            });
		},
		pushback:function(t1,t2,no){
			var tp = game.tween.add(this,soya2d.TWEEN_TYPE_PATH)
					.to(no<1?t1:t2,6)
					.play();
			this.tween = tp;
			tp.on('process',function(src,rate,process,angle){
				var a = angle >> 0;

				var t = this.target;
				if(a > 140){
					if(t.frameIndex !== 2)t.frameIndex = 2;
				}else if(a > 20){
					if(t.frameIndex !== 1)t.frameIndex = 1;
				}else{
					if(t.frameIndex !== 0)t.frameIndex = 0;
				}
			});
			tp.on('stop',function(){
                game.events.emit('requestTakeoff',this.target);
            });
		},
		takeoff:function(t1,t2){

			game.assets.sound('launch').play();

			var angles = [];
			var tp = game.tween.add(this,soya2d.TWEEN_TYPE_PATH)
					.to(t1,2)
					.to(t2,3,{delay:1,easing:soya2d.Tween.Expo.In})
					.play();
			this.tween = tp;
			tp.on('process',function(src,rate,process,angle){
				var a = angle >> 0;
				if(angles.indexOf(a) < 0)angles.push(a);
				
				var t = this.target;
				if(a > 140){
					if(t.frameIndex !== 2)t.frameIndex = 2;
				}else if(a > 20){
					if(t.frameIndex !== 1)t.frameIndex = 1;
				}else{
					if(t.frameIndex !== 2)t.frameIndex = 2;
				}
				if(angle > 170 && !t.midair){//起飞不碰撞
					t.midair = true;
				}
				// console.log(angles)
			});

			tp.on('change',function(target,times){
				if(times == 1){
					game.assets.sound('takeoff').play();
				}
			});
			tp.on('stop',function(){
				Tower.score++;
                Tower.scoreText.setText(Tower.score);
                game.tween.add('st',Tower.scoreText)
					.to({scaleX:2,scaleY:2},.1)
					.to({scaleX:1,scaleY:1},.1)
					.play();

				var i = Tower.planes.indexOf(this.target);
				if(i > -1){
					Tower.planes.splice(i,1);
				}

            });
		}
	});
	p.frameIndex = 2;

	var a = game.add.rect({
		layout:{
			width:'100%',
			height:'100%'
		},
		strokeStyle:'#fff',
		lineWidth:1,
		onUpdate:function(){
			if(!game.debug)this.opacity = 0;
			else{
				this.opacity = 1;
			}
		}
	});

	p.add(a);

	Tower.planes.push(p);
	return p;
}


var Tower = {
	score:0,
	planes:[],
	aprons:[false,false],//机位
	requestTaxiway:function(){
		if(!this.aprons[0]){
			this.aprons[0] = true;
			return 0;
		}else{
			this.aprons[1] = true;
			return 1;
		}
	},
	requestPushback:function(apron){
		this.aprons[apron] = false;
	},
	init:function(score){
		this.scoreText = score;
		//init data
		var typeMap = ['s','m','b'];
		var landingTime = 0;
		var schedules = [[typeMap[soya2d.Math.randomi(0,2)],soya2d.Math.randomi(1,4),6]];
		for(var i=100;i--;){
			landingTime += soya2d.Math.randomi(8,15) + 10;
			schedules.push([
				typeMap[soya2d.Math.randomi(0,2)],
				landingTime,
				soya2d.Math.randomi(5,12)//docking
				]);
		}
		this.schedules = schedules;


		//添加航标
		this.langding = game.add.pilot({x:900,y:250,type:'landing'});
		this.taxiWaiting = game.add.pilot({x:150,y:500,type:'terminal'});
		this.exitterminal1 = game.add.pilot({x:350,y:230,type:'exitterminal'});
		this.exitterminal2 = game.add.pilot({x:475,y:280,type:'exitterminal'});
		this.takeoff = game.add.pilot({x:660,y:300,type:'takeoff'});

		var startX = game.w + 10,
			startY = 200;
		var landingPath = new soya2d.Path("M"+startX+" "+startY+"L750 450 L380 665");
		var terminalPath = new soya2d.Path("M380 665 L230 575");
		var t1Path = new soya2d.Path("M230 575 L170 540 L430 395 L245 290 L350 230");
		var t2Path = new soya2d.Path("M230 575 L170 540 L430 395 L350 350 L475 280");
		var t1TPath = new soya2d.Path("M350 230 L245 290 L495 435 L665 330 L735 370");
		var t2TPath = new soya2d.Path("M475 280 L350 350 L495 435 L665 330 L735 370");
    	var takeoffPath1 = new soya2d.Path("M735 370 L810 420 L775 440");
    	var takeoffPath2 = new soya2d.Path("M775 440 L430 635 L-100 680");


		//塔台监听
		game.events.on('landing',function(target,plane){
			plane.landing(landingPath,terminalPath);
		});
		//停机滑行
		game.events.on('request2Apron',function(target,plane){
			Tower.taxiWaiting.show(plane.type,plane.res,plane);
		});
		game.events.on('terminal',function(target,plane){
			var taxiwayNo = Tower.requestTaxiway();
			plane.taxi2Apron(t1Path,t2Path,taxiwayNo);
			plane.apron = taxiwayNo;
			
			game.assets.sound('passby').play();
		});
		//停机等待
		game.events.on('inposition',function(target,plane){
			game.assets.sound('ding').play();
			game.assets.sound('shutdown').play();
			
			setTimeout(function(){
				game.events.emit('pushback',plane);
			},plane.res*1000);
		});
		game.events.on('pushback',function(target,plane){
			game.assets.sound('launch').play();

			if(plane.apron<1){
				Tower.exitterminal1.show(plane.type,plane.res,plane);
			}else{
				Tower.exitterminal2.show(plane.type,plane.res,plane);
			}
		});
		//滑出机位
		game.events.on('exitterminal',function(target,plane){
			game.assets.sound('seatbelt').play();

			Tower.requestPushback(plane.apron);
			plane.pushback(t1TPath,t2TPath,plane.apron);
		});
		//等待起飞
		game.events.on('requestTakeoff',function(target,plane){
			Tower.takeoff.show(plane.type,plane.res,plane);
		});
		game.events.on('takeoff',function(target,plane){
			plane.takeoff(takeoffPath1,takeoffPath2);
		});


		this.landingPath = landingPath;
		this.terminalPath = terminalPath;
		this.t1Path = t1Path;
		this.t2Path = t2Path;
		this.t1TPath = t1TPath;
		this.t2TPath = t2TPath;
		this.takeoffPath1 = takeoffPath1;
		this.takeoffPath2 = takeoffPath2;
	},
	schedule:function(){
		var schedules = this.schedules;
		var tower = this;
		game.timer.on('[* * *]',function(time,tick){
			if(schedules[0][1] === tick){
				var s = schedules.shift();
				tower.langding.show(s[0],s[2]);
				game.assets.sound('radio1').play();
			}
		});
	},
};