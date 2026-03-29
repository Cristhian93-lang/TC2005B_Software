exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/usuarios/login');
    }
    next();
};

exports.soloAdmin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/usuarios/login');
    }
    if (req.session.rol !== 'administrador') {
        return res.status(403).send('Acceso denegado');
    }
    next();
};

exports.editorOAdmin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/usuarios/login');
    }
    if (
        req.session.rol !== 'editor' &&
        req.session.rol !== 'administrador'
    ) {
        return res.status(403).send('Acceso denegado');
    }
    next();
};

exports.tienePrivilegio = (privilegio) => {
    return (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return res.redirect('/usuarios/login');
        }
        if (!req.session.privilegios.includes(privilegio)) {
            return res.status(403).send('Acceso denegado');
        }
        next();
    };
};