// Get functions from corisponding files
// const gameHandler = require("./game-handler");
const server = require("./server");

exports.RegisterUser = server.RegisterUser;
exports.AllRecords = server.GetAllLeaderboardRecords;
exports.GetUserRecord = server.GetUserLeaderboardRecord;
exports.CreateRecord = server.UploadRecord;