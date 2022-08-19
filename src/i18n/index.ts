import i18next from 'i18next'
const zh = {
    translation: {
        contextmenu: {
            isExpand: '打开节点',
            expand: '展开节点',
            delete: '删除节点',
            'delete-one': '删除单个节点',
            add: '新建子节点',
            'add-parent': '新建父节点',
            'add-sibling': '新建兄弟节点',
            'add-sibling-before': '在此之前新建兄弟节点',
            cut: '剪切',
            copy: '拷贝',
            paste: '粘贴',
            selectall: '全选',
            zoomin: '放大',
            zoomout: '缩小',
            zoomfit: '缩放至合适大小'
        }
    }
}

i18next.init({
    fallbackLng: 'zh',
    lng: 'zh',
    resources: {
        zh,
    }
})

export default i18next