"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = Table;
const data_types_1 = require("../operations/data_types");
const get_pieces_1 = require("../operations/get_pieces");
const config_1 = require("../operations/config");
const query_1 = require("./query");
require("colors");
/**
 * All functions in the table are defined in this class.
 *
 * @param name - The name of the table to be added to the table
 * @returns Object containing table functions
 */
function TableFunctions(name) {
    /**
     * This function is used to add a scheme to the table in the database.
     *
     * @param scheme - The scheme to be added to the database
     * @returns Promise<boolean> - Whether the operation was successful
     */
    async function create(scheme) {
        const isThereTable = await isThere();
        if (isThereTable)
            return false;
        if (!scheme || Object.keys(scheme).length === 0)
            return false;
        const stringScheme = Object.keys(scheme).map(m => m + ' ' + scheme[m]).join(', ');
        const queryString = `CREATE TABLE ${name} (${stringScheme})`;
        return (await (0, query_1.Query)(queryString))?.status === 200;
    }
    /**
     * This function deletes the table in the database.
     * @returns Promise<boolean> - Whether the operation was successful
     */
    async function remove() {
        const isThereTable = await isThere();
        if (!isThereTable)
            return false;
        const queryString = `DROP TABLE ${name}`;
        return (await (0, query_1.Query)(queryString))?.status === 200;
    }
    /**
     * This function checks if the table exists in the database.
     * @returns Promise<boolean> - Whether the table exists
     */
    async function isThere() {
        const queryString = `SELECT * FROM sysobjects WHERE type = 'U' AND name = '${name}'`;
        const queryOutput = await (0, query_1.Query)(queryString);
        return queryOutput?.status === 200 && (queryOutput?.data?.length ?? 0) > 0;
    }
    /**
     * This function returns information about the table in the database.
     * @returns Promise<TableInfo | null> - Information about the table
     */
    async function info() {
        const queryString = `SELECT * FROM sysobjects WHERE type = 'U' AND name = '${name}'`;
        const queryOutput = await (0, query_1.Query)(queryString);
        if (queryOutput?.status !== 200) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Table / Info / Table ${name} not found.`.yellow);
            return null;
        }
        const data = queryOutput?.data?.[0] || null;
        if (!data)
            return null;
        const schema = await getSchema();
        return {
            name: data.name,
            type: 'Table',
            date: data.crdate,
            schema
        };
    }
    /**
     * This function returns information about all tables in the database.
     * @returns Promise<TableInfo[] | null> - Information about all tables
     */
    async function getAll() {
        const queryString = `SELECT * FROM sysobjects WHERE type = 'U'`;
        const queryOutput = await (0, query_1.Query)(queryString);
        if (queryOutput?.status !== 200) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Table / GetAll / Tables not found.`.yellow);
            return null;
        }
        const data = queryOutput?.data || [];
        if (!data)
            return null;
        return Promise.all(data.map(async (m) => {
            const schema = await getSchema(m.name);
            return {
                name: m.name,
                type: 'Table',
                date: m.crdate,
                schema
            };
        }));
    }
    /**
     * This function returns the schema of a table.
     * @param tableName - The name of the table
     * @returns Promise<TableSchema> - The schema of the table
     */
    async function getSchema(tableName = name) {
        const queryString = `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`;
        const queryOutput = await (0, query_1.Query)(queryString);
        if (queryOutput?.status !== 200)
            return {};
        const data = queryOutput?.data || [];
        return data.reduce((acc, cur) => ({ ...acc, [cur.COLUMN_NAME]: cur.DATA_TYPE }), {});
    }
    /**
     * This function is used to update a column in the table.
     * @param columnName - The name of the column to be updated
     * @returns Object containing column update methods
     */
    function updateColumn(columnName) {
        /**
         * This function is used to add a column to the table.
         * @param type - The type of the column
         * @returns Promise<boolean> - Whether the operation was successful
         */
        async function add(type) {
            const queryString = `ALTER TABLE ${name} ADD ${columnName} ${type}`;
            return (await (0, query_1.Query)(queryString))?.status === 200;
        }
        /**
         * This function is used to remove a column from the table.
         * @returns Promise<boolean> - Whether the operation was successful
         */
        async function remove() {
            const queryString = `ALTER TABLE ${name} DROP COLUMN ${columnName}`;
            return (await (0, query_1.Query)(queryString))?.status === 200;
        }
        /**
         * This function is used to rename a column in the table.
         * @param newColumnName - The new name of the column
         * @returns Promise<boolean> - Whether the operation was successful
         */
        async function rename(newColumnName) {
            const queryString = `EXEC sp_rename '${name}.${columnName}', '${newColumnName}', 'COLUMN'`;
            return (await (0, query_1.Query)(queryString))?.status === 200;
        }
        /**
         * This function is used to update the type of a column in the table.
         * @param type - The new type of the column
         * @returns Promise<boolean> - Whether the operation was successful
         */
        async function update(type) {
            const queryString = `ALTER TABLE ${name} ALTER COLUMN ${columnName} ${type}`;
            return (await (0, query_1.Query)(queryString))?.status === 200;
        }
        return {
            add,
            remove,
            rename,
            update
        };
    }
    return {
        create,
        remove,
        isThere,
        info,
        getAll,
        updateColumn
    };
}
/**
 * All functions in the database are defined in this class.
 *
 * @param name - The name of the table to be added to the table
 * @returns Object containing table methods
 */
function Table(name) {
    /**
     * This function is used to find data in the database.
     *
     * @param referance - Finding datas from the database with reference value
     * @param options - The options to be added to the database
     * @param options.limit - The limit value to be added to the database
     * @param options.selected_keys - The output keys to be added to the database
     * @param options.likes - The like keys to be added to the database
     * @returns Promise<any[]> - The found data
     */
    async function find(referance = {}, options = { limit: null, selected_keys: [], likes: {} }) {
        let table = await TableFunctions(name).info();
        if (!table) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Table / Find / Table ${name} not found.`.yellow);
            return [];
        }
        let { keys, values } = (0, get_pieces_1.getPieces)(referance);
        let referanceString = keys.length > 0 ? `WHERE ${keys.map((m, i) => `${m} = ${values[i]}`).join(' AND ')}` : '';
        if (Object.keys(options.likes || {}).length > 0) {
            let likes = Object.keys(options.likes || {}).map(m => `${m} LIKE '${options.likes?.[m]?.replaceAll('?', '%')?.replaceAll('.', '_')}'`);
            referanceString += referanceString.length > 0 ? ` AND ${likes.join(' AND ')}` : `WHERE ${likes.join(' AND ')}`;
        }
        let columns = '*';
        if (Array.isArray(options.selected_keys) && options.selected_keys && options.selected_keys?.length > 0) {
            columns = options.selected_keys.join(', ');
        }
        let limitString = (typeof options.limit === 'number' && options.limit > 0) ? `TOP ${options.limit} ` : '';
        let queryString = `SELECT ${limitString}${columns} FROM ${name} ${referanceString}`;
        let queryOutput = await (0, query_1.Query)(queryString);
        let data = queryOutput?.data || [];
        if (data.length > 0) {
            data = data.map(m => {
                let keys = Object.keys(m);
                let schemaControled = false;
                if (options?.selected_keys && options.selected_keys.length > 0 && keys.length <= Object.keys(table?.schema || {}).length)
                    schemaControled = true;
                if (!schemaControled && keys.length === Object.keys(table?.schema || {}).length)
                    schemaControled = true;
                if (!schemaControled)
                    return null;
                let new_data = {};
                keys.forEach(key => new_data[key] = data_types_1.sqlTypes[table?.schema[key]](m[key]));
                return new_data;
            }).filter(f => f !== null);
        }
        return data;
    }
    /**
     * This function is used to find a single data in the database.
     *
     * @param referance - Finding data from the database with reference value
     * @param options - The options to be added to the database
     * @param options.selected_keys - The output keys to be added to the database
     * @param options.likes - The like keys to be added to the database
     * @returns Promise<any | null> - The found data or null
     */
    async function findOne(referance = {}, options = { selected_keys: [], likes: {} }) {
        const findOption = { limit: 1, selected_keys: options.selected_keys, likes: options.likes };
        return (await find(referance, findOption))[0] || null;
    }
    /**
     * This function is used to add data to the database.
     *
     * @param data - The data to be added to the database
     * @returns Promise<boolean> - Whether the operation was successful
     */
    async function createOne(data) {
        const { keys, values } = (0, get_pieces_1.getPieces)(data);
        const queryString = `INSERT INTO ${name} (${keys.join(', ')}) VALUES (${values.join(', ')})`;
        const queryOutput = await (0, query_1.Query)(queryString);
        return queryOutput?.status === 200;
    }
    /**
     * This function is used to update data in the database.
     *
     * @param referance - Updating data in database by reference value
     * @param data - The data to be updated in the database
     * @returns Promise<boolean> - Whether the operation was successful
     */
    async function updateOne(referance, data) {
        const { keys: refKeys, values: refValues } = (0, get_pieces_1.getPieces)(referance);
        const { keys: dataKeys, values: dataValues } = (0, get_pieces_1.getPieces)(data);
        if (refKeys.length === 0) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Table / Update / No referance provided for update`.yellow);
            return false;
        }
        if (dataKeys.length === 0) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Table / Update / No data provided for update`.yellow);
            return false;
        }
        const isData = await findOne(referance);
        if (!isData) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Table / Update / No data found for update`.yellow);
            return false;
        }
        const conditions = refKeys.map((key, index) => `${key} = ${refValues[index]}`).join(' AND ');
        const setValues = dataKeys.map((key, index) => `${key} = ${dataValues[index]}`).join(', ');
        const queryString = `UPDATE ${name} SET ${setValues} WHERE ${conditions}`;
        const queryOutput = await (0, query_1.Query)(queryString);
        return queryOutput?.status === 200;
    }
    /**
     * This function is used to delete data in the database.
     *
     * @param referance - Deleting data in database by reference value
     * @returns Promise<boolean> - Whether the operation was successful
     */
    async function deleteOne(referance) {
        const deleteOperation = await _deleteOne(referance);
        if (deleteOperation === false)
            return false;
        return deleteOperation.status === 200;
    }
    /**
     * This function is used to delete data in the database.
     *
     * @param referance - Deleting data in database by reference value
     * @returns Promise<TableResult | false> - The result of the delete operation
     */
    async function _deleteOne(referance) {
        const { keys, values } = (0, get_pieces_1.getPieces)(referance);
        if (keys.length === 0) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Table / Delete / No referance provided for delete`.yellow);
            return false;
        }
        const conditions = keys.map((key, index) => `${key} = ${values[index]}`).join(' AND ');
        const queryString = `DELETE FROM ${name} WHERE ${conditions}`;
        return await (0, query_1.Query)(queryString);
    }
    /**
     * Deletes all records from the table that match the given reference.
     * If no reference is provided, deletes all records.
     * @param referance - Optional reference to filter records to delete
     * @returns Promise<boolean> - Whether the operation was successful
     */
    async function deleteAll(referance) {
        const datas = await find(referance || {});
        if (datas.length === 0) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Table / Delete / No data found for delete`.yellow);
            return false;
        }
        const deletes = await Promise.all(datas.map(async (data) => {
            const _data = {};
            Object.keys(data)
                .filter(key => key !== 'created_at' && data[key] !== null)
                .forEach(key => _data[key] = data[key]);
            return await _deleteOne(_data);
        }));
        let output;
        const isComplated = deletes.filter(f => f !== false && f.status !== 200).length === 0;
        if (!isComplated)
            output = { status: 500, message: "An error occurred while deleting", data: null };
        else
            output = { status: 200, message: "Success", data: null };
        return output.status === 200;
    }
    /**
     * Returns the first element of a sequence.
     * @param referance - Finding data from the database with reference value
     * @param options - The options to be added to the database
     * @returns Promise<any | null> - The first element or null if no elements are found
     */
    async function first(referance = {}, options = {}) {
        const data = await find(referance, { ...options, limit: 1 });
        return data[0] || null;
    }
    /**
     * Returns the first element of a sequence that satisfies a condition.
     * @param referance - Finding data from the database with reference value
     * @param options - The options to be added to the database
     * @returns Promise<any | null> - The first element that satisfies the condition or null if no such element is found
     */
    async function firstOrDefault(referance = {}, options = {}) {
        const data = await find(referance, { ...options, limit: 1 });
        return data[0] || null;
    }
    /**
     * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
     * @param referance - Finding data from the database with reference value
     * @param options - The options to be added to the database
     * @returns Promise<any> - The single element of the sequence
     * @throws Error if the sequence contains more than one element or no elements
     */
    async function single(referance = {}, options = {}) {
        const data = await find(referance, options);
        if (data.length === 0)
            throw new Error("Sequence contains no elements");
        if (data.length > 1)
            throw new Error("Sequence contains more than one element");
        return data[0];
    }
    /**
     * Returns the only element of a sequence, or a default value if the sequence is empty.
     * @param referance - Finding data from the database with reference value
     * @param options - The options to be added to the database
     * @returns Promise<any | null> - The single element of the sequence, or null if the sequence is empty
     * @throws Error if the sequence contains more than one element
     */
    async function singleOrDefault(referance = {}, options = {}) {
        const data = await find(referance, options);
        if (data.length > 1)
            throw new Error("Sequence contains more than one element");
        return data[0] || null;
    }
    /**
     * Returns the last element of a sequence.
     * @param referance - Finding data from the database with reference value
     * @param options - The options to be added to the database
     * @returns Promise<any | null> - The last element or null if no elements are found
     */
    async function last(referance = {}, options = {}) {
        const data = await find(referance, options);
        return data[data.length - 1] || null;
    }
    /**
     * Returns the last element of a sequence that satisfies a condition.
     * @param referance - Finding data from the database with reference value
     * @param options - The options to be added to the database
     * @returns Promise<any | null> - The last element that satisfies the condition or null if no such element is found
     */
    async function lastOrDefault(referance = {}, options = {}) {
        const data = await find(referance, options);
        return data[data.length - 1] || null;
    }
    /**
     * Returns the number of elements in a sequence.
     * @param referance - Finding data from the database with reference value
     * @param options - The options to be added to the database
     * @returns Promise<number> - The number of elements in the sequence
     */
    async function count(referance = {}, options = {}) {
        const data = await find(referance, options);
        return data.length;
    }
    /**
     * Returns the minimum value in a sequence of values.
     * @param key - The key to get the minimum value from
     * @param referance - Finding data from the database with reference value
     * @param options - The options to be added to the database
     * @returns Promise<number | null> - The minimum value in the sequence
     */
    async function min(key, referance = {}, options = {}) {
        const data = await find(referance, options);
        if (data.length === 0)
            return null;
        return Math.min(...data.map(item => item[key]));
    }
    /**
     * Returns the maximum value in a sequence of values.
     * @param key - The key to get the maximum value from
     * @param referance - Finding data from the database with reference value
     * @param options - The options to be added to the database
     * @returns Promise<number | null> - The maximum value in the sequence
     */
    async function max(key, referance = {}, options = {}) {
        const data = await find(referance, options);
        if (data.length === 0)
            return null;
        return Math.max(...data.map(item => item[key]));
    }
    /**
     * Computes the average of a sequence of numeric values.
     * @param key - The key to get the average value from
     * @param referance - Finding data from the database with reference value
     * @param options - The options to be added to the database
     * @returns Promise<number | null> - The average of the sequence of values
     */
    async function average(key, referance = {}, options = {}) {
        const data = await find(referance, options);
        if (data.length === 0)
            return null;
        const sum = data.reduce((acc, item) => acc + item[key], 0);
        return sum / data.length;
    }
    return {
        find,
        findOne,
        createOne,
        updateOne,
        deleteOne,
        deleteAll,
        first,
        firstOrDefault,
        single,
        singleOrDefault,
        last,
        lastOrDefault,
        count,
        min,
        max,
        average,
        functions: TableFunctions(name)
    };
}
//# sourceMappingURL=table.js.map