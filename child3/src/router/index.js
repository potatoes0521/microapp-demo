/*
 * @LastEditors:
 * @Description: 路由文件
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2022-04-07 15:16:05
 * @Author:
 */
import { createRouter, createWebHistory } from "vue-router";
import { StaticRouterMap } from "./modules/static";

const routes = [...StaticRouterMap];

export default createRouter({
  history: createWebHistory(
    window.__MICRO_APP_BASE_ROUTE__ || process.env.VUE_APP_PUBLIC_PATH
  ),
  scrollBehavior: () => ({
    top: 0,
  }),
  routes,
});
