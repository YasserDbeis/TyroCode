import fs from 'fs';
import os from 'os';
import { getFullPath } from '../helpers/FileDirectory';

const createNewFile = (path) => {
  fs.writeFile(path, '', function (err) {
    console.log('PATH:', path);
    if (err) throw err;
    console.log('File is created successfully.');
  });
};

export { createNewFile };
