const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer(function(req, res) {
    if (req.url === "/favicon.ico") {
        res.writeHead(204);
        res.end()
        return;
    }

    if (req.url === "/" && req.method === "GET") {
        fs.readFile(path.join(__dirname, "./index.html"), function(error, content) {
            if (error) {
                console.log("ERROR REAL:", error);
                res.writeHead(500);
                res.end("Error interno del servidor");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(content);
            }
        });
    }

    else if (req.url === "/about" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <h1>Sobre este proyecto</h1>
            <p>
                Este laboratorio implementa un servidor web utilizado unicamente el
                modulo http de Node.js. Se manejan rutas manualmente, incluyendo solicitudes GET
                y POST, y se almacenan datos en un archivo dentro del servidor.
            </p>
            <a href="/">Volcer al inicio</a>
        `);
    }

    else if (req.url === "/guardar" && req.method === "POST") {
        const datos = [];
        req.on("data", function(chunk) {
            datos.push(chunk);
        });
        req.on("end", function() {
            const datosCompletos = Buffer.concat(datos).toString();
            fs.appendFile("usuarios.txt", datosCompletos + "\n", function(err) {
                if (err) {
                    res.writeHead(500);
                    res.end("Error al guardar datos");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(`
                        <h1>Registro exitoso</h1>
                        <p>Datos guardados correctamente</p>
                        <a href="/">Volver al incio</a>
                        `);
                }
            });
        });
    }

    else {
        let filePath = path.join(__dirname, req.url);
        const extname = path.extname(filePath);
        let contentType = "text/html";
        if (extname === ".css") {
            contentType = "text/css";
        } else if (extname === ".js") {
            contentType = "text/javascript";
        }
        fs.readFile(filePath, function(error, content) {
            if (error) {
                console.log("ERROR ARCHIVO:", error);
                res.writeHead(404);
                res.end("404 - Ruta no encontrada");
            } else {
                res.writeHead(200, { "Content-Type": contentType });
                res.end(content);
            }
        });
    }
});
server.listen(3000, function() {
    console.log("Servidor correindo en http://localhost:3000");
});