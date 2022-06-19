import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createNumberString } from '@/utils'


const app = createApp(App)

app.config.globalProperties.$createdId = createNumberString

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')
