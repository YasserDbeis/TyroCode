import React, { Component } from 'react';
// const Prism = require('prismjs');
import { useState } from 'react';
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

// good themes: coy - fun american colors, okaida - gothy but fun, tomorrow - not my style but its meh,

const TextEditor = (props) => {
  const [code, setCode] = useState(props.code);
  console.log(props.code);

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

  return (
    <Scrollbars>
      <Editor
        id="text-editor"
        value={code}
        onValueChange={(code) => codeChange(code)}
        highlight={(code) => hightlightWithLineNumbers(code, languages.java)}
        autoSave="true"
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          resize: 'none',
          overflow: 'hidden',
          minHeight: '100%',
        }}
        autoCapitalize="true"
        textareaId="codeArea"
        className="editor"
      />
    </Scrollbars>
  );
};

export default TextEditor;
