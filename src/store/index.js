import header from './modules/header'
import note from './modules/note'
import user from './modules/user'
import { createStore } from 'vuex'


export const store = createStore({
    modules: {
        header,
        note,
        user
    }
})


