/*
 * @LastEditors: 
 * @Description: 静态路由-无需登录
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2022-04-01 15:58:42
 * @Author: 
 */
import Layout from "@/layout";
import _differenceBy from "lodash/differenceBy";

export const whiteList = ["/login", "/500", "/403"];

export const getDefaultRouter = (RouterList) => {
  const whiteListMap = whiteList.map((item) => ({
    path: item,
  }));
  const arr =
    _differenceBy([...RouterList], whiteListMap, "path").filter(
      (item) => !item.meta.hideInMenu
    )[0] || {};
  let defaultRouter = arr.path;
  if (arr.children) {
    defaultRouter = arr.children.filter((item) => !item.meta.hideInMenu)[0]
      .path;
  }
  return defaultRouter;
};

export const StaticRouterMap = [
  {
    path: "/login",
    name: "login",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/Login/index.vue"),
  },
  {
    path: "/500",
    name: "error_500",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/ErrorPage/500.vue"),
  },
  {
    path: "/404",
    name: "error_404",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/ErrorPage/404.vue"),
  },
  {
    path: "/403",
    name: "error_401",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/ErrorPage/403.vue"),
  },
  {
    path: "/redirect",
    component: Layout,
    name: "redirect",
    meta: {
      title: "重定向",
      keepAlive: true,
      icon: "md-home",
      hideInMenu: true,
      hideInBread: true,
    },
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/Redirect/index"),
      },
    ],
  },
];
