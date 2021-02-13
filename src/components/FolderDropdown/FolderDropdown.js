import React, {Component} from 'react';
import { Layout, Menu, Breadcrumb, Divider } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';


const FolderDropdown = ({ dirContent }) => {

    console.log((dirContent))

    if(dirContent.children.length == 0) {
        return <Menu.Item className="ant-menu-item" key={dirContent.path}>{dirContent.name}</Menu.Item>
    }

    return (
        <SubMenu className="ant-menu-submenu-title" key={dirContent.path} title={dirContent.name}>
            <FolderDropdown key={dirContent.path} dirContent={dirContent.children} />
        </SubMenu>
    );

    // })    

}

// const nestedDir = (content.children || []).map(content => {
//     return <SubMenu key={content.path} title={content.name}></SubMenu>    
//   })

//   return <Menu.Item key={content.path}>{content.name}</Menu.Item>



class FolderContent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            folderContent: this.props.folderContent,
            folderName: this.props.folderName
        }

        // console.log(this.state.folderName)
    }

    componentDidUpdate(prevProps) {
        if(prevProps.folderContent != this.state.folderContent) {
            this.setState({value: this.props.folderContent})
        }

        // console.log(this.state.folderContent)
    }


    render() {

        return(
            <Menu inlineIndent={10} theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <SubMenu key="-1" icon={<FileOutlined/>} title={this.state.folderName}>

                    {this.state.folderContent ? this.state.folderContent.map((dirContent, index) => {
                        console.log(dirContent)
                        return (
                            <FolderDropdown key={index} dirContent={dirContent}></FolderDropdown>
                        );
                        
                    }) : null}


                </SubMenu>
            </Menu>


        );
    }

}

export default FolderContent;


// <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
// <Menu.Item key="6">Team 1</Menu.Item>
// <Menu.Item key="8">Team 2</Menu.Item>
// <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
//     <Menu.Item key="6">Team 1</Menu.Item>
//     <Menu.Item key="8">Team 2</Menu.Item>
// </SubMenu>
// </SubMenu>