import { ipcMain, BrowserWindow, Menu, Tray, screen, app } from 'electron'
const mainProcess = require('./mainProcess')
const dayjs = require('dayjs')
import db from './server'
import { logo } from '@/utils'

app.whenReady().then(() => {
    setInterval(() => {
        let currentTimeStamp = dayjs().valueOf()

        let list = db.get('NoteList').filter(item => {
            if (item.timinGtimeStamp < currentTimeStamp && item.timingStatus === 0) {

                return { _id: item._id }
            }
        }).value() || []
        let idList = []
        for (let item of list) {
            idList.push(item._id)
            db.get('NoteList').find({ _id: item._id }).assign({ timingStatus: 1 }).write()
        }
        console.log('轮询', list)
        if (idList.length) {
            suspensionWin(idList)
        }


    }, 2000);
})

ipcMain.on('closeSuspensionWin', (event, id) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    db.get('NoteList').find({ _id: id }).assign({ timing: '' }).write()
    win.close()
})

ipcMain.on('openEditeWindow', (event, id) => {


})

ipcMain.on('updateNote', (event, item) => {
    let _id = item._id
    db.get('NoteList').find({ _id }).assign(item).write()
})

ipcMain.on('addWH', (event, { w, h }, open) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    let bounds = win.getBounds()
    if (open) {
        bounds.x = bounds.x - w
        bounds.y = bounds.y - h
        bounds.width = bounds.width + w
        bounds.height = bounds.height + h
    } else {
        bounds.x = bounds.x + w
        bounds.y = bounds.y + h
        bounds.width = bounds.width - w
        bounds.height = bounds.height - h
    }
    console.log('bounds', bounds)
    win.setBounds(bounds)
})

ipcMain.on('windowMoving', (event, { mouseX, mouseY, width, height }) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    const { x, y } = screen.getCursorScreenPoint()
    // win.setPosition(x - mouseX, y - mouseY)
    win.setBounds({ x: x - mouseX, y: y - mouseY, width, height })
});



const suspensionWin = function (idList) {
    const mainWindows = mainProcess.mainWindows()
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const { winURL } = mainWindows
    let win = new BrowserWindow({
        frame: false,
        transparent: true,
        width: 100,
        height: 100,
        x: width - 100,
        y: height - 100,
        resizable: false,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        skipTaskbar: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    screen.on('display-metrics-changed', (event, display, changedMetrics) => {
        console.log('display', display)
        const { x, y, width, height } = display.workArea;
        win.setBounds({ x: width - 100, y: height - 100, width: 500, height: 500 })
    });
    let url = `${winURL}/#/menu?winIdList=${JSON.stringify(idList)}`
    win.loadURL(url)
    return win
}

// ipcMain.on('newMenu', (event, WHObj) => {

// })


ipcMain.handle('theme', (event, temp) => {
    // nativeTheme.themeSource = 'dark'
    // return nativeTheme.shouldUseDarkColors
})


const getNoteList = function (page = 1, pageSiz = 20) {
    let list = db.get('NoteList').orderBy('timeStamp', 'desc').value()
    let result = []
    for (let item of list) {
        if (item.isTopping) {
            result.unshift(item)
        } else {
            result.push(item)
        }
    }
    return result
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

ipcMain.handle('noteTopping', (_event, winId) => {
    const value = db.get('NoteList').find({ _id: winId }).value()
    value.isTopping = !value.isTopping ? true : false
    db.get('NoteList').remove({ _id: winId }).write()
    db.get('NoteList').unshift(value).write()
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
    tempOjb.timeStamp = dayjs().valueOf()
    tempOjb.time = dayjs().format('YYYY-MM-DD HH:mm')
    if (!getValue) {
        db.get('NoteList').unshift(tempOjb).write()
    } else if (getValue) {
        db.get('NoteList').find({ _id: winId }).assign(tempOjb).write()
    }
    let list = getNoteList()
    global.mainWin.webContents.send('getEdited', list)
})

ipcMain.on('minimize', (event) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.minimize()
})

ipcMain.on('newWindow', async (event, winId, pageType) => {
    const mainWindows = mainProcess.mainWindows()
    const { config, winURL } = mainWindows
    let newOjb = {
        width: 700,
        height: 500,
        minWidth: 200,
        minHeight: 100,
        frame: false
    }
    newOjb = Object.assign(config, newOjb)

    let win = new BrowserWindow(newOjb)
    let url = `${winURL}/#/edited?winId=${winId}&skipPageType=${pageType}`
    win.setIcon(logo)
    win.loadURL(url)
})



// ipcMain.on('windowOpen', (event) => {
//     const webContents = event.sender

//     console.log('url', 2222222222)
//     webContents.setWindowOpenHandler(({ url }) => {
//         console.log('url', url)
//         if (url === 'about:blank') {
//             return {
//                 action: 'allow',
//                 overrideBrowserWindowOptions: {
//                     frame: false,
//                     fullscreenable: false,
//                     backgroundColor: 'black',
//                     webPreferences: {
//                         preload: 'my-child-window-preload-script.js'
//                     }
//                 }
//             }
//         }
//         return { action: 'deny' }
//     })
// })

ipcMain.on('topping', (event, isTopping) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setAlwaysOnTop(isTopping)
})

ipcMain.on('closeWindow', async (event, id) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setSkipTaskbar(true)
    if (!id) {
        if (!global.isMenu) {
            const tray = new Tray(logo);
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
            tray.on('click', () => {
                console.log('win.isVisible()', win.isVisible())
                win.isVisible() ? win.show() : win.hide()
            });
            // suspensionWin()
            global.isMenu = true
        }

        win.minimize()
        return
    }
    win.close()

})