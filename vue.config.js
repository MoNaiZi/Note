const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        "fs": false,
      }
    },
    plugins: [
      new NodePolyfillPlugin()
    ]
  },
  chainWebpack: webpackConfig => {

  },
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    // Use this to change the entry point of your app's render process. default src/[main|index].[js|ts]
    rendererProcessFile: 'src/[background|on|mainProcess].js',
    electronBuilder: {
      nodeIntegration: true,
      preload: 'src/preload.js',
      builderOptions: {
        extraResources: ['src', 'src/res/'],
        productName: '便利贴',
        appId: '202274',
        copyright: 'zmy',
        compression: 'store',
        win: {
          icon: 'public/img/logo',
          target: ['nsis', 'zip']
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          allowElevation: true,
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: '便利贴' // 图标名称
        }
      },
      // externals: ['knex', 'sqlite3'],
    },
  },
  devServer: {
    port: 55226
  }
})