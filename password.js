// const password = '';
const mysql = require('mysql2');

require('dotenv').config();

const conPassword = mysql.createConnection(
    { host: 'localhost', user: 'root', password: process.env.MYSQL_PASSWORD, database: 'employee_db' }
);

module.exports = conPassword;