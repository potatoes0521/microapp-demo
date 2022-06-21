/*
 * @LastEditors: 
 * @Description: 路由拦截
 * @Date: 2022-02-25 11:17:04
 * @LastEditTime: 2022-06-16 10:11:47
 * @Author: 
 */
import router from './index';
import getPageTitle from '@/utils/get-page-title';
// import NProgress from 'nprogress'; // Progress 进度条
// import 'nprogress/nprogress.css'; // Progress 进度条样式
import { getCookie } from '@/utils/storage';
import { useUserStore } from '@/store/user';
import { checkHeartBeat } from '@/utils/cas';
import { whiteList } from './defaultRouter';
// 请不要删除 /login 路由

const title = useTitle();

router.beforeEach(async (to, from, next) => {
  console.log('🚀 > file: permission.js  > to, from www', to, from);
  title.value = getPageTitle(to.meta.title);
  // NProgress.start();
  const userStore = useUserStore();

  const token = getCookie('acToken', true);
  // if (from.path === to.path) {
  //   return next(false);
  // }
  if (token && to.path !== '/login' && !whiteList.includes(to.path)) {
    // 返回出现了问题没有qishi-xx
    const sysRouterPath = router.getRoutes().map((v) => v.path);
    // 如果没有qishi-xx 且不是主应用path
    if (!/\/qishi-.+/.test(to.fullPath) && !sysRouterPath.includes(to.path)) {
      // 在所有菜单里找到相同的哪一个吊东西
      const menu = userStore.allMenuList.find((v) => v.menuHref === to.path);
      console.log('🚀 > file: permission.js > line 29 > router.beforeEach > menu', menu);
      // 这个吊东西处理一下该走的路子
      const nextPath = `/qishi-${menu.ssCode}${to.fullPath}`;
      console.log('🚀 > file: permission.js > line 35 > router.beforeEach > nextPath', nextPath);
      // 走你
      next({
        path: nextPath,
        replace: true
      });
      return;
    }
    // 不得不加这个  是因为如果单点登录过来  子系统退出 这个时候本地有token 但是token都失效了   必须重新登录
    const res = await checkHeartBeat();
    // 判断心跳失败
    if (!res) {
      next(false);
      console.log('🚀 > file: permission.js > line 32 > router.beforeEach > 判断心跳失败', res);
      userStore.logout();
      return;
    }
    // console.log('🚀 > file: permission.js  > to, from', to);
    // 有无菜单权限
    if (userStore.menuList.length) {
      // console.log('🚀 > file: permission.js  > 有菜单');
      to.path === '/' ? next(userStore.defaultRouter) : next();
    } else {
      // 无菜单 去请求菜单
      // console.log('🚀 > file: permission.js  > 无菜单 去请求菜单');
      userStore.setUserInfo(to, next);
    }
  } else if (whiteList.includes(to.path)) {
    // 免登陆白名单 直接进入
    // console.log('🚀 > file: permission.js  > 免登陆白名单 直接进入');
    next();
  } else {
    // 没有登录 去登录
    // console.log('🚀 > file: permission.js  > 没有登录 去登录');
    next('/login');
  }
});

router.afterEach(() => {
  // finish progress bar
  // NProgress.done(); // 结束Progress
});
