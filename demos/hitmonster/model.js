
/************* model ****************/
function Port(game){
	this.x = 0;
	this.y = 0;
	this.monsters = game.monsters;
	
	this.__getMonster = function(){
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
			var m = that.__getMonster();
			m.y = that.y;
			m.x = that.x;
			m.sy = m.y;
			m.port = that;
			m.showing = true;
			that.showingMonster = m;
			var l=1;
			game.tween.add(m).
			to({y:'-100'},.5,{yoyo:true,repeat:1,easing:soya2d.Tween.Sine.InOut})
			.play()
			.on('stop',function(){
				m.showing = false;
				if(game.state == STATE_RUNNING){
					that.showInGame();
				}else if(game.state != STATE_CUTTO){
					that.show();
				}
			});

		},Math.random()*2000+500);
	}
	
	this.showInGame = function(){
		var that = this;
		timer = setTimeout(function(){
			if(game.state != STATE_RUNNING)return;
			var m = that.__getMonster();
			m.y = that.y;
			m.x = that.x;
			m.sy = m.y;
			m.port = that;
			m.showing = true;
			that.showingMonster = m;
			var l=1;
			game.tween.add(m).
			to({y:'-260'},Math.random()*500/1000+.5,{yoyo:true,repeat:1,easing:soya2d.Tween.Sine.InOut})
			.play()
			.on('stop',function(){
				m.showing = false;
				
				if(game.state == STATE_RUNNING){
					that.showInGame();
				}else if(game.state != STATE_CUTTO){
					that.show();
				}
			});
			
			//play sound
			var sd = soya2d.Math.randomi(1,5);
			game.assets.sound('spawn'+sd).play();
			
		},Math.random()*2000+500);
	}
}
