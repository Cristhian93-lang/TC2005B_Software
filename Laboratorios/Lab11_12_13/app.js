const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));


const infoRoutes = require('./routes/info.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

app.use('/usuarios', usuariosRoutes);
app.use('/info', infoRoutes);
app.use(express.static(path.join(__dirname, 'public')));

const fs = require('fs');

app.get('/', (req, res) => {
    fs.readFile('data.txt', 'utf8', (err, data) => {
        let usuarios = [];
        if (!err && data) {
            const lineas = data.trim().split('\n');
            usuarios = lineas.map(linea => JSON.parse(linea));
        }
        res.render('index', { 
            usuarios: usuarios,
            title: 'Aigis Account',
            css: 'style.css',
            bodyClass: ''
        });
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