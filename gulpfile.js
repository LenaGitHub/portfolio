'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	minify = require('gulp-minify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	rimraf = require('rimraf'),
	babel = require('gulp-babel'),
	webserver = require('gulp-webserver');

var path = {
	build: {
		html: 'build/',
		js: 'build/static/js/',
		css: 'build/static/css/',
		img: 'build/static/images/',
		fonts: 'build/static/fonts/',
		data: 'build/static/js/'
	},
	src: {
		html: 'src/templates/*.html',
		js: 'src/js/app.js',
		style: 'src/styles/app.scss',
		img: [
				'src/images/**/*.*',
				'src/vendor/flag-icon-css/flags/**/*.*'
			],
		fonts: 'src/fonts/**/*.*',
		data: 'src/js/*.tsv'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/styles/**/*.scss',
		img: [
				'src/images/**/*.*',
				'src/vendor/flag-icon-css/flags/**/*.*'
			],
		fonts: 'src/fonts/../*.*',
		data: 'src/js/*.tsv'
	},
	clean: './build'
};

gulp.task('webserver', function() {
  gulp.src('')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: false,
    }));
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
	gulp.src(path.src.html) 
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html));
});

gulp.task('js:build', function () {
	gulp.src(path.src.js) 
		.pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015'],
            "plugins": [["import", {
            	"libraryName": "antd",
            }]]
        }))
		.pipe(rigger())
		.pipe(uglify())
		.pipe(sourcemaps.write()) 
		.pipe(gulp.dest(path.build.js));
});

gulp.task('styles:build', function () {
	gulp.src(path.src.style) 
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: ['src/styles/'],
			outputStyle: 'compressed',
			sourceMap: true,
			errLogToConsole: true
		}))
		.pipe(prefixer({
            browsers: ['last 2 versions']
		}))
		.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css));
});

gulp.task('images:build', function () {
	gulp.src(path.src.img) 
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img));
});

gulp.task('fonts:build', function() {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});

gulp.task('data:build', function() {
	gulp.src(path.src.data)
			.pipe(gulp.dest(path.build.data))
});


gulp.task('build', [
	'html:build',
	'js:build',
	'styles:build',
	'fonts:build',
	'images:build',
	'data:build'
]);


gulp.task('watch', function(){
	gulp.watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	gulp.watch([path.watch.style], function(event, cb) {
		gulp.start('styles:build');
	});
	gulp.watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	// gulp.watch([path.watch.img], function(event, cb) {
	// 	gulp.start('images:build');
	// });
	gulp.watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
	gulp.watch([path.watch.data], function(event, cb) {
		gulp.start('data:build');
	});
});


gulp.task('default', ['build', 'webserver', 'watch']);