import {
  DiJavascript1,
  DiCss3Full,
  DiHtml5,
  DiReact,
  DiGo,
  DiJava,
  DiPython,
} from 'react-icons/di';
import { SiC, SiCsharp, SiCplusplus } from 'react-icons/si';
import { Menu } from 'antd';
import React, { Component } from 'react';
import { languageOptionStyle } from '../styles/LanguageDropdown';

let languageOptions = [
  {
    name: 'Python 3',
    icon: <DiPython size={20} style={{ float: 'right' }} />,
    compilerName: 'python3',
  },
  {
    name: 'JavaScript',
    icon: (
      <DiJavascript1 size={20} style={{ float: 'right', marginLeft: '10px' }} />
    ),
    compilerName: 'nodejs',
  },
  {
    name: 'C++',
    icon: <SiCplusplus size={20} style={{ float: 'right' }} />,
    compilerName: 'cpp',
  },
  {
    name: 'C',
    icon: <SiC size={20} style={{ float: 'right' }} />,
    compilerName: 'c',
  },
  {
    name: 'Go',
    icon: <DiGo size={20} style={{ float: 'right' }} />,
    compilerName: 'go',
  },
  {
    name: 'Java',
    icon: <DiJava size={20} style={{ float: 'right' }} />,
    compilerName: 'java',
  },
  {
    name: 'C#',
    icon: <SiCsharp size={20} style={{ float: 'right' }} />,
    compilerName: 'csharp',
  },
];

let defaultLanguage = languageOptions[0];

let languageMenu = (
  <Menu className="layout-font language-dropdown">
    {languageOptions.map((lang, index) => {
      return (
        <Menu.Item
          key={index}
          style={languageOptionStyle}
          onClick={() => this.languageOptionClickHandler(lang)}
        >
          {lang.name} {lang.icon}
        </Menu.Item>
      );
    })}
  </Menu>
);

export default { languageMenu, defaultLanguage };
