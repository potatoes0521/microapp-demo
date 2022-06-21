/*
 * @LastEditors: 
 * @Description: 导航菜单tabs
 * @Date: 2022-03-22 18:40:57
 * @LastEditTime: 2022-06-20 10:26:42
 * @Author: 
 */
// import { emitter } from '@/utils/mitt';
import microApp, { unmountApp } from '@micro-zoe/micro-app';

export const useCachesTabsStore = defineStore(
  'cachesTabsStore',
  () => {
    const cachesTabs = ref([]);
    // 添加
    const addCachesTabs = (data) => {
      if (!(data?.id && data?.name)) return;
      console.log('🚀 > www file: tabs.js > line 17 > addCachesTabs > data', data);
      const some = cachesTabs.value.find((v) => v.id === data.id && v.path === data.path && v.ssCode === data.ssCode) || null;
      console.log('🚀 > file: tabs.js > line 20 > addCachesTabs > some', some);
      if (some && data.fullPath !== some.fullPath) {
        removeCachesTabs(some, false);
      } else if (some) {
        console.log('🚀 > file: tabs.js > line 24 > addCachesTabs > some return 不往下走', some);

        return;
      }
      // if (cachesTabs.value.length >= 20) return console.log('最多储存20个页面');
      console.log('🚀 > www file: tabs.js > line 23 > addCachesTabs > 添加catch成功', data);
      cachesTabs.value.push(data);
    };
    // 删除
    const removeCachesTabs = (data, checkSubSystem) => {
      console.log('🚀 > www file: tabs.js > line 25 > removeCachesTabs > data', data, cachesTabs.value);
      cachesTabs.value = cachesTabs.value.filter(
        (v) => !(v.id === data.id && v.path === data.path && v.ssCode === data.ssCode && data.fullPath === v.fullPath)
      );
      console.log('🚀 > www file: tabs.js > line 23 > addCachesTabs > 删除catch成功', data, cachesTabs.value);
      microApp.setData(`qishi-${data.ssCode}`, { event: 'deleteCacheTabs', data });
      if (!checkSubSystem) return;
      // tabs中无删除项所在系统，则删除系统
      if (cachesTabs.value.every((v) => v.ssCode !== data.ssCode)) {
        unmountApp(`qishi-${data.ssCode}`, { clearAliveState: true }).then(() => console.log('卸载成功'));
      }
      // console.log('removeCachesTabs end: ', cachesTabs.value);
    };

    return {
      cachesTabs,
      addCachesTabs,
      removeCachesTabs
    };
  }
  // {
  //   // 持久化
  //   persist: {
  //     enabled: true,
  //     storage: window.sessionStorage,
  //     paths: ['']
  //   }
  // }
);
