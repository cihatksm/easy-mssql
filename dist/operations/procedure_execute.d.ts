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
export declare const executeProcedure: (procedureName: string, referance?: ProcedureReference) => Promise<ProcedureResult>;
export {};
