const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

router.get('/login', usuariosController.getLogin);
router.get('/signup', usuariosController.getSignup);
router.post('/signup', usuariosController.postSignup);
router.post('/login', usuariosController.postLogin);
router.get('/logout', usuariosController.logout);

module.exports = router;