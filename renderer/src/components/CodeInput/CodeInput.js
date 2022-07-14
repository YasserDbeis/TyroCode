import React, { forwardRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import './CodeInput.css';
import ContentEditable from 'react-contenteditable';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import { MacScrollbar } from 'mac-scrollbar';
import { scrollbarOptions } from '../../styles/Scrollbar';

const CodeInput = forwardRef((props, ref) => {
  //console.log(props.folderContent)

  const [codeInput, setCodeInput] = useState('');

  const onCodeInputChange = (e) => {
    // console.log(e.target.value);
    setCodeInput(e.target.value);
  };

  return (
    <MacScrollbar {...scrollbarOptions} id="code-input-container">
      <ContentEditable
        ref={ref}
        data-placeholder="Code Input"
        html={codeInput}
        onChange={onCodeInputChange}
        id="code-input"
      ></ContentEditable>
    </MacScrollbar>
  );
});

export default CodeInput;
