import React, { Component } from 'react';
import path from 'path';
import './App.css';
import Persons from '../components/Persons/Persons';
import Cockpit from '../components/Cockpit/Cockpit'
import withClass from '../hoc/withClass';
import Aux from '../hoc/Auxillary';
import AuthContext from '../context/auth-context';
import Terminal from '../components/Terminal/Terminal';
import FolderContent from '../components/FolderDropdown/FolderDropdown';
import { Layout, Menu, Breadcrumb, Divider } from 'antd';
import Tabs from '../components/Tabs/Tabs';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import {Scrollbars} from 'react-custom-scrollbars';
import {getFolderContents} from '../helpers/FileDirectory';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const {initTerminal, resizeTerminal} = require('../components/Terminal/TerminalSetup');

class App extends Component {

  


  constructor(props) {
    super(props)
    console.log('[App.js] constructor')

    this.state = {
      persons: [
        { id: 'asfa1', name: 'Max', age: 28 },
        { id: 'vasdf1', name: 'Manu', age: 29 },
        { id: 'asdf11', name: 'Stephanie', age: 26 }
      ],
      otherState: 'some other value',
      showPersons: false,
      showCockpit: true,
      changeCounter: 0,
      authenticated: false,
      showTerminal: false,
      collapsed: false,
      terminalInitialized: false,
      terminalWidth: 0,
      folderContent: null,
      folderName: null
    };


  }
  
  onCollapse = collapsed => {
    console.log(collapsed);

    this.setState({ collapsed });


    // // Janky solution to fix sidebar term issue, shows white space termporarily
    // const bodyWidth = document.querySelector("#root > section").clientWidth

    // const term = document.querySelector("#terminal")

    // var termWidthNum = collapsed ? bodyWidth - 80 : bodyWidth - 200

    // const termWidth = termWidthNum.toString() + 'px'


    // term.setAttribute('style', 'width: ' + (termWidth))

    // resizeTerminal()

  };

  static getDerivedStateFromProps(props, state) {
    console.log('[App.js] getDerivedStateFromProps', props);
    return state;
  }

  componentDidMount() {
    console.log('[App.js] componentDidMount')    

    const fetchFolderContent = async () => {
      const folderContent = getFolderContents(path.join(process.cwd(), 'src'))
      const folderName = (path.join(process.cwd(), 'src')).split("\\").pop()
      this.setState({folderContent: folderContent, folderName: folderName})
    };

    fetchFolderContent()

  }



  componentDidUpdate(){
    if(this.state.showTerminal && !this.state.terminalInitialized) {
      initTerminal()
      this.setState({terminalInitialized: true})

      console.log('init terminal')
    }
    // console.log(document.querySelector('#terminal > div.terminal.xterm > div.xterm-screen > canvas.xterm-cursor-layer').clientHeight)
    console.log(this.state.folderContent)
  }

  shouldComponentUpdate() {
    console.log('[App.js] shouldComponentUpdate')
    return true
  }

  nameChangedHandler = (event, id) => {
    const personIndex = this.state.persons.findIndex(p => {
      return p.id === id;
    });

    const person = {
      ...this.state.persons[personIndex]
    };

    // const person = Object.assign({}, this.state.persons[personIndex]);
  
    person.name = event.target.value;

    const persons = [...this.state.persons];
    persons[personIndex] = person;

    this.setState((prevState, props) => { // use a function when depending on previous state, otherwise, setting state normally works fine
      return { 
        persons: persons, 
        changeCounter: prevState.changeCounter + 1  
      }
    });
  };

  deletePersonHandler = personIndex => {
    // const persons = this.state.persons.slice();
    const persons = [...this.state.persons];
    persons.splice(personIndex, 1);
    this.setState({ persons: persons });
  };

  togglePersonsHandler = () => {
    const doesShow = this.state.showPersons;
    this.setState({ showPersons: !doesShow });
  };

  loginHandler = () => {
    this.setState({authenticated: true})
  }

  resizeTextEditor = (termHeight) => {

    const entirePageHeightMinusTabsAndTermHeight = document.querySelector("body").clientHeight - 40 - termHeight

    const textEditors = document.getElementsByClassName('text-editor-wrappers')

    for(const textEditor of textEditors) {
        textEditor.setAttribute("style", "height: " + entirePageHeightMinusTabsAndTermHeight.toString() + "px; position: relative;")
    }
  }


  toggleTerminal = () => {
    const showingTerminal = this.state.showTerminal;
    this.setState({showTerminal: !showingTerminal})

    if(showingTerminal) {   // if terminal was turned off
      this.setState({terminalInitialized: false})
      this.resizeTextEditor(0)
    }
    else {
      const termHeight = document.querySelector("#root > section > section").clientHeight / 3

      this.resizeTextEditor(termHeight)
    }

    
    
  }

  render() {
    console.log('[App.js] render')
    let persons = null;

    if (this.state.showPersons) {
      persons = <Persons 
          persons={this.state.persons}
          clicked={this.deletePersonHandler}
          changed={this.nameChangedHandler}
          isAuthenticated={this.state.authenticated}/>
    }

    const { collapsed } = this.state;
    return (
      <Layout className="layout-font" style={{ minHeight: '100vh' }}>

        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse} style={{'fontSize' : 11 }}>          
            <Scrollbars>
                <FolderContent key={this.state.folderName} folderContent={this.state.folderContent} folderName={this.state.folderName}/>
                
                <Menu inlineIndent={10} theme="dark" defaultSelectedKeys={['1']} mode="inline">
                
                <SubMenu key="19" icon={<FileOutlined/>} title={process.cwd().split("\\").pop()}>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                  <Menu.Item key="6">Team 1</Menu.Item>
                  <Menu.Item key="8">Team 2</Menu.Item>
                  <SubMenu key="sub3" icon={<TeamOutlined />} title="Team">
                  <Menu.Item key="7">Team 1</Menu.Item>
                  <Menu.Item key="9">Team 2</Menu.Item>
                </SubMenu>
                </SubMenu>
              </SubMenu>
                </Menu>


                <button onClick={this.toggleTerminal}>Open Terminal</button>
            </Scrollbars>
        </Sider>


        <Layout className="site-layout">

        <Tabs />          
        <Footer>
          {this.state.showTerminal ? <Terminal /> : null}
        </Footer>
  
        </Layout>
      </Layout>
    );

    // style={{ margin: '0 0px', maxHeight: '75vh', overflowY: 'scroll', overflowX: 'hidden' }}
    // return (
    //   <Aux classes={classes.App}>
    // <code><textarea></textarea></code>
    // <button onClick={this.openTerminal}>Open Terminal</button>

    // {this.state.showTerminal ? <Terminal /> : null}
    //   </Aux>
    // );
    // return React.createElement('div', {className: 'App'}, React.createElement('h1', null, 'Does this work now?'));
  }
}

export default App;



// <SubMenu key="9" icon={<FileOutlined/>} title={process.cwd().split("\\").pop()}>
// <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
//   <Menu.Item key="6">Team 1</Menu.Item>
//   <Menu.Item key="8">Team 2</Menu.Item>
//   <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
//   <Menu.Item key="6">Team 1</Menu.Item>
//   <Menu.Item key="8">Team 2</Menu.Item>
// </SubMenu>
// </SubMenu>
// </SubMenu>

// return (
//   <Aux classes={classes.App}>
    
  
  // <button onClick={() => {this.setState({showCockpit: false})}}>Remove Cockpit</button>
//   <AuthContext.Provider value={{authenticated: this.state.authenticated, login: this.loginHandler}}>
//   {this.state.showCockpit ? 
//     <Cockpit 
//     title={this.props.appTitle}
//     showPersons={this.state.showPersons}
//     personsLength={this.state.persons.length}
//     clicked={this.togglePersonsHandler} /> : null}
//     {persons}
//     </AuthContext.Provider>
//     <Terminal/>
//     </Aux>
// );