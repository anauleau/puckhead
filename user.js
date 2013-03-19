// defines User
//socket refers to the object sent to the server upon initial request

//user should also have any identifying properties
var Instance = function (socket) {
  var user = {};
  this.id = socket.id;
  this.room = null;
  this.nickname = undefined;
};

module.exports.Instance = Instance;
