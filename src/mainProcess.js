const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

const webPreferences = {
    preload: path.join(__dirname, 'preload.js'),
    enableRemoteModule: true,
    nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
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
    const winURL = isDevelopment ? 'http://localhost:55225' : `file://${__dirname}/index.html`;
    return { config, winURL }
}

async function initDevTool(session) {
    const getVueDevTool = await session.defaultSession.getExtension('nhdogjmejiglipccpnnnanhbledajbpd')
    if (!getVueDevTool) {
        await session.defaultSession.loadExtension(
            'C:/Users/JIEKE/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/6.1.4_1',
            { allowFileAccess: true } // this is the key line
        )
    }
}


module.exports = {
    mainWindows,
    initDevTool
}