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
            sidebarWidth: 0
        }        
    }

    componentWillReceiveProps(newProps) {

        if (newProps.sidebarWidth !== this.state.sidebarWidth) {

            const newWidth = document.querySelector("#root").clientWidth - newProps.sidebarWidth

            this.setState({width: newWidth})
            this.setState({sidebarWidth: newProps.sidebarWidth})
            console.log(newProps)
            resizeTerminal()
            this.updateTerminalDimensions()

        }

    }
    newWidth
    // componentDidMount() {
    //     window.addEventListener('resize', this.updateTerminalDimensions)

    //     // require('electron').remote.getCurrentWindow().on('enter-full-screen', this.updateTerminalDimensions)

    // }


    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.updateTerminalDimensions)

    //     // ipcRenderer.removeAllListeners('exit')
    // }

    updateTerminalDimensions = () => {
        // const updatedHeight = document.querySelector("#root > section > section").clientHeight
        // console.log(updatedHeight)
        // const updatedWidth = document.querySelector("#root > section").clientWidth - document.querySelector("#root > section > div").clientWidth
        // console.log(updatedWidth)
        // this.setState({
        //     width: updatedWidth
        // })    

        //this.resizeTextEditor()
        //document.querySelector("#terminal > div.terminal.xterm > div.xterm-viewport").style.width = document.querySelector("#terminal").clientHeight
        resizeTerminal()
    }


    // term.open(document.getElementById('terminal'));

    // ipcRenderer.on("terminal.incomingData", (event, data) => {
    //     // console.log(Buffer.from(data, 'utf-8'))
    //     term.current.terminal.write(data)
    // });

    // // My Attempt to do resizing of text editor by just the active tab index
    // const tabs = document.getElementsByClassName('ant-tabs-tab')
    // var activeTab = 0
    // for(const tab of tabs) {
    //     if(tab.classList.contains('abt-tabs-tab-active')) {
    //         break
    //     }
    //     activeTab++
    // }
    
    // this.resizeTextEditor(activeTab)

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
    
    render() {
        return (
            <Footer>
            
                <Resizable id="terminal" style={{backgroundColor: '#282C34', borderStyle: 'solid'}}
                size={{ width: this.state.width, height: this.state.height }}
                maxHeight={550}
                minHeight={50}
                onResizeStop={(e, direction, ref, d) => {

                    if(direction !== 'top')
                        return

                    this.setState({
                        height: this.state.height + d.height,
                    });
                    console.log(this.state.height)

                    this.updateTerminalDimensions()
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
// onResize={this.onResize} 
// width={Infinity} 
// height={this.state.height} 
// className="box" 
// maxConstraints={[Infinity, this.state.height * 3 / 2]}
// minConstraints={[Infinity, this.state.height * 3 / 10]}
// axis="y" 
// resizeHandles={['n']}>                
// </ResizableBox>