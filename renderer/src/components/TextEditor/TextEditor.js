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
  isRedo,
  isUndo,
  isSave,
  isEnter,
  isMatchingChar,
  isTab,
} from '../../helpers/KeyDownHandlers';
import { getFullPath } from '../../helpers/FileDirectory';
import {
  getFileExtension,
  getProgLanguage,
} from '../../helpers/FilenameExtensions';
import os from 'os';
import UndoStack from '../../StateManagement/UndoStack';
import { Console } from 'console';
import autosize from 'autosize';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import { MacScrollbar } from 'mac-scrollbar';
import { scrollbarOptions } from '../../styles/Scrollbar';

const TAB_HEIGHT = 48;
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
  const [editorWidth, setEditorWidth] = useState(0);
  const [editorScrollWidth, setEditorScrollWidth] = useState(0);
  const [lineNumWidth, setLineNumWidth] = useState(0);

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

    if (editorRef) {
      setEditorWidth(editorRef.current.clientWidth);
      setEditorScrollWidth(editorRef.current.scrollWidth);
    }

    if (lineNumRef) {
      setLineNumWidth(lineNumRef.current.clientWidth);
    }
  }, [cursor]);

  const onCodeChange = (e) => {
    // console.log('CHANGED');
    const newCode = e.target.value;
    const lineNums = getLineNums(newCode);
    setCode(newCode);
    setLineNums(lineNums);
    setHighlightedCode(highlightCode(newCode));
    props.onCodeChange(newCode);

    // $('#editor-child-div').floatingScroll('update');
  };

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

    if (isSave(e)) {
      console.log('SAVING!', props.filepath);

      props.onSave(props.filepath);
    } else if (isRedo(e)) {
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
    } else if (isUndo(e)) {
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
    } else if (isEnter(e)) {
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
    } else if (isMatchingChar(e)) {
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
    } else if (isTab(e)) {
      const startCursor = editorRef.current.selectionStart;
      const endCursor = editorRef.current.selectionEnd;

      console.log('startCusrsor', startCursor);
      const currCode = editorRef.current.value;

      const currCodeSelection = currCode.slice(startCursor, endCursor);

      if (currCodeSelection.includes('\n')) {
        const [tabbedOverLinesStartPos, firstLineEmpty] =
          getTabbedOverLinesStartPos(currCode, startCursor, endCursor);
        console.log('FIRST LINE EMPTY', firstLineEmpty);
        let numTabbedOverLines = tabbedOverLinesStartPos.length;

        if (firstLineEmpty) {
          tabbedOverLinesStartPos.splice(0, 1);
          console.log('SPLICED', tabbedOverLinesStartPos);
          numTabbedOverLines -= 1;
        }

        const currentStackFrame = undoStack.current.getCurrentFrame();
        currentStackFrame.repetitions = numTabbedOverLines - 1;

        if (e.shiftKey) {
          console.log('SHIFT + TAB');
          console.log('TABBED OVER LINES', tabbedOverLinesStartPos);
          console.log('firstLineEmpty', firstLineEmpty);
          const [startShift, endShift] = unTabText(
            editorRef.current,
            currCode,
            tabbedOverLinesStartPos,
            firstLineEmpty
          );

          editorRef.current.setSelectionRange(
            startCursor - startShift,
            endCursor - endShift
          );
        } else {
          console.log('TAB');

          tabOverText(editorRef.current, tabbedOverLinesStartPos);

          const start = startCursor + (firstLineEmpty ? 0 : TAB_SIZE);
          const end = endCursor + numTabbedOverLines * TAB_SIZE;
          console.log('start!', start);
          console.log('end!', end);

          editorRef.current.setSelectionRange(start, end);
        }
      } else {
        if (e.shiftKey) {
          console.log('SINGLE SHIFT + TAB');
          const [tabbedOverLinesStartPos, firstLineEmpty] =
            getTabbedOverLinesStartPos(currCode, startCursor, endCursor);
          console.log('TABBED OVER LINES', tabbedOverLinesStartPos);
          console.log('FIRST LINE EMPTY', firstLineEmpty);
          const [startShift, endShift] = unTabText(
            editorRef.current,
            currCode,
            tabbedOverLinesStartPos,
            false
          );

          editorRef.current.setSelectionRange(
            Math.max(startCursor - startShift, tabbedOverLinesStartPos[0]),
            endCursor - endShift
          );
          // const cursorPos = editorRef.current.selectionStart

          // const whiteSpaceSize = getWhite

          // // if there is non-zero whitespace, shift-tab
          // if (whiteSpaceSize > 0) {
          //   editorTextarea.focus();
          //   editorTextarea.setSelectionRange(cursorPos, cursorPos + whiteSpaceSize);
          //   document.execCommand('delete');

          //   if (i == 0 && !firstLineEmpty) {
          //     startShift = whiteSpaceSize;
          //     console.log('WHITE SPACE', whiteSpaceSize);
          //   }
          // }
        } else {
          document.execCommand('insertText', false, FOUR_SPACE_TAB);
        }
      }

      e.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  function highlightCode(input) {
    const lang_ext = getFileExtension(props.filename);

    return getHighlightedCode(input, lang_ext);
  }

  function getLineNums(input) {
    return input
      .split('\n')
      .map((line, i) => `<span class="unselectable line-nums">${i + 1}</span>`)
      .join('</br>');
  }

  // if (editorRef.current) console.log(editorRef.current.scrollWidth);

  // console.log('Line Num Width', lineNumWidth);
  // console.log('Editor Width', editorWidth);

  return (
    <MacScrollbar
      {...scrollbarOptions}
      id="text-editor"
      style={{
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <MacScrollbar
        {...scrollbarOptions}
        className="scroller"
        id="editor-bottom-scrollbar"
        style={{
          marginLeft: lineNumWidth,
          width: editorWidth,
        }}
      >
        <div
          style={{
            width: editorScrollWidth,
            height: '20px',
          }}
        ></div>
      </MacScrollbar>

      <div id="text-editor-container">
        <div
          id="line-num-container"
          ref={lineNumRef}
          className="scroller text-editor-child"
          dangerouslySetInnerHTML={{ __html: lineNums }}
          style={{
            backgroundColor: '#282c34',
          }}
        ></div>
        <div
          style={{
            height: props.editorHeight,
          }}
          id="editor-container"
          className="text-editor-child"
        >
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
            onChange={onCodeChange}
            onKeyDown={onKeyDownHandler}
          ></textarea>
        </div>
      </div>
    </MacScrollbar>
  );
};

export default TextEditor;
