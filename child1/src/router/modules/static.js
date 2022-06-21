/*
 * @LastEditors: liu yang
 * @Description: 静态路由-无需登录
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2022-06-21 13:50:41
 * @Author:
 */

export const StaticRouterMap = [
  {
    path: "/",
    redirect: "/1",
  },
  {
    path: "/1",
    name: "Page1",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/Page1.vue"),
  },
  {
    path: "/1-1",
    name: "Page1-1",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/Page1-1.vue"),
  },
  {
    path: "/2",
    name: "Page2",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/Page2.vue"),
  },
  {
    path: "/2-1",
    name: "Page2-1",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/Page1-1.vue"),
  },
];
