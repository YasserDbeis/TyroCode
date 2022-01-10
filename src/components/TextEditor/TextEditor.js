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

    function scrollAll(scrollTop) {
      scrollers.forEach(function (element, index, array) {
        console.log('YOOOO!!');
        element.scrollTop = scrollTop;
      });
    }

    scrollers.forEach(function (element, index, array) {
      element.addEventListener('scroll', function (e) {
        scrollAll(e.target.scrollTop);
      });
    });
  }, []);

  function codeChange(e) {
    const newCode = e.target.value;
    const lineNums = getLineNums(newCode);
    console.log('NEW CODE:');
    setCode(newCode);
    setLineNums(lineNums);
    props.codeChange(newCode);
  }

  // function courtesy of https://github.com/bogutski
  function getLineNums(input) {
    return input
      .split('\n')
      .map((line, i) => `${i + 1}`)
      .join('\n');
  }
  // console.log('WINDOW: ', windowHeight);
  // console.log('termina: ', props.terminalHeight);

  return (
    <Scrollbars>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TextArea
          className="scroller"
          value={lineNums}
          style={{ width: '10%' }}
        ></TextArea>
        <TextArea
          className="scroller"
          value={code}
          onChange={codeChange}
          style={{
            height: props.windowHeight - props.terminalHeight - TAB_HEIGHT,
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            overflowX: 'scroll',
          }}
        ></TextArea>
      </div>
    </Scrollbars>
  );
};

export default TextEditor;
