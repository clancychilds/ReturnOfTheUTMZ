var browserify = require('browserify');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var DEST = 'build/';
var SRC_JS = ['src/*.js'];
var TEST_JS = 'test/*.js';

gulp.task('test', function() {
    return gulp.src(TEST_JS)
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('lint', function() {
    return gulp.src(SRC_JS)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('ga_scripts', function() {
    
    return browserify('./src/utmz_ga.js')
        .bundle()
        .pipe(source('utmz_ga.js'))
        .pipe(gulp.dest(DEST))
        .pipe(rename('utmz_ga.min.js'))
        .pipe(buffer())
        .pipe(uglify({mangle:true}))
        .pipe(gulp.dest(DEST));
});

gulp.task('ga_scripts-nomin', function() {
    
    return browserify('./src/utmz_ga.js')
        .bundle()
        .pipe(source('utmz_ga.js'))
        .pipe(gulp.dest(DEST));
});

gulp.task('non_ga_scripts', function() {
    
    return browserify('./src/utmz.js')
        .bundle()
        .pipe(source('utmz.js'))
        .pipe(gulp.dest(DEST))
        .pipe(rename('utmz.min.js'))
        .pipe(buffer())
        .pipe(uglify({mangle:true}))
        .pipe(gulp.dest(DEST));
});

gulp.task('non_ga_scripts-nomin', function() {
    
    return browserify('./src/utmz.js')
        .bundle()
        .pipe(source('utmz.js'))
        .pipe(gulp.dest(DEST));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(SRC_JS, ['scripts-nomin']);
});

gulp.task('scripts-nomin', ['ga_scripts-nomin','non_ga_scripts-nomin']);
gulp.task('scripts', ['ga_scripts','non_ga_scripts']);

gulp.task('default', ['lint', 'scripts']);