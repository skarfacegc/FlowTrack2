'use strict';

var FlowTrack2App = require('../lib/FlowTrack2App');
var GetLogger = require('../lib/GetLogger');
var request = require('supertest');

describe('FlowTrack2App', function() {
    it('/ route should return html', function(done) {

        var app = new FlowTrack2App(new GetLogger('test', 'TestLogger'));

        request(app)
            .get('/')
            .expect('Content-type', /text\/html.*/)
            .expect(200, done);

    });

});