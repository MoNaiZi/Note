const rm = require('rimraf');
const path = require('path');

// 删除作用只用于删除打包前的buildPath || dist_electron
// dist_electron是默认打包文件夹
rm(path.join(__dirname, `../../${'dist_electron'}`), () => { });
