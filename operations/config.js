// var detailsMode = false;
// /**
//  * This function is used to set the output format of the query result.
//  * 
//  * @param {boolean} mode This parameter is used to set the output format of the query result.
//  */
// function setDetailsMode(mode = false) {
//     if (typeof mode !== 'boolean') throw new Error('Invalid parameter type. Expected boolean.');
//     detailsMode = mode;
// }

var logingMode = false;
/**
 * This function is used to set the output format of the query result.
 * 
 * @param {boolean} mode This parameter is used to set the output format of the query result.
 */
function setLogingMode(mode = false) {
    if (typeof mode !== 'boolean') throw new Error('Invalid parameter type. Expected boolean.');
    logingMode = mode;
};

/**
 * This function is used to get the current output format of the query result.
 * @file config.js
 * @description This file contains the configuration operations.
 * @module
 * @property {function} get This object contains the functions that get the current configuration.
 * @property {function} set This object contains the functions that set the configuration.
 * @returns
 */
module.exports = {
    get: {
        //detailsMode: () => detailsMode
        logingMode: () => logingMode,
    },
    set: {
        //detailsMode: setDetailsMode,
        logingMode: setLogingMode
    }
};