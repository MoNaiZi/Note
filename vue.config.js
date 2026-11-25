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
  chainWebpack: config => {
    // TS 4.5 无法解析依赖库 .d.ts 中的新语法（如 lodash/element-plus，项目自身代码不受影响），
    // 排除 node_modules 的类型诊断，避免构建失败（与 skipLibCheck 意图一致）
    config.plugin('fork-ts-checker').tap(args => {
      const issue = args[0].issue || {}
      args[0].issue = {
        ...issue,
        exclude: [...(issue.exclude || []), { file: '**/node_modules/**' }]
      }
      return args
    })
  },
  transpileDependencies: [/\bvue-awesome\b/],
  pluginOptions: {
    // Use this to change the entry point of your app's render process. default src/[main|index].[js|ts]
    rendererProcessFile: 'src/[background|on|mainProcess].ts',
    electronBuilder: {
      nodeIntegration: true,
      preload: 'src/preload.ts',
      builderOptions: {
        // 使用本地已解压的 Electron（node_modules/electron/dist）打包，
        // 避免构建时从 GitHub 下载 88MB 的 electron zip（可离线构建）
        electronDist: 'node_modules/electron/dist',
        // 禁用发布（本地打包，不需要上传 GitHub；CI 环境下 electron-builder 会误尝试发布而报缺 GH_TOKEN）
        publish: null,
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