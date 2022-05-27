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
import { Menu } from 'antd';
import React, { Component } from 'react';
import { languageOptionStyle } from '../styles/LanguageDropdown';

let languageOptions = [
  {
    name: 'Python 3',
    icon: <DiPython size={20} />,
    compilerName: 'python3',
  },
  {
    name: 'JavaScript',
    icon: <DiJavascript size={20} />,
    compilerName: 'nodejs',
  },
  {
    name: 'C++',
    icon: <SiCplusplus size={20} />,
    compilerName: 'cpp',
  },
  {
    name: 'C',
    icon: <SiC size={20} />,
    compilerName: 'c',
  },
  {
    name: 'Go',
    icon: <DiGo size={20} />,
    compilerName: 'go',
  },
  {
    name: 'Java',
    icon: <DiJava size={20} />,
    compilerName: 'java',
  },
  {
    name: 'C#',
    icon: <SiCsharp size={20} />,
    compilerName: 'csharp',
  },
];

let defaultLanguage = languageOptions[0];

export { languageOptions, defaultLanguage };
