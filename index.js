const url = require("url");
const http = require("http");
const fs = require("fs");
http
    .createServer((req, res) => {

        if(req.url == ('/') && req.method == "GET") {
            res.writeHead(200,{'Content-Type':'text:html'});           
            res.end(fs.readFileSync("index.html","utf8"));
            }
            
        const { nombre, precio } = url.parse(req.url,
            true).query;
        let deporte = {
            nombre,
            precio,
        };

        if (req.url.startsWith("/agregar")) {
            let data = JSON.parse(fs.readFileSync("Deportes.json", "utf8"));
            let deportes = data.deportes;
            deportes.push(deporte);
            fs.writeFileSync("Deportes.json", JSON.stringify(data, null,1));
            res.end();
        }

        if(req.url.includes('/deportes')){
            fs.readFile('Deportes.json',(err,data) => {
                res.write(data);
                res.end();
            })
        }

        if (req.url.startsWith('/editar')) {
            let data = JSON.parse(fs.readFileSync("Deportes.json", "utf8"));
            let deportes = data.deportes;
            deportes.map((d) => {
                if (d.nombre == nombre) {
                    d.precio = precio
                }
                else {
                    return d;
                }
                
            }) 
            fs.writeFileSync('Deportes.json',JSON.stringify(data,null,1));
            res.end();
            }

            if(req.url.startsWith('/eliminar')){
                let data = JSON.parse(fs.readFileSync('Deportes.json','utf8'));
                let deportes = data.deportes;
                data.deportes = deportes.filter((d) => {
                    return d.nombre !== nombre;
                })
    
                fs.writeFileSync('Deportes.json',JSON.stringify(data,null,1));
                res.end();
            }



    })
    .listen(3000, ()=>console.log('Escuchando puerto 3000'))