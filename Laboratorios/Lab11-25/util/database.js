const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    database: 'aegis_account',
    password: 'VIery2006@'
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log("ERROR CONECTANDO A MYSQL:");
        console.log(err);
    } else {
        console.log("MYSQL CONECTADO");
        connection.release();
    }
});

module.exports = pool.promise();