const express = require('express');
const app = express();
const path = require('path');
const infoRoutes = require('./routes/info.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const Usuario = require('./models/usuario.model');
const session = require('express-session');


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'mi_secreto_super_seguro',
    resave: false,
    saveUninitialized: false
}));

app.use('/usuarios', usuariosRoutes);
app.use('/info', infoRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const usuarios = Usuario.fetchAll();
    if (!req.session.visitas) {
        req.session.visitas = 1;
    } else {
        req.session.visitas++;
    }
    res.render('index', {
        usuarios: usuarios,
        usuarioActivo: req.session.usuario,
        visitas: req.session.visitas,
        title: 'Aegis Account',
        css: 'style.css',
        bodyClass: ''
    });
});

app.get('/lab5', (req, res) => {
    res.render('lab5', {
        title: 'Laboratorio 5',
        css: 'lab5.css',
        bodyClass: 'grey lighten-4'
    });

});

app.use((req, res) => {
    res.status(404).send('404 - Ruta no encontrada');
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send('Error interno del servidor');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});