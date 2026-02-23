const fs = require("fs")
function escribirTexto(texto) {
    fs.writeFile("salida.txt", texto, function(error) {
        if (error) {
            console.log("Error al escribir archivo");
        } else {
            console.log("Archivo creado correctamente");
        }
    });
}
escribirTexto("El laboratoio 8 es el que mas practico me parecio en cuanto a programacion js porque hizo que lo captara mejor");