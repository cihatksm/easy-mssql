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
export declare const Query: (query: string) => Promise<QueryResult>;
