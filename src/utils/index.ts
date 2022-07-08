
//生成id
export const createRandomString = function (length: number, possibleString?: string): string {
    let text = ''
    const possible = possibleString || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}

export const createNumberString = function (length: number = 8): string {
    return createRandomString(length)
}

export const fromNow = function (time: number): string {
    if (!time) {
        return ''
    }
    // time必须是毫秒
    const curTime = (new Date()).getTime()
    const diff: any = curTime - time //time.getTime()
    const division = function (number: number): number {
        return parseInt((number).toString(), 10);
    }
    if (0 > diff) {
        return "几秒前";
    } else if (1000 * 60 > diff) {
        return "刚刚";
    } else if (1000 * 60 <= diff && 1000 * 60 * 60 > diff) {
        return division(diff / (1000 * 60)) + "分钟前";
    } else if (1000 * 60 * 60 <= diff && 1000 * 60 * 60 * 24 > diff) {
        return division(diff / (1000 * 60 * 60)) + "小时前";
    } else if (1000 * 60 * 60 * 24 <= diff && 1000 * 60 * 60 * 24 * 30 > diff) {
        return division(diff / (1000 * 60 * 60 * 24)) + "天前";
    } else if (1000 * 60 * 60 * 24 * 30 <= diff && 1000 * 60 * 60 * 24 * 30 * 12 > diff) {
        return division(diff / (1000 * 60 * 60 * 24 * 30)) + "月前";
    } else {
        return division(diff / (1000 * 60 * 60 * 24 * 30 * 12)) + "年前";
    }
}


export const getQueryByName = (name: string): string => {
    const queryNameRegex = new RegExp(`[?&]${name}=([^&]*)(&|$)`);
    const queryNameMatch = window.location.hash.match(queryNameRegex);
    return queryNameMatch ? decodeURIComponent(queryNameMatch[1]) : "";
};



// module.exports = {
//     createNumberString,
//     fromNow,
//     getQueryByName
// }