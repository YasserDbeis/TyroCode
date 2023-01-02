const { BrowserWindow, app, ipcMain, Notification } = require('electron');
const path = require('path');
const pty = require('node-pty');
const os = require('os');
var shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

const isDev = !app.isPackaged;

let window;

const createWindow = () => {
  window = new BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 600,
    minWidth: 950,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    // frame: false,
  });

  // window.removeMenu(false);
  if (isDev) {
    window.webContents.openDevTools();
  }

  window.loadFile(path.join(__dirname, '../resources/index.html'));

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
};

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    ignored: path.join(__dirname, 'src', 'test-code'),
  });
}

var ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  // cols: 40,
  // rows: 50,
  cwd: process.env.HOME,
  env: process.env,
});

app.on('ready', () => {
  // require('electron-react-titlebar/main').initialize();

  createWindow();

  // require('electron-react-titlebar/main').initialize();

  ptyProcess.on('data', (data) => {
    window.webContents.send('terminal.incomingData', data);
    console.log('Data sent');
  });

  ipcMain.on('terminal.resize', (event, size) => {
    ptyProcess.resize(size.cols, size.rows);
  });

  ipcMain.on('terminal.keystroke', (event, key) => {
    ptyProcess.write(key);
  });

  ipcMain.on('terminal.path_change', (event, pathChange) => {
    ptyProcess.write(pathChange);
    ptyProcess.write('\n');
  });

  ipcMain.on('terminal.enter', (event) => {
    ptyProcess.write('\n');
  });
});
