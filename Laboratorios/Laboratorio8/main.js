const Lista = require("./lista");

function main() {
    const listaInt = new Lista();
    for (let i = 0; i < 6; i++) {
        if (!listaInt.insert(i * 10)) {
            console.log("No se pudo insertar el valor:", i * 10);
        }
    }

    console.log("Mi lista:");
    listaInt.print();
    console.log("Tamaño:", listaInt.getcurrentSize());
    console.log("Posicion en 4:", listaInt.getData(4));
    console.log("Elimina el ultimo dato:");
    listaInt.erase();
    console.log("Lista nueva:");
    listaInt.print();
}
main();