import * as sql from 'mssql';
import { config } from '../operations/config';
import 'colors';

export interface QueryResult {
    status: number;
    message: string;
    data: any[] | null;
}

/**
 * This function is used to execute the query in the database
 * 
 * @param query - The query to be executed in the database
 * @returns Promise<QueryResult> - The result of the query execution
 */
export const Query = async (query: string): Promise<QueryResult> => {
    return await new Promise<QueryResult>((resolve) => {
        const request = new sql.Request();
        try {
            request.query(query, (err, result) => {
                if (err) {
                    if (config.get.logingMode()) console.log(`▲ easy-mssql / Query / ${query} : ${err.message}`.yellow);
                    resolve({ status: 500, message: 'Error: ' + err, data: null });
                } else {
                    resolve({ status: 200, message: 'Success', data: result?.recordset || null });
                }
            });
        } catch (err) {
            if (config.get.logingMode()) console.log(`▲ easy-mssql / Query / ${query} : ${err instanceof Error ? err.message : String(err)}`.yellow);
            resolve({ status: 501, message: 'Error: ' + err, data: null });
        }
    });
}; 