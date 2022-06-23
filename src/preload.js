const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getList: (list) => ipcRenderer.invoke('getList', list),
    setTitle: (obj) => ipcRenderer.send('setTitle', obj),
    newWindow: (winId) => ipcRenderer.send('newWindow', winId),
    closeWindow: (winId) => ipcRenderer.send('closeWindow', winId)
})