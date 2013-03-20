//game lobby

var rooms = {
  active  :{},
  waiting :[]
};

module.exports.rooms = rooms;

/*
PSEUDO PSEUDO CODE
userActivate upon pinging the entry page
  add to waiting []
  prompt user for  nickname, save to user
create a game instance with a players property
  game instances stored in active []


upon user exit call res.end --> kill connection

*/
