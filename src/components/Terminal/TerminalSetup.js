const ipc = require('electron').ipcRenderer;
import { FitAddon } from 'xterm-addon-fit';

const terminalWelcomeMessage = 'Press Enter to Use The YSCode Terminal...';

let fitAdd = null;
let termProxy = null;

const initTerminal = () => {
  const term = createTerminal();

  const fitAddon = getFitAddon();

  term.loadAddon(fitAddon);
  term.open(document.getElementById('terminal'));
  ipc.on('terminal.incomingData', (event, data) => {
    term.write(data);
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
    // console.log('resizing');
  } else {
    // console.log('not resizing');
  }
};

const createTerminal = () => {
  termProxy = new Terminal({
    convertEol: true,
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

const writeEnter = async () => {
  termProxy.writeln('');

  for (let welcomeMessageChar of terminalWelcomeMessage) {
    termProxy.write(welcomeMessageChar);
    await new Promise((r) => setTimeout(r, 50));
  }
  termProxy.writeln('');
};

const writeCodeResult = (result) => {
  termProxy.writeln('');

  termProxy.write(result);

  termProxy.writeln('');

  termProxy.focus();
};

export {
  initTerminal,
  getFitAddon,
  resizeTerminal,
  writeEnter,
  writeCodeResult,
};
