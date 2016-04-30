'use strict';
var bunyan = require('bunyan');

function GetLogger(mode, name) {
  var level = '';
  var config = {};

  switch (mode) {
    case 'dev':
      level = 'debug';
      break;
    case 'quiet':
    case 'controllerTest':
    case 'viewTest':
    case 'modelTest':
      level = 'fatal';
      break;
    default:
      level = 'info';
      break;
  }

  // Set a name if we don't have one
  if (name === null || name === '' || name === undefined) {
    name = 'FlowTrack2';
  }

  config = {
    name: name,
    level: level
  };

  return bunyan.createLogger(config);
}

module.exports = GetLogger;
