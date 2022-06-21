<template>
  <el-config-provider :locale="localeData">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import en from 'element-plus/lib/locale/lang/en';
  // import Layout from '@/layout/index.vue';
  import { useSystemStore } from './store/system';
  import { useNav } from '@/layout/hooks/useNav';

  useNav();

  // const visibility = useDocumentVisibility();

  // watch(visibility, (current, previous) => {
  //   if (current === 'visible' && previous === 'hidden') {
  //     ElNotification({
  //       title: '你好',
  //       offset: 100,
  //       duration: 1000,
  //       message: h('i', { style: 'color: teal' }, '欢迎回来！！！')
  //     });
  //   }
  // });

  // import { getListAPI, test } from '@/api/modules/test';
  // import { testGetRoleById, testCreateUser } from '@/api/modules/mock';

  // 测试 - 取消重复请求 可删除
  // getListAPI();
  // getListAPI();
  // getListAPI();
  // test();
  // test();
  // 测试 - mock请求 可删除
  // testGetRoleById();
  // testCreateUser();

  // 初始化国际化语言 && elementplus组件语言
  const systemStore = useSystemStore();
  const { locale } = useI18n();
  systemStore.getI18n ? (locale.value = systemStore.getI18n) : systemStore.setI18n(locale.value);
  const localeData = computed(() => (locale.value === 'en' ? en : zhCn));
</script>

<style lang="scss"></style>
