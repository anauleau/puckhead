//defines room
var lobby = require('./lobby'),
    uuid  = require('node-uuid');

function Room(){
  this.roomID = uuid.v1();
  this.readyPlayers = [];
}

module.exports = Room;
