import { ipcMain, BrowserWindow, Menu, Tray } from 'electron'
const path = require('path')
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
    console.log('id', id)
    // console.log('event', event)
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)

    if (!id) {
        console.log('global.isMenu', global.isMenu)
        if (!global.isMenu) {
            const tray = new Tray('D:/A_Project/electron/Note/public/favicon.ico');
            const contextMenu = Menu.buildFromTemplate([{
                label: '显示',
                click: () => { win.show() }
            },
            {
                label: '退出',
                click: () => { win.destroy() }
            }
            ]);
            tray.setContextMenu(contextMenu);
            tray.on('double-click', () => {
                // 双击通知区图标实现应用的显示或隐藏
                win.isVisible() ? win.hide() : win.show()
                win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true);
            });
            global.isMenu = true
        }

        win.minimize()
        return
    }
    win.close()

})