const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');
const { URL } = require('url');

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';
const SHOULD_OPEN =
  !process.argv.includes('--no-open') &&
  process.env.OPEN_BROWSER !== 'false' &&
  process.env.CI !== 'true';
const ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function getFilePath(requestUrl) {
  const parsedUrl = new URL(requestUrl, 'http://localhost');
  const pathname = decodeURIComponent(parsedUrl.pathname);
  const rawPath = path.join(ROOT, pathname);
  const normalizedPath = path.normalize(rawPath);

  if (!normalizedPath.startsWith(ROOT)) {
    return null;
  }

  return normalizedPath;
}

function sendNotFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
}

function sendForbidden(res) {
  res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Forbidden');
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  const stream = fs.createReadStream(filePath);
  stream.on('open', () => {
    res.writeHead(200, { 'Content-Type': contentType });
    stream.pipe(res);
  });
  stream.on('error', () => sendNotFound(res));
}

function openBrowser(url) {
  const platform = process.platform;
  const command =
    platform === 'win32'
      ? ['cmd', ['/c', 'start', '', url]]
      : platform === 'darwin'
        ? ['open', [url]]
        : ['xdg-open', [url]];

  try {
    const child = spawn(command[0], command[1], { stdio: 'ignore', detached: true });
    child.on('error', err => {
      console.warn('提示：自动打开浏览器失败，请手动访问链接。', err.message);
    });
    child.unref();
  } catch (err) {
    console.warn('提示：自动打开浏览器失败，请手动访问链接。', err.message);
  }
}

let hasOpened = false;
let server;
let restarting = false;

function createServer() {
  return http.createServer((req, res) => {
    const filePath = getFilePath(req.url);

    if (!filePath) {
      return sendForbidden(res);
    }

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isDirectory()) {
        const indexPath = path.join(filePath, 'index.html');
        return fs.access(indexPath, fs.constants.R_OK, accessErr => {
          if (accessErr) {
            return sendNotFound(res);
          }
          serveFile(res, indexPath);
        });
      }

      if (err) {
        return sendNotFound(res);
      }

      serveFile(res, filePath);
    });
  });
}

function listen(currentServer) {
  currentServer.listen(PORT, HOST, () => {
    const addressInfo = currentServer.address();
    const effectiveHost = HOST === '0.0.0.0' ? 'localhost' : addressInfo.address || HOST;
    const url = `http://${effectiveHost}:${addressInfo.port}`;
    console.log(`Serenity Puzzle server running at ${url}`);
    if (SHOULD_OPEN && !hasOpened) {
      openBrowser(url);
      hasOpened = true;
    }
  });
}

function restartServer(reason = 'manual restart') {
  if (!server || restarting) {
    return;
  }

  restarting = true;
  console.log(`Restarting server (${reason})...`);
  server.close(err => {
    if (err) {
      console.error('Error closing server during restart:', err.message);
    }
    server = createServer();
    listen(server);
    restarting = false;
  });
}

function enableKeyboardRestart() {
  if (!process.stdin.isTTY) return;

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  console.log('Press "r" to restart without stopping the server, Ctrl+C to quit.');

  process.stdin.on('keypress', (str, key) => {
    if (key.name === 'r') {
      restartServer('keypress');
    } else if (key.ctrl && key.name === 'c') {
      process.exit();
    }
  });
}

server = createServer();
listen(server);
enableKeyboardRestart();

['SIGHUP', 'SIGUSR2'].forEach(signal => {
  process.on(signal, () => restartServer(`${signal} received`));
});
