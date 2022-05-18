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
} from '../../helpers/SyntaxHighlighting';
import 'prismjs/themes/prism-coy.css'; //Example style, you can use another
import './TextEditor.css';

import { Scrollbars } from 'react-custom-scrollbars';
import TextArea from 'antd/lib/input/TextArea';
import { useWindowResize } from 'beautiful-react-hooks';
import { start } from 'repl';
const TAB_HEIGHT = 40;

// good themes: coy - fun american colors, okaida - gothy but fun, tomorrow - not my style but its meh,

const TextEditor = (props) => {
  const [code, setCode] = useState(props.code);
  const [highlightedCode, setHighlightedCode] = useState(
    highlightCode(props.code)
  );
  const [lineNums, setLineNums] = useState(getLineNums(props.code));
  const [cursor, setCursor] = useState(props.code.length);

  const editorRef = useRef(null);

  //   useEffect(() => {
  //     const input = ref.current;
  //     if (input) input.setSelectionRange(cursor, cursor);
  //  }, [ref, cursor, value]);

  useEffect(() => {
    var scrollers = document.getElementsByClassName('scroller');

    // var scrollerDivs = Array.prototype.filter.call(
    //   scrollers,
    //   function (testElement) {
    //     return testElement.nodeName === 'DIV';
    //   }
    // );
    console.log(scrollers);

    function scrollAll(scrollTop, scrollLeft, scrollRight) {
      scrollers.forEach(function (element, index, array) {
        console.log('YOOOO!!');
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

    // const input = editorRef.current;
    // if (input) {
    //   input.selectionStart = cursor;
    //   input.selectionEnd = cursor;
    //   console.log('YOO:', cursor);
    // }
  }, []);

  useLayoutEffect(() => {
    if (cursor && editorRef.current) {
      editorRef.current.focus();
      editorRef.current.setSelectionRange(cursor, cursor);
      console.log('BEEP:', cursor);
    }
  }, [cursor]);

  function codeChange(e) {
    const newCode = e.target.value;
    const lineNums = getLineNums(newCode);
    console.log('NEW CODE:');
    setCode(newCode);
    setLineNums(lineNums);
    setHighlightedCode(highlightCode(newCode));
    props.codeChange(newCode);
    setCursor(e.target.selectionStart);
  }

  function curlyBraceHandler(e) {
    if (e.keyCode == 219) {
      let modifiedCode = insertBraceAtPos(code, e.target.selectionStart);

      // console.log('EDITOR REF', editorRef.current.value);
      // console.log('EDITOR REF SELECTION', editorRef.current.selectionStart);

      setCode(modifiedCode);
      setHighlightedCode(getHighlightedCode(modifiedCode));
      setCursor(editorRef.current.selectionStart + 1);

      e.preventDefault();
    }

    return true;
  }

  function highlightCode(input) {
    return getHighlightedCode(input);
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
          // onFocus={(e) => {
          //   e.target.selectionStart = cursor;
          // }}
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
