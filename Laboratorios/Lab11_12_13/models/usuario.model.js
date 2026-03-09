const fs = require('fs');
module.exports = class Usuario {
    constructor(nombre) {
        this.nombre = nombre;
    }
    save() {
        fs.appendFileSync('data.txt', JSON.stringify(this) + '\n');
    }
    static fetchAll() {
        try {
            const data = fs.readFileSync('data.txt', 'utf8');
            return data.split('\n')
                .filter(line => line)
                .map(line => JSON.parse(line));
        } catch {
            return [];
        }
    }
};