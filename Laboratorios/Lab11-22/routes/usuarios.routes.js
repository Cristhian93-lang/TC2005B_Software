const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const isAuth = require('../util/is-auth');

router.get('/login', usuariosController.getLogin);
router.get('/signup', usuariosController.getSignup);
router.post('/signup', usuariosController.postSignup);
router.post('/login', usuariosController.postLogin);
router.get('/logout',
isAuth.isAuth,
usuariosController.logout
);

router.get('/admin',
isAuth.tienePrivilegio('ver_panel_admin'),
usuariosController.getAdminPanel
);

router.post('/admin/rol',
isAuth.tienePrivilegio('administrar_roles'),
usuariosController.postActualizarRol
);

router.get('/editar',
isAuth.tienePrivilegio('editar_contenido'),
(req,res)=>{
    res.send('Zona de edicion');
});

module.exports = router;
