"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
require("colors");
const table_1 = require("./database/table");
const procedure_1 = require("./database/procedure");
const query_1 = require("./database/query");
const sql_types_1 = require("./database/sql_types");
const connect_to_server_1 = require("./operations/connect_to_server");
const config_1 = require("./operations/config");
/**
 * This export is used to fix the data to be sent to the database.
 * @file database.ts
 * @description This file contains the database operations.
 * @module
 */
exports.database = {
    Table: table_1.Table,
    Procedure: procedure_1.Procedure,
    Query: query_1.Query,
    Types: sql_types_1.sqlTypes,
    Connect: connect_to_server_1.connectToServer,
    SetConfig: config_1.config.set
};
//# sourceMappingURL=database.js.map