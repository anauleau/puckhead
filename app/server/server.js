//requirement declerations
var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    lobby   = require('./lobby'),
    User    = require('./user'),
    Room    = require('./room');

io.sockets.on('connection', function(socket) {

  //instantiates new user on connection
  var user = new User(socket);
  lobby.rooms.waiting[socket.id] = user;
  console.log(user);
  console.log(lobby.rooms.waiting);

  //calls the nickNamer function on assignName event
  socket.on('assignName', function(socket, nickname) {
    var user = lobby.rooms.waiting[socket.id];
    user.setNickname(nickname);
  });

  //intantiates a new room on newGame event
  socket.on('newGame', function(user1, user2){
    var game = new Room.Instance(user1, user2);
    lobby.rooms.active[game.roomID] = game;
   });

  //handles gameEnd event
  socket.on('gameEnd', function(user1, user2, roomID) {
    lobby.rooms.waiting.push(user1, user2);    
    lobby.rooms.active[roomID] = null;
  });

});

server.listen(8080);

//STATIC FILE SERVING CODE

app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../styles'));
app.use(express.static(__dirname + '/../vendor'));
