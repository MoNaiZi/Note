import {
    createRouter,
    createMemoryHistory
} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/index')
    }
]


export default createRouter({
    history: createMemoryHistory(),
    routes
})
