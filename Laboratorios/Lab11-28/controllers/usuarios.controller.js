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
    const nombre = req.body.nombre || null;
    const matricula = req.body.matricula || null;
    const correo = req.body.correo || null;
    const foto = req.file ? `/${req.file.path.replace(/\\/g, '/')}` : null;
    if (!username || !password) {
        return res.redirect('/usuarios/signup');
    }
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const usuario = new Usuario(
            username,
            hashedPassword,
            foto,
            nombre,
            matricula,
            correo
        );
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
            req.session.foto = usuario.foto;
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

exports.postActualizarRolAjax = (req, res, next) => {
    const idUsuario = req.body.id_usuario;
    const idRol = req.body.id_rol;

    if (!idUsuario || !idRol) {
        return res.status(400).json({
            message: 'Faltan datos para actualizar el rol',
        });
    }

    Usuario.fetchRoles()
    .then(([roles]) => {
        const rolSeleccionado = roles.find(rol => String(rol.id_rol) === String(idRol));

        if (!rolSeleccionado) {
            return res.status(404).json({
                message: 'El rol seleccionado no existe',
            });
        }

        return Usuario.updateUserRole(idUsuario, idRol)
        .then(() => {
            res.status(200).json({
                message: 'Rol actualizado correctamente',
                rol: rolSeleccionado.nombre,
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'No se pudo actualizar el rol del usuario',
        });
    });
};

exports.postActualizarFoto = (req, res, next) => {
    if (!req.file) {
        return res.redirect('/lab5');
    }

    const foto = `/${req.file.path.replace(/\\/g, '/')}`;

    Usuario.updateFoto(req.session.usuario, foto)
    .then(() => {
        req.session.foto = foto;
        req.session.save(err => {
            if (err) {
                console.log(err);
            }
            res.redirect('/lab5');
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('No se pudo actualizar la foto del perfil');
    });
};

exports.getLab5 = (req, res, next) => {
    Usuario.fetchProfileByUsername(req.session.usuario)
    .then(([rows]) => {
        const perfil = rows[0];
        res.render('lab5', {
            title: 'Laboratorio 5',
            css: 'lab5.css',
            bodyClass: 'grey lighten-4',
            extraJS: 'google-calendar.js',
            usuario: req.session.usuario,
            rol: req.session.rol,
            perfil,
            googleCalendarConfig: {
                apiKey: process.env.GOOGLE_CALENDAR_API_KEY || '',
                clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID || '',
                discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
                scope: 'https://www.googleapis.com/auth/calendar.readonly',
                calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
            },
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('No se pudo cargar el perfil');
    });
};

exports.getLab28 = (req, res, next) => {
    res.render('lab28', {
        title: 'Laboratorio 28 - Triggers',
        css: 'lab5.css',
        bodyClass: 'grey lighten-4',
        useMaterialize: true,
        usuario: req.session.usuario,
        rol: req.session.rol,
    });
};

exports.getEditarPerfil = (req, res, next) => {
    Usuario.fetchProfileByUsername(req.session.usuario)
    .then(([rows]) => {
        res.render('editar-perfil', {
            title: 'Editar perfil',
            css: 'style.css',
            bodyClass: 'grey lighten-4',
            useMaterialize: true,
            perfil: rows[0],
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('No se pudo cargar la vista de perfil');
    });
};

exports.postEditarPerfilAjax = (req, res, next) => {
    const nombre = req.body.nombre || null;
    const matricula = req.body.matricula || null;
    const correo = req.body.correo || null;

    Usuario.fetchProfileByUsername(req.session.usuario)
    .then(([rows]) => {
        const perfilActual = rows[0];

        return Usuario.updateProfile(req.session.usuario, {
            nombre,
            matricula,
            correo,
            foto: perfilActual.foto,
        });
    })
    .then(() => {
        return res.status(200).json({
            message: 'Perfil actualizado correctamente',
            perfil: {
                username: req.session.usuario,
                nombre,
                matricula,
                correo,
            },
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'No se pudo actualizar el perfil',
        });
    });
};

exports.postEditarPerfil = (req, res, next) => {
    const nombre = req.body.nombre || null;
    const matricula = req.body.matricula || null;
    const correo = req.body.correo || null;

    Usuario.fetchProfileByUsername(req.session.usuario)
    .then(([rows]) => {
        const perfilActual = rows[0];
        const foto = req.file
            ? `/${req.file.path.replace(/\\/g, '/')}`
            : perfilActual.foto;

        return Usuario.updateProfile(req.session.usuario, {
            nombre,
            matricula,
            correo,
            foto,
        })
        .then(() => {
            req.session.foto = foto;
            return req.session.save(err => {
                if (err) {
                    console.log(err);
                }
                res.redirect('/lab5');
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('No se pudo actualizar el perfil');
    });
};
