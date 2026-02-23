function calcularPromedio(numeros) {
    if (numeros.length === 0) {
        return 0;
    }
    let suma = 0;
    for (let i = 0; i < numeros.length; i++) {
        suma = suma + numeros[i];
    }
    let promedio = suma / numeros.length;
    return promedio;
}

const arreglo = [10, 20 ,30, 40, 50];
let resultado = calcularPromedio(arreglo);
console.log("El promedio es:", resultado);