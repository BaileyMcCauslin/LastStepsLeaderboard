// Import the function to call DB actions
import { fetchEndpoint } from "./servercalls.js";


// Creates a player row
export function createLeaderboardRowElement(items) {
    // Create the row element
    let row = document.createElement("tr");

    // Loop through the table items
    for(let item in items) {
        // Create an entry for each item
        let tableEntry = document.createElement("td");
        // Give the element text
        tableEntry.textContent = items[item];
        // Append the new entry to the row
        row.appendChild(tableEntry);
    }
    // Return the new row element
    return row;
}

// Sort the array of user records by time
function sortByTime(array) {
    // Return the array in sorted fashion
    return array.sort((a, b) => {
        // Split the time strings into hours, minutes, and seconds
        const [hoursA, minutesA, secondsA] = a.time.split(':').map(Number);
        const [hoursB, minutesB, secondsB] = b.time.split(':').map(Number);

        // Compare hours
        if (hoursA !== hoursB) {
            return hoursB - hoursA;
        }

        // Compare minutes if hours are equal
        if (minutesA !== minutesB) {
            return minutesB - minutesA;
        }

        // Compare seconds if minutes are equal
        return secondsB - secondsA;
    });
}


// Sort the records using the user filter input
function sortRecords(type,records) {
    return type === "time" ? sortByTime(records) : sortByScore(type,records); 
}

// Sort by score metrics
function sortByScore(scoreMetric,userRecords) {
    switch(scoreMetric) {
        case "round":
            return userRecords.sort((a, b) => b.roundScore - a.roundScore);
        case "endless":
            return userRecords.sort((a, b) => b.endlessScore - a.endlessScore);
    }
    return userRecords;
}

// Creates a row for each user in the leaderboard
function createUserRows(scoreMetric,userRecords) {
    // Get the leaderboard container to put rows in
    const leaderboardRows = document.getElementById("leaderboard-rows");

    // Get the player records
    let records = userRecords.Records;

    // State the table headers
    const tableEntries = ["rank","name","endlessScore","roundScore","time"];

    // Check if we want to sort by time or score
    records = sortRecords(scoreMetric,records);
    
    // Loop through each of the items in the collected user records
    for(const key in records) {

        // Get the current record from the array
        const record = records[key];

        // Create an object to store the key,pairs of entries
        let items = {};

        // Loop through the table headers
        for(let item in tableEntries) {

            // Get the object key
            let itemKey = tableEntries[item];

            // Check that we dont get rank(Not stored in DB
            // instead computed on client side
            if(item !== "0") {
                items[itemKey] = record[itemKey];
            }
            else {
                // Otherwise, we have to determine rank, need to convert key to
                // int so we can add 1 to it's value
                items[itemKey] = parseInt(key, 10)+1;
            }
        }

        // Create a row for each player
        let row = createLeaderboardRowElement(items);

        // Append it to the leaderboard
        leaderboardRows.appendChild(row);
    }
}

function clearTable() {
    const element = document.getElementById("leaderboard-rows");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Calls the cloud function to return records to the DB
export function fetchUserRecords(sortType) {
    // Clear table after each reload
    clearTable();

    //Fetch the endpoint for all users
    fetchEndpoint("",{})
    .then(response => {
        // When we get a response back, make the rows
        createUserRows(sortType,response);
        return response.Records;
    })
    .catch(error => {
        // Handle error if fetching data fails
        console.error('Error:', error);
    });
}

// Populate the leaderboard on page load
window.onload = function() {
    fetchUserRecords("time");
}