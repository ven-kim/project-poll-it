const mysql = require('mysql2');
const path = require('path/posix');

require('dotenv').config()

const env = process.env;

const db = mysql.createConnection({
    host: 'localhost',
    user: env.DB_USER,
    password: env.DB_PW,
    database: env.DB_NAME,
});

module.exports = db;

    