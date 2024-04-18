// Import the function to call DB actions
import { fetchEndpoint } from "./servercalls.js";

/*
 Define a sort interface for sort types to implement
 no interfaces in JS: so we use a class
*/
class SortInterface {
    // Initalize the class to use time as sort. Then change base on user inputs
    // NOTE: Basically init a default sort method
    constructor() {
        this.SortStrategy = new TimeSort();
    }

    // Set the sorting strategy
    setStrategy(strategy) {
        this.SortStrategy = strategy;
    }

    // Get the sorting stategy were using
    getStrategy() {
        return this.SortStrategy;
    }

    // Sort the records based on the strategy
    Sort(records) {
        this.SortStrategy.Sort(records);
    }
}

// Define a TimSort class that implements the SortInterface
class TimeSort {
    Sort(records) {
        return records.sort((a, b) => {
            const [hoursA, minutesA, secondsA] = a.time.split(':').map(Number);
            const [hoursB, minutesB, secondsB] = b.time.split(':').map(Number);

            if (hoursA !== hoursB) {
                return hoursB - hoursA;
            }

            if (minutesA !== minutesB) {
                return minutesB - minutesA;
            }

            return secondsB - secondsA;
        });
    }
}

// Define an EndlessSort class that implements the SortInterface
class EndlessSort {
    Sort(records) {
        records.sort((a, b) => b.endlessScore - a.endlessScore);
    }
}

// Define a RoundSort class that implements the SortInterface
class RoundSort {
    Sort(records) {
        records.sort((a, b) => b.roundScore - a.roundScore);
    }
}

// Handles UI operations
class UIHandler {
    // Create a new element
    createElement(elementType) {
        return document.createElement(elementType);
    }

    // Get an existing element
    getElement(id) {
        return document.getElementById(id);
    }

    // Set an elements text
    setElementText(element,text) {
        element.textContent = text;
    }

    // Append a child to parent node
    appendElement(parent,child) {
        parent.appendChild(child);
    }

    // Remove an elements children
    removeElementsChildren(element) {
        while(element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}

// The leaderboard table
class Table {
    // Initalize the table
    constructor() {
        this.databaseConnector = new DatabaseConnector();
        this.userRecords = this.databaseConnector.fetchUserRecords();
        this.sort = new SortInterface();
        this.UIHandler = new UIHandler();
    }


    // Change the sort strategy for the table
    changeSort(sortType) {
        switch(sortType) {
            case "time":
                this.sort.setStrategy(new TimeSort());
                break;
            case "endless":
                this.sort.setStrategy(new EndlessSort());
                break;
            case "round":
                this.sort.setStrategy(new RoundSort());
                break;
            default:
                this.sort.setStrategy(new TimeSort());
                break;
        }
    }

    // Clear the tables content
    clearTable() {
        const leaderboardTable = this.UIHandler.getElement("leaderboard-rows");
        this.UIHandler.removeElementsChildren(leaderboardTable);
    }

    // Creates a player row in the table
    createTableRowElement(tableEntries,rowItems) {
        let row = this.UIHandler.createElement("tr");
        for(let entry in tableEntries) {
            let tableEntry = this.UIHandler.createElement("td");
            this.UIHandler.setElementText(tableEntry,rowItems[entry]);
            this.UIHandler.appendElement(row,tableEntry);
        }
        return row;
    }

    // Creates a row for each user in the leaderboard
    createUserRows() {
        const leaderboardRows = this.UIHandler.getElement("leaderboard-rows");
        const tableEntries = ["rank","name","endlessScore","roundScore","time"];

        this.userRecords = this.sort.Sort(this.userRecords);
        
        for(const key in this.userRecords) {
            const record = this.userRecords[key];
            const rowItems = this.playerInfo(record,tableEntries,key);
            let row = this.createTableRowElement(tableEntries,rowItems);
            this.UIHandler.appendElement(leaderboardRows,row);
        }
    }

    // Return a player object that contains info for each row
    playerInfo(record,tableEntries,key) {
        let items = {};

        for(let item in tableEntries) {
            let itemKey = tableEntries[item];
            // If the key is not rank then set the value to the record value
            // Otherwise, create the player rank
            items[itemKey] = item !== "0" ? record[itemKey] : 
                                                            parseInt(key, 10)+1;
        }
        return items;
    }

    // Sort the table based on sort type
    sortTable(sortType) {
        this.clearTable();
        this.changeSort(sortType);
        this.createUserRows();
    }
}

class DatabaseConnector {
    // Fetch all user records
    fetchUserRecords() {
        fetchEndpoint("",{})
        .then(response => {
            return response.Records;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Populate the leaderboard on page load
window.onload = function() {
    const table = new Table();
    table.createUserRows();
}