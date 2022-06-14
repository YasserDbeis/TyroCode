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

export const langToIcon = (lang, style) => {
  return (
    {
      [langs.js]: (
        <img
          style={style}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg"
        />
      ),
      [langs.css]: (
        <img
          style={style}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain.svg"
        />
      ),
      [langs.html]: (
        <img
          style={style}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain.svg"
        />
      ),
      [langs.jsx]: (
        <img
          style={style}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
        />
      ),
      [langs.go]: (
        <img
          style={style}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg"
        />
      ),
      [langs.java]: (
        <img
          style={style}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-plain.svg"
        />
      ),
      [langs.py]: (
        <img
          style={style}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
        />
      ),
      [langs.c]: (
        <img
          style={style}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-plain.svg"
        />
      ),
      [langs.cs]: (
        <img
          style={style}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-plain.svg"
        />
      ),
      [langs.cpp]: (
        <img
          style={style}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-plain.svg"
        />
      ),
      [langs.cc]: (
        <img
          style={style}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-plain.svg"
        />
      ),
    }[lang] ?? <img style={style} src="./src/assets/fileIcon.svg" />
  );
};

export const getFileExtension = (filename) => {
  let lastPeriodIndex = filename.lastIndexOf('.');

  if (lastPeriodIndex == -1) {
    return null;
  }

  let ext = filename.slice(lastPeriodIndex + 1);

  return ext;
};
