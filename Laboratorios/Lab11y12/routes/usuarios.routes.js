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
                res.redirect('/');
            }
        });
});
module.exports = router;
