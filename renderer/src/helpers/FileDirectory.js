const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  FILE_READ_SUCCESS,
  FILE_BINARY_ERROR,
  FILE_TOO_LARGE_ERROR,
  FILE_DOES_NOT_EXIST_ERROR,
} = require('../enums/FileReadingErrors');
const slash = os.platform() === 'win32' ? '\\' : '/';
const isBinaryFileSync = require('isbinaryfile').isBinaryFileSync;

const FOLDER_NOT_LOADED_YET = 404;
// test
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

  console.log('BASE FOLDER CONTENT', folderContent);

  app.setState({ folderContent: folderContent, folderName: folderName });
};

const getTargetDirectory = (folderPath, folderContent, app) => {
  const baseDirPath = app.state.workSpacePath;
  console.log('BASE DIR PATH', baseDirPath);
  const targetPath = folderPath.replace(baseDirPath, '');

  let paths = targetPath.split(slash);
  if (paths.length > 0 && paths[0] === '') {
    paths = paths.slice(1);
  }
  console.log('FOLDER CLICK!!', paths);
  // console.log('PATHS LENGTH', paths.length);

  let folderMap = folderContent;
  let folderPtr = null;

  console.log('FOLDER CONTENT', folderContent);

  for (const path of paths) {
    console.log('PATH', path);
    folderPtr = folderMap.get(path);
    if (folderPtr == null) {
      // console.log('NULL', baseDirPath + '\n\n' + folderPath + '\n\n');
      console.log('FOLDER HASNT BEEN LOADED IN YET');
      return FOLDER_NOT_LOADED_YET;
    }
    folderMap = folderPtr.children;
  }

  return folderPtr;
};

const setFolderContent = (folderPath, options, app) => {
  const folderContent = app.state.folderContent;

  const folderPtr = getTargetDirectory(folderPath, folderContent, app);

  if (folderPtr == FOLDER_NOT_LOADED_YET) {
    return;
  }

  const { isUpdate, updateType, path } = options;

  if (isUpdate) {
    if (updateType == 'addFile') {
      const fileName = getDirectoryNodeName('file', path);

      if (folderPtr) {
        folderPtr.children.set(fileName, {
          type: 'file',
          name: fileName,
          path: path,
        });
      } else {
        app.state.folderContent.set(fileName, {
          type: 'file',
          name: fileName,
          path: path,
        });
      }
    } else if (updateType == 'removeFile') {
      const fileName = getDirectoryNodeName('file', path);

      if (folderPtr) {
        folderPtr.children.delete(fileName);
      } else {
        app.state.folderContent.delete(fileName);
      }
    } else if (updateType == 'addFolder') {
      const folderName = getDirectoryNodeName('folder', path);

      if (folderPtr) {
        folderPtr.children.set(folderName, {
          type: 'folder',
          name: folderName,
          children: new Map(),
          path: path,
        });
      } else {
        app.state.folderContent.set(folderName, {
          type: 'folder',
          name: folderName,
          children: new Map(),
          path: path,
        });
      }
    } else if (updateType == 'removeFolder') {
      const folderName = getDirectoryNodeName('folder', path);

      if (folderPtr) {
        folderPtr.children.delete(folderName);
      } else {
        app.state.folderContent.delete(folderName);
      }
    }
  } else if (!isUpdate) {
    if (folderPtr.children.size > 0) {
      console.log('ALREADY POPULATED');
      return;
    }
    folderPtr.children = getFolderContent(folderPath);
  } else {
    console.log('INVALID OPTIONS // OR NOT ACCOMODATED NOW', options);
  }

  // console.log('SET FOLDER CONTENT', folderContent);

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

const getFilesFolderName = (filePath) => {
  return path.dirname(filePath);
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
  console.log('FILENAME:', fileName);
  // const bytes = fs.readFileSync(path);
  // const size = fs.lstatSync(path).size;
  console.log(isBinaryFileSync(path));

  const isBinaryFile = isBinaryFileSync(path);
  if (isBinaryFile) {
    return [null, FILE_BINARY_ERROR];
  }

  try {
    if (fs.existsSync(path)) {
      console.log('File exists.');
    } else {
      console.log(path, 'File does not exist.');
      return [null, FILE_DOES_NOT_EXIST_ERROR];
    }
  } catch (err) {
    console.error(err);
    return [null, FILE_DOES_NOT_EXIST_ERROR];
  }

  let fileData = null;
  let status = FILE_READ_SUCCESS;
  try {
    fileData = fs.readFileSync(path, 'utf8');
  } catch (err) {
    console.log(err);
    fileData = null;
    status = FILE_TOO_LARGE_ERROR;
  }
  return [fileData, status];
};

const getFolderContent = (folderPath) => {
  if (!pathExists(folderPath)) {
    console.log('Path Does Not Exist.');
    return;
  }

  var newDir = new Map();

  const baseDir = readDirectory(folderPath);

  for (const f of baseDir) {
    var currentPath = path.join(folderPath, f);

    const currentPathIsDir = isDirectory(currentPath);

    if (currentPathIsDir) {
      // var tempDir = getFolderContents(currentPath);

      const folderName = getDirectoryNodeName('folder', currentPath);

      newDir.set(folderName, {
        type: 'folder',
        name: folderName,
        children: new Map(),
        path: currentPath,
      });
    } else {
      const fileName = getDirectoryNodeName('file', currentPath);

      newDir.set(fileName, {
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
  getFilesFolderName,
};
