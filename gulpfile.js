'use strict';

//
// Main Tasks:
//  coverage - run all local unit tests and generate coverage report
//  clean - clean coverage, node_modules, and bower
//  bower - install bower components
//
// Helper Tasks:
//  bower_install - install all the bower packages
//  bower_inject - add bower dependencies to www/html/index.html
//  coverage_report - generate a coverage report from the saved coverage files
//  unit_test - run unit tests, capturing coverage data
//  api_test - run api tests, copturing coverage data
//  clean_coverage - clean all the coverage files
//  clean_bower - clean out the bower files
//  clean_modules - clean node_modules
//


var gulp = require('gulp');
var lazypipe = require('lazypipe');
var del = require('del');
var wiredep = require('wiredep').stream;
var plugins = require('gulp-load-plugins')({DEBUG: false});



var files = {
    lib_files:  ['lib/**/*.js', '!lib/FlowTrack2App.js','!lib/WebService/**'],
    api_files: ['lib/FlowTrack2App.js','lib/WebService/**/*.js'],
    unit_test_files: ['test/unit/**/*.js'],
    api_test_files: ['test/api/**/*.js'],
    coverage_files : ['coverage/**/coverage*.json']
};

var config = {
    mocha: {
        reporter: 'spec'
    },
    istanbul: {
        includeUntested: true
    },
    istanbulReport: {
        reporters: ['lcov','text']
    },
    unitCoverage: {
        reporters: ['json'],
        reportOpts: {
            json: {
                dir: 'coverage',
                file: 'coverage-unit.json'
            }
        }
    },
    apiCoverage: {
        reporters: ['json'],
        reportOpts: {
            json: {
                dir: 'coverage',
                file: 'coverage-api.json'
            }
        }
    }
};


// Main tasks
gulp.task('default', ['test']);
gulp.task('test', function (cb) {
    process.env.NODE_ENV = process.env.NODE_ENV || 'uTest';
    plugins.sequence('clean_coverage', 'api_test', 'unit_test', 'coverage_report')(cb);
});

gulp.task('bower', function () {
    plugins.sequence('bower_install', 'bower_inject');
});

gulp.task('e2e', function (cb) {
    process.env.NODE_ENV = process.env.NODE_ENV || 'e2eTest';
    plugins.sequence('load_data', 'test_server', 'clean_coverage', ['e2e_instrument',
                     'e2e_test'], 'stop_test_server')(cb);
});


gulp.task('clean', ['clean_bower','clean_modules','clean_coverage']);


// Support tasks
gulp.task('coverage_report', function () {
    return gulp.src(files.coverage_files).pipe(istanbulWriteReport());

});

gulp.task('unit_test', function (cb) {
    gulp.src(files.lib_files)
      .pipe(istanbulPre())
      .on('end', function () {
          gulp.src(files.unit_test_files)
            .pipe(mochaTask())
            .pipe(istanbulUnit())
            .on('end', cb);
      });
});

gulp.task('api_test', function (cb) {
    gulp.src(files.api_files)
      .pipe(istanbulPre())
      .on('end', function () {
          gulp.src(files.api_test_files)
            .pipe(mochaTask())
            .pipe(istanbulAPI())
            .on('end', cb);
      });
});


gulp.task('bower_install', function () {
    return plugins.bower()
        .pipe(gulp.dest('www/bower_components'))
        .on('end', function () {
            del('bower_components');
        });
});


gulp.task('bower_inject', function () {
    gulp.src('./www/html/index.html')
        .pipe(wiredep({
            directory: 'www/bower_components'
        }))
        .pipe(plugins.debug())
        .pipe(gulp.dest('./www/html'));
});

//
// Cleaners
//
gulp.task('clean_coverage', function (cb) {
    del.sync('coverage');
    cb();
});

gulp.task('clean_modules', function (cb) {
    del.sync('node_modules');
    cb();
});

gulp.task('clean_bower', function (cb) {
    del.sync('www/bower_components');
    cb();
});

//
// testing and reporting "drivers"
//
var mochaTask = lazypipe()
  .pipe(plugins.mocha, config.mocha);

var istanbulPre = lazypipe()
  .pipe(plugins.istanbul, config.istanbul)
  .pipe(plugins.istanbul.hookRequire);

var istanbulUnit = lazypipe()
  .pipe(plugins.istanbul.writeReports, config.unitCoverage);

var istanbulAPI = lazypipe()
  .pipe(plugins.istanbul.writeReports, config.apiCoverage);

var istanbulWriteReport = lazypipe()
  .pipe(plugins.istanbulReport, config.istanbulReport);
