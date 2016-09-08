(function() {
	'use strict';

	function Meter(game) {
		this.prevTime = Date.now();

		this.startTime = 0;
		this.logicTime = 0;
		this.renderTime = 0;

		this.fps = 0;
		this.fpsMin = Infinity;
		this.fpsMax = 0;

		this.frames = 0;
		this.entities = 0;

		this.game = game;
		this.font = null;
		this.text = null;
		this.bg = null;
	}

	Meter.prototype = {
		init: function(game) {
			this.info = game.add.text({
				font: this.font,
				text: '',
				fillStyle: '#fff',
				font:'normal normal 1.2rem/20px "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
				x: 10,
				y: 10,
				w: 150,
				h: 95
			});

			this.panel = game.add.rect({
				w:150,
				h:120,
				x:10,
				y:10,
				fillStyle: 'rgba(120,220,150,0.5)',
				z: 999,
				id:'ppp'
			});

			this.panel.add(this.info);
			// game.stage.add(this.panel);
		},
		beforeUpdate: function(now) {
			this.startTime = now;
		},
		postUpdate: function(now) {
			this.logicTime = now - this.startTime;
		},
		beforeRender: function(now) {
			this.startTime = now;
		},
		postRender: function(now) {
			this.renderTime = now - this.startTime;
		},
		update: function(now,count) {
			this.frames++;

			if (now > this.prevTime + 1000) {
				this.fps = Math.round((this.frames * 1000) / (now - this.prevTime));
				this.fpsMin = Math.min(this.fpsMin, this.fps);
				this.fpsMax = Math.max(this.fpsMax, this.fps);

				this.prevTime = now;
				this.frames = 0;
			}

			this.entities = count - 4/* 2meter + world + stage*/;

			this.info.setText('fps: ' + this.fps +
				"\nentities: " + this.entities +
				"\nupdate: " + this.logicTime +
				"ms\nrender: " + this.renderTime + "ms");
		},

		//设置性能面板大小（1,2,3 分别代表小，中，大）
		setPanelSize: function(size) {
			if (size == 1) {
				this.font.size(14);
				this.bg.w = this.text.w = 100;
				this.bg.h = this.text.h = 80;
			} else if (size == 2) {
				this.font.size(17);
				this.bg.w = this.text.w = 116;
				this.bg.h = this.text.h = 95;
			} else if (size == 3) {
				this.font.size(22);
				this.bg.w = this.text.w = 142;
				this.bg.h = this.text.h = 120;
			}
		},

		//设置字体颜色
		setColor: function(color) {
			this.text.fillStyle = color;
		},

		//设置面板颜色
		setBgColor: function(color) {
			this.bg.fillStyle = color;
		}
	};

	soya2d.module.install('FPSMeter', {
		onInit: function(game) {
			game.FPSMeter = new Meter(game);
		},
		onSceneChange: function(game, scene) {
			game.FPSMeter.init(game);
		},
		onBeforeUpdate: function(game, now, d) {
			game.FPSMeter.beforeUpdate(now);
		},
		onPostUpdate: function(game, now, d) {
			game.FPSMeter.postUpdate(now);
		},
		onBeforeRender: function(game, now, d) {
			game.FPSMeter.beforeRender(now);
		},
		onPostRender: function(game, now, d,count) {
			game.FPSMeter.postRender(now);
			game.FPSMeter.update(now,count);
		}
	});

})();