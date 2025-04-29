// init.js (MongoDB Initialization Script)
db.createCollection('players');
db.players.insertOne({
  username: "admin",
  email: "admin@battlearena.com",
  xp: 1000,
  wins: 0,
  losses: 0,
  role: "admin"
});

db.createCollection('matches');
db.createCollection('leaderboards');
