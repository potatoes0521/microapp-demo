/*
 * @LastEditors: liu yang
 * @Description: 入口文件
 * @Date: 2022-03-02 16:00:21
 * @LastEditTime: 2022-06-21 11:14:05
 * @Author:
 */
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import { createApp } from 'vue';
// 引入公共css

import '@/router/permission';

import microApp from '@micro-zoe/micro-app';

console.log(window, 1);

microApp.start();

const app = createApp(App);

app.use(router).use(store);

app.mount('#appmain');
