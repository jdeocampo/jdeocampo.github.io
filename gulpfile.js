'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    minify = require('gulp-minify');

// Modules for webserver and livereload
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

var server = express();
server.use(livereload({port: livereloadport}));
server.use(express.static('./'));
server.all('/*', function(req, res) {
  res.sendFile('index.html', { root: './' });
});

// Dev task
gulp.task('dev', ['clean', 'views', 'styles', 'lint', 'copy-bower-components', 'browserify'], function() { });

// Clean task
gulp.task('clean', function() {
	gulp.src('./dist', { read: false })
  .pipe(rimraf({force: true}));
});


// JSHint task
gulp.task('lint', function() {
  gulp.src('app/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Styles task
gulp.task('styles', function() {
  gulp.src('app/styles/*.scss')
  .pipe(sass('sass', { style: 'expanded', onError: function(e) { console.log(e); } }))
  .pipe(minifycss())
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
  .pipe(concat('style.min.css'))
  .pipe(gulp.dest('dist/css'));
});

// Copy bower components task
gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
  gulp.src('./app/img/**')
    .pipe(gulp.dest('dist/img'));
});

// Browserify task
gulp.task('browserify', function() {
  gulp.src(['app/scripts/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: false
  }))
  .pipe(concat('bundle.js'))
  .pipe(minify())
  .pipe(gulp.dest('dist/js'));
});

// Views task
gulp.task('views', function() {
  gulp.src('app/index.html')
  .pipe(gulp.dest('./'));
  gulp.src('app/views/**/*')
  .pipe(gulp.dest('dist/views/'));
});

// Watch task
gulp.task('watch', ['lint'], function() {
  server.listen(serverport);
  refresh.listen(livereloadport);

  gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],[
    'lint',
    'browserify'
  ]);
  gulp.watch(['app/styles/**/*.scss'], [
    'styles'
  ]);

  gulp.watch(['app/**/*.html'], [
    'views'
  ]);

  gulp.watch('./dist/**').on('change', refresh.changed);

});

// Default task
gulp.task('default', ['dev', 'watch']);








