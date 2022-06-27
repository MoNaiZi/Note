import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createNumberString } from '@/utils'
import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
// import path from 'path'

const app = createApp(App)


// window.electronAPI.getList().then((list) => {
//     console.log('list', list)
// });


const adapter = new FileSync('./db.json')

const db = Datastore(adapter) // lowdb接管该文件
const initDatabase = {
    User: {},//放用户相关配置
    NoteList: [] //标签
}
db.defaults(initDatabase).write()

app.config.globalProperties.$createdId = createNumberString

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')
