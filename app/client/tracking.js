window.onload = function() {
  var width = 960;
  var height = 480;

  var paper = new Raphael(document.getElementById('canvas_container'), width, height);

  paper.path("M" + width / 2 + ",0L" + width / 2 + "," + height);
  paper.rect(0, 0, width / 50, height / 3).attr({fill:'#999'});
  paper.rect(0, height * 2 / 3, width / 50, height / 3).attr({fill:'#999'});
  paper.rect(width - width / 50, 0, width / 50, height / 3).attr({fill:'#999'});
  paper.rect(width - width / 50, height * 2 / 3, width / 50, height / 3).attr({fill:'#999'});

  paper.circle(width / 50, height / 2, height / 2);
  paper.circle(width - width / 50, height / 2, height / 2);
  paper.circle(width / 2, height / 2, height / 5);

  puck = paper.circle(width / 2, height / 2, height / 25);
  puck.attr({fill: '#333'});

  var makePaddle = function(player) {
    if (player === 1) {
      var paddle = paper.circle(height / 4, height / 2, height / 20);
      paddle.attr({fill: '#F00'});
    } else if (player === 2) {
      var paddle = paper.circle(width - height / 4, height / 2, height / 20);
      paddle.attr({fill: '#00F'});
    }

    return paddle;
  };

  var paddle1 = makePaddle(1);
  var paddle2 = makePaddle(2);

  document.addEventListener('facetrackingEvent', function (event) {
    if (event.x * 3 - 250 < 480 && event.x * 3 - 250 > 0) {
      paddle1.animate({cx: event.x * 3 - 260, cy: event.y * 2 - 50}, 10);
    }
    if (event.x * 3 + 250 > 480 && event.x * 3 + 250 < 960) {
      paddle2.animate({cx: event.x * 3 + 260, cy: event.y * 2 - 50}, 10);
    }
  });

};

// width = 960
// input.max = 320, min = 0;


// x  = input * 3 - 250

// when input 150 x = 250

// when input = 50 x = -150

