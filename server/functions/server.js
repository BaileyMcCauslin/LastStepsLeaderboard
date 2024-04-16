// Firebase imports
const admin = require("firebase-admin");
const {onRequest} = require("firebase-functions/v1/https");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

// Initalize the admin app
initializeApp();

// Initalize the firestore db
const db = getFirestore();

// Response constants
const UNSUCESSFUL_RES = 500;
const SUCESSFUL_RES = 200;

/**
 * Creates a new user
 * JSON body should send through email, password, and the display name
*/
exports.RegisterUser = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  try {
    // Create the new user
    const userRecord = await admin.auth().createUser({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
    });
    // Return sucessful operation
    return res.status(SUCESSFUL_RES).send({"User Created": userRecord});
  } catch (error) {
    // Return the error operation
    return res.status(UNSUCESSFUL_RES).send({"Error Creating User": error});
  }
});


/**
 * Gets all records in the leaderboard collection
*/
exports.GetAllLeaderboardRecords = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  try {
    const collectionRef = await db.collection("leaderboard").get();
    const records = collectionRef.docs.map((doc) => doc.data());
    return res.status(SUCESSFUL_RES).send({"Records": records});
  } catch (error) {
    return res.status(UNSUCESSFUL_RES).send(
        {"Error": "Could not fetch leaderboard records"});
  }
});


/**
 * Gets a specific record based on the username
 * JSON body should send through the display name
*/
exports.GetUserLeaderboardRecord = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    // Respond to OPTIONS request with a successful status
    res.status(SUCESSFUL_RES).send("");
    return;
  }

  try {
    const collectionRef = await db.collection("leaderboard").where(
        "name", "==", req.body.name).get();
    const record = collectionRef.docs.map((doc) => doc.data());
    return res.status(SUCESSFUL_RES).send({"Record": record});
  } catch (error) {
    console.error("Error fetching user record:", error);
    return res.status(UNSUCESSFUL_RES).send(
        {"Error": "Failed to fetch user record. Please try again later."});
  }
});

/**
 * Creates a new record for the user.
*/
exports.UploadRecord = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  const newRecord = {
    "name": req.body.name,
    "round": req.body.round,
    "endless": req.body.endless,
    "time": req.body.time,
  };

  try {
    await db.collection("leaderboard").add(newRecord);
    // Return success
    return res.status(SUCESSFUL_RES).send({"Created new user record": "OK"});
  } catch (error) {
    // Return failure
    return res.status(UNSUCESSFUL_RES).send(
        {"Error creating record": error});
  }
});
