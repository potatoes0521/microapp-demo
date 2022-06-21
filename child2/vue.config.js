/*
 * @LastEditors: liu yang
 * @Description: vue-cli配置文件
 * @Date: 2021-09-27 18:05:07
 * @LastEditTime: 2022-06-21 10:47:04
 * @Author:
 */
// 路径转换
const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
const packageName = require("./package.json").name;

// gzip压缩
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// lodash按需加载
// const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

// 不是开发环境
const NOT_DEV = ["fat", "uat", "pro"].includes(process.env.VUE_APP_MODE);
// 不是线上环境
const NOT_PRO = ["dev", "fat", "uat"].includes(process.env.VUE_APP_MODE);
module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  lintOnSave: NOT_PRO,
  // 设为false打包时不生成.map文件
  productionSourceMap: NOT_PRO,
  devServer: {
    open: true,
    port: process.env.VUE_APP_PORT,
    hotOnly: false,
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*", // 允许所有域名的脚本访问该资源
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));
  },
  // gzip
  configureWebpack: (config) => {
    const plugins = [];
    if (NOT_DEV) {
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }
    // End 生成 gzip 压缩文件
    config.plugins = [...config.plugins, ...plugins];
    config.output = Object.assign({}, config.output, {
      library: packageName,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_${packageName}`,
    });
  },
};
