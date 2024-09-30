// client/electron/main.js

import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import { fork } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let serverProcess; 

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

function startServer() {
  console.log('Starting server...');
  const serverPath = path.join(__dirname, '..', '..', 'server', 'index.js');
  serverProcess = fork(serverPath);
  
  serverProcess.on('message', (message) => {
    console.log('Server message:', message);
  });

  serverProcess.on('error', (error) => {
    console.error('Server error:', error);
  });

  serverProcess.on('exit', (code, signal) => {
    console.log(`Server process exited with code ${code} and signal ${signal}`);
  });
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
  if (serverProcess) {
    console.log('Killing server process...');
    serverProcess.kill();
  }
});