'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/**/*.test.js']
        },


        // Istanbul code coverage
        mocha_istanbul: {
            coverage: {
                src: ['test/**/*.test.js'],
                options: {
                    coverageFolder: 'test/coverage'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['lib/**/*.js']
            },
            test: {
                src: ['test/**/*.test.js']
            },
            bin: {
                src: ['bin/*.js', 'bin/flowTrack']
            },
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile', 'test']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib', 'test']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'coverage']
            },
            bin: {
                files: '<%= jshint.bin.src %>',
                tasks: ['jshint:bin', 'test']
            },
        },

        nodemon: {
            dev: {
                script: 'bin/flowTrack',
                ignore: ['node_modules/**', 'test/coverage/**'],
                delay: 4000
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-env');

    // Default task.
    grunt.registerTask('default', ['env:test', 'jshint']);
    grunt.registerTask('coverage', ['env:test', 'jshint', 'mocha_istanbul:coverage']);
    grunt.registerTask('test', ['env:test', 'mochaTest']);

};