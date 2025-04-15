"use strict";
/**
 * This object contains the SQL data types.
 * @file sql_types.ts
 * @description This file contains the SQL data types.
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlTypes = void 0;
exports.sqlTypes = {
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
    options: {
        notNull: () => ' ' + 'NOT NULL',
        primaryKey: () => ' ' + 'PRIMARY KEY',
        unique: () => ' ' + 'UNIQUE',
        autoIncrement: () => ' ' + 'IDENTITY(1,1)',
        default: (value) => value !== undefined ? (' ' + `DEFAULT ${value}`) : '',
        check: (value) => value !== undefined ? (' ' + `CHECK(${value})`) : '',
        foreignKey: (table, column) => table !== undefined && column !== undefined ? (' ' + `FOREIGN KEY (${column}) REFERENCES ${table}(${column})`) : ''
    }
};
//# sourceMappingURL=sql_types.js.map