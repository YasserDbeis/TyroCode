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
  const [highlightedCode, setHighlightedCode] = useState(
    highlightCode(props.code)
  );
  const [lineNums, setLineNums] = useState(getLineNums(props.code));

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
  }, []);

  function codeChange(e) {
    const newCode = e.target.value;
    const lineNums = getLineNums(newCode);
    console.log('NEW CODE:');
    setCode(newCode);
    setLineNums(lineNums);
    setHighlightedCode(highlightCode(newCode));
    props.codeChange(newCode);
  }

  function highlightCode(input) {
    return (
      input.slice(0, 5) +
      '<span style="color:teal; -webkit-text-stroke: 1px teal;">' +
      input.slice(5, 15) +
      '</span>' +
      input.slice(15)
    );
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
          }}
        ></TextArea>
        <div
          className="scroller"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          align="left"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '85%',
            height: props.windowHeight - props.terminalHeight - TAB_HEIGHT,
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            overflowX: 'scroll',
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            padding: '5px',
            borderColor: 'transparent',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        ></div>
        <TextArea
          className="scroller"
          value={code}
          onChange={codeChange}
          style={{
            opacity: '100%',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '85%',
            height: props.windowHeight - props.terminalHeight - TAB_HEIGHT,
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            overflowX: 'scroll',
            backgroundColor: '#282c34',
            color: 'transparent',
            caretColor: 'white',
            border: 'none',
            padding: '5px',
            borderColor: 'transparent',
            pointerEvents: 'auto',
          }}
        ></TextArea>
      </div>
    </Scrollbars>
  );
};

export default TextEditor;
