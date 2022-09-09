const path = require('path')
global.isDevelopment = process.env.NODE_ENV !== 'production'

const webPreferences = {
    // preload: path.join(__dirname, 'preload.js'),
    enableRemoteModule: true,
    nodeIntegration: true,
    contextIsolation: false,

}

function mainWindows() {
    const config = {
        width: 350,
        height: 600,
        minWidth: 250,
        minHeight: 48,
        frame: false,
        transparent: true,
        webPreferences
    }
    const winURL = global.isDevelopment ? 'http://localhost:55226' : `file://${__dirname}/index.html`;

    return { config, winURL }
}

async function initDevTool(session: any) {
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
declare const __static: string;
function logo() {
    const imgPath = path.join(__dirname)
    // console.log('imgPath', imgPath)
    // console.log('22222222', path.join(__static, 'img/logo.png'))
    return path.join(__static, 'img/logo.png')
}



module.exports = {
    mainWindows,
    initDevTool,
    logo
}

// function __static(__static: any, arg1: string) {
//     throw new Error("Function not implemented.");
// }
