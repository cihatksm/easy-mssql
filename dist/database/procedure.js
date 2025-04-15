"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Procedure = Procedure;
const procedure_execute_1 = require("../operations/procedure_execute");
const data_types_1 = require("../operations/data_types");
const config_1 = require("../operations/config");
const query_1 = require("./query");
const objectTypeMap = {
    'U ': 'Table',
    'V ': 'View',
    'P ': 'Procedure',
    'FN ': 'Function'
};
/**
 * All functions in the procedure are defined in this class.
 *
 * @param name - The name of the procedure to be added to the procedure
 * @returns Object containing procedure methods
 */
function Procedure(name = '') {
    /**
     * Returns information about the procedure in the database.
     * @returns Promise<ProcedureInfo | null> - Information about the procedure
     */
    async function Info() {
        if (!name)
            return null;
        const queryString = `SELECT * FROM sysobjects WHERE type = 'P' AND name = '${name}'`;
        const queryOutput = await (0, query_1.Query)(queryString);
        if (queryOutput?.status !== 200) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Procedure / Info / The ${name} procedure does not exist in the database.`.yellow);
            return null;
        }
        const data = queryOutput?.data?.[0] || null;
        if (!data)
            return null;
        return {
            name: data.name,
            type: objectTypeMap[data.xtype] || data.xtype,
            date: data.crdate
        };
    }
    /**
     * Returns information about all procedures in the database.
     * @returns Promise<ProcedureInfo[] | null> - Information about all procedures
     */
    async function AllInfo() {
        const queryString = `SELECT * FROM sysobjects WHERE type = 'P'`;
        const queryOutput = await (0, query_1.Query)(queryString);
        if (queryOutput?.status !== 200) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Procedure / AllInfo / The procedure does not exist in the database.`.yellow);
            return null;
        }
        const data = queryOutput?.data || [];
        if (!data)
            return null;
        return data.map(m => ({
            name: m.name,
            type: objectTypeMap[m.xtype] || m.xtype,
            date: m.crdate
        }));
    }
    /**
     * Gets the output schema of the procedure in the database.
     * @returns Promise<Record<string, string>> - The output schema of the procedure
     */
    async function SimpleOutput() {
        if (!name)
            return {};
        const queryString = `EXEC sp_describe_first_result_set N'EXEC ${name}'`;
        const queryOutput = await (0, query_1.Query)(queryString);
        if (queryOutput?.status !== 200) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Procedure / SimpleOutput / The ${name} procedure does not exist in the database.`.yellow);
            return {};
        }
        const data = queryOutput?.data || [];
        const outputArray = data.filter(f => !f.is_hidden).map(m => ({ name: m.name, type: m.system_type_name?.split('(')[0] }));
        return outputArray.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.type }), {});
    }
    /**
     * Executes the procedure in the database
     *
     * @param referance - The reference parameters to be executed in the database
     * @returns Promise<ProcedureResult> - The result of the procedure execution
     */
    async function Execute(referance = {}) {
        let procedureOutput = await (0, procedure_execute_1.executeProcedure)(name, referance);
        if (procedureOutput?.status !== 200) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Procedure / Execute / The ${name} procedure could not be executed.`.yellow);
            return { status: 501, message: 'The procedure could not be executed.', data: [] };
        }
        let data = procedureOutput?.data || null;
        if (data && data.length > 0) {
            const schema = await SimpleOutput();
            if (!schema || Object.keys(schema).length === 0) {
                if (config_1.config.get.logingMode())
                    console.log(`▲ easy-mssql / Procedure / Execute / The ${name} procedure schema could not be found.`.yellow);
                return { status: 502, message: 'The schema could not be found.', data: [] };
            }
            data = data.map(m => {
                const keys = Object.keys(m);
                if (keys.length !== Object.keys(schema).length)
                    return null;
                const new_data = {};
                keys.forEach(key => new_data[key] = data_types_1.sqlTypes[schema[key]](m[key]));
                return new_data;
            }).filter(f => f !== null);
        }
        procedureOutput.data = data;
        return procedureOutput;
    }
    return {
        Execute,
        Info,
        AllInfo,
        SimpleOutput
    };
}
//# sourceMappingURL=procedure.js.map