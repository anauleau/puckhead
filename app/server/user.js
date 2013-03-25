//defines User and related functions

// possibley add nameTest

function User(socket){
  this.socket = socket;
  this.id = socket.id;
  this.nickname = undefined;
}

User.prototype.setNickname = function(nickname){
  this.nickname = nickname;
}

User.prototype.emit = function(str, func){
  this.socket.emit(str, func);
}

module.exports = User;
