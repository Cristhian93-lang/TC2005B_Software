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
        )
        .then(([result]) => {
            return db.execute(
                `INSERT INTO usuario_rol (id_usuario, id_rol)
                SELECT ?, id_rol
                FROM roles
                WHERE nombre = ?`,
                [result.insertId, 'usuario']
            );
        });
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

    static fetchUsersWithRoles() {
        return db.execute(`
            SELECT u.id, u.username, u.fecha, COALESCE(r.nombre, 'sin rol') AS rol
            FROM usuarios u
            LEFT JOIN usuario_rol ur ON u.id = ur.id_usuario
            LEFT JOIN roles r ON ur.id_rol = r.id_rol
            ORDER BY u.id ASC
        `);
    }

    static fetchRoles() {
        return db.execute(`
            SELECT id_rol, nombre
            FROM roles
            ORDER BY id_rol ASC
        `);
    }

    static updateUserRole(idUsuario, idRol) {
        return db.execute(
            'DELETE FROM usuario_rol WHERE id_usuario = ?',
            [idUsuario]
        )
        .then(() => {
            return db.execute(
                'INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)',
                [idUsuario, idRol]
            );
        });
    }
};
