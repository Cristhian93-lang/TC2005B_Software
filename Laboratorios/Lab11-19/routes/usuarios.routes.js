const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const isAuth = require('../util/is-auth');

router.get('/login', usuariosController.getLogin);
router.get('/signup', usuariosController.getSignup);
router.post('/signup', usuariosController.postSignup);
router.post('/login', usuariosController.postLogin);
router.get('/logout', usuariosController.logout);

router.get('/logout',
isAuth.isAuth,
usuariosController.logout
);

router.get('/admin',
isAuth.soloAdmin,
(req,res)=>{
    res.send('Panel administrador');
});

router.get('/editar',
isAuth.editorOAdmin,
(req,res)=>{
    res.send('Zona de edicion');
});

module.exports = router;