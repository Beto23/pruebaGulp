var gulp = require('gulp');
var webserver = require('gulp-webserver');
var stylus = require('gulp-stylus');
var nib = require('nib');
var minifyCSS = require('gulp-minify-css');
var browserify = require('browserify');
var source = require ('vinyl-source-stream');
var buffer = require ('vinyl-buffer');
var uglify = require ('gulp-uglify');
var clean = require('gulp-rimraf');
var livereload = require('gulp-livereload');


var config = {
	styles:{
		main: './src/styles/main.styl',
		watch: './src/styles/**/*.styl',
		output: './dist/css'
	},
	html:{
		main: './src/index.html',
		watch: './src/index.html',
		output: './dist'
	},
	scripts:{
		main: './src/index.js',
		watch: './src/**/*.js',
		output: './dist/js/'
	}
}

gulp.task('server', function(){
	gulp.src('./dist')
		.pipe(webserver({
			host: '0.0.0.0',
			port: 8080,
		}));
})

gulp.task('clean', function(){
	return gulp
				.src('./dist', {read: false})
				.pipe(clean(-{force: true}));
})

gulp.task('styles', function(){
	return gulp.src(config.styles.main)
		.pipe(stylus({
			use: nib(),
			'include css' : true
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.styles.output))
		.pipe(livereload());
})

gulp.task('htmls', function(){
	return gulp.src(config.html.main)
		.pipe(gulp.dest(config.html.output))
		.pipe(livereload());
})

gulp.task('js', function(){
	return browserify(config.scripts.main)
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest(config.scripts.output))
	.pipe(livereload());
})

gulp.task('watch', function(){
	livereload.listen();
	gulp.watch(config.html.watch, ['htmls']);
	gulp.watch(config.styles.watch, ['styles']);
	gulp.watch(config.scripts.watch, ['js']);
	})

gulp.task('default', ['clean','server', 'watch'], function(){
	gulp
		.start('htmls', 'styles', 'js');
	})