const { BrowserWindow, app, ipcMain, Notification } = require('electron');
const path = require('path');
const pty = require('node-pty');
const os = require('os');
var shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

const isDev = !app.isPackaged;

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  win.webContents.openDevTools();
  win.loadURL('file://' + __dirname + '/index.html');

  // win.loadURL('file://' + path.join(__dirname, 'index.html'))   //send boolean to indicate whether this is the first start up of the app

  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
  } = require('electron-devtools-installer');
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => {
      console.log('Added Extension');
    })
    .catch((err) => {
      console.log(err);
    });
}

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  });
}

var ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 150,
  rows: 50,
  cwd: process.cwd(),
  env: process.env,
});

app.on('ready', () => {
  createWindow();

  ptyProcess.on('data', (data) => {
    win.webContents.send('terminal.incomingData', data);
    // console.log('Data sent');
  });

  ipcMain.on('terminal.keystroke', (event, key) => {
    ptyProcess.write(key);
  });
});
