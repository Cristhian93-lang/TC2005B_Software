const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const usuariosRoutes = require('./routes/usuarios.routes');
const infoRoutes = require('./routes/info.routes');
const isAuth = require('./util/is-auth');
const usuariosController = require('./controllers/usuarios.controller');
const fileUpload = require('./util/file-upload');
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload.single('foto'));

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
    res.locals.foto = req.session.foto || null;
    next();

});

app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/usuarios', usuariosRoutes);
app.use('/info', infoRoutes);

app.get('/', (req, res) => {
    res.redirect('/usuarios/login');
});

app.get('/lab5',
isAuth.isAuth,
usuariosController.getLab5
);

app.get('/lab28',
isAuth.isAuth,
usuariosController.getLab28
);
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
