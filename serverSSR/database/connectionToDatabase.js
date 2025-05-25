import mysql from 'mysql2/promise'
import 'dotenv/config';

const connection = await mysql.createConnection({
    host: process.env.database_HOST,
    user: process.env.database_USER,
    password: process.env.database_PASSWORD,
    database: process.env.database_NAME
});

export default connection;