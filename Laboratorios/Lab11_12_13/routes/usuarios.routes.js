const express = require('express');
const router = express.Router();

const usuariosController =
require('../controllers/usuarios.controller');

router.post('/guardar',
usuariosController.addUsuario);

router.post('/eliminar',
usuariosController.eliminarUsuario);

module.exports = router;