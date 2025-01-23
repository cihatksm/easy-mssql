const sql = require('mssql');
const config = require('../operations/config.js');

/**
 * This function is used to execute the query in the database
 * 
 * @param {*} query This value is the query to be executed in the database.
 * @returns
 */
module.exports = async (query) => {
    return await new Promise(async (resolve) => {
        const request = new sql.Request();
        try {
            request.query(query, (err, result) => {
                if (err) {
                    if (config.get.logingMode()) console.log(`▲ easy-mssql / Query / ${query} : ${err.message}`.yellow);
                    resolve({ status: 500, message: 'Error: ' + err, data: null });
                } else {
                    resolve({ status: 200, message: 'Success', data: result?.recordset });
                }
            });
        } catch (err) {
            if (config.get.logingMode()) console.log(`▲ easy-mssql / Query / ${query} : ${err.message}`.yellow);
            else resolve({ status: 501, message: 'Error: ' + err, data: null });
        }
    });
}