/*
 * @LastEditors: liu yang
 * @Description: layout hooks
 * @Date: 2022-03-06 19:54:20
 * @LastEditTime: 2022-06-21 13:46:54
 * @Author: isboyjc
 */

import { useSystemStore } from '@/store/system.js';
import { getConfig } from '@/config/index.js';
import { routes } from '@/router/index.js';

export function useLayout() {
  const systemStore = useSystemStore();
  // collapse
  const isCollapse = computed({
    get() {
      return systemStore.getSidebarCollapse;
    },
    set() {
      systemStore.toggleSidebar();
    }
  });

  const isChildSystem = ref(getConfig('isChildSystem'));

  const mainContainerStyle = computed(() => ({ height: isChildSystem.value ? '100vh' : 'calc(100vh - 54px)' }));

  const menuList = ref(routes);

  return {
    isCollapse,
    isChildSystem,
    menuList,
    mainContainerStyle
  };
}
