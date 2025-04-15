import * as sql from 'mssql';
import 'colors';
export interface SqlConfig extends sql.config {
    user: string;
    password: string;
    server: string;
    database: string;
    options?: {
        encrypt?: boolean;
        [key: string]: any;
    };
}
type RunCallback = (sqlConfig: SqlConfig, err?: Error) => void;
/**
 * This function is used to connect to the database.
 *
 * @param sqlConfig - The SQL configuration to connect to the database
 * @param run - Optional callback function to be executed after the connection is established
 * @returns Promise<boolean> - Returns true if connection is successful, false otherwise
 */
export declare const connectToServer: (sqlConfig: SqlConfig, run?: RunCallback) => Promise<boolean>;
export {};
