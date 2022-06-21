/*
 * @LastEditors: 
 * @description: 动态路由添加之前先对后端数据进行处理
 * @Date: 2021-03-09 17:33:57
 * @LastEditTime: 2022-06-01 15:11:32
 * @Author: 
 *
 * meta中额外参数
 * title: 显示在侧边栏、 面包屑和标签栏的文字
 * path: 路由的地址
 * name: 路由的name
 *   icon: (-) 该页面在左侧菜单、 面包屑和标签导航处显示的图标， 如果是自定义图标， 需要在图标名称前加下划线 '_'
 *   hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，
 *   hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *   keepAlive: (false) true是缓存 false是不缓存
 *   buttons: 页面内哪些模块显示
 *   sort: 2, 排序
 */
/**
 * 生成路由
 * @param {Array} routerList 格式化路由
 * @returns
 */
import router from './index.js';
import { listToTree } from '@/utils/tree';
import { getThisUserMenuTree, getPermFuncList } from '@/api/modules/this';
// import { PermissionRouter } from './modules/asyncRouter.js';
// import { hideInMenuRouter } from './modules/hideInMenuRouter.js';
import { setSession } from '@/utils/storage.js';

// import _differenceBy from 'lodash/differenceBy';
import { useUserStore } from '@/store/user.js';
import { getConfig } from '@/config/index.js';

export const handleMenuData = async (to, next) => {
  try {
    const {
      data: { funcList }
    } = await getPermFuncList();
    setSession('authList', funcList);
  } catch (err) {
    // console.log('[ err ] >', err);
  }
  // 记录路由获取状态
  getThisUserMenuTree() // 获取动态路由的方法
    .then(({ data: { menus } }) => {
      // menus = handleStorageSyncServe(menus);
      const asyncData = listToTree({
        list: menus,
        orderBy: 'menuOrder',
        needParent: true
      });
      // console.log('🚀 > file: addRouter.js > line 51 > .then > asyncData', asyncData);
      const asyncRouter = transformRouterData(asyncData); // 进行递归解析
      // 一定不能写在静态路由里面,否则会出现,访问动态路由404的情况.所以在这列添加
      // const lastAsyncRouter = [...asyncRouter, ...hideInMenuRouter];
      const userStore = useUserStore();
      userStore.setAllMenuList(menus);
      userStore.setMenuList(asyncRouter);
      if (next && to.path !== '/') {
        next({
          ...to,
          replace: true
        }); // hack方法 确保addRoute已完成
      } else {
        // 因为是一设备多用户登录出现问题
        router.replace('/');
      }
    })
    .catch((e) => {
      console.error('%c [ getThisUserMenuTree catch ]', 'font-size:13px; background:#F6504D; color:#fff;', e);
      // removeToken();
    });
};
const routerPrefix = getConfig('routerPrefix');
/**
 * 转换树形结构
 * @param {Array} routerList 已经转换成树形结构的数据
 * @return void
 */
export const transformRouterData = (routerList) => {
  // 按照父id分组
  const routers = [];
  routerList.forEach((e) => {
    let eNew = {
      path: e.menuHref || `/path${e.menuId}`,
      name: e.menuHref || `path${e.menuId}`
    };
    if (e.hrefType === 2) {
      let path = `${routerPrefix}-${e.ssCode}${e.menuHref || `/path${e.menuId}`}`;
      eNew.path = `/${path}`;
      eNew.name = path;
    }
    // 本系统
    // 其他外链
    if (e.hrefType === 3) {
      const comp = {
        path: '/iframepage',
        name: 'iframepage',
        meta: {
          hideInMenu: false,
          icon: '',
          keepAlive: false,
          title: 'iframe'
        },
        component: () => import('@/views/Iframe/index.vue')
      };
      eNew = {
        ...eNew,
        ...{ component: comp },
        path: `/iframepage${e.menuId}`,
        name: `/iframepage${e.menuId}`,
        meta: {
          uri: e.menuHref,
          title: e.menuName || '',
          icon: e.menuIcon || '',
          ...e
        }
      };
      if (e.menuPid === 0) {
        eNew = {
          ...{
            ...eNew,
            children: [
              {
                ...eNew
              }
            ]
          }
        };
      }
    }
    if (e.redirect) {
      eNew = {
        ...eNew,
        ...{
          redirect: e.redirect
        }
      };
    }
    eNew = {
      ...eNew,
      ...{
        meta: {
          ...e,
          ...eNew.meta,
          title: e.menuName || '',
          icon: e.menuIcon || ''
        }
      }
    };
    if (e.children) {
      eNew = {
        ...eNew,
        ...{
          children: transformRouterData(e.children)
        }
      };
    }

    routers.push(eNew);
  });
  return routers;
};

// function handleStorageSyncServe(serveRouter) {
//   // 先找出来所有的子路由
//   const childrenRouter = serveRouter.filter((item) => item.menuHref).map((item) => ({ ...item, path: item.menuHref }));

//   const urlOpenSystem = serveRouter.filter((item) => item.menuHref && item.menuHref.startsWith('http'));
//   // 找到子路由合并本地出来不同路由
//   const diffRouter = _differenceBy(childrenRouter, [], 'path');
//   const needSaveDiffRouter = _differenceBy(serveRouter, diffRouter, 'menuId');

//   // for循环
//   return [...needSaveDiffRouter, ...urlOpenSystem];
// }
