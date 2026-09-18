const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0].split('#')[0];
    let filePath = path.join(ROOT, decodeURIComponent(cleanUrl));

    // If request is a directory, look for index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    // If file doesn't exist, fallback to 404.html (SPA routing)
    if (!fs.existsSync(filePath)) {
        const notFoundPath = path.join(ROOT, '404.html');
        if (fs.existsSync(notFoundPath)) {
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(fs.readFileSync(notFoundPath));
            return;
        }

        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  Servidor local rodando com sucesso!`);
    console.log(`  Acesse no navegador: http://localhost:${PORT}`);
    console.log(`======================================================`);
    console.log(`\nRotas para testar:`);
    console.log(`  - Visualizador padrão:   http://localhost:${PORT}/`);
    console.log(`  - PDF 2702748 por rota: http://localhost:${PORT}/2702748`);
    console.log(`  - PDF 2789778 por rota: http://localhost:${PORT}/2789778`);
    console.log(`  - PDF 2702748 por query: http://localhost:${PORT}/Corpore.Net/Source/Rpt-GeradorRelatoriosNet/RM.Rpt.Reports/Anonymous/?pdf=2702748`);
    console.log(`  - PDF 2789778 por query: http://localhost:${PORT}/Corpore.Net/Source/Rpt-GeradorRelatoriosNet/RM.Rpt.Reports/Anonymous/?pdf=2789778\n`);
});
