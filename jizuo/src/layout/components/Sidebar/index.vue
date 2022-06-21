<template>
  <div class="sidebar">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        class="sidebar-el-menu-vertical"
        :collapse="isCollapse"
        :router="false"
        :collapse-transition="true"
        @select="handleSelect"
      >
        <SidebarItem v-for="menu in menuList" :key="menu.path" :menu="menu" :base-path="menu.path"></SidebarItem>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
  // import { getConfig } from '@/config';
  import { useSidebar } from '../../hooks/useSidebar';
  import { useUserStore } from '@/store/user';
  import { routerPush } from '@/hooks/useMicro';
  import microApp from '@micro-zoe/micro-app';

  const { isCollapse } = useSidebar();

  const userStore = useUserStore();

  const menuList = computed(() => {
    return userStore.getMenuList;
  });

  const route = useRoute();
  // const routerPrefix = getConfig('routerPrefix');
  const activeMenu = ref(route.path);

  // 用户点击菜单时控制基座应用跳转
  const handleSelect = (indexPath, indexPathArr) => {
    // TODO: 暂时未考虑子项目 hash 路由
    console.log(indexPath, indexPathArr);
    // routerPush(indexPath);
  };

  // 根据url地址获取选中菜单
  const getActiveIndex = () => {
    // location.pathname的值通常为URL，我们只取`/qishi-cc/page2`
    const pathArr = window.location.pathname.match(/\/qishi-.+/);
    console.log(window.location.pathname, pathArr);
    activeMenu.value = pathArr ? pathArr[0].replace(/\/$/, '') : '/';
    console.log('getActiveIndex', window.location, pathArr, activeMenu.value);

    // 去除斜线后缀，如：/app-vue2/ 转换为 /app-vue2
    if (activeMenu.value !== '/') {
      activeMenu.value = activeMenu.value.replace(/\/$/, '');
    }

    return activeMenu.value;
  };
  // getActiveIndex();

  // window.addEventListener('popstate', () => getActiveIndex());

  // 全局数据监听，监听来自其它子应用页面跳转，控制侧边栏的菜单展示
  // 因为子应用之间无法直接通信，这里采用全局数据通信
  microApp.addGlobalDataListener((data) => {
    console.log('全局数据改变-触发menu项更改:', data);
    activeMenu.value = data ? data.path : getActiveIndex(data.path);
  });
</script>
<style scoped lang="scss">
  .sidebar {
    .sidebar-el-menu-vertical {
      @apply border-none;
    }
  }
</style>
<style>
  .sidebar-el-menu-vertical:not(.el-menu--collapse) {
    @apply w-50 border-none;
  }
</style>
