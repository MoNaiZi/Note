import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'
import router from './router/index'
import ElementPlus from 'element-plus'
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import 'element-plus/dist/index.css'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createNumberString } from '@/utils'


const app = createApp(App)


app.config.globalProperties.$createdId = createNumberString

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
console.log('Icon', Icon)
// app.component('v-icon', Icon)
// app.use(Icon)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.use(store)
app.mount('#app')
