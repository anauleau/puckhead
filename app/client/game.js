$('body').css('background', 'white');
$(document).ready(function(){
  var height = window.innerHeight;
  var width = window.innerWidth;
  if ( height >= 730 ){
    $('.overlay').css( 'top', height/3 + 'px');
    $('#inputVideo').css( 'top', height/3 + 'px');
    $('.ready').css('top', height/3 + 215 + 'px');
    $('#canvas_container').css( 'top', height * 2 / 3 + 240 + 'px');
  } else {
    if ( width > 1620 ){
      $('.overlay').css( {'left': ((width - 960)/2 - 320)/2 + 'px', top: '10px'} );
      $('#inputVideo').css( {'left': ((width - 960)/2 - 320)/2 + 'px', top: '10px'} );
      $('.ready').css( {'left': ((width - 960)/2 - 320)/2 + 'px', top: '10px'} );
      $('#canvas_container').css( {'left': (width - 960)/2 + 'px', top: '10px'} );
    } else {
      $('.overlay').css( {'left': '10px', top: '10px'} );
      $('#inputVideo').css( {'left': '10px', top: '10px'} );
      $('.ready').css( {'left': '10px', top: '260px'} );
      $('#canvas_container').css( {'left': '340px', top: '10px'} );
    }
  }
});

var url = document.URL;
var socket = io.connect(); // TIP: .connect with no args does auto-discovery
  socket.on('connect', function () { // TIP: you can avoid listening on `connect` and listen on events directly too!
    socket.emit('origin', {url: url});
});

socket.on('roomEcho', function (data) {
  console.log(data);
   $('.playerId').append('<h6>You are in ' + data.room + '.</h6>');
});

socket.on('ready', function (data) {
  socket.emit('start', {url:data});
});

var begin = false;

var videoInput = document.getElementById('inputVideo');
var canvasInput = document.getElementById('inputCanvas');

var htracker = new headtrackr.Tracker();
htracker.init(videoInput, canvasInput);
htracker.start();

var player;

  socket.on('bothPlayersReady', function() {
    begin = true;
  });

  socket.on('assignPlayerNumber', function(data) {
    player = data.player;
    var colour;
    if (player === 1) {
      colour = 'red';
    } else {
      colour = 'blue';
    }
    $('.playerId').append('<h2>You are  ' + colour + '.</h2>');
  });

$('.ready').click(function (e) {

  $('.overlay').remove();
  $('.ready').hide();
  socket.emit('playerReady', {player: player});

  document.addEventListener('facetrackingEvent', function (event) {
    var position = {};
    if (player === 1) {
      position.player = 1;
      position.x = (320 - event.x) * 3 - 300;
      position.y = (event.y) * 2;
    } else {
      position.player = 2;
      position.x = (320 - event.x) * 3 + 300;
      position.y = (event.y) * 2;
    }
    if (begin) {
      socket.emit('move', position);
    }
  });

});