
//naive server

var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    lobby   = require('./lobby'),
    User    = require('./user'),
    Room    = require('./room'),
    path    = require('path'),
    uuid    = require('node-uuid');
    users   = {};

server.listen(8080);

//get request handler
app.get('/', function (req, res) {
  res.sendfile(path.resolve(__dirname + '/../client/index.html'));
});

io.sockets.on('connection', function (socket) {
  //create new user on connection - gives user socket property
  users[socket.id] = new User(socket);
  var user = users[socket.id];

//conditional to deal with new users
  //case one - new user joins existing room
  if(lobby.rooms.waiting){
    var room = lobby.rooms.waiting;
    room.user2 = user;
    lobby.rooms.active[room.roomID] = room;
    lobby.rooms.waiting = undefined;

    //assign each room's user with a room property
    room.user1.room   = room;
    room.user2.room   = room;

    //assign each room's user an 'other' property to identify other room's user
    room.user1.other  = room.user2;
    room.user2.other  = room.user1;

  //case two - else new room created for user, they are waiting
  } else {
    var room = new Room();
    room.user1 = user;
    lobby.rooms.waiting = room;
  }

  socket.on('hi', function(data){
    var user = users[socket.id];
    var room = user.room;
    console.log('user object', users);
    user.other.socket.send('sent');
  });

  socket.on('gameFull', function (data) {

  });

  //handles disconnects and subsequently deletes the user
  socket.on('disconnect', function(){
    delete users[socket];
    io.sockets.emit('user disconnected');
  })

  io.sockets.on('connection', function (socket) {

  socket.join('room');

  socket.on('playerReady', function(data) {
    //once both players ready, then emit bothready
  });

  socket.on('move', function (data) {
    socket.broadcast.to('room').emit('e', data);
  });
});
});

app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../styles'));
app.use(express.static(__dirname + '/../vendor'));
