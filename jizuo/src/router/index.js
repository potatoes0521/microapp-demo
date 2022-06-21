/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-02-21 11:48:28
 * @LastEditTime: 2022-06-21 11:04:23
 * @Author: 
 */
import { createRouter, createWebHistory } from 'vue-router';
import { getConfig } from '@/config/index';

export const routes = [
  {
    // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
    path: '/qishi-cas/:page*', // vue-router@4.x path的写法为：'/my-page/:page*'
    name: 'QishiCas',
    component: () => import('@/views/QishiCas.vue')
  },
  {
    // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
    path: '/qishi-wo/:page*', // vue-router@4.x path的写法为：'/my-page/:page*'
    name: 'QishiWo',
    component: () => import('@/views/QishiWo.vue')
  },
  {
    // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
    path: '/qishi-cc/:page*', // vue-router@4.x path的写法为：'/my-page/:page*'
    name: 'QishiCc',
    component: () => import('@/views/QishiCc.vue')
  },
  {
    // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
    path: '/qishi-bi/:page*', // vue-router@4.x path的写法为：'/my-page/:page*'
    name: 'QishiBi',
    component: () => import('@/views/QishiBi.vue')
  },
];

const router = createRouter({
  history: createWebHistory(getConfig('base')),
  routes
});

export default router;
