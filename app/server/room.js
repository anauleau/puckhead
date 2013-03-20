//defines room or gameBoard
var lobby = require('./lobby');

var Instance = function (user1, user2) {
  var room = {};
  this.users = [user1, user2],
  this.roomID = 'TO CHANGE';
};

module.exports.Instance = Instance;
