import * as langs from '../enums/ProgLanguages';

const getHighlightedCode = (code) => {
  let result = '';
  for (let c of code) {
    if (c === '{' || c === '}') {
      result += '<span style="color:teal;">';
      result += c;
      result += '</span>';
    } else {
      result += c;
    }
  }

  return result;
};

const insertBraceAtPos = (code, pos) => {
  return code.slice(0, pos) + '{}' + code.slice(pos);
};

const tabOverText = (editorTextarea, tabbedOverLinesStartPos) => {
  console.log('Tabbed over lines:', tabbedOverLinesStartPos);

  const numTabbedLines = tabbedOverLinesStartPos.length;

  for (let i = numTabbedLines - 1; i >= 0; i--) {
    const cursorPos = tabbedOverLinesStartPos[i];

    // move cursor to line start
    editorTextarea.focus();
    editorTextarea.setSelectionRange(cursorPos, cursorPos);

    // tab over text at line start cursor
    const spacedTab = ' '.repeat(4);
    document.execCommand('insertText', false, spacedTab);
  }
};

const getTabbedOverLinesStartPos = (code, start, end) => {
  const lines = code.split('\n');
  console.log('SPLIT: ', lines);

  let seenFrameStart = 0;
  let seenFrameEnd = -1;

  const tabbedOverLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const len = line.length;

    // accomodate newline character into length
    if (i != lines.length - 1) {
      len += 1;
    }

    seenFrameStart = seenFrameEnd + 1;
    seenFrameEnd = seenFrameStart + len - 1;

    console.log('INDEX:', i);
    console.log('START: ', start);
    console.log('END: ', end);
    console.log('seenFrameStart: ', seenFrameStart);
    console.log('seenFrameEnd: ', seenFrameEnd);
    console.log('len: ', len);

    if (line.trim().length == 0) {
      continue;
    }

    if (
      (start <= seenFrameStart && end >= seenFrameEnd) ||
      (start >= seenFrameStart && start <= seenFrameEnd) ||
      (end >= seenFrameStart && end <= seenFrameEnd)
    ) {
      tabbedOverLines.push(seenFrameStart);
    }
  }

  console.log('TABBEDOVERLINES', tabbedOverLines);

  return tabbedOverLines;
};

export { getHighlightedCode, tabOverText, getTabbedOverLinesStartPos };
