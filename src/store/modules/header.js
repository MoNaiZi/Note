export default {
    namespaced: true,
    state() {
        return {
            pageTypeText: 'home',
            note: {},
            isEditedTitle: true
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
        }
    }
}


