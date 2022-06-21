<template>
  <div>
    <div>这是主站菜单</div>
    <div style="display: flex">
      <div v-for="i in menu" :key="i.value" style="cursor: pointer; margin-left: 10px; border: 1px solid; padding: 5px" @click="handleClickMenuItem(i.value)">
        {{ i.label }}
      </div>
    </div>
    <br />
    <div>子应用</div>
    <router-view></router-view>
  </div>
</template>

<script setup>
  import { routerPush } from '@/hooks/useMicro';

  const menu = [
    { label: 'child1 page1', value: '/qishi-wo/child1-1' },
    { label: 'child1 page2', value: '/qishi-wo/child1-2' },
    { label: 'child2 page1', value: '/qishi-bi/child2-1' },
    { label: 'child2 page2', value: '/qishi-bi/child2-2' },
    // { label: 'child3 page1', value: '/qishi-cc/child3-1' },
    // { label: 'child3 page2', value: '/qishi-cc/child3-2' },
    { label: 'child4 page1', value: '/qishi-cas/child4-1' },
    { label: 'child4 page2', value: '/qishi-cas/child4-2' }
  ];
  function handleClickMenuItem(path) {
    console.log('🚀 > file: App.vue > line 27 > handleClickMenuItem > path', path);
    routerPush(path);
  }
</script>

<style lang="scss"></style>
