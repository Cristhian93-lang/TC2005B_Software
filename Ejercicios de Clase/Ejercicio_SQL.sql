 /*
Película (título, año, duración, encolor, presupuesto, nomestudio, idproductor)
Elenco (título, año, nombre, sueldo)
Actor (nombre, dirección, telefono, fechanacimiento, sexo)
Productor (idproductor, nombre, dirección, teléfono)
Estudio (nomestudio, dirección) 
*/
/* Concultas:
El ingreso total recibido por cada actor, sin importar en cuantas películas haya participado.
El monto total destinado a películas por cada Estudio Cinematográfico, durante la década de los 80's.
Nombre y sueldo promedio de los actores (sólo hombres) que reciben en promedio un pago superior a 5 millones de dolares por película.
Título y año de producción de las películas con menor presupuesto. (Por ejemplo, la película de Titanic se ha producido en varias veces entre la lista de películas estaría la producción de Titanic y el año que fue filmada con menor presupuesto).
Mostrar el sueldo de la actriz mejor pagada.
*/

-- 1) --
SELECT nombre, SUM(sueldo) as 'Total de Ingresos'
FROM elenco
GROUP BY nombre
ORDER BY SUM(sueldo) DESC

-- 2) --
SELECT nomestudio, SUM(presupuesto)as 'Monto Total'
FROM Pelicula
WHERE año BETWEEN 1980 AND 1989
GROUP BY nomestudio
ORDER BY SUM(presupuesto) DESC

-- 3) --
SELECT E.nombre, AVG(sueldo) as 'Sueldo promedio de actores hombres'
FROM Elenco as E, Actor as A
WHERE E.nombre = A.nombre
AND A.sexo = 'M'
GROUP BY E.nombre
HAVING AVG(sueldo) >= 5000000
ORDER BY AVG(sueldo) DESC

-- 4) --
SELECT titulo as Titulo pelicula, año as Año_Produccion
MIN(presupuesto) as Presupuesto
FROM Pelicula
GROUP BY titulo

-- 5) --
SELECT nombre, MAX(sueldo) as 'Mejor sueldo'
FROM Elenco AS E, Actor as A
WHERE E.nombre = A.nombre
AND A.sexo = 'F'
