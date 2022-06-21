/*
 * @LastEditors: 
 * @Description: pinia状态管理
 * @Date: 2022-02-21 11:48:28
 * @LastEditTime: 2022-03-21 17:46:05
 * @Author: 
 */
// import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

export default pinia;
