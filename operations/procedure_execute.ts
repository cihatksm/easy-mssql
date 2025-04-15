import * as sql from 'mssql';
import { config } from './config';
import 'colors';

interface ProcedureResult {
    status: number;
    message: string;
    data: any[] | null;
}

interface ProcedureReference {
    [key: string]: any;
}

/**
 * This function is used to execute the procedure in the database
 * 
 * @param procedureName - The name of the procedure to be executed in the database
 * @param referance - The reference parameters to be executed in the database
 * @returns Promise<ProcedureResult> - The result of the procedure execution
 */
export const executeProcedure = async (
    procedureName: string,
    referance: ProcedureReference = {}
): Promise<ProcedureResult> => {
    return await new Promise<ProcedureResult>((resolve) => {
        const request = new sql.Request();

        try {
            for (const key of Object.keys(referance)) {
                const value = referance[key];
                request.input(key, value);
            }

            request.execute(procedureName)
                .then(result => {
                    resolve({ status: 200, message: 'Success', data: result?.recordset });
                })
                .catch(err => {
                    if (config.get.logingMode()) {
                        console.log(`▲ easy-mssql / Procedure / ${procedureName} : ${err.message}`.yellow);
                        console.error(err);
                    }
                    resolve({ status: 500, message: 'Error', data: null });
                });
        } catch (err) {
            if (config.get.logingMode()) {
                console.log(`▲ easy-mssql / Procedure / ${procedureName} : ${err instanceof Error ? err.message : String(err)}`.yellow);
                console.error(err);
            }

            resolve({ status: 501, message: 'Error', data: null });
        }
    });
}; 