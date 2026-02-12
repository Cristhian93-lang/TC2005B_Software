// consola(log, info, warn,error, assert)
console.log("hola mundo!");
console.info("Creado en el 2009");
console.warn("Es adictivo");
console.error("Los tanques no deben ir atras");
// == ---> Operado de comparacion de valores
console.assert(1==true);
// ==== ---> Operdaor "estrictamente igual" de comparacion de valor y tipo
console.assert(1===true);

//--------------------variables, constantes------------------------
// Forma antigu de decharar variables
// Tiene mayor alcance por lo qee no se recomienda
var persaneje_1 = "Gwen";

// Forma moderna de declarar variables.
//la variable solo vive dentro del ambito donde es declarada
let personaje_2 = "Mordkeiser";

//declarar constantes
const precio_skin = 300;

//alcance de la variables
{
    var personaje_3 = "Jax";
    let personaje_4 = "Garen"
}

console.log(personaje_3);
//La siguiente linea genera un error porque personaje_4 murio hace 3 lineas
//console.log(personaje_4);

//--------- alert, promt, confirm
alert("No juegues esto por favor");
const personaje_favorito = promt("¿Cual es tu personaje favorito?");
console.info("Personaje favorito: " + personaje_favorito);

const hoy_hay_juego = confirm("¿Un jueguito?");
if (hoy_hay_juego) {
    console.warn("¡A jugar!")
} else {
    console.info("Bune dia");
}
//----------Funciones tradicionales
function descargar() {
    window.location.href = "https://www.leagueoflegends.com/es-mx/"
}

if (hoy_hay_juego) {
    descargar();
} else {
    console.info("Buen dia")
}

//funciones modernas
() => {}

document.getElementById("boton_desinstalar").onclick = () => {
    alert("jo jo jo no se puede desinstalar");
}

const iniciar_partida = () => {
    alert("Iniciar partida...");
}

iniciar_partida();

//----------arrelgos
const arreglo = ["Elemento"];

const arreglo2 = new Array();

personajes.push("Irelia");
personajes[10] = "Leona";


//arreglos asociativos
personajes["Hola"] = "Lux";

//recorrido tradicional del arreglo
 for (let i = 0; i < personajes.length; i++) {
    console.log(personajes[i]);
 }

 //recorridos alternativos del arreglo
 for (let personaje in personajes) {
    console.log(personajes);
 }

 //objetos
 const eco_de_Luden = {
    nombre: "Eco de luden",
    color: "morado",
    daño: 100
 };
console.log(eco_de_Luden);
