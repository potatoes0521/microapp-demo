<template>
  <div class="page-wrapper">
    <div>这是child4的page1</div>
    <button @click="$router.push('/child4-1-1')">跳转到 1-1</button>
  </div>
</template>
<script>
export default {
  name: "Child4Page1",
};
</script>
<script setup></script>
<style scoped lang="scss"></style>
