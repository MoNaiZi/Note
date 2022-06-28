import { ipcMain, BrowserWindow, Menu, Tray, app } from 'electron'
const path = require('path')
const mainProcess = require('./mainProcess')
import db from './server'
import { createNumberString } from '@/utils'

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

ipcMain.on('request-worker-channel', async (event) => {
    // 出于安全考虑, 让我们确保只要我们期望的 frames
    // 可以访问 worker.
    const mainWindows = mainProcess.mainWindows()
    const { config, winURL } = mainWindows
    let mainWin = new BrowserWindow({
        show: false,
        webPreferences: { nodeIntegration: true }
    })
    let worker = new BrowserWindow({
        show: false,
        webPreferences: { nodeIntegration: true }
    })

    await mainWin.loadFile(winURL)
    await worker.loadFile(`${winURL}/#/edited`)

    if (event.senderFrame === mainWin.webContents.mainFrame) {
        console.log('event', event)
        // 创建新的通道 ...
        const { port1, port2 } = new MessageChannelMain()
        // ... 把一端送到 worker ...
        worker.webContents.postMessage('new-client', null, [port1])
        // ... 同时把另一端送到 main window.
        event.senderFrame.postMessage('provide-worker-channel', null, [port2])
        // 现在 main window 和 worker 可以相互通信
        // 且不需要通过 main process 了!
    }
})


ipcMain.on('port', (e, msg) => {
    console.log('e', e)
    const [port] = e.ports
    console.log('port', port)
    console.log('msg', msg)

})

ipcMain.on('setTitle', async (event, data) => {
    let { winId, title } = data
    let newData = {
        _id: winId,
        title,
    }
    const getValue = db.get('NoteList').find({ _id: winId }).value()
    console.log('getValue', getValue)
    if (title != '' && !getValue) {
        db.get('NoteList').push(newData).write()
    } else if (getValue) {
        db.get('NoteList').find({ _id: winId }).assign({ title }).write()
    }
    // db.get('NoteList').find({ _id: winId }).update('title', title)
    // const webContents = event.sender
    // const win = BrowserWindow.fromWebContents(webContents)
    // win.setTitle(title)
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