var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

var baseDir = './app/';
var scriptDir = baseDir + 'scripts/';
var destDir = baseDir + 'dist/';

gulp.task('server', connect.server({
  open: {}
}));

gulp.task('scripts', function() {
  gulp.src(scriptDir + 'app.js')
    .pipe(browserify({
      transform: ['reactify']
      //debug: true //source map
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(destDir))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(scriptDir + '**/*.js', ['scripts']);
});

gulp.task('default', ['scripts', 'server', 'watch']);

