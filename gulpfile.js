var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var httpProxy = require('http-proxy');
var config = require('./config.json');
var runSequence = require('run-sequence'); //确保任务按顺序执行

gulp.task('connect', function () {
  $.connectPhp.server({
    base: config.dist + 'dist',
    port: 9001,
    open: true
  });

  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
      directory: true,
      routes    : {
          '/bower_components': 'bower_components'
      },
      middleware: function (req, res, next) {
          var url = req.url;

          if (!url.match(/^\/(src|fonts|bower_components)\//)) {
              proxy.web(req, res, { target: 'http://127.0.0.1:9001' });
          } else {
              next();
          }
      }
    }
  });

  gulp.watch([
    'app/mock/**/*.php',
    'app/src/js/**/*.js',
    'app/src/img/**/*'
  ]).on('change', reload);

  gulp.watch('./app/src/css/**/*.less', ['less', reload]);
  gulp.watch('./app/Tpl/**/*.tpl', ['tpl', reload]);
});


gulp.task('copy', function () {
  return gulp.src([
    './app/**/*',
    '!.app/src/**/*',
    '!.app/tpl/**/*'
    ])
    .pipe(gulp.dest(config.dist + 'dist'));
});


gulp.task('mock', function () {
  return gulp.src('./app/mock/**/*.php')
    .pipe(gulp.dest(config.dist + 'dist/mock'));
});

gulp.task('tpl', function () {
  return gulp.src('./app/tpl/**/*.tpl')
    .pipe($.changed(config.dist + 'tpl'))
    .pipe(gulp.dest(config.dist + 'dist/tpl'));
});

gulp.task('img', function () {
  return gulp.src('./app/src/img/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .pipe(gulp.dest(config.dist + 'dist/src/img'));
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
    .pipe($.changed(config.dist + 'src/css', {extension: '.css'}))
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.postcss([
      require('autoprefixer-core')({browers: AUTOPREFIXER_BROWSERS})
    ]))
    .pipe($.sourcemaps.write())
    .pipe($.if(config.uglify, $.minifyCss()))
    .pipe(gulp.dest('./dist/src/css'))
    .pipe(reload({stream: true}));
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

var build = ['tpl', 'jstpl', 'less', 'js', 'img', 'bower'];

//本地调试 
gulp.task('default', function (callback) {
  runSequence(
    'mock',
    'copy',
    build,
    'connect',
    callback
    );
});

//发布版本
gulp.task('build', function (callback) {
  runSequence(
    build,
    callback
    );
});
