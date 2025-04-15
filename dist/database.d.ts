import 'colors';
import { Table } from './database/table';
import { Procedure } from './database/procedure';
/**
 * This export is used to fix the data to be sent to the database.
 * @file database.ts
 * @description This file contains the database operations.
 * @module
 */
export declare const database: {
    Table: typeof Table;
    Procedure: typeof Procedure;
    Query: (query: string) => Promise<import("./database/query").QueryResult>;
    Types: import("./database/sql_types").SqlTypes;
    Connect: (sqlConfig: import("./operations/connect_to_server").SqlConfig, run?: (sqlConfig: import("./operations/connect_to_server").SqlConfig, err?: Error) => void) => Promise<boolean>;
    SetConfig: {
        logingMode: (mode?: boolean) => void;
    };
};
