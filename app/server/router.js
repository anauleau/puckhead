//router - routes server requests
var handler = require('./handler');

var paths = {
  '/s'        : handler.splash, 
  '/lobby'   : handler.lobby,
  '/game'    : handler.game,
  '/postgame': handler.post
};

module.exports.paths = paths;
