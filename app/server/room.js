//defines room
var lobby = require('./lobby'),
    uuid  = require('node-uuid');

function Room(){
  this.roomID = uuid.v1();
}

module.exports = Room;
