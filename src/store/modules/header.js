export default {
    namespaced: true,
    state() {
        return {
            pageTypeText: 'menu',
            note: {},
            isEditedTitle: true,
            close: true,
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
        },
        setIsEditedTitle(context, bool) {
            context.commit('setIsEditedTitle', bool)
        },
        setHeaderClose(context, bool) {
            context.commit('setHeaderClose', bool)
        }
    },
    mutations: {
        setPageTypeText(state, txt) {
            state.pageTypeText = txt
        },
        setNote(state, note) {
            state.note = note
        },
        setIsEditedTitle(state, bool) {
            state.isEditedTitle = bool
        },
        setHeaderClose(state, bool) {
            state.close = bool
        }
    }
}


