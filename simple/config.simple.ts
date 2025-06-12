import { SqlConfig } from '../operations/connect_to_server';

export const sqlConfig: SqlConfig = {
    user: 'user',
    password: 'password',
    server: '1.2.3.4',
    database: 'database',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}; 