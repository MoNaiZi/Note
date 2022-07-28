import {
    createRouter,
    createWebHashHistory,
    RouteRecordRaw
} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
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
        component: () => import('@/views/home.vue'),
        children: [
            {
                path: '',
                name: 'index',
                component: () => import('@/views/index.vue')
            },
            {
                path: '/set',
                name: 'set',
                component: () => import('@/views/setting.vue')
            },
            {
                path: '/edited',
                name: 'edited',
                component: () => import('@/views/edited.vue')
            },
            {
                path: '/outline',
                name: 'outline',
                component: () => import('@/views/outline.vue')
            },
        ]
    },
    {
        path: '/menu',
        name: 'menu',
        component: () => import('@/views/menu.vue')
    }
]


export default createRouter({
    history: createWebHashHistory(), //createMemoryHistory(),
    routes
})
