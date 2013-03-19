//requirement declerations
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    lobby = require('./lobby'),
    user = require('./user'),
    room =

io.sockets.on('connection', function (socket) {

  //instantiates new user on connection
  var user = new User.User(socket);
  lobby.rooms.waiting.push(user);

  socket.on('assignNickname', function(){

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
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/raphael.js', function (req, res) {
  res.sendfile(__dirname + '/raphael.js');
});

app.get('/tracking.js', function (req, res) {
  res.sendfile(__dirname + '/tracking.js');
});

app.get('/headtrackr.js', function (req, res) {
  res.sendfile(__dirname + '/headtrackr.js');
});

app.get('/style.css', function (req, res) {
  res.sendfile(__dirname + '/style.css');
});


// PATHS OBJ FOR FILE SERVING LOOP
// var paths = {
//   '/'             :'/index.html',
//   '/raphael.js'   :'/raphael.js',
//   '/tracking.js'  :'/tracking.js',
//   '/headtrackr.js':'/headtrackr.js',
//   '/style.css'    :'/style.css'
// };

// FILE SERVING LOOP
// for (var path in paths) {
//    (function(path){
//       app.get(path, function(request, response) {
//         response.sendfile(__dirname + paths[path]);
//     });
//   });
// }

