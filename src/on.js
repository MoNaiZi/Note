import { ipcMain, BrowserWindow } from 'electron'
const mainProcess = require('./mainProcess')

ipcMain.on('set-title', async (event, data) => {
    console.log('data', data, 'this', this)
    // const webContents = event.sender
    // const win = BrowserWindow.fromWebContents(webContents)
    // win.setTitle(title)
})

ipcMain.on('newWindow', async (event, data) => {
    console.log('data', data, 'this', this)
    const mainWindows = mainProcess.mainWindows()
    const { config, winURL } = mainWindows
    let newOjb = {
        width: 280,
        height: 300,
        minWidth: 100,
        minHeight: 48,
        frame: false
    }
    newOjb = Object.assign(config, newOjb)
    // console.log('newOjb', newOjb)
    let win = new BrowserWindow(newOjb)

    win.loadURL(`${winURL}/#/edited`)
})


ipcMain.on('closeWindow', async (event, id) => {
    // console.log('event', event)
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.close()
})