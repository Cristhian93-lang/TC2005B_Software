-- Tabla de auditoría para registrar eventos sobre usuarios
CREATE TABLE IF NOT EXISTS auditoria_usuarios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    evento          VARCHAR(20)  NOT NULL,
    id_usuario      INT,
    username        VARCHAR(100),
    campo_modificado VARCHAR(50)  DEFAULT NULL,
    valor_anterior  TEXT         DEFAULT NULL,
    valor_nuevo     TEXT         DEFAULT NULL,
    fecha           DATETIME     DEFAULT CURRENT_TIMESTAMP
);


DROP TRIGGER IF EXISTS after_usuario_insert;

DELIMITER $$
CREATE TRIGGER after_usuario_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_usuarios (evento, id_usuario, username, fecha)
    VALUES ('REGISTRO', NEW.id, NEW.username, NOW());
END$$
DELIMITER ;


DROP TRIGGER IF EXISTS after_usuario_update;

DELIMITER $$
CREATE TRIGGER after_usuario_update
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    IF NOT (OLD.nombre <=> NEW.nombre) THEN
        INSERT INTO auditoria_usuarios
            (evento, id_usuario, username, campo_modificado, valor_anterior, valor_nuevo, fecha)
        VALUES
            ('ACTUALIZACION', NEW.id, NEW.username, 'nombre', OLD.nombre, NEW.nombre, NOW());
    END IF;

    IF NOT (OLD.correo <=> NEW.correo) THEN
        INSERT INTO auditoria_usuarios
            (evento, id_usuario, username, campo_modificado, valor_anterior, valor_nuevo, fecha)
        VALUES
            ('ACTUALIZACION', NEW.id, NEW.username, 'correo', OLD.correo, NEW.correo, NOW());
    END IF;

    IF NOT (OLD.foto <=> NEW.foto) THEN
        INSERT INTO auditoria_usuarios
            (evento, id_usuario, username, campo_modificado, valor_anterior, valor_nuevo, fecha)
        VALUES
            ('ACTUALIZACION', NEW.id, NEW.username, 'foto', OLD.foto, NEW.foto, NOW());
    END IF;
END$$
DELIMITER ;


DROP TRIGGER IF EXISTS after_rol_delete;

DELIMITER $$
CREATE TRIGGER after_rol_delete
AFTER DELETE ON usuario_rol
FOR EACH ROW
BEGIN
    DECLARE nombre_usuario VARCHAR(100);
    DECLARE nombre_rol     VARCHAR(50);

    SELECT username INTO nombre_usuario FROM usuarios WHERE id = OLD.id_usuario;
    SELECT nombre   INTO nombre_rol     FROM roles     WHERE id_rol = OLD.id_rol;

    INSERT INTO auditoria_usuarios
        (evento, id_usuario, username, campo_modificado, valor_anterior, valor_nuevo, fecha)
    VALUES
        ('CAMBIO_ROL', OLD.id_usuario, nombre_usuario, 'rol', nombre_rol, NULL, NOW());
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS after_rol_insert;

DELIMITER $$
CREATE TRIGGER after_rol_insert
AFTER INSERT ON usuario_rol
FOR EACH ROW
BEGIN
    DECLARE nombre_usuario VARCHAR(100);
    DECLARE nombre_rol     VARCHAR(50);

    SELECT username INTO nombre_usuario FROM usuarios WHERE id = NEW.id_usuario;
    SELECT nombre   INTO nombre_rol     FROM roles     WHERE id_rol = NEW.id_rol;

    INSERT INTO auditoria_usuarios
        (evento, id_usuario, username, campo_modificado, valor_anterior, valor_nuevo, fecha)
    VALUES
        ('CAMBIO_ROL', NEW.id_usuario, nombre_usuario, 'rol', NULL, nombre_rol, NOW());
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS before_usuario_delete;

DELIMITER $$
CREATE TRIGGER before_usuario_delete
BEFORE DELETE ON usuarios
FOR EACH ROW
BEGIN
    DECLARE otros_admins INT;

    SELECT COUNT(*) INTO otros_admins
    FROM usuario_rol ur
    JOIN roles r ON ur.id_rol = r.id_rol
    WHERE r.nombre = 'admin'
      AND ur.id_usuario != OLD.id;

    IF otros_admins = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No se puede eliminar al único administrador del sistema.';
    END IF;
END$$
DELIMITER ;


