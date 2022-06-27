export default {
    namespaced: true,
    state() {
        return {
            list: [],
            item: {}
        }
    },
    getters: {
        getNoteList(state) {
            return state.list
        },
        getNoteItem(state) {
            return state.item
        }
    },
    actions: {
        setNoteList(context, list) {
            context.commit('setNoteList', list)
        },
        setNoteItem(context, item) {
            context.commit('setNoteItem', item)
        }
    },
    mutations: {
        setNoteList(state, list) {
            state.list = list
        },
        setNoteItem(state, item) {
            state.item = item
        },
    }
}


