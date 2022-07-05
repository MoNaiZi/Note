import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

const routes = [
    // {
    //     path: '/',
    //     name: 'index',
    //     component: () => import('@/views/index')
    // },
    // {
    //     path: '/set',
    //     name: 'set',
    //     component: () => import('@/views/setting')
    // },
    // {
    //     path: '/edited',
    //     name: 'edited',
    //     component: () => import('@/views/edited')
    // },

    {
        path: '/',
        name: 'header',
        component: () => import('@/views/header'),
        children: [
            {
                path: '',
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
            },
        ]
    },
    {
        path: '/menu',
        name: 'menu',
        component: () => import('@/views/menu')
    }
]


export default createRouter({
    history: createWebHashHistory(), //createMemoryHistory(),
    routes
})
