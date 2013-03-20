//defines User and related functions

// possibley add nameTest

var Instance = function (socket) {
  var user = {};
  this.id = socket.id;
  this.nickname = undefined;
};

var nickNamer = function (socket, nickname) {
  this.nickname = nickname;
};

module.exports.Instance = Instance;
module.exports.nickNamer = nickNamer;
