const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

exports.getLogin = (req, res, next) => {
    res.render('login', {
        title: 'Login',
        useMaterialize: true
    });
};

exports.getSignup = (req, res, next) => {
    res.render('signup', {
        title: 'Crear cuenta',
        useMaterialize: true
    });
};

exports.postSignup = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.redirect('/usuarios/signup');
    }
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const usuario = new Usuario(username, hashedPassword);
        return usuario.save();
    })
    .then(() => {
        res.redirect('/usuarios/login');

    })
    .catch(err => {
        console.log(err);
        res.redirect('/usuarios/signup');

    });
};

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    Usuario.findByUsername(username)
    .then(([rows]) => {
        if (rows.length === 0) {
            return res.redirect('/usuarios/login');
        }
        const usuario = rows[0];
        return bcrypt.compare(password, usuario.password)
        .then(match => {
            if (!match) {
                return res.redirect('/usuarios/login');
            }
            req.session.isLoggedIn = true;
            req.session.usuario = usuario.username;
            req.session.rol = usuario.rol;
            return Usuario.getPrivilegios(usuario.username)
            .then(([privRows]) => {
                const privilegios = privRows.map(p => p.accion);
                req.session.privilegios = privilegios;
                return req.session.save(err => {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/lab5');
                });
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/usuarios/login');
    });
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/usuarios/login');
    });
};

exports.getAdminPanel = (req, res, next) => {
    Promise.all([
        Usuario.fetchUsersWithRoles(),
        Usuario.fetchRoles(),
    ])
    .then(([[usuarios], [roles]]) => {
        res.render('admin', {
            title: 'Panel administrador',
            css: 'style.css',
            bodyClass: 'grey lighten-4',
            useMaterialize: true,
            usuarios,
            roles,
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('No se pudo cargar el panel administrador');
    });
};

exports.postActualizarRol = (req, res, next) => {
    const idUsuario = req.body.id_usuario;
    const idRol = req.body.id_rol;

    if (!idUsuario || !idRol) {
        return res.redirect('/usuarios/admin');
    }

    Usuario.updateUserRole(idUsuario, idRol)
    .then(() => {
        res.redirect('/usuarios/admin');
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('No se pudo actualizar el rol del usuario');
    });
};
