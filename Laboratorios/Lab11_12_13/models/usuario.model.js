const fs = require('fs');
const path = require('path');

module.exports = class Usuario {
    constructor(datos) {
        this.password = datos.password;
        this.fecha = new Date().toLocaleString();
    }
    save() {
        fs.appendFileSync(
            path.join(__dirname, '../data.txt'),
            JSON.stringify(this) + '\n'
        );
    }

    static fetchAll() {
        try {
            const data = fs.readFileSync(
                path.join(__dirname, '../data.txt'),
                'utf8'
            );
            return data.split('\n')
                .filter(line => line)
                .map(line => {
                    try {
                        return JSON.parse(line);
                    } catch {
                        return null;
                    }
                })
                .filter(u => u !== null);
        } catch {
            return [];

        }
    }

    static delete(password) {
        const usuarios = this.fetchAll();
        const filtrados = usuarios.filter(
            u => u.password !== password
        );
        const data = filtrados
            .map(u => JSON.stringify(u))
            .join('\n');
        fs.writeFileSync(
            path.join(__dirname, '../data.txt'),
            data
        );

    }

};