import * as sql from 'mssql';
import { config } from './config';
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
export const connectToServer = async (sqlConfig: SqlConfig, run?: RunCallback): Promise<boolean> => {
    if (!sqlConfig || typeof sqlConfig !== 'object') {
        if (config.get.logingMode()) console.log(`▲ easy-mssql / Connection / The sqlConfig parameter is not an object.`.yellow);
        return false;
    }

    const required: Record<string, string> = { user: "string", password: "string", server: "string", database: "string" };
    for (const key in required) {
        if (!sqlConfig[key as keyof SqlConfig] || typeof sqlConfig[key as keyof SqlConfig] !== required[key]) {
            if (config.get.logingMode()) console.log(`▲ easy-mssql / Connection / The ${key} parameter is not a ${required[key]}.`.yellow);
            return false;
        }
    }

    if (!sqlConfig.options || !sqlConfig.options?.encrypt || typeof sqlConfig.options !== 'object' || typeof sqlConfig.options?.encrypt !== 'boolean') {
        sqlConfig.options = { ...sqlConfig.options, encrypt: false };
    }

    const maxRetries = 3;
    const retryInterval = 2500; // 2.5 seconds in milliseconds
    let retryCount = 0;

    const tryConnect = async (): Promise<boolean> => {
        try {
            return await new Promise<boolean>((resolve) => {
                sql.connect(sqlConfig, (err?: Error) => {
                    if (run && typeof run === 'function') {
                        run(sqlConfig, err);
                        return;
                    }
                    if (err) {
                        if (config.get.logingMode()) console.log(`▲ easy-mssql / Connection / Attempt ${retryCount + 1}: ${err.message}`.yellow);
                        resolve(false);
                    } else {
                        if (config.get.logingMode()) console.log(`▲ easy-mssql / Connection / Success`.yellow);
                        resolve(true);
                    }
                });
            });
        } catch (err) {
            if (config.get.logingMode()) console.log(`▲ easy-mssql / Connection / Attempt ${retryCount + 1}: ${err instanceof Error ? err.message : String(err)}`.yellow);
            if (run && typeof run === 'function') {
                run(sqlConfig, err instanceof Error ? err : new Error(String(err)));
                return false;
            }
            return false;
        }
    };

    while (retryCount < maxRetries) {
        const result = await tryConnect();
        if (result) return true;

        retryCount++;
        if (retryCount < maxRetries) {
            if (config.get.logingMode()) console.log(`▲ easy-mssql / Connection / Retrying in 2.5 seconds... (Attempt ${retryCount + 1}/${maxRetries})`.yellow);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
    }

    if (config.get.logingMode()) console.log(`▲ easy-mssql / Connection / Failed after ${maxRetries} attempts`.yellow);
    return false;
}; 