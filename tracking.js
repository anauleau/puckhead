window.onload = function() {
  // Define dimensions of objects.
  var width  = 960;
  var height = 480;
  var sizeUnit = height/100;
  var puckRadius = 6*sizeUnit;
  var puckX = width/2;
  var puckY = height/2;
  var malletRadius = 10*sizeUnit;
  var gatesWidth = 5*sizeUnit;
  var gatesHeight = 33*sizeUnit;

  // Define a board dimensions and draw the board.
  var paper = new Raphael(document.getElementById('canvas_container'), width, height);

  // Box2D.
  var b2World = Box2D.Dynamics.b2World,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2Body = Box2D.Dynamics.b2Body,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

  var world = new b2World(new b2Vec2(0, 0), true);

  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.0;
  fixDef.restitution = 1.0;

  var bodyDef = new b2BodyDef;

  // Create walls.
  bodyDef.type = b2Body.b2_staticBody;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(width, 2);
  bodyDef.position.Set(0, -2);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set(0, height);
  world.CreateBody(bodyDef).CreateFixture(fixDef);

  // Create gates.
  paper.rect(0, 0, gatesWidth, gatesHeight).attr({fill:'#999'});
  paper.rect(0, height-gatesHeight, gatesWidth, gatesHeight).attr({fill:'#999'});
  paper.rect(width-gatesWidth, 0, gatesWidth, gatesHeight).attr({fill:'#999'});
  paper.rect(width-gatesWidth, height-gatesHeight, gatesWidth, gatesHeight).attr({fill:'#999'});

  bodyDef.type = b2Body.b2_staticBody;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(gatesWidth, gatesHeight);
  bodyDef.position.Set(0, 0);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set(0, height);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set(width, 0);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set(width, height);
  world.CreateBody(bodyDef).CreateFixture(fixDef);

  // Create the puck.
  puck = paper.circle(width/2, height/2, puckRadius);
  puck.attr({fill: '#333'});

  bodyDef.type = b2Body.b2_dynamicBody;
  fixDef.shape = new b2CircleShape;
  fixDef.shape.SetRadius(puckRadius);
  bodyDef.position.Set(puckX, puckY);
  var puckBody = world.CreateBody(bodyDef);
  puckBody.CreateFixture(fixDef);
  puckBody.SetLinearVelocity(new b2Vec2(5000, 6000));  // Temp.

  // Create the mallets.
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

  var malletFixDef = new b2FixtureDef;
  malletFixDef.density = 100.0;
  malletFixDef.friction = 0.0;
  malletFixDef.restitution = 1.0;

  bodyDef.type = b2Body.b2_dynamicBody;
  malletFixDef.shape = new b2CircleShape;
  malletFixDef.shape.SetRadius(malletRadius);
  bodyDef.position.Set(height/4, height/2);
  var mallet1Body = world.CreateBody(bodyDef);
  mallet1Body.CreateFixture(malletFixDef);
  bodyDef.position.Set(width-height/4, height/2);
  var mallet2Body = world.CreateBody(bodyDef);
  mallet2Body.CreateFixture(malletFixDef);

  // Draw marking.
  paper.path("M"+width/2+",0L"+width/2+","+height);
  paper.circle(gatesWidth, height/2, height/2);
  paper.circle(width-gatesWidth, height/2, height/2);
  paper.circle(width/2, height/2, height/5);

  var draw = function() {
    var p = puckBody.GetPosition();
    puck.attr('cx', p.x);
    puck.attr('cy', p.y);

    p = mallet1Body.GetPosition();
    mallet1.attr('cx', p.x);
    mallet1.attr('cy', p.y);

    p = mallet2Body.GetPosition();
    mallet2.attr('cx', p.x);
    mallet2.attr('cy', p.y);
  };

  var nextX;
  var nextY;

  var update = function() {

    var tempX = nextX;
    var tempY = nextY;
    var xDiff = nextX - mallet1.attrs.cx;
    var yDiff = nextY - mallet1.attrs.cy;
    mallet1.attrs.cx = tempX;
    mallet1.attr.cy = tempY;

    mallet1Body.SetLinearVelocity(new b2Vec2((xDiff / 60) * 200, (yDiff / 60) * 200));

    world.Step(1 / 60, 10, 10);
    world.ClearForces();
    draw();
  };

  document.addEventListener('facetrackingEvent', function (event) {
      nextX = (320 - event.x) * 3 - 200;
      nextY = (event.y) * 2 + 20;
   });

  window.ready = function() {
    window.setInterval(update, 1000 / 60);
  }

};
