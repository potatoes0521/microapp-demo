/*
 * @LastEditors: 
 * @Description: vuex
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2021-09-28 15:53:35
 * @Author: 
 */
import { createStore } from "vuex";
import getters from "./getters";

const modulesFiles = require.context("./modules", true, /\.js$/);

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

export default createStore({
  modules,
  getters,
});
