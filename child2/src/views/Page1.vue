<template>
  <div class="page-wrapper">
    <div>这是child2的page1</div>
    <button @click="$router.push('/child2-1-1')">跳转到 1-1</button>
  </div>
</template>
<script>
export default {
  name: "Child2Page1",
};
</script>
<script setup></script>
<style scoped lang="scss"></style>
