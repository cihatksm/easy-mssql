import 'colors';
import { Table } from './database/table';
import { Procedure } from './database/procedure';
import { Query } from './database/query';
import * as sqlTypes from './database/sql_types';
import { connectToServer } from './operations/connect_to_server';
import * as config from './operations/config';

/**
 * This export is used to fix the data to be sent to the database.
 * @file database.ts
 * @description This file contains the database operations.
 * @module
 */
export const database = {
    Table,
    Procedure,
    Query,
    Types: sqlTypes,
    Connect: connectToServer,
    Config: config
}; 