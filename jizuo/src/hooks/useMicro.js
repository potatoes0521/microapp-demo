/*
 * @LastEditors: 
 * @Description: ...
 * @Date: 2022-04-06 18:28:04
 * @LastEditTime: 2022-06-02 14:18:48
 * @Author: 
 */
import microApp, { getActiveApps, unmountAllApps } from '@micro-zoe/micro-app';
import { useTabs } from '@/layout/hooks/useTabs';
import { useUserStore } from '@/store/user';
import { useSystemStore } from '@/store/system';
import { getCookie } from '@/utils/storage';
import router from '@/router/index';
import { isObject } from '@/utils/index';
import { logYellow } from '@/utils/log';

// parmas参数拼接
export function parseParams(uri, params) {
  const paramsArray = [];
  Object.keys(params).forEach((key) => params[key] && paramsArray.push(`${key}=${params[key]}`));
  if (uri.search(/\?/) === -1) {
    uri += `?${paramsArray.join('&')}`;
  } else {
    uri += `&${paramsArray.join('&')}`;
  }
  return uri;
}

// 路由跳转
export function routerPush(indexPath, params) {
  if (params && isObject(params)) indexPath = parseParams(indexPath, params);
  // 子应用名
  const appName = indexPath.replace('/', '').split('/')[0];
  /**
   * 当子应用还未渲染，通过基座控制路由跳转，子应用在初始化时会自己根据url渲染对应的页面
   * 当子应用已经渲染，则直接控制子应用进行内部跳转
   *
   * getActiveApps: 用于获取正在运行的子应用
   */
  logYellow(
    '当前子应用列表',
    `当前已加载子应用列表(未卸载): ${getActiveApps()}\n`,
    `当前运行中系统(正在运行): ${getActiveApps(true)}\n`,
    `当前将跳往系统 ${appName} ${getActiveApps().includes(appName) ? '已加载' : '未加载'}`
  );
  if (!getActiveApps().includes(appName)) {
    // const router = useRouter();
    // 主应用跳转
    logYellow('主应用跳转', `将跳往 ${appName} 页面`);
    // debugger;
    router.push(indexPath);
  } else {
    let childPath = null;
    // path的值形式如：/qishi-cas/page2，这里/qishi-cas是子应用的基础路由，/page2才是页面地址，所以我们需要将/qishi-cas部分删除
    childPath = indexPath.replace(/^\/qishi-[^/]+/, '');
    !childPath && (childPath = '/'); // 防止地址为空
    // 主应用通过下发data数据控制子应用跳转
    logYellow(`主应用控制跳转`, `将跳往 ${appName} 系统 ${childPath} 页面`);
    microApp.setData(appName, { event: 'routerPush', data: { path: childPath } });
  }
  microApp.setGlobalData({ name: appName, path: indexPath });
}

// 子系统派发事件统一处理函数
export function unifiedEventhandle(event, data) {
  const userStore = useUserStore();
  const systemStore = useSystemStore();
  const { addTabs, removeTabs } = useTabs();
  switch (event) {
    case 'subsystemLogout':
      console.log('unified - 系统退出', data);
      unmountAllApps({ clearAliveState: true })
        .then(() => {
          console.log('卸载所有子应用成功');
          if (data.ssCode !== 'www') {
            userStore.logout(data);
          }
        })
        .catch(() => {
          console.log('卸载所有子应用失败');
        });
      break;
    case 'addCachesTabs':
      console.log('unified - 添加缓存tabs', data);
      addTabs(data, true);
      break;
    // case 'fullScreen':
    //   console.log('unified - 全屏布局', data);
    //   systemStore.updateLayout('fullScreen');
    //   break;
    case 'removeCachesTabs':
      console.log('unified - 删除缓存tabs', data);
      removeTabs(data, true);
      break;
    default:
  }
}

export default function useMicro() {
  const token = getCookie('acToken', true);

  const microAppData = ref({
    wwwToken: token,
    msg: `来自基座给的Token！！！${+new Date()}`,
    router,
    getSys: () => getActiveApps(true)
  });

  return {
    microAppData
  };
}
