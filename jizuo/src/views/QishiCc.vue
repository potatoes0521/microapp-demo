<template>
  <div v-loading="loading" class="h-full">
    <micro-app
      name="qishi-cc"
      :url="cc"
      baseroute="/qishi-cc"
      :data="microAppData"
      keep-alive
      @created="handleCreate"
      @beforemount="handleBeforeMount"
      @mounted="handleMount"
      @error="handleError"
      @afterhidden="afterhidden"
      @beforeshow="beforeshow"
      @aftershow="aftershow"
      @datachange="handleDataChange"
    ></micro-app>
  </div>
</template>
<script setup>
  // 该生命周期函数针对keepalive情况，无真正意义上的卸载回调
  // https://zeroing.jd.com/micro-app/docs.html#/zh-cn/keep-alive
  import useMicro, { unifiedEventhandle } from '@/hooks/useMicro';
  import { getConfig } from '@/config';
  import { log } from '@/utils/log';
  import { useNotify } from '@/layout/hooks/useNotify';

  const cc = getConfig('cc');

  const { microAppData } = useMicro();
  console.log('microAppData', microAppData);
  const loading = ref(false);

  const handleCreate = () => {
    log('基座：CC 创建了');
    loading.value = true;
  };
  const handleBeforeMount = () => {
    log('基座：CC 即将被渲染');
  };
  const handleMount = () => {
    log('基座：CC 已经渲染完成');
    loading.value = false;
  };
  const afterhidden = () => {
    log('基座：CC 已缓存，移除渲染');
  };
  const beforeshow = () => {
    log('基座：CC 即将重新渲染，初始化时不执行');
    loading.value = true;
  };
  const aftershow = () => {
    log('基座：CC 已经重新渲染，初始化时不执行');
    loading.value = false;
  };
  const handleError = () => {
    log('基座：CC 加载出错了');
    loading.value = false;
  };
  const handleDataChange = (e) => {
    log('基座：CC 子项目派发事件');
    const { event, data } = e.detail.data;

    if (event === 'notifyRefresh') {
      const { noticeCountFn } = useNotify();
      noticeCountFn();
    }

    unifiedEventhandle(event, data);
  };
</script>
<style lang="scss">
  micro-app,
  micro-app-body {
    height: 100%;
  }
</style>
