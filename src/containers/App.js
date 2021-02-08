import React, { Component } from 'react';
import './App.css';
import Persons from '../components/Persons/Persons';
import Cockpit from '../components/Cockpit/Cockpit'
import withClass from '../hoc/withClass';
import Aux from '../hoc/Auxillary';
import AuthContext from '../context/auth-context';
import Terminal from '../components/Terminal/Terminal';
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

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const {initTerminal} = require('../components/Terminal/TerminalSetup');

class App extends Component {

  constructor(props) {
    super(props)
    console.log('[App.js] constructor')

  }

  state = {
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
    collapsed: false
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  static getDerivedStateFromProps(props, state) {
    console.log('[App.js] getDerivedStateFromProps', props);
    return state;
  }

  componentDidMount() {
    console.log('[App.js] componentDidMount')
  }

  componentDidUpdate(){
    if(this.state.showTerminal) {
      initTerminal()
    }

    // console.log(document.querySelector('#terminal > div.terminal.xterm > div.xterm-screen > canvas.xterm-cursor-layer').clientHeight)
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


  openTerminal = () => {
    const showingTerminal = this.state.showTerminal;
    this.setState({showTerminal: !showingTerminal})

    if(showingTerminal) {   // if terminal was turned off

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
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>          
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>

            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              Option 2
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
                <SubMenu key="sub4" icon={<UserOutlined />} title="User">
                  <Menu.Item key="3">Tom</Menu.Item>
                  <Menu.Item key="4">Bill</Menu.Item>
                  <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <SubMenu key="9" icon={<FileOutlined/>} title={process.cwd().split("\\").pop()}>
              Files
              
            </SubMenu>
            
            </Menu>
            <button onClick={this.openTerminal}>Open Terminal</button>
        </Sider>
        <Layout className="site-layout">

        <Tabs/>          
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