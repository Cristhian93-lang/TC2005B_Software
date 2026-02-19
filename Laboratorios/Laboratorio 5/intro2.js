//----------Ejercicio 1--------

let numero = parseInt(
    prompt("Introduce un numero para generar una tabla con sus cuadrados y cubos:")
);
let contenido = "<h5>Ejercicio 1</h5>";
contenido += "<table class='highlight centered'>";
contenido += "<thead><tr><th>Numero</th><th>Cuadrado</th><th>Cubo</th></tr></thead>";
contenido += "<tbody>";
for (let i = 1; i <= numero; i++) {
    contenido += "<tr>";
    contenido += "<td>" + i + "</td>";
    contenido += "<td>" + (i * i) + "</td>";
    contenido += "<td>" + (i * i * i) + "</td>";
    contenido += "</tr>";
}
contenido += "</tbody></table>";
document.getElementById("test01").innerHTML = contenido;

//----------Ejercicio 2--------
let n1 = Math.floor(Math.random() * 100);
let n2 = Math.floor(Math.random() * 100 );
let inicio = Date.now();
let respuesta = parseInt(prompt("¿Cuanto es " + n1 + " + " + n2 + "?"));
let fin = Date.now();
let tiempo = (fin - inicio) / 1000;
if (respuesta === n1 + n2) {
    document.getElementById("test02").innerHTML = 
    "<h3>Resultado Ejercicio 5</h3>" + "Correcto! Tiempo: " + tiempo + " segundos";
} else {
    document.getElementById("test02").innerHTML = 
    "<h3>Resultado Ejercicio 5</h3>" + "Incorrecto. Tiempo: " + tiempo + " segundos";
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
console.assert(contador([-5, -3, 0, 4, 8]).negativos === 2);
console.assert(contador([-5, -3, 0, 4, 8]).ceros === 1);
console.assert(contador([-5, -3, 0, 4, 8]).positivos === 2);

let entrada = prompt("Ingresa numeros separados por comas (ejemplo: -3,0,5,7,-2,0): ");
let arregloUsuario = entrada.split(",").map(Number);
let resultados = contador(arregloUsuario);

document.getElementById("test03").innerHTML = 
"<h3>Resultado Ejercicio 3</h3>" + "Negativos: " + resultados.negativos +
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
    return resultados;
}
console.assert(promedios([[10,20], [30,40]])[0] === 15);
let resultado4 = promedios([[5,10,15], [2,4,6]]);
document.getElementById("test04").innerHTML = 
"<h3>Resultado Ejercicio 5</h3>" +
"Promedios: " + resultado4.join(", ");

//----------Ejercicio 5--------
function inverso(numero) {
    return parseInt(numero.toString().split("").reverse().join(""));
}
console.assert(inverso(5678) === 8765);
//console.assert(inverso(9021) === 1209);
let numeroPrueba = 5678;
document.getElementById("test05").innerHTML = 
"<h3>Resultado Ejercicio 5</h3>" + "Numero original: "
+ numeroPrueba + "<br>Numero invertido: " + inverso(numeroPrueba);

//----------Ejercicio 6--------
function modeloIA(nombre, correctas, total) {
    this.nombre = nombre;
    this.correctas = correctas;
    this.total = total;
    this. calcularPrecision = function() {
        if (this.total === 0) {
            return 0;
        }
        return (this.correctas / this.total) * 100;
    };
    this.agregarPrediccion = function(esCorrecta) {
        this.total++;
        if (esCorrecta) {
            this.correctas++;
        }
    };
}

let modeloPrueba = new modeloIA("Modelo test", 8, 10);
console.assert(Math.round(modeloPrueba.calcularPrecision()) === 80);
modeloPrueba.agregarPrediccion(true);
console.assert(modeloPrueba.correctas === 9);
console.assert(modeloPrueba.total === 11);

let miModelo = new modeloIA("Detector de Ataques", 15, 20);
miModelo.agregarPrediccion(true);
miModelo.agregarPrediccion(false);
miModelo.agregarPrediccion(true);

document.getElementById("test06").innerHTML += 
"<h3>Resultado del Modelo</h3>" + "Nombre: " + miModelo.nombre +
"<br>Predicciones correctas: " + miModelo.correctas +
"<br>Total de predicciones: " + miModelo.total +
"<br>Precision: " + miModelo.calcularPrecision().toFixed(2) + "%";

//-------Efectos de Materialize----------

document.addEventListener("DOMContentLoaded", function() {
    var sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav);
    var scrollspy = document.querySelectorAll('.scrollspy');
    M.ScrollSpy.init(scrollspy);
    var collapsible = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapsible);
    const elementos = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.1
    });
    elementos.forEach(el => observer.observe(el));

});

