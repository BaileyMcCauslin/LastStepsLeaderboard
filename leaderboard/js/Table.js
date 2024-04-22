// Import the function to call DB actions
import { EventHandler } from "./EventHandler.js";
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

// The leaderboard table
export class Table {
    // Initalize the table
    constructor(databaseConnector,UIHandler) {
        this.userRecords = null;
        this.databaseConnector = databaseConnector;
        this.UIHandler = UIHandler;
        this.sort = new SortInterface();
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
    createTableRowElement(rowItems) {
        let row = this.UIHandler.createElement("tr");
        for(let entry in rowItems) {
            let tableEntry = this.UIHandler.createElement("td");
            this.UIHandler.setElementText(tableEntry,rowItems[entry]);
            this.UIHandler.appendElement(row,tableEntry);
        }
        return row;
    }

    // Creates a row for each user in the leaderboard
    async createUserRows() {
        const leaderboardRows = this.UIHandler.getElement("leaderboard-rows");
        const tableEntries = ["rank","name","endlessScore","roundScore","time"];

        try {
            if(this.userRecords === null) {
                await this.fetchUserRecords();
            } 
            this.sort.Sort(this.userRecords);

            for(const key in this.userRecords) {
                const record = this.userRecords[key];
                const rowItems = this.playerInfo(record,tableEntries,key);
                let row = this.createTableRowElement(rowItems);
                this.UIHandler.appendElement(leaderboardRows,row);
            }
        } catch(error) {
            console.error(error);
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

    // Set the table user records
    async fetchUserRecords() {
        try {
            this.userRecords = await this.databaseConnector.fetchUserRecords();
        } catch(error) {
            console.error(error);
        }
    }

    // Reset the table
    resetTable(userRecords) {
        if(userRecords !== null) {
            this.setUserRecords(userRecords);
        }
        this.clearTable();
        this.createUserRows();
    }

    // Set the user records
    setUserRecords(userRecords) {
        this.userRecords = userRecords;
    }

    // Sort the table based on sort type
    sortTable(sortType) {
        this.clearTable();
        this.changeSort(sortType);
        this.createUserRows();
    }
}