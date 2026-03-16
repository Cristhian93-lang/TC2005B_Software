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
            `SELECT u.id, u.username, u.password, r.nombre AS rol
            FROM usuarios u
            JOIN usuario_rol ur ON u.id = ur.id_usuario
            JOIN roles r ON ur.id_rol = r.id_rol
            WHERE u.username = ?`,
            [username]
        );
    }

    static getPrivilegios(username) {
    return db.execute(`
        SELECT p.accion
        FROM usuarios u
        JOIN usuario_rol ur ON u.id = ur.id_usuario
        JOIN roles r ON ur.id_rol = r.id_rol
        JOIN rol_privilegio rp ON r.id_rol = rp.id_rol
        JOIN privilegios p ON rp.id_privilegio = p.id_privilegio
        WHERE u.username = ?
    `, [username]);
    }
};