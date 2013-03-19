var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(8080);

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

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});