const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: false }));

const infoRoutes = require('./routes/info.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

app.use('/usuarios', usuariosRoutes);
app.use('/info', infoRoutes);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
    res.status(404).send('404 - Ruta no encontrada');

});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});