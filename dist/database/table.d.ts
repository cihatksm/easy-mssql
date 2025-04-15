import 'colors';
interface TableOptions {
    limit?: number | null;
    selected_keys?: string[];
    likes?: Record<string, string>;
}
interface TableSchema {
    [key: string]: string;
}
interface TableInfo {
    name: string;
    type: string;
    date: Date;
    schema: TableSchema;
}
interface TableReference {
    [key: string]: any;
}
interface TableData {
    [key: string]: any;
}
interface TableFunctions {
    create: (scheme: TableSchema) => Promise<boolean>;
    remove: () => Promise<boolean>;
    isThere: () => Promise<boolean>;
    info: () => Promise<TableInfo | null>;
    getAll: () => Promise<TableInfo[] | null>;
    updateColumn: (columnName: string) => {
        add: (type: string) => Promise<boolean>;
        remove: () => Promise<boolean>;
        rename: (newColumnName: string) => Promise<boolean>;
        update: (type: string) => Promise<boolean>;
    };
}
/**
 * All functions in the table are defined in this class.
 *
 * @param name - The name of the table to be added to the table
 * @returns Object containing table functions
 */
declare function TableFunctions(name: string): TableFunctions;
/**
 * All functions in the database are defined in this class.
 *
 * @param name - The name of the table to be added to the table
 * @returns Object containing table methods
 */
export declare function Table(name: string): {
    find: (referance?: TableReference, options?: TableOptions) => Promise<any[]>;
    findOne: (referance?: TableReference, options?: TableOptions) => Promise<any | null>;
    createOne: (data: TableData) => Promise<boolean>;
    updateOne: (referance: TableReference, data: TableData) => Promise<boolean>;
    deleteOne: (referance: TableReference) => Promise<boolean>;
    deleteAll: (referance?: TableReference) => Promise<boolean>;
    first: (referance?: TableReference, options?: TableOptions) => Promise<any | null>;
    firstOrDefault: (referance?: TableReference, options?: TableOptions) => Promise<any | null>;
    single: (referance?: TableReference, options?: TableOptions) => Promise<any>;
    singleOrDefault: (referance?: TableReference, options?: TableOptions) => Promise<any | null>;
    last: (referance?: TableReference, options?: TableOptions) => Promise<any | null>;
    lastOrDefault: (referance?: TableReference, options?: TableOptions) => Promise<any | null>;
    count: (referance?: TableReference, options?: TableOptions) => Promise<number>;
    min: (key: string, referance?: TableReference, options?: TableOptions) => Promise<number | null>;
    max: (key: string, referance?: TableReference, options?: TableOptions) => Promise<number | null>;
    average: (key: string, referance?: TableReference, options?: TableOptions) => Promise<number | null>;
    functions: TableFunctions;
};
export {};
