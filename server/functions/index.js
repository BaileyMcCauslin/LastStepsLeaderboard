// Get functions from corisponding files
const server = require("./server");

exports.RegisterUser = server.RegisterUser;
exports.AllRecords = server.GetAllLeaderboardRecords;
exports.GetUserRecord = server.GetUserLeaderboardRecord;
exports.AddRecord = server.UploadRecord;
