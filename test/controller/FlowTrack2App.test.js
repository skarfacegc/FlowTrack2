'use strict';

var FlowTrack2App = require('../../lib/controller/FlowTrack2App');
var GetLogger = require('../../lib/util/GetLogger');
var config = require('config');
var es = require('elasticsearch');

var request = require('supertest');

describe('FlowTrack2App', function() {
  describe('Routes', function() {
    it('/ route should return html', function(done) {
      var logger = new GetLogger('quiet', 'TestLogger');
      var app = new FlowTrack2App(es, logger, config);

      request(app)
          .get('/')
          .expect('Content-type', /text\/html.*/)
          .expect(200, done);
    });

    // Just use angular as a sample, not actually testing angular, just making sure
    // the /bower route works
    it('/bower_components requsets should return javascript', function(done) {
      var app = new FlowTrack2App(es, new GetLogger('test', 'TestLogger'),
        config);

      request(app)
          .get('/bower_components/angular/angular.js')
          .expect('Content-type', /.*javascript.*/)
          .expect(200, done);
    });
  });
});
