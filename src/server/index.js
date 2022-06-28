import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import { app } from 'electron'

const STORE_PATH = app.getPath('userData') // 获取electron应用的用户目录
console.log('STORE_PATH', STORE_PATH)
const adapter = new FileSync(path.join(STORE_PATH, '/database.json')) // 初始化lowdb读写的json文件名以及存储路径

const db = Datastore(adapter) // lowdb接管该文件
const initDatabase = {
    User: {},//放用户相关配置
    NoteList: [] //标签
}
db.defaults(initDatabase).write()

// function initServer() {

// }


export default db