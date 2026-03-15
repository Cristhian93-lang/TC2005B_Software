const db = require('../util/database');
module.exports = class Usuario {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.fecha = new Date();
    }

    save() {
        return db.execute(
            'INSERT INTO usuarios (username, password, fecha) VALUES (?, ?, ?)',
            [this.username, this.password, this.fecha]
        );
    }

    static fetchAll() {
        return db.execute(
            'SELECT * FROM usuarios'
        );
    }

    static findByUsername(username) {
        return db.execute(
            'SELECT * FROM usuarios WHERE username = ?',
            [username]
        );
    }
};