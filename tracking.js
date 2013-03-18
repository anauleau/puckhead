var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 500;
canvas.height =500;
var color = '#333';

if (context) {
    context.fillStyle = "rgb(200,0,0)";
    context.fillRect(0, 0, 500, 250);
    document.body.appendChild(canvas);
}

var hero = {
  speed: 256, // movement in pixels per second
  x: canvas.width / 2,
  y: canvas.height / 2
};
