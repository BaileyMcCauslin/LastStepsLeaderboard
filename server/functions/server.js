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

class Server {
    constructor(db) {
        this.db = db;
    }
    // Set the response headers to avoid cors
    setResponseHeaders(res) {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "GET, POST");
        res.set("Access-Control-Allow-Headers", "Content-Type");
    }
}

class LeaderboardHandler extends Server {
    // Gets a users record
    async getUserRecord(req,res) {
        if (req.method === "OPTIONS") {
            // Respond to OPTIONS request with a successful status
            res.status(SUCESSFUL_RES).send("");
            return;
        }
        
        try {
            const collectionRef = await this.db.collection("leaderboard").where(
                "name", "==", req.body.name).get();
            const record = collectionRef.docs.map((doc) => doc.data());
            return res.status(SUCESSFUL_RES).send({"Record": record});
        } catch (error) {
            console.error("Error fetching user record:", error);
            return res.status(UNSUCESSFUL_RES).send({"Error": 
                       "Failed to fetch user record. Please try again later."});
            }
    }

    // Gets all user records
    async getUserRecords(res) {
        try {
            const collectionRef = await this.db.collection("leaderboard").get();
            const records = collectionRef.docs.map((doc) => doc.data());
            return res.status(SUCESSFUL_RES).send({"Records": records});
        } catch (error) {
            return res.status(UNSUCESSFUL_RES).send(
                {"Error": "Could not fetch leaderboard records"});
        }
    }

    // Handle a request
    async handleRequest(type) {
        onRequest(async, (req,res) => {
            this.setResponseHeaders(res);
            switch(type) {
                case "reg":
                    this.registerUser(req,res);
                    break;
                case "allrec":
                    this.getUserRecords(res);
                    break;
                case "usrrec":
                    this.getUserRecord(req,res);
                    break;
            }
        });
    }

    // Register a user
    async registerUser(req,res) {
        try {
            const userRecord = await admin.auth().createUser({
                email: req.body.email,
                password: req.body.password,
                displayName: req.body.displayName,
            });
            return res.status(SUCESSFUL_RES).send({"User Created": userRecord});
        } catch (error) {
            return res.status(UNSUCESSFUL_RES).send({"Error Creating User": 
                                                                        error});
        }
    }
}

class GameHandler extends Server {
    // Add a new record to the db
    async addRecord(req,res) {
        const newRecord = {
            "name": req.body.name,
            "round": req.body.round,
            "endless": req.body.endless,
            "time": req.body.time,
          };
        
          try {
            this.db.collection("leaderboard").add(newRecord);
            // Return success
            return res.status(SUCESSFUL_RES).send(
                                         {"Created new user record": "OK"});
          } catch (error) {
            // Return failure
            return res.status(UNSUCESSFUL_RES).send(
                {"Error creating record": error});
          }
    }

    // Handle a game request
    async handleRequest() {
        onRequest(async, (req,res) => {
            this.addRecord(req,res);
        });
    }
}