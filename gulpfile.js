'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var istanbulReport = require('gulp-istanbul-report');
var mocha = require('gulp-mocha');
var gulpSequence = require('gulp-sequence');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var protractor = require('gulp-protractor').protractor;
var bower = require('gulp-bower');
var jshint = require('gulp-jshint');
var del = require('del');
var nodemon = require('gulp-nodemon');
var jshintStylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var jscsStylish = require('gulp-jscs-stylish');
var gls = require('gulp-live-server');




process.env.NODE_ENV = process.env.NODE_ENV || 'test';




//
// File sets
//

// Project source files
var SOURCE_FILES = ['lib/**/*.js', 'bin/*'];
var WWW_SOURCE_FILES = ['www/js/**/*.js'];

// Test files
var UNIT_TESTS = ['test/unit/**/*.test.js'];
var E2E_TESTS = ['test/e2e/**/*.e2e.js','test/e2e/**/*.js'];

// Unit and E2E combined
var E2E_COMBINED = [].concat(WWW_SOURCE_FILES, E2E_TESTS);
var UNIT_COMBINED = [].concat(SOURCE_FILES, UNIT_TESTS);

// All Combined test & source
var SOURCE_AND_TESTS = [].concat(E2E_COMBINED, UNIT_COMBINED);

var COVERAGE_FILES = ['coverage/**/coverage*.json'];


//
// Main tasks
//

// combined tasks
gulp.task('test', ['lint', 'unit_test']);

gulp.task('coverage', function (callback) {
    gulpSequence('clean_coverage', 'lint',
        'unit_coverage', 'coverage_report')(callback);
});

gulp.task('e2e', function (callback) {
    gulpSequence('clean_coverage', 'lint', 'e2e_instrument',
        'start_server', 'e2e_coverage', 'coverage_report', 'stop_server')(callback);
});

gulp.task('full', function (callback) {
    gulpSequence('clean_coverage', 'lint', 'e2e_instrument', ['unit_coverage', 'start_server',
      'e2e_coverage'], 'coverage_report', 'stop_server')(callback);
});

gulp.task('clean', ['clean_coverage', 'clean_modules', 'clean_bower']);


//
// lint
//

// Run jshint across everything in SOURCE_FILES
// this is a pre-req for test, coverage, watch
gulp.task('lint', function () {
    return gulp.src(SOURCE_AND_TESTS)
        .pipe(jshint())
        .pipe(jscs())
        .pipe(jscsStylish.combineWithHintResults())
        .pipe(jshint.reporter(jshintStylish))
        .pipe(jshint.reporter('fail'));
});


//
// Unit Test
//

// Run the test suite, show details
gulp.task('unit_test', function (cb) {
    gulp.src(UNIT_TESTS)
        .pipe(mocha({
            reporter: 'spec'
        }).on('end', cb));
});

// Run the test suite with code coverage
// Shows minimal test details
gulp.task('unit_coverage', function (cb) {
    gulp.src(SOURCE_FILES)
        .pipe(plumber())
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src(UNIT_TESTS)
                .pipe(plumber())
                .pipe(mocha({
                    reporter: 'spec'
                }))
            // Just write the json report. the reporter will
            // use it to do the actual report
            .pipe(istanbul.writeReports({
                reporters: ['json'],
                reportOpts: {
                    json: {
                        dir: 'coverage',
                        file: 'coverage-unit.json'
                    }
                }
            }))
                .on('end', cb);
        });

});

// Rerun coverage on change
gulp.task('watch', function () {
    gulp.watch(SOURCE_AND_TESTS, ['coverage']);
});

//
// End to End (integration tests)
//

// instrument the browser javascript
gulp.task('e2e_instrument', function (cb) {
    gulp.src(WWW_SOURCE_FILES)
        .pipe(istanbul({
            coverageVariable: '__coverage__flowTrack2__'
        }))
        .pipe(gulp.dest('coverage/www/test_files'))
        .on('end', cb);
});

// Run the tests
gulp.task('e2e_coverage', function (cb) {
    gulp.src(E2E_TESTS)
        .pipe(protractor({
            configFile: "test/e2e/e2e.conf.js"
        }))
        .on('end', cb);
});


// Start and stop the application server
var server = gls('bin/flowTrack', { env: {NODE_ENV: 'test'} }, false);
gulp.task('start_server', function (cb) {
    server.start();
    cb();
});

gulp.task('stop_server', function (cb) {
    server.stop();
    cb();
});


//
// Support
//

// Install bower components
// installs to www/bower_components and
// cleans up ./bower_components
gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('www/bower_components'))
        .on('end', function () {
            del('bower_components');
        });
});

// Generate the istanbul reports
gulp.task('coverage_report', function (cb) {
    gulp.src(COVERAGE_FILES)
        .pipe(istanbulReport({
            reporters: ['lcov', 'text']
        }))
        .on('end', cb);
});


//
// Clean
//
gulp.task('clean_coverage', function (cb) {
    del('coverage');
    cb();
});

gulp.task('clean_modules', function (cb) {
    del('node_modules');
    cb();
});

gulp.task('clean_bower', function (cb) {
    del('www/bower_components');
    cb();
});

// Start the flowTrack application
// restart on change
// logfiles are emitted in bunyan format
gulp.task('run', ['lint'], function () {
    nodemon({
        script: 'bin/flowTrack',
        ext: 'html js',
        ignore: ['coverage', 'node_modules', 'bower_components']
    }).on('restart', function () {
        console.log('\nRESTART\n');
    });
});
