
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

function fromNow(time) {
    if (!time) {
        return ''
    }
    // time必须是毫秒
    var curTime = (new Date()).getTime()
    var diff = curTime - time //time.getTime()

    if (0 > diff) {
        return "几秒前";
    } else if (1000 * 60 > diff) {
        return "刚刚";
    } else if (1000 * 60 <= diff && 1000 * 60 * 60 > diff) {
        return parseInt(diff / (1000 * 60)) + "分钟前";
    } else if (1000 * 60 * 60 <= diff && 1000 * 60 * 60 * 24 > diff) {
        return parseInt(diff / (1000 * 60 * 60)) + "小时前";
    } else if (1000 * 60 * 60 * 24 <= diff && 1000 * 60 * 60 * 24 * 30 > diff) {
        return parseInt(diff / (1000 * 60 * 60 * 24)) + "天前";
    } else if (1000 * 60 * 60 * 24 * 30 <= diff && 1000 * 60 * 60 * 24 * 30 * 12 > diff) {
        return parseInt(diff / (1000 * 60 * 60 * 24 * 30)) + "月前";
    } else {
        return parseInt(diff / (1000 * 60 * 60 * 24 * 30 * 12)) + "年前";
    }
}


const getQueryByName = (name) => {
    const queryNameRegex = new RegExp(`[?&]${name}=([^&]*)(&|$)`);
    const queryNameMatch = window.location.hash.match(queryNameRegex);
    return queryNameMatch ? decodeURIComponent(queryNameMatch[1]) : "";
};

const logo = 'D:/A_Project/electron/Note/public/img/logo.png'

module.exports = {
    createNumberString,
    fromNow,
    getQueryByName,
    logo
}