/**
 * This class is used to create an object of any data type.
 */
class Any {
    AnyConstructor(value) {
        this.value = value;
    }
}

/**
 * This function is used to check if the value is null.
 * 
 * @param {*} value This value is the data to be checked.
 * @returns 
 */
const isNull = (value) => value === null ? true : false;

/**
 * This function is used to set the output format of the query result.
 */
const types = {
    /**
     * This function is used to convert the value to the specified data type.
     * @param {String} value This value is the data type to be converted.
     */
    string: (value) => {
        return isNull(value) ? null : String(value);
    },
    /**
     * This function is used to convert the value to the specified data type.
     * @param {Number} value This value is the data type to be converted.
     */
    number: (value) => {
        return isNull(value) ? null : Number(value);
    },
    /**
     * This function is used to convert the value to the specified data type.
     * @param {Boolean} value This value is the data type to be converted.
     */
    boolean: (value) => {
        return isNull(value) ? null : Boolean(value);
    },
    /**
     * This function is used to convert the value to the specified data type.
     * @param {Date} value This value is the data type to be converted.
     */
    date: (value) => {
        return isNull(value) ? null : new Date(value);
    },
    /**
     * This function is used to convert the value to the specified data type.
     * @param {Buffer} value This value is the data type to be converted.
     */
    buffer: (value) => {
        return isNull(value) ? null : Buffer.from(value);
    },
    /**
     * This function is used to convert the value to the specified data type.
     * @param {Array} value This value is the data type to be converted.
     */
    array: (value) => {
        return isNull(value) ? null : Array(value);
    },
    /**
     * This function is used to convert the value to the specified data type.
     * @param {*} value This value is the data type to be converted.
     */
    any: (value) => {
        return isNull(value) ? null : new Any(value);
    }
}

/**
 * This file contains the data types of SQL Server and their corresponding JavaScript data types.
 */
module.exports = {
    "char": types.string,
    "varchar": types.string,
    "text": types.string,
    "nchar": types.string,
    "nvarchar": types.string,
    "ntext": types.string,
    "binary": types.buffer,
    "varbinary": types.buffer,
    "image": types.buffer,
    "bit": types.boolean,
    "tinyint": types.number,
    "smallint": types.number,
    "int": types.number,
    "bigint": types.number,
    "decimal": types.number,
    "numeric": types.number,
    "smallmoney": types.number,
    "money": types.number,
    "float": types.number,
    "real": types.number,
    "datetime": types.date,
    "datetime2": types.date,
    "smalldatetime": types.date,
    "date": types.date,
    "time": types.string,
    "datetimeoffset": types.string,
    "timestamp": types.buffer,
    "uniqueidentifier": types.string,
    "xml": types.string,
    "table": types.array,
    "cursor": types.any,
    "sql_variant": types.any,
}