/*
 * @LastEditors: 
 * @Description: menu tabs 缓存组件
 * @Date: 2022-03-29 15:39:07
 * @LastEditTime: 2022-06-13 13:47:19
 * @Author: 
 */
import config from "@/config";

const state = {
  cachesTabs: [],
};
const mutations = {
  UP_CACHESTABS(state, { mode, data }) {
    switch (mode) {
      case "add": {
        if (config.isChildSystem && window.microApp)
          window.microApp.dispatch({
            event: "addCachesTabs",
            data: { ...data, ssCode: config.appCode },
          });
        const some = state.cachesTabs.find(
          (v) =>
            v.id === data.id && v.path === data.path && v.ssCode === data.ssCode
        );
        if (some && data.fullPath !== some.fullPath) {
          const delIndex = state.cachesTabs.findIndex(
            (v) =>
              v.id === data.id &&
              v.path === data.path &&
              v.ssCode === data.ssCode
          );
          delIndex !== -1 && state.cachesTabs.splice(delIndex, 1);
          return;
        } else if (some) {
          return;
        }
        state.cachesTabs.push(data);
        break;
      }
      case "delete": {
        // eslint-disable-next-line no-case-declarations
        const delIndex = state.cachesTabs.findIndex(
          (v) =>
            v.id === data.id && v.path === data.path && v.ssCode === data.ssCode
        );
        delIndex !== -1 && state.cachesTabs.splice(delIndex, 1);
        break;
      }
    }
  },
};
const getters = {
  getCachesTabs(state) {
    return state.cachesTabs;
  },
};
const actions = {
  addCachesTabs({ commit }, data) {
    commit("UP_CACHESTABS", { mode: "add", data });
  },
  deleteCachesTabs({ commit }, data) {
    commit("UP_CACHESTABS", { mode: "delete", data });
  },
};

export default {
  // namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
