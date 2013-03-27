//server

var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    lobby   = require('./lobby'),
    User    = require('./user'),
    Room    = require('./room'),
    path    = require('path'),
    uuid    = require('node-uuid');
    physics = require('./serverPhysics');
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
  if (lobby.rooms.waiting) {
    var room = lobby.rooms.waiting;
    room.user2 = user;
    lobby.rooms.active[room.roomID] = room;

    //assign each room's user with a room property
    room.user1.room   = room.roomID;
    room.user2.room   = room.roomID;

    //assign each room's user an 'other' property to identify other room's user
    room.user1.other  = room.user2.id;
    room.user2.other  = room.user1.id;

    //sets waitng to undefined
    lobby.rooms.waiting = undefined;

  //case two - else new room created for user, they are waiting
  } else {
    var room = new Room();
    room.user1 = user;
    room.user1.room = room.roomID;
    lobby.rooms.waiting = room;
  }

  socket.on('hi', function(data) {
    console.log(user);
    user.emit('hello', {room: user.room});
  });

  socket.on('playerReady', function(data){
    var thisRoom = lobby.rooms.active[user.room] || lobby.rooms.waiting;
    thisRoom.readyPlayers.push(data.player);

    if (thisRoom.readyPlayers.length === 2) {

      //emits both players ready to each player from the other
      user.emit('bothPlayersReady');
      users[user.other].emit('bothPlayersReady');

      //creates new physics environment
      physics.createWorld(function(){

        //starts physics engine
        physics.start();
        setInterval(function(){

          //observes new world state
          var worldState = physics.watchWorldState();

          //emits both players updated position to each player from the other
          user.emit('positionsUpdated', worldState);
          users[user.other].emit('positionsUpdated', worldState);
        }, 20);
      });
    };
  });

  socket.on('move', function (data) {
    physics.updateMallet(data);
  });

  //handles disconnects and subsequently deletes the user
  socket.on('disconnect', function(){
    delete users[socket];
    io.sockets.emit('user disconnected');
  });
});

app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../styles'));
app.use(express.static(__dirname + '/../vendor'));
