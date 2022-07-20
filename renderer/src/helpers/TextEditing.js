import { extToPrismLang } from './FilenameExtensions';
import { tokenize } from 'prismjs/components/prism-core';

const TAB_SIZE = 4;

const tokenContentToString = (contents) => {
  if (typeof contents == 'string') {
    return contents
      .replace(/&/g, '&amp;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  let totalContent = '';

  for (const content of contents) {
    if (typeof content == 'object') {
      // console.log('CONTENT', content);
      // console.log('CONTENT TYPE', content.type);

      const tokenStr = tokenContentToString(content.content);
      totalContent += syntaxHighlight(tokenStr, content.type);
    } else {
      totalContent += content
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
  }

  return totalContent;
};

const getSyntaxColor = (tokenType) => {
  const result =
    {
      keyword: '#56B6C2',
      builtin: '#A0C280',
      'class-name': '#e5c07b',
      function: '#98c379',
      'function-variable': '#98c379',
      boolean: '#6FB4C0',
      'double-colon': '#6FB4C0',
      directive: '#D17277',
      number: '#C678DD',
      string: '#e5c07b',
      char: '#BBBBBB',
      operator: '#E06C75',
      comment: '#5c6370',
      variable: '#D17277',
      regex: '#e5c07b',
      constant: '#98c379',
      punctuation: '#BBBBBB',
      tag: '#D17277',
      script: '#D17277',
      'attr-value': '#DFC185',
      'attr-equals': '#BABBBB',
      'attr-name': '#A0C280',
      selector: '#A0C280',
      property: '#BBBBBB',
      doctype: '#5c6370',
      cdata: '#D17277',
      entity: '#DFC285',
      prolog: '#5c6370',
      namespace: '#74ADE9',
      important: '#D17277',
      url: '#DFC285',
      regex: '#74ADEA',
      symbol: '#D17277',
      atrule: '#6FB4C0',
      rule: '#6FB4C0',
      prefix: '#6FB4C0',
      line: '#6FB4C0',
    }[tokenType] ?? '#BBBBBB';

  return result;
};

const syntaxHighlight = (token, tokenType) => {
  const syntaxColor = getSyntaxColor(tokenType);
  const highlightedToken = `<span style="color: ${syntaxColor};">${token}</span>`;

  return highlightedToken;
};

const getHighlightedCode = (code, lang_ext) => {
  const lang = extToPrismLang(lang_ext);

  let result = '';

  const tokens = tokenize(code, lang);

  // console.log('TOKENS', tokens);

  tokens.forEach((token) => {
    if (typeof token == 'object') {
      const tokenType = token.type;
      const tokenContentStr = tokenContentToString(token.content);

      result += syntaxHighlight(tokenContentStr, tokenType);
    } else {
      result += syntaxHighlight(token, null);
    }
  });

  // console.log('RESULT', result);

  return result;
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
    const spacedTab = ' '.repeat(TAB_SIZE);
    document.execCommand('insertText', false, spacedTab);
  }
};

const unTabText = (editorTextarea, code, tabbedOverLinesStartPos) => {
  let startShift = 0;
  let endShift = 0;

  const numTabbedLines = tabbedOverLinesStartPos.length;

  for (let i = numTabbedLines - 1; i >= 0; i--) {
    const cursorPos = tabbedOverLinesStartPos[i];

    const whiteSpaceSize = getWhiteSpaceSize(code, cursorPos);

    // if there is non-zero whitespace, shift-tab
    if (whiteSpaceSize > 0) {
      editorTextarea.focus();
      editorTextarea.setSelectionRange(cursorPos, cursorPos + whiteSpaceSize);
      document.execCommand('delete');

      if (i == 0) {
        startShift = whiteSpaceSize;
      }
    }

    endShift += whiteSpaceSize;
  }

  return [startShift, endShift];
};

const getWhiteSpaceSize = (code, cursorPos) => {
  let numSpaceChars = 0;

  for (let i = cursorPos; i < cursorPos + TAB_SIZE; i++) {
    if (code[i] === ' ') {
      numSpaceChars++;
    } else {
      break;
    }
  }

  return numSpaceChars > 4 ? 4 : numSpaceChars;
};

const getTabbedOverLinesStartPos = (code, start, end) => {
  const lines = code.split('\n');
  // console.log('SPLIT: ', lines);

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

export {
  getHighlightedCode,
  tabOverText,
  unTabText,
  getTabbedOverLinesStartPos,
};
