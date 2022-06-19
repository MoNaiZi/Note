const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    newWindow: () => ipcRenderer.send('newWindow'),
    closeWindow: (winId) => ipcRenderer.send('closeWindow', winId)
})