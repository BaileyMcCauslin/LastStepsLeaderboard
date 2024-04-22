import { UIHandler } from "./UIHandler.js";
import { Table } from "./Table.js";
import { DatabaseConnector } from "./DatabaseConnector.js";
import { EventHandler } from "./EventHandler.js";

// Once all resources load, create the leaderboard
window.onload = function() {
    const uiHandler = new UIHandler();
    const dbConnector = new DatabaseConnector();
    const table = new Table(dbConnector,uiHandler);
    const eventHandler = new EventHandler(table,uiHandler,dbConnector,
                                                                 "leaderboard");
    table.createUserRows();
    eventHandler.attachDropDownListeners();
    eventHandler.initEvents();
}
