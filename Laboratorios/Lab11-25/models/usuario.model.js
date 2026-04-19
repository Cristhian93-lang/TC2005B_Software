const db = require('../util/database');
module.exports = class Usuario {

    constructor(username, password, foto = null, nombre = null, matricula = null, correo = null) {
        this.username = username;
        this.password = password;
        this.foto = foto;
        this.nombre = nombre;
        this.matricula = matricula;
        this.correo = correo;
        this.fecha = new Date();
    }

    save() {
        let connection;

        return db.getConnection()
        .then((conn) => {
            connection = conn;
            return connection.beginTransaction();
        })
        .then(() => {
            return connection.execute(
                `INSERT INTO usuarios (username, password, nombre, matricula, correo, foto, fecha)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    this.username,
                    this.password,
                    this.nombre,
                    this.matricula,
                    this.correo,
                    this.foto,
                    this.fecha,
                ]
            );
        })
        .then(([result]) => {
            return connection.execute(
                `INSERT INTO usuario_rol (id_usuario, id_rol)
                SELECT ?, id_rol
                FROM roles
                WHERE nombre = ?`,
                [result.insertId, 'usuario']
            );
        })
        .then(([result]) => {
            if (result.affectedRows === 0) {
                throw new Error('No se pudo asignar el rol inicial al usuario');
            }

            return connection.commit();
        })
        .then(() => {
            connection.release();
        })
        .catch((error) => {
            if (!connection) {
                throw error;
            }

            return connection.rollback()
            .catch(() => {})
            .then(() => {
                connection.release();
                throw error;
            });
        });
    }

    static fetchAll() {
        return db.execute(
            'SELECT * FROM usuarios'
        );
    }

    static findByUsername(username) {
        return db.execute(
            `SELECT u.id, u.username, u.password, u.nombre, u.matricula, u.correo, u.foto, r.nombre AS rol
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
            SELECT u.id, u.username, u.nombre, u.foto, u.fecha, COALESCE(r.nombre, 'sin rol') AS rol
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
        let connection;

        return db.getConnection()
        .then((conn) => {
            connection = conn;
            return connection.beginTransaction();
        })
        .then(() => {
            return connection.execute(
                'DELETE FROM usuario_rol WHERE id_usuario = ?',
                [idUsuario]
            );
        })
        .then(() => {
            return connection.execute(
                'INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)',
                [idUsuario, idRol]
            );
        })
        .then(() => {
            return connection.commit();
        })
        .then(() => {
            connection.release();
        })
        .catch((error) => {
            if (!connection) {
                throw error;
            }

            return connection.rollback()
            .catch(() => {})
            .then(() => {
                connection.release();
                throw error;
            });
        });
    }

    static updateFoto(username, foto) {
        return db.execute(
            'UPDATE usuarios SET foto = ? WHERE username = ?',
            [foto, username]
        );
    }

    static fetchProfileByUsername(username) {
        return db.execute(
            `SELECT id, username, nombre, matricula, correo, foto, fecha
            FROM usuarios
            WHERE username = ?`,
            [username]
        );
    }

    static updateProfile(username, profileData) {
        return db.execute(
            `UPDATE usuarios
            SET nombre = ?, matricula = ?, correo = ?, foto = ?
            WHERE username = ?`,
            [
                profileData.nombre,
                profileData.matricula,
                profileData.correo,
                profileData.foto,
                username,
            ]
        );
    }
};
