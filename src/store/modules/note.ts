export default {
    namespaced: true,
    state() {
        return {
            list: [],
            item: {}
        }
    },
    getters: {
        getNoteList(state: any) {
            return state.list
        },
        getNoteItem(state: any) {
            return state.item
        }
    },
    actions: {
        setNoteList(context: any, list: []) {
            context.commit('setNoteList', list)
        },
        setNoteItem(context: any, item: Object) {
            context.commit('setNoteItem', item)
        }
    },
    mutations: {
        setNoteList(state: any, list: []) {
            state.list = list
        },
        setNoteItem(state: any, item: object) {
            state.item = item
        },
    }
}


