var gulp   = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

gulp.task('build-pixel', function() {
  return gulp.src(['./src/utils.js', './src/pixel.js', './src/canvas.js'])
    .pipe(concat('pixel.js'))
    .pipe(gulp.dest('./build/'));
});

// livereload html files
gulp.task('reload-html', function () {
  return gulp.src('demo/*.html')
    .pipe(connect.reload());
});

// livereload js files
gulp.task('reload-js', function () {
  return gulp.src('demo/**/*.js')
    .pipe(connect.reload());
});

// livereload source files
gulp.task('reload-source', function () {
  return gulp.src('build/*.js')
    .pipe(connect.reload());
});

// need livereload
gulp.task('need-reload', function () {
  gulp.watch(['demo/*.html'], ['reload-html']);
  gulp.watch(['demo/**/*.js'], ['reload-js']);
  gulp.watch(['build/*.js'], ['reload-source']);
});

gulp.task('dev', ['build-pixel', 'need-reload'], function() {
  var sourceWatcher = gulp.watch('src/**/*.js', ['build-pixel']);
  sourceWatcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  connect.server({
    root: ['demo', 'build'],
    port: 9999,
    livereload: true
  });
});
