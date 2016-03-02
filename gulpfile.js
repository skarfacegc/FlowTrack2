'use strict';

// Day to day tasks are under main tasks (test and full being the main ones)
// You shouldn't need to manually run the helper tasks.
//
// Most of the config is in files. and config.
//
// Main Tasks:
//  test - run unit, api tests with coverage report
//  full - run unit, api, e2e tests with coverage report
//  e2e - run browser based end to end tests
//  api - run api tests with coverage
//  unit - run unit tests with coverage
//  clean - clean coverage, node_modules, and bower
//  bower - install bower components
//  travis - currently an alias to full
//  lint - run linters (jshint and jscs)
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
//  e2e_instrument - compile instrumented versions of the client files
//  e2e_test - run the e2e tests
//  test_server - start the test server
//  stop_test_server - stop the test server
//  load_data - load test data into the DB
//

// NODE_ENV matters for these (espeically the e2e tests)
// config files are selected based on the env, and we need
// to point to a different location for the web js files


var gulp = require('gulp');
var lazypipe = require('lazypipe');
var del = require('del');
var wiredep = require('wiredep').stream;
var exec = require('child_process').exec;
var jshintStylish = require('jshint-stylish');


// Load all of the gulp-* modules listed in package.json into
// plugins.*  I nomrally don't like this type of obfuscation
// but the plugin list was getting out of control
var plugins = require('gulp-load-plugins')({DEBUG: false});

// Holds the testServer object from gulp-live-server
var testServer = {};


// various file sets used below
var files = {
    lib_files:  ['lib/**/*.js', '!lib/FlowTrack2App.js','!lib/WebService/**'],
    api_files: ['lib/FlowTrack2App.js','lib/WebService/**/*.js'],
    client_files: ['www/js/**/*.js'],
    all_src: ['www/js/**/*.js','lib/**/*.js','bin/flowTrack.js','test/**/*.js','gulpfile.js'],
    unit_test_files: ['test/unit/**/*.js'],
    api_test_files: ['test/api/**/*.js'],
    e2e_test_files: ['test/e2e/**/*.js'],
    coverage_files : ['coverage/**/coverage*.json'],
    instrumented_files: 'coverage/www/test_files'
};

// Configuration settings for various tasks / processes
var config = {
    mocha: {
        reporter: 'spec'
    },
    istanbul: {
        includeUntested: true
    },
    istanbulInstrument: {
        includeUntested: true,
        coverageVariable: '__coverage__flowTrack2__'
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
    },
    protractor: {
        configFile: 'test/e2e/e2e.conf.js'
    },
    testServer: {
        env: {
            NODE_ENV: 'e2eTest'
        }
    }
};


//
// Main tasks
//

gulp.task('default', ['test']);
// run all but the e2e tests
gulp.task('test', function (cb) {
    process.env.NODE_ENV = process.env.NODE_ENV || 'uTest';
    plugins.sequence('clean_coverage', 'api_test', 'unit_test', 'lint', 'coverage_report')(cb);
});

// Run all tests
gulp.task('full', function (cb) {
    process.env.NODE_ENV = process.env.NODE_ENV || 'e2eTest';
    plugins.sequence('load_data', 'test_server', 'clean_coverage',
                     'api_test', 'unit_test', ['e2e_instrument',
                     'e2e_test'], 'stop_test_server', 'lint', 'coverage_report')(cb);
});

// Run the e2e tests.  These interact with a browser
gulp.task('e2e', function (cb) {
    process.env.NODE_ENV = process.env.NODE_ENV || 'e2eTest';
    plugins.sequence('load_data', 'test_server', 'clean_coverage', ['e2e_instrument',
                     'e2e_test'], 'stop_test_server', 'coverage_report')(cb);
});

// API tests deal with testing the JSON api. In general these use
// supertest to spin up the application and make requests.  Not full
// e2e
gulp.task('api', function (cb) {
    process.env.NODE_ENV = process.env.NODE_ENV || 'e2eTest';
    plugins.sequence('clean_coverage', 'load_data', 'api_test', 'coverage_report')(cb);
});

// Run the unit tests
gulp.task('unit', function (cb) {
    process.env.NODE_ENV = process.env.NODE_ENV || 'uTest';
    plugins.sequence('clean_coverage', 'load_data', 'unit_test', 'coverage_report')(cb);
});

// Download, install, and inject bower components
gulp.task('bower', function (cb) {
    plugins.sequence('bower_install', 'bower_inject')(cb);
});

// Delete data files and modules
gulp.task('clean', ['clean_bower','clean_modules','clean_coverage']);

// This task gets run by travis-ci
gulp.task('travis', ['full']);

// Run linters across all src files
gulp.task('lint', function () {
    return gulp.src(files.all_src)
        .pipe(plugins.jshint())
        .pipe(plugins.jscs())
        .pipe(plugins.jscsStylish.combineWithHintResults())
        .pipe(plugins.jshint.reporter(jshintStylish));
});

gulp.task('watch', function (cb) {
    gulp.watch(files.api_files, ['api']);
    gulp.watch(files.lib_files, ['unit']);
    gulp.watch(files.client_files, ['e2e']);
    cb();
});

//
// Support tasks
//

// Generate a merged coverage report on any reports available
gulp.task('coverage_report', function () {
    gulp.src(files.coverage_files)
      .pipe(istanbulWriteReport())
      .on('error', function (error) {
          plugins.util.log(error.message);
          process.exit(0);
      });
});


// run unit tests and collect coverage data
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


// test the server functions and collect coverage data
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

// install the bower packages
gulp.task('bower_install', function (cb) {
    plugins.bower()
        .pipe(gulp.dest('www/bower_components'))
        .on('end', function () {
            del('bower_components');
            cb();
        });
});

// add bower installed packages to the html
gulp.task('bower_inject', function () {
    gulp.src('./www/html/index.html')
        .pipe(wiredep({
            directory: 'www/bower_components'
        }))
        .pipe(gulp.dest('./www/html'));
});


// instrument the files for e2e testing
gulp.task('e2e_instrument', function (cb) {
    gulp.src(files.client_files)
      .pipe(istanbulInstrument())
      .pipe(gulp.dest(files.instrumented_files))
      .on('end', cb);
});

// run the actual e2e test
gulp.task('e2e_test', function (cb) {
    gulp.src(files.e2e_test_files)
      .pipe(plugins.protractor.protractor(config.protractor))
      .on('end', cb);
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

gulp.task('test_server', function (cb) {
    testServer = plugins.liveServer('bin/flowTrack', config.testServer, false);
    testServer.start();
    cb();
});

gulp.task('stop_test_server', function (cb) {
    testServer.stop();
    cb();
});


// load test data
gulp.task('load_data', function (cb) {
    exec('./test/bin/loadTestData.js', function (err,stdout,stderr) {
      if (err) {
          console.log(err);
          console.log(stdout);
          console.log(stderr);
      }
      cb();
  });
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

var istanbulInstrument = lazypipe()
  .pipe(plugins.istanbul, config.istanbulInstrument);

var protractorTest = lazypipe()
  .pipe(plugins.protractor.protractor, config.protractor);
