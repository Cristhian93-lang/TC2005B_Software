USE Lab20;
-- Cristhian Viery Maida Suarez - A01668790

-- 1)  La suma de las cantidades e importe total de todas las entregas realizadas durante el 97.

SELECT SUM(E.Cantidad) AS 'Cantidad Total', SUM(E.Cantidad * (M.Precio + M.Impuesto)) AS 'Importe Total'
FROM Materiales as M INNER JOIN Entregan AS E ON M.Clave = E.Clave
WHERE E.Fecha BETWEEN '1997-01-01' AND '1997-12-31'

-- 2) Para cada proveedor, obtener la razón social del proveedor, número de entregas e importe total de las entregas realizadas.

SELECT P.RazonSocial AS Proveedor, COUNT(*) AS 'Numero de Entregas', SUM(E.Cantidad * (M.Precio + M.Impuesto)) AS ' Importe Total'
FROM Proveedores P INNER JOIN Entregan E ON P.RFC = E.RFC INNER JOIN Materiales M ON E.Clave = M.Clave
GROUP BY P.RazonSocial

 -- 3) Por cada material obtener la clave y descripción del material, la cantidad total entregada, 
 la mínima cantidad entregada, la máxima cantidad entregada, el importe total de las entregas 
 de aquellos materiales en los que la cantidad promedio entregada sea mayor a 400. 
 
SELECT M.Clave, M.Descripcion, SUM(E.Cantidad) AS'Total Entregado', MIN(E.Cantidad) AS 'Cantidad Minima',
       MAX(E.Cantidad) AS 'Cantidad Maxima', SUM(E.Cantidad * (M.Precio + M.Impuesto)) AS 'Importe Total'
FROM Materiales M INNER JOIN Entregan E ON M.Clave = E.Clave
GROUP BY M.Clave, M.Descripcion
HAVING AVG(E.Cantidad) > 400

-- 4) Para cada proveedor, indicar su razón social y mostrar la cantidad promedio de cada material entregado, 
detallando la clave y descripción del material, excluyendo aquellos proveedores para los que la cantidad promedio sea menor a 500.

SELECT P.RazonSocial, M.Clave, M.Descripcion, AVG(E.Cantidad) AS 'Promedio Material'
FROM Proveedores P INNER JOIN Entregan E ON P.RFC = E.RFC
     INNER JOIN Materiales M ON E.Clave = M.Clave
WHERE P.RFC IN (SELECT En.RFC
                FROM Entregan En 
                GROUP BY En.RFC
                HAVING AVG(En.Cantidad) >= 500
)
GROUP BY P.RFC, P.RazonSocial, M.Clave, M.Descripcion

-- 5) Mostrar en una solo consulta los mismos datos que en la consulta anterior pero para dos grupos de proveedores: 
aquellos para los que la cantidad promedio entregada es menor a 370 y aquellos para los que la cantidad promedio entregada sea mayor a 450.

CREATE VIEW PromedioProveedor AS
SELECT RFC, AVG(Cantidad) AS Promedio
FROM Entregan
GROUP BY RFC

SELECT P.RazonSocial, M.Clave, M.Descripcion, AVG(E.Cantidad) AS Promedio_Material,
    CASE 
        WHEN PP.Promedio < 370 THEN 'MENOR_370'
        WHEN PP.Promedio > 450 THEN 'MAYOR_450'
    END AS Grupo
FROM Proveedores P INNER JOIN Entregan E ON P.RFC = E.RFC
INNER JOIN Materiales M ON E.Clave = M.Clave
INNER JOIN PromedioProveedor PP ON P.RFC = PP.RFC
WHERE PP.Promedio < 370 OR PP.Promedio > 450
GROUP BY P.RFC, P.RazonSocial, M.Clave, M.Descripcion, PP.Promedio

INSERT INTO Materiales VALUES (2001, 'Grava', 150, 15);
INSERT INTO Materiales VALUES (2010, 'Cemento', 200, 20);
INSERT INTO Materiales VALUES (2020, 'Arena fina', 120, 12);
INSERT INTO Materiales VALUES (2030, 'Ladrillo', 80, 8);
INSERT INTO Materiales VALUES (2040, 'Cal', 90, 9);

-- 6) Clave y descripción de los materiales que nunca han sido entregados.
SELECT Clave, Descripcion
FROM Materiales M
WHERE Clave NOT IN (SELECT Clave 
                    FROM Entregan)
-- 7) Razón social de los proveedores que han realizado entregas tanto al proyecto 'Vamos México' como al proyecto 'Querétaro Limpio'.

SELECT P.RazonSocial
FROM Proveedores P
WHERE P.RFC IN (SELECT E.RFC
				FROM Entregan E
				INNER JOIN Proyectos PR ON E.Numero = PR.Numero
				WHERE PR.Denominacion = 'Vamos México')
AND P.RFC IN (SELECT E.RFC
			  FROM Entregan E
			  INNER JOIN Proyectos PR ON E.Numero = PR.Numero
			  WHERE PR.Denominacion = 'Querétaro Limpio')
              
-- 8) Descripción de los materiales que nunca han sido entregados al proyecto 'CIT Yucatán'.

SELECT M.Descripcion
FROM Materiales M
WHERE M.Clave NOT IN (SELECT E.Clave
					  FROM Entregan E
				      INNER JOIN Proyectos PR ON E.Numero = PR.Numero
					  WHERE PR.Denominacion = 'CIT Yucatán')
                      
-- 9) Razón social y promedio de cantidad entregada de los proveedores cuyo promedio de cantidad entregada es mayor al promedio 
de la cantidad entregada por el proveedor con el RFC 'VAGO780901'.

SELECT P.RazonSocial, AVG(E.Cantidad) AS Promedio
FROM Proveedores P
INNER JOIN Entregan E ON P.RFC = E.RFC
GROUP BY P.RFC, P.RazonSocial
HAVING AVG(E.Cantidad) > (SELECT AVG(Cantidad)
						  FROM Entregan
						  WHERE RFC = 'VAGO780901')
                          
-- 10) RFC, razón social de los proveedores que participaron en el proyecto 'Infonavit Durango' y cuyas cantidades totales entregadas 
en el 2000 fueron mayores a las cantidades totales entregadas en el 2001.

SELECT P.RFC, P.RazonSocial
FROM Proveedores P
WHERE P.RFC IN (SELECT E.RFC
				FROM Entregan E
				INNER JOIN Proyectos PR ON E.Numero = PR.Numero
				WHERE PR.Denominacion = 'Infonavit Durango'
				GROUP BY E.RFC
				HAVING SUM(CASE WHEN YEAR(E.Fecha) = 2000 THEN E.Cantidad ELSE 0 END) > 
					   SUM(CASE WHEN YEAR(E.Fecha) = 2001 THEN E.Cantidad ELSE 0 END))














