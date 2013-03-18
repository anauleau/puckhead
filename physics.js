var width = window.innerWidth;
var height = window.innerHeight;

var puckVelocity = 0.1;
var puckAngle = 0.785398163;

var paddleRadius = height/20;
var paddleVelocity = 0;
var paddleAngle = 0;
var oldPaddleX = height/4;
var oldPaddleY = height/2;

var detectCollisions = function(){
	return false;
};

var watchPaddle = function(){
	var chandePaddleX = ( paddle1.attrs.cx - oldPaddleX )/paddleRadius;
	var changePaddleY = ( paddle1.attrs.cy - oldPaddleY )/paddleRadius; 
	paddleAngle = Math.atan2(changePaddleX, changePaddleY);
	paddleVelocity = Math.sqrt( (changePaddleX * changePaddleX) / (changePaddleY * changePaddleY) );
};

var movePuck = function(){
	if (puckVelocity>0){
		puck.attr('cx', puck.attrs.cx + puckVelocity*Math.sin(puckAngle));
		puckVelocity -= 0.0001;
	}
};

setInterval(function(){
	watchPaddle();
	if (detectCollisions()){
		console.log('Collision!');
	};
	movePuck();
},20);



