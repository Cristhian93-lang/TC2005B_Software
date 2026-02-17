//----------Ejercicio 1--------
/*
let numero = parseInt(promt("Introduce un numero para generar una tabla con sus cuadrados y cubos:"));
document.write("<h2>Ejercicio 1</h2>");
document.write("<table border='1'>");
document.write("<tr><th>Numero</th><th>Cuadrados</th><th>Cubo</th></tr>");
for (let i = 1; i <= numero; i++) {
    document.write("<tr>");
    document.write("<td>" + i + "</td>");
    document.write("<td>" + (i * i) + "</td>");
    document.write("<td>" + (i * i * i) + "</td>");
    document.write("</tr>")
}
document.write("</table>");
*/
//----------Ejercicio 2--------
let n1 = Math.floor(Math.ramdom() * 100);
let n2 = Math.floor(Math.random() * 100 );
let inicio = Date.now();
let respuesta = parseInt(promt("¿Cuanto es" + n1 + " + " + n2 + "?"));
let fin = Date.now();
let tiempo = (fin - inicio) / 1000;
if (respuesta === n1 + n2) {
    document.getElementById("test02").innerHTML = "Correcto! Tiempo: " + tiempo + " segundos";
} else {
    document.getElementById("test02").innerHTML = "Incorrecto. Tiempo: " + tiempo + " segundos";
}

//----------Ejercicio 3--------
function contador(arreglo) {
    let negativos = 0;
    let ceros = 0;
    let positivos = 0;
    for (let num of arreglo) {
        if (num < 0) {
            negativos++;
        } else if (num === 0) {
            ceros++;
        } else {
            positivos++;
        }
    }
    return { negativos: negativos, 
             ceros: ceros, 
             positivos: positivos 
    };
}

console.assert(contador([-1, 0, 2]).negativos === 1);
console.assert(contador([-1, 0, 2]).ceros === 1);
console.assert(contador([-1, 0, 2]).positivos === 1);
console.assert(contador([-5, -3, 0, 4, 8]).positivos === 2);
console.assert(contador([-5, -3, 0, 4, 8]).positivos === 1);
console.assert(contador([-5, -3, 0, 4, 8]).positivos === 2);

let entrada = promt("Ingresa numeros separados por comas (ejemplo: -3,0,5,7,-2,0): ");
let arregloUsuario = entrada.split(",").map(Number);
let resultados = contador(arregloUsuario);

document.getElementById("test03").innerHTML = 
"<h3>Resultado Eejercicio 3</h3>" + "Negativos: " + resultados.negativos +
"<br>Ceros: " + resultados.ceros + "<br>Positivos: " + resultados.positivos;

//----------Ejercicio 4--------
function promedios(matriz) {
    let resultados = [];
    for (let fila of matriz) {
        let suma = 0;
        for (let num of fila) {
            suma += num;
        }
        resultados.push(suma / fila.length); 
    }
    return resultado;
}
console.assert(promedios([[10,20], [30,40]])[0] === 15);
let resultado4 = promedios([[5,10,15], [2,4,6]]);
document.getElementById("test04").innerHTML = "Promedios: " + resultado4.join(", ");

//----------Ejercicio 5--------
//----------Ejercicio 6--------
