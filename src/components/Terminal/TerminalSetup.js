const ipc = require('electron').ipcRenderer;
import { FitAddon } from 'xterm-addon-fit';

let fitAdd = null;
let termProxy = null;

const initTerminal = () => {
  const term = createTerminal();

  const fitAddon = getFitAddon();

  term.loadAddon(fitAddon);
  term.open(document.getElementById('terminal'));
  ipc.on('terminal.incomingData', (event, data) => {
    term.write(data);
    var enc = new TextEncoder();
    console.log(data);
  });

  term.onData((e) => {
    ipc.send('terminal.keystroke', e);
  });

  resizeTerminal();

  fitAdd = fitAddon;

  writeEnter();
};

const getFitAddon = () => {
  fitAdd = new FitAddon();
  return fitAdd;
};

const resizeTerminal = () => {
  if (fitAdd != null) {
    fitAdd.fit();
    console.log('resizing');
  } else {
    console.log('not resizing');
  }
};

const createTerminal = () => {
  termProxy = new Terminal({
    rows: 30,
    cols: 80,
    cursorBlink: true,
    theme: {
      background: '#282C34',
      foreground: '#FFFFFF',
      selection: '#FFFFFF',
    },
  });

  return termProxy;
};

const writeEnter = () => {
  termProxy.write('\n');
  termProxy.write([
    67, 58, 92, 85, 115, 101, 114, 115, 92, 85, 115, 101, 114, 92, 68, 101, 115,
    107, 116, 111, 112, 92, 80, 101, 114, 115, 111, 110, 97, 108, 32, 80, 114,
    111, 106, 101, 99, 116, 115, 92, 121, 115, 99, 111, 100, 101, 62,
  ]);
};

const writeCodeResult = (result) => {
  termProxy.write('\r\n');

  termProxy.write(result);

  termProxy.write('\r');
  termProxy.focus();
  termProxy.write([
    67, 58, 92, 85, 115, 101, 114, 115, 92, 85, 115, 101, 114, 92, 68, 101, 115,
    107, 116, 111, 112, 92, 80, 101, 114, 115, 111, 110, 97, 108, 32, 80, 114,
    111, 106, 101, 99, 116, 115, 92, 121, 115, 99, 111, 100, 101, 62,
  ]);
  //writeEnter()
};

export {
  initTerminal,
  getFitAddon,
  resizeTerminal,
  writeEnter,
  writeCodeResult,
};
