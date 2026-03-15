const express = require('express');
const app = express();
const path = require('path');
const infoRoutes = require('./routes/info.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const Usuario = require('./models/usuario.model');
const session = require('express-session');
const usuariosController = require('./controllers/usuarios.controller');

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
app.get('/', usuariosController.getUsuarios);

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
    console.error('ERROR EN EL SERVIDOR:');
    console.error(error);
    res.status(500).send(error.message);   
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});