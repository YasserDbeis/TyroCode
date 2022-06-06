import * as langs from '../enums/ProgLanguages';
import prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';

import React from 'react';
// import {
//   DiJavascript,
//   DiCss3Full,
//   DiHtml5,
//   DiReact,
//   DiGo,
//   DiJava,
//   DiPython,
// } from 'react-icons/di';
// import { SiC, SiCsharp, SiCplusplus } from 'react-icons/si';
// import { AiOutlineFileText } from 'react-icons/ai';

export const getProgLanguage = (filename) => {
  let ext = getFileExtension(filename);

  return extToLang(ext);
};

export const extToLang = (lang_ext) => {
  return (
    {
      js: langs.js,
      css: langs.css,
      html: langs.html,
      jsx: langs.jsx,
      go: langs.go,
      java: langs.java,
      py: langs.py,
      c: langs.c,
      cs: langs.cs,
      cpp: langs.cpp,
      cc: langs.cc,
    }[lang_ext] ?? langs.none
  );
};

export const extToPrismLang = (lang_ext) => {
  const lang =
    {
      js: 'javascript',
      go: 'go',
      c: 'c',
      cc: 'cpp',
      cpp: 'cpp',
      java: 'java',
      py: 'python',
      py3: 'python',
      cs: 'csharp',
    }[lang_ext] ?? 'clike';

  return prism.languages[lang];
};

export const langToIcon = (lang) => {
  console.log('LANG', lang);

  return (
    <img
      height={20}
      width={20}
      style={{
        marginLeft: '10px',
      }}
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg"
    />
  );

  // return (
  //   {
  //     [langs.js]: <IconC height={15} width={15} />,
  //     [langs.css]: <DiCss3Full size={15} />,
  //     [langs.html]: <DiHtml5 size={15} />,
  //     [langs.jsx]: <DiReact size={15} />,
  //     [langs.go]: <DiGo size={15} />,
  //     [langs.java]: (
  //       <img
  // height={20}
  // width={20}
  // style={{
  //   marginLeft: '10px',
  //   marginBottom: '5px',
  // }}
  //         src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-plain.svg"
  //       />
  //     ),
  //     [langs.py]: <DiPython size={15} />,
  //     [langs.c]: <SiC size={15} />,
  //     [langs.cs]: <SiCsharp size={15} />,
  //     [langs.cpp]: <SiCplusplus size={15} />,
  //     [langs.cc]: <SiCplusplus size={15} />,
  //   }[lang] ?? <AiOutlineFileText size={15} />
  // );
};

const getFileExtension = (filename) => {
  let lastPeriodIndex = filename.lastIndexOf('.');

  if (lastPeriodIndex == -1) {
    return null;
  }

  let ext = filename.slice(lastPeriodIndex + 1);

  return ext;
};
