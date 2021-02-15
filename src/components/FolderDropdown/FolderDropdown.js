import React, {Component, useEffect, useState, use} from 'react';
import FolderTree, { testData } from 'react-folder-tree';
import {Scrollbars} from 'react-custom-scrollbars';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
  } from '@ant-design/icons';

import './FolderTree.css'

import styled from "styled-components";
import { AiOutlineFile, AiOutlineFolder } from "react-icons/ai";
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact } from "react-icons/di";

const FILE_ICONS = {
  js: <DiJavascript1 />,
  css: <DiCss3Full />,
  html: <DiHtml5 />,
  jsx: <DiReact />
};

const StyledTree = styled.div`
  line-height: 1.5;
`;
const StyledFile = styled.div`
  padding-left: 20px;
  display: flex;
  align-items: center;
  span {
    margin-left: 5px;
  }
`;
const StyledFolder = styled.div`
  padding-left: 20px;

  .folder--label {
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
    }
  }
`;
const Collapsible = styled.div`
  height: ${p => (p.isOpen ? "auto" : "0")};
  overflow: hidden;
`;

const File = ({ name, node }) => {
  let ext = name.split(".")[1];

  const fileClickHandler = () => {
      console.log(node)
  }

  return (
    <StyledFile>
      {/* render the extension or fallback to generic file icon  */}
      {FILE_ICONS[ext] || <AiOutlineFile />}
      <span style={{cursor: 'pointer'}} onClick={fileClickHandler}>{name}</span>
    </StyledFile>
  );
};

const Folder = ({ name, node, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = e => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <StyledFolder>
      <div style={{cursor: 'pointer'}} className="folder--label" onClick={handleToggle}>
        <AiOutlineFolder />
        <span>{name}</span>
      </div>
      <Collapsible isOpen={isOpen}>{children}</Collapsible>
    </StyledFolder>
  );
};

const TreeRecursive = ({ data }) => {
  // loop through the data
  return data.map(item => {
    // if its a file render <File />
    if (item.type === "file") {
      return <File name={item.name} node={item}/>;
    }
    // if its a folder render <Folder />
    if (item.type === "folder") {
      return (
        <Folder name={item.name} node={item}>
          {/* Call the <TreeRecursive /> component with the current item.childrens */}
          <TreeRecursive data={item.childrens}  />
        </Folder>
      );
    }
  });
};
const Tree = ({ data, children, onNodeClick }) => {
  const isImparative = data && !children;

    console.log(onNodeClick)


  return (
    <StyledTree>
      {isImparative ? <TreeRecursive onClick={onNodeClick} data={data} /> : children}
    </StyledTree>
  );
};

Tree.File = File;
Tree.Folder = Folder;

const structure = [
  {
    type: "folder",
    name: "src",
    childrens: [
      {
        type: "folder",
        name: "Components",
        childrens: [
          { type: "file", name: "Modal.js" },
          { type: "file", name: "Modal.css" }
        ]
      },
      { type: "file", name: "index.js" },
      { type: "file", name: "index.html" }
    ]
  },
  { type: "file", name: "package.json" }
];

export default function FileTree(props) {

    console.log(props.folderContent)

    const nodeClickHandler = (node) => {
        console.log(node)
    }
    

  return (
    <div className="App">
      <Tree onNodeClick={nodeClickHandler}  data={props.folderContent ? props.folderContent : structure} />
    </div>
  );
}














// const errorMessage = {
//     name: "ERROR: Folder Could Not Be Loaded",
//     children: []
// }

// var prevState = null




// // const FileIcon = ({ onClick, className }) => {
// //     const handleClick = (event) => {
// //       console.log(event);
// //       onClick();
// //     };
  
// //     return <FileOutlined onClick={  handleClick(event) } />;
// //   };


// const BasicTree = props => {
    
//     console.log(props.folderContent)
//     console.log(testData)
//     console.log(typeof(testData))
//     console.log(typeof(props.folderContent))

    
    

//     const onTreeStateChange = state => {
        
//         if(prevState != state) {
//             console.log(prevState)
//             console.log(state)

//         }

//         prevState = state
//     } 

//     return (
//         <div style={{'fontSize' : 12, color: 'white'}}>
//             <FolderTree
//                 data={ props.folderContent ?  props.folderContent : errorMessage }
//                 onChange={ onTreeStateChange }
//                 indentPixels={8}
//                 initOpenStatus={closed}
//                 />    
//         </div>
//     );
// };

// export default BasicTree;

















// import { Layout, Menu, Breadcrumb, Divider } from 'antd';
// const { Header, Content, Footer, Sider } = Layout;
// const { SubMenu } = Menu;
// import {
//     DesktopOutlined,
//     PieChartOutlined,
//     FileOutlined,
//     TeamOutlined,
//     UserOutlined,
// } from '@ant-design/icons';


// const DirItem = ({ dirContent }) => {

//     console.log((dirContent))

//     if(dirContent.children.length == 0) {
//         return <Menu.Item className="ant-menu-item" key={dirContent.path}>{dirContent.name}</Menu.Item>
//     }

//     return (
//         <SubMenu className="ant-menu-submenu-title" key={dirContent.path} title={dirContent.name}>
//             <Menu.Item className="ant-menu-item" key={dirContent.path}>{dirContent.name}</Menu.Item>
//         </SubMenu>
//     );

// }

// // const nestedDir = (content.children || []).map(content => {
// //     return <SubMenu key={content.path} title={content.name}></SubMenu>    
// //   })

// //   return <Menu.Item key={content.path}>{content.name}</Menu.Item>



// class DirList extends Component {

//     constructor(props) {
//         super(props)

//         this.state = {
//             folderContent: this.props.folderContent,
//             folderName: this.props.folderName
//         }

//         // console.log(this.state.folderName)
//     }

//     componentDidUpdate(prevProps) {
//         if(prevProps.folderContent != this.state.folderContent) {
//             this.setState({value: this.props.folderContent})
//         }

//         // console.log(this.state.folderContent)
//     }

//     render() {

//         if(this.state.folderContent && this.state.folderContent.length > 0) {
//             return this.state.folderContent.map((dirContent, index) => {
//                 console.log(dirContent)
//                 console.log(dirContent.children)

//                 if(dirContent.children.length > 0) {
//                     return (
//                         <SubMenu key={index} title={dirContent.name}>
//                         </SubMenu>
//                     );
//                 }
//                 else {
//                     return <Menu.Item>{dirContent.name}</Menu.Item>
//                 }
//             })
//         }

//     }

// }

// export default DirList;


// // <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
// // <Menu.Item key="6">Team 1</Menu.Item>
// // <Menu.Item key="8">Team 2</Menu.Item>
// // <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
// //     <Menu.Item key="6">Team 1</Menu.Item>
// //     <Menu.Item key="8">Team 2</Menu.Item>
// // </SubMenu>
// // </SubMenu>