const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const usuariosRoutes = require('./routes/usuarios.routes');
const infoRoutes = require('./routes/info.routes');
const isAuth = require('./util/is-auth');
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'mi_secreto_super_seguro',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.usuario = req.session.usuario;
    res.locals.rol = req.session.rol;
    res.locals.privilegios = req.session.privilegios || [];
    next();

});

app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/usuarios', usuariosRoutes);
app.use('/info', infoRoutes);

app.get('/', (req, res) => {
    res.redirect('/usuarios/login');
});

app.get('/lab5',
isAuth.isAuth,
(req, res) => {
    res.render('lab5', {
        title: 'Laboratorio 5',
        css: 'lab5.css',
        bodyClass: 'grey lighten-4',
        usuario: req.session.usuario,
        rol: req.session.rol
    });
});
app.use((req, res) => {
    res.status(404).send('404 - Ruta no encontrada');
});

app.use((error, req, res, next) => {
    console.error('ERROR EN EL SERVIDOR:');
    console.error(error);
    res.status(500).send(error.message);
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});