window.onload = function() {

  var width = window.innerWidth;
  var height = window.innerHeight;

  var paper = new Raphael(document.getElementById('canvas_container'), width, height);

  paper.path("M"+width/2+",0L"+width/2+","+height);
  paper.rect(0, 0, width/50, height/3).attr({fill:'#999'});
  paper.rect(0, height*2/3, width/50, height/3).attr({fill:'#999'});
  paper.rect(width-width/50, 0, width/50, height/3).attr({fill:'#999'});
  paper.rect(width-width/50, height*2/3, width/50, height/3).attr({fill:'#999'});

  paper.circle(width/50, height/2, height/2);
  paper.circle(width-width/50, height/2, height/2);
  paper.circle(width/2, height/2, height/5);

  puck = paper.circle(width/2, height/2, height/25);
  puck.attr({fill: '#333'});

  puck.node.onclick = function() {
    puck.attr('cx', puck.attrs.cx - 10);
  };

  var makePaddle = function(player) {
    if (player === 1) {
      var paddle = paper.circle(height/4, height/2, height/20);
      paddle.attr({fill: '#F00'});
    } else {
      var paddle = paper.circle(width-height/4, height/2, height/20);
      paddle.attr({fill: '#00F'});
    }
    return paddle;
  };

  var paddle1 = makePaddle(1);
  var paddle2 = makePaddle(2);
 
};
