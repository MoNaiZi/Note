import header from './modules/header'
import note from './modules/note'
import { createStore } from 'vuex'


export const store = createStore({
    modules: {
        header,
        note
    }
})


