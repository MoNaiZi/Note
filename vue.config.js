module.exports = {
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        extraResources: ['src', 'src/res/'],
      },
      externals: ['knex', 'sqlite3'],
    },
  },
  devServer: {
    port: 55225
  }
};