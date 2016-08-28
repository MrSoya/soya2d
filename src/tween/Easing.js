/*
 * t:第几帧
 * b:初始值
 * c:变化量(end - ini)
 * d:总帧数
 */

/**
 * 补间算法类型——Linear
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Linear
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Linear = function(t,b,c,d){ return c*t/d + b; }
/**
 * 补间算法类型——Quad
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Quad
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Quad = {
	/**
	 * In
	 * @property Quad.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return c*(t/=d)*t + b;
	},
	/**
	 * Out
	 * @property Quad.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return -c *(t/=d)*(t-2) + b;
	},
	/**
	 * InOut
	 * @property Quad.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	}
}
/**
 * 补间算法类型——Cubic
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Cubic
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Cubic = {
	/**
	 * In
	 * @property Cubic.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return c*(t/=d)*t*t + b;
	},
	/**
	 * Out
	 * @property Cubic.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	/**
	 * InOut
	 * @property Cubic.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}
}
/**
 * 补间算法类型——Quart
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Quart
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Quart = {
	/**
	 * In
	 * @property Quart.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return c*(t/=d)*t*t*t + b;
	},
	/**
	 * Out
	 * @property Quart.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	/**
	 * InOut
	 * @property Quart.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	}
}
/**
 * 补间算法类型——Quint
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Quint
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Quint = {
	/**
	 * In
	 * @property Quint.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return c*(t/=d)*t*t*t*t + b;
	},
	/**
	 * Out
	 * @property Quint.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	/**
	 * InOut
	 * @property Quint.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	}
}
/**
 * 补间算法类型——Sine
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Sine
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Sine = {
	/**
	 * In
	 * @property Sine.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	/**
	 * Out
	 * @property Sine.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	/**
	 * InOut
	 * @property Sine.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}
}
/**
 * 补间算法类型——Expo
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Expo
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Expo = {
	/**
	 * In
	 * @property Expo.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return (t===0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	/**
	 * Out
	 * @property Expo.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return (t===d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	/**
	 * InOut
	 * @property Expo.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if (t===0) return b;
		if (t===d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}
}
/**
 * 补间算法类型——Circ
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Circ
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Circ = {
	/**
	 * In
	 * @property Circ.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	/**
	 * Out
	 * @property Circ.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	/**
	 * InOut
	 * @property Circ.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	}
}
/**
 * 补间算法类型——Elastic
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Elastic
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Elastic = {
	/**
	 * In
	 * @property Elastic.In
	 * @type {Function}
	 */
	In: function(t,b,c,d,a,p){
		if (t===0) return b;  if ((t/=d)===1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	/**
	 * Out
	 * @property Elastic.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d,a,p){
		if (t===0) return b;  if ((t/=d)===1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
	},
	/**
	 * InOut
	 * @property Elastic.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d,a,p){
		if (t===0) return b;  if ((t/=d/2)===2) return b+c;  if (!p) p=d*(.3*1.5);
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	}
}
/**
 * 补间算法类型——Back
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Back
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Back = {
	/**
	 * In
	 * @property Back.In
	 * @type {Function}
	 */
	In: function(t,b,c,d,s){
		if (s === undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	/**
	 * Out
	 * @property Back.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d,s){
		if (s === undefined) s = .70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	/**
	 * InOut
	 * @property Back.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d,s){
		if (s === undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}
}
/**
 * 补间算法类型——Bounce
 * 算法来自：http://www.robertpenner.com/easing/
 * @property Bounce
 * @type {Function}
 * @static
 * @final
 * @for soya2d.Tween
 */
soya2d.Tween.Bounce = {
	/**
	 * In
	 * @property Bounce.In
	 * @type {Function}
	 */
	In: function(t,b,c,d){
		return c - soya2d.Tween.Bounce.Out(d-t, 0, c, d) + b;
	},
	/**
	 * Out
	 * @property Bounce.Out
	 * @type {Function}
	 */
	Out: function(t,b,c,d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	/**
	 * InOut
	 * @property Bounce.InOut
	 * @type {Function}
	 */
	InOut: function(t,b,c,d){
		if (t < d/2) return soya2d.Tween.Bounce.In(t*2, 0, c, d) * .5 + b;
		else return soya2d.Tween.Bounce.Out(t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
}
