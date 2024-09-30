// electron/main.js

import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let server;

async function importServer() {
  console.log('Attempting to import server...');
  try {
    if (isDev) {
      console.log('Importing server in development mode');
      return await import('../server/index.js');
    } else {
      const serverPath = path.join(app.getAppPath(), 'server', 'index.js');
      console.log(`Importing server in production mode from: ${serverPath}`);
      return await import(serverPath);
    }
  } catch (error) {
    console.error('Error importing server:', error);
    throw error;
  }
}

function createWindow() {
  console.log('Creating main window...');
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  const url = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  console.log(`Loading URL: ${url}`);
  mainWindow.loadURL(url);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'right' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function startServer() {
  try {
    console.log('Starting server...');
    const { createServer } = await importServer();
    const app = createServer();
    server = http.createServer(app);
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

app.whenReady().then(() => {
  console.log('App is ready, creating window and starting server...');
  createWindow();
  startServer();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('quit', () => {
  if (server) {
    console.log('Closing server...');
    server.close();
  }
});