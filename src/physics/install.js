soya2d.module.install('physics',{
    onInit:function(game){
    	var engine;
        /**
		 * 安装物理
		 */
		game.physics.setup({
			onStart:function(opts){
				engine = Matter.Engine.create();

				engine.world.gravity.x = opts.gravity[0];
				engine.world.gravity.y = opts.gravity[1];
				engine.enableSleeping = opts.enableSleeping;

				//events
				Matter.Events.on(engine, 'collisionStart collisionEnd', function(event) {
					var pairs = event.pairs;
					for (var i = 0; i < pairs.length; i++) {
		                var pair = pairs[i];
		                game.physics.emit(event.name,pair.bodyA.__sprite,pair.bodyB.__sprite);
		                pair.bodyA.__sprite.emit(event.name,pair.bodyB.__sprite);
		                pair.bodyB.__sprite.emit(event.name,pair.bodyA.__sprite);
		            }
				});
			},
			onUpdate:function(){
				Matter.Engine.update(engine, 0, 1);
				var bodies = engine.world.bodies;
		    	for(var i=bodies.length; i--;){
					var b = bodies[i];
					var ro = b.__sprite;
					if(b.isStatic)continue;

					ro.__x = b.position.x;
					ro.__y = b.position.y;
					
					ro.angle = b.angle * soya2d.Math.ONEANG;
				}
			},
			onUnbind:function(obj){
				Matter.World.remove(engine.world,obj);
			},
			onBind:function(obj){
				var opts = {
					angle:obj.angle * soya2d.Math.ONERAD,
		    		position:{
		    			x:obj.x,
		    			y:obj.y
		    		}
				};
				
		    	var shape;
		    	if (obj.bounds instanceof soya2d.Rectangle) {
					shape = Matter.Bodies.rectangle(obj.x,obj.y,obj.w , obj.h,opts);
				} else if (obj.bounds instanceof soya2d.Circle) {
					shape = Matter.Bodies.circle(0,0,obj.bounds.r,opts);
				}else if (obj.bounds instanceof soya2d.Polygon) {
					var vtx = obj.bounds.vtx;
					var vx = Matter.Vertices.fromPath(vtx.join(','));
					shape = Matter.Bodies.fromVertices(0,0,vx,opts);
				}

				Matter.World.add(engine.world, shape);

				Matter.Events.on(shape, 'sleepStart sleepEnd', function(event) {
	                obj.emit(event.name,this.isSleeping);
	            });

				return shape;
			},
			body:{
				sensor:function(body,tof){
					body.isSensor = tof;
				},
				moveTo:function(body,x,y){
					Matter.Body.setPosition(body,{x:x,y:y});
				},
				moveBy:function(body,x,y){
					Matter.Body.translate(body,{x:x,y:y});
				},
				static:function(body,tof){
					Matter.Body.setStatic(body, tof);
				},
				mass:function(body,v){
					Matter.Body.setMass(body, v);
				},
				rotateBy:function(body,v){
					Matter.Body.rotate(body, v);
				},
				rotateTo:function(body,v){
					Matter.Body.setAngle(body, soya2d.Math.toRadian(v));
				},
				friction:function(body,v){
					body.friction = v;
				},
				restitution:function(body,v){
					body.restitution = v;
				},
				velocity:function(body,x,y){
					Matter.Body.setVelocity(body,{x:x,y:y});
				},
				inertia:function(body,v){
					Matter.Body.setInertia(body,v);
				}
			}
		});
    }
});