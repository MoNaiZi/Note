import { ipcMain } from 'electron'

ipcMain.on('set-title', (event, data) => {
    console.log('data', data, 'this', this)
    // const webContents = event.sender
    // const win = BrowserWindow.fromWebContents(webContents)
    // win.setTitle(title)
})