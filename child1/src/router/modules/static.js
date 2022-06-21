/*
 * @LastEditors: liu yang
 * @Description: 静态路由-无需登录
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2022-06-21 14:46:28
 * @Author:
 */

export const StaticRouterMap = [
  {
    path: "/",
    redirect: "/child1-1",
  },
  {
    path: "/child1-1",
    name: "Page1",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/Page1.vue"),
  },
  {
    path: "/child1-1-1",
    name: "Page1-1",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/Page1-1.vue"),
  },
  {
    path: "/child1-2",
    name: "Page2",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/Page2.vue"),
  },
  {
    path: "/child1-2-1",
    name: "Page2-1",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/views/Page2-1.vue"),
  },
];
