const Usuario = require('../models/usuario.model');
exports.getUsuarios = (req, res) => {
    if (!req.session.visitas) {
        req.session.visitas = 1;
    } else {
        req.session.visitas++;
    }
    Usuario.fetchAll()
    .then(([rows]) => {
    console.log(rows);
        console.log("USUARIOS EN MYSQL:", rows);
        res.render('index', {
            usuarios: rows,
            usuarioActivo: req.session.usuario,
            visitas: req.session.visitas,
            title: 'Aegis Account',
            css: 'style.css',
            bodyClass: ''
        });
    })
    .catch(err => {
        console.log("ERROR MYSQL:", err);
        res.send("Error en base de datos");
    });
};

exports.addUsuario = (req, res) => {
    const usuario = new Usuario(req.body.password);
    usuario.save()
    .then(() => {
        res.redirect('/');
    })
    .catch(err => console.log(err));
};

exports.eliminarUsuario = (req, res) => {
    Usuario.delete(req.body.password)
    .then(() => {
        res.redirect('/');
    })
    .catch(err => console.log(err));
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};