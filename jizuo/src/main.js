/*
 * @LastEditors: 
 * @Description: 入口文件
 * @Date: 2022-03-02 16:00:21
 * @LastEditTime: 2022-04-15 10:53:30
 * @Author: 
 */
import App from './App.vue';
import router from './router/index';
import store from './store/index';

import 'virtual:windi.css';

// 引入公共css
import 'element-plus/dist/index.css';
import '@/styles/index.scss';

import '@/router/permission';
// i18n
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { createI18n } from 'vue-i18n';

import microApp from '@micro-zoe/micro-app';

import Call from '@/layout/components/Navbar/components/SoftPhone/utils/call.js';

console.log(window, 1);

microApp.start();

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages
});

const app = createApp(App);

app.use(router).use(store);

app.use(i18n);

app.use(Call);

app.mount('#appmain');
