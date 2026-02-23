const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer(function(req, res) {
    if (req.url === "/favicon.ico") {
        res.writeHead(204);
        res.end();
        return;
    }
    let filePath = "." + req.url;
    if (filePath === "./") {
        filePath = "./index.html";
    }
    const extname = path.extname(filePath);
    let contentType = "text/html";
    if (extname === ".css") {
        contentType = "text/css";
    } else if (extname === ".js") {
        contentType = "text/javascript";
    }
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if (error.code ==="ENOENT") {
                res.writeHead(404);
                res.end("Archivo no encontrado");
            } else {
                res.writeHead(500);
                res.end("Error interno del servidor");
            }
            
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        }
    });
});
server.listen(3000, function() {
    console.log("Servidor corriendo en http://localhost:3000");
});