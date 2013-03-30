//Server

var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    lobby   = require('./lobby'),
    User    = require('./user'),
    Room    = require('./room'),
    path    = require('path'),
    uuid    = require('node-uuid'),
    physics = require('./serverPhysics'),
    u       = require('underscore'),
    users   = {};

server.listen(8000);

app.get('/', function (req, res) {
  res.sendfile(path.resolve(__dirname + '/../client/splashPage.html'));
});

app.get('/public', function (req, res) {
  res.sendfile(path.resolve(__dirname + '/../client/index.html'));
});

//-> code for the uuid handler
// var urlPrefix = 'http://localhost:8000/private/'
// privateRoutes[uuid] = urlPrefix + uuid;

u.each(lobby.privateRoutes, function (url, id, obj) {
  app.get('/private/' + id , function (req, res) {
    res.sendfile(path.resolve(__dirname + '/../client/index.html'));
  });
});

io.sockets.on('connection', function (socket) {

  var url,
      user,
      room;

  socket.on('origin', function (data) {
    url = data.url;
    socket.emit('ready', {url: data.url});
  });

  socket.on('start', function (data) {

    users[socket.id]  = new User(socket),
    user              = users[socket.id],
    user.url          = url;

    if (u.contains(lobby.privateRoutes, user.url)) {
      if (lobby.rooms.privateWaiting[user.url]){
        room              = lobby.rooms.privateWaiting[user.url];
        room.user2        = user;
        lobby.rooms.active[room.roomID] = room;
        room.user1.room   = room.roomID;
        room.user2.room   = room.roomID;
        room.user1.other  = room.user2.id;
        room.user2.other  = room.user1.id;
        lobby.rooms.privateWaiting[room.roomID] = undefined;
      } else {
        room                = new Room();
        user.room           = room;
        room.roomID         = user.url;
        room.user1          = user;
        room.user1.room     = room.roomID;
        lobby.rooms.privateWaiting[room.roomID] = room;
      }
    } else {
      if (lobby.rooms.waiting) {
        room              = lobby.rooms.waiting;
        room.user2        = user;
        lobby.rooms.active[room.roomID] = room;
        room.user1.room   = room.roomID;
        room.user2.room   = room.roomID;
        room.user1.other  = room.user2.id;
        room.user2.other  = room.user1.id;
        lobby.rooms.waiting = undefined;
      } else {
        room                = new Room();
        user.room           = room;
        room.user1          = user;
        room.user1.room     = room.roomID;
        lobby.rooms.waiting = room;
      }
    }
    user.emit('roomEcho', {room: user.room});
  });

  var setUser = function (user) {
    var user = user;
    var func = function (){
          var worldState = physics.watchWorldState(user.room);
          user.emit('positionsUpdated', worldState);
          users[user.other].emit('positionsUpdated', worldState);
        };

    return func;
  };

  socket.on('playerReady', function (data) {
    var thisRoom = lobby.rooms.active[user.room] || lobby.rooms.waiting;
    thisRoom.readyPlayers.push(data.player);
    console.log('READY PLAYERS', thisRoom.readyPlayers);
    if (thisRoom.readyPlayers.length === 2) {
      //emits both players ready to each player from the other
      user.emit('bothPlayersReady');
      users[user.other].emit('bothPlayersReady');
      thisRoom.world = physics.createWorld(user.room, function () {
        physics.start(user.room);
        setInterval(setUser(user), 20);
      });
    };
  });

  socket.on('move', function (data) {
    physics.updateMallet(data, user.room);
  });

  //handles disconnects and subsequently deletes the user
  socket.on('disconnect', function () {
    delete users[socket];
    io.sockets.emit('user disconnected');
  });
});

//serves static files
app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../styles'));
app.use(express.static(__dirname + '/../vendor'));

