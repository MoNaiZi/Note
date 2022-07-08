import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'
import router from './router/index'
import ElementPlus from 'element-plus'
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createNumberString } from '@/utils/index'
// import Datastore from 'lowdb'
// import FileSync from 'lowdb/adapters/FileSync'

const app = createApp(App)


// window.electronAPI.getList().then((list) => {
//     console.log('list', list)
// });


// const adapter = new FileSync('./db.json')

// const db = Datastore(adapter) // lowdb接管该文件
// const initDatabase = {
//     User: {},//放用户相关配置
//     NoteList: [] //标签
// }
// db.defaults(initDatabase).write()

app.config.globalProperties.$createdId = createNumberString

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.use(store)
app.mount('#app')
