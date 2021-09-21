import React, { Component, useEffect } from 'react';
import {XTerm} from 'xterm-for-react';
const ResizableBox = require('react-resizable').ResizableBox;
const { ipcRenderer } = require("electron");
const {resizeTerminal, writeEnter} = require('./TerminalSetup');
import {terminalHandle} from './Handle/TerminalHandle';
import {Resizable} from 're-resizable';
import { Layout} from 'antd';
const { Footer } = Layout;
import {Scrollbars} from 'react-custom-scrollbars';
import ResizePanel from "react-resize-panel";


import './Terminal.css';
import './TerminalContainer.css';

class Terminal extends Component {
    
    constructor(props) {
        super(props)
        const initHeight = document.querySelector("body").clientHeight
        console.log(initHeight)
        const initWidth = document.querySelector("#root > section").clientWidth - document.querySelector("#root > section > div").clientWidth
        console.log(initWidth)
        this.state = {
            height: initHeight / 3,
            width: initWidth,
            show: true,
            sidebarWidth: 0,
            browserWidth: 0,
            browserHeight: 0
        }        
    }

    componentWillReceiveProps(newProps) {

        if (newProps.sidebarWidth !== this.state.sidebarWidth) {

            const newWidth = document.querySelector("#root").clientWidth - newProps.sidebarWidth

            this.setState({width: newWidth})
            this.setState({sidebarWidth: newProps.sidebarWidth})
            console.log(newProps)
        
        }

        resizeTerminal()

    }

    resizeTextEditor = () => {
        const termHeight = document.getElementById('terminal').clientHeight

        const entirePageHeightMinusTabsAndTermHeight = document.querySelector("#root > section > section").clientHeight - 40 - termHeight

        const textEditors = document.getElementsByClassName('text-editor-wrappers')
        var i = 0;
        for(const textEditor of textEditors) {
            textEditor.setAttribute("style", "height: " + entirePageHeightMinusTabsAndTermHeight.toString() + "px; position: relative;")
        }
    }

    onResize = () => {
        resizeTerminal()
        
        this.resizeTextEditor()


        const termHeight = document.querySelector("#terminal").clientHeight
        
        if(termHeight < 50) {
            this.setState({
                show: false
            })
        }
        else {
            this.setState({
                show: true
            })
        }
    }


    updateDimensions = () => {
        this.setState({ browserWidth: window.innerWidth, browserHeight: window.innerHeight });
        
    };

    componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    
    }
    componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    }

    componentDidUpdate() {
        resizeTerminal()
    }
    
    render() {

        const terminalStyle = {
            backgroundColor: '#282C34',
            padding: '5px',
            borderTop: '5px solid #21252B',
        }

        const sidebarWidth = document.querySelector("#root > section > div").clientWidth

        return (



            <Footer 
                style={terminalStyle}
            >

            <Resizable id="terminal" style={{backgroundColor: '#282C34'}}
                size={{width: this.state.browserWidth - sidebarWidth, height: this.state.height }}

                onResizeStop={(e, direction, ref, d) => {

                    if(direction !== 'top')
                        return

                    this.setState({
                        height: this.state.height + d.height,
                    });
                }}
            >

            </Resizable>
            </Footer>
    
        );
    
        
    }
}


export default Terminal;





              
// <ResizableBox 
// id="terminal" 
// handle={terminalHandle()} 
// width={this.state.width} 
// height={this.state.height} 
// className="box" 
// maxConstraints={[Infinity, this.state.height * 3 / 2]}
// minConstraints={[Infinity, this.state.height * 3 / 10]}
// axis="y" 
// resizeHandles={['n']}>                
// </ResizableBox>