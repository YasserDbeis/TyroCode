import React, { Component } from 'react';
// const Prism = require('prismjs');
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages, plugins } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
const fs = require('fs');
import { useResizeDetector } from 'react-resize-detector';
import {
  getHighlightedCode,
  insertBraceAtPos,
  tabOverText,
} from '../../helpers/TextEditing';
import 'prismjs/themes/prism-coy.css'; //Example style, you can use another
import './TextEditor.css';

import { Scrollbars } from 'react-custom-scrollbars';
import TextArea from 'antd/lib/input/TextArea';
import { useWindowResize } from 'beautiful-react-hooks';
import { start } from 'repl';
import * as langs from '../../enums/ProgLanguages';
import { getProgLanguage } from '../../helpers/FilenameExtensions';

const TAB_HEIGHT = 40;

// good themes: coy - fun american colors, okaida - gothy but fun, tomorrow - not my style but its meh,

const TextEditor = (props) => {
  const [code, setCode] = useState(props.code);
  const [highlightedCode, setHighlightedCode] = useState(
    highlightCode(props.code)
  );
  const [lineNums, setLineNums] = useState(getLineNums(props.code));
  const [cursor, setCursor] = useState([props.code.length, props.code.length]);

  const editorRef = useRef(null);

  useEffect(() => {
    var scrollers = document.getElementsByClassName('scroller');

    function scrollAll(scrollTop, scrollLeft, scrollRight) {
      scrollers.forEach(function (element, index, array) {
        element.scrollTop = scrollTop;
        element.scrollLeft = scrollLeft;
        element.scrollRight = scrollRight;
      });
    }

    scrollers.forEach(function (element, index, array) {
      element.addEventListener('scroll', function (e) {
        scrollAll(
          e.target.scrollTop,
          e.target.scrollLeft,
          e.target.scrollRight
        );
      });
    });
  }, []);

  useLayoutEffect(() => {
    if (cursor && editorRef.current) {
      editorRef.current.focus();
      editorRef.current.setSelectionRange(cursor[0], cursor[1]);
      console.log('BEEP:', cursor);
    }
  }, [cursor]);

  function codeChange(e) {
    const newCode = e.target.value;
    const lineNums = getLineNums(newCode);
    setCode(newCode);
    setLineNums(lineNums);
    setHighlightedCode(highlightCode(newCode));
    props.codeChange(newCode);
  }

  function curlyBraceHandler(e) {
    if (e.keyCode == 219) {
      // if key is open curly brace

      /*
      let modifiedCode = insertBraceAtPos(code, e.target.selectionStart);

      setCode(modifiedCode);
      setHighlightedCode(getHighlightedCode(modifiedCode));
      setCursor(editorRef.current.selectionStart + 1);

      */

      document.execCommand('insertText', false, '{}');

      setCursor([
        editorRef.current.selectionStart - 1,
        editorRef.current.selectionStart - 1,
      ]);

      e.preventDefault();
      return false;
    } else if (e.keyCode == 9) {
      // if key is tab

      const startCursor = editorRef.current.selectionStart;
      const endCursor = editorRef.current.selectionEnd;
      const currCode = editorRef.current.value;

      const currCodeSelection = currCode.slice(startCursor, endCursor);
      console.log('HIGHLIGHT: ' + startCursor + ', ' + endCursor);
      console.log('CURRENT SELECTION:', currCodeSelection);

      if (currCodeSelection.includes('\n')) {
        console.log('SHOULD TAB THINGS OVER');

        let tabbedOverCode = tabOverText(code, startCursor, endCursor);
        console.log('TABBED OVER: ', tabbedOverCode);
        setCode(tabbedOverCode);
        setHighlightedCode(highlightCode(tabbedOverCode));
      } else {
        document.execCommand('insertText', false, '\t');
      }

      // setCursor([
      //   editorRef.current.selectionStart - 1,
      //   editorRef.current.selectionStart - 1,
      // ]);

      e.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  function highlightCode(input) {
    let lang = getProgLanguage(props.filename);

    return getHighlightedCode(input, lang);
  }

  // function courtesy of https://github.com/bogutski
  function getLineNums(input) {
    return input
      .split('\n')
      .map((line, i) => `${i + 1}`)
      .join('\n');
  }

  return (
    <Scrollbars>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TextArea
          unselectable="on"
          onSelectCapture={() => {
            return false;
          }}
          onMouseDown={() => {
            return false;
          }}
          readOnly={true}
          className="scroller"
          value={lineNums}
          style={{
            width: '15%',
            height: props.windowHeight - props.terminalHeight - TAB_HEIGHT,
            backgroundColor: '#282c34',
            color: 'white',
            borderColor: 'transparent',
            textAlign: 'center',
          }}
        ></TextArea>
        <div
          className="scroller editor-area"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          align="left"
          style={{
            height: props.windowHeight - props.terminalHeight - TAB_HEIGHT,
            color: 'white',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        ></div>
        <textarea
          className="scroller editor-area"
          ref={editorRef}
          value={code}
          onChange={codeChange}
          onKeyDown={curlyBraceHandler}
          style={{
            height: props.windowHeight - props.terminalHeight - TAB_HEIGHT,
            color: 'transparent',
            caretColor: 'white',
            pointerEvents: 'auto',
          }}
        ></textarea>
      </div>
    </Scrollbars>
  );
};

export default TextEditor;
