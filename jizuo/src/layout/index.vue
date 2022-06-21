<template>
  <div class="app-wrapper w-full min-h-screen relative">
    <div v-if="systemStore.layout === 'default'" class="w-full">
      <div class="fixed-header relative inset-y-0 inset-x-0 z-100 w-full">
        <Navbar />
      </div>
      <div class="main-container w-full flex bg-[var(--xx-secondary-bg-color)] z-0" :style="mainContainerStyle">
        <Sidebar v-if="!isChildSystem" class="sidebar-container h-full bg-[var(--xx-bg-color)]" :menu-list="menuList" />
        <div ref="contentRegionRefs" class="content-container w-full h-[calc(100vh-54px)] overflow-hidden bg-[var(--xx-secondary-bg-color)]">
          <Tabs class="w-full h-38px bg-[var(--xx-bg-color)] border-l-[var(--xx-secondary-bg-color)] border-l-1 box-border" />
          <Panel class="w-full h-[calc(100%-38px)] p-5 box-border overflow-x-hidden overflow-y-auto" :is-child-system="isChildSystem" />
        </div>
      </div>
    </div>
    <div v-if="systemStore.layout === 'fullScreen'" class="w-full h-screen">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup>
  // import { storeToRefs } from 'pinia' // 解构
  import { heartBeat } from '@/api/modules/this';
  import { getCookie } from '@/utils/storage';
  import { createUniqueCode } from '@/utils/uniqueCode';
  import { useLayout } from './hooks/useLayout';
  import { useTabs } from './hooks/useTabs';
  import { useSystemStore } from '../store/system';

  const { contentRegionRefs } = useTabs();

  const { isChildSystem, mainContainerStyle, menuList } = useLayout();

  const systemStore = useSystemStore();

  /**
   * @Author: 
   * @Date: 2022-03-23 13:44:55
   * @description: 心跳函数
   * @param {*}
   * @return {*}
   */
  function heartBeatA() {
    const token = getCookie('acToken', true);
    const fp = createUniqueCode();
    // console.log('🚀 > file: index.vue > line 28 > heartBeatA > 一次心跳');
    heartBeat({
      accessToken: token,
      fp
    });
  }

  heartBeatA();

  let timer = null;

  /**
   * @Author: 
   * @Date: 2022-03-23 13:45:12
   * @description: 模拟定时器
   * @param {*} func
   * @param {*} wait
   * @return {*}
   */
  function interval(func, wait) {
    function interv() {
      func.call(null);
      timer = setTimeout(interv, wait);
    }
    timer = setTimeout(interv, wait);
  }

  onMounted(() => {
    interval(heartBeatA, 60000);
  });

  onUnmounted(() => {
    clearTimeout(timer);
  });
</script>
<style scoped lang="scss">
  .app-wrapper {
    .fixed-header,
    .main-container,
    .sidebar-container,
    .content-container > div {
      transition: var(--xx-transition-all);
    }
  }
</style>
