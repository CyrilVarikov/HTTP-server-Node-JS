const http = require('http');
const fs = require('fs');
const path = require('path');


function render (template, data, done){
    fs.readFile(path.join(__dirname, 'public', `${template}.html`), 'utf-8', (error, file) =>{
        if (error) return done(error);

        let html = file;

        html = html.replace(/\{[A-Z]*\}/, data);

        done(null, html);
    });
}

http.createServer((req, res) =>{
    switch (req.method){
        case 'GET':
            // console.log(req.headers);
            render('index', JSON.stringify(req.headers) + '<br>' + req.method + '<br>' + req.url, (error, html) => {
                if (error) {
                    res.writeHead(500, {'Content-type' : 'text/plain'});
                    return res.end(error.message);
                }
                res.writeHead(200, {'Content-type' : 'text/html'});
                res.end(html);
            });
            break;
        case 'POST':
            let body = '';
            req.on('data', data => body += data);
            req.on('end', () => {
                render ('post', JSON.stringify(req.headers) + '<br>' + req.method + '<br>' + req.url + '<br>' + body, (error, html) =>{
                    if (error) {
                        res.writeHead(500, {'Content-type' : 'text/plain'});
                        return res.end(error.message);
                    }
                    res.writeHead(200, {'Content-type' : 'text/html'});
                    res.end(html);
                });
            })
            break;
    }
}).listen(3000, () => console.log('Server is work'));