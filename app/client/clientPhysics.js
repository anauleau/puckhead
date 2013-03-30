window.onload = function() {

  // Define dimensions of objects.
  var width  = 960;
  var height = 480;
  var sizeUnit = height / 100;
  var puckRadius = 6 * sizeUnit;
  var puckX = width / 2;
  var puckY = height / 2;
  var malletRadius = 10 * sizeUnit;
  var gatesWidth = 5 * sizeUnit;
  var gatesHeight = 33 * sizeUnit;

  var drawWorld = function(){

    // Define a board dimensions and draw the board.
    paper = new Raphael(document.getElementById('canvas_container'), width, height);

    // Create gates.
    paper.rect(0, 0, gatesWidth, gatesHeight).attr({stroke: '#000', 'stroke-width': 2, fill:"180-#222:10-#555:20-#333"});
    paper.rect(0, height - gatesHeight, gatesWidth, gatesHeight).attr({stroke: '#000', 'stroke-width': 2, fill:"180-#222:10-#555:20-#333"});
    paper.rect(width - gatesWidth, 0, gatesWidth, gatesHeight).attr({stroke: '#000', 'stroke-width': 2, fill:"0-#222:10-#555:20-#333"});
    paper.rect(width - gatesWidth, height - gatesHeight, gatesWidth, gatesHeight).attr({stroke: '#000', 'stroke-width': 2, fill:"0-#222:10-#555:20-#333"});

    // Draw marking.
    paper.path("M" + width / 2 + ",0L" + width / 2 + "," + height);
    paper.circle(gatesWidth, height / 2, height / 2);
    paper.circle(width - gatesWidth, height / 2, height / 2);
    paper.circle(width / 2, height / 2, height / 5);

    score1 = paper.text(width / 2 - 4 * sizeUnit, 6 * sizeUnit, 0);
    score2 = paper.text(width / 2 + 4 * sizeUnit, 6 * sizeUnit, 0);
    score1.attr({"font-size":40, fill:"red"});
    score2.attr({"font-size":40, fill:"blue"});

    // Create the puck.
    puck = paper.circle(width / 2, height / 2, puckRadius);
    puck.attr({fill: "r(.5,.5)#555-#333:40#222:80-#333:90-#000"});

    // Create the mallets.
    var makeMallet = function(player) {
      if (player === 1) {
        var mallet = paper.circle(height / 4, height / 2, malletRadius);
        mallet.attr({stroke: "#500", fill: "r(.5,.5)#f00-#600:45-#200:50-#300:60-#200:68-#200:70-#c00:85-#600"});
      } else {
        var mallet = paper.circle(width - height / 4, height / 2, malletRadius);
        mallet.attr({stroke: "#005", fill: "r(.5,.5)#00f-#006:45-#002:50-#003:60-#002:68-#002:70-#00c:85-#006"});
      }
      return mallet;
    };

    mallet1 = makeMallet(1);
    mallet2 = makeMallet(2);

    // Draw marking.
    paper.path("M" + width / 2 + ",0L" + width / 2 + "," + height);
    paper.circle(gatesWidth, height / 2, height / 2);
    paper.circle(width - gatesWidth, height / 2, height / 2);
    paper.circle(width / 2, height / 2, height / 5);

  };

  drawWorld();

var updateBoard = function( worldState ){
    puck.attr('cx', worldState.puckX);
    puck.attr('cy', worldState.puckY);
    mallet1.attr('cx', worldState.mallet1X);
    mallet1.attr('cy', worldState.mallet1Y);
    mallet2.attr('cx', worldState.mallet2X);
    mallet2.attr('cy', worldState.mallet2Y);
    if ( worldState.score1 >= 5 ){
      score1.attr('text', 5);
      if (player === 1) {
        var message = paper.text(width / 2, height/2, 'You won!');
      } else {
        var message = paper.text(width / 2, height/2, 'You lost!');
      }
    } else {
      score1.attr('text', worldState.score1);
    }
    if ( worldState.score2 >= 5 ) {
      score1.attr('text', 5);
      if (player === 2){
        var message = paper.text(width / 2, height/2, 'You won!');
      } else {
        var message = paper.text(width / 2, height/2, 'You lost!');
      }
    } else {
      score2.attr('text', worldState.score2);
    }
  };

  socket.on('positionsUpdated', function(data){
    updateBoard(data);
  });
};
