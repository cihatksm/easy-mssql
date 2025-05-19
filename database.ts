import 'colors';
import { Table } from './database/table';
import { Procedure } from './database/procedure';
import { Query } from './database/query';
import { sqlTypes } from './database/sql_types';
import { connectToServer } from './operations/connect_to_server';
import { config } from './operations/config';

/**
 * This class provides all database operations.
 * @file database.ts
 * @description This file contains the database operations.
 * @module
 */
class EasyMssql {
    Table = Table;
    Procedure = Procedure;
    Query = Query;
    Types = sqlTypes;
    Connect = connectToServer;
    Config = config.set;
}

export default new EasyMssql(); 