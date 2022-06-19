export default {
    namespaced: true,
    state() {
        return {
            pageTypeText: 'home'
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
        }
    },
    mutations: {
        setPageTypeText(state, txt) {
            state.pageTypeText = txt
        }
    }
}


