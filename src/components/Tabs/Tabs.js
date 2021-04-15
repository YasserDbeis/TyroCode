import React, {Component} from 'react';
import { Tabs, Button } from 'antd';
import TextEditorWrapper from '../TextEditor/TextEditorWrapper';
import "./Tabs.css";

const { TabPane } = Tabs;

const initialPanes = [
  {title: 'Welcome!', content: 'Click an existing file or add a new one to get started!', key: '1'}
];

class Tabbing extends Component {
    newTabIndex = 0;

    state = {
        activeKey: initialPanes[0].key,
        panes: initialPanes,
    };

    componentDidMount() {
      this.props.onRef(this)
    }

    componentWillUnmount() {
      this.props.onRef(null)
    }

    onChange = activeKey => {
        this.setState({ activeKey });
    };

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };

    add = (name, code) => {
        const { panes } = this.state;
        const activeKey = `newTab${this.newTabIndex++}`;
        const newPanes = panes.length == 1 && panes[0].key == 1 ? [] : [...panes];
        newPanes.push({ title: name, content: code, key: activeKey });

        this.setState({
          panes: newPanes,
          activeKey,
        });
    };

    remove = targetKey => {
        const { panes, activeKey } = this.state;
        let newActiveKey = activeKey;
        let lastIndex;
        panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
              lastIndex = i - 1;
          }
        });
        const newPanes = panes.filter(pane => pane.key !== targetKey);
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
        this.resizeTextEditor(this.state.activeKey - 1)
    }

    resizeTextEditor = (activeTab) => {
        const term = document.getElementById('terminal')

        if(!term)
            return
        
        const termHeight = term.clientHeight

        const entirePageHeightMinusTabsAndTermHeight = document.querySelector("body").clientHeight - 40 - termHeight

        const textEditor = document.getElementsByClassName('text-editor-wrappers')[activeTab]

        if(!textEditor)
            return

        textEditor.setAttribute("style", "height: " + entirePageHeightMinusTabsAndTermHeight.toString() + "px; position: relative;")
    }

    runCurrentCode = () => {
      let currentFile = this.state.panes.filter(file => {
        return file.key == this.state.activeKey
      })

      console.log(currentFile)
    }

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
        {panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable} >
            <TextEditorWrapper code={pane.content} className="text-editor-wrappers" />
          </TabPane>
        ))}

      </Tabs>

    );
  }
}

export default Tabbing;

//{pane.content}
 