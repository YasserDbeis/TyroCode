import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import { writeCodeResult } from '../Terminal/TerminalSetup';
import TextEditorWrapper from '../TextEditor/TextEditorWrapper';
import { getFileText, getPWD } from '../../helpers/FileDirectory';
import { saveFileContent } from '../../helpers/FileWriting';
import './Tabs.css';
import { last, update } from 'lodash';
import { EditOutlined } from '@ant-design/icons';
import { getProgLanguage } from '../../helpers/FilenameExtensions';
import * as langs from '../../enums/ProgLanguages';
import { langToIcon } from '../../helpers/FilenameExtensions';
import { runCode } from '../../helpers/CodeExecution';
import { startWatchingFile, endWatching } from '../../helpers/FileWatching';
import { FILE_READ_SUCCESS } from '../../enums/FileReadingErrors';
const { TabPane } = Tabs;
const ADD = 0;
const REMOVE = 1;

// const initialPanes = [
//   {
//     title: 'Welcome',
//     path: getPWD(),
//     content: 'HELLO\nWORLD',
//     saved: false,
//     key: '1',
//     lang: langs.none,
//   },
// ];

class Tabbing extends Component {
  newTabIndex = 0;

  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      panes: [],
      pathToKey: new Map(),
    };
    this.onCodeChange = this.onCodeChange.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentDidUpdate() {
    this.resizeTextEditor(this.state.activeKey);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  onExternalFileChange = (changedFilePath) => {
    const newPanes = this.state.panes.map((pane, i) => {
      if (pane.path == changedFilePath) {
        const [newCode, status] = getFileText(pane.path, pane.title);
        if (status == FILE_READ_SUCCESS) {
          return { ...pane, content: newCode };
        } else {
          return pane;
        }
      }

      return pane;
    });

    this.setState({ panes: newPanes });
    // this.state.filesToUpdate.add(changedFilePath);
  };

  onSave = (filepath) => {
    const { pathToKey } = this.state;

    if (pathToKey.has(filepath)) {
      const savedFileKey = pathToKey.get(filepath);

      const { panes } = this.state;

      const newPanes = panes.map((pane, i) => {
        if (pane.key == savedFileKey && !pane.saved) {
          saveFileContent(pane.content, pane.path);

          return { ...pane, saved: true };
        }

        return pane;
      });

      this.setState({ panes: newPanes });
    }
  };

  add = (name, path, code) => {
    const pathToKey = this.state.pathToKey;
    const activeKey = `code-tab-${this.newTabIndex++}`;

    if (pathToKey.has(path)) {
      const activeKey = this.state.pathToKey.get(path);
      this.setState({ activeKey });
      return;
    } else {
      this.state.pathToKey.set(path, activeKey);
    }

    const { panes } = this.state;
    const newPanes = [...panes];
    newPanes.push({
      title: name,
      path: path,
      content: code,
      saved: true,
      key: activeKey,
      lang: getProgLanguage(name),
    });

    this.setState({
      panes: newPanes,
      activeKey,
    });

    startWatchingFile(path, this);
  };

  remove = (targetKey) => {
    const { panes, activeKey } = this.state;
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });

    const filePathToDelete = panes[lastIndex + 1].path;
    this.state.pathToKey.delete(filePathToDelete);

    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }

    this.setState({
      panes: newPanes,
      activeKey: newActiveKey,
    });

    if (newPanes.length == 0) {
      this.props.onTabsEmpty();
    }

    endWatching(filePathToDelete);
  };

  resizeTextEditor = (activeTab) => {
    const term = document.getElementById('terminal');

    if (!term) return;

    const termHeight = term.clientHeight;

    const entirePageHeightMinusTabsAndTermHeight =
      document.querySelector('body').clientHeight - 40 - termHeight;

    const textEditor = document.getElementsByClassName('text-editor-wrappers')[
      activeTab
    ];

    if (!textEditor) return;

    textEditor.setAttribute(
      'style',
      'height: ' +
        entirePageHeightMinusTabsAndTermHeight.toString() +
        'px; position: relative;'
    );
  };

  getCurrentPaneIndex = () => {
    let i = 0;

    for (const pane of this.state.panes) {
      if (pane.key == this.state.activeKey) {
        break;
      }
      i++;
    }

    return i;
  };

  runCurrentCode = async (language, input, codeExitedHandler) => {
    let paneIndex = this.getCurrentPaneIndex();

    let code = this.state.panes[paneIndex]?.content;

    if (!code || code.trim().length == 0) {
      codeExitedHandler();
      return;
    }

    try {
      const result = await runCode(language, code, input);
      console.log(result);
      const success = result.success;

      let output;
      if (success) {
        output = result.output;
      } else {
        output = result.error;
      }

      writeCodeResult(output);
      codeExitedHandler();
    } catch (e) {
      console.log(e);
    }
  };

  onCodeChange = (code) => {
    // console.log(code);

    let currPaneIndex = this.getCurrentPaneIndex();
    let panesCopy = [...this.state.panes];
    panesCopy[currPaneIndex].content = code;
    panesCopy[currPaneIndex].saved = false;
    this.setState({ panes: panesCopy });
  };

  render() {
    return (
      <Tabs
        hideAdd
        type="editable-card"
        onChange={this.onChange}
        activeKey={this.state.activeKey}
        onEdit={this.onEdit}
      >
        {this.state.panes.map((pane) => (
          <TabPane
            tab={
              <span>
                {pane.saved ? null : <EditOutlined className="unsaved" />}
                <span className={pane.saved ? null : 'unsaved'}>
                  {pane.title}
                </span>
                {langToIcon(pane.lang, {
                  marginLeft: '10px',
                  height: '20px',
                  width: '20px',
                })}
              </span>
            }
            key={pane.key}
            closable={pane.closable}
          >
            <TextEditorWrapper
              filename={pane.title}
              filepath={pane.path}
              windowHeight={this.props.windowHeight}
              terminalHeight={this.props.terminalHeight}
              onCodeChange={this.onCodeChange}
              code={pane.content}
              className="text-editor-wrappers"
              onSave={this.onSave}
            />
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default Tabbing;

//{pane.content}
