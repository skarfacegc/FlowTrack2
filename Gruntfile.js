'use strict';

module.exports = function(grunt) {


    // Project configuration.
    grunt.initConfig({

        files: {
            lib: ['lib/**/*.js'],
            bin: ['bin/*'],
            config: ['config/**/*'],
            unit_tests: ['test/Unit/**/*.js'],
            gruntfile: ['Gruntfile.js'],

            // Composites of above
            src: ['lib/**/*.js', 'bin/*', 'test/**/*.js'],
            all: ['lib/**/*.js', 'bin/*', 'config/**/*', 'test/**/*.js', 'Gruntfile.js', 'package.json']
        },

        // Set Environment
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },

        // Maybe remove this, istanbul covers it nicely
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: '<%= files.unit_lstests %>'
        },


        // Istanbul code coverage
        mocha_istanbul: {
            coverage: {
                src: '<%= files.unit_tests %>',
                options: {
                    coverageFolder: 'coverage/unit_tests',
                    print: 'detail'
                }
            }
        },

        // Run jshint
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: '.jshintrc',

            },
            src: {
                src: '<%= files.src %>'
            },
            jshintrc: {
                src: '.jshintrc'
            },
        },


        // run jshint/tests/coverage when anything changes
        watch: {
            all: {
                files: '<%= files.all %>',
                tasks: ['coverage']
            },
            jshintrc: {
                files: '.jshintrc',
                tasks: ['jshint']
            }
        },

        // restart the server when anything changes
        nodemon: {
            dev: {
                script: 'bin/flowTrack',
                options: {
                    ignore: ['node_modules/**', 'coverage/**'],
                    delay: 4000,
                    verbose: true
                }
            }
        },

        //Install and copy bower libs
        bowercopy: {
            options: {
                clean: true,
            },
            task: {
                src: 'bower_components',
                dest: 'www/bower_components'

            }
        },

            }
        },


    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-env');

    // Default task.
    grunt.registerTask('default', ['env:test', 'jshint:src']);
    grunt.registerTask('coverage', ['env:test', 'jshint:src', 'mocha_istanbul:coverage']);
    grunt.registerTask('test', ['env:test', 'mochaTest']);

};