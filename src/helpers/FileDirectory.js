const fs = require('fs');
const path = require('path');
const os = require('os');
const slash = os.platform() === 'win32' ? '\\' : '/';
const { getFileExtension } = require('../helpers/FilenameExtensions');
const getPWD = () => {
  return process.cwd();
};

const getFullPath = (currDirectory, filename) => {
  return `${currDirectory}${slash}${filename}`;
};

const getBaseFolderContent = (path, app) => {
  if (!path) {
    return;
  }

  const folderName = path.split(slash).pop();
  const folderContent = getFolderContent(path);

  app.setState({ folderContent: folderContent, folderName: folderName });
};

const getTargetDirectory = (folderPath, folderContent) => {
  const baseDir = getPWD();

  const targetPath = folderPath.replace(baseDir + slash, '');

  console.log('FOLDER CLICK!!', targetPath);
  console.log('FOLDER CLICK!!', targetPath.split(slash));

  const paths = targetPath.split(slash);

  // let baseFolderContent = [...app.state.folderContent];

  let folderPtr = folderContent;

  for (const path of paths) {
    for (const base of folderPtr) {
      console.log(path + '---' + base.type + ', ' + base?.name);
      if (base.type == 'folder' && base.name == path) {
        folderPtr = base.children;
        break;
      }
    }
  }

  return folderPtr;
};

const setFolderContent = (folderPath, options, app) => {
  const folderContent = [...app.state.folderContent];

  const folderPtr = getTargetDirectory(folderPath, folderContent);

  const { isUpdate, updateType, filePath } = options;

  if (isUpdate && updateType == 'add') {
    const fileName = getDirectoryNodeName('file', filePath);

    folderPtr.push({
      type: 'file',
      name: fileName,
      path: filePath,
    });
  } else if (!isUpdate) {
    if (folderPtr.length > 0) {
      console.log('ALREADY POPULATED');
      return;
    }

    folderPtr.push(...getFolderContent(folderPath));
  } else {
    console.log('INVALID OPTIONS // OR NOT ACCOMODATED NOW', options);
  }

  console.log('SET FOLDER CONTENT', folderContent);

  app.setState({ folderContent: folderContent });
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

const getFileText = (path, fileName) => {
  const ext = getFileExtension(fileName);
  if (ext == 'pdf') {
    return [null, false];
  }

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
  return [fileData, true];
};

const getFolderContent = (folderPath) => {
  if (!pathExists(folderPath)) {
    console.log('Path Does Not Exist.');
    return;
  }

  var newDir = [];

  const baseDir = readDirectory(folderPath);

  for (const f of baseDir) {
    var currentPath = path.join(folderPath, f);

    const currentPathIsDir = isDirectory(currentPath);

    if (currentPathIsDir) {
      // var tempDir = getFolderContents(currentPath);

      const folderName = getDirectoryNodeName('folder', currentPath);

      newDir.push({
        type: 'folder',
        name: folderName,
        children: [],
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

const openFolderHandler = (onFolderSelection) => {
  const { dialog } = require('electron').remote;

  dialog
    .showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
    })
    .then((promise) => {
      const path = promise.filePaths[0];
      onFolderSelection(path);
    });
};

module.exports = {
  getDirectoryNode,
  getCurrentDirectory,
  getFileText,
  getBaseFolderContent,
  getPWD,
  getFullPath,
  setFolderContent,
  pathExists,
  openFolderHandler,
};
