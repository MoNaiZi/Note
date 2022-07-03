const path = require('path')
global.isDevelopment = process.env.NODE_ENV !== 'production'

const webPreferences = {
    // preload: path.join(__dirname, 'preload.js'),
    enableRemoteModule: true,
    nodeIntegration: true,
    contextIsolation: false,

}

function mainWindows() {
    let config = {
        width: 350,
        height: 600,
        minWidth: 250,
        minHeight: 48,
        frame: false,
        webPreferences
    }
    const winURL = global.isDevelopment ? 'http://localhost:55226' : `file://${__dirname}/index.html`;

    return { config, winURL }
}

async function initDevTool(session) {
    // const result = await session.defaultSession.removeExtension('nhdogjmejiglipccpnnnanhbledajbpd')
    // console.log('result', result)
    // const getVueDevTool = await session.defaultSession.getExtension('nhdogjmejiglipccpnnnanhbledajbpd')
    // if (!getVueDevTool) {
    //     await session.defaultSession.loadExtension(
    //         'C:/Users/JIEKE/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/6.1.4_0',
    //         { allowFileAccess: true } // this is the key line
    //     )
    // }
}

console.log('global.isDevelopment', global.isDevelopment)

function logo() {
    let imgPath = path.join(__dirname)
    // console.log('imgPath', imgPath)
    // console.log('22222222', path.join(__static, 'img/logo.png'))
    return path.join(__static, 'img/logo.png')
}


module.exports = {
    mainWindows,
    initDevTool,
    logo
}