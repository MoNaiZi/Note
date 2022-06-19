export default {
    namespaced: true,
    state() {
        return {
            pageTypeText: 'home',
            winId: ''
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
        setWinId(context, id) {
            context.commit('setWinId', id)
        }
    },
    mutations: {
        setPageTypeText(state, txt) {
            state.pageTypeText = txt
        },
        setWinId(state, id) {
            state.winId = id
        }
    }
}


