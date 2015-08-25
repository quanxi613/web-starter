var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('./config.json');



gulp.task('connect', function () {
  $.connectPhp.server({
    base: './dist',
    port: 5555,
    open: true
  });

  gulp.watch('./app/src/css/**/*.less', ['less']);
});

//复制所有mock的php文件到相应目录
gulp.task('mock', function () {
  return gulp.src('./app/mock/*.php')
    .pipe(gulp.dest(config.dist + 'dist'))
});

gulp.task('less', function () {
  var AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23'
  ];
  return gulp.src('./app/src/css/**/*.less')
    .pipe($.sourcemaps.init())
    .pipe($.less()).on('error', $.less.logError)
    .pipe($.postcss([
      require('autoprefixer-core')({browers: AUTOPREFIXER_BROWSERS})
    ]))
    .pipe($.sourcemaps.write())
    .pipe($.if(config.uglify, $.csso()))
    .pipe(gulp.dest('./dist/src/css'));
});

gulp.task('js', function () {
  return gulp.src('./app/src/js/**/*.js')
    .pipe($.if(config.uglify, $.uglify()))
    .pipe(gulp.dest(config.dist + 'dist/src/js'));
});

//第三方库相关
gulp.task('moyeless', function () {
  return gulp.src('./bower_components/moye/src/css/**/*.less')
    .pipe($.less({
      paths: ['./bower_components/']
    }))
    .pipe(gulp.dest(config.dist + 'dist/src/css/moye'));
});
gulp.task('moyejs', function () {
  return gulp.src('./bower_components/moye/src/ui/**/*.js')
    .pipe(gulp.dest(config.dist + 'dist/src/js/moye'));
});

gulp.task('clean', require('del').bind(null, 'dist'));

gulp.task('default', ['mock', 'less', 'moyeless', 'js', 'moyejs', 'connect']);

https://github.com/quanxi613/web-stater.git