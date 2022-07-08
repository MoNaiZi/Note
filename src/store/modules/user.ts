export default {
    namespaced: true,
    state() {
        return {
            user: {
                dark: false,
                startUp: true
            }
        }
    },
    actions: {
        setUser(context: any, user: string) {
            context.commit('setUser', user)
        }
    },
    mutations: {
        setUser(state: any, user: string) {
            state.user = user
        }
    }
}