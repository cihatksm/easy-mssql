import { SqlConfig } from '../operations/connect_to_server';

export const sqlConfig: SqlConfig = {
    user: 'sa',
    password: 'YourStrong@Passw0rd',
    server: 'localhost',
    database: 'master',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}; 