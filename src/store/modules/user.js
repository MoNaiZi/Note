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
        setUser(context, user) {
            context.commit('setUser', user)
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        }
    }
}