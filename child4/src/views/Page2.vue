<template>
  <div class="page-wrapper">
    <div>这是child4的page2</div>
    <button @click="$router.push('/child4-2-1')">跳转到 2-1</button>
  </div>
</template>
<script>
export default {
  name: "Child4Page2",
};
</script>
<script setup></script>
<style scoped lang="scss"></style>
