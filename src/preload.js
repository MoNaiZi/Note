const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (obj) => ipcRenderer.send('setTitle', obj),
    newWindow: (winId) => ipcRenderer.send('newWindow', winId),
    closeWindow: (winId) => ipcRenderer.send('closeWindow', winId)
})