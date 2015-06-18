'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

// Turn on testing
process.env.NODE_ENV = 'test';

var SOURCE_FILES = ['lib/**/*.js', 'bin/*', 'test/**/*.js'];
var TESTS = ['test/unit/**/*.js'];

gulp.task('test', function(cb) {
    gulp.src(TESTS)
        .pipe(mocha({
            reporter: 'spec'
        }).on('error', gutil.log));
});


gulp.task('coverage', function(cb) {
    gulp.src(SOURCE_FILES)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            gulp.src(TESTS)
                .pipe(mocha({
                    reporter: 'spec'
                }))
                .on('error', gutil.log)
                .pipe(istanbul.writeReports())
                .on('error', gutil.log);
        });

});