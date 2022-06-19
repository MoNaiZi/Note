import {
    createRouter,
    createMemoryHistory
} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/index')
    },
    {
        path: '/set',
        name: 'set',
        component: () => import('@/views/setting')
    }
]


export default createRouter({
    history: createMemoryHistory(),
    routes
})
