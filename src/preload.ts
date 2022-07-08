const { contextBridge, ipcRenderer } = require('electron')

const windowLoaded = new Promise(resolve => {
    console.log('2222222222')
    window.onload = resolve
})

// contextBridge.exposeInMainWorld('ipcRenderer', {
//     send: (channel, data) => {
//         // whitelist channels
//         const validChannels = ['toMain']
//         if (validChannels.includes(channel)) {
//             ipcRenderer.send(channel, data)
//         }
//     },
//     receive: (channel, func) => {
//         const validChannels = ['fromMain']
//         if (validChannels.includes(channel)) {
//             // Deliberately strip event as it includes `sender`
//             ipcRenderer.on(channel, (event, ...args) => func(...args))
//         }
//     }
// })

ipcRenderer.on('main-world-port', async (event) => {
    console.log('preload111111111111')
    await windowLoaded
    // 我们使用 window.postMessage 将端口
    // 发送到主进程
    window.postMessage('main-world-port', '*', event.ports)
})

contextBridge.exposeInMainWorld('electronAPI', {
    getList: (list: []) => ipcRenderer.invoke('getList', list),
    setTitle: (obj: object) => ipcRenderer.send('setTitle', obj),
    newWindow: (winId: string) => ipcRenderer.send('newWindow', winId),
    closeWindow: (winId: string) => ipcRenderer.send('closeWindow', winId),
})