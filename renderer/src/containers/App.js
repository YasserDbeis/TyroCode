import React, { Component } from 'react';
import path from 'path';
import './App.css';

import Terminal from '../components/Terminal/Terminal';
import FileTree from '../components/FolderDropdown/FolderDropdown';
import NewFileModal from '../components/Modals/NewFileModal/NewFileModal';
const ResizableBox = require('react-resizable').ResizableBox;
import { debounce, update } from 'lodash';
import {
  Layout,
  Menu,
  Breadcrumb,
  Divider,
  Button,
  Dropdown,
  Modal,
} from 'antd';
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
import { waitForElm } from '../helpers/DomObservers';
import { dialog } from 'electron';
import { startWatchingWorkspace, endWatching } from '../helpers/FileWatching';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import { MacScrollbar } from 'mac-scrollbar';
import { scrollbarOptions } from '../styles/Scrollbar';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const HANDLE_HEIGHT = 10;
const DEBOUNCE_TIME = 100;
let lastHeight = 0;
let lastWidth = 0;
const DROPDOWN_SELECTION_COLOR = '#41729f';
const TRANSPARENT_COLOR = 'transparent';

const {
  initTerminal,
  resizeTerminal,
} = require('../components/Terminal/TerminalSetup');

class App extends Component {
  constructor(props) {
    super(props);

    this.term = React.createRef();
    this.codeInput = React.createRef();

    this.state = {
      terminalHeight: 300,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      folderContent: null,
      folderName: null,
      sidebarWidth: 300,
      prevFolderDropdownSelectionElement: null,
      folderDropdownSelectionElement: null,
      currentDirectory: null,
      languageSelection: { ...defaultLanguage },
      codeRunning: false,
      tabOpen: false,
      workSpacePath: null,
      fileTreeKey: null,
    };
  }

  resize = debounce((e) => {
    if (e.target.innerHeight != lastHeight) {
      this.setState({
        windowHeight: e.target.innerHeight,
        terminalHeight: this.term.current
          ? this.term.current.clientHeight + HANDLE_HEIGHT
          : this.state.terminalHeight,
      });
    }

    if (e.target.innerWidth != lastWidth) {
      this.setState({
        windowWidth: e.target.innerWidth,
      });
    }

    lastHeight = e.target.innerHeight;
    lastWidth = e.target.innerWidth;
  }, DEBOUNCE_TIME);

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);

    if (this.state.workSpacePath) {
      endWatching(this.state.workSpacePath);
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    initTerminal();
    resizeTerminal();
  }

  componentDidUpdate() {
    this.updateFolderDropdownHighlighting();
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

  setWorkspaceFolder = (folderPath) => {
    if (folderPath) {
      if (this.state.workSpacePath) {
        endWatching(this.state.workSpacePath);
      }

      const currSelectedElement = this.state.folderDropdownSelectionElement;
      if (currSelectedElement) {
        currSelectedElement.style.backgroundColor = TRANSPARENT_COLOR;
      }

      this.setState({
        workSpacePath: folderPath,
        prevFolderDropdownSelectionElement: null,
        folderDropdownSelectionElement: null,
        currentDirectory: null,
        fileTreeKey: folderPath + Date.now().toString(),
      });

      startWatchingWorkspace(folderPath, this);

      getBaseFolderContent(folderPath, this);
    }
  };

  openErrorModal = (title, content) => {
    Modal.error({
      title,
      content,
      closable: true,
      width: 450,
      bodyStyle: {
        textAlign: 'left',
      },
    });
  };

  newFileCreatedHandler = async (fileName) => {
    console.log('added', fileName);

    const currDirectory =
      this.state.currentDirectory ?? this.state.workSpacePath;

    if (!currDirectory) {
      return;
    }

    const filePath = getFullPath(currDirectory, fileName);

    console.log('CREATE NEW FILE PATH', filePath);
    console.log('BASE DIR', this.state.workSpacePath);

    const fileWriteSuccess = createNewFile(filePath);

    if (fileWriteSuccess) {
      this.tabs.add(fileName, filePath, '');

      setFolderContent(
        currDirectory,
        {
          isUpdate: true,
          updateType: 'addFile',
          path: filePath,
        },
        this
      );

      const element = await waitForElm(filePath);

      this.updateFolderDropdownHighlightSelection(
        document.getElementById(filePath)
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
      const errorTitle = `File '${fileNode.name}' can not be opened`;
      const errorDescription =
        'TyroCode can only display plain text files, not binaries.';

      this.openErrorModal(errorTitle, errorDescription);
      console.log('INVALID FILE CONTENT READ');
    }
  };

  folderDropdownNodeClickHandler = (element, directoryNode) => {
    if (directoryNode.type == 'file') {
      this.addExistingFileToTabs(directoryNode);
    } else {
      console.log('CLICKED, BASE DIR', this.state.workSpacePath);
      setFolderContent(
        directoryNode.path,
        {
          isUpdate: false,
          updateType: null,
          path: null,
        },
        this
      );
    }

    const currDirectory = getCurrentDirectory(directoryNode);
    this.setState({ currentDirectory: currDirectory });

    this.updateFolderDropdownHighlightSelection(element);
  };

  updateFolderDropdownHighlightSelection = (element) => {
    const currSelectedElement = this.state.folderDropdownSelectionElement;

    this.setState({
      prevFolderDropdownSelectionElement: currSelectedElement,
      folderDropdownSelectionElement: element,
    });
  };

  updateFolderDropdownHighlighting = () => {
    const prevSelectedElement = this.state.prevFolderDropdownSelectionElement;
    const currSelectedElement = this.state.folderDropdownSelectionElement;

    if (prevSelectedElement) {
      prevSelectedElement.style.backgroundColor = TRANSPARENT_COLOR;
    }

    if (currSelectedElement) {
      currSelectedElement.style.backgroundColor = DROPDOWN_SELECTION_COLOR;
    }
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
          maxWidth="50vw"
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
              />
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

          <MacScrollbar {...scrollbarOptions} style={{ height: '80%' }}>
            <div style={{ color: 'white' }}>
              <FileTree
                key={this.state.fileTreeKey}
                folderContent={this.state.folderContent}
                folderDropdownNodeClickHandler={
                  this.folderDropdownNodeClickHandler
                }
                onFolderSelection={this.setWorkspaceFolder}
              />
            </div>
          </MacScrollbar>
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

          {this.state.tabOpen ? null : (
            <GetStarted
              // className={this.state.tabOpen ? 'hidden' : null}
              windowHeight={this.state.windowHeight}
              windowWidth={this.state.windowWidth}
              sidebarWidth={this.state.sidebarWidth}
              terminalHeight={this.state.terminalHeight}
              onFolderSelection={this.setWorkspaceFolder}
            />
          )}

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
