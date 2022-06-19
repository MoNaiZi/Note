
//生成id
function createRandomString(length, possibleString) {
    let text = ''
    const possible = possibleString || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}

function createNumberString(length = '8') {
    return createRandomString(length)
}

module.exports = {
    createNumberString
}