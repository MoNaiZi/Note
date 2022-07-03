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
      },
      externals: ['knex', 'sqlite3'],
    },
  },
  devServer: {
    port: 55226
  }
})