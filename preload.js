
const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  notificationApi: {
    
    // removed the following from main.js so I removed here as well

    // sendNotification(message) {
    //   ipcRenderer.send('notify', message);
    // }
    
  },
  batteryApi: {
      // not sure what this does
  },
  filesApi: {

  }
})
