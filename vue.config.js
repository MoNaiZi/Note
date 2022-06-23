module.exports = {
  transpileDependencies: ['vuetify'],
  // configureWebpack: config => {
  //   config.externals = {
  //     sqlite3: 'commonjs sqlite3'
  //   };
  //   if (process.env.NODE_ENV !== 'development') {
  //     config.optimization.minimizer[0].options.terserOptions.warnings = false;
  //     config.optimization.minimizer[0].options.terserOptions.compress = {
  //       warnings: false,
  //       drop_console: true,
  //       drop_debugger: true,
  //       pure_funcs: ['console.log']
  //     };
  //   }
  // },
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
    port: 55226
  }
};