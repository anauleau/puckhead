//handler - library of server responses
var express = require('express'),
    app     = express();

//defines four routes
var splash, lobby, game, post;

spalsh = app.get('/s', function(req, res){
  res.send('hello World');
});

module.exports.splash = splash;
