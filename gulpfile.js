var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
// var jshint = require('gulp-jshint');
//var jsdoc = require('gulp-jsdoc');
var rename = require('gulp-rename');
var header = require('gulp-header');
var del = require('del');

var banner = [
        '/*'
        ,' * Soya2D is a web interactive animation(game) engine for modern web browsers '
        ,' *'
        ,' *'
        ,' * Copyright 2015-'+ new Date().getFullYear() +' MrSoya and other contributors'
        ,' * Released under the MIT license'
        ,' *'
        ,' * website: http://soya2d.com'
        ,' * last build: '+new Date().toLocaleDateString()
        ,' */'
    ].join('\n') + '\n';

var src_core = [
    "src/shellStart.js",
    "src/core/Soya.js",
    "src/core/Camera.js",
    "src/core/Math.js",
    "src/core/Assets.js",
    "src/core/Atlas.js",
    "src/core/Signal.js",
    "src/core/SignalHandler.js",
    "src/core/Loader.js",
    "src/core/Scene.js",
    "src/core/SceneManager.js",
    "src/core/TimerTrigger.js",
    "src/core/Timer.js",
    "src/geom/Circle.js",
    "src/geom/Polygon.js",
    "src/geom/Rectangle.js",
    "src/geom/Point.js",
    "src/geom/Matrix2x2.js",
    "src/geom/Vector.js",
    //physics
    "src/physics/Body.js",
    "src/physics/Physics.js",
    //display
    "src/display/DisplayObjectFactory.js",
    "src/display/DisplayObjectFactoryProxy.js",
    "src/display/DisplayObject.js",
    "src/display/DisplayObjectContainer.js",
    "src/display/Stage.js",
    "src/display/World.js",
    "src/display/Shape.js",
    "src/display/Animation.js",
    "src/display/Sprite.js",
    "src/display/Button.js",
    "src/display/TileSprite.js",
    //renderer
    "src/renderer/CanvasGraphics.js",
    "src/renderer/CanvasRenderer.js",
    "src/renderer/Path.js",
    "src/system/Device.js",
    "src/text/Font.js",
    "src/text/ImageFont.js",
    "src/text/Text.js",
    "src/core/Game.js",
    //event
    "src/event/Events.js",
    "src/event/KeyCode.js",
    "src/event/InputListener.js",
    "src/event/listeners.js"
];

var src_ext = [
    //tween
    "src/tween/Tween.js",
    "src/tween/PathTween.js",
    "src/tween/TweenManager.js",
    "src/tween/Easing.js",
    "src/tween/install.js",
    //shapes
    "src/shapes/Arc.js",
    "src/shapes/Ellipse.js",
    "src/shapes/Poly.js",
    "src/shapes/Rect.js",
    "src/shapes/RPoly.js",
    "src/shapes/RRect.js",
    "src/shapes/EArc.js",
    "src/shapes/install.js",
    //sound
    "src/sound/howler.min.js",
    "src/sound/Sound.js",
    "src/sound/SoundManager.js",
    "src/sound/install.js",
    //particle
    "src/particle/Emitter.js",
    "src/particle/install.js",
    //physics
    "src/physics/matter.min.js",
    "src/physics/install.js",
    //tilemap
    "src/tilemap/TilemapManager.js",
    "src/tilemap/TilemapLayer.js",
    "src/tilemap/Tilemap.js",
    "src/tilemap/Tileset.js",
    "src/tilemap/install.js"
];

var shellEnd = ["src/shellEnd.js"];

var config = {
    srcAll:src_core.concat(src_ext).concat(shellEnd),
    srcCore:src_core.concat(shellEnd),
    all: {
        dir: 'build/',
        filename: 'soya2d.all.js'
    },
    core: {
        dir: 'build/',
        filename: 'soya2d.core.js'
    }
};


var pack = function (type,src) {
    var data = config[type];
    return gulp.src(config[src])
        .pipe(concat(data.filename))
        .pipe(header(banner))
        .pipe(gulp.dest(data.dir))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(header(banner))
        .pipe(gulp.dest(data.dir));
};

// gulp.task('lint', function() {
//     var lintFiles = config.srcAll;
//     return gulp.src(lintFiles)
//         .pipe(jshint('.jshintrc'))
//         .pipe(jshint.reporter('jshint-stylish'));
// });

gulp.task('all', function() {
    return pack('all','srcAll');
});
gulp.task('core', function() {
    return pack('core','srcCore');
});

gulp.task('clean', function(cb) {
    del(['build'], cb)
});

gulp.task('build', ['all','core']);
gulp.task('default', ['build']); 

