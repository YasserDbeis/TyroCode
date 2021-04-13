import React, {Component} from 'react';
// const Prism = require('prismjs');
import Editor from 'react-simple-code-editor';
import {highlight, languages, plugins} from 'prismjs/components/prism-core';
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
const fs = require('fs')

import "prismjs/themes/prism-coy.css"; //Example style, you can use another
import './TextEditor.css'

import {Scrollbars} from 'react-custom-scrollbars';


// good themes: coy - fun american colors, okaida - gothy but fun, tomorrow - not my style but its meh, 



class TextEditor extends Component {

    state = {
        code: this.props.code,
        cursorPosition: 0,
    }

    parentheticalDelimiters = {
        '(' : ')',
        '{' : '}',
        '[' : ']'
    }

    insertCharIntoText = (str, pos, character) => {

        return str.slice(0, pos) + character + str.slice(pos, str.length)
    }


    matchParentheticalDelimiters = (oldCodeLength, newCodeLength, resultCode) => {

        let codeEditorTextArea = document.getElementsByClassName('npm__react-simple-code-editor__textarea')[0]

        // console.log(resultCode)
        
        let lastChar = resultCode.charAt(this.state.cursorPosition)
        // console.log(lastChar)
        if(oldCodeLength < newCodeLength && (this.parentheticalDelimiters[lastChar] != undefined)) {
            
            

            resultCode = this.insertCharIntoText(resultCode, this.state.cursorPosition + 1, this.parentheticalDelimiters[lastChar])
            // console.log("RESULT:", resultCode)
            // let currentPos = this.state.cursorPosition

            // this.setState({cursorPosition: currentPos - 1})   
        }

        return resultCode
    }


    onCode = (newCode) => {
        
        newCode = this.matchParentheticalDelimiters(this.state.code.trim().length, newCode.trim().length, newCode)

        this.setState({
            code: newCode
        })
        // this.updateCursorPos()

        const splitOnLineCode = newCode.split('\n')
        console.log(splitOnLineCode)

        const lineNums = document.getElementsByClassName('editorLineNumber')
        console.log(lineNums)
        var letterCount = 0;
        var i = 0;
        for(const line of splitOnLineCode) {
            letterCount += line.length;
            if(letterCount >= this.state.cursorPosition) {
                console.log("HIGHLIGHT TIME: ", i)
                lineNums[i].setAttribute('style', 'color: white')
            }

            console.log(letterCount)

            i++;
        }

    }

    updateCursorPos = () => {

        let codeEditorTextArea = document.getElementsByClassName('npm__react-simple-code-editor__textarea')[0]
        
        let cursorPos = codeEditorTextArea.selectionStart

        
        // let cursorOffset = 0;
        
        // cursorPos += cursorOffset
        
        this.setState({cursorPosition: cursorPos})
        
        console.log("CURSOR POSITION:", cursorPos)
        codeEditorTextArea.setSelectionRange(cursorPos, cursorPos)
        codeEditorTextArea.focus()

        console.log(this.state.cursorPosition)


    }



    // function courtesy of https://github.com/bogutski
    hightlightWithLineNumbers = (input, language) =>
        highlight(input, language)
        .split("\n")
        .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
        .join("\n");


    render() {

        return(
            <Scrollbars>
                <Editor
                id="text-editor"
                value={this.state.code}
                onValueChange={(code) => this.onCode(code)}
                highlight={(code) => this.hightlightWithLineNumbers(code, languages.java)}
                autoSave="true"
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    resize: 'none',
                    overflow: 'hidden',
                    minHeight: '100%'
                }}
                autoCapitalize="true"
                onKeyDownCapture={this.updateCursorPos}
                textareaId="codeArea"
                className="editor"
                />
            </Scrollbars>
            
        );
    }
}

export default TextEditor;