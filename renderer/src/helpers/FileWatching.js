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
          updateType: 'add',
          filePath,
        },
        app
      );
    })
    .on('unlink', (path) => {})
    .on('addDir', (path) => {})
    .on('unlinkDir', (path) => {});
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
