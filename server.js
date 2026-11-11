// A minimal static file server using only Node's built-in modules.
// No npm install needed for this — http, fs, path come WITH Node.
const http = require('http');   // creates the server
const fs   = require('fs');     // reads files from disk
const path = require('path');   // builds safe file paths

const PORT = 3000;

// The browser needs to be told WHAT each file is, via "Content-Type".
const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

http.createServer((req, res) => {
  // 1. Browser asks for a URL. "/" means "give me index.html".
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = path.join(__dirname, urlPath);

  // Safety: don't serve files outside the project folder.
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403); return res.end('Forbidden');
  }

  // 2. Read that file from disk.
  fs.readFile(filePath, (err, data) => {
    if (err) {                              // 3a. File doesn't exist → 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }
    // 3b. Found → send it with the right Content-Type.
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});