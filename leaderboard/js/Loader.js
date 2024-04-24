import { UIHandler } from "./UIHandler.js";
import { Table } from "./Table.js";
import { DatabaseConnector } from "./DatabaseConnector.js";
import { EventHandler } from "./EventHandler.js";

export class Loader {
    constructor(type) {
        this.uiHandler = new UIHandler();
        this.dbConnector = new DatabaseConnector();
        this.table = new Table(this.dbConnector,this.uiHandler);
        this.eventHandler = new EventHandler(this.table,this.uiHandler,
                                                         this.dbConnector,type);
    }

    // Loads leaderboard on window load
    onLeaderboardLoad() {
        this.table.createUserRows();
        this.eventHandler.attachDropDownListeners();
        this.eventHandler.initEvents();
    }

    // Loads registration on window load
    onRegLoad() {
        this.eventHandler.initEvents();
    }
}