import { createApp, getCurrentInstance } from 'vue'
import App from './App.vue'
import { store } from './store'
import router from './router/index'
import ElementPlus from 'element-plus'
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import 'element-plus/dist/index.css'
import '@icon-park/vue-next/styles/index.css';

import { createNumberString } from '@/utils/index'


const app = createApp(App)

app.config.globalProperties.$createdId = createNumberString

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $createdId: typeof createNumberString
    }
}



app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.use(store)
app.mount('#app')
