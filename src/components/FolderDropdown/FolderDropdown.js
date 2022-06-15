import React, { useState } from 'react';

import './FolderTree.css';

import { Button } from 'antd';

import styled from 'styled-components';
import {
  AiOutlineFile,
  AiOutlineFolder,
  AiOutlineFolderOpen,
} from 'react-icons/ai';
import {
  DiJavascript,
  DiCss3Full,
  DiHtml5,
  DiReact,
  DiGo,
  DiJava,
  DiPython,
} from 'react-icons/di';
import { SiC, SiCsharp, SiCplusplus } from 'react-icons/si';
import {
  getDirectoryNode,
  openFolderHandler,
} from '../../helpers/FileDirectory';
import { getProgLanguage, langToIcon } from '../../helpers/FilenameExtensions';
import { openWorkspaceButtonStyle } from '../../styles/OpenWorkspaceButtonStyle';
/*
Thank you to Anurag Hazra for his wonderful inspiration. His work 
in article https://anuraghazra.github.io/blog/building-a-react-folder-tree-component
was immensly helpful and influential on this component. I took much of his code
and for that he deserves credit. 
*/

const FILE_ICONS = {
  js: <DiJavascript />,
  css: <DiCss3Full />,
  html: <DiHtml5 />,
  jsx: <DiReact />,
  go: <DiGo />,
  java: <DiJava />,
  py: <DiPython />,
  c: <SiC />,
  cs: <SiCsharp />,
  cpp: <SiCplusplus />,
  cc: <SiCplusplus />,
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
  height: ${(p) => (p.isOpen ? 'auto' : '0')};
  overflow: hidden;
`;

const File = ({ name, path, onNodeClick }) => {
  const splitOnDot = name.split('.');
  // let ext = splitOnDot[splitOnDot.length - 1];
  // let iconExists = FILE_ICONS[ext] != null;

  const lang = getProgLanguage(name);

  const fileClickHandler = (e) => {
    const fileNode = getDirectoryNode('file', name, path);

    onNodeClick(e.target, fileNode);
  };

  return (
    <StyledFile>
      {langToIcon(lang, { height: '14px', width: '14px' })}
      <span id={path} onClick={fileClickHandler} style={{ cursor: 'pointer' }}>
        {name}
      </span>
    </StyledFile>
  );
};

const Folder = ({ name, path, children, onNodeClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);

    const folderNode = getDirectoryNode('folder', name, path);
    onNodeClick(e.target, folderNode);
  };

  return (
    <StyledFolder>
      <div
        style={{ cursor: 'pointer' }}
        className="folder--label"
        onClick={handleToggle}
      >
        {isOpen ? <AiOutlineFolderOpen /> : <AiOutlineFolder />}
        <span>{name}</span>
      </div>
      <Collapsible isOpen={isOpen}>{children}</Collapsible>
    </StyledFolder>
  );
};

const TreeRecursive = ({ data, onNodeClick }) => {
  // loop through the data
  return data.map((item) => {
    if (item.type === 'file') {
      return (
        <File
          key={item.path + '-' + item.name + '-file'}
          name={item.name}
          path={item.path}
          onNodeClick={onNodeClick}
        />
      );
    }

    if (item.type === 'folder') {
      return (
        <Folder
          key={item.path + '_folder'}
          name={item.name}
          path={item.path}
          children={item.children}
          onNodeClick={onNodeClick}
        >
          <TreeRecursive
            key={item.toString()}
            data={item.children}
            onNodeClick={onNodeClick}
          />
        </Folder>
      );
    }
  });
};

const Tree = ({ data, onNodeClick }) => {
  return (
    <StyledTree>
      <TreeRecursive
        key={data.toString()}
        data={data}
        onNodeClick={onNodeClick}
      />
    </StyledTree>
  );
};

const errorDirectory = [
  {
    type: 'file',
    name: 'Error Loading Directory',
    children: [],
  },
];

const FileTree = (props) => {
  const openFolderHandler = () => {
    const { dialog } = require('electron').remote;

    dialog
      .showOpenDialog({
        properties: ['openDirectory', 'createDirectory'],
      })
      .then((promise) => {
        const path = promise.filePaths[0];
        props.onFolderSelection(path);
      });
  };

  return (
    <div>
      <Button
        onClick={() => openFolderHandler(props.onFolderSelection)}
        style={openWorkspaceButtonStyle}
      >
        Select Folder{' '}
        <AiOutlineFolderOpen size={24} style={{ verticalAlign: 'middle' }} />
      </Button>

      {props.folderContent != undefined ? (
        <div className="FileTree">
          <Tree
            onNodeClick={props.folderDropdownNodeClickHandler}
            data={props.folderContent ? props.folderContent : errorDirectory}
          />
        </div>
      ) : null}
    </div>
  );
};

export default FileTree;
