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
import Scrollbars from 'react-custom-scrollbars';
import TextArea from 'antd/lib/input/TextArea';
import * as keys from '../../enums/KeyboardCodes';
import {
  isNonInsertionKey,
  isComboNonShiftKeyActive,
  isPasteKeyCombo,
} from '../../helpers/KeyDownHandlers';
import { getFullPath } from '../../helpers/FileDirectory';
import { getProgLanguage } from '../../helpers/FilenameExtensions';
import os from 'os';
import UndoStack from '../../StateManagement/UndoStack';
import { Console } from 'console';
import autosize from 'autosize';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import { MacScrollbar } from 'mac-scrollbar';

const TAB_HEIGHT = 40;
const MAC_PLATFORM = 'darwin';
const NO_REPITITIONS = -1;
const FOUR_SPACE_TAB = ' '.repeat(4);
const TAB_SIZE = 4;

// good themes: coy - fun american colors, okaida - gothy but fun, tomorrow - not my style but its meh,

const TextEditor = (props) => {
  const [code, setCode] = useState(props.code);
  const [highlightedCode, setHighlightedCode] = useState(props.code);
  const [lineNums, setLineNums] = useState(getLineNums(props.code));
  const [cursor, setCursor] = useState([props.code.length, props.code.length]);

  const editorRef = useRef(null);
  const lineNumRef = useRef(null);

  const undoStack = useRef(new UndoStack());

  useEffect(() => {
    var scrollers = document.getElementsByClassName('scroller');

    function scrollAll(scrollLeft) {
      scrollers.forEach(function (element, index, array) {
        element.scrollLeft = scrollLeft;
      });
    }

    scrollers.forEach(function (element, index, array) {
      element.addEventListener('scroll', function (e) {
        scrollAll(e.target.scrollLeft);
      });
    });

    // $('#editor-child-div').floatingScroll();

    // editorRef.current.focus();
    // autosize(editorRef.current);

    setHighlightedCode(getHighlightedCode(code));
  }, []);

  useEffect(() => {
    const newCode = props.code;
    const lineNums = getLineNums(newCode);
    setCode(newCode);
    setLineNums(lineNums);
    setHighlightedCode(highlightCode(newCode));
  }, [props.code]);

  useLayoutEffect(() => {
    if (cursor && editorRef.current) {
      editorRef.current.focus();
      editorRef.current.setSelectionRange(cursor[0], cursor[1]);
    }
  }, [cursor]);

  function codeChange(e) {
    console.log('CHANGED');
    const newCode = e.target.value;
    const lineNums = getLineNums(newCode);
    setCode(newCode);
    setLineNums(lineNums);
    setHighlightedCode(highlightCode(newCode));
    props.codeChange(newCode);

    // $('#editor-child-div').floatingScroll('update');
  }

  function onKeyDownHandler(e) {
    // console.log('ORESSED', e.keyCode);
    // console.log(
    //   'VALUE:' +
    //     ', ' +
    //     isNonInsertionKey(e.keyCode) +
    //     ', ' +
    //     !isComboKeyActivated(e)
    // );

    if (
      (isNonInsertionKey(e.keyCode) && !isComboNonShiftKeyActive(e)) ||
      isPasteKeyCombo(e)
    ) {
      const keyCodeStr = e.keyCode.toString();
      undoStack.current.push({
        keyCode: [keyCodeStr],
        repetitions: NO_REPITITIONS,
      });
      console.log(undoStack.current);
    }
    const isMac = os.platform() == MAC_PLATFORM;

    if (
      ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) &&
      e.keyCode == keys.S_KEYCODE
    ) {
      console.log('SAVING!', props.filepath);

      props.onSave(props.filepath);
    } else if (e.keyCode == keys.Z_KEYCODE) {
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
      // console.log(
      //   (prevFrame == null).toString() + '::' + prevFrame.keyCode.toString()
      // );
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

  function getLineNums(input) {
    return input
      .split('\n')
      .map((line, i) => `<span class="unselectable line-nums">${i + 1}</span>`)
      .join('</br>');
  }

  // if (editorRef.current) console.log(editorRef.current.scrollWidth);

  return (
    <div
      id="text-editor"
      style={{
        height: 'inherit',
      }}
    >
      <MacScrollbar
        skin="light"
        suppressAutoHide={true}
        className="scroller"
        id="editor-bottom-scrollbar"
        style={
          lineNumRef.current && editorRef.current
            ? {
                marginLeft: lineNumRef.current.clientWidth,
                width: editorRef.current.clientWidth,
              }
            : null
        }
      >
        <div
          style={
            editorRef.current
              ? {
                  width: editorRef.current.scrollWidth,
                  height: '20px',
                }
              : null
          }
        ></div>
      </MacScrollbar>

      <Scrollbars id="text-editor-container">
        <div
          id="line-num-container"
          ref={lineNumRef}
          className="scroller text-editor-child"
          dangerouslySetInnerHTML={{ __html: lineNums }}
          style={{
            backgroundColor: '#282c34',
          }}
        ></div>
        <div id="editor-container" className="text-editor-child">
          <div
            id="editor-child-div"
            className="scroller editor-child"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            align="left"
          ></div>
          <textarea
            id="editor-child-textarea"
            className="scroller editor-child"
            ref={editorRef}
            value={code}
            onChange={codeChange}
            onKeyDown={onKeyDownHandler}
          ></textarea>
        </div>
      </Scrollbars>
    </div>
  );
};

export default TextEditor;
