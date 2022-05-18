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

export { getHighlightedCode, insertBraceAtPos };
