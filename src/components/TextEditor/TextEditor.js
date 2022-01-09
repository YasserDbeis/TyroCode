import React, { Component } from 'react';
// const Prism = require('prismjs');
import { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages, plugins } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
const fs = require('fs');
import { useResizeDetector } from 'react-resize-detector';

import 'prismjs/themes/prism-coy.css'; //Example style, you can use another
import './TextEditor.css';

import { Scrollbars } from 'react-custom-scrollbars';
import TextArea from 'antd/lib/input/TextArea';
import { useWindowResize } from 'beautiful-react-hooks';
const TAB_HEIGHT = 40;

// good themes: coy - fun american colors, okaida - gothy but fun, tomorrow - not my style but its meh,

const TextEditor = (props) => {
  const [code, setCode] = useState(props.code);
  console.log(props.code);

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  });

  useWindowResize((event) => {
    setWindowHeight(window.innerHeight);
  });

  function codeChange(code) {
    props.codeChange(code);
    onCode(code);
  }

  function onCode(newCode) {
    setCode(newCode);

    const splitOnLineCode = newCode.split('\n');
    console.log(splitOnLineCode);

    const lineNums = document.getElementsByClassName('editorLineNumber');
    console.log(lineNums);
    var letterCount = 0;
    var i = 0;
    for (const line of splitOnLineCode) {
      letterCount += line.length;

      lineNums[i].setAttribute('style', 'color: white');

      console.log(letterCount);

      i++;
    }
  }

  // function courtesy of https://github.com/bogutski
  function hightlightWithLineNumbers(input, language) {
    return highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
      .join('\n');
  }
  console.log('WINDOW: ', windowHeight);
  console.log('termina: ', props.terminalHeight);

  return (
    <Scrollbars>
      <TextArea
        style={{
          height: windowHeight - props.terminalHeight - TAB_HEIGHT,
        }}
      ></TextArea>
    </Scrollbars>
  );
};

export default TextEditor;
