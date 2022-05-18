import React, { Component } from 'react';
import path from 'path';
import './App.css';
import Terminal from '../components/Terminal/Terminal';
import FileTree from '../components/FolderDropdown/FolderDropdown';
const ResizableBox = require('react-resizable').ResizableBox;

import { Layout, Menu, Breadcrumb, Divider, Button, Dropdown } from 'antd';
import Tabs from '../components/Tabs/Tabs';

import { Scrollbars } from 'react-custom-scrollbars';
import { getFolderContents, getFileText } from '../helpers/FileDirectory';
import { Resizable } from 're-resizable';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { FaRegPlayCircle } from 'react-icons/fa';
import { languageOptions, defaultLanguage } from '../content/LanguageMenu';
import newFile from '../content/NewFile';
import {
  languageDropdownStyle,
  languageOptionStyle,
} from '../styles/LanguageDropdown';
import newFileIconStyle from '../styles/NewFileIcon';
import runButtonStyle from '../styles/RunButton';
import { last } from 'lodash';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

let lastHeight = 0;

const {
  initTerminal,
  resizeTerminal,
} = require('../components/Terminal/TerminalSetup');

class App extends Component {
  constructor(props) {
    super(props);
    console.log('[App.js] constructor');

    this.state = {
      showTerminal: false,
      collapsed: false,
      terminalInitialized: false,
      terminalHeight: 300,
      windowHeight: window.innerHeight,
      folderContent: null,
      folderName: null,
      sidebarWidth: 300,
      languageSelection: { ...defaultLanguage },
    };
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);

    this.setState({ collapsed });
  };

  resize = (e) => {
    if (e.target.innerHeight != lastHeight) {
      this.setState({
        windowHeight: e.target.innerHeight,
      });
    }
    lastHeight = e.target.innerHeight;
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentDidMount() {
    console.log('[App.js] componentDidMount');
    window.addEventListener('resize', this.resize);

    const fetchFolderContent = async () => {
      const folderName = path.join(process.cwd(), 'src').split('\\').pop();
      const folderContent = getFolderContents(path.join(process.cwd(), 'src'));

      this.setState({ folderContent: folderContent, folderName: folderName });
    };

    fetchFolderContent();

    this.setState({ showTerminal: true });
  }

  componentDidUpdate() {
    if (this.state.showTerminal && !this.state.terminalInitialized) {
      initTerminal();
      this.setState({ terminalInitialized: true });

      console.log('init terminal');

      resizeTerminal();
    }
  }

  resizeTextEditor = (termHeight) => {
    const entirePageHeightMinusTabsAndTermHeight =
      document.querySelector('body').clientHeight - 40 - termHeight;

    const textEditors = document.getElementsByClassName('text-editor-wrappers');

    for (const textEditor of textEditors) {
      textEditor.setAttribute(
        'style',
        'height: ' +
          entirePageHeightMinusTabsAndTermHeight.toString() +
          'px; position: relative;'
      );
    }
  };

  toggleTerminal = () => {
    const showingTerminal = this.state.showTerminal;

    if (showingTerminal) {
      // term is on, so hide it
      this.setState({ terminalInitialized: false });
      this.setState({ terminalHeight: 0 });
    } else {
      // const termHeight =
      //   document.querySelector('#root > section > section').clientHeight / 3;
      // this.resizeTextEditor(termHeight);

      this.setState({ terminalHeight: 300 });
    }

    this.setState({ showTerminal: !showingTerminal });
  };

  fileClickHandler = (node) => {
    if (node.type == 'file') {
      let code = node.path == '.' ? '' : getFileText(node.path);
      // console.log(code);
      this.child.add(node.name, code);
    }
  };

  runButtonHandler = () => {
    this.child.runCurrentCode(this.state.languageSelection.compilerName);
  };

  languageOptionClickHandler = (lang) => {
    this.setState({ languageSelection: lang });
  };

  onTermExpand = (newTermHeight) => {
    this.setState({ terminalHeight: newTermHeight });
  };

  render() {
    const { collapsed } = this.state;

    let languageMenu = (
      <Menu className="layout-font language-dropdown">
        {languageOptions.map((lang, index) => {
          return (
            <Menu.Item
              key={index}
              style={languageOptionStyle}
              onClick={() => this.languageOptionClickHandler(lang)}
            >
              {lang.name} {lang.icon}
            </Menu.Item>
          );
        })}
      </Menu>
    );

    console.log(languageMenu, defaultLanguage);

    return (
      <Layout className="layout-font" style={{ minHeight: '100vh' }}>
        <Sider width={0} />
        <Resizable
          className="ant-layout-sider-children"
          size={{ width: this.state.sidebarWidth }}
          maxWidth="500px"
          minWidth="200px"
          onResizeStop={(e, direction, ref, d) => {
            this.setState({
              sidebarWidth: this.state.sidebarWidth + d.width,
            });

            resizeTerminal();
            //this.child.adjustTerminalWidth(this.state.sidebarWidth + d.width)

            // console.log(this.state.sidebarWidth);
          }}
          onResize={(e, direction, ref, d) => {
            resizeTerminal();
            //
          }}
        >
          <Scrollbars>
            <div style={{ height: '2.5%' }}>
              <FaRegPlayCircle
                size={25}
                style={runButtonStyle}
                onClick={() => this.runButtonHandler()}
              />
              <Dropdown overlay={languageMenu} placement="bottomCenter">
                <Button style={languageDropdownStyle}>
                  Run {this.state.languageSelection.name}
                </Button>
              </Dropdown>
              <AiOutlineFileAdd
                style={newFileIconStyle}
                size={25}
                onClick={() => this.fileClickHandler(newFile)}
              ></AiOutlineFileAdd>
            </div>

            <div style={{ color: 'white' }}>
              <FileTree
                key={this.state.folderName}
                folderContent={this.state.folderContent}
                fileClickHandler={this.fileClickHandler}
              />
            </div>
            <Button onClick={this.toggleTerminal}>Open Terminal</Button>
          </Scrollbars>
        </Resizable>

        <Layout className="site-layout">
          <Tabs
            windowHeight={this.state.windowHeight}
            terminalHeight={this.state.terminalHeight}
            onRef={(ref) => (this.child = ref)}
          />
          {this.state.showTerminal ? (
            <Terminal
              onTermExpand={this.onTermExpand}
              sidebarWidth={this.state.sidebarWidth}
            />
          ) : null}
        </Layout>
      </Layout>
    );
  }
}

export default App;
