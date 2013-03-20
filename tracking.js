window.onload = function() {

  // Define a board dimensions and draw the board.

  if ( window.innerWidth > window.innerHeight*2 ){
    var width = window.innerHeight*2;
    var height = window.innerHeight;
  } else {
    var width = window.innerWidth;
    var height = window.innerWidth/2;
  }

  var sizeUnit = height/100;

  var paper = new Raphael(document.getElementById('canvas_container'), width, height);

  // Drow gates and marking.

  var gatesWidth = 5*sizeUnit;
  var gatesHeight = 33*sizeUnit;

  paper.path("M"+width/2+",0L"+width/2+","+height);
  paper.rect(0, 0, gatesWidth, gatesHeight).attr({fill:'#999'});
  paper.rect(0, height-gatesHeight, gatesWidth, gatesHeight).attr({fill:'#999'});
  paper.rect(width-gatesWidth, 0, gatesWidth, gatesHeight).attr({fill:'#999'});
  paper.rect(width-gatesWidth, height-gatesHeight, gatesWidth, gatesHeight).attr({fill:'#999'});

  paper.circle(gatesWidth, height/2, height/2);
  paper.circle(width-gatesWidth, height/2, height/2);
  paper.circle(width/2, height/2, height/5);

  // Draw puck and mallets.

  var malletRadius = 10*sizeUnit;
  var puckRadius = 6*sizeUnit;

  puck = paper.circle(width/2, height/2, puckRadius);
  puck.attr({fill: '#333'});

  var makeMallet = function(player) {
    if (player === 1) {
      var mallet = paper.circle(height/4, height/2, malletRadius);
      mallet.attr({fill: '#F00'});
    } else {
      var mallet = paper.circle(width-height/4, height/2, malletRadius);
      mallet.attr({fill: '#00F'});
    }
    return mallet;
  };

  var mallet1 = makeMallet(1);
  var mallet2 = makeMallet(2);

  var puckXVelocity = -2.5*sizeUnit;
  var puckYVelocity = -0.4*sizeUnit;

  var malletXVelocity = 0;
  var malletYVelocity = 0;
  var oldMalletX = height/4;
  var oldMalletY = height/2;

  var malletStepsFrequency = 1;

  var watchMallet = function(){
    malletXVelocity =  (mallet1.attrs.cx - oldMalletX)/malletStepsFrequency;
    malletYVelocity = (mallet1.attrs.cy - oldMalletY)/malletStepsFrequency; 
  };

  var moveMallet = function(){
    var xMinus = Math.random();
    var yMinus = Math.random();
    malletXVelocity = Math.random()*sizeUnit;
    malletYVelocity = Math.random()*sizeUnit;
    if ( (xMinus>0.5 || ((mallet1.attrs.cx + malletXVelocity)>width) ) && (mallet1.attrs.cx - malletXVelocity>0) ) {
      malletXVelocity = malletXVelocity*(-1);
    }
    if ( (yMinus>0.5 || ((mallet1.attrs.cy + malletYVelocity)>height) ) && (mallet1.attrs.cy - malletYVelocity>0) ){
      malletYVelocity = malletYVelocity*(-1);
    }
    mallet1.attr('cx', mallet1.attrs.cx + malletXVelocity );
    mallet1.attr('cy', mallet1.attrs.cy + malletYVelocity );
  };

  var movePuck = function(){
    puck.attr('cx', puck.attrs.cx + puckXVelocity );
    puck.attr('cy', puck.attrs.cy + puckYVelocity );
    // console.log('x: '+puck.attrs.cx+', y: '+puck.attrs.cy);
    puckXVelocity *= 0.99;
    puckYVelocity *= 0.99;
  };

  var detectCollisionsWithWalls = function (){
    var collision = false;
    if ( (puck.attrs.cx <= (puckRadius + gatesWidth)) && (puck.attrs.cy <= gatesHeight || puck.attrs.cy >= height-gatesHeight ) ) {
      collision = true;
      puck.attrs.cx = puckRadius + gatesWidth;
      puckXVelocity = (-1)*puckXVelocity;
    }
    if ( (puck.attrs.cx >= (width - puckRadius - gatesWidth)) && (puck.attrs.cy <= gatesHeight || puck.attrs.cy >= height-gatesHeight ) ) {
      collision = true;
      puck.attrs.cx = width - puckRadius - gatesWidth;
      puckXVelocity = (-1)*puckXVelocity;
    }
    if (puck.attrs.cy <= puckRadius+2){
      collision = true;
      puck.attrs.cy = puckRadius;
      puckYVelocity = (-1)*puckYVelocity;
    }
    if (puck.attrs.cy >= height-puckRadius){
      collision = true;
      puck.attrs.cy = height - puckRadius;
      puckYVelocity = (-1)*puckYVelocity;
    }
    return collision;
  };

  var detectCollisionsWithGoalPosts = function(){
    if  ( ( (puckRadius <= puck.attrs.cx) && (puck.attrs.cx <= (puckRadius + gatesWidth) ) ) && (puck.attrs.cy <= gatesHeight+puckRadius) 
          || ( (puckRadius <= puck.attrs.cx && puck.attrs.cx <= (puckRadius + gatesWidth)) && (puck.attrs.cy >= height-gatesHeight-puckRadius) ) 
    ){
      puck.attrs.cy = gatesHeight + puckRadius;
      puckYVelocity = (-1)*puckYVelocity;
    }
    if ( ( (width-puckRadius-gatesWidth <= puck.attrs.cx && puck.attrs.cx <= width-puckRadius ) && (puck.attrs.cy <= gatesHeight+puckRadius) )
          || ( (width-puckRadius-gatesWidth <= puck.attrs.cx && puck.attrs.cx <= width-puckRadius ) && (puck.attrs.cy >= height-gatesHeight-puckRadius) )
    ){
      puck.attrs.cy = height - gatesHeight - puckRadius;
      puckYVelocity = (-1)*puckYVelocity;
    }
  };

  var vectorLen = function(x, y) {
    return Math.sqrt(x*x + y*y);
  };

  var detectCollisionsWithMallets = function() {
    var xDiff = (puck.attr('cx') - mallet1.attr('cx'));
    var yDiff = (puck.attr('cy') - mallet1.attr('cy'));
    var distance = vectorLen(xDiff, yDiff);
    if(distance <= (malletRadius + puckRadius)){
      var normalX = xDiff / distance
      var normalY = yDiff / distance
      var dotProduct = normalX*puckXVelocity + normalY*puckYVelocity;
      var doubleX = -2*dotProduct*normalX;
      var doubleY = -2*dotProduct*normalY;
      var malletVelocity = vectorLen(malletXVelocity, malletYVelocity);
      puckXVelocity += doubleX + normalX*malletVelocity;
      puckYVelocity += doubleY + normalY*malletVelocity;
    }
  };

  setInterval(function(){
    if ( !detectCollisionsWithWalls() ){
      detectCollisionsWithGoalPosts();
    }
    detectCollisionsWithMallets();
    if ( Math.abs(puckXVelocity) > 0.01 || Math.abs(puckYVelocity) > 0.01 ){
      movePuck();
    }
  },1);

  setInterval(function(){
    //moveMallet();
    watchMallet();
  }, malletStepsFrequency);

};


