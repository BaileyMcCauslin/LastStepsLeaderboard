// Firebase imports
const admin = require('firebase-admin');
const { onRequest } = require("firebase-functions/v1/https");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

// Initalize the admin app
initializeApp();

const db = getFirestore();


// Create a new user
exports.RegisterUser = onRequest(async (req,res) => {
    try {
        // Create the new user
        const userRecord = await admin.auth().createUser({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName
        });
        // Return sucessful operation
        return res.status(200).send({"User Created": userRecord});
    } catch(error) {
        // Return the error operation 
        return res.status(500).send({"Error Creating User": error});
    }
});

exports.GetAllLeaderboardRecords = onRequest(async (req,res) => {
    try {
        const collectionRef = await db.collection('leaderboard').get();
        const records = collectionRef.docs.map(doc => doc.data());
        return res.status(200).send({"Records": records});
    } catch(error) {
        return res.status(500).send({"Error": "Could not fetch leaderboard records"});
    }
});

exports.GetUserLeaderboardRecord = onRequest(async (req,res) => {
    try {
        const collectionRef = await db.collection('leaderboard').where(
                                      'displayname', '==', req.body.name).get();
        const record = collectionRef.docs.map(doc => doc.data());
        return res.status(200).send({"Record": record});
    } catch(error) {
        return res.status(500).send({"Error": "Cannot get user record"});
    }
});