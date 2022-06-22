import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
// const {initTerminal} = require('./components/Terminal/TerminalSetup');
// import { TitleBar } from 'electron-react-titlebar/renderer';

// import Titlebar from 'react-electron-titlebar';
// import 'electron-react-titlebar/assets/style.css';
// const { app, Menu } = require('electron');

// const isMac = process.platform === 'darwin';

// const menuTemplate = [
//   {
//     label: 'App',
//     submenu: [
//       {
//         label: 'Disabled',
//         enabled: false,
//       },
//       {
//         label: 'Not Visiable',
//         visiable: false,
//       },
//       {
//         label: 'Arguments',
//         click: (item, e) => console.log(item, e),
//       },
//       { type: 'separator' },
//       {
//         label: 'Checkbox',
//         type: 'checkbox',
//         checked: true,
//         click: (item, e) => console.log(item),
//       },
//       {
//         label: 'Quit',
//         click: () => {
//           window.close();
//         },
//       },
//     ],
//   },
//   {
//     label: 'Color',
//     submenu: [
//       {
//         label: 'Light',
//         type: 'radio',
//         checked: false,
//         click: (item, e) =>
//           (document.querySelector('html').style.background =
//             'rgb(240,240,240)'),
//       },
//       {
//         label: 'Dark',
//         type: 'radio',
//         checked: true,
//         click: (item, e) =>
//           (document.querySelector('html').style.background = 'rgb(64,64,64)'),
//       },
//       {
//         label: 'Black',
//         type: 'radio',
//         checked: false,
//         click: (item, e) =>
//           (document.querySelector('html').style.background = 'rgb(0,0,0)'),
//       },
//     ],
//   },
//   {
//     label: 'Help',
//     submenu: [
//       {
//         label: 'Homepage',
//         click: () => {
//           openExternal(
//             'https://github.com/KochiyaOcean/electron-react-titlebar'
//           );
//         },
//       },
//     ],
//   },
// ];

// ReactDOM.render(
//   <TitleBar menu={menuTemplate} />,
//   document.getElementById('title-bar')
// );

// ReactDOM.render(
//   <Titlebar
//     title="App Title"
//     backgroundColor="#000000"
//     style={{ height: '50px' }}
//   />,
//   document.getElementById('title-bar')
// );

ReactDOM.render(
  <App appTitle="Person Manager" />,
  document.getElementById('root')
);
// initTerminal()

registerServiceWorker();
