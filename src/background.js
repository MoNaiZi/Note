'use strict'

import { app, protocol, BrowserWindow, ipcMain, session, MessageChannelMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');
const mainProcess = require('./mainProcess')
import db from './server'

import('@/on')
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// ipcMain.on('set-title', mainProcess.windowsOn)


//此方法将在Electron完成后调用
//初始化并准备创建浏览器窗口。
//某些API只能在此事件发生后使用。
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

async function createWindow() {
  const mainWindows = mainProcess.mainWindows()
  const { config, winURL } = mainWindows
  const win = new BrowserWindow(config)

  await mainProcess.initDevTool(session)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(winURL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL(winURL)
  }
  win.on('closed', () => {
    console.log('主窗口关闭')
    app.exit()
  })
  global.mainWin = win


  const { port1, port2 } = new MessageChannelMain()
  //允许在另一端还没有注册监听器的情况下就通过通道向其发送消息 消息将排队等待，直到有一个监听器注册为止。
  port2.postMessage({ test: 21 })

  // 我们也可以接收来自渲染器主进程的消息。
  port2.on('message', (event) => {
    console.log('from renderer main world:', event)
  })

  port2.start()
  // 预加载脚本将接收此 IPC 消息并将端口
  // 传输到主进程。
  console.log('111111111')
  win.webContents.postMessage('main-world-port', null, [port1])

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('before-quit', event => {
  // event.preventDefault();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
