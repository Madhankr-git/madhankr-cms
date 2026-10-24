// ══════════════════════════════════════════════════════════════════
// MADHANKR PERSONAL PORTFOLIO & CMS — LOCAL DEV SERVER
// Pure Node.js HTTP server supporting clean route groups:
// Public: /, /work, /journal, /journal/:slug, /gallery, /about, /contact
// Admin:  /admin, /admin/content, /admin/editor/:id, /admin/media, /admin/seo, /admin/settings
// ══════════════════════════════════════════════════════════════════

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(urlObj.pathname);

  // 1. Static asset check (if has extension)
  const ext = path.extname(pathname).toLowerCase();
  if (ext && MIME_TYPES[ext]) {
    let assetPath = path.join(ROOT_DIR, pathname);
    if (fs.existsSync(assetPath)) {
      return serveFile(res, assetPath, MIME_TYPES[ext]);
    }
    // Fallback: If requested from /admin/something.ext, check in root
    const rootFallback = path.join(ROOT_DIR, path.basename(pathname));
    if (fs.existsSync(rootFallback)) {
      return serveFile(res, rootFallback, MIME_TYPES[ext]);
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Asset Not Found');
  }

  // 2. Login Route: /login, /login.html, /admin/login, /admin/login.html
  if (pathname === '/login' || pathname === '/login.html' || pathname === '/admin/login' || pathname === '/admin/login.html') {
    const loginPage = path.join(ROOT_DIR, 'admin', 'login.html');
    return serveFile(res, loginPage, 'text/html; charset=utf-8');
  }

  // 3. Admin Route Group: /admin, /admin/content, /admin/editor/:id, /admin/media, /admin/seo, /admin/settings
  if (pathname === '/admin' || pathname === '/admin/' || pathname.startsWith('/admin/')) {
    const adminIndex = path.join(ROOT_DIR, 'admin', 'index.html');
    return serveFile(res, adminIndex, 'text/html; charset=utf-8');
  }

  // 3. Public Route Group:
  // Public Homepage: /
  if (pathname === '/' || pathname === '/index' || pathname === '/index.html') {
    return serveFile(res, path.join(ROOT_DIR, 'index.html'), 'text/html; charset=utf-8');
  }

  // Work: /work or /work.html
  if (pathname === '/work' || pathname === '/work.html') {
    return serveFile(res, path.join(ROOT_DIR, 'work.html'), 'text/html; charset=utf-8');
  }

  // Journal listing: /journal or /journal.html
  if (pathname === '/journal' || pathname === '/journal.html') {
    return serveFile(res, path.join(ROOT_DIR, 'journal.html'), 'text/html; charset=utf-8');
  }

  // Journal article: /journal/:slug
  if (pathname.startsWith('/journal/')) {
    return serveFile(res, path.join(ROOT_DIR, 'article.html'), 'text/html; charset=utf-8');
  }

  // Article direct: /article or /article.html
  if (pathname === '/article' || pathname === '/article.html' || pathname.startsWith('/article/')) {
    return serveFile(res, path.join(ROOT_DIR, 'article.html'), 'text/html; charset=utf-8');
  }

  // Gallery: /gallery or /gallery.html
  if (pathname === '/gallery' || pathname === '/gallery.html') {
    return serveFile(res, path.join(ROOT_DIR, 'gallery.html'), 'text/html; charset=utf-8');
  }

  // About: /about or /about.html
  if (pathname === '/about' || pathname === '/about.html') {
    return serveFile(res, path.join(ROOT_DIR, 'about.html'), 'text/html; charset=utf-8');
  }

  // Contact: /contact or /contact.html
  if (pathname === '/contact' || pathname === '/contact.html') {
    return serveFile(res, path.join(ROOT_DIR, 'contact.html'), 'text/html; charset=utf-8');
  }

  // Fallback direct html file match
  const directHtml = path.join(ROOT_DIR, pathname.endsWith('.html') ? pathname : `${pathname}.html`);
  if (fs.existsSync(directHtml)) {
    return serveFile(res, directHtml, 'text/html; charset=utf-8');
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head><title>404 Not Found</title></head>
      <body style="font-family:sans-serif; text-align:center; padding:50px; background:#020617; color:#fff;">
        <h1>404 — Page Not Found</h1>
        <p><a href="/" style="color:#38bdf8;">Return to Portfolio Homepage</a></p>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
