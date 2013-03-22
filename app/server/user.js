//defines User and related functions

// possibley add nameTest

function User(socket){
  this.id = socket.id;
  this.nickname = undefined;
}

User.prototype.setNickname = function(nickname){
  this.nickname = nickname;
}

module.exports = User;
