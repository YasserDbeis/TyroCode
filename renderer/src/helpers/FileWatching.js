const chokidar = require('chokidar');
const { setFolderContent, getFilesFolderName } = require('./FileDirectory');

const startWatchingFile = (watchPath, tabs) => {
  // console.log('STARTED WATCHING:', watchPath);
  chokidar.watch(watchPath).on('change', (path) => {
    tabs.onExternalFileChange(path);
  });
};

const startWatchingWorkspace = (workspacePath, app) => {
  chokidar
    .watch(workspacePath, { ignoreInitial: true, ignored: ['**/node_modules'] })
    .on('add', (filePath) => {
      const fileDir = getFilesFolderName(filePath);

      setFolderContent(
        fileDir,
        {
          isUpdate: true,
          updateType: 'addFile',
          path: filePath,
        },
        app
      );
    })
    .on('unlink', (filePath) => {
      const fileDir = getFilesFolderName(filePath);

      setFolderContent(
        fileDir,
        {
          isUpdate: true,
          updateType: 'removeFile',
          path: filePath,
        },
        app
      );
    })
    .on('addDir', (folderPath) => {
      const folderDir = getFilesFolderName(folderPath);

      setFolderContent(
        folderDir,
        {
          isUpdate: true,
          updateType: 'addFolder',
          path: folderPath,
        },
        app
      );
    })
    .on('unlinkDir', (folderPath) => {
      const folderDir = getFilesFolderName(folderPath);

      setFolderContent(
        folderDir,
        {
          isUpdate: true,
          updateType: 'removeFolder',
          path: folderPath,
        },
        app
      );
    });
};

const endWatching = (watchedPath) => {
  console.log('STOPPED WATCHING:', watchedPath);
  chokidar.watch(watchedPath).close();
};

module.exports = {
  startWatchingFile,
  startWatchingWorkspace,
  endWatching,
};
