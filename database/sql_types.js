/**
 * This object contains the SQL data types.
 * @file sql_types.js
 * @description This file contains the SQL data types.
 * @module
 */
module.exports = {
    varchar: (length = 255) => typeof length === 'number' ? `VARCHAR(${length})` : 'VARCHAR(255)',
    int: () => 'INT',
    bigint: () => 'BIGINT',
    smallint: () => 'SMALLINT',
    tinyint: () => 'TINYINT',
    bit: () => 'BIT',
    float: () => 'FLOAT',
    real: () => 'REAL',
    decimal: (precision = 18, scale = 0) => typeof precision === 'number' && typeof scale === 'number' ? `DECIMAL(${precision}, ${scale})` : 'DECIMAL(18, 0)',
    numeric: () => 'NUMERIC',
    money: () => 'MONEY',
    smallmoney: () => 'SMALLMONEY',
    date: () => 'DATE',
    time: () => 'TIME',
    datetime: () => 'DATETIME',
    datetime2: () => 'DATETIME2',
    smalldatetime: () => 'SMALLDATETIME',
    timestamp: () => 'TIMESTAMP',
    char: () => 'CHAR',
    nchar: () => 'NCHAR',
    text: () => 'TEXT',
    ntext: () => 'NTEXT',
    binary: () => 'BINARY',
    varbinary: () => 'VARBINARY',
    image: () => 'IMAGE',
    uniqueidentifier: () => 'UNIQUEIDENTIFIER',
    sql_variant: () => 'SQL_VARIANT',
    xml: () => 'XML',
    /**
     * This object contains the SQL data type options.
     * @file sql_types.js
     * @description This file contains the SQL data type options.
     * @module
     * @property {function} notNull This function is used to create a NOT NULL constraint.
     * @property {function} primaryKey This function is used to create a PRIMARY KEY constraint.
     * @property {function} unique This function is used to create a UNIQUE constraint.
     * @property {function} autoIncrement This function is used to create an AUTO_INCREMENT constraint.
     * @property {function} default This function is used to create a DEFAULT constraint.
     * @property {function} check This function is used to create a CHECK constraint.
     * @property {function} foreignKey This function is used to create a FOREIGN KEY constraint.
     * @returns
     */
    options: {
        notNull: () => ' ' + 'NOT NULL',
        primaryKey: () => ' ' + 'PRIMARY KEY',
        unique: () => ' ' + 'UNIQUE',
        autoIncrement: () => ' ' + 'IDENTITY(1,1)',
        default: (value = null) => value !== null ? (' ' + `DEFAULT ${value}`) : '',
        check: (value = null) => value !== null ? (' ' + `CHECK(${value})`) : '',
        foreignKey: (table = null, column = null) => table !== null && column !== null ? (' ' + `FOREIGN KEY (${column}) REFERENCES ${table}(${column})`) : ''
    }
};