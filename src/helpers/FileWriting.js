import fs from 'fs';
// import { promises as fs } from 'fs';

import os from 'os';
import { getFullPath } from '../helpers/FileDirectory';

const createNewFile = (path) => {
  fs.writeFile(path, '', function (err) {
    if (err) throw err;
    else console.log('File is created successfully.');
  });
};

const saveFileContent = (content, path) => {
  console.log('CONTENT', content);
  console.log('PATH', path);

  // fs.writeFile(path, content, function (err) {
  //   if (err) throw err;
  //   else console.log('File is saved successfully.');
  // });
};

export { createNewFile, saveFileContent };
