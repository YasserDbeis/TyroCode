import React, { Component } from 'react';
import path from 'path';
import './App.css';
import Terminal from '../components/Terminal/Terminal';
import FileTree from '../components/FolderDropdown/FolderDropdown';
import NewFileModal from '../components/NewFileModal/NewFileModal';
const ResizableBox = require('react-resizable').ResizableBox;
import { debounce } from 'lodash';
import { Layout, Menu, Breadcrumb, Divider, Button, Dropdown } from 'antd';
import Tabs from '../components/Tabs/Tabs';
import GetStarted from '../components/GetStarted/GetStarted';
import CodeInput from '../components/CodeInput/CodeInput';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  getFileText,
  getCurrentDirectory,
  getBaseFolderContent,
  getFullPath,
  getPWD,
  setFolderContent,
} from '../helpers/FileDirectory';
import { createNewFile } from '../helpers/FileWriting';
import { Resizable } from 're-resizable';
import { FaRegPlayCircle } from 'react-icons/fa';
import { LoadingOutlined } from '@ant-design/icons';
import { languageOptions, defaultLanguage } from '../content/LanguageMenu';
import newFile from '../content/NewFile';
import {
  languageDropdownStyle,
  languageOptionStyle,
} from '../styles/LanguageDropdown';
import { runButtonStyle, runButtonLoadingStyle } from '../styles/RunButton';
import { last } from 'lodash';
import { testAPI } from '../helpers/CodeExecution';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const HANDLE_HEIGHT = 10;
const DEBOUNCE_TIME = 300;
let lastHeight = 0;

const {
  initTerminal,
  resizeTerminal,
} = require('../components/Terminal/TerminalSetup');

class App extends Component {
  constructor(props) {
    super(props);

    this.term = React.createRef();
    this.codeInput = React.createRef();
    // console.log('[App.js] constructor');

    this.state = {
      showTerminal: true,
      collapsed: false,
      terminalInitialized: false,
      terminalHeight: 300,
      windowHeight: window.innerHeight,
      folderContent: null,
      folderName: null,
      sidebarWidth: 300,
      folderDropdownSelectionElement: null,
      currentDirectory: null,
      languageSelection: { ...defaultLanguage },
      codeRunning: false,
      tabOpen: false,
      workSpacePath: null,
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  resize = debounce((e) => {
    if (e.target.innerHeight != lastHeight) {
      this.setState({
        windowHeight: e.target.innerHeight,
        terminalHeight: this.term.current
          ? this.term.current.clientHeight + HANDLE_HEIGHT
          : this.state.terminalHeight,
      });
    }
    lastHeight = e.target.innerHeight;
  }, DEBOUNCE_TIME);

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentDidMount() {
    // console.log('[App.js] componentDidMount');
    window.addEventListener('resize', this.resize);

    this.setState({
      showTerminal: true,
    });

    // testAPI();
  }

  componentDidUpdate() {
    if (this.state.showTerminal && !this.state.terminalInitialized) {
      initTerminal();
      this.setState({ terminalInitialized: true });
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
      this.setState({ terminalHeight: 300 });
    }

    this.setState({ showTerminal: !showingTerminal });
  };

  setWorkspaceFolder = (folderPath) => {
    if (folderPath) {
      this.setState({ workSpacePath: folderPath });

      getBaseFolderContent(folderPath, this);
    }
  };

  newFileCreatedHandler = (fileName) => {
    console.log('added', fileName);

    const currDirectory =
      this.state.currentDirectory ?? this.state.workSpacePath;

    if (!currDirectory) {
      return;
    }

    const filePath = getFullPath(currDirectory, fileName);

    console.log('CREATE NEW FILE PATH', filePath);

    const fileWriteSuccess = createNewFile(filePath);

    if (fileWriteSuccess) {
      this.tabs.add(fileName, filePath, '');

      setFolderContent(
        currDirectory,
        {
          isUpdate: true,
          updateType: 'add',
          filePath,
        },
        this
      );
    }
  };

  onTabsEmpty = () => {
    this.setState({ tabOpen: false });
  };

  addExistingFileToTabs = (fileNode) => {
    const tabOpen = this.state.tabOpen;

    if (!tabOpen) {
      this.setState({ tabOpen: true });
    }

    const [code, success] = getFileText(fileNode.path, fileNode.name);
    if (success) {
      this.tabs?.add(fileNode.name, fileNode.path, code);
    } else {
      console.log('INVALID FILE CONTENT READ');
    }
  };

  folderDropdownNodeClickHandler = (element, directoryNode) => {
    if (directoryNode.type == 'file') {
      this.addExistingFileToTabs(directoryNode);
    } else {
      console.log('CLICKED');
      setFolderContent(
        directoryNode.path,
        {
          isUpdate: false,
          updateType: null,
          filePath: null,
        },
        this
      );
    }

    const currDirectory = getCurrentDirectory(directoryNode);
    this.setState({ currentDirectory: currDirectory });

    const prevSelectedElement = this.state.folderDropdownSelectionElement;
    if (prevSelectedElement != null) {
      prevSelectedElement.style.backgroundColor = 'transparent';
    }

    this.setState({ folderDropdownSelectionElement: element });

    element.style.backgroundColor = '#41729f';
  };

  runButtonHandler = () => {
    this.setState({ codeRunning: true });
    const input = this.codeInput.current.el.current.innerText;
    this.tabs.runCurrentCode(
      this.state.languageSelection.compilerName,
      input,
      this.codeExitedHandler
    );
  };

  codeExitedHandler = () => {
    this.setState({ codeRunning: false });
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
      <Menu
        className="layout-font language-dropdown"
        items={languageOptions.map((lang, index) => {
          return {
            key: index,
            style: languageOptionStyle,
            onClick: () => this.languageOptionClickHandler(lang),
            label: lang.name,
            icon: lang.icon,
          };
        })}
      ></Menu>
    );

    // console.log(languageMenu, defaultLanguage);

    return (
      <Layout className="layout-font" style={{ height: '100vh' }}>
        <Sider width={0} />
        <Resizable
          className="ant-layout-sider-children"
          enable={{ left: false, right: true }}
          size={{ width: this.state.sidebarWidth }}
          maxWidth="500px"
          minWidth="300px"
          height="100vh"
          onResizeStop={(e, direction, ref, d) => {
            this.setState({
              sidebarWidth: this.state.sidebarWidth + d.width,
            });

            resizeTerminal();
          }}
          onResize={(e, direction, ref, d) => {
            resizeTerminal();
          }}
        >
          {this.state.workSpacePath ? (
            <div
              style={{
                height: '25px',
                marginLeft: '20px',
                marginRight: '20px',
                marginBottom: '10px',
                marginTop: '10px',
                alignItems: 'center',
                justifyContent: 'space-between',
                display: 'flex',
              }}
            >
              <NewFileModal
                onFilenameInputSuccess={this.newFileCreatedHandler}
              ></NewFileModal>
              <Dropdown overlay={languageMenu} placement="bottom">
                <Button style={languageDropdownStyle}>
                  {this.state.languageSelection.icon}
                  <span style={{ width: '10px' }} />
                  <span style={{ lineHeight: '25px' }}>
                    Run {this.state.languageSelection.name}
                  </span>
                </Button>
              </Dropdown>
              {this.state.codeRunning ? (
                <LoadingOutlined style={runButtonLoadingStyle} />
              ) : (
                <FaRegPlayCircle
                  size={25}
                  style={runButtonStyle}
                  onClick={() => this.runButtonHandler()}
                />
              )}
            </div>
          ) : null}

          <Scrollbars style={{ height: '80%' }}>
            <div style={{ color: 'white' }}>
              <FileTree
                key={this.state.folderName}
                folderContent={this.state.folderContent}
                folderDropdownNodeClickHandler={
                  this.folderDropdownNodeClickHandler
                }
                onFolderSelection={this.setWorkspaceFolder}
              />
            </div>
            {/* <Button onClick={this.toggleTerminal}>Open Terminal</Button> */}
          </Scrollbars>
          <CodeInput ref={this.codeInput} />
        </Resizable>
        <Layout className="site-layout">
          <Tabs
            className={this.state.tabOpen ? 'hidden' : null}
            windowHeight={this.state.windowHeight}
            terminalHeight={this.state.terminalHeight}
            onRef={(tabRef) => (this.tabs = tabRef)}
            onTabsEmpty={this.onTabsEmpty}
          />

          <GetStarted
            className={this.state.tabOpen ? 'hidden' : null}
            windowHeight={this.state.windowHeight}
            terminalHeight={this.state.terminalHeight}
            onFolderSelection={this.setWorkspaceFolder}
          />

          <Terminal
            onTermExpand={this.onTermExpand}
            sidebarWidth={this.state.sidebarWidth}
            ref={this.term}
          />
        </Layout>
      </Layout>
    );
  }
}

export default App;
