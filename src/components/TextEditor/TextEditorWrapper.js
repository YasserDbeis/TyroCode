import React, { Component } from 'react';
import TextEditor from './TextEditor';

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
          document.querySelector('body').clientHeight -
          40 -
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
          terminalHeight={this.props.terminalHeight}
          codeChange={this.codeChange}
          code={this.props.code}
        />
      </div>
    );
  }
}

export default TextEditorWrapper;
