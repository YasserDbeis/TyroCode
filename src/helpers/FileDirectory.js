const fs = require('fs');
const path = require('path');
const os = require('os');

const getFileText = (path) => {
  try {
    if (fs.existsSync(path)) {
      console.log('File exists.');
    } else {
      console.log(path, 'File does not exist.');
      return '';
    }
  } catch (err) {
    console.error(err);
    return '';
  }

  const fileData = fs.readFileSync(path, 'utf8');
  return fileData;
};

const getFolderContents = (filePath) => {
  if (!pathExists(filePath)) {
    console.log('Path Does Not Exist.');
    return;
  }

  var newDir = [];

  const baseDir = readDirectory(filePath);

  for (const f of baseDir) {
    var currentPath = path.join(filePath, f);

    const currentPathIsDir = isDirectory(currentPath);
    let slash = os.platform() === 'win32' ? '\\' : '/';

    if (currentPathIsDir) {
      var tempDir = getFolderContents(currentPath);

      newDir.push({
        type: 'folder',
        name: currentPath.split(slash).pop(),
        childrens: tempDir,
        path: currentPath,
      }); // type 1: Folder
    } else {
      newDir.push({
        type: 'file',
        name: currentPath.split(slash).pop(),
        path: currentPath,
      }); // type 0: File
    }
  }

  return newDir;
};

// return true if path is of directory, false if file
const isDirectory = (filePath) => {
  const stats = fs.statSync(filePath);
  return stats.isDirectory();
};

const pathExists = (filePath) => {
  return fs.existsSync(filePath);
};

const readDirectory = (filePath) => {
  const dirFiles = fs.readdirSync(filePath);

  return dirFiles;
};

module.exports = {
  getFolderContents,
  getFileText,
};
