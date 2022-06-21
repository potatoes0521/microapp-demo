<template>
  <div class="page-wrapper">
    <div>这是child1的1-1详情页面</div>
    <button @click="$router.go(-1)">返回到page1</button>
  </div>
</template>
<script>
export default {
  name: "Child1Page1-1",
};
</script>
<script setup></script>
<style scoped lang="scss"></style>
