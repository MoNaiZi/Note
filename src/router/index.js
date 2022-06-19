import {
    createRouter,
    createWebHashHistory
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
    },
    {
        path: '/edited',
        name: 'edited',
        component: () => import('@/views/edited')
    }
]


export default createRouter({
    history: createWebHashHistory(), //createMemoryHistory(),
    routes
})
