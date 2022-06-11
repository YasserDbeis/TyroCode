import fs from 'fs';
// import { promises as fs } from 'fs';

import os from 'os';
import { getFullPath, pathExists } from '../helpers/FileDirectory';

const createNewFile = (path) => {
  const fileAlreadyExists = pathExists(path);

  if (fileAlreadyExists) {
    console.log('FILE ALREADY EXISTS');
    return false;
  }

  try {
    fs.writeFileSync(path, '');
    console.log('File is created successfully.');
    return true;
  } catch (err) {
    console.log('FILE WRITE ERROR:', err);
    return false;
  }
};

const saveFileContent = (content, path) => {
  console.log('CONTENT', content);
  console.log('PATH', path);

  fs.writeFile(path, content, function (err) {
    if (err) throw err;
    else console.log('File is saved successfully.');
  });
};

export { createNewFile, saveFileContent };
