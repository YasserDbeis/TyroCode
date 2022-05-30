import React from 'react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import fs from 'fs';
import {
  getHighlightedCode,
  tabOverText,
  unTabText,
  getTabbedOverLinesStartPos,
} from '../../helpers/TextEditing';
import './TextEditor.css';
import { Scrollbars } from 'react-custom-scrollbars';
import TextArea from 'antd/lib/input/TextArea';
import * as keys from '../../enums/KeyboardCodes';
import {
  isNonInsertionKey,
  isComboNonShiftKeyActive,
} from '../../helpers/KeyDownHandlers';
import { getProgLanguage } from '../../helpers/FilenameExtensions';
import os from 'os';
import UndoStack from '../../StateManagement/UndoStack';

const TAB_HEIGHT = 40;
const MAC_PLATFORM = 'darwin';
const NO_REPITITIONS = -1;
const FOUR_SPACE_TAB = ' '.repeat(4);
const TAB_SIZE = 4;

// good themes: coy - fun american colors, okaida - gothy but fun, tomorrow - not my style but its meh,

const TextEditor = (props) => {
  const [code, setCode] = useState(props.code);
  const [highlightedCode, setHighlightedCode] = useState(
    highlightCode(props.code)
  );
  const [lineNums, setLineNums] = useState(getLineNums(props.code));
  const [cursor, setCursor] = useState([props.code.length, props.code.length]);

  const editorRef = useRef(null);
  let undoStack = useRef(new UndoStack());

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

  function onKeyDownHandler(e) {
    console.log('ORESSED', e.keyCode);
    // console.log(
    //   'VALUE:' +
    //     ', ' +
    //     isNonInsertionKey(e.keyCode) +
    //     ', ' +
    //     !isComboKeyActivated(e)
    // );

    if (isNonInsertionKey(e.keyCode) && !isComboNonShiftKeyActive(e)) {
      const keyCodeStr = e.keyCode.toString();
      undoStack.current.push({
        keyCode: [keyCodeStr],
        repetitions: NO_REPITITIONS,
      });
      // console.log(e.key);
    }

    if (e.keyCode == keys.Z_KEYCODE) {
      const isMac = os.platform() == MAC_PLATFORM;

      if ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) {
        if (e.shiftKey) {
          console.log('REDO');
          const redidFrame = undoStack.current.redo();

          if (redidFrame != null) {
            const numRepitions = redidFrame.repetitions;
            console.log('NUM REP', numRepitions);
            if (numRepitions != NO_REPITITIONS) {
              for (let i = 0; i < numRepitions; i++) {
                console.log('REDO AGAIN!!');
                document.execCommand('redo');
              }
            }
          }
        } else {
          console.log('UNDO');
          const undidFrame = undoStack.current.undo();

          if (undidFrame != null) {
            const numRepitions = undidFrame.repetitions;
            console.log('NUM REP', numRepitions);
            if (numRepitions != NO_REPITITIONS) {
              for (let i = 0; i < numRepitions; i++) {
                console.log('UNDO AGAIN!!');
                document.execCommand('undo');
              }
            }
          }
        }
      }
    } else if (e.keyCode == keys.ENTER_KEYCODE) {
      const prevFrame = undoStack.current.getPrevFrame();
      console.log(
        (prevFrame == null).toString() + '::' + prevFrame.keyCode.toString()
      );
      if (prevFrame && prevFrame.keyCode == keys.OPEN_BRACKETS_KEYCODE) {
        document.execCommand('insertText', false, '\n');
        setCursor([
          editorRef.current.selectionStart - 1,
          editorRef.current.selectionStart - 1,
        ]);
      }
    } else if (
      e.keyCode == keys.OPEN_BRACKETS_KEYCODE ||
      (e.keyCode == keys.OPEN_PAREN_KEYCODE && e.shiftKey)
    ) {
      // default brackets to open parenthesis
      let brackets = '()';

      if (e.keyCode == keys.OPEN_BRACKETS_KEYCODE) {
        brackets = e.shiftKey ? '{}' : '[]';
      }

      document.execCommand('insertText', false, brackets);

      setCursor([
        editorRef.current.selectionStart - 1,
        editorRef.current.selectionStart - 1,
      ]);

      e.preventDefault();
      return false;
    } else if (e.keyCode == keys.TAB_KEYCODE) {
      const startCursor = editorRef.current.selectionStart;
      const endCursor = editorRef.current.selectionEnd;
      const currCode = editorRef.current.value;

      const currCodeSelection = currCode.slice(startCursor, endCursor);

      if (currCodeSelection.includes('\n')) {
        const tabbedOverLinesStartPos = getTabbedOverLinesStartPos(
          currCode,
          startCursor,
          endCursor
        );

        const numTabbedOverLines = tabbedOverLinesStartPos.length;

        const currentStackFrame = undoStack.current.getCurrentFrame();
        currentStackFrame.repetitions = numTabbedOverLines - 1;

        if (e.shiftKey) {
          console.log('SHIFT + TAB');
          const [startShift, endShift] = unTabText(
            editorRef.current,
            currCode,
            tabbedOverLinesStartPos
          );

          editorRef.current.setSelectionRange(
            startCursor - startShift,
            endCursor - endShift
          );
        } else {
          console.log('TAB');
          tabOverText(editorRef.current, tabbedOverLinesStartPos);

          const numShiftedLines = tabbedOverLinesStartPos.length;
          editorRef.current.setSelectionRange(
            startCursor + TAB_SIZE,
            endCursor + numShiftedLines * TAB_SIZE
          );
        }
      } else {
        document.execCommand('insertText', false, FOUR_SPACE_TAB);
      }

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
            resize: 'none',
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
          onKeyDown={onKeyDownHandler}
          style={{
            height: props.windowHeight - props.terminalHeight - TAB_HEIGHT,
            color: 'transparent',
            caretColor: 'white',
            pointerEvents: 'auto',
            resize: 'none',
          }}
        ></textarea>
      </div>
    </Scrollbars>
  );
};

export default TextEditor;
