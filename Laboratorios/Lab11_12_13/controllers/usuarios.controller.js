const Usuario = require('../models/usuario.model');
exports.getUsuarios = (req, res) => {
    const usuarios = Usuario.fetchAll();
    res.render('index', {
        usuarios: usuarios
    });

};
exports.addUsuario = (req, res) => {
    const usuario = new Usuario(req.body.nombre);
    usuario.save();
    res.redirect('/');
};