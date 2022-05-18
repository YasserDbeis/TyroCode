const getHighlightedCode = (code) => {
  let result = '';
  for (let c of code) {
    if (c === '{' || c === '}') {
      result += '<span style="color:teal; -webkit-text-stroke: 1px teal;">';
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
