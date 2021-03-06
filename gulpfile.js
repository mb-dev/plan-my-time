const DEBUG = process.env.NODE_ENV === 'debug';
const CI = process.env.CI === 'true';

var child            = require('child_process');
var gulp             = require('gulp');
var gutil            = require('gulp-util');
var shell            = require('gulp-shell');
var webpack          = require('webpack');
var mocha            = require('gulp-spawn-mocha');
var webpackConfig    = require('./webpack.config.js');
var webpackHotConfig = require('./webpack.hot.config.js');
var notify           = require('gulp-notify');
var WebpackDevServer = require('webpack-dev-server');
var nodemon          = require('gulp-nodemon');
var bg               = require('gulp-bg');

process.on('uncaughtException', function (er) {
  console.error('Throwing error:', er);
});

gulp.task('mocha', function() {
  return gulp.src(['client/**/*.test.js'], {read: false})
    .pipe(mocha({
      compilers: 'js:babel/register',
      R: 'spec'
    }));
});

var timeServiceBg;
gulp.task('api', timeServiceBg = bg('python', 'api/service.py'));
gulp.task('watch:api', function() {
  return gulp.watch(['api/**/*.py'], ['api']);
});
gulp.task('server', function () {
  nodemon({
    script: 'server/server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    verbose: false,
    ignore: [],
    watch: ['server/**/*.js'],
    execMap: {
      js: 'node --harmony --use_strict'
    }
  }).on('restart', function () {
    console.log('restarted!');
  });
});

testCmd = 'python -m unittest discover -p "*_test.py"';
gulp.task('pythontest', shell.task([testCmd], {cwd: 'api'}));

gulp.task('test', ['pythontest']);

gulp.task('dev', ['webpack', 'server', 'api', 'watch:api']);

gulp.task('webpack', function() {
    if (CI) {
      webpackConfig.watch = false;
      webpackConfig.bail = true;
    }
    // run webpack
    webpack(webpackConfig, function(err, stats) {
      if (err) {
        throw new gutil.PluginError('webpack', err);
      }
      gutil.log('[webpack]', stats.toString({
          // output options
      }));
    });
});

gulp.task('webpack-dev-server', function(callback) {
    // Start a webpack-dev-server
    var compiler = webpack(webpackHotConfig);
    var server = new WebpackDevServer(compiler, {
      contentBase: 'http://localhost:8000',
      hot: true,
      historyApiFallback: true,
      proxy: {
        '/js/*': {
          target: 'http://localhost:8080',
          secure: false
        }
      }
    });
    server.listen(8080, 'localhost', function(err) {
        if(err) throw new gutil.PluginError('webpack-dev-server', err);
        // Server listening
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');

        // keep the server alive or continue?
        callback();
    });
});
