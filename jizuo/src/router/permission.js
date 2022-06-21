/*
 * @LastEditors: liu yang
 * @Description: 路由拦截
 * @Date: 2022-02-25 11:17:04
 * @LastEditTime: 2022-06-21 11:14:54
 * @Author:
 */
import router from './index';

router.beforeEach(async (to, from, next) => {
  console.log('🚀 > file: permission.js  > to, from www', to, from);
  next();
});
