const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let mainWindow;
let server;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Lightweight built-in static HTTP server for serving Next.js export in production
function startLocalServer(callback) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
  };

  const outDir = path.join(__dirname, '../out');

  server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';

    let filePath = path.join(outDir, reqPath);

    // Fallback for directory or extensionless routes
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        const notFoundPath = path.join(outDir, '404.html');
        if (fs.existsSync(notFoundPath)) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          fs.createReadStream(notFoundPath).pipe(res);
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port;
    callback(`http://127.0.0.1:${port}`);
  });
}

function createWindow(loadUrl) {
  const iconPath = path.join(__dirname, '../assets/icon.png');

  mainWindow = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 1080,
    minHeight: 720,
    title: 'Kyorix Sports Technology — Certificate Generator',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    backgroundColor: '#FFFFFF',
    show: false,
  });

  mainWindow.loadURL(loadUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Native application menu
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Print Certificate',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            mainWindow.webContents.print();
          },
        },
        { type: 'separator' },
        { role: 'quit', label: 'Exit Kyorix Certificate Generator' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  if (isDev && process.env.ELECTRON_DEV_URL) {
    createWindow(process.env.ELECTRON_DEV_URL);
  } else {
    startLocalServer(url => {
      createWindow(url);
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (server) {
        const port = server.address().port;
        createWindow(`http://127.0.0.1:${port}`);
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
