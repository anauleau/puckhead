window.onload = function() {
  var width = 1000;
  var height = 480;

  var paper = new Raphael(document.getElementById('canvas_container'), width, height);

  paper.path("M"+ width /2 + ",0L" + width / 2 + "," + height);
  paper.rect(0, 0, width / 50, height / 3).attr({fill:'#999'});
  paper.rect(0, height * 2 / 3, width / 50, height / 3).attr({fill:'#999'});
  paper.rect(width - width / 50, 0, width / 50, height / 3).attr({fill:'#999'});
  paper.rect(width - width/ 50, height * 2 / 3, width / 50, height / 3).attr({fill:'#999'});

  paper.circle(width / 50, height / 2, height / 2);
  paper.circle(width - width / 50, height / 2, height / 2);
  paper.circle(width / 2, height / 2, height / 5);

  puck = paper.circle(width / 2, height / 2, height / 25);
  puck.attr({fill: '#333'});

  puck.node.onclick = function() {
    puck.animate({cx:  puck.attrs.cx - 50}, 100);
  };

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

  //find difference in position between this position and last position.
  //make some kind of natural smoothing/animation from point to point.

  var diff = function() {
    diff = previousValue - newValue;
  };

  document.addEventListener('facetrackingEvent', function (event) {
    console.log(event);
    paddle1.animate({cx: event.x * 3 - 150, cy: event.y * 2}, 20);
  });

};
