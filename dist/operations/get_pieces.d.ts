interface DataPieces {
    keys: string[];
    values: string[];
}
/**
 * This function is used to fix the data to be added to the database.
 *
 * @param data - The data to be fixed
 * @returns DataPieces - An object containing the keys and values
 */
export declare const getPieces: (data?: Record<string, any>) => DataPieces;
export {};
