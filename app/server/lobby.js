//game lobby

var rooms = {
  active: {},
  privateWaiting: {}
};

//change name to better represent what this hash is storing

//just store uuid as opposed to the entire url
var privateRoutes = {};

module.exports.rooms = rooms;
module.exports.privateRoutes = privateRoutes;
