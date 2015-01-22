var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
//var jsdoc = require('gulp-jsdoc');
var rename = require('gulp-rename');
var insert = require('gulp-insert');
var rimraf = require('gulp-rimraf');
var through2 = require('through2');


var sources = [
    "src/core/soya.js",
    "src/core/Math.js",
    "src/core/ResourceManager.js",
    "src/geom/Circle.js",
    "src/geom/Polygon.js",
    "src/geom/Rectangle.js",
    "src/geom/Matrix2x2.js",
    "src/geom/Vector.js",
    "src/display/DisplayObject.js",
    "src/display/DisplayObjectContainer.js",
    "src/display/Mask.js",
    "src/display/Scene.js",
    "src/display/ScrollSprite.js",
    "src/display/Shape.js",
    "src/display/Sprite.js",
    "src/display/TileSprite.js",
    "src/renderer/CanvasGraphics.js",
    "src/renderer/CanvasRenderer.js",
    "src/system/Device.js",
    "src/system/View.js",
    "src/text/Font.js",
    "src/text/ImageFont.js",
    "src/text/Text.js",
    "src/texture/Texture.js",
    "src/texture/TextureAtlas.js",
    "src/texture/TextureAtlasManager.js",
    "src/texture/TextureManager.js",
    "src/loader/AJAXLoader.js",
    "src/loader/Loader.js",
    "src/game/Game.js",
    "src/game/LoaderScene.js",
    //tween
    "src/tween/Tween.js",
    "src/tween/TweenManager.js",
    "src/tween/Easing.js",
    //shapes
    "src/shapes/Arc.js",
    "src/shapes/Ellipse.js",
    "src/shapes/Poly.js",
    "src/shapes/Rect.js",
    "src/shapes/RPoly.js",
    "src/shapes/RRect.js",
    //event
    "src/event/EventHandler.js",
    "src/event/Events.js",
    "src/event/Keyboard.js",
    "src/event/KeyCode.js",
    "src/event/Mobile.js",
    "src/event/Mouse.js",
    "src/event/Touch.js",
    "src/event/install.js",
    //sound
    "src/sound/howler.min.js",
    "src/sound/Sound.js",
    "src/sound/SoundManager.js",
    "src/sound/install.js",
    //particle
    "src/particle/Emitter.js",
    "src/particle/ParticleManager.js",
    "src/particle/ParticleWrapper.js",
    "src/particle/install.js",
    //physics
    "src/physics/p2.min.js",
    "src/physics/Physics.js",
    "src/physics/install.js",
    //task
    "src/task/Scheduler.js",
    "src/task/install.js"
];

var config = {
    src:sources,
    standalone: {
        dir: 'build/',
        filename: 'soya2d.js',
        start: '',
        end: ''
    }
};


var pack = function (type) {
    var data = config[type];
    return gulp.src(config.src)
        .pipe(insert.wrap(data.start, data.end))
        .pipe(concat(data.filename))
        .pipe(gulp.dest(data.dir))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(data.dir));
};

gulp.task('lint', function() {
    var lintFiles = config.src;
    return gulp.src(lintFiles)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('standalone', ['lint'], function() {
    return pack('standalone');
});

gulp.task('build', ['standalone']);
gulp.task('default', ['build']); 
