import React, { Component } from 'react';
import TextEditor from './TextEditor';
const TAB_HEIGHT = 40;
const HANDLE_HEIGHT = 10;

//var entirePageHeightMinusTabs;
//        entirePageHeightMinusTabs = document.querySelector("#root > section > section").clientHeight - 40

class TextEditorWrapper extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   code: '',
    // };
    this.codeChange = this.codeChange.bind(this);
  }

  codeChange = (newCode) => {
    this.props.codeChange(newCode);
  };

  render() {
    const textEditorWrapperStyles = {
      overflowY: 'hidden',
      position: 'relative',
      height:
        (
          this.props.windowHeight -
          TAB_HEIGHT -
          this.props.terminalHeight -
          HANDLE_HEIGHT
        ).toString() + 'px',
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
          codeChange={this.codeChange}
          code={this.props.code}
          onSave={this.props.onSave}
        />
      </div>
    );
  }
}

export default TextEditorWrapper;
