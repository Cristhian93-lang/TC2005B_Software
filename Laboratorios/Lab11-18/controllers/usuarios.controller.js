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
        .then(result => {
            if (!result) {
                return res.redirect('/usuarios/login');
            }
            req.session.isLoggedIn = true;
            req.session.usuario = usuario.username;
            return req.session.save(err => {
                res.redirect('/lab5');
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
        res.redirect('/usuarios/login');
    });

};