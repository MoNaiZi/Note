export default {
    namespaced: true,
    state() {
        return {
            user: {
                dark: false,
                startUp: true,
                pageSize: 10
            }
        }
    },
    actions: {
        setUser(context: any, user: string) {
            context.commit('setUser', user)
        }
    },
    mutations: {
        setUser(state: any, user: any) {
            if (!user.pageSize) {
                user.pageSize = 10
            }
            state.user = user
        }
    }
}