<template>
  <div class="page-wrapper">
    <div>这是child1的page1</div>
    <button @click="$router.push('/child1-1-1')">跳转到 1-1</button>
    <input />
  </div>
</template>
<script>
export default {
  name: "Child1Page1",
};
</script>
<script setup></script>
<style scoped lang="scss"></style>
