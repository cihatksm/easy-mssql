const sql = require('mssql');
const config = require('./config');

/**
 * This function is used to execute the procedure in the database
 * 
 * @param {String} procedureName This value is the name of the procedure to be executed in the database.
 * @param {Object} referance This value is the referance to be executed in the database.
 * @returns
 */
module.exports = async (procedureName, referance = {}) => {
    return await new Promise(async (resolve) => {
        const request = new sql.Request();
        try {
            for (const key of Object.keys(referance)) {
                var value = referance[key];
                request.input(key, value);
            }

            request.execute(procedureName)
                .then(result => {
                    resolve({ status: 200, message: 'Success', data: result?.recordset });
                })
                .catch(err => {
                    if (config.get.logingMode()) console.log('▲ easy-mssql: '.cyan + err);
                    resolve({ status: 500, message: 'Error', data: null })
                })
        } catch (err) {
            if (config.get.logingMode()) console.log('▲ easy-mssql: '.cyan + err);
            resolve({ status: 501, message: 'Error', data: null })
        }
    });
}