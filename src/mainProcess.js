const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

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
    const winURL = isDevelopment ? 'http://localhost:55226' : `file://${__dirname}/index.html`;
    console.log('isDevelopment', isDevelopment)
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


module.exports = {
    mainWindows,
    initDevTool
}