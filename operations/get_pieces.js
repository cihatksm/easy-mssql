/**
 * This function is used to fix the data to be added to the database.
 * 
 * @param {Object} data This value is the data to be fixed.
 * @returns
 */
module.exports = (data = {}) => {
    var datas = { keys: [], values: [] };

    for (const key in data) {
        if (typeof data[key] === 'bigint') data[key] = data[key].toString();
    }

    const dataString = JSON.stringify(data);
    if (!data || typeof data !== 'object' || !dataString?.startsWith('{') || !dataString?.endsWith('}')) return datas;
    
    datas.keys = Object?.keys(data) || [];
    datas.values = Object?.values(data)?.map(v => prepare_value(`'${v}'`)) || [];
    datas.values = datas.values.map(value => value == 'NULL' ? value : `'${value.slice(1, -1).replaceAll(`\'`, `\'\'`)}'`);

    return datas;
}

/**
 * This function is used to prepare the value to be added to the database.
 * 
 * @param {String} value This value is the value to be prepared.
 * @returns
 */
function prepare_value(value) {
    const values = [
        { x: `'undefined'`, y: `NULL` },
        { x: `'NaN'`, y: `NULL` },
        { x: `'null'`, y: `NULL` },
        { x: `'true'`, y: `'1'` },
        { x: `'false'`, y: `'0'` }
    ];

    return values.reduce((acc, cur) => acc.replace(cur.x, cur.y), value);
}