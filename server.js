var app = require('express')(),
    server = require('http').createServer(app),
    fs = require('fs'),
    io = require('socket.io').listen(server),
    lobby = require('./lobby');

io.sockets.on('connection', function (socket) {
  socket.on('my other event', function (data) {
    console.log(data);
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
