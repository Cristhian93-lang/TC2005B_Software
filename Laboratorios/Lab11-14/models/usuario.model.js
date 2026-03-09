const db = require('../util/database');

module.exports = class Usuario {
    constructor(password) {
        this.password = password;
        this.fecha = new Date();
    }

    save() {
        return db.execute(
            'INSERT INTO usuarios (password, fecha) VALUES (?, ?)',
            [this.password, this.fecha]
        );
    }

    static fetchAll() {
        return db.execute(
            'SELECT * FROM usuarios'
        );
    }

    static delete(password) {
        return db.execute(
            'DELETE FROM usuarios WHERE password = ?',
            [password]
        );
    }

    static findById(id) {
        return db.execute(
            'SELECT * FROM usuarios WHERE id = ?',
            [id]
        );
    }

    static updatePassword(id, password) {
        return db.execute(
            'UPDATE usuarios SET password = ? WHERE id = ?',
            [password, id]
        );
    }
};