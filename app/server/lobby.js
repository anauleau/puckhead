//game lobby

var rooms = {
  active: {},
  privateWaiting: {}
};


//change name to better represent what this hash is storing
var privateLobby = {
  'http://localhost:8000/private':'http://localhost:8000/private'
};

module.exports.rooms = rooms;
module.exports.privateLobby = privateLobby;
