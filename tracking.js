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

  var puckXVelocity = -25;
  var puckYVelocity = 10;

  // var paddleRadius = height/20;
  var paddleXVelocity = 0;
  var paddleYVelocity = 0;
  var oldPaddleX = height/4;
  var oldPaddleY = height/2;

  var detectCollisions = function(){
    return false;
  };

  var watchPaddle = function(){
    // paddleXVelocity =  paddle1.attrs.cx - oldPaddleX;
    // changePaddleY = paddle1.attrs.cy - oldPaddleY; 
    var xMinus = Math.random();
    var yMinus = Math.random();
    paddleXVelocity = Math.random() * 300;
    paddleYVelocity = Math.random() * 300;
    if ( (xMinus>0.5 || ((paddle1.attrs.cx + paddleXVelocity)>width) ) && (paddle1.attrs.cx - paddleXVelocity>0) ) {
      paddleXVelocity = paddleXVelocity*(-1);
    }
    if ( (yMinus>0.5 || ((paddle1.attrs.cy + paddleYVelocity)>height) ) && (paddle1.attrs.cy - paddleYVelocity>0) ){
      paddleYVelocity = paddleYVelocity*(-1);
    }
    paddle1.attr('cx', paddle1.attrs.cx + paddleXVelocity );
    paddle1.attr('cy', paddle1.attrs.cy + paddleYVelocity );
  };

  var movePuck = function(){
    puck.attr('cx', puck.attrs.cx + puckXVelocity );
    puck.attr('cy', puck.attrs.cy + puckYVelocity );
    // console.log('x: '+puck.attrs.cx+', y: '+puck.attrs.cy);
    puckXVelocity *= 0.95;
    puckYVelocity *= 0.95;
  };

  var detectCollisions = function(){

    var collisionTypes = [];

    var detectCollisionsWithWalls = function (){
      if (puck.attr('cx') <= height/25 + width/50 && ) {
        // puck.attr('cx', puck.attrs.cx + 50);
      }
      else if (puck.attr('cx') >= width - height/25){
        puck.attr('cx', puck.attrs.cx - 50);
      }
      else if (puck.attr('cy') <= height/24){
        puck.attr('cy', puck.attrs.cy + 100);
      }
      else if (puck.attr('cy') >= height * (24/25)){
        puck.attr('cy', puck.attrs.cy - 50);
      }
    };

    var detectCollisionsWithPaddles = function() {
      var xDiff = (puck.attr('cx') - paddle1.attr('cx'));
      var yDiff = (puck.attr('cy') - paddle1.attr('cy'));
      var xDiffSquared = Math.pow(xDiff, 2);
      var yDiffSquared = Math.pow(yDiff, 2);
      var distance = Math.sqrt(xDiffSquared + yDiffSquared);
      if(distance < ((height/20) + (height/25))){
        console.log("No touching!");
      }
    };

    return collisionType;

  };
   



  setInterval(function(){
    // watchPaddle();
    if (detectCollisions()){
      console.log('Collision!');
    };
    if ( Math.abs(puckXVelocity) > 0.01 || Math.abs(puckYVelocity) > 0.01 ){
      movePuck();
    }
  },20);

  setInterval(function(){
    watchPaddle();
  },100);
};
