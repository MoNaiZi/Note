export default {
    namespaced: true,
    state() {
        return {
            pageTypeText: 'menu',
            note: {},
            isEditedTitle: true,
            close: true,
            timing: ''
        }
    },
    getters: {
        getPageTypeText(state: any) {
            return state.pageTypeText
        }
    },
    actions: {
        setTiming(context: any, str: string) {
            context.commit('setTiming', str)
        },
        setPageTypeText(context: any, txt: string) {
            context.commit('setPageTypeText', txt)
        },
        setNote(context: any, note: object) {
            context.commit('setNote', note)
        },
        setIsEditedTitle(context: any, bool: object) {
            context.commit('setIsEditedTitle', bool)
        },
        setHeaderClose(context: any, bool: boolean) {
            context.commit('setHeaderClose', bool)
        }
    },
    mutations: {
        setTiming(state: any, str: string) {
            state.timing = str
        },
        setPageTypeText(state: any, txt: string) {
            state.pageTypeText = txt
        },
        setNote(state: any, note: object) {
            state.note = note
        },
        setIsEditedTitle(state: any, bool: boolean) {
            state.isEditedTitle = bool
        },
        setHeaderClose(state: any, bool: boolean) {
            state.close = bool
        }
    }
}


