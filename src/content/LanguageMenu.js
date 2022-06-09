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
import * as langs from '../enums/ProgLanguages';
import { langToIcon } from '../helpers/FilenameExtensions';

const langIconStyle = {
  height: '20px',
  width: '20px',
};

const languageOptions = [
  {
    name: 'Python 3',
    icon: langToIcon(langs.py, langIconStyle),
    compilerName: 'py',
  },
  {
    name: 'JavaScript',
    icon: langToIcon(langs.js, langIconStyle),
    compilerName: 'js',
  },
  {
    name: 'C++',
    icon: langToIcon(langs.cpp, langIconStyle),
    compilerName: 'cpp',
  },
  {
    name: 'C',
    icon: langToIcon(langs.c, langIconStyle),
    compilerName: 'c',
  },
  {
    name: 'Go',
    icon: langToIcon(langs.go, langIconStyle),
    compilerName: 'go',
  },
  {
    name: 'Java',
    icon: langToIcon(langs.java, langIconStyle),
    compilerName: 'java',
  },
  {
    name: 'C#',
    icon: langToIcon(langs.cs, langIconStyle),
    compilerName: 'cs',
  },
];

let defaultLanguage = languageOptions[0];

export { languageOptions, defaultLanguage };
