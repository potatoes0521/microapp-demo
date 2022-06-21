/*
 * @LastEditors: liu yang
 * @Description: 静态路由-无需登录
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2022-06-21 15:13:48
 * @Author:
 */

export const StaticRouterMap = [
  {
    path: "/",
    redirect: "/child4-1",
  },
  {
    path: "/child4-1",
    name: "Child4Page1",
    meta: {
      keepAlive: true,
    },
    component: () => import("@/views/Page1.vue"),
  },
  {
    path: "/child4-1-1",
    name: "Child4Page1-1",
    meta: {
      keepAlive: true,
    },
    component: () => import("@/views/Page1-1.vue"),
  },
  {
    path: "/child4-2",
    name: "Child4Page2",
    meta: {
      keepAlive: true,
    },
    component: () => import("@/views/Page2.vue"),
  },
  {
    path: "/child4-2-1",
    name: "Child4Page2-1",
    meta: {
      keepAlive: true,
    },
    component: () => import("@/views/Page2-1.vue"),
  },
];