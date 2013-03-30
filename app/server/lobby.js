//game lobby

var rooms = {
  active: {},
  privateWaiting: {}
};


//change name to better represent what this hash is storing

//just store uuid aas opposed to the entire url
var privateRoutes = {
  'http://localhost:8000/private':'1',
};

module.exports.rooms = rooms;
module.exports.privateRoutes = privateRoutes;
