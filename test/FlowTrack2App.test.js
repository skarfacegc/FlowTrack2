'use strict';

var FlowTrack2App = require('../lib/FlowTrack2App');
var GetLogger = require('../lib/GetLogger');
var request = require('supertest');

describe('FlowTrack2App', function() {
    describe('Routes', function() {
        it('/ route should return html', function(done) {

            var app = new FlowTrack2App(new GetLogger('test', 'TestLogger'));

            request(app)
                .get('/')
                .expect('Content-type', /text\/html.*/)
                .expect(200, done);

        });

        // Just use angular as a sample, not actually testing angular, just making sure
        // the /bower route works
        it('/bower/angular/angular.js should return javascript', function(done) {

            var app = new FlowTrack2App(new GetLogger('test', 'TestLogger'));

            request(app)
                .get('/bower/angular/angular.js')
                .expect('Content-type', /.*javascript.*/)
                .expect(200, done);
        });
    });

});