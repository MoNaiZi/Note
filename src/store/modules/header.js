export default {
    namespaced: true,
    state() {
        return {
            pageTypeText: 'home',
            winId: '',
            title: ''
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
        },
        setTitle(context, title) {
            context.commit('setTitle', title)
        }
    },
    mutations: {
        setPageTypeText(state, txt) {
            state.pageTypeText = txt
        },
        setWinId(state, id) {
            state.winId = id
        },
        setTitle(state, title) {
            state.title = title
        }
    }
}


