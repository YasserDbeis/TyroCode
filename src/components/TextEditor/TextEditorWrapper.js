import React, { Component } from 'react';
import TextEditor from './TextEditor';
const TAB_HEIGHT = 40;

//var entirePageHeightMinusTabs;
//        entirePageHeightMinusTabs = document.querySelector("#root > section > section").clientHeight - 40

class TextEditorWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: 'hey',
    };
    this.codeChange = this.codeChange.bind(this);
  }

  codeChange = (newCode) => {
    this.setState({
      code: newCode,
    });

    console.log(newCode);

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
          this.props.terminalHeight
        ).toString() + 'px',
    };

    return (
      <div
        className="text-editor-wrappers"
        id="text-editor-wrapper"
        style={textEditorWrapperStyles}
      >
        <TextEditor
          windowHeight={this.props.windowHeight}
          terminalHeight={this.props.terminalHeight}
          codeChange={this.codeChange}
          code={this.props.code}
        />
      </div>
    );
  }
}

export default TextEditorWrapper;
