var jshint = require('gulp-jshint');
var gulp   = require('gulp');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
  return gulp.src('./lib/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('lint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
  return gulp.src(['./src/utils.js', './src/pixel.js'])
    .pipe(concat('pixel.js'))
    .pipe(gulp.dest('./build/'));
});