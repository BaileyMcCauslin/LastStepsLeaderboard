import { fetchEndpoint } from "./servercalls.js";
import * as Constants from "./consts.js";

// Connects database to table
export class DatabaseConnector {
    // Fetch all user records
    async fetchUserRecords() {
        try {
            const response = await fetchEndpoint(Constants.ALL_USR, {});
            return response.Records;
        } catch (error) {
            alert("Could not fetch records");
            throw error; // Re-throw the error to be caught by the caller
        }
    }  
    
    // Sign up a user
    async handleSignUp(jsonBody) {
        try {
            await fetchEndpoint(Constants.REG_USR,jsonBody);
            alert("User sucessfully registerd");
        } catch(error) {
            alert("Could not create user.");
            console.error(error);
        }
    }

    // Get the user record by search
    async handlePlayerSearch(jsonBody) {
        try {
            const response = await fetchEndpoint(Constants.GET_USR,jsonBody);
            return response.Record;
        } catch(error) {
            alert("Could not find that player.");
            console.error(error);
        }
    } 
}