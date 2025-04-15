interface DataPieces {
    keys: string[];
    values: string[];
}

interface ValueReplacement {
    x: string;
    y: string;
}

/**
 * This function is used to fix the data to be added to the database.
 * 
 * @param data - The data to be fixed
 * @returns DataPieces - An object containing the keys and values
 */
export const getPieces = (data: Record<string, any> = {}): DataPieces => {
    const datas: DataPieces = { keys: [], values: [] };

    for (const key in data) {
        if (typeof data[key] === 'bigint') {
            data[key] = data[key].toString();
        }
    }

    const dataString = JSON.stringify(data);
    if (!data || typeof data !== 'object' || !dataString?.startsWith('{') || !dataString?.endsWith('}')) {
        return datas;
    }

    datas.keys = Object.keys(data) || [];
    datas.values = Object.values(data)?.map(v => prepareValue(`'${v}'`)) || [];
    datas.values = datas.values.map(value => value === 'NULL' ? value : `'${value.slice(1, -1).replaceAll(`\'`, `\'\'`)}'`);

    return datas;
};

/**
 * This function is used to prepare the value to be added to the database.
 * 
 * @param value - The value to be prepared
 * @returns string - The prepared value
 */
function prepareValue(value: string): string {
    const values: ValueReplacement[] = [
        { x: `'undefined'`, y: `NULL` },
        { x: `'NaN'`, y: `NULL` },
        { x: `'null'`, y: `NULL` },
        { x: `'true'`, y: `'1'` },
        { x: `'false'`, y: `'0'` }
    ];

    return values.reduce((acc, cur) => acc.replace(cur.x, cur.y), value);
} 