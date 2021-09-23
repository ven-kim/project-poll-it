const mysql = require('mysql2');
require('dotenv').config()

const env = process.env;

const db = mysql.createConnection({
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || 'Javamancod321!',
    database: env.DB_NAME || 'chatroom',
});

module.exports = db;

    