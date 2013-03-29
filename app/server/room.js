//defines room
var lobby = require('./lobby'),
    uuid  = require('node-uuid');

function Room(){
  this.roomID = uuid.v1();
  this.readyPlayers = [];
  this.worldState = null;
  this.score1 = null;
  this.score2 = null;
};

module.exports = Room;
