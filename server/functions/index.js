// Get functions from corisponding files
// const gameHandler = require("./game-handler");
const leaderboardHandler = require("./leaderboard-handler");

exports.RegisterUser = leaderboardHandler.RegisterUser;
exports.AllRecords = leaderboardHandler.GetAllLeaderboardRecords;
exports.GetUserRecord = leaderboardHandler.GetUserLeaderboardRecord;
