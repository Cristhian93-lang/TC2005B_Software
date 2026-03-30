USE aegis_account;

DROP PROCEDURE IF EXISTS sp_crear_usuario_con_rol;

DELIMITER $$

CREATE PROCEDURE sp_crear_usuario_con_rol(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_nombre VARCHAR(120),
    IN p_matricula VARCHAR(30),
    IN p_correo VARCHAR(120),
    IN p_foto VARCHAR(255),
    IN p_nombre_rol VARCHAR(50)
)
BEGIN
    DECLARE v_id_usuario INT;
    DECLARE v_id_rol INT;

    SELECT id_rol
    INTO v_id_rol
    FROM roles
    WHERE nombre = p_nombre_rol
    LIMIT 1;

    IF v_id_rol IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El rol indicado no existe';
    END IF;

    INSERT INTO usuarios(username, password, nombre, matricula, correo, foto, fecha)
    VALUES(p_username, p_password, p_nombre, p_matricula, p_correo, p_foto, NOW());

    SET v_id_usuario = LAST_INSERT_ID();

    INSERT INTO usuario_rol(id_usuario, id_rol)
    VALUES(v_id_usuario, v_id_rol);
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS sp_actualizar_perfil_usuario;

DELIMITER $$

CREATE PROCEDURE sp_actualizar_perfil_usuario(
    IN p_username VARCHAR(50),
    IN p_nombre VARCHAR(120),
    IN p_matricula VARCHAR(30),
    IN p_correo VARCHAR(120),
    IN p_foto VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM usuarios
        WHERE username = p_username
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no existe';
    END IF;

    UPDATE usuarios
    SET
        nombre = p_nombre,
        matricula = p_matricula,
        correo = p_correo,
        foto = COALESCE(NULLIF(p_foto, ''), foto)
    WHERE username = p_username;
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS sp_cambiar_rol_usuario;

DELIMITER $$

CREATE PROCEDURE sp_cambiar_rol_usuario(
    IN p_username VARCHAR(50),
    IN p_nuevo_rol VARCHAR(50)
)
BEGIN
    DECLARE v_id_usuario INT;
    DECLARE v_id_rol INT;

    SELECT id
    INTO v_id_usuario
    FROM usuarios
    WHERE username = p_username
    LIMIT 1;

    IF v_id_usuario IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no existe';
    END IF;

    SELECT id_rol
    INTO v_id_rol
    FROM roles
    WHERE nombre = p_nuevo_rol
    LIMIT 1;

    IF v_id_rol IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El rol indicado no existe';
    END IF;

    DELETE FROM usuario_rol
    WHERE id_usuario = v_id_usuario;

    INSERT INTO usuario_rol(id_usuario, id_rol)
    VALUES(v_id_usuario, v_id_rol);
END$$

DELIMITER ;

CALL sp_crear_usuario_con_rol(
    'usuario_sp1',
    'password123',
    'Brando Perez',
    'A01600001',
    'brando23@tec.mx',
    '/uploads/foto1.jpg',
    'usuario'
);


SELECT username, nombre, matricula, correo, foto
FROM usuarios
WHERE username = 'usuario_sp1';

SELECT u.username, r.nombre AS rol
FROM usuarios u
JOIN usuario_rol ur ON u.id = ur.id_usuario
JOIN roles r ON ur.id_rol = r.id_rol
WHERE u.username = 'usuario_sp1';


CALL sp_actualizar_perfil_usuario(
    'usuario_sp1',
    'Brando Perez Actualizado',
    'A01600099',
    'perez103@tec.mx',
    '/uploads/milo.webp'
);


SELECT username, nombre, matricula, correo, foto
FROM usuarios
WHERE username = 'usuario_sp1';


CALL sp_cambiar_rol_usuario(
    'usuario_sp1',
    'editor'
);


SELECT u.username, r.nombre AS rol
FROM usuarios u
JOIN usuario_rol ur ON u.id = ur.id_usuario
JOIN roles r ON ur.id_rol = r.id_rol
WHERE u.username = 'usuario_sp1';



CALL sp_actualizar_perfil_usuario(
    'usuario_sp1',
    'Brando Perez Final',
    'A01600111',
    'final@tec.mx',
    NULL
);


SELECT username, nombre, matricula, correo, foto
FROM usuarios
WHERE username = 'usuario_sp1';


DELETE FROM usuario_rol
WHERE id_usuario IN (
    SELECT id FROM usuarios WHERE username = 'usuario_sp1'
);

DELETE FROM usuarios
WHERE username = 'usuario_sp1';
















