//defines room
var lobby = require('./lobby'),
    uuid  = require('node-uuid');

function Room(user1, user2) {
  this.user1 = user1;
  this.user2 = user2;
  this.roomID = uuid.v1();
};

module.exports.Room = Room;
