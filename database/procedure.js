const procedure_execute = require('../operations/procedure_execute.js');
const data_types = require('../operations/data_types.js');
const config = require('../operations/config.js');
const Query = require('./query.js');

/**
 * All functions in the procedure are defined in this class.
 * 
 * @param {String} name This value is the name of the procedure to be added to the procedure.
 * @returns
 */
function Procedure(name = '') {
    /**
     * 
     * @returns This function returns information about the procedure in the database.
     */
    async function Info() {
        if (!name) return null;

        const queryString = `SELECT * FROM sysobjects WHERE type = 'P' AND name = '${name}'`;
        const queryOutput = await Query(queryString);
        if (queryOutput?.status !== 200) {
            if (config.get.logingMode()) console.log(`▲ easy-mssql / Procedure / Info / The ${name} procedure does not exist in the database.`.yellow);
            return null;
        }

        const data = queryOutput?.data[0] || null;
        if (!data) return null;

        return {
            name: data?.name,
            type: { 'U ': 'Table', 'V ': 'View', 'P ': 'Procedure', 'FN ': 'Function' }[data?.xtype] || data?.xtype,
            date: data?.crdate
        }
    };

    async function AllInfo() {
        const queryString = `SELECT * FROM sysobjects WHERE type = 'P'`;
        const queryOutput = await Query(queryString);
        if (queryOutput?.status !== 200) {
            if (config.get.logingMode()) console.log(`▲ easy-mssql / Procedure / AllInfo / The procedure does not exist in the database.`.yellow);
            return null;
        }

        const data = queryOutput?.data || [];
        if (!data) return null;

        return data.map(m => {
            return {
                name: m?.name,
                type: { 'U ': 'Table', 'V ': 'View', 'P ': 'Procedure', 'FN ': 'Function' }[m?.xtype] || m?.xtype,
                date: m?.crdate
            }
        });
    };

    /**
     * 
     * @returns This function is used to get the output of the procedure in the database.
     */
    async function SimpleOutput() {
        if (!name) return null;

        const queryString = `EXEC sp_describe_first_result_set N'EXEC ${name}'`;
        const queryOutput = await Query(queryString);

        if (queryOutput?.status !== 200) {
            if (config.get.logingMode()) console.log(`▲ easy-mssql / Procedure / SimpleOutput / The ${name} procedure does not exist in the database.`.yellow);
            return {};
        }

        const data = queryOutput?.data || [];
        const outputArray = data?.filter(f => !f.is_hidden).map(m => ({ name: m?.name, type: m?.system_type_name?.split('(')[0] }));
        const output = outputArray.reduce((acc, cur) => { return { ...acc, [cur?.name]: cur?.type } }, {});
        return output;
    };

    /**
     * This function is used to execute the procedure in the database
     * 
     * @param {Object} referance This value is the referance to be executed in the database.
     * @returns 
     */
    async function Execute(referance = {}) {
        let procedureOutput = await procedure_execute(name, referance);
        if (procedureOutput?.status !== 200) {
            if (config.get.logingMode()) console.log(`▲ easy-mssql / Procedure / Execute / The ${name} procedure could not be executed.`.yellow);
            return { status: 501, message: 'The procedure could not be executed.', data: [] };
        }

        let data = procedureOutput?.data || null;

        if (data && data?.length > 0) {
            const schema = await SimpleOutput();
            if (!schema || Object.keys(schema).length === 0) {
                if (config.get.logingMode()) console.log(`▲ easy-mssql / Procedure / Execute / The ${name} procedure schema could not be found.`.yellow);
                return { status: 502, message: 'The schema could not be found.', data: [] };
            }

            data = data.map(m => {
                const keys = Object.keys(m);
                if (keys.length !== Object.keys(schema).length) return null;
                var new_data = {};
                keys.forEach(key => new_data[key] = data_types[schema[key]](m[key]));
                return new_data;
            }).filter(f => f !== null);
        }

        procedureOutput.data = data;
        return procedureOutput;
    };

    return {
        Execute, Info, AllInfo, SimpleOutput
    };
}

module.exports = Procedure;