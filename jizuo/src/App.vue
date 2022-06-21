<template>
  <div>
    <div>这是主站菜单</div>
    <div style="display: flex">
      <div v-for="i in menu" :key="i.value" style="cursor: pointer; margin-left: 10px" @click="handleClickMenuItem(i.value)">{{ i.label }}</div>
    </div>
    <br />
    <div>子应用</div>
    <router-view></router-view>
  </div>
</template>

<script setup>
  import { routerPush } from '@/hooks/useMicro';

  const menu = [
    { label: 'child1 page1', value: '/qishi-wo/1' },
    { label: 'child1 page2', value: '/qishi-wo/2' },
    { label: 'child2 page1', value: '/qishi-bi/1' },
    { label: 'child2 page2', value: '/qishi-bi/2' },
    { label: 'child3 page1', value: '/qishi-cc/1' },
    { label: 'child3 page2', value: '/qishi-cc/2' },
    { label: 'child4 page1', value: '/qishi-cas/1' },
    { label: 'child4 page2', value: '/qishi-cas/2' }
  ];
  function handleClickMenuItem(path) {
    routerPush(path);
  }
</script>

<style lang="scss"></style>
