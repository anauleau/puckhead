var Box2D = require('./box2dnodeold.js');
var lobby = require('./lobby.js')

var worldHash = {};

  // Define dimensions of objects.
  var width  = 960;
  var height = 480;
  var sizeUnit = height / 100;
  var puckRadius = 6 * sizeUnit;
  var malletRadius = 10 * sizeUnit;
  var gatesWidth = 5 * sizeUnit;
  var gatesHeight = 33 * sizeUnit;
  var worldCoeff = 0.01;  // Try scaling the world by this factor.

var createWorld = function(roomId, callback) {
  var thisWorld = {};
  thisWorld.puckX = width / 2;
  thisWorld.puckY = height / 2;
  thisWorld.score1 = 0;
  thisWorld.score2 = 0;

  b2World = Box2D.Dynamics.b2World,
  b2Vec2 = Box2D.Common.Math.b2Vec2,
  b2BodyDef = Box2D.Dynamics.b2BodyDef,
  b2Body = Box2D.Dynamics.b2Body,
  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
  b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
  b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

  world = new b2World(new b2Vec2(0, 0), true);

  thisWorld.world = world;

  fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.0;
  fixDef.restitution = 1.0;

  bodyDef = new b2BodyDef;

  // Create walls.
  bodyDef.type = b2Body.b2_staticBody;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox( width * worldCoeff, 2 * worldCoeff );
  bodyDef.position.Set( 0, -2 * worldCoeff );
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set( 0, height * worldCoeff );
  world.CreateBody(bodyDef).CreateFixture(fixDef);

  bodyDef.type = b2Body.b2_staticBody;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox( gatesWidth * worldCoeff, gatesHeight * worldCoeff );
  bodyDef.position.Set(0, 0);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set( 0, height * worldCoeff );
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set( width * worldCoeff, 0 );
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set( width * worldCoeff, height * worldCoeff );
  world.CreateBody(bodyDef).CreateFixture(fixDef);

  //creates puck
  bodyDef.type = b2Body.b2_dynamicBody;
  fixDef.shape = new b2CircleShape;
  fixDef.shape.SetRadius( puckRadius * worldCoeff );
  bodyDef.position.Set( thisWorld.puckX * worldCoeff, thisWorld.puckY * worldCoeff );
  thisWorld.puckBody = world.CreateBody(bodyDef);
  thisWorld.puckBody.CreateFixture(fixDef);
  thisWorld.puckBody.SetLinearVelocity( new b2Vec2(4, 2) );  // Temp.

  //creates mallet
  malletFixDef = new b2FixtureDef;
  malletFixDef.density = 100.0;
  malletFixDef.friction = 0.0;
  malletFixDef.restitution = 0.0;

  bodyDef.type = b2Body.b2_dynamicBody;
  malletFixDef.shape = new b2CircleShape;
  malletFixDef.shape.SetRadius( malletRadius * worldCoeff );
  bodyDef.position.Set( height / 4 * worldCoeff, height / 2 * worldCoeff );
  thisWorld.mallet1Body = world.CreateBody(bodyDef);
  thisWorld.mallet1Body.CreateFixture(malletFixDef);
  bodyDef.position.Set( (width - height / 4) * worldCoeff, height / 2 * worldCoeff );
  thisWorld.mallet2Body = world.CreateBody(bodyDef);
  thisWorld.mallet2Body.CreateFixture(malletFixDef);

  worldHash[roomId] = thisWorld;
  callback();
};

//takes new x and y, moves the mallet toward that position at all times.
exports.updateMallet = function( malletData, roomId ) {
  if (malletData.player === 1){
    var mallet1YDiff = (malletData.y * worldCoeff) - worldHash[roomId].mallet1Body.GetPosition().y;
    var mallet1XDiff = (malletData.x * worldCoeff) - worldHash[roomId].mallet1Body.GetPosition().x;
    worldHash[roomId].mallet1Body.SetLinearVelocity(new b2Vec2((mallet1XDiff / 60) * 500, (mallet1YDiff / 60) * 500));
  } else {
    var mallet2XDiff = (malletData.x * worldCoeff) - worldHash[roomId].mallet2Body.GetPosition().x;
    var mallet2YDiff = (malletData.y * worldCoeff) - worldHash[roomId].mallet2Body.GetPosition().y;
    worldHash[roomId].mallet2Body.SetLinearVelocity(new b2Vec2((mallet2XDiff / 60) * 500, (mallet2YDiff / 60) * 500));
  }
};

var updateScore = function(roomId) {
  if ( lobby.rooms.active[roomId].score1 >= 5 || lobby.rooms.active[roomId].score2 >= 5 ){
    stop();
  } else if ( worldHash[roomId].puckBody.GetPosition().x < gatesWidth * worldCoeff ){
    lobby.rooms.active[roomId].score2++;
    createWorld(roomId, function(){});
  } else if ( worldHash[roomId].puckBody.GetPosition().x > (width-gatesWidth) * worldCoeff ) {
    lobby.rooms.active[roomId].score1++;
    createWorld(roomId, function(){});
  }
};

var updatePuck = function(roomId) {
  worldHash[roomId].puckBody.SetLinearVelocity(new b2Vec2(worldHash[roomId].puckBody.m_linearVelocity.x * 0.995, worldHash[roomId].puckBody.m_linearVelocity.y * 0.995));
  if ( worldHash[roomId].puckBody.m_linearVelocity.y <= 0.1 ){
    if ( worldHash[roomId].puckBody.GetPosition().y <= puckRadius * 1.1 * worldCoeff ){
      worldHash[roomId].puckBody.SetLinearVelocity( new b2Vec2( worldHash[roomId].puckBody.m_linearVelocity.x, 0.3 ) );
    }
    if ( worldHash[roomId].puckBody.GetPosition().y >= (height - puckRadius * 1.1) * worldCoeff ){
      worldHash[roomId].puckBody.SetLinearVelocity( new b2Vec2( worldHash[roomId].puckBody.m_linearVelocity.x, - 0.3) );
    }
  }
  if ( worldHash[roomId].puckBody.m_linearVelocity.x <= 0.1 ){
    if ( worldHash[roomId].puckBody.GetPosition().x <= (gatesWidth + puckRadius) * 1.1 * worldCoeff ){
      worldHash[roomId].puckBody.SetLinearVelocity( new b2Vec2( 0.3, worldHash[roomId].puckBody.m_linearVelocity.y ) );
    }
    if ( worldHash[roomId].puckBody.GetPosition().x >= (width - gatesWidth - puckRadius * 1.1) * worldCoeff ){
      worldHash[roomId].puckBody.SetLinearVelocity( new b2Vec2( -0.3, worldHash[roomId].puckBody.m_linearVelocity.y ) );
    }
  }
};

 var updateFunc = function(roomId) {
    var roomId = roomId;
    var func = function() {
      updateScore(roomId);
      worldHash[roomId].world.Step(1 / 60, 10, 10);
      worldHash[roomId].world.ClearForces();
    };

    return func;
  };

exports.watchWorldState = function(roomId) {
  var newWorldState = {};
  newWorldState.mallet1X = worldHash[roomId].mallet1Body.GetPosition().x / worldCoeff;
  newWorldState.mallet1Y = worldHash[roomId].mallet1Body.GetPosition().y / worldCoeff;
  newWorldState.mallet2X = worldHash[roomId].mallet2Body.GetPosition().x / worldCoeff;
  newWorldState.mallet2Y = worldHash[roomId].mallet2Body.GetPosition().y / worldCoeff;
  newWorldState.puckX = worldHash[roomId].puckBody.GetPosition().x / worldCoeff;
  newWorldState.puckY = worldHash[roomId].puckBody.GetPosition().y / worldCoeff;
  newWorldState.score1 = lobby.rooms.active[roomId].score1;
  newWorldState.score2 = lobby.rooms.active[roomId].score2;
  return newWorldState;
};

exports.start = function(roomId) {
  myTimer = setInterval(updateFunc(roomId), 1000 / 60);
};

var stop = function() {
  clearInterval(myTimer);
  myTimer = null;
};

exports.createWorld = createWorld;
