var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var config = require('./config.json');

gulp.task('connect', function () {
  $.connectPhp.server({
    base: config.dist + 'dist',
    port: 9000,
    open: true
  });

  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
      directory: true
    }
  });

  gulp.watch([
    'app/tpl/**/*.tpl',
    'app/mock/**/*.php',
    'app/src/js/**/*.js',
    'app/src/img/**/*'
  ]).on('change', reload);

  gulp.watch('./app/src/css/**/*.less', ['less', reload]);
});


gulp.task('copy', function () {
  return gulp.src([
    './app/**/*',
    '!.app/src/**/*',
    '!.app/tpl/**/*'
    ])
    .pipe(gulp.dest(config.dist + 'dist'))
});


gulp.task('mock', function () {
  return gulp.src('./app/mock/**/*.php')
    .pipe(gulp.dest(config.dist + 'dist/mock'))
});

gulp.task('tpl', function () {
  return gulp.src('./app/tpl/**/*.tpl')
    .pipe(gulp.dest(config.dist + 'dist/tpl'))
});

//编译less并自动添加浏览器前缀
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
    .pipe($.less())
    .pipe($.postcss([
      require('autoprefixer-core')({browers: AUTOPREFIXER_BROWSERS})
    ]))
    .pipe($.sourcemaps.write())
    .pipe($.if(config.uglify, $.minifyCss()))
    .pipe(gulp.dest('./dist/src/css'));
});

//js处理 是否压缩
gulp.task('js', function () {
  return gulp.src('./app/src/js/**/*.js')
    .pipe($.if(config.uglify, $.uglify()))
    .pipe(gulp.dest(config.dist + 'dist/src/js'));
});

//js模板引擎
gulp.task('jstpl', function () {
  return gulp.src('./app/src/js/jstpl/**/*.hbs')
    .pipe($.handlebars())
    .pipe($.defineModule('amd'))
    .pipe(gulp.dest('./dist/src/js/jstpl'));
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

gulp.task('clean', require('del').bind(null, ['dist']));

//本地调试
gulp.task('default', ['copy', 'tpl','mock','less', 'moyeless', 'js', 'moyejs', 'jstpl', 'connect']);

//发布版本
gulp.task('build', ['tpl','less', 'moyeless', 'js', 'moyejs', 'jstpl', 'connect']);