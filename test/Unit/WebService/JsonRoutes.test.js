'use strict';

var JsonRoutes = require('../../../lib/WebService/JsonRoutes');



var es = require('elasticsearch');
var config = require('config');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var supertest = require('supertest');

var expect = chai.expect;
chai.use(sinonChai);