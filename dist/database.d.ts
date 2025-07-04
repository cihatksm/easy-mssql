import 'colors';
import { Table } from './database/table';
import { Procedure } from './database/procedure';
/**
 * This class provides all database operations.
 * @file database.ts
 * @description This file contains the database operations.
 * @module
 */
declare class EasyMssql {
    Table: typeof Table;
    Procedure: typeof Procedure;
    Query: (query: string) => Promise<import("./database/query").QueryResult>;
    Types: import("./database/sql_types").SqlTypes;
    Connect: (sqlConfig: import("./operations/connect_to_server").SqlConfig, run?: import("./operations/connect_to_server").RunCallback) => Promise<boolean>;
    IsConnected: () => Promise<{
        status: number;
        message: string;
    }>;
    Config: {
        logingMode: (mode?: boolean) => void;
    };
}
declare const easyMssql: EasyMssql;
export = easyMssql;
