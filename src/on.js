import { ipcMain, BrowserWindow, Menu, Tray, nativeTheme } from 'electron'
const mainProcess = require('./mainProcess')
import db from './server'



ipcMain.handle('theme', (event, temp) => {
    // nativeTheme.themeSource = 'dark'
    // return nativeTheme.shouldUseDarkColors
})


const getNoteList = function () {
    return db.get('NoteList').value()
}

const getNote = function (_id) {
    return db.get('NoteList').find({ _id }).value()
}

ipcMain.handle('getNote', (_event, winId) => {
    return getNote(winId)
})

ipcMain.handle('getList', () => {
    return getNoteList()
})

ipcMain.handle('removeNote', (_event, winId) => {
    db.get('NoteList').remove({ _id: winId }).write()
    return getNoteList()
})

ipcMain.handle('search', (_event, key) => {
    let result = db.get('NoteList').filter(o => {
        // 模糊查询
        return o.title.match(key)
    }).value()
    return result || []
})

ipcMain.on('closeEdited', (_event, winId, tempOjb = {}) => {
    if (JSON.stringify(tempOjb) === '{}') return
    const getValue = db.get('NoteList').find({ _id: winId }).value()
    tempOjb._id = winId
    if (!getValue) {
        db.get('NoteList').unshift(tempOjb).write()
    } else if (getValue) {
        db.get('NoteList').find({ _id: winId }).assign(tempOjb).write()
    }
    let list = getNoteList()
    global.mainWin.webContents.send('getEdited', list)
})

ipcMain.on('newWindow', async (event, winId) => {
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

    let win = new BrowserWindow(newOjb)
    let url = `${winURL}/#/edited?winId=${winId}`
    win.loadURL(url)
})

ipcMain.on('topping', (event, isTopping) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setAlwaysOnTop(isTopping)
})

ipcMain.on('closeWindow', async (event, id) => {
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