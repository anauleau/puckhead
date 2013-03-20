//requirement declerations
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    lobby = require('./lobby'),
    User = require('./user'),
    Room = require('./room');

io.sockets.on('connection', function (socket) {

  //instantiates new user on connection
  var user = new User.Instance(socket);
  lobby.rooms.waiting.push(user);

  //calls the nickNamer function on assignName event
  socket.on('assignName', function(socket, nickname){
    User.nickNamer(socket, nickname);
  });

  
  socket.on('newGame', function(user1, user2){
   });

  socket.on('gameEnd', function(user1, user2){

  });

  socket.on('sessionEnd', function(user1, user2){

  });

});

server.listen(8080);

//STATIC FILE SERVING CODE
 // request -> "/"
app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../styles'));
app.use(express.static(__dirname + '/../vendor'));
