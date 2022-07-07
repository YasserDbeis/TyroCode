const chokidar = require('chokidar');

const startWatching = (watchPath, tabs) => {
  // console.log('STARTED WATCHING:', watchPath);
  chokidar.watch(watchPath).on('change', (path) => {
    tabs.onExternalFileChange(path);
  });
};

const endWatching = (watchedPath) => {
  // console.log('STOPPED WATCHING:', watchedPath);
  chokidar.watch(watchedPath).close();
};

module.exports = {
  startWatching,
  endWatching,
};
