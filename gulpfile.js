'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber')
    // Turn on testing
process.env.NODE_ENV = 'test';

var SOURCE_FILES = ['lib/**/*.js', 'bin/*', 'test/**/*.js'];
var TESTS = ['test/unit/**/*.js'];

gulp.task('test', function(cb) {
    gulp.src(TESTS)
        .pipe(mocha({
            reporter: 'spec'
        }).on('end', cb));
});


gulp.task('coverage', function(cb) {
    gulp.src(SOURCE_FILES)
        .pipe(plumber())
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            gulp.src(TESTS)
                .pipe(plumber())
                .pipe(mocha({
                    reporter: 'min'
                }))
                .pipe(istanbul.writeReports())
                .on('end', cb);
        });

});


gulp.task('watch', function() {
    gulp.watch(SOURCE_FILES, ['coverage']);
});