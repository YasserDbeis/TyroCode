import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
// const {initTerminal} = require('./components/Terminal/TerminalSetup');

ReactDOM.render(
  <App appTitle="Person Manager" />,
  document.getElementById('root')
);
// initTerminal()

registerServiceWorker();
