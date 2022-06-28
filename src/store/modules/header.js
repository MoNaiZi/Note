export default {
    namespaced: true,
    state() {
        return {
            pageTypeText: 'home',
            note: {}
        }
    },
    getters: {
        getPageTypeText(state) {
            return state.pageTypeText
        }
    },
    actions: {
        setPageTypeText(context, txt) {
            context.commit('setPageTypeText', txt)
        },
        setNote(context, note) {
            context.commit('setNote', note)
        }
    },
    mutations: {
        setPageTypeText(state, txt) {
            state.pageTypeText = txt
        },
        setNote(state, note) {
            state.note = note
        }
    }
}


