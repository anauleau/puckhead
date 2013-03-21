//requirement declerations
var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    lobby   = require('./lobby'),
    User    = require('./user'),
    Room    = require('./room'),
    router  = require('./router');

io.sockets.on('connection', function (socket) {

  //instantiates new user on connection
  var user = new User.Instance(socket);
  lobby.rooms.waiting.push(user);
  console.log(lobby.rooms.waiting);

  //calls the nickNamer function on assignName event
  socket.on('assignName', function(socket, nickname){
    User.nickNamer(socket, nickname);
  });

  //intantiates a new room on newGame event
  socket.on('newGame', function(user1, user2){
    var game = new Room.Instance(user1, user2);
    lobby.rooms.active[game.roomID] = game;
   });

  //handles gameEnd event
  socket.on('gameEnd', function(user1, user2, roomID){
    lobby.rooms.waiting.push(user1, user2);    
    lobby.rooms.active[roomID] = null;
  });

});

server.listen(8080);

//STATIC FILE SERVING CODE
app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../styles'));
app.use(express.static(__dirname + '/../vendor'));

module.exports.app = app;


    //-> for client side:
    //user1.wantstostart = true
    //if user1.wantstostart && user2.wantstostart startgame()
    // event that triggers user moving from waiting to room
  //var user = lobby.rooms.waiting.shift();
  //lobby.rooms.[uuid].push();


