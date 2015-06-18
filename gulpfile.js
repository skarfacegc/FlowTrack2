'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var bower = require('gulp-bower');
var jshint = require('gulp-jshint');
var del = require('del');
var nodemon = require('gulp-nodemon');
var jshintStylish = require('jshint-stylish');




var SOURCE_FILES = ['lib/**/*.js', 'bin/*', 'test/**/*.js'];
var TESTS = ['test/unit/**/*.js'];

// Run jshint across everything in SOURCE_FILES
// this is a pre-req for test, coverage, watch
gulp.task('jshint', function() {
    return gulp.src(SOURCE_FILES)
        .pipe(jshint())
        .pipe(jshint.reporter(jshintStylish))
        .pipe(jshint.reporter('fail'));
});

// Run the test suite, show details
gulp.task('test', ['jshint'], function(cb) {
    process.env.NODE_ENV = 'test';
    gulp.src(TESTS)
        .pipe(mocha({
            reporter: 'spec'
        }).on('end', cb));
});

// Run the test suite with code coverage
// Shows minimal test details
gulp.task('coverage', ['jshint'], function(cb) {
    process.env.NODE_ENV = 'test';
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




// Install bower components
// installs to www/bower_components and 
// cleans up ./bower_components
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest('www/bower_components'))
        .on('end', function() {
            del('bower_components');
        });
});


// Rerun coverage on change
gulp.task('watch', function() {
    process.env.NODE_ENV = 'test';
    gulp.watch(SOURCE_FILES, ['jshint', 'coverage']);
});

// Start the flowTrack application
// restart on change
// logfiles are emitted in bunyan format
gulp.task('run', ['jshint'], function() {
    nodemon({
        script: 'bin/flowTrack',
        ext: 'html js',
        ignore: ['coverage', 'node_modules', 'bower_components']
    }).on('restart', function() {
        console.log('\nRESTART\n');
    });
});