import React, { Component, useEffect } from 'react';
import { XTerm } from 'xterm-for-react';
const ResizableBox = require('react-resizable').ResizableBox;
const { ipcRenderer } = require('electron');
const { resizeTerminal, writeEnter } = require('./TerminalSetup');
import { terminalHandle } from './Handle/TerminalHandle';
import { Resizable } from 're-resizable';
import { Layout } from 'antd';
const { Footer } = Layout;
import { Scrollbars } from 'react-custom-scrollbars';
import ResizePanel from 'react-resize-panel';
import terminalStyle from '../../styles/Terminal';
import { useResizeDetector } from 'react-resize-detector';
import { useState } from 'react';
import './Terminal.css';
import './TerminalContainer.css';
import { useWindowResize } from 'beautiful-react-hooks';

const Terminal = (props) => {
  useEffect(() => {
    setWindowWidth(window.innerWidth - props.sidebarWidth);
    resizeTerminal();
  });

  const [windowWidth, setWindowWidth] = useState(
    window.innerWidth - props.sidebarWidth
  );

  useWindowResize((event) => {
    setWindowWidth(window.innerWidth - props.sidebarWidth);
    resizeTerminal();
  });

  const [termHeight, setTermHeight] = useState(300);

  return (
    <Footer style={terminalStyle}>
      <Resizable
        id="terminal"
        style={{ backgroundColor: '#282C34' }}
        size={{
          width: windowWidth,
          height: termHeight,
        }}
        onResizeStop={(e, direction, ref, d) => {
          if (direction !== 'top') return;
          resizeTerminal();
          setTermHeight(termHeight + d.height);
        }}
      ></Resizable>
    </Footer>
  );
};

export default Terminal;
