const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/guardar', (req, res) => {
    const datos = JSON.stringify(req.body) + "\n";
    fs.appendFile(path.join(__dirname, '../data.txt'), datos, (err) => {
            if (err) {
                res.status(500).send('Error al guardar los datos');
            } else {
                res.send(`
                    <h1>Cuenta creada correctamente</h1>
                    <a href="/usuarios">Volver al Inicio</a>
                    `);
            }
        });
});
module.exports = router;
