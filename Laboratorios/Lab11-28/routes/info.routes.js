const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`
        <h1>Sección de Información</h1>
        <a href="/info/about">Sobre el proyecto</a>
        `);
});

router.get('/about', (req, res) => {
    res.send(`
        <h1>Acerca de Lab 11-26</h1>
        <p>Este laboratorio implementa Express con rutas modulares.</p>
        <a href="/">Inicio</a>
        `);
});
module.exports = router;
