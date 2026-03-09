const Usuario = require('../models/usuario.model');
exports.getUsuarios = (req, res) => {
    const usuarios = Usuario.fetchAll();
    res.render('index', {
        usuarios: usuarios
    });

};

exports.addUsuario = (req, res) => {
    const usuario = new Usuario(req.body);
    usuario.save();
    res.redirect('/');
};

exports.eliminarUsuario = (req, res) => {
    Usuario.delete(req.body.password);
    res.redirect('/');
};