const fs = require('fs');
const path = require('path');
const os = require('os');
const slash = os.platform() === 'win32' ? '\\' : '/';

const getPWD = () => {
  return process.cwd();
};

const getFullPath = (currDirectory, filename) => {
  return `${currDirectory}${slash}${filename}`;
};

const fetchFolderContent = async (app) => {
  const folderName = path.join(process.cwd(), 'src').split('\\').pop();
  const folderContent = getFolderContents(path.join(process.cwd(), 'src'));

  app.setState({ folderContent: folderContent, folderName: folderName });
};

const getDirectoryNode = (type, name, path) => {
  return {
    type: type,
    name: name,
    path: path,
  };
};

const getDirectoryNodeName = (type, path) => {
  if (type == 'file' || type == 'folder') {
    return path.split(slash).pop();
  } else {
    throw 'Invalid Directory Node Type';
  }
};

const getCurrentDirectory = (directoryNode) => {
  const type = directoryNode.type;
  const path = directoryNode.path;

  if (type == 'folder') {
    return path;
  } else if (type == 'file') {
    const lastSlashIndex = path.lastIndexOf(slash);

    if (lastSlashIndex != -1) {
      return path.slice(0, lastSlashIndex);
    } else {
      throw 'Path Is Malformed!';
    }
  } else {
    throw 'Path Type Invalid!';
  }
};

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

    if (currentPathIsDir) {
      var tempDir = getFolderContents(currentPath);

      const folderName = getDirectoryNodeName('folder', currentPath);

      newDir.push({
        type: 'folder',
        name: folderName,
        children: tempDir,
        path: currentPath,
      });
    } else {
      const fileName = getDirectoryNodeName('file', currentPath);

      newDir.push({
        type: 'file',
        name: fileName,
        path: currentPath,
      });
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
  getDirectoryNode,
  getCurrentDirectory,
  getFolderContents,
  getFileText,
  fetchFolderContent,
  getPWD,
  getFullPath,
};
