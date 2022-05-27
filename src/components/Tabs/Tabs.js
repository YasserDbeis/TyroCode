import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import { writeCodeResult } from '../Terminal/TerminalSetup';
import TextEditorWrapper from '../TextEditor/TextEditorWrapper';
import { getPWD } from '../../helpers/FileDirectory';
import './Tabs.css';
import { last, update } from 'lodash';

const { TabPane } = Tabs;
const ADD = 0;
const REMOVE = 1;

const initialPanes = [
  {
    title: 'Welcome!',
    path: getPWD(),
    content: 'HELLO\nWORLD',
    key: '1',
  },
];

class Tabbing extends Component {
  newTabIndex = 0;

  constructor(props) {
    super(props);
    this.state = {
      activeKey: initialPanes[0].key,
      panes: initialPanes,
      pathToKey: new Map(),
    };

    this.codeChange = this.codeChange.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this);
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

  add = (name, path, code) => {
    const pathToKey = this.state.pathToKey;
    const activeKey = `newTab${this.newTabIndex++}`;

    if (pathToKey.has(path)) {
      const activeKey = this.state.pathToKey.get(path);
      this.setState({ activeKey });
      return;
    } else {
      this.state.pathToKey.set(path, activeKey);
    }

    const { panes } = this.state;
    const newPanes = panes.length == 1 && panes[0].key == 1 ? [] : [...panes];
    newPanes.push({ title: name, path: path, content: code, key: activeKey });

    this.setState({
      panes: newPanes,
      activeKey,
    });
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
    this.updatePathsSeen(filePathToDelete, null, REMOVE);

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
  };

  componentDidUpdate() {
    this.resizeTextEditor(this.state.activeKey - 1);
  }

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

  runCurrentCode = (language) => {
    let paneIndex = this.getCurrentPaneIndex();

    let code = this.state.panes[paneIndex].content;

    var request = require('request');

    var program = {
      script: code,
      stdin: 'Yasser',
      language: language,
      versionIndex: '0',
      clientId: 'e7f1ebfe96c749a4f6d493bf24d809d2',
      clientSecret:
        'ffc186bff12de9db1b39e74621bae2b145889b3c68222bb269d28e0c06cb4582',
    };
    request(
      {
        url: 'https://api.jdoodle.com/v1/execute',
        method: 'POST',
        json: program,
      },
      function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);

        writeCodeResult(body.output);
      }
    );
  };

  codeChange = (code) => {
    // console.log(code);

    let currPaneIndex = this.getCurrentPaneIndex();
    let panesCopy = this.state.panes;
    panesCopy[currPaneIndex].content = code;
    this.setState({ panes: panesCopy });
  };

  render() {
    const { panes, activeKey } = this.state;
    return (
      <Tabs
        hideAdd
        type="editable-card"
        onChange={this.onChange}
        activeKey={activeKey}
        onEdit={this.onEdit}
      >
        {panes.map((pane) => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            <TextEditorWrapper
              filename={pane.title}
              windowHeight={this.props.windowHeight}
              terminalHeight={this.props.terminalHeight}
              codeChange={this.codeChange}
              code={pane.content}
              className="text-editor-wrappers"
            />
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default Tabbing;

//{pane.content}
