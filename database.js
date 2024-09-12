require('colors');

/**
 * This export is used to fix the data to be sent to the database.
 * @file database.js
 * @description This file contains the database operations.
 * @module
 * @property {function} Table This function is used to create a table in the database.
 * @property {function} Procedure This function is used to create a procedure in the database.
 * @property {function} Query This function is used to execute the query in the database.
 * @property {function} Types This object contains the SQL data types.
 * @property {function} Connect This function is used to connect to the database.
 * @property {function} SetConfig This function is used to set the configuration of the database.
 * @returns
 */
module.exports = {
    Table: require('./database/table.js'),
    Procedure: require('./database/procedure.js'),
    Query: require('./database/query.js'),
    Types: require('./database/sql_types.js'),
    Connect: require('./operations/connect_to_server.js'),
    SetConfig: require('./operations/config.js').set
}