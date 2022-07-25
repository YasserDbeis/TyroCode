import React, { Component } from 'react';
import TextEditor from './TextEditor';
const TAB_HEIGHT = 48;
const HANDLE_HEIGHT = 0;

//var entirePageHeightMinusTabs;
//        entirePageHeightMinusTabs = document.querySelector("#root > section > section").clientHeight - 40

class TextEditorWrapper extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   code: '',
    // };
    this.onCodeChange = this.onCodeChange.bind(this);
  }

  onCodeChange = (newCode) => {
    this.props.onCodeChange(newCode);
  };

  render() {
    const textEditorHeight =
      this.props.windowHeight -
      TAB_HEIGHT -
      this.props.terminalHeight -
      HANDLE_HEIGHT;

    const textEditorWrapperStyles = {
      overflowY: 'hidden',
      position: 'relative',
      height: textEditorHeight.toString() + 'px',
    };

    return (
      <div
        className="text-editor-wrappers"
        id="text-editor-wrapper"
        style={textEditorWrapperStyles}
      >
        <TextEditor
          filename={this.props.filename}
          filepath={this.props.filepath}
          windowHeight={this.props.windowHeight}
          terminalHeight={this.props.terminalHeight}
          editorHeight={textEditorHeight}
          onCodeChange={this.onCodeChange}
          code={this.props.code}
          onSave={this.props.onSave}
        />
      </div>
    );
  }
}

export default TextEditorWrapper;
