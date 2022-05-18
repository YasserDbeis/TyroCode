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

const tabOverText = (code, start, end) => {
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
      tabbedOverLines.push(line);
      continue;
    }

    if (
      (start <= seenFrameStart && end >= seenFrameEnd) ||
      (start >= seenFrameStart && start <= seenFrameEnd) ||
      (end >= seenFrameStart && end <= seenFrameEnd)
    ) {
      line = '\t' + line;
    }

    tabbedOverLines.push(line);
  }

  console.log(tabbedOverLines);

  return tabbedOverLines.join('\n');
};

export { getHighlightedCode, insertBraceAtPos, tabOverText };
