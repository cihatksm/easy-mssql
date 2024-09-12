const data_types = require('../operations/data_types.js');
const get_pieces = require('../operations/get_pieces.js');
const config = require('../operations/config.js');
const Query = require('./query.js');

/**
 * All functions in the database are defined in this class.
 * 
 * @param {String} name This value is the name of the table to be added to the table.
 * @returns
 */
function Table(name) {
    /**
     * This function is used to find data in the database.
     *
     * @param {Object} referance Finding datas from the database with reference value.
     * @param {Object} options This value is the options to be added to the database.
     * @param {Number} options.limit This value is the limit value to be added to the database.
     * @param {Array} options.selected_keys This value is the output keys to be added to the database.
     * @param {Object} options.likes This value is the like keys to be added to the database.
     * @returns
     * @example
     * 
     * find();
     * This example returns all data in the table.
     * 
     * find({ id: 1 });
     * This example returns the data with the id value of 1 in the table.
     * 
     * find({ id: 1 }, { limit: 10 });
     * This example returns the first 10 data with the id value of 1 in the table.
     * 
     * find(null, { selected_keys: ['name', 'surname'] });
     * This example returns all data with the name and surname values in the table.
     * 
     * find({ name: 'John', surname: 'Doe' });
     * This example returns the data with the name value of John and the surname value of Doe in the table.
     * 
     * find(null, { likes: { name: 'J?', surname: '?e' } });
     * This example returns all data with the name value starting with J and the surname value ending with e in the table.
     * 
     * find(null, { likes: { name: 'J...', surname: 'D..' } });
     * This example returns all data with the name value starting with J and having 4 characters and the surname value starting with D and having 2 characters in the table.
     */
    async function find(referance, options = { limit: null, selected_keys: [], likes: {} }) {
        let table = await TableFunctions(name).info();
        if (!table) {
            if (config.get.logingMode()) console.log('▲ easy-mssql: '.cyan + "Table information not found.");
            return false;
        }

        let { keys, values } = get_pieces(referance);
        let referanceString = keys.length > 0 ? `WHERE ${keys.map((m, i) => `${m} = ${values[i]}`).join(' AND ')}` : '';

        if (Object.keys(options.likes).length > 0) {
            let likes = Object.keys(options?.likes).map(m => `${m} LIKE '${options?.likes[m]?.replaceAll('?', '%')?.replaceAll('.', '_')}'`);
            referanceString += referanceString.length > 0 ? ` AND ${likes.join(' AND ')}` : `WHERE ${likes.join(' AND ')}`;
        }

        let columns = '*';
        if (Array.isArray(options.selected_keys) && options.selected_keys.length > 0) {
            columns = options.selected_keys.join(', ');
        }

        let limitString = (typeof options.limit === 'number' && options.limit > 0) ? `TOP ${options.limit} ` : '';
        let queryString = `SELECT ${limitString}${columns} FROM ${name} ${referanceString}`;

        let queryOutput = await Query(queryString);
        let data = queryOutput?.data || [];

        if (data.length > 0) {
            data = data.map(m => {
                let keys = Object.keys(m);
                let schemaControled = false;
                if (options?.selected_keys?.length > 0 && keys.length <= Object.keys(table?.schema || {}).length) schemaControled = true;
                if (!schemaControled && keys.length === Object.keys(table?.schema || {}).length) schemaControled = true;
                if (!schemaControled) return null;

                let new_data = {};
                keys.forEach(key => new_data[key] = data_types[table?.schema[key]](m[key]));
                return new_data;
            }).filter(f => f !== null);
        }

        return data;
    }

    /**
     * This function is used to find data in the database.
     * 
     * @param {Object} referance Finding data from the database with reference value.
     * @param {Object} options This value is the options to be added to the database.
     * @param {Array} options.selected_keys This value is the output keys to be added to the database.
     * @param {Object} options.likes This value is the like keys to be added to the database.
     * @returns
     */
    async function findOne(referance, options = { selected_keys: [], likes: {} }) {
        const findOption = { limit: 1, selected_keys: options.selected_keys, likes: options.likes };
        return (await find(referance, findOption))[0] || null;
    }

    /**
     * This function is used to add data to the database.
     *  
     * @param {Object} data This value is the data to be added to the database.
     * @returns
     */
    async function createOne(data) {
        const { keys, values } = get_pieces(data);
        const queryString = `INSERT INTO ${name} (${keys.join(', ')}) VALUES (${values.join(', ')})`;
        const queryOutput = await Query(queryString);
        return queryOutput?.status == 200;
    }

    /**
     * This function is used to update data in the database.
     * 
     * @param {Object} referance Updating data in database by reference value.
     * @param {Object} data This value is the data to be updated in the database.
     */
    async function updateOne(referance, data) {
        const { keys: refKeys, values: refValues } = get_pieces(referance);
        const { keys: dataKeys, values: dataValues } = get_pieces(data);

        if (refKeys.length === 0) {
            if (config.get.logingMode()) console.log('▲ easy-mssql: '.cyan + "No conditions provided for update");
            return false;
        }
        if (dataKeys.length === 0) {
            if (config.get.logingMode()) console.log('▲ easy-mssql: '.cyan + "No data provided for update");
            return false;
        }

        const isData = await findOne(referance);
        if (!isData) {
            if (config.get.logingMode()) console.log('▲ easy-mssql: '.cyan + "No data found for update");
            return false;
        }

        const conditions = refKeys.map((key, index) => `${key} = ${refValues[index]}`).join(' AND ');
        const setValues = dataKeys.map((key, index) => `${key} = ${dataValues[index]}`).join(', ');

        const queryString = `UPDATE ${name} SET ${setValues} WHERE ${conditions}`;
        const queryOutput = await Query(queryString);
        return queryOutput?.status == 200;
    }

    /**
     * This function is used to delete data in the database.
     * 
     * @param {Object} referance Deleting data in database by reference value.
     */
    async function deleteOne(referance) {
        const deleteOperation = await _deleteOne(referance);
        return deleteOperation?.status == 200;
    }

    /**
     * This function is used to delete data in the database.
     * 
     * @param {Object} referance Deleting data in database by reference value.
     */
    async function _deleteOne(referance) {
        const { keys, values } = get_pieces(referance);
        if (keys.length === 0) {
            if (config.get.logingMode()) console.log('▲ easy-mssql: '.cyan + "No conditions provided for delete");
            return false;
        }

        const conditions = keys.map((key, index) => `${key} = ${values[index]}`).join(' AND ');
        const queryString = `DELETE FROM ${name} WHERE ${conditions}`;
        return await Query(queryString);
    }

    /**
     * This function is used to delete all data in the database.
     * 
     * @param {Object} referance Deleting all data in database by reference value.
     */
    async function deleteAll(referance) {
        const datas = await find(referance);
        if (datas.length === 0) {
            if (config.get.logingMode()) console.log('▲ easy-mssql: '.cyan + "No data found for delete");
            return false;
        }

        const deletes = (await Promise.all(datas.map(async data => {
            var _data = {};
            Object.keys(data).filter(f => data[f] !== null).map(m => _data[m] = data[m]);
            return (await _deleteOne(_data));
        })));

        let output = {};
        const isComplated = deletes.filter(f => f?.status !== 200).length === 0;
        if (!isComplated) output = { status: 500, message: "An error occurred while deleting" };
        else output = { status: 200, message: "Success" };

        return output.status == 200;
    }

    return {
        find,
        findOne,
        createOne,
        updateOne,
        deleteOne,
        deleteAll,
        functions: TableFunctions(name)
    };
}

/**
 * All functions in the table are defined in this class.
 * 
 * @param {String} name This value is the name of the table to be added to the table.
 * @returns
 */
function TableFunctions(name) {
    /**
     * This function is used to add a scheme to the table in the database.
     * 
     * @param {Object} scheme This value is the scheme to be added to the database.
     * @returns
     */
    async function create(scheme) {
        const isThereTable = await isThere();
        if (isThereTable) return false;

        if (!scheme || Object.keys(scheme).length === 0) return false;
        const stringScheme = Object.keys(scheme).map(m => m + ' ' + scheme[m]).join(', ');

        const queryString = `CREATE TABLE ${name} (${stringScheme})`;
        return (await Query(queryString))?.status == 200 || false;
    }

    /**
     * 
     * @returns This function deletes the table in the database.
     */
    async function remove() {
        const isThereTable = await isThere();
        if (!isThereTable) return false;

        const queryString = `DROP TABLE ${name}`;
        return (await Query(queryString))?.status == 200 || false;
    }

    /**
     *
     * @returns This function checks if the table exists in the database.
     */
    async function isThere() {
        const queryString = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'${name}'`;
        const result = (await Query(queryString))?.data || [];
        return result.length > 0 ? true : false;
    }

    /**
     *
     * @returns This function returns information about the table in the database.
     */
    async function info() {
        const isThereTable = await isThere();
        if (!isThereTable) return false;
        const queryString = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'${name}'`;
        const result = (await Query(queryString))?.data || [];
        const catalog = result[0]?.TABLE_CATALOG;
        const table_name = result[0]?.TABLE_NAME;
        const schemaArray = result.map(m => ({ [m?.COLUMN_NAME]: m?.DATA_TYPE }));
        const schema = schemaArray.reduce((acc, cur) => { return { ...acc, ...cur } }, {});
        return { catalog, name: table_name, schema };
    }

    /**
     * 
     * @returns This function returns all tables in the database.
     */
    async function getAll() {
        const queryString = `SELECT * FROM INFORMATION_SCHEMA.TABLES`;
        const queryOutput = await Query(queryString);
        const tables = await Promise.all(queryOutput?.data.map(async table => {
            const data = Object.keys(table).map(m => ({ [m.toLowerCase().split('_').pop()]: table[m] })).reduce((acc, cur) => { return { ...acc, ...cur } }, {});
            const tableInfo = await Table(data?.name).functions.info();
            return { ...data, ...tableInfo };
        }));

        return tables;
    }

    /**
     * This function is used to update the column in the table in the database.
     * 
     * @param {String} columnName This value is the name of the column to be updated in the database.
     * @returns
     */
    async function updateColumn(columnName) {
        /**
         *
         * @param {*} type This value is the type of column to be added to the database.
         * @returns
         */
        async function add(type) {
            const isThereTable = await isThere();
            if (!isThereTable) return false;
            const queryString = `ALTER TABLE ${name} ADD ${columnName} ${type}`;
            return (await Query(queryString))?.status == 200 || false;
        }

        /**
         *
         * @returns This function deletes the column in the database.
         */
        async function remove() {
            const isThereTable = await isThere();
            if (!isThereTable) return false;
            const queryString = `ALTER TABLE ${name} DROP COLUMN ${columnName}`;
            return (await Query(queryString))?.status == 200 || false;
        }

        /**
         *
         * @param {*} newColumnName This value is the name of the column to be updated in the database.
         * @returns
         */
        async function rename(newColumnName) {
            const isThereTable = await isThere();
            if (!isThereTable) return false;
            const queryString = `EXEC sp_rename '${name}.${columnName}', '${newColumnName}', 'COLUMN'`;
            return (await Query(queryString))?.status == 200 || false;
        }

        /**
         *
         * @param {*} type This value is the type of column to be updated in the database.
         * @returns
         */
        async function update(type) {
            const isThereTable = await isThere();
            if (!isThereTable) return false;
            const queryString = `ALTER TABLE ${name} ALTER COLUMN ${columnName} ${type}`;
            return (await Query(queryString))?.status == 200 || false;
        }

        return { add, remove, rename, update };
    }

    return { create, remove, isThere, info, getAll, updateColumn };
}

module.exports = Table;