const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const { defineConfig } = require('@vue/cli-service')
const webpackObfuscator = require('webpack-obfuscator');

const isProduction = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
  publicPath: isProduction ? './' : '/',
  productionSourceMap: false,
  configureWebpack: isProduction ? {
    resolve: {
      fallback: {
        "fs": false,
      }
    },
    plugins: [
      new NodePolyfillPlugin(),
      new webpackObfuscator({
        rotateStringArray: true,
      }, [])
    ]
  } : {},
  // chainWebpack: webpackConfig => {

  // },
  transpileDependencies: [/\bvue-awesome\b/],
  pluginOptions: {
    // Use this to change the entry point of your app's render process. default src/[main|index].[js|ts]
    rendererProcessFile: 'src/[background|on|mainProcess].ts',
    electronBuilder: {
      nodeIntegration: true,
      preload: 'src/preload.ts',
      builderOptions: {
        extraResources: ['src', 'src/res/'],
        productName: '便利贴',
        appId: '202274',
        copyright: 'zmy',
        compression: 'store',
        asar: true,
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