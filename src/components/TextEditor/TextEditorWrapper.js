import React, {Component} from 'react';
import TextEditor from './TextEditor';

//var entirePageHeightMinusTabs;
//        entirePageHeightMinusTabs = document.querySelector("#root > section > section").clientHeight - 40

class TextEditorWrapper extends Component {
    

    render() {
        

        const textEditorWrapperStyles = {
            overflowY: 'hidden', 
            position: 'relative', 
            height: (document.querySelector("body").clientHeight - 40).toString() + 'px'
        }

        return (
            <div className="text-editor-wrappers" id="text-editor-wrapper" style={textEditorWrapperStyles}>
                <TextEditor code={this.props.code}/>
            </div>
        );
    }

}

export default TextEditorWrapper;