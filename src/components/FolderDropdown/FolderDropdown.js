import React, {Component, useEffect, useState, use} from 'react';

import './FolderTree.css'

import styled from "styled-components";
import { AiOutlineFile, AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai";
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact, DiGo, DiJava, DiPython } from "react-icons/di";
import { SiC, SiCsharp, SiCplusplus } from "react-icons/si";

/*
Thank you to Anurag Hazra for his wonderful inspiration. His work 
in article https://anuraghazra.github.io/blog/building-a-react-folder-tree-component
was immensly helpful and influential on this component. I took much of his code
and for that he deserves credit. 
*/


const FILE_ICONS = {
  js: <DiJavascript1 />,
  css: <DiCss3Full />,
  html: <DiHtml5 />,
  jsx: <DiReact />,
  go: <DiGo />,
  java: <DiJava />,
  py: <DiPython />,
  c: <SiC />,
  cs: <SiCsharp />,
  cpp: <SiCplusplus />,
  cc: <SiCplusplus />
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

const File = ({ name, node, onNodeClick }) => {
  let ext = name.split(".")[name.split(".").length - 1];
  let iconExists = FILE_ICONS[ext] != null;

  return (
    <StyledFile>
      {iconExists ? FILE_ICONS[ext] : <AiOutlineFile />}
      <span style={{cursor: 'pointer'}} onClick={() => onNodeClick(node)}>{name}</span>
    </StyledFile>
  );
};

const Folder = ({ name, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = e => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <StyledFolder>
      <div style={{cursor: 'pointer'}} className="folder--label" onClick={handleToggle}>
        {isOpen ? <AiOutlineFolderOpen /> : <AiOutlineFolder />}
        <span>{name}</span>
      </div>
      <Collapsible isOpen={isOpen}>{children}</Collapsible>
    </StyledFolder>
  );
};

const TreeRecursive = ({ data, onNodeClick }) => {
  // loop through the data
  return data.map(item => {

    if (item.type === "file") {
      return <File key={item.path} name={item.name} node={item} onNodeClick={onNodeClick}/>;
    }

    if (item.type === "folder") {
      return (
        <Folder key={item.path} name={item.name} node={item}>
          <TreeRecursive key={item.path} data={item.childrens} onNodeClick={onNodeClick} />
        </Folder>
      );
    }
  });
};

const Tree = ({ data, onNodeClick }) => {
  return (
    <StyledTree>
      <TreeRecursive key={data.path} data={data} onNodeClick={onNodeClick}/>
    </StyledTree>
  );
};

const errorDirectory = [
  {
    type: "file",
    name: "Error Loading Directory",
    childrens: []
  }
];

const FileTree = (props) => {

  //console.log(props.folderContent)

  return (
    <div className="FileTree">
      <Tree onNodeClick={props.fileClickHandler} data={props.folderContent ? props.folderContent : errorDirectory} />
    </div>
  );
}

export default FileTree;

