import path from 'node:path';
import { app, BrowserWindow } from 'electron';

const DEV_SERVER_URL = 'http://127.0.0.1:5173';

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1280,
    minHeight: 820,
    title: '数据跨境服务平台',
    backgroundColor: '#eef3f8',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (app.isPackaged) {
    void mainWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: '/splash',
    });
    return;
  }

  const rendererUrl = process.env.ELECTRON_RENDERER_URL ?? DEV_SERVER_URL;
  void mainWindow.loadURL(`${rendererUrl}#/splash`);
  mainWindow.webContents.openDevTools({ mode: 'detach' });
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
