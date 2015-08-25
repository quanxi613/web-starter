var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('./config.json');

gulp.task('copy', function () {
  return gulp.src('./app/**/*.php')
    .pipe(gulp.dest(config.dist + 'dist'))
});

gulp.task('connect', function () {
  $.connectPhp.server({
    base: config.dist + 'dist',
    port: 5555,
    open: true
  });

  gulp.watch('./app/src/css/**/*.less', ['less']);
  gulp.watch('./bower_components/moye/src/css/**/*.less', 'moyeless');
});

gulp.task('less', function () {
  return gulp.src('./app/src/css/**/*.less')
    .pipe($.less())
    .pipe($.if(config.uglify, $.minifyCss()))
    .pipe(gulp.dest(config.dist + 'dist/src/css'));
});
gulp.task('moyeless', function () {
  return gulp.src('./bower_components/moye/src/css/**/*.less')
    .pipe($.less({
      paths: ['./bower_components/']
    }))
    .pipe(gulp.dest(config.dist + 'dist/src/css/moye'));
});
gulp.task('js', function () {
  return gulp.src('./app/src/js/**/*.js')
    .pipe($.if(config.uglify, $.uglify()))
    .pipe(gulp.dest(config.dist + 'dist/src/js'));
});
gulp.task('moyejs', function () {
  return gulp.src('./bower_components/moye/src/ui/**/*.js')
    .pipe(gulp.dest(config.dist + 'dist/src/js/moye'));
});

gulp.task('default', ['copy', 'less', 'moyeless', 'js', 'moyejs', 'connect']);
