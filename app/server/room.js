//defines room
var lobby = require('./lobby'),
    uuid  = require('node-uuid');

var Instance = function (user1, user2) {
  var room = {};
  this.users = [user1, user2],
  this.roomID = uuid.v1();
};

module.exports.Instance = Instance;
