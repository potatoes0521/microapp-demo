/*
 * @LastEditors: 
 * @Description: ...
 * @Date: 2022-02-21 11:48:28
 * @LastEditTime: 2022-06-15 16:59:10
 * @Author: 
 */
import { createRouter, createWebHistory } from 'vue-router';
import { getConfig } from '@/config/index';

export const routes = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    // redirect: '/home',
    children: [
      // {
      //   path: '/home',
      //   name: 'Home',
      //   meta: {},
      //   component: () => import('@/views/Home.vue')
      // },
      // {
      //   path: '/about',
      //   name: 'About',
      //   meta: {},
      //   component: () => import('@/views/About.vue')
      // },
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
      {
        // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
        path: '/qishi-wiki/:page*', // vue-router@4.x path的写法为：'/my-page/:page*'
        name: 'QishiWiki',
        component: () => import('@/views/QishiWiki.vue')
      },
      {
        // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
        path: '/qishi-lk/:page*', // vue-router@4.x path的写法为：'/my-page/:page*'
        name: 'QishiLk',
        component: () => import('@/views/QishiLk.vue')
      },
      {
        // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
        path: '/qishi-et/:page*', // vue-router@4.x path的写法为：'/my-page/:page*'
        name: 'QishiEt',
        component: () => import('@/views/QishiEt.vue')
      },
      {
        // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
        path: '/qishi-ss/:page*', // vue-router@4.x path的写法为：'/my-page/:page*'
        name: 'QishiSs',
        component: () => import('@/views/QishiSs.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {},
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/sso',
    name: 'SSO',
    meta: {},
    component: () => import('@/views/SSO/index.vue')
  }
];

const router = createRouter({
  history: createWebHistory(getConfig('base')),
  routes
});

export default router;
