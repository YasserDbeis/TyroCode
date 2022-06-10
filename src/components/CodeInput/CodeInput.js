import React, { forwardRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import './CodeInput.css';
import ContentEditable from 'react-contenteditable';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const CodeInput = forwardRef((props, ref) => {
  //console.log(props.folderContent)

  const [codeInput, setCodeInput] = useState('');

  const onCodeInputChange = (e) => {
    console.log(e.target.value);
    setCodeInput(e.target.value);
  };

  return (
    <div id="code-input-container">
      <Scrollbars id="code-input-scrollbars">
        <ContentEditable
          ref={ref}
          data-placeholder="Code Input"
          html={codeInput}
          onChange={onCodeInputChange}
          id="code-input"
        ></ContentEditable>
      </Scrollbars>
    </div>
  );
});

export default CodeInput;
