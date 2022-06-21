<template>
  <div class="h-full" v-loading="loading">
    <micro-app
      name="qishi-cas"
      :url="cas"
      baseroute="/qishi-cas"
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

  const cas = getConfig('cas');

  const { microAppData } = useMicro();
  console.log('microAppData', microAppData);
  const loading = ref(false)

  const handleCreate = () => {
    log('基座：CAS 创建了');
    loading.value = true;
  };
  const handleBeforeMount = () => {
    log('基座：CAS 即将被渲染');
  };
  const handleMount = () => {
    log('基座：CAS 已经渲染完成');
    loading.value = false;
  };
  const afterhidden = () => {
    log('基座：CAS 已缓存，移除渲染');
  };
  const beforeshow = () => {
    log('基座：CAS 即将重新渲染，初始化时不执行');
    loading.value = true;
  };
  const aftershow = () => {
    log('基座：CAS 已经重新渲染，初始化时不执行');
    loading.value = false;
  };
  const handleError = () => {
    log('基座：CAS 加载出错了');
    loading.value = false;
  };
  const handleDataChange = (e) => {
    log('基座：CAS 子项目派发事件', e);
    const { event, data } = e.detail.data;
    unifiedEventhandle(event, data);
  };
</script>
<style lang="scss">
  micro-app,
  micro-app-body {
    height: 100%;
  }
</style>
