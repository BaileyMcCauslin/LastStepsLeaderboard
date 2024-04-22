import { EventHandler } from "./EventHandler.js";
import { Table } from "./Table.js";
import { UIHandler } from "./UIHandler.js";
import { DatabaseConnector } from "./DatabaseConnector.js";

window.onload = function() {
    const uiHandler = new UIHandler();
    const dbConnector = new DatabaseConnector();
    const table = new Table(dbConnector,uiHandler);
    const eventHandler = new EventHandler(table,uiHandler,dbConnector,
                                                                "registration");
    //table.createUserRows();
    eventHandler.initEvents();
}