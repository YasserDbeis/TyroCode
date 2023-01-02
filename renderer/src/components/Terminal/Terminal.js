import React, { Component, useEffect, forwardRef } from 'react';
import { XTerm } from 'xterm-for-react';
const ResizableBox = require('react-resizable').ResizableBox;
const { ipcRenderer } = require('electron');
const { resizeTerminal } = require('./TerminalSetup');
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
import { setVisibility } from '../../helpers/DomManipulation';

const HANDLE_HEIGHT = 10;

const Terminal = forwardRef((props, ref) => {
  const [windowWidth, setWindowWidth] = useState(
    window.innerWidth - props.sidebarWidth
  );

  useEffect(() => {
    setWindowWidth(window.innerWidth - props.sidebarWidth);
    resizeTerminal();
  });

  useWindowResize((event) => {
    setWindowWidth(window.innerWidth - props.sidebarWidth);
    resizeTerminal();
  });

  const [termHeight, setTermHeight] = useState(300 - HANDLE_HEIGHT);

  return (
    <Footer ref={ref} style={terminalStyle}>
      <Resizable
        id="terminal"
        style={{ backgroundColor: '#282C34' }}
        size={{
          width: windowWidth,
          height: termHeight,
        }}
        minHeight="10vh"
        maxHeight="50vh"
        onResizeStart={(e, direction, ref) => {
          const bottomScrollbar = document.getElementById(
            'editor-bottom-scrollbar'
          );

          const sideScrollbar = document.querySelector(
            '#text-editor > div.ms-track-box.ms-theme-light > div'
          );

          setVisibility(bottomScrollbar, false);
          setVisibility(sideScrollbar, false);
        }}
        onResizeStop={(e, direction, ref, d) => {
          if (direction !== 'top') return;
          resizeTerminal();
          console.log('TERM HEIGHT', termHeight);
          console.log('D HEIGHT', d.height);

          setTermHeight(termHeight + d.height);
          props.onTermExpand(termHeight + d.height + HANDLE_HEIGHT);

          const bottomScrollbar = document.getElementById(
            'editor-bottom-scrollbar'
          );

          const sideScrollbar = document.querySelector(
            '#text-editor > div.ms-track-box.ms-theme-light > div'
          );

          setVisibility(bottomScrollbar, true);
          setVisibility(sideScrollbar, true);
        }}
      ></Resizable>
    </Footer>
  );
});

export default Terminal;
